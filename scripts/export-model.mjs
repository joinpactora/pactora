import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {GLTFExporter} from '../dist/vendor/GLTFExporter.js';
import {createRelayModel,recoveryAnimation} from '../dist/relay-model.js';

// The model has no image textures; this small shim implements the Blob reader
// used by the official exporter in Node without a DOM or a graphics context.
globalThis.FileReader=class {
  readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.()})}
  readAsDataURL(blob){blob.arrayBuffer().then(result=>{this.result='data:'+blob.type+';base64,'+Buffer.from(result).toString('base64');this.onloadend?.()})}
};
const model=createRelayModel();
const output=await new GLTFExporter().parseAsync(model.root,{binary:true,animations:[recoveryAnimation(model)],onlyVisible:true});
const path=fileURLToPath(new URL('../dist/assets/relay-engine.glb',import.meta.url));
await fs.writeFile(path,Buffer.from(output));
let meshes=0,triangles=0;model.root.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3}});
console.log(JSON.stringify({path,bytes:output.byteLength,meshes,triangles}));
