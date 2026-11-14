import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
// Seeded surface detail: repeatable, original, and no downloaded art assets.
function texture(kind){
 const n=256,data=new Uint8Array(n*n*4);let seed=71;
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  let v=205+(seed/4294967296-.5)*24;
  if(kind==='tile'){if(x%64<2||y%64<2)v=72;else v+=((Math.floor(x/64)+Math.floor(y/64))%2)*20;}
  if(kind==='paint')v-=Math.max(0,Math.sin(x*.09)+Math.cos(y*.035)-.8)*24;
  if(kind==='wood')v+=Math.sin(x*.23+Math.sin(y*.02)*2)*18;
  const i=(y*n+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;
 }
 const t=new THREE.DataTexture(data,n,n);t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;
}
export function dressEnvironment(scene,box,sign){
 const maps={tile:texture('tile'),paint:texture('paint'),wood:texture('wood')};
 // Dress only architectural meshes that already exist; retain all collision boundaries.
 for(const mesh of [...scene.children]){
  if(!mesh.isMesh||mesh.geometry.type!=='BoxGeometry')continue;
  const {width:w,height:h,depth:d}=mesh.geometry.parameters;
  const floor=h<=.21&&w>=5&&d>=10;
  const wall=h>=3&&Math.max(w,d)>=2;
  const wood=w>=1&&h<.2&&d>.5&&d<2;
  if(!floor&&!wall&&!wood)continue;
  const t=maps[floor?'tile':wood?'wood':'paint'].clone();t.needsUpdate=true;
  t.repeat.set(floor?w/4:wood?2:Math.max(w,d)/3,floor?d/4:1);
  mesh.material.map=t;mesh.material.bumpMap=t;mesh.material.bumpScale=floor?.018:.025;
  mesh.material.roughness=floor?.38:wood?.7:.92;
  if(floor)mesh.material.color.setHex(0x85918a);
  if(wall)mesh.material.color.setHex(0x92968a);
  mesh.receiveShadow=true;
 }
 for(const side of [-1,1]){
  // Inset wall panels break up the flat corridor without narrowing its route.
  for(let z=-18;z<15;z+=1){
   if(side===1&&((z>=-8&&z<=-6)||(z>=-17&&z<=-15)))continue;
   box(.035,.9,.97,side*2.858,.53,z,0x304543);
   box(.055,.055,.99,side*2.83,1.02,z,0x797c69);
   box(.06,.12,.99,side*2.83,.07,z,0x1a2626);
  }
  for(const z of [7,0,-14]){
   for(const dz of [-.9,.9])box(.2,2.6,.07,side*2.75,1.3,z+dz,0x77796a);
   box(.2,.1,1.87,side*2.75,2.6,z,0x77796a);
   for(let i=0;i<5;i++)box(.025,.018,.6,side*2.63,.32+i*.07,z,0x52635d);
  }
 }
 for(let z=-18;z<15;z+=2){
  box(5.8,.04,.025,0,3.17,z,0x54605a);
  for(const x of [-2,-1,0,1,2])box(.025,.04,2,x,3.17,z+1,0x54605a);
 }
 for(const z of [10,3,-4,-11,-18]){
  box(1.95,.12,.48,0,3.1,z,0x2a3431);
  const tube=box(1.65,.035,.23,0,3.025,z,0xd8e4d2);
  tube.material.emissive.setHex(0xc7dec9);tube.material.emissiveIntensity=2;
  for(const x of [-.95,.95])box(.045,.12,.52,x,3.08,z,0x70796e);
 }
 // Recessed noticeboard and pinned sheets, along the left wall.
 box(.07,1.1,2.4,-2.78,1.86,5,0x765d43);
 for(const z of [4.35,5,5.65]){
  box(.09,.65,.44,-2.72,1.84,z,0xc7c2a5);
  for(let i=0;i<5;i++)box(.095,.012,.3,-2.71,1.97-i*.065,z,0x666e64);
  box(.1,.025,.025,-2.7,2.13,z,0x9e4c37);
 }
 const notice=sign('CAMPUS / NOTICES',-2.65,2.59,5,2);notice.rotation.y=Math.PI/2;
 const room=sign('111',6.5,2.75,-11.72,1.3,'#e3c796');
 sign('STUDENT SERVICES',0,2.6,14.8,2.8).rotation.y=Math.PI;
 // Paper clutter rests flat and never changes movement collision.
 for(let i=0;i<12;i++){
  const z=11-i*2.3,x=Math.sin(i*8.2)*2.1;
  const sheet=box(.22,.004,.3,x,.015,z,i%3?0xaaa992:0x707c70);sheet.rotation.y=i*1.7;
 }
 for(const x of [5,7.5])for(const z of [-4,-10]){
  box(.3,.018,.23,x+.35,.88,z,0xc6c3ad);
  box(.2,.045,.3,x-.4,.89,z,0x4c615d);
 }
 // A visible red emergency fixture gives the distant exit a focal point.
 const red=box(.15,.16,.12,1.4,2.3,-18.55,0x82332a);red.material.emissive.setHex(0x9b2416);
 const glow=new THREE.PointLight(0xe46b41,3,4);glow.position.set(1.4,2.25,-18.2);scene.add(glow);
 const rim=new THREE.PointLight(0xe8b875,8,5);rim.position.set(2.3,2.3,11.5);scene.add(rim);
 const positions=new Float32Array(90*3);
 for(let i=0;i<90;i++){positions[i*3]=Math.sin(i*13.1)*2.6;positions[i*3+1]=.4+(i%19)/7;positions[i*3+2]=14-(i*1.73)%32;}
 const dust=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(positions,3)),new THREE.PointsMaterial({color:0xc8d0b9,size:.014,transparent:true,opacity:.3,depthWrite:false}));scene.add(dust);
 return {update(time){dust.position.y=Math.sin(time*.15)*.08;}};
}
