import * as T from './vendor/three.module.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {createJourneyWorld,poseJourney,sampleJourney,MOTION_FRAMES,clamp} from './patch-motion.js';
const frames=new Map(),pending=new Map();let activeLoads=0,queue=[];
const framePath=i=>'/assets/patch-motion/frame-'+String(i).padStart(3,'0')+'.webp';
function loadFrame(index,priority=false){
  if(frames.has(index))return Promise.resolve(frames.get(index));
  if(pending.has(index))return pending.get(index);
  const promise=new Promise(resolve=>{const job={index,resolve};priority?queue.unshift(job):queue.push(job)});pending.set(index,promise);pump();return promise;
}
function pump(){while(activeLoads<3&&queue.length){const {index,resolve}=queue.shift(),img=new Image();activeLoads++;img.decoding='async';img.onload=()=>{frames.set(index,img);activeLoads--;pending.delete(index);resolve(img);pump()};img.onerror=()=>{activeLoads--;pending.delete(index);resolve(null);pump()};img.src=framePath(index)}}

export function mountRelayScene(host,{onStage=()=>{},onProgress=()=>{},mode='hero'}={}){
  const canvas=host.querySelector('canvas'),poster=host.querySelector('.model-fallback');
  let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,disposed=false,renderer,environment,pmrem,world,raf=0,visible=false,fallback=false;
  let target=mode==='hero'?.17:0,current=target,last=performance.now(),lastStage=-1,lastProgress=-1,lastFrame=-1,lookX=0,lookY=0,targetLookX=0,targetLookY=0;
  const compact=()=>host.clientWidth<600;
  function ui(){const a=sampleJourney(current),n=70+Math.round(a.recovered*30);host.dataset.motionProgress=current.toFixed(4);host.dataset.stage=String(a.stage);if(a.stage!==lastStage){lastStage=a.stage;onStage(a.stage,false);poster.alt=['Patch lifts the preserved checkpoint','Patch walks with the checkpoint as specialist nodes orbit','Patch opens the cartridge and repairs unfinished units','Patch presents the recovered output and a verification receipt'][a.stage]}if(n!==lastProgress){lastProgress=n;onProgress(n)}}
  function drawFallback(){
    const wanted=Math.round(current*(MOTION_FRAMES-1)),step=compact()?2:1,index=clamp(Math.round(wanted/step)*step,0,MOTION_FRAMES-1);
    if(lastFrame===index)return;lastFrame=index;
    function show(){if(disposed||!fallback)return;const choices=[...frames.keys()];if(!choices.length)return;const nearest=choices.reduce((a,b)=>Math.abs(a-index)<Math.abs(b-index)?a:b);poster.src=frames.get(nearest).src;host.dataset.motionFrame=String(nearest)}
    show();loadFrame(index,true).then(()=>{if(lastFrame===index)show()});
  }
  function useFallback(){fallback=true;host.dataset.renderer='sequence';host.classList.remove('three-ready');host.classList.add('three-fallback');canvas.setAttribute('aria-hidden','true');poster.removeAttribute('aria-hidden');drawFallback()}
  try{
    const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'high-performance'});if(!context)throw Error('WebGL2 unavailable');
    renderer=new T.WebGLRenderer({canvas,context,alpha:true,antialias:true});
    world=createJourneyWorld({detail:compact()?0:1});
    const scene=new T.Scene();scene.add(world.root);world.scene=scene;
    scene.add(new T.HemisphereLight('#fff5e4','#9eaea5',2.2));
    const key=new T.DirectionalLight('#fff2da',3.8);key.position.set(-3,8,5);key.castShadow=true;key.shadow.mapSize.set(compact()?768:1536,compact()?768:1536);Object.assign(key.shadow.camera,{left:-5,right:5,top:6,bottom:-4,near:.1,far:20});key.shadow.bias=-.0003;key.shadow.normalBias=.025;key.shadow.radius=4;scene.add(key);
    const fill=new T.DirectionalLight('#dcecf4',1.8);fill.position.set(5,3,-5);scene.add(fill);
    const rim=new T.DirectionalLight('#ffd7b5',1.6);rim.position.set(-4,1,-4);scene.add(rim);
    const floor=new T.Mesh(new T.PlaneGeometry(60,60),new T.ShadowMaterial({color:'#142820',opacity:mode==='story'?.24:.13}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.58;floor.receiveShadow=true;scene.add(floor);
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,compact()?1.25:1.65));renderer.setClearColor('#000000',0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.75;room.dispose();
    host.dataset.renderer='threejs';host.classList.add('three-ready');poster.setAttribute('aria-hidden','true');
  }catch{renderer?.dispose();useFallback()}
  function frame(now){raf=0;if(disposed||!visible||document.hidden)return;const dt=Math.min(.05,(now-last)/1000);last=now;const damp=reduced?1:1-Math.exp(-dt*11);current=T.MathUtils.lerp(current,target,damp);lookX=T.MathUtils.lerp(lookX,targetLookX,damp);lookY=T.MathUtils.lerp(lookY,targetLookY,damp);ui();if(fallback)drawFallback();else{poseJourney(world,current,{aspect:host.clientWidth/Math.max(1,host.clientHeight),lookX,lookY,reduced});renderer.render(world.scene,world.camera)}if(Math.abs(current-target)+Math.abs(lookX-targetLookX)+Math.abs(lookY-targetLookY)>.00015)raf=requestAnimationFrame(frame)}
  function request(){if(!disposed&&visible&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function resize(){if(!fallback&&renderer){const w=host.clientWidth,h=host.clientHeight;if(w&&h)renderer.setSize(w,h,false)}request()}
  function visibility(){document.hidden?stop():request()}
  function pointer(e){if(e.pointerType!=='mouse'||reduced)return;const b=host.getBoundingClientRect();targetLookX=clamp((e.clientX-b.left)/b.width*2-1,-1,1)*.55;targetLookY=clamp((e.clientY-b.top)/b.height*2-1,-1,1)*.35;request()}
  function leave(){targetLookX=targetLookY=0;request()}
  function lost(e){e.preventDefault();stop();useFallback();request()}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){if(fallback){const from=mode==='hero'?6:0,to=mode==='hero'?21:MOTION_FRAMES;for(let i=from;i<to;i+=compact()?2:1)loadFrame(i)}request()}else stop()},{rootMargin:'80px'});intersection.observe(host);
  host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave);canvas.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',visibility);resize();ui();
  return {
    setProgress(p){target=clamp(p);if(reduced)current=target;request()},
    setReduced(value){reduced=value;if(reduced){current=target;targetLookX=targetLookY=0}request()},
    setStage(i){this.setProgress((clamp(i,0,3)+.5)/4)},
    dispose(){disposed=true;stop();resizeObserver.disconnect();intersection.disconnect();host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);if(world){const geometries=new Set(),materials=new Set();world.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose())}environment?.dispose();pmrem?.dispose();renderer?.dispose();renderer?.forceContextLoss()}
  };
}
