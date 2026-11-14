import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
export function isSheltered(x,z){return x>3.4&&x<9.8&&((z>-11.8&&z<-2.2)||(z>-27.8&&z<-12.2));}
export function buildBackstage({scene,box,sign}){
 box(7,.2,16,6.5,-.1,-20,0x302c29);box(7,.2,16,6.5,3.3,-20,0x252826);
 box(.25,3.4,9,3,1.6,-23.5,0x444e46,true);
 box(7,3.4,.25,6.5,1.6,-28,0x41493e,true);
 box(.25,3.4,16,10,1.6,-20,0x414b42,true);
 sign('POWER ROOM',6.5,2.7,-27.8,2.5);
 const entry=sign('POWER ROOM',2.7,2.7,-16,2);entry.rotation.y=-Math.PI/2;
 for(const z of [-7,-20]){const light=new THREE.PointLight(0xffbe69,12,16);light.position.set(6.5,2.85,z);scene.add(light);}
 sign('TAKE IT OFF IN HERE',8,2,-27.75,2);
 return {reset(){}};
}
