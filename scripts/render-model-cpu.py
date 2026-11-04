"""CPU studio render of the exact GLB. Optional: mitsuba 3.9.1, trimesh 5.2.0."""
from pathlib import Path
import numpy as np
import mitsuba as mi
import trimesh
root=Path(__file__).resolve().parent.parent
mi.set_variant('scalar_rgb')
asset=trimesh.load(root/'dist/assets/relay-engine.glb',force='scene')
t=mi.ScalarTransform4f
scene={
 'type':'scene','integrator':{'type':'path','max_depth':10,'rr_depth':5},
 'sensor':{'type':'orthographic','to_world':t.look_at(origin=[6.4,4.1,10.7],target=[0,-.22,0],up=[0,1,0])@t.scale([5.9,5.9,1]),'sampler':{'type':'independent','sample_count':256},'film':{'type':'hdrfilm','width':1920,'height':900,'rfilter':{'type':'tent'}}},
 'environment':{'type':'constant','radiance':{'type':'rgb','value':[.6,.63,.64]}},
 'floor':{'type':'rectangle','to_world':t.translate([0,-1.56,0])@t.rotate([1,0,0],-90)@t.scale([100,100,1]),'bsdf':{'type':'diffuse','reflectance':{'type':'rgb','value':[.88,.865,.82]}}}
}
def area(name,at,size,power,color):
 scene[name]={'type':'rectangle','to_world':t.look_at(origin=at,target=[0,0,0],up=[0,0,1])@t.scale([size[0],size[1],1]),'emitter':{'type':'area','radiance':{'type':'rgb','value':[power*c for c in color]}}}
area('key',[-3,7,6],[3,2.5],7,[1,.94,.84])
area('rim',[3,5,-5],[2.5,2],5,[.8,.9,1])
area('strip',[-5,2,-3],[.8,3],5,[1,.96,.9])
for i,node in enumerate(asset.graph.nodes_geometry):
 matrix,name=asset.graph[node];mesh=asset.geometry[name].copy();mesh.apply_transform(matrix)
 mat=mesh.visual.material;base=np.asarray(getattr(mat,'baseColorFactor',[200,200,200,255]),dtype=float)[:3]
 if base.max()>1:base/=255
 if 'Frosted_glass_shell' in node:
  spec={'type':'roughdielectric','int_ior':1.46,'ext_ior':1.0,'alpha':.04,'distribution':'ggx','specular_transmittance':{'type':'rgb','value':[.96,.98,.97]}}
 else:
  spec={'type':'principled','base_color':{'type':'rgb','value':base.tolist()},'roughness':float(getattr(mat,'roughnessFactor',.4) or .4),'metallic':float(getattr(mat,'metallicFactor',0) or 0)}
 props=mi.Properties();props['bsdf']=mi.load_dict(spec)
 shape=mi.Mesh('part_'+str(i),len(mesh.vertices),len(mesh.faces),props,has_vertex_normals=True)
 params=mi.traverse(shape);params['vertex_positions']=np.asarray(mesh.vertices,dtype=np.float32).ravel();params['vertex_normals']=np.asarray(mesh.vertex_normals,dtype=np.float32).ravel();params['faces']=np.asarray(mesh.faces,dtype=np.uint32).ravel();params.update();scene['part_'+str(i)]=shape
print('Rendering',len(asset.graph.nodes_geometry),'components',flush=True)
mi.util.write_bitmap(str(root/'docs/model-studio-preview.png'),mi.render(mi.load_dict(scene)))
print('MODEL_RENDER_COMPLETE',flush=True)
