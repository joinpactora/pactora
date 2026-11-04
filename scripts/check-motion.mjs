import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createJourneyWorld,poseJourney,sampleJourney} from '../dist/patch-motion.js';
const world=createJourneyWorld({detail:0});
const capture=p=>{poseJourney(world,p);const state=[];world.root.traverse(o=>{state.push(...o.matrixWorld.elements,Number(o.visible));if(o.material?.color)state.push(...o.material.color.toArray())});return state};
const expected=capture(.96);capture(.08);assert.deepEqual(capture(.96),expected,'Reverse scrolling must reproduce the same pose and colors');
const first=capture(.02),walk=capture(.35),repair=capture(.65),last=capture(.96);
assert.notDeepEqual(first,walk);assert.notDeepEqual(walk,repair);assert.notDeepEqual(repair,last);
poseJourney(world,.34);assert.ok(world.model.refs.legs.some(l=>Math.abs(l.boot.position.z-.02)>.1),'The match chapter needs an articulated walking stride');
poseJourney(world,.62);assert.ok(world.model.refs.glass.rotation.x>1,'The repair chapter must open the checkpoint');
poseJourney(world,.96);assert.ok(world.receipt.visible&&world.model.refs.arms[1].hand.position.y>1.5,'The finale must present the receipt and salute');
for(let i=0;i<=200;i++){
  const p=i/200,a=poseJourney(world,p);world.root.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite),'Finite transforms at '+p));
  assert.equal(a.stage,Math.min(3,Math.floor(p*4)));
  if(i){const previous=sampleJourney(p-.00001);assert.ok(Math.abs(a.cameraX-previous.cameraX)<.01,'Camera transitions must stay continuous')}
}
// The character remains framed in both a narrow hero and the wider workshop.
for(const aspect of [.69,1,1.45])for(const p of [0,.2,.35,.62,.96]){
  poseJourney(world,p,{aspect});const box=new T.Box3().setFromObject(world.model.root);
  for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
    const v=new T.Vector3(x,y,z).project(world.camera);assert.ok(Math.abs(v.x)<1.05&&Math.abs(v.y)<1.05,'Character must remain in frame')
  }
}
console.log('Motion checks passed: reversibility, full-body actions, continuous camera, finite transforms, responsive framing.');
