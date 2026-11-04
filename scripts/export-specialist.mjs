import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {GLTFExporter} from '../dist/vendor/GLTFExporter.js';
import {createSpecialist,specialistAnimation,poseSpecialist} from '../dist/specialist-model.js';
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(result=>{this.result='data:'+blob.type+';base64,'+Buffer.from(result).toString('base64');this.onloadend?.()})}};
const exporter=new GLTFExporter(),model=createSpecialist();
const path=fileURLToPath(new URL('../dist/assets/patch-specialist.glb',import.meta.url));
await fs.writeFile(path,Buffer.from(await exporter.parseAsync(model.root,{binary:true,animations:[specialistAnimation(model)]})));
await fs.mkdir(fileURLToPath(new URL('../model/poses/',import.meta.url)),{recursive:true});
for(let stage=0;stage<4;stage++){
  poseSpecialist(model,{stage,phase:.5,time:0});model.root.updateMatrixWorld(true);
  const output=fileURLToPath(new URL('../model/poses/patch-pose-'+stage+'.glb',import.meta.url));
  await fs.writeFile(output,Buffer.from(await exporter.parseAsync(model.root,{binary:true})));
}
let meshes=0,triangles=0;model.root.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3}});console.log(JSON.stringify({path,meshes,triangles}));
