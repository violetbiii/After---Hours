import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
export function surface(color,kind='fabric'){
 const size=128,bytes=new Uint8Array(size*size*4);let seed=829;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
 seed=(Math.imul(seed,1664525)+1013904223)>>>0;
 const v=190+(seed/4294967296-.5)*36+(kind==='fabric'?((x%4===0||y%4===0)?-25:5):Math.sin(x*.11)*Math.cos(y*.14)*17);const i=(y*size+x)*4;bytes[i]=bytes[i+1]=bytes[i+2]=v;bytes[i+3]=255;
 }
 const texture=new THREE.DataTexture(bytes,size,size);texture.needsUpdate=true;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(3,3);texture.colorSpace=THREE.SRGBColorSpace;
 return new THREE.MeshStandardMaterial({color,map:texture,bumpMap:texture,bumpScale:kind==='fabric'?.012:.004,roughness:kind==='fabric'?.96:.77});
}
export function cord(parent,points,material,radius=.009){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
 const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(10,points.length*5),radius,5,false),material);parent.add(mesh);return mesh;
}
