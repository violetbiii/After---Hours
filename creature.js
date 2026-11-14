import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

import {surface,cord} from './model-detail.js';

// All geometry is original. The body faces away; the face looks back over it.
export function createCreature(scene, solids = [], world = {}) {
  const root = new THREE.Group();
  scene.add(root);
  const cloth = surface(0x35433f);
  const skin = surface(0xd0c8b3,'skin');
  const black = new THREE.MeshBasicMaterial({color:0x030404});
  const paper = new THREE.MeshStandardMaterial({color:0xd9d9bd,roughness:1});
  function part(parent, geometry, material, x,y,z) {
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  function limb(parent,a,b,r,material) {
    const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);
    const mesh=part(parent,new THREE.CylinderGeometry(r*.72,r,start.distanceTo(end),10),material,...start.clone().add(end).multiplyScalar(.5).toArray());
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());
    return mesh;
  }
  part(root,new THREE.CylinderGeometry(.28,.18,1.04,14),cloth,0,1.97,0);
  for(const s of [-1,1]) {
    limb(root,[s*.12,1.52,0],[s*.15,.7,.08],.085,cloth);
    limb(root,[s*.15,.7,.08],[s*.19,.12,0],.055,cloth);
    part(root,new THREE.BoxGeometry(.14,.13,.32),cloth,s*.19,.065,-.08);
    limb(root,[s*.24,2.4,0],[s*.39,1.5,.05],.095,cloth);
    limb(root,[s*.39,1.5,.05],[s*.44,.62,.13],.055,skin);
    part(root,new THREE.BoxGeometry(.12,.23,.065),skin,s*.44,.52,.13);
    for(let i=0;i<4;i++) {
      const x=s*.44+(i-1.5)*.033;
      limb(root,[x,.44,.13],[x,.23-i*.012,.18],.014,skin);
      limb(root,[x,.23-i*.012,.18],[x,.26-i*.012,.24],.012,skin);
    }
  }
  const neck=limb(root,[0,2.43,0],[.15,2.8,0],.085,skin);
  const neckY=neck.position.y;
  const head=new THREE.Group();head.position.set(.19,2.83,.015);head.rotation.z=-.44;root.add(head);
  const skull=part(head,new THREE.SphereGeometry(1,24,18),skin,0,0,0);skull.scale.set(.16,.25,.14);
  const bruised=surface(0x756d64,'skin');
  function detail(parent,x,y,z,sx,sy,sz,material){const m=part(parent,new THREE.SphereGeometry(1,16,12),material,x,y,z);m.scale.set(sx,sy,sz);return m;}
  for(const s of [-1,1]) {
    detail(head,s*.068,.04,.112,.049,.043,.028,bruised);
    detail(head,s*.07,.063,.133,.045,.013,.02,skin).rotation.z=s*.22;
    detail(head,s*.12,-.035,.08,.035,.065,.047,skin);
    detail(head,s*.162,-.015,0,.025,.052,.025,skin);
    cord(head,[[s*.08,.015,.142],[s*.09,-.018,.137],[s*.1,-.05,.128]],bruised,.003);
    const eye=part(head,new THREE.SphereGeometry(1,6,5),black,s*.058,.045,.124);eye.scale.set(.023,.016,.024);
    detail(head,s*.058+.005,.047,.151,.004,.005,.003,paper);
    cord(head,[[s*.12,-.03,.148],[s*.137,-.045,.137],[s*.128,-.075,.125]],bruised,.004);
  }
  // An asymmetric crescent: raised corners and an unnaturally deep smile.
  const grin=new THREE.Shape();
  grin.moveTo(-.125,-.035);
  grin.quadraticCurveTo(-.005,-.112,.126,-.018);
  grin.quadraticCurveTo(.08,-.163,-.005,-.155);
  grin.quadraticCurveTo(-.095,-.145,-.125,-.035);
  part(head,new THREE.ShapeGeometry(grin),black,0,0,.146);
  for(let i=0;i<7;i++){
    const x=(i-3)*.024;
    const y=-.073+Math.pow(x/.1,2)*.029+x*.055;
    const tooth=part(head,new THREE.BoxGeometry(.016,.022+(i%3)*.005,.006),paper,x,y,.151);
    tooth.rotation.z=x*2;
  }
  part(head,new THREE.ConeGeometry(.027,.09,4),skin,0,-.025,.155).rotation.x=Math.PI/2;
  detail(head,0,-.18,.075,.083,.048,.052,skin);
  // Stitched garment panels, cuffs and joint creases soften the stick silhouette.
  const seams=new THREE.MeshStandardMaterial({color:0x68756a,roughness:1});
  for(const side of [-1,1]){
    detail(root,side*.24,2.35,0,.105,.13,.11,cloth);
    part(root,new THREE.CylinderGeometry(.063,.062,.09,12),cloth,side*.39,1.48,.05);
    detail(root,side*.44,.54,.14,.073,.13,.045,skin);
    limb(root,[side*.48,.58,.13],[side*.55,.44,.2],.021,skin);
    limb(root,[side*.55,.44,.2],[side*.51,.36,.25],.018,skin);
    for(let i=0;i<4;i++)detail(root,side*.44+(i-1.5)*.033,.43,.159,.018,.025,.021,bruised);
    cord(root,[[side*.13,1.53,.09],[side*.16,1.04,.14],[side*.15,.74,.13]],seams,.005);
    for(let i=0;i<3;i++)cord(root,[[side*.34,1.6+i*.08,.075],[side*.4,1.58+i*.08,.105],[side*.45,1.59+i*.08,.065]],seams,.004);
  }
  for(const x of [-.09,.09])cord(root,[[x,2.31,.25],[x*.8,2.03,.245],[x*.9,1.61,.195]],seams,.005);
  // Back seam and hood make the reversed body readable.
  part(root,new THREE.BoxGeometry(.008,.74,.016),seams,0,1.99,.215);
  const hood=part(root,new THREE.SphereGeometry(.2,8,6),cloth,0,2.4,.13);hood.scale.set(1,1.2,.65);
  const badge=new THREE.Group();badge.position.set(0,2.35,.27);root.add(badge);
  limb(badge,[-.1,0,0],[0,-.4,0],.009,cloth);limb(badge,[.1,0,0],[0,-.4,0],.009,cloth);
  part(badge,new THREE.BoxGeometry(.13,.18,.014),paper,0,-.46,0);
  const clip=part(badge,new THREE.BoxGeometry(.045,.027,.025),seams,0,-.36,.02);
  for(let i=0;i<3;i++)part(badge,new THREE.BoxGeometry(.074,.005,.005),seams,0,-.49-i*.016,.012);
  const safe=world.isSheltered||((x,z)=>x>3.4);
  const patrol=[[0,12],[0,-16],[0,-7],[0,-16]];
  let patrolIndex=0,path=[],pathAge=0;
  let enabled=false,time=0,encounter='none',inspectionTime=0,lean=0;
  function reset(){patrolIndex=0;path=[];pathAge=0;enabled=false;root.visible=false;root.position.set(1.55,0,-14);root.rotation.y=0;time=0;patrolEnd=14;encounter='none';inspectionTime=lean=0;head.position.y=2.83;head.rotation.z=-.44;neck.position.y=neckY;neck.scale.y=1;}
  function reveal(camera){reset();enabled=true;root.visible=true;
    if(camera){root.position.set(0,0,Math.max(-16,camera.position.z-6));encounter='approach';}
  }
  let patrolEnd=14;
  function update(dt,camera,disguised=false){
    if(!enabled)return {moving:false,distance:99,pan:0,caught:false};
    const before=root.position.clone();time+=dt;
    badge.rotation.z=Math.sin(time*1.7)*.045;
    if(encounter==='approach'||encounter==='inspect'){
      if(!disguised||safe(camera.position.x,camera.position.z)||time>18){encounter='done';patrolEnd=-17;}
    }
    const playerDistance=Math.hypot(camera.position.x-root.position.x,camera.position.z-root.position.z);
    if(encounter==='approach'&&playerDistance<1.65){encounter='inspect';inspectionTime=0;}
    if(encounter==='inspect'){
      if(playerDistance>2.2){encounter='approach';inspectionTime=0;}
      else{inspectionTime+=dt;if(inspectionTime>=3.2){encounter='depart';patrolEnd=-17;}}
    }
    lean=THREE.MathUtils.damp(lean,encounter==='inspect'?1:0,5,dt);
    head.position.y=2.83-lean*.9;head.rotation.z=-.44+Math.sin(inspectionTime*1.9)*lean*.17;
    neck.position.y=neckY-lean*.42;neck.scale.y=1-lean*.7;
    // Patrol both the short route and backstage; amber rooms remain safe.
    let targetX=0,targetZ=patrolEnd;
    if(world.navigation){
      [targetX,targetZ]=patrol[patrolIndex];
      if(Math.hypot(root.position.x-targetX,root.position.z-targetZ)<.6){patrolIndex=(patrolIndex+1)%patrol.length;[targetX,targetZ]=patrol[patrolIndex];}
    }else if(Math.abs(root.position.z-patrolEnd)<.5)patrolEnd=patrolEnd===14?-17:14;
    if(!disguised){
      if(safe(camera.position.x,camera.position.z)){targetX=1.5;targetZ=camera.position.z<-12?-16:-7;}
      else{targetX=camera.position.x;targetZ=camera.position.z;}
    }
    if(encounter==='approach'){targetX=THREE.MathUtils.clamp(camera.position.x+.65,-2,2);targetZ=camera.position.z;}
    if(encounter==='inspect'){targetX=root.position.x;targetZ=root.position.z;root.rotation.y=Math.atan2(camera.position.x-root.position.x,camera.position.z-root.position.z);}
    if(encounter==='depart'&&playerDistance>5)encounter='done';
    if(world.navigation&&encounter!=='approach'&&encounter!=='inspect'){
      pathAge-=dt;
      if(pathAge<=0){path=world.navigation.route(root.position.x,root.position.z,targetX,targetZ);pathAge=.65;}
      while(path.length&&Math.hypot(root.position.x-path[0].x,root.position.z-path[0].z)<.14)path.shift();
      if(path.length){targetX=path[0].x;targetZ=path[0].z;}
      else if(Math.hypot(root.position.x-targetX,root.position.z-targetZ)>.75){targetX=root.position.x;targetZ=root.position.z;}
    }
    const dx=targetX-root.position.x,dz=targetZ-root.position.z,d=Math.hypot(dx,dz);
    const clear=(x,z)=>!solids.some(s=>!s.disabled&&Math.abs(x-s.x)<s.w/2+.3&&Math.abs(z-s.z)<s.d/2+.3);
    if(time>(encounter==='approach'?1:4)&&d>.08){
      const step=Math.min(dt*(disguised?1.4:1.7),d);
      const x=THREE.MathUtils.clamp(root.position.x+dx/d*step,-2.2,world.navigation?9.4:2.2),z=THREE.MathUtils.clamp(root.position.z+dz/d*step,world.navigation?-27.4:-18.3,14);
      if(clear(x,root.position.z))root.position.x=x;
      if(clear(root.position.x,z))root.position.z=z;
      root.rotation.y=Math.atan2(dx,dz);
    }
    const offset=root.position.clone().sub(camera.position),horizontal=Math.hypot(offset.x,offset.z);
    const ray=new THREE.Ray(new THREE.Vector3(root.position.x,1.5,root.position.z),new THREE.Vector3(-offset.x,0,-offset.z).normalize());
    const blocked=solids.some(s=>{if(s.disabled)return false;const hit=ray.intersectBox(new THREE.Box3(new THREE.Vector3(s.x-s.w/2,0,s.z-s.d/2),new THREE.Vector3(s.x+s.w/2,3.4,s.z+s.d/2)),new THREE.Vector3());return hit&&hit.distanceTo(ray.origin)<horizontal;});
    const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
    return {moving:root.position.distanceToSquared(before)>1e-10,distance:offset.length(),pan:offset.normalize().dot(right),encounter, caught:!disguised&&time>4&&horizontal<.72&&!blocked&&!safe(camera.position.x,camera.position.z)};
  }
  function closeUp(camera){
    // Show the actual model's face, rather than a separate jump-scare image.
    root.rotation.y=0;
    camera.position.set(root.position.x+.19,2.83,root.position.z+.62);
    camera.lookAt(root.position.x+.19,2.8,root.position.z);
  }
  reset();return {reset,reveal,update,closeUp};
}
