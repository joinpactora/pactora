import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import * as T from '../dist/vendor/three.module.js';
import {GLTFExporter} from '../dist/vendor/GLTFExporter.js';
import {createJourneyWorld,poseJourney} from '../dist/patch-motion.js';
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(result=>{this.result='data:'+blob.type+';base64,'+Buffer.from(result).toString('base64');this.onloadend?.()})}};
const world=createJourneyWorld(),root=world.root;root.add(world.camera);
root.userData={author:'RelayWorks',description:'Original 22-second scroll recovery animation. The live page additionally adapts its camera framing to the viewport.'};
// glTF core does not animate material colors. Interchange orange/green meshes
// by animating scale, so the editable download preserves the recovery story.
const pairs=[];
for(let i=7;i<10;i++)for(const [kind,original] of [['unit',world.model.refs.chips[i]],['lamp',world.model.refs.chipLamps[i]]]){
  const recovered=original.clone();recovered.material=world.model.materials.green.clone();recovered.name='Recovered_'+kind+'_'+i;original.parent.add(recovered);pairs.push({i,original,recovered});
}
const nodes=[];root.traverse(o=>nodes.push({node:o,positions:[],rotations:[],scales:[]}));
const times=[];
function pose(p){
  const a=poseJourney(world,p);
  for(const {i,original,recovered} of pairs){const green=a.recovered>(i-7)/3+.1;recovered.position.copy(original.position);recovered.quaternion.copy(original.quaternion);recovered.scale.setScalar(green?1:0);original.scale.setScalar(green?0:1)}
  for(const o of [world.scan,world.receipt,...world.satellites,...world.sparks])if(!o.visible)o.scale.setScalar(0);
  root.updateMatrixWorld(true);
}
for(let i=0;i<=132;i++){const p=i/132;pose(p);times.push(p*22);for(const o of nodes){o.positions.push(...o.node.position.toArray());o.rotations.push(...o.node.quaternion.toArray());o.scales.push(...o.node.scale.toArray())}}
const tracks=[];
for(const o of nodes)for(const [field,values,size,Track] of [['position',o.positions,3,T.VectorKeyframeTrack],['quaternion',o.rotations,4,T.QuaternionKeyframeTrack],['scale',o.scales,3,T.VectorKeyframeTrack]]){
  if(values.some((v,i)=>Math.abs(v-values[i%size])>1e-6))tracks.push(new Track(o.node.uuid+'.'+field,times,values));
}
pose(0);
const exporter=new GLTFExporter(),clip=new T.AnimationClip('Patch_capture_match_resume_verify',22,tracks);
const bytes=await exporter.parseAsync(root,{binary:true,onlyVisible:false,animations:[clip]});
const path=fileURLToPath(new URL('../dist/assets/patch-scroll-recovery.glb',import.meta.url));await fs.writeFile(path,Buffer.from(bytes));
console.log(JSON.stringify({path,bytes:bytes.byteLength,tracks:tracks.length,duration:clip.duration}));
