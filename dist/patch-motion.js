import * as T from './vendor/three.module.js';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
import {createSpecialist,poseSpecialist} from './specialist-model.js';

export const MOTION_FRAMES=48;
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const ease=t=>t*t*(3-2*t),lerp=(a,b,t)=>a+(b-a)*t;
const keys=[
  {at:0,  x:-.18,yaw:-.30,crouch:.8,cartridgeY:-.10,cartridgeZ:.98,headTilt:.23,cameraX:3.9,cameraY:2.6,cameraZ:9,span:5.7},
  {at:.10,x:-.12,yaw:-.16,crouch:.45,cartridgeY:.25,cartridgeZ:1.12,headTilt:.16,cameraX:3.2,cameraY:2.4,cameraZ:9,span:5.6},
  {at:.22,x:0,yaw:.12,cartridgeY:.65,cartridgeZ:1.15,headTilt:-.08,cameraX:1.2,cameraY:2.15,cameraZ:9,span:5.55},
  {at:.29,x:-.40,yaw:.65,walk:1,cartridgeY:.55,cartridgeZ:1.13,headYaw:-.1,cameraX:2.2,cameraY:2.4,cameraZ:9,span:5.9},
  {at:.40,x:.38,yaw:.55,walk:1,cartridgeY:.56,cartridgeZ:1.13,headYaw:-.13,cameraX:4.4,cameraY:2.8,cameraZ:9,span:5.95},
  {at:.49,x:.18,yaw:-.20,cartridgeY:.42,cartridgeZ:1.17,headTilt:.10,cameraX:3.8,cameraY:2.9,cameraZ:9,span:5.7},
  {at:.57,x:0,yaw:-.24,bodyTilt:.07,open:1,repair:1,cartridgeY:.37,cartridgeZ:1.23,headTilt:.24,cameraX:1.5,cameraY:3.4,cameraZ:9,span:5.6},
  {at:.69,x:0,yaw:.04,bodyTilt:.07,open:1,repair:1,recovered:.60,cartridgeY:.37,cartridgeZ:1.23,headTilt:.24,cameraX:-2.1,cameraY:3.0,cameraZ:9,span:5.6},
  {at:.78,x:0,yaw:.05,recovered:1,cartridgeY:.55,cartridgeZ:1.14,headTilt:.06,cameraX:-2.7,cameraY:2.6,cameraZ:9,span:5.6},
  {at:.90,x:-.20,yaw:.10,recovered:1,receipt:.7,salute:.85,cartridgeY:.78,cartridgeZ:1.18,headTilt:-.09,headRoll:.06,cameraX:.4,cameraY:2.2,cameraZ:9,span:6.0},
  {at:1, x:-.20,yaw:-.08,recovered:1,receipt:1,salute:1,cartridgeY:.78,cartridgeZ:1.18,headTilt:-.10,headRoll:.06,cameraX:2.6,cameraY:2.5,cameraZ:9,span:6.15}
];
const defaults={x:0,y:0,yaw:0,lean:0,roll:0,crouch:0,walk:0,bodyTilt:0,headTilt:0,headYaw:0,headRoll:0,cartridgeY:.33,cartridgeZ:1.08,open:0,repair:0,recovered:0,receipt:0,salute:0,cameraX:3,cameraY:2.6,cameraZ:9,span:5.7};
export function sampleJourney(progress){
  const p=clamp(progress);let i=0;while(i<keys.length-2&&p>keys[i+1].at)i++;
  const a={...defaults,...keys[i]},b={...defaults,...keys[i+1]},f=ease(clamp((p-a.at)/(b.at-a.at))),value={};
  Object.keys(defaults).forEach(k=>value[k]=lerp(a[k],b[k],f));
  return {...value,progress:p,stage:Math.min(3,Math.floor(p*4)),phase:(p*4)%1,stride:(p-.25)*Math.PI*30,time:p*22};
}
export function createJourneyWorld({detail=1}={}){
  const root=new T.Group();root.name='Patch_scroll_recovery';
  const model=createSpecialist({detail});root.add(model.root);
  const props=new T.Group();props.name='Recovery_instruments';root.add(props);
  const pale=new T.MeshStandardMaterial({color:'#f2efdf',metalness:.25,roughness:.32});
  const dark=new T.MeshStandardMaterial({color:'#273b34',metalness:.45,roughness:.36});
  const orange=new T.MeshStandardMaterial({color:'#f28b56',roughness:.35,metalness:.2,emissive:'#e56c30',emissiveIntensity:.2});
  const green=new T.MeshStandardMaterial({color:'#a8d6ad',roughness:.38,metalness:.1,emissive:'#4f9464',emissiveIntensity:.12});
  function mesh(g,m,parent=props,name=''){const o=new T.Mesh(g,m);o.name=name;o.castShadow=true;parent.add(o);return o}
  const satellites=[];
  for(let i=0;i<3;i++){
    const satellite=new T.Group();satellite.name='Capability_node_'+i;props.add(satellite);
    const tile=mesh(new RoundedBoxGeometry(.38,.38,.16,2,.08),pale,satellite);
    mesh(new T.BoxGeometry(.16,.16,.035),orange,satellite).position.z=.1;
    satellites.push(satellite);
  }
  const scan=mesh(new T.TorusGeometry(1.61,.014,8,96),orange);scan.name='Verification_scan';scan.rotation.x=Math.PI/2;
  const orbit=mesh(new T.TorusGeometry(2.12,.012,8,120),dark);orbit.name='Continuity_orbit';orbit.rotation.x=Math.PI/2;orbit.position.y=-1.45;
  const receipt=new T.Group();receipt.name='Verified_recovery_receipt';props.add(receipt);
  mesh(new RoundedBoxGeometry(.78,1.12,.12,3,.075),pale,receipt,'Receipt_card');
  const check=new T.Group();check.position.set(0,.18,.08);receipt.add(check);
  const short=mesh(new RoundedBoxGeometry(.22,.07,.035,2,.02),green,check);short.position.set(-.11,-.04,0);short.rotation.z=-.7;
  const long=mesh(new RoundedBoxGeometry(.38,.07,.035,2,.02),green,check);long.position.set(.08,.01,0);long.rotation.z=.85;
  for(let i=0;i<3;i++)mesh(new T.BoxGeometry(.44-i*.06,.025,.025),dark,receipt).position.set(0,-.12-i*.11,.08);
  const sparks=[];
  for(let i=0;i<9;i++){const o=mesh(new T.OctahedronGeometry(.045,0),i%2?orange:green);o.name='Completion_particle_'+i;sparks.push(o)}
  const camera=new T.OrthographicCamera(-3,3,3,-3,.1,60);camera.name='Recovery_camera';
  return {root,model,props,satellites,scan,orbit,receipt,sparks,camera};
}
export function poseJourney(world,progress,{aspect=1,lookX=0,lookY=0,reduced=false}={}){
  const p=clamp(progress),a=sampleJourney(p),{model,camera}=world;
  poseSpecialist(model,{stage:a.stage,phase:a.phase,time:reduced?0:a.time,lookX:reduced?0:lookX,lookY:reduced?0:lookY,action:a});
  // The service deck stays in the workshop while the robot walks across it.
  model.refs.deck.rotation.y=p*.35;
  const match=Math.sin(clamp((p-.22)/.3)*Math.PI);
  world.satellites.forEach((o,i)=>{const angle=i*Math.PI*2/3+p*5;o.position.set(Math.sin(angle)*2.0,.55+Math.cos(angle)*.45,Math.cos(angle)*1.05-.35);o.rotation.set(.15,angle*.5,.12);o.scale.setScalar(.001+match*.95);o.visible=match>.01});
  const scan=clamp((p-.51)/.07)*(1-clamp((p-.78)/.06));
  world.scan.visible=scan>.01;world.scan.position.y=-.1+Math.sin((p-.51)*Math.PI*11)*.65;world.scan.scale.setScalar(scan*(.8+scan*.2));
  world.orbit.rotation.z=p*.9;
  world.receipt.visible=a.receipt>.01;world.receipt.position.set(1.55,.2+a.receipt*1.25,.20);world.receipt.rotation.set(-.06,-.12,.09*(1-a.receipt));world.receipt.scale.setScalar(Math.max(.001,a.receipt));
  world.sparks.forEach((o,i)=>{const angle=i*2.399,pop=clamp((p-.81)/.19);o.visible=pop>.01;o.position.set(Math.sin(angle)*(1.6+pop*.5),.8+Math.cos(angle*2)*.6+pop*.7,Math.cos(angle)*.8);o.rotation.set(p*5+i,p*7,i);o.scale.setScalar(Math.sin(pop*Math.PI*.7)*.85)});
  camera.position.set(a.cameraX,a.cameraY,a.cameraZ);camera.lookAt(0,.67,0);
  const span=a.span/Math.min(1,aspect),half=span/2;Object.assign(camera,{left:-half*aspect,right:half*aspect,top:half,bottom:-half});camera.updateProjectionMatrix();
  world.root.updateMatrixWorld(true);camera.updateMatrixWorld(true);
  return a;
}
