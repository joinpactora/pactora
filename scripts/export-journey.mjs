import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {GLTFExporter} from '../dist/vendor/GLTFExporter.js';
import {createJourneyWorld,poseJourney,MOTION_FRAMES} from '../dist/patch-motion.js';
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(result=>{this.result='data:'+blob.type+';base64,'+Buffer.from(result).toString('base64');this.onloadend?.()})}};
const dir=fileURLToPath(new URL('../model/journey/',import.meta.url));await fs.mkdir(dir,{recursive:true});
const exporter=new GLTFExporter(),world=createJourneyWorld({detail:0}),frames=Number(process.argv[2]||MOTION_FRAMES),selected=process.argv[3]?process.argv[3].split(',').map(Number):Array.from({length:frames},(_,i)=>i);
for(const i of selected){
  const p=i/(frames-1),state=poseJourney(world,p),name='frame-'+String(i).padStart(3,'0');
  await fs.writeFile(dir+'/'+name+'.glb',Buffer.from(await exporter.parseAsync(world.root,{binary:true,onlyVisible:true})));
  await fs.writeFile(dir+'/'+name+'.json',JSON.stringify({progress:p,camera:world.camera.position.toArray(),target:[0,.67,0],span:state.span}));
  console.log(name);
}
