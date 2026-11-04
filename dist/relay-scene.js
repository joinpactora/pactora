import * as T from './vendor/three.module.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {createRelayModel} from './relay-model.js';

const clamp=T.MathUtils.clamp,lerp=T.MathUtils.lerp;
const ease=x=>x*x*(3-2*x);

export function mountRelayScene(host,{onStage=()=>{},onProgress=()=>{}}={}){
  const canvas=host.querySelector('canvas'),poster=host.querySelector('.model-fallback');
  let disposed=false,fallback=null,renderer,pmrem,environment,raf=0,playing=false,visible=true;
  let elapsed=0,last=performance.now(),stage=0,phase=0,lastStage=-1,lastProgress=-1,inspection=false,explode=0,manual=false;
  let yaw=0,pitch=0,targetYaw=0,targetPitch=0,hoverX=0,hoverY=0,dragging=false,startX=0,startY=0,dragYaw=0,dragPitch=0,currentX=-.6;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,compact=()=>host.clientWidth<650;
  function makeFallback(){
    host.dataset.renderer='fallback';host.classList.remove('three-ready');host.classList.add('three-fallback');
    host.querySelector('.scene-mode-label').textContent='3D MODEL / STATIC PREVIEW';
    host.querySelector('.scene-orbit-hint').textContent='Static view · Explore the recovery stages below';
    canvas.setAttribute('aria-hidden','true');poster?.removeAttribute('aria-hidden');
    const button=document.querySelector('[data-action="engine-inspect"]');if(button){button.disabled=true;button.title='3D inspection is unavailable in this browser'}
    let timers=[],current=0;
    const stop=()=>{timers.forEach(clearTimeout);timers=[]};
    const show=(i,active=false)=>{current=i;host.dataset.stage=String(i);onStage(i,active);onProgress(i===3?100:i===2?85:70)};
    const controller={setStage(i){stop();show(i)},play(){stop();show(0,true);[1,2,3].forEach(i=>timers.push(setTimeout(()=>{if(!disposed){show(i,i<3);if(i===3)timers=[]}},i*1200)))},toggle(){if(timers.length){stop();show(current)}else controller.play()},inspect(){return false},dispose(){stop()}};
    show(0);return controller;
  }
  try{
    const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'high-performance'});
    if(!context)throw Error('WebGL 2 unavailable');
    renderer=new T.WebGLRenderer({canvas,context,alpha:true,antialias:true,powerPreference:'high-performance'});
  }catch{fallback=makeFallback();return {...fallback,dispose(){disposed=true;fallback.dispose()}}}
  const model=createRelayModel({detail:compact()?0:1}),scene=new T.Scene(),root=new T.Group();root.add(model.root);scene.add(root);
  const camera=new T.OrthographicCamera(-6,6,3,-3,.1,60);camera.position.set(6.4,4.1,10.7);camera.lookAt(0,-.14,0);
  scene.add(new T.HemisphereLight('#fff8e9','#c8c7b6',2.1));
  const key=new T.DirectionalLight('#fff6e8',3.9);key.position.set(-3,8,6);key.castShadow=true;key.shadow.mapSize.set(compact()?768:1536,compact()?768:1536);Object.assign(key.shadow.camera,{left:-7,right:7,top:5,bottom:-5,near:.1,far:25});key.shadow.bias=-.0003;key.shadow.normalBias=.025;key.shadow.radius=4;scene.add(key);
  const fill=new T.DirectionalLight('#e0eaf5',1.3);fill.position.set(4,3,-5);scene.add(fill);
  const rim=new T.DirectionalLight('#fff4dc',1.6);rim.position.set(-4,2,-4);scene.add(rim);
  const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.11,color:'#44382a'}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.555;floor.receiveShadow=true;scene.add(floor);
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=128;const ctx=shadowCanvas.getContext('2d');const gradient=ctx.createRadialGradient(128,64,3,128,64,110);gradient.addColorStop(0,'rgba(47,43,30,.23)');gradient.addColorStop(.45,'rgba(47,43,30,.11)');gradient.addColorStop(1,'rgba(47,43,30,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,256,128);
  const contactMap=new T.CanvasTexture(shadowCanvas),contact=new T.Mesh(new T.PlaneGeometry(9.8,4),new T.MeshBasicMaterial({map:contactMap,transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.set(0,-1.55,.1);scene.add(contact);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,compact()?1.25:1.75));renderer.setClearColor('#f4f1e9',0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.65;room.dispose();
  function resize(){if(disposed||fallback)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const span=compact()?10.5:12.4,aspect=w/h;Object.assign(camera,{left:-span/2,right:span/2,top:span/aspect/2,bottom:-span/aspect/2});camera.updateProjectionMatrix();renderer.setSize(w,h,false);requestRender()}
  function requestRender(){if(!raf&&!disposed&&!fallback&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame)}}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function stageFromTime(){const t=elapsed%15.5;if(t<2.7)return [0,t/2.7];if(t<5)return [1,(t-2.7)/2.3];if(t<9.1)return [2,(t-5)/4.1];return [3,Math.min(1,(t-9.1)/1.1)]}
  function updateUi(){if(stage!==lastStage){lastStage=stage;host.dataset.stage=String(stage);onStage(stage,playing)}const n=stage<2?70:stage===2?Math.round(70+phase*30):100;if(n!==lastProgress){lastProgress=n;onProgress(n)}}
  function frame(now){
    raf=0;if(disposed||fallback||!visible||document.hidden)return;
    const dt=Math.min((now-last)/1000,.05);last=now;if(playing){elapsed+=dt;[stage,phase]=stageFromTime()}updateUi();
    const transfer=stage<2?(stage===1?.1:0):stage===2?ease(phase):1,goal=lerp(-.6,.8,transfer);
    currentX=reduced?goal:lerp(currentX,goal,1-Math.exp(-dt*4));explode=reduced?Number(inspection):lerp(explode,Number(inspection),1-Math.exp(-dt*4));
    yaw=lerp(yaw,targetYaw+hoverX*.07,1-Math.exp(-dt*6));pitch=lerp(pitch,targetPitch+hoverY*.025,1-Math.exp(-dt*6));root.rotation.y=yaw-.08;root.rotation.x=pitch;
    const b=host.getBoundingClientRect();root.rotation.y+=reduced?0:clamp(-b.top/(innerHeight+host.clientHeight),0,1)*.12;
    model.refs.cartridge.position.x=currentX;model.refs.cartridge.position.y=.3+explode*.32;model.refs.left.position.x=-1.51-explode*.32;model.refs.right.position.x=1.51+explode*.32;model.refs.collars[0].position.x=-1.58-explode*.25;model.refs.collars[1].position.x=1.58+explode*.25;
    model.refs.rotors.forEach((r,i)=>r.rotation.z=(playing?elapsed:stage*1.6)*.16*(i?1:-1));
    for(let i=7;i<10;i++){const recovered=stage===3||(stage===2&&phase>(i-7)/3+.16);model.refs.dataBlocks[i].material.color.set(recovered?'#52795c':'#ef7434');model.refs.dataLights[i].material=recovered?model.materials.green:model.materials.amber}
    model.refs.dockLights.forEach((m,i)=>{if(i>4)m.material=stage===3?model.materials.green:model.materials.amber});
    model.refs.pulse.position.copy(model.refs.incoming.getPoint((playing?elapsed*.21:stage*.23)%1));model.refs.pulse.visible=playing&&stage<3;
    renderer.render(scene,camera);
    if(playing||dragging||Math.abs(yaw-targetYaw-hoverX*.07)>.002||Math.abs(pitch-targetPitch-hoverY*.025)>.002||Math.abs(explode-Number(inspection))>.002||Math.abs(currentX-goal)>.002)raf=requestAnimationFrame(frame);
  }
  function pointerDown(e){if(e.button!==0)return;dragging=true;startX=e.clientX;startY=e.clientY;dragYaw=targetYaw;dragPitch=targetPitch;canvas.setPointerCapture(e.pointerId);host.classList.add('dragging');requestRender()}
  function pointerMove(e){const b=canvas.getBoundingClientRect();if(dragging){targetYaw=clamp(dragYaw+(e.clientX-startX)*.005,-.8,.8);targetPitch=clamp(dragPitch+(e.clientY-startY)*.0025,-.16,.16)}else if(e.pointerType==='mouse'&&!reduced){hoverX=(e.clientX-b.left)/b.width*2-1;hoverY=(e.clientY-b.top)/b.height*2-1}requestRender()}
  function pointerUp(){dragging=false;host.classList.remove('dragging');requestRender()}
  function pointerLeave(){hoverX=hoverY=0;requestRender()}
  function keydown(e){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')targetYaw-=.12;if(e.key==='ArrowRight')targetYaw+=.12;if(e.key==='ArrowUp')targetPitch-=.04;if(e.key==='ArrowDown')targetPitch+=.04;if(e.key==='Home')targetYaw=targetPitch=0;targetYaw=clamp(targetYaw,-.8,.8);targetPitch=clamp(targetPitch,-.16,.16);requestRender()}
  function visibility(){if(document.hidden)stop();else requestRender()}
  function lost(e){e.preventDefault();stop();fallback=makeFallback()}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestRender();else stop()},{threshold:0});intersection.observe(host);
  const handlers={pointerdown:pointerDown,pointermove:pointerMove,pointerup:pointerUp,pointercancel:pointerUp,pointerleave:pointerLeave,keydown,webglcontextlost:lost};Object.entries(handlers).forEach(([event,handler])=>canvas.addEventListener(event,handler));document.addEventListener('visibilitychange',visibility);
  host.dataset.renderer='threejs';host.classList.add('three-ready');host.querySelector('.scene-mode-label').textContent='INTERACTIVE 3D / DRAG TO EXPLORE';canvas.setAttribute('aria-label','Interactive three-dimensional relay. Drag or use arrow keys to rotate.');poster?.setAttribute('aria-hidden','true');playing=!reduced;resize();updateUi();requestRender();
  return {
    setStage(i){if(fallback)return fallback.setStage(i);manual=true;playing=false;stage=clamp(i,0,3);phase=stage===2?.5:1;lastStage=-1;updateUi();requestRender()},
    play(){if(fallback)return fallback.play();manual=false;elapsed=0;stage=phase=0;lastStage=-1;playing=true;updateUi();requestRender()},
    toggle(){if(fallback)return fallback.toggle();playing=!playing;if(playing&&manual){elapsed=[0,2.7,5,9.1][stage];manual=false}onStage(stage,playing);requestRender()},
    inspect(){if(fallback)return false;inspection=!inspection;host.dataset.inspection=inspection?'exploded':'assembled';requestRender();return inspection},
    dispose(){disposed=true;stop();fallback?.dispose();resizeObserver.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);Object.entries(handlers).forEach(([event,handler])=>canvas.removeEventListener(event,handler));disposeModel(model.root);contactMap.dispose();contact.geometry.dispose();contact.material.dispose();floor.geometry.dispose();floor.material.dispose();environment.dispose();pmrem.dispose();renderer.dispose();renderer.forceContextLoss()}
  };
}
function disposeModel(root){const geometries=new Set(),materials=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose())}
