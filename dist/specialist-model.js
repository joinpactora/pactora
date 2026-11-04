import * as T from './vendor/three.module.js';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';

// Patch is an original procedural character. No reference model or face image
// is copied. All visible details, including the eyes and smile, are geometry.
export function createSpecialist({detail=1}={}){
  const root=new T.Group();root.name='Patch_Recovery_Specialist';
  root.userData={author:'RelayWorks',version:'2.0',description:'Original articulated recovery specialist and checkpoint cartridge'};
  const character=new T.Group();character.name='Patch_character';root.add(character);
  const deck=new T.Group();deck.name='Patch_service_deck';root.add(deck);
  const m={
    shell:new T.MeshPhysicalMaterial({color:'#f1eee5',metalness:.08,roughness:.28,clearcoat:.65,clearcoatRoughness:.27}),
    orange:new T.MeshPhysicalMaterial({color:'#ef6b3f',metalness:.14,roughness:.3,clearcoat:.5}),
    orangeLight:new T.MeshStandardMaterial({color:'#ffad74',roughness:.35,metalness:.2}),
    dark:new T.MeshStandardMaterial({color:'#272e2d',roughness:.3,metalness:.7}),
    rubber:new T.MeshStandardMaterial({color:'#303331',roughness:.8}),
    metal:new T.MeshStandardMaterial({color:'#b5bfc0',roughness:.24,metalness:.93}),
    face:new T.MeshPhysicalMaterial({color:'#142323',roughness:.22,metalness:.22,clearcoat:1,clearcoatRoughness:.18}),
    eye:new T.MeshBasicMaterial({color:'#ccf4dc'}),
    green:new T.MeshStandardMaterial({color:'#6c9b7b',roughness:.4,metalness:.2,emissive:'#3a6540',emissiveIntensity:.15}),
    amber:new T.MeshStandardMaterial({color:'#f79955',roughness:.35,emissive:'#e96026',emissiveIntensity:.15}),
    glass:new T.MeshPhysicalMaterial({color:'#f4f8f1',roughness:.13,transmission:.87,thickness:.18,ior:1.46,clearcoat:1,transparent:true,depthWrite:false}),
    deck:new T.MeshStandardMaterial({color:'#d9d8cc',roughness:.65,metalness:.15})
  };
  const refs={character,deck,legs:[],arms:[],eyes:[],chips:[],chipLamps:[],head:null,cartridge:null,body:null,glass:null};
  const cache=new Map();
  function rounded(w,h,d,r){const key=[w,h,d,r].join(',');if(!cache.has(key))cache.set(key,new RoundedBoxGeometry(w,h,d,detail?3:2,r));return cache.get(key)}
  function mesh(geo,mat,parent=character,name=''){const o=new T.Mesh(geo,mat);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
  function box(w,h,d,mat,x,y,z,parent=character,r=.05,name=''){const o=mesh(rounded(w,h,d,r),mat,parent,name);o.position.set(x,y,z);return o}
  function cylinder(r,h,mat,x,y,z,parent=character,axis='y',segments=32){const o=mesh(new T.CylinderGeometry(r,r,h,segments),mat,parent);o.position.set(x,y,z);if(axis==='x')o.rotation.z=Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o}
  function ball(r,mat,x,y,z,parent=character,name=''){const o=mesh(new T.SphereGeometry(r,detail?32:20,detail?20:12),mat,parent,name);o.position.set(x,y,z);return o}
  function ring(r,t,mat,x,y,z,parent=character,axis='y'){const o=mesh(new T.TorusGeometry(r,t,detail?12:8,detail?80:48),mat,parent);o.position.set(x,y,z);if(axis==='y')o.rotation.x=Math.PI/2;if(axis==='x')o.rotation.y=Math.PI/2;return o}
  function bolt(x,y,z,parent,size=.032){cylinder(size*1.4,.015,m.metal,x,y,z,parent,'z',20);cylinder(size,.021,m.dark,x,y,z+.008,parent,'z',6)}
  // A stable circular service deck gives the character a physical home.
  cylinder(1.73,.15,m.deck,0,-1.49,0,deck,'y',detail?100:64);
  cylinder(1.60,.055,m.shell,0,-1.385,0,deck,'y',detail?100:64);
  ring(1.64,.028,m.orange,0,-1.40,0,deck);
  cylinder(1.49,.019,m.dark,0,-1.346,0,deck,'y',detail?100:64);
  cylinder(1.46,.023,m.shell,0,-1.33,0,deck,'y',detail?100:64);
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const mark=box(.055,.008,.18,m.metal,Math.sin(a)*1.42,-1.311,Math.cos(a)*1.42,deck,.01,'Deck_index');mark.rotation.y=a}
  for(const side of [-1,1]){
    const x=side*.45,leg=new T.Group();leg.name=side<0?'Patch_leg_left':'Patch_leg_right';character.add(leg);
    const upper=mesh(new T.CylinderGeometry(.18,.15,1,24),m.shell,leg,'Thigh');
    const knee=ball(.17,m.metal,x,-.64,-.02,leg,'Knee');
    const lower=mesh(new T.CylinderGeometry(.13,.13,1,24),m.dark,leg,'Shin');
    const boot=new T.Group();boot.name=side<0?'Patch_boot_left':'Patch_boot_right';leg.add(boot);
    box(.64,.31,1.02,m.orange,0,0,.18,boot,.14,'Stability_boot');
    box(.57,.09,.96,m.rubber,0,-.18,.18,boot,.04,'Boot_sole');
    box(.46,.035,.42,m.shell,0,.164,.29,boot,.015,'Boot_cap');
    ring(.15,.023,m.metal,0,.20,-.02,boot);
    refs.legs.push({side,upper,knee,lower,boot});
  }
  const body=new T.Group();body.name='Patch_body';character.add(body);refs.body=body;
  box(1.38,1.24,.94,m.orange,0,.32,0,body,.24,'Cast_body_shell');
  box(1.12,.09,.76,m.dark,0,-.30,0,body,.04,'Body_underside');
  box(.77,.62,.08,m.shell,0,.45,.48,body,.13,'Chest_panel');
  box(.63,.48,.025,m.deck,0,.45,.531,body,.1,'Chest_inlay');
  // Paired handoff arrows are made from actual metal pieces.
  for(const s of [-1,1]){
    const arrow=new T.Group();arrow.position.set(0,.45,.555);arrow.rotation.z=s<0?Math.PI:0;body.add(arrow);
    box(.30,.04,.035,m.orange,-.015,.075,0,arrow,.014,'Relay_mark_stroke');
    const tip=box(.13,.04,.035,m.orange,.115,.033,0,arrow,.012,'Relay_mark_tip');tip.rotation.z=Math.PI/4;
  }
  for(const x of [-.47,.47])for(const y of [.05,.69])bolt(x,y,.44,body,.027);
  for(let i=0;i<5;i++)box(.30,.028,.025,m.dark,.35,-.12+i*.055,.452,body,.009,'Body_vent');
  cylinder(.25,.17,m.dark,0,1.02,0,body);ring(.25,.025,m.metal,0,1.08,0,body);
  const head=new T.Group();head.name='Patch_head';head.position.set(0,1.76,.015);body.add(head);refs.head=head;
  box(1.77,1.38,1.18,m.shell,0,0,0,head,.25,'Ceramic_head_shell');
  box(1.56,1.11,.08,m.metal,0,-.015,.570,head,.21,'Face_bezel');
  box(1.45,1.00,.085,m.face,0,-.015,.625,head,.195,'Smoked_face_display');
  for(const x of [-.31,.31]){
    const eye=new T.Group();eye.position.set(x,.05,.681);head.add(eye);eye.name=x<0?'Patch_eye_left':'Patch_eye_right';
    box(.18,.29,.028,m.eye,0,0,0,eye,.075,'Eye_light');refs.eyes.push(eye);
  }
  const smileCurve=new T.CatmullRomCurve3([new T.Vector3(-.19,-.19,.683),new T.Vector3(-.10,-.235,.687),new T.Vector3(0,-.25,.688),new T.Vector3(.10,-.235,.687),new T.Vector3(.19,-.19,.683)]);
  mesh(new T.TubeGeometry(smileCurve,24,.018,8,false),m.eye,head,'Geometric_smile');
  box(.16,.025,.018,m.orange,.49,-.32,.675,head,.007,'Face_serial_mark');
  for(const side of [-1,1]){
    cylinder(.28,.16,m.dark,side*.89,0,0,head,'x');cylinder(.23,.22,m.orange,side*.93,0,0,head,'x');ring(.18,.025,m.metal,side*1.05,0,0,head,'x');
    for(let k=0;k<4;k++)box(.02,.065,.22,m.dark,side*.872,-.18+k*.12,-.27,head,.007,'Side_grille');
    bolt(side*.69,-.48,.52,head,.025);
  }
  cylinder(.045,.25,m.dark,0,.80,-.12,head);ball(.09,m.orange,0,.95,-.12,head,'Antenna_tip');ring(.055,.012,m.metal,0,.72,-.12,head);
  box(.75,.10,.035,m.dark,0,.17,-.602,head,.04,'Rear_service_slot');
  for(let k=0;k<5;k++)box(.04,.28,.025,m.metal,-.20+k*.10,-.16,-.607,head,.009,'Rear_heat_fin');
  // Articulated arms use named joints and independently poseable links.
  for(const side of [-1,1]){
    const arm=new T.Group();arm.name=side<0?'Patch_arm_left':'Patch_arm_right';body.add(arm);
    const shoulder=ball(.22,m.metal,side*.83,.66,0,arm,'Shoulder');
    cylinder(.17,.16,m.orange,side*.92,.66,0,arm,'x');
    const upper=mesh(new T.CylinderGeometry(.115,.14,1,detail?24:16),m.shell,arm,'Upper_arm');
    const elbow=ball(.15,m.dark,0,0,0,arm,'Elbow');
    const lower=mesh(new T.CylinderGeometry(.11,.13,1,detail?24:16),m.orange,arm,'Forearm');
    const hand=new T.Group();hand.name=side<0?'Patch_hand_left':'Patch_hand_right';arm.add(hand);
    box(.29,.20,.33,m.shell,0,0,0,hand,.07,'Palm');
    for(let i=0;i<3;i++){box(.055,.13,.23,m.dark,side*.06,-.085,(i-1)*.09+.10,hand,.025,'Finger');box(.06,.07,.08,m.metal,side*.07,-.13,(i-1)*.09+.17,hand,.02,'Finger_pad')}
    refs.arms.push({side,shoulder,upper,elbow,lower,hand});
  }
  const cartridge=new T.Group();cartridge.name='Recovery_checkpoint';body.add(cartridge);refs.cartridge=cartridge;
  box(1.92,.12,.56,m.dark,0,-.22,0,cartridge,.045,'Checkpoint_base');
  const glass=box(1.89,.47,.52,m.glass,0,.035,0,cartridge,.09,'Checkpoint_glass');glass.castShadow=false;glass.renderOrder=4;refs.glass=glass;
  for(let i=0;i<10;i++){
    const x=-.77+i*.17,mat=(i<7?m.dark:m.orange).clone();
    refs.chips.push(box(.13,.30,.29,mat,x,.035,0,cartridge,.035,'Checkpoint_unit_'+i));
    box(.07,.012,.15,m.metal,x,.19,0,cartridge,.004,'Unit_contact');
    refs.chipLamps.push(box(.035,.035,.014,i<7?m.green:m.amber,x,.055,.155,cartridge,.008,'Unit_status'));
  }
  for(const side of [-1,1]){box(.09,.53,.57,m.metal,side*.98,.015,0,cartridge,.035,'Checkpoint_cap');bolt(side*.98,-.13,.29,cartridge,.023)}
  poseSpecialist({root,refs,materials:m},{stage:0,time:0});root.updateMatrixWorld(true);
  return {root,refs,materials:m};
}
const Y=new T.Vector3(0,1,0);
function link(mesh,a,b){const delta=b.clone().sub(a);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(Y,delta.clone().normalize());mesh.scale.y=delta.length()}
export function poseSpecialist(model,{stage=0,phase=0,time=0,lookX=0,lookY=0,inspection=0,action=null}={}){
  const {refs,materials}=model,t=time;
  const p=action||{};
  const crouch=p.crouch||0,walk=p.walk||0,stride=p.stride||0,repair=p.repair??(stage===2?1:0),salute=p.salute||0;
  refs.character.position.set(p.x||0,(p.y||0)+Math.abs(Math.sin(stride))*walk*.06,0);
  refs.character.rotation.set(p.lean||0,p.yaw||0,(p.roll||0)+Math.sin(stride)*walk*.035);
  refs.body.position.y=Math.sin(t*.9)*.012-crouch*.29;
  refs.body.rotation.x=(p.bodyTilt||0)+crouch*.12;
  refs.head.position.y=1.76+inspection*.14;
  refs.head.rotation.set((p.headTilt??(stage===2?.15:stage===3?-.07:0))+lookY*.11,(p.headYaw||0)+lookX*.18,(p.headRoll??(stage===1?-.07:stage===3?.055:0))+Math.sin(t*.6)*.015);
  const blink=t%5.8;const openness=blink>5.45&&blink<5.65?.12:1;
  refs.eyes.forEach((e,i)=>{e.scale.y=openness*(stage===3?.83:1);e.rotation.z=stage===3?(i?-.09:.09):0});
  const lift=stage===1?.10:stage===3?.15:0;
  refs.cartridge.position.set(p.cartridgeX||0,p.cartridgeY??(.33+lift),p.cartridgeZ??(1.08+inspection*.20));refs.cartridge.rotation.set(p.cartridgeTilt??(stage===2?-.10:0),p.cartridgeYaw??(stage===1?.08:0),Math.sin(t*.7)*.015);
  refs.glass.position.y=.035+(p.open||0)*.28;refs.glass.position.z=-(p.open||0)*.38;refs.glass.rotation.x=(p.open||0)*1.35;
  for(const leg of refs.legs){
    const s=leg.side,cycle=stride+(s<0?Math.PI:0),z=Math.sin(cycle)*walk*.35,liftFoot=Math.max(0,Math.cos(cycle))*walk*.20;
    const a=new T.Vector3(s*.45,-.25-crouch*.29,0),b=new T.Vector3(s*(.45+crouch*.13),-.67-crouch*.10,.02+crouch*.18+z*.5),c=new T.Vector3(s*.45,-1.12+liftFoot,.02+z);
    link(leg.upper,a,b);leg.knee.position.copy(b);link(leg.lower,b,c);leg.boot.position.copy(c);leg.boot.rotation.x=-z*.3;
  }
  for(const arm of refs.arms){
    const s=arm.side,a=new T.Vector3(s*.86,.66,0),c=new T.Vector3(s*1.02+refs.cartridge.position.x,refs.cartridge.position.y-.09,refs.cartridge.position.z),b=new T.Vector3(s*1.26,(.66+c.y)*.5-.20,.40);
    if(s>0){c.lerp(new T.Vector3(.55+Math.sin(t*4)*.20,.83+Math.sin(t*6)*.08,1.31),repair);b.lerp(new T.Vector3(1.25,.49,.65),repair);c.lerp(new T.Vector3(1.20,1.82,.3),salute);b.lerp(new T.Vector3(1.5,1.1,.12),salute)}
    link(arm.upper,a,b);arm.elbow.position.copy(b);link(arm.lower,b,c);arm.hand.position.copy(c);arm.hand.rotation.set(-repair*.35,0,s*-.10+salute*.5);
  }
  for(let i=0;i<10;i++){
    refs.chips[i].position.y=.035+(i>=7?(p.open||0)*(.12+Math.sin(t*3+i)*.035):0);refs.chips[i].rotation.y=i>=7?(p.open||0)*Math.sin(t*2+i)*.12:0;
    if(i>=7){const recovered=action?(p.recovered||0)>(i-7)/3+.1:stage===3||(stage===2&&phase>(i-7)/3+.16);refs.chips[i].material.color.set(recovered?'#6c9b7b':'#ef6b3f');refs.chipLamps[i].material=recovered?materials.green:materials.amber}
  }
}
export function specialistAnimation(model){
  const q=[];for(const r of [[0,0,0],[.13,-.08,-.06],[.13,.07,0],[-.08,0,.05],[0,0,0]]){const quaternion=new T.Quaternion().setFromEuler(new T.Euler(...r));q.push(...quaternion.toArray())}
  const head=new T.QuaternionKeyframeTrack('Patch_head.quaternion',[0,2,4,6,8],q);
  const transfer=new T.VectorKeyframeTrack('Recovery_checkpoint.position',[0,2,5,7,8],[0,.33,1.08,0,.43,1.08,0,.33,1.08,0,.48,1.08,0,.33,1.08]);
  return new T.AnimationClip('Patch_checkpoint_recovery',8,[head,transfer]);
}
