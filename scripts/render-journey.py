"""Render the exact scroll geometry/camera to an alpha fallback image.
Optional CPU dependencies: Mitsuba, trimesh, numpy and Pillow.
Usage: python scripts/render-journey.py frame [samples=20] [size=640]
"""
from pathlib import Path
import json,sys
import numpy as np
import mitsuba as mi
import trimesh
from PIL import Image
root=Path(__file__).resolve().parent.parent
mi.set_variant('scalar_rgb')
index=int(sys.argv[1]);samples=int(sys.argv[2]) if len(sys.argv)>2 else 20
size=int(sys.argv[3]) if len(sys.argv)>3 else 640
name=f'frame-{index:03d}'
asset=trimesh.load(root/f'model/journey/{name}.glb',force='scene')
camera=json.loads((root/f'model/journey/{name}.json').read_text())
t=mi.ScalarTransform4f
half=camera['span']/2
scene={'type':'scene','integrator':{'type':'path','max_depth':7,'rr_depth':4,'hide_emitters':True},
 'sensor':{'type':'orthographic','to_world':t.look_at(origin=camera['camera'],target=camera['target'],up=[0,1,0])@t.scale([half,half,1]),'sampler':{'type':'independent','sample_count':samples},'film':{'type':'hdrfilm','width':size,'height':size,'pixel_format':'rgba','rfilter':{'type':'tent'}}},
 'environment':{'type':'constant','radiance':{'type':'rgb','value':[.6,.63,.64]}}}
def area(name,at,scale,power,color):
 scene[name]={'type':'rectangle','to_world':t.look_at(origin=at,target=[0,0,0],up=[0,0,1])@t.scale([scale[0],scale[1],1]),'emitter':{'type':'area','radiance':{'type':'rgb','value':[power*c for c in color]}}}
area('key',[-3,8,3],[2.5,2],12,[1,.94,.84]);area('rim',[3,5,-5],[2.5,2],5,[.8,.9,1]);area('strip',[-6,5,6],[.8,3],5,[1,.96,.9])
for i,node in enumerate(asset.graph.nodes_geometry):
 matrix,name=asset.graph[node];mesh=asset.geometry[name].copy();mesh.apply_transform(matrix)
 mat=mesh.visual.material;base=np.asarray(getattr(mat,'baseColorFactor',[200,200,200,255]),dtype=float)[:3]
 if base.max()>1:base/=255
 if 'Checkpoint_glass' in node:spec={'type':'roughdielectric','int_ior':1.46,'ext_ior':1.0,'alpha':.04,'distribution':'ggx','specular_transmittance':{'type':'rgb','value':[.96,.98,.97]}}
 else:spec={'type':'principled','base_color':{'type':'rgb','value':base.tolist()},'roughness':float(getattr(mat,'roughnessFactor',.4) or .4),'metallic':float(getattr(mat,'metallicFactor',0) or 0)}
 props=mi.Properties();props['bsdf']=mi.load_dict(spec)
 shape=mi.Mesh('part_'+str(i),len(mesh.vertices),len(mesh.faces),props,has_vertex_normals=True)
 params=mi.traverse(shape);params['vertex_positions']=np.asarray(mesh.vertices,dtype=np.float32).ravel();params['vertex_normals']=np.asarray(mesh.vertex_normals,dtype=np.float32).ravel();params['faces']=np.asarray(mesh.faces,dtype=np.uint32).ravel();params.update();scene['part_'+str(i)]=shape
result=mi.render(mi.load_dict(scene))
output=root/'dist/assets/patch-motion';output.mkdir(exist_ok=True,parents=True)
pixels=np.asarray(mi.Bitmap(result).convert(mi.Bitmap.PixelFormat.RGBA,mi.Struct.Type.UInt8,True))
Image.fromarray(pixels).save(output/f'frame-{index:03d}.webp',quality=85,method=5)
print(f'Rendered {index:03d}',flush=True)
