import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import {surface,cord} from './model-detail.js';
export function createMascot(scene){
 const group=new THREE.Group();group.position.set(1.65,0,10.4);scene.add(group);
 const plush=surface(0xc9b894),cream=surface(0xe1d0a7),wingMat=surface(0x657b72),lining=surface(0x344641),patch=surface(0x8c6653);
 const seam=new THREE.MeshStandardMaterial({color:0x514736,roughness:1});
 const eye=new THREE.MeshStandardMaterial({color:0x101b1c,roughness:.28,metalness:.12});
 const shine=new THREE.MeshStandardMaterial({color:0xb4c4b7,roughness:.2});
 function oval(parent,x,y,z,sx,sy,sz,material=plush){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
 oval(group,0,.99,0,.43,.64,.32);oval(group,0,1.03,.25,.29,.43,.13,cream);
 for(const side of [-1,1]){
  const wing=new THREE.Group();wing.position.set(side*.24,1.15,-.18);wing.rotation.y=side*(side===1?-.68:-.08);group.add(wing);
  const shape=new THREE.Shape();shape.moveTo(0,-.5);shape.bezierCurveTo(side*.22,-.85,side*.62,-.85,side*.55,-.39);shape.bezierCurveTo(side*1.02,-.15,side*.93,.2,side*.73,.21);shape.bezierCurveTo(side*1.02,.85,side*.5,1.03,0,.42);shape.closePath();
  wing.add(new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.06,bevelEnabled:true,bevelSegments:2,bevelSize:.035,bevelThickness:.025,curveSegments:14}),wingMat));
  oval(wing,side*.48,.32,.085,.19,.23,.025,cream);oval(wing,side*.48,.32,.109,.105,.14,.025,lining);oval(wing,side*.48,.32,.133,.046,.075,.012,patch);
  for(const y of [-.5,-.15,.6])cord(wing,[[0,-.35,.09],[side*.29,y*.4,.1],[side*.64,y,.095]],lining,.014);
  oval(group,side*.24,.34,0,.16,.24,.17,plush);oval(group,side*.24,.15,.14,.21,.15,.34,lining);oval(group,side*.46,.94,0,.17,.39,.17);oval(group,side*.52,.62,.1,.18,.21,.13,cream);
  for(let i=0;i<3;i++)cord(group,[[side*.52+(i-1)*.055,.59,.223],[side*.52+(i-1)*.055,.49,.205]],seam,.006);
 }
 oval(group,0,1.83,0,.56,.49,.37);oval(group,0,1.64,.25,.4,.22,.18,cream);
 for(const side of [-1,1]){
  oval(group,side*.225,1.91,.305,.195,.235,.085,lining);oval(group,side*.225,1.91,.367,.14,.18,.07,eye);oval(group,side*.225-.035,1.97,.426,.035,.052,.01,shine);
  cord(group,[[side*.24,2.21,-.02],[side*.32,2.47,-.03],[side*(side===1?.5:.37),side===1?2.55:2.67,.02]],lining,.034);
  oval(group,side*(side===1?.5:.37),side===1?2.55:2.67,.02,.08,.055,.065,cream);
  for(let i=0;i<5;i++)oval(group,side*(.17+i*.048),1.49+i*.025,.365,.024,.07,.025,plush);
 }
 cord(group,[[-.27,1.64,.397],[-.13,1.55,.44],[.04,1.54,.445],[.26,1.68,.397]],seam,.013);
 for(let i=0;i<9;i++){const x=-.23+i*.055,y=1.55+Math.pow(x/.27,2)*.09;cord(group,[[x-.015,y-.024,.447],[x+.012,y+.029,.447]],seam,.004);}
 oval(group,-.43,1.69,.235,.095,.13,.022,patch).rotation.z=-.3;
 for(let i=0;i<5;i++)cord(group,[[-.51,1.6+i*.04,.264],[-.46,1.6+i*.04,.275]],cream,.004);
 cord(group,[[0,1.43,.33],[0,1.12,.385],[0,.71,.32]],seam,.007);
 const badge=new THREE.Mesh(new THREE.BoxGeometry(.21,.13,.025),lining);badge.position.set(.16,1.24,.395);badge.rotation.z=-.12;group.add(badge);
 cord(group,[[.09,1.22,.414],[.09,1.28,.414],[.16,1.23,.414],[.22,1.28,.414],[.22,1.22,.414]],cream,.007);
 return group;
}
