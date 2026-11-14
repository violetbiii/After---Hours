import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import {surface,cord} from './model-detail.js';
export function createOffice(host){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x080d10);scene.fog=new THREE.FogExp2(0x080d10,.035);
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.append(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(53,innerWidth/innerHeight,.1,35);camera.position.set(0,2.35,5.5);
 const look=new THREE.Vector3(0,1.5,-1.7),desired=new THREE.Vector3(0,2.35,5.5),aim=new THREE.Vector3(0,1.5,-1.7);
 const materials={wall:surface(0x73796c,'skin'),wood:surface(0x594634,'skin'),metal:new THREE.MeshStandardMaterial({color:0x263a39,metalness:.65,roughness:.42}),paper:surface(0xc8bea4,'skin'),black:new THREE.MeshStandardMaterial({color:0x101716,roughness:.8}),red:surface(0x713b2c,'fabric'),cloth:surface(0x314b47),skin:surface(0xad9e82,'skin')};
 function box(w,h,d,x,y,z,mat=materials.wood,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 function oval(x,y,z,sx,sy,sz,mat,parent=scene){const m=new THREE.Mesh(new THREE.SphereGeometry(1,28,20),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
 function text(words,w,h,x,y,z,{size=36,bg='#182725',fg='#d5cbb3',rotate=0}={}){
  const c=document.createElement('canvas');c.width=768;c.height=Math.round(768*h/w);const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#88836b';ctx.lineWidth=3;ctx.strokeRect(10,10,c.width-20,c.height-20);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${size}px monospace`;words.split('\n').forEach((line,i,all)=>ctx.fillText(line,384,c.height/2+(i-(all.length-1)/2)*(size+16)));const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,roughness:.9}));mesh.position.set(x,y,z);mesh.rotation.y=rotate;scene.add(mesh);return mesh;
 }
 scene.add(new THREE.HemisphereLight(0x96b5be,0x292018,.75));
 box(8,.18,9,0,-.1,0,materials.metal);box(8,3.9,.15,0,1.95,-3.5,materials.wall);box(.15,3.9,9,-4,1.95,0,materials.wall);box(.15,3.9,9,4,1.95,0,materials.wall);box(8,.12,9,0,3.95,0,materials.wall);
 for(let z=-3;z<5;z++)for(let x=-4;x<4;x++){
  const mat=new THREE.MeshStandardMaterial({color:(x+z)%2?0x3c4744:0x52605a,roughness:.48});box(.98,.01,.98,x+.5,.003,z+.5,mat);
 }
 // Wainscoting, ceiling joists and exposed pipes.
 for(let x=-3.8;x<4;x+=.4){box(.385,1.03,.05,x,.54,-3.38,materials.cloth);box(.05,.05,.06,x,1.1,-3.34,materials.paper);}
 for(let x=-3;x<=3;x+=1.5)box(.08,.12,8,x,3.83,0,materials.metal);
 for(const x of [3.5,3.7]){const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,3.6,12),materials.metal);pipe.position.set(x,1.8,-3.15);scene.add(pipe);}
 // Hatch: deep dark inset framed by battered timber, with vertical wired glass above.
 box(3.45,2.12,.18,0,2.16,-3.34,materials.black);
 for(const x of [-1.8,1.8])box(.12,2.35,.23,x,2.15,-3.16,materials.wood);
 box(3.7,.12,.23,0,3.3,-3.16,materials.wood);box(3.9,.16,.7,0,1.02,-3,materials.wood);
 for(let x=-1.65;x<1.8;x+=.15)box(.012,.53,.025,x,3,-3.12,materials.metal);
 text('LOST & FOUND',2.8,.43,0,3.62,-3.31,{size:70});
 text('ST. ORISON SCHOOL  /  EST. 1986',2.7,.18,0,3.33,-3.02,{size:30,bg:'#1b2827'});
 text('STAFF ONLY',.86,.22,2.83,2.7,-3.18,{size:54});
 box(1.35,2.7,.15,2.8,1.35,-3.27,materials.cloth);box(.08,.08,.1,2.32,1.25,-3.13,materials.paper);
 text('ALL ITEMS MUST\nBE CLAIMED BY 23:00',1.25,.6,-2.83,2.8,-3.3,{size:36,bg:'#b6ad92',fg:'#353d35'});
 // Broad counter, inset green blotter, ledger, brass bell and desk lamp.
 box(5.9,.18,1.55,0,.95,.1,materials.wood);box(5.65,.82,1.3,0,.43,.15,materials.cloth);box(5.92,.035,.04,0,1.02,.88,materials.paper);
 box(1.55,.015,.86,0,1.05,.03,materials.cloth);
 const ledger=box(.7,.08,.65,-1.6,1.08,.2,materials.paper);ledger.rotation.y=-.16;
 for(let i=0;i<7;i++)box(.53,.003,.008,-1.6,1.124,-.02+i*.065,materials.wood);
 const brass=new THREE.MeshStandardMaterial({color:0xa89058,metalness:.8,roughness:.3});oval(1.45,1.11,.38,.19,.06,.19,brass);oval(1.45,1.18,.38,.14,.09,.14,brass);box(.035,.06,.035,1.45,1.29,.38,brass);
 box(.4,.05,.3,-2.35,1.06,.05,materials.metal);cord(scene,[[-2.35,1.07,.05],[-2.42,1.65,-.1],[-1.95,1.94,-.1]],brass,.026);
 const shade=box(.73,.17,.3,-1.95,1.94,-.1,materials.cloth);const bulb=box(.6,.025,.25,-1.95,1.84,-.1,new THREE.MeshStandardMaterial({color:0xffdf9c,emissive:0xffcd72,emissiveIntensity:2}));
 const lamp=new THREE.SpotLight(0xffd49a,40,10,.95,.7,1.8);lamp.position.set(-1.95,1.82,-.1);lamp.target.position.set(.1,.8,-.1);lamp.castShadow=true;lamp.shadow.mapSize.set(1024,1024);lamp.shadow.bias=-.001;scene.add(lamp,lamp.target);
 const fill=new THREE.PointLight(0xefb574,8,7);fill.position.set(0,2.8,2);scene.add(fill);
 const hall=new THREE.PointLight(0x8abec5,12,7);hall.position.set(0,2.8,-2.8);scene.add(hall);
 const redLight=new THREE.PointLight(0xdb5739,5,5);redLight.position.set(3,1.5,-1);scene.add(redLight);
 // Property shelves stand to the left. The cupboard is never a menu backdrop.
 const shelf=new THREE.Group();shelf.position.set(-3,0,-1.6);scene.add(shelf);
 for(const x of [-.8,.8])box(.09,2.8,.8,x,1.4,0,materials.metal,shelf);
 for(const y of [.25,1.05,1.85,2.65])box(1.7,.07,.9,0,y,0,materials.wood,shelf);
 for(let i=0;i<5;i++){const x=(i%2)*.8-.4,y=Math.floor(i/2)*.8+.48;box(.62,.38,.6,x,y,.02,materials.wood,shelf);box(.25,.12,.01,x,y,.327,materials.paper,shelf);}
 text('UNCLAIMED',1.65,.24,-3,3,-1.58,{size:64});
 box(1.1,1.5,.7,3,.77,-1,materials.metal);box(.87,.55,.04,3,1.25,-.62,materials.black);text('DISPOSAL\nNO RETRIEVAL',1,.45,3,1.95,-.6,{size:46,bg:'#522f25',fg:'#e4b592'});
 for(let i=0;i<7;i++){const p=box(.2,.004,.28,Math.sin(i*31)*2.8,.02,1.1+i*.3,materials.paper);p.rotation.y=i*1.7;}
 // Clock with physically modelled hands.
 oval(2.8,3.25,-3.18,.25,.25,.035,materials.paper);const hand=box(.012,.18,.015,2.8,3.29,-3.12,materials.black);hand.rotation.z=-.6;box(.15,.014,.015,2.86,3.25,-3.12,materials.black);
 const visitor=new THREE.Group();visitor.position.set(0,0,-2.94);scene.add(visitor);
 oval(0,1.56,0,.43,.65,.18,materials.cloth,visitor);oval(0,2.3,0,.23,.32,.2,materials.skin,visitor);
 for(const x of [-.09,.09]){oval(x,2.34,.175,.056,.032,.018,materials.black,visitor);oval(x,2.344,.195,.012,.012,.008,materials.paper,visitor);}
 oval(0,2.25,.205,.035,.07,.035,materials.skin,visitor);cord(visitor,[[-.08,2.17,.18],[0,2.15,.21],[.08,2.17,.18]],materials.black,.009);
 for(const x of [-.56,.56]){oval(x,1.11,.1,.13,.055,.15,materials.skin,visitor);for(let i=0;i<4;i++)oval(x+(i-1.5)*.05,1.09,.22,.022,.028,.12,materials.skin,visitor);}
 visitor.visible=false;
 const props=new THREE.Group();props.position.set(0,1.1,.05);scene.add(props);
 const stored=new THREE.Group();scene.add(stored);
 function item(id){
  const g=new THREE.Group();
  if(id==='coat'){
   const m=surface(0xbda158);oval(0,.17,0,.28,.16,.24,m,g);oval(0,.29,-.08,.12,.08,.12,m,g);for(const x of [-.3,.3])oval(x,.1,.04,.18,.06,.12,m,g);for(let i=0;i<3;i++)oval(0,.2,.12+i*.04,.015,.014,.015,brass,g);
  }else if(id==='voice'){
   const glass=new THREE.MeshPhysicalMaterial({color:0xa7d4c1,transparent:true,opacity:.28,roughness:.1,metalness:.15,side:THREE.DoubleSide});const jar=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.39,28),glass);jar.position.y=.21;g.add(jar);const lid=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.04,28),brass);lid.position.y=.43;g.add(lid);oval(0,.23,0,.065,.12,.065,new THREE.MeshStandardMaterial({color:0x9cffd2,emissive:0x57b98a,emissiveIntensity:2}),g);
  }else if(id==='shadow'){
   const m=materials.black;box(.5,.025,.36,0,.03,0,m,g);for(let i=0;i<5;i++){const f=box(.035,.012,.32,-.14+i*.065,.05,.17,m,g);f.rotation.y=(i-2)*.14;}
  }else if(id==='phone'){
   const phone=box(.22,.035,.43,0,.03,0,materials.black,g);const screen=box(.19,.004,.36,0,.052,0,new THREE.MeshStandardMaterial({color:0x6eb9ac,emissive:0x4a9b94,emissiveIntensity:1.1}),g);cord(g,[[-.07,.059,-.16],[.04,.059,-.04],[-.02,.059,.08],[.08,.059,.16]],materials.black,.004);
  }else if(id==='mask'){
   const plush=surface(0xb7a37a);oval(0,.32,0,.32,.29,.25,plush,g);for(const x of [-.14,.14]){oval(x,.36,.2,.105,.12,.06,materials.black,g);oval(x,.38,.25,.035,.055,.016,brass,g);cord(g,[[x,.55,0],[x*1.3,.76,-.02],[x*1.6,.8,0]],materials.cloth,.018);}cord(g,[[-.18,.2,.19],[0,.14,.25],[.18,.2,.19]],materials.black,.012);
  }else{
   box(.4,.012,.26,0,.03,0,materials.paper,g);box(.1,.004,.13,-.1,.04,0,materials.cloth,g);for(let i=0;i<4;i++)box(.16,.004,.009,.07,.04,-.06+i*.035,materials.wood,g);
  }return g;
 }
 const apparition=new THREE.Group();apparition.position.set(1.3,0,-2.5);scene.add(apparition);
 oval(0,1.5,0,.22,.7,.15,materials.black,apparition);oval(0,2.25,0,.15,.24,.13,materials.paper,apparition);
 for(const x of [-.06,.06])oval(x,2.28,.12,.03,.03,.012,materials.black,apparition);
 apparition.visible=false;
 let current=null,view='desk',pointer={x:0,y:0},turn=0,tilt=0,effect=null,inspectionEnabled=false;
 function rotateItem(dx,dy=0){if(current){turn+=dx;tilt=THREE.MathUtils.clamp(tilt+dy,-1.2,1.2);}}
 function inspectEffect(id,part){effect=id+':'+part;apparition.visible=id==='mask'&&part==='scare';if(apparition.visible)setView('desk');if(id==='coat'&&part==='scare')tilt=1;if(id==='id')turn=Math.PI;}
 function clearEffect(){effect=null;apparition.visible=false;}
 function setInspection(enabled){inspectionEnabled=enabled;if(!enabled)clearEffect();}
 let drag=null;
 renderer.domElement.addEventListener('pointerdown',e=>{if(!inspectionEnabled||view!=='item')return;drag={x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{if(!drag||!inspectionEnabled)return;rotateItem((e.clientX-drag.x)*.012,(e.clientY-drag.y)*.008);drag={x:e.clientX,y:e.clientY};});
 renderer.domElement.addEventListener('pointerup',()=>drag=null);renderer.domElement.addEventListener('pointercancel',()=>drag=null);

 function showItem(id){if(current)props.remove(current);current=id?item(id):null;turn=tilt=0;clearEffect();if(current)props.add(current);}
 function setStored(ids){while(stored.children.length)stored.remove(stored.children[0]);ids.forEach((id,i)=>{const g=item(id);g.position.set(-3+(i%2)*.5-.25,1.1+Math.floor(i/2)*.8,-1.35);g.scale.setScalar(.65);stored.add(g);});}
 function setView(v){view=v;if(v==='shelf'){desired.set(-.7,2.15,3);aim.set(-2.9,1.6,-1.3);}else if(v==='item'){desired.set(.15,2.15,1.9);aim.set(0,1.13,.05);}else if(v==='chute'){desired.set(.8,2.1,3);aim.set(2.9,1.3,-.9);}else{desired.set(0,2.35,5.5);aim.set(0,1.5,-1.7);}}
 function setVisitor(show,index=0){visitor.visible=show;for(const part of visitor.children){if(part.position.y>2||part.type==='Mesh'&&part.geometry.type==='TubeGeometry')part.visible=index!==4;}visitor.scale.set(1,index===5?1.15:index===1?.88:1,1);visitor.rotation.z=index===2?.07:0;}
 const dustPos=new Float32Array(130*3);for(let i=0;i<130;i++){dustPos[i*3]=Math.sin(i*91)*3.6;dustPos[i*3+1]=(i%30)/8;dustPos[i*3+2]=Math.cos(i*71)*3;}
 const dust=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(dustPos,3)),new THREE.PointsMaterial({color:0xa5b4ac,size:.018,transparent:true,opacity:.35,depthWrite:false}));scene.add(dust);
 function update(dt,time,pressure=0,flash=0){
  const k=1-Math.exp(-dt*4);camera.position.lerp(desired,k);look.lerp(aim,k);camera.lookAt(look.x+pointer.x*.06,look.y+pointer.y*.03,look.z);
  visitor.position.y=Math.sin(time*.7)*.012;visitor.rotation.y=Math.sin(time*.25)*.025;
  stored.children.forEach((g,i)=>{g.rotation.z=Math.sin(time*(1+i*.1))*.015*(pressure/25);g.position.z=-1.35+Math.max(0,pressure-50)/220;});
  if(current){current.rotation.y=turn+Math.sin(time*.25)*.04;current.rotation.x=tilt;if(view==='item'&&current.children.length>1)current.position.y=Math.sin(time*1.4)*.003;}
  hall.intensity=12+Math.sin(time*1.3)*.4;lamp.intensity=(effect==='voice:scare'?6:40)+flash*45;lamp.position.x=effect==='shadow:scare'?-3:-1.95;redLight.intensity=5+pressure*.045;dust.rotation.y=time*.004;renderer.render(scene,camera);
 }
 const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);};window.addEventListener('resize',resize);
 host.addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth-.5;pointer.y=.5-e.clientY/innerHeight;});
 return {showItem,setStored,setView,setVisitor,rotateItem,inspectEffect,clearEffect,setInspection,update,renderer};
}
