import * as T from './vendor/three.module.js';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';

// Original geometry shared by the real-time scene and the downloadable GLB.
export function createRelayModel({detail=1}={}) {
  const root=new T.Group();root.name='RelayWorks_Engine_002';
  root.userData={author:'RelayWorks',version:'2.0',description:'Original checkpoint transfer mechanism'};
  const materials={
    orange:new T.MeshPhysicalMaterial({color:'#ee642e',roughness:.31,metalness:.08,clearcoat:.5,clearcoatRoughness:.25}),
    orangeLight:new T.MeshStandardMaterial({color:'#ff9a57',roughness:.39,metalness:.1}),
    graphite:new T.MeshStandardMaterial({color:'#262d2c',roughness:.29,metalness:.65}),
    rubber:new T.MeshStandardMaterial({color:'#252a28',roughness:.78,metalness:.02}),
    aluminum:new T.MeshStandardMaterial({color:'#aeb8b6',roughness:.23,metalness:.94}),
    ivory:new T.MeshStandardMaterial({color:'#ece8df',roughness:.6,metalness:.14}),
    ceramic:new T.MeshStandardMaterial({color:'#f5f1e9',roughness:.3,metalness:.16}),
    green:new T.MeshStandardMaterial({color:'#587f62',roughness:.4,metalness:.2,emissive:'#304b30',emissiveIntensity:.15}),
    amber:new T.MeshStandardMaterial({color:'#ffb45f',roughness:.3,emissive:'#fa7327',emissiveIntensity:.35}),
    glass:new T.MeshPhysicalMaterial({color:'#eff5f0',roughness:.16,transmission:.88,thickness:.28,ior:1.46,transparent:true,clearcoat:1,attenuationColor:new T.Color('#d5e7df'),attenuationDistance:3,depthWrite:false})
  };
  const refs={rotors:[],dataBlocks:[],dataLights:[],dockLights:[],left:null,right:null,cartridge:null,collars:[]};
  const cache=new Map();
  function round(w,h,d,r=.06){const k=[w,h,d,r].join(',');if(!cache.has(k))cache.set(k,new RoundedBoxGeometry(w,h,d,detail?3:2,r));return cache.get(k)}
  function mesh(geo,mat,parent=root,name=''){const m=new T.Mesh(geo,mat);m.name=name;m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
  function box(w,h,d,mat,x,y,z,parent=root,r=.06,name=''){const m=mesh(round(w,h,d,r),mat,parent,name);m.position.set(x,y,z);return m}
  function cylinder(rad,h,mat,x,y,z,parent=root,axis='y',segments=32){const m=mesh(new T.CylinderGeometry(rad,rad,h,segments,1),mat,parent);m.position.set(x,y,z);if(axis==='x')m.rotation.z=Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;return m}
  function torus(rad,tube,mat,x,y,z,parent=root,arc=Math.PI*2,axis='z'){const m=mesh(new T.TorusGeometry(rad,tube,detail?16:10,detail?100:64,arc),mat,parent);m.position.set(x,y,z);if(axis==='x')m.rotation.y=Math.PI/2;return m}
  function bolt(x,y,z,parent,scale=1){const g=new T.Group();g.name='Hex_socket_fastener';g.position.set(x,y,z);cylinder(.075*scale,.024*scale,materials.aluminum,0,0,0,g,'z',24);cylinder(.048*scale,.027*scale,materials.graphite,0,0,.018*scale,g,'z',6);cylinder(.021*scale,.029*scale,materials.rubber,0,0,.032*scale,g,'z',6);parent.add(g);return g}
  function cable(points,rad,mat,name){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));mesh(new T.TubeGeometry(curve,70,rad,12,false),mat,root,name);return curve}
  function gate(cx,cz,side){
    const g=new T.Group();g.name=side<0?'Source_gate':'Recovery_gate';g.position.set(cx,0,cz);root.add(g);
    box(2.8,.27,2.1,materials.ivory,0,-1.31,0,g,.1,'Ceramic_plinth');
    box(2.52,.08,1.91,materials.aluminum,0,-1.15,0,g,.04,'Machined_base_plate');
    box(2.34,.045,1.71,materials.ceramic,0,-1.09,0,g,.025,'Recessed_deck');
    for(const x of [-.98,.98])for(const z of [-.69,.69])box(.28,.12,.28,materials.rubber,x,-1.49,z,g,.04,'Isolation_foot');
    for(const z of [-.65,.65])box(1.92,.014,.023,materials.graphite,0,-1.061,z,g,.006,'Deck_groove');
    const hoop=new T.Group();hoop.name='Cast_orange_gate';hoop.position.set(0,.34,0);g.add(hoop);
    const arc=Math.PI*2-1.08;
    const main=torus(1.19,.215,materials.orange,0,0,0,hoop,arc);main.rotation.z=.54+(side>0?Math.PI:0);
    const inner=torus(1.19,.023,materials.orangeLight,0,0,.202,hoop,arc);inner.rotation.z=main.rotation.z;
    for(const a of [.54,.54+arc]){const aa=a+(side>0?Math.PI:0),x=Math.cos(aa)*1.19,y=Math.sin(aa)*1.19;const cap=cylinder(.217,.105,materials.graphite,x,y,0,hoop);cap.rotation.z=aa;const trim=cylinder(.224,.035,materials.aluminum,x,y,0,hoop);trim.rotation.z=aa}
    for(const a of [1.48,4.45]){const cover=torus(1.19,.231,materials.graphite,0,0,0,hoop,.24);cover.rotation.z=a-.12;bolt(Math.cos(a)*1.19,Math.sin(a)*1.19,.245,hoop,1.05)}
    box(.58,.21,.66,materials.graphite,0,-.99,0,g,.045,'Gate_mount');
    box(.91,.05,.81,materials.aluminum,0,-1.07,0,g,.025,'Gate_mount_flange');
    for(const x of [-.36,.36])bolt(x,-.98,.4,g,.75);
    box(1.15,.26,.055,materials.graphite,-.56,-1.30,1.06,g,.035,'Status_panel');
    for(let i=0;i<7;i++){const led=box(.055,.075,.02,i<5?materials.green:materials.amber,-.94+i*.115,-1.30,1.096,g,.012,'Status_LED_'+i);if(side>0)refs.dockLights.push(led)}
    for(const x of [-1.12,1.12])bolt(x,-1.30,1.075,g,.7);
    const rotor=new T.Group();rotor.name='Rotary_encoder';rotor.position.set(side*.86,-.82,.64);g.add(rotor);
    cylinder(.24,.12,materials.graphite,0,0,0,rotor,'z');cylinder(.175,.135,materials.aluminum,0,0,.025,rotor,'z');cylinder(.12,.14,materials.orange,0,0,.04,rotor,'z');
    for(let k=0;k<12;k++){const a=k/12*Math.PI*2;const tooth=box(.028,.065,.06,materials.aluminum,Math.cos(a)*.217,Math.sin(a)*.217,.015,rotor,.008,'Encoder_knurl');tooth.rotation.z=a-Math.PI/2}
    refs.rotors.push(rotor);
    box(.64,.78,.7,materials.graphite,side*.82,-.66,-.55,g,.08,'Receiver_housing');
    for(let k=0;k<6;k++)box(.49,.025,.77,materials.aluminum,side*.82,-.94+k*.108,-.55,g,.009,'Cooling_fin');
    refs[side<0?'left':'right']=g;
  }
  gate(-1.51,.08,-1);gate(1.51,-.23,1);
  for(const z of [.24,.76]){cylinder(.05,5.75,materials.aluminum,0,-.38,z,root,'x',24);for(const x of [-2.66,2.66]){box(.16,.52,.25,materials.graphite,x,-.72,z,root,.025,'Rail_support');cylinder(.09,.22,materials.aluminum,x,-.38,z,root,'x')}}
  const carriage=new T.Group();carriage.name='Checkpoint_cartridge';carriage.position.set(-.6,.30,.54);root.add(carriage);refs.cartridge=carriage;
  box(3.16,.085,.85,materials.graphite,0,-.55,0,carriage,.035,'Cartridge_sled');
  for(const x of [-1.26,1.26])for(const z of [-.26,.26])cylinder(.12,.18,materials.aluminum,x,-.60,z,carriage,'z',24);
  const cover=box(3.06,.73,.77,materials.glass,0,-.05,0,carriage,.12,'Frosted_glass_shell');cover.castShadow=false;cover.renderOrder=3;
  box(2.83,.055,.55,materials.aluminum,0,-.37,0,carriage,.018,'Internal_bus');
  for(let i=0;i<10;i++){
    const x=-1.205+i*.268,mat=(i<7?materials.graphite:materials.orange).clone();
    const chip=box(.208,.43,.43,mat,x,-.045,0,carriage,.044,'Data_unit_'+String(i+1).padStart(2,'0'));
    box(.108,.013,.24,materials.aluminum,x,.175,0,carriage,.004,'Unit_etch_'+i);
    const lamp=box(.045,.045,.022,i<7?materials.green:materials.amber,x,.055,.225,carriage,.009,'Unit_status_'+i);refs.dataBlocks.push(chip);refs.dataLights.push(lamp);
    for(const z of [-.19,.19])box(.045,.06,.04,materials.orangeLight,x,-.30,z,carriage,.006,'Contact_pad');
  }
  for(const side of [-1,1]){const cap=new T.Group();cap.name='Machined_end_cap';cap.position.x=side*1.58;carriage.add(cap);box(.17,.82,.88,materials.aluminum,0,-.05,0,cap,.065,'End_flange');box(.09,.65,.71,materials.graphite,side*.10,-.05,0,cap,.06,'Elastomer_seal');cylinder(.235,.19,materials.graphite,side*.22,-.05,0,cap,'x');for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5])bolt(0,Math.sin(a)*.30,-Math.cos(a)*.31,cap,.6);refs.collars.push(cap)}
  const incoming=cable([[-4.75,-1.18,1.1],[-4,-1.08,.65],[-3.42,-.14,.1],[-2.84,.28,-.02]],.09,materials.orange,'Incoming_tool_bus');
  cable([[2.78,.34,-.28],[3.40,.3,-.45],[3.95,-1.1,-.4],[4.8,-1.23,.3]],.085,materials.ivory,'Completed_work_bus');
  for(const x of [-2.86,2.85]){const z=x<0?-.02:-.28;cylinder(.19,.36,materials.graphite,x,.31,z,root,'x');for(let k=0;k<5;k++)torus(.19,.018,materials.aluminum,x+(k-2)*.058,.31,z,root,Math.PI*2,'x')}
  for(const [x,y,z] of [[-4.75,-1.18,1.1],[4.8,-1.23,.3]]){cylinder(.115,.20,materials.graphite,x,y,z,root,'x');cylinder(.12,.04,materials.aluminum,x-.08,y,z,root,'x')}
  for(let k=0;k<16;k++){const led=box(.07,.024,.075,k<11?materials.green:materials.amber,-2.4+k*.32,-1.055,.91,root,.012,'Path_indicator_'+k);refs.dockLights.push(led)}
  refs.pulse=mesh(new T.SphereGeometry(.10,20,12),materials.orangeLight,root,'Transfer_pulse');refs.incoming=incoming;
  root.updateMatrixWorld(true);return {root,refs,materials};
}
export function recoveryAnimation(model){const track=new T.VectorKeyframeTrack(model.refs.cartridge.name+'.position',[0,1.5,3.7,6.5,8],[-.6,.3,.54,-.6,.3,.54,-.15,.3,.54,.78,.3,.54,.78,.3,.54]);track.setInterpolation(T.InterpolateSmooth);return new T.AnimationClip('Checkpoint_recovery',8,[track])}
