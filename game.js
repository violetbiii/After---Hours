// Milestone one: movement, solid walls, a flashlight and a tiny escape objective.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import {createCreature} from './creature.js';
import {createAudio} from './audio.js';
import {createExploration} from './exploration.js';
import {createCostumeState} from './costume.js';
import {createMascot} from './mascot.js';
import {buildBackstage,isSheltered} from './backstage.js';
import {createNavigation} from './navigation.js';
import {dressEnvironment} from './environment-art.js';
const $ = (id) => document.getElementById(id);
const audio=createAudio();
let muted=false;
$('volume').oninput=(event)=>audio.setVolume(event.target.value);
function toggleMute(){muted=!muted;audio.setMuted(muted);$('mute').textContent=muted?'UNMUTE':'MUTE';$('mute').setAttribute('aria-pressed',String(muted));}
$('mute').onclick=toggleMute;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x090f11);
scene.fog = new THREE.FogExp2(0x090f11, .035);
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, .1, 65);
camera.position.set(0, 1.65, 12);
camera.rotation.order = 'YXZ';
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('view').append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0x96b8bb, 0x27241b, .6));

const solids = [];
function box(w,h,d,x,y,z,color,solid=false){
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.9}));
  mesh.position.set(x,y,z);scene.add(mesh);
  if(solid) solids.push({x,z,w,d});
  return mesh;
}
function sign(text,x,y,z,w=1.5,color='#bec6b3'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#152021';ctx.fillRect(0,0,512,128);
  ctx.fillStyle=color;ctx.font='bold 44px monospace';ctx.textAlign='center';ctx.fillText(text,256,80);
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas)}));
  mesh.position.set(x,y,z);scene.add(mesh);return mesh;
}
box(6,.2,34,0,-.1,-2,0x343c3b);
box(6,.2,34,0,3.3,-2,0x263332);
box(.25,3.4,34,-3,1.6,-2,0x52615a,true);
// Gap at z=-7 opens into Classroom 111.
box(.25,3.4,2,3,1.6,-18,0x52615a,true);
box(.25,3.4,7,3,1.6,-11.5,0x52615a,true);
box(.25,.7,2,3,2.95,-16,0x52615a);
box(.25,3.4,21,3,1.6,4.5,0x52615a,true);
box(.25,.7,2,3,2.95,-7,0x52615a);
box(7,.2,10,6.5,-.1,-7,0x303938);
box(7,.2,10,6.5,3.3,-7,0x263332);
box(.25,3.4,4,10,1.6,-10,0x52615a,true);
box(.25,3.4,4,10,1.6,-4,0x52615a,true);
box(.25,3.4,2,10,1.6,-7,0x52615a,true);
box(7,3.4,.25,6.5,1.6,-12,0x52615a,true);
box(7,3.4,.25,6.5,1.6,-2,0x52615a,true);
// An open door rests along the classroom wall, leaving the entrance clear.
box(1.7,2.5,.12,4,1.25,-8.15,0x132c2a,true);
box(.05,2.6,.1,2.8,1.3,-8,0x9da992);
box(.05,2.6,.1,2.8,1.3,-6,0x9da992);
for(const x of [5,7.5])for(const z of [-4,-10]){
  box(1.5,.12,.8,x,.8,z,0x615344,true);
  for(const dx of [-.6,.6])box(.07,.8,.65,x+dx,.4,z,0x24312e);
  box(.65,.1,.65,x,.48,z+.8,0x293e38,true);
  box(.65,.7,.08,x,.78,z+1.08,0x293e38);
}
box(3.8,1.15,.06,6.5,1.9,-11.8,0x132622);
sign('TAKE IT OFF IN HERE',6.5,2,-11.75,3);
const roomLight=new THREE.PointLight(0xbcd1a8,1,10);roomLight.position.set(6.5,2.9,-7);scene.add(roomLight);
box(.55,.8,.15,5.5,1.45,-27.76,0x202d2a);
const powerLever=box(.07,.3,.18,5.5,1.4,-27.62,0xb0754c);
const powerLabel=sign('EXIT POWER SWITCH',5.5,2.05,-27.55,1.5);
const powerGlow=new THREE.PointLight(0xd66e33,1.5,3);powerGlow.position.set(5.5,1.7,-27.4);scene.add(powerGlow);
box(6,3.4,.25,0,1.6,15,0x3a4845,true);
box(6,3.4,.25,0,1.6,-19,0x3a4845,true);
for(let z=-18;z<15;z+=2){
  box(6,.008,.024,0,.008,z,0x172625);
  for(let x=-2;x<=2;x+=2)box(.024,.008,2,x,.008,z+1,0x172625);
}
const lights=[];
for(let z=10;z>-19;z-=7){
  box(1.7,.08,.32,0,3.12,z,0xc9dbb4);
  const light=new THREE.PointLight(0xc5dbb0,12,10,2);light.position.set(0,2.9,z);scene.add(light);lights.push(light);
}
for(const side of [-1,1]){
  if(side===-1)box(.07,.18,34,side*2.84,1,-2,0x253d38);
  for(let z=7;z>=-14;z-=7){
    if(side===1&&z===-7){const label=sign('111 / REFUGE',2.65,2.8,-7,1.5);label.rotation.y=-Math.PI/2;continue;}
    box(.12,2.45,1.65,side*2.8,1.225,z,0x132c2a);
    box(.14,.65,.85,side*2.71,1.8,z,0x152022);
    box(.22,.08,.08,side*2.64,1.05,z+.55,0xb8b69b);
    const label=sign('ROOM '+(104+Math.abs(z)),side*2.65,2.65,z,.9);label.rotation.y=-side*Math.PI/2;
  }
}
box(1.2,.1,.65,-1.9,.8,3,0x645342,true);
box(.08,.8,.5,-2.35,.4,3,0x202c2b);
box(.08,.8,.5,-1.45,.4,3,0x202c2b);
const card=box(.26,.02,.18,-1.8,.87,3,0xe0e6c1);
const glow=new THREE.PointLight(0xd4dfa1,.8,2);glow.position.set(-1.8,1.1,3);scene.add(glow);
const note=sign('THEY DO NOT CHECK INSIDE',-1.9,.86,2.78,.85);note.rotation.x=-Math.PI/2;
box(2.1,2.7,.12,0,1.35,-18.8,0x1a3c32);
sign('EXIT',0,2.95,-18.68,1.2,'#b7ffc0');
sign('WEST WING',0,2.5,-18.67,1.6);
const exitLight=new THREE.PointLight(0x5fae72,5,6);exitLight.position.set(0,2.6,-18);scene.add(exitLight);

const reader=box(.3,.4,.1,1.4,1.35,-18.65,0x44251c);
sign('NO POWER',1.4,1.8,-18.58,.95,'#e6ac83');
const readerLabel=scene.children[scene.children.length-1];

const torch=new THREE.SpotLight(0xe7efd3,28,22,.48,.6,1.5);
scene.add(torch,torch.target);
torch.castShadow=true;torch.shadow.mapSize.set(1024,1024);torch.shadow.bias=-.0005;
const backstage=buildBackstage({scene,box,sign,solids});
const creature=createCreature(scene,solids,{navigation:createNavigation(solids),isSheltered});
const costume=createCostumeState();
const mascot=createMascot(scene);
sign('MORROW / MASCOT',1.65,2.8,10.2,1.9);
const refuge=sign('111 / REFUGE',2.64,2.8,-7,1.5);refuge.rotation.y=-Math.PI/2;
let active=false,hasCard=false,powered=false,won=false,caught=false,scareTime=0,yaw=0,pitch=0,elapsed=0;
const keys=new Set();
const exploration=createExploration();
let encounterPhase='none';
let phoneOpen=false,toast='',toastTime=0,lastMessageCount=-1;
const drawers=[];
for(const x of [5,7.5])for(const z of [-4,-10])addDrawer(x,z,'CLASSROOM DESK');
function addDrawer(x,z,label){
  const mesh=box(.75,.18,.42,x,.63,z+.13,0x37453c);
  const handle=box(.24,.04,.04,x,.63,z+.36,0xb9b598);
  drawers.push({x,z,label,mesh,handle});
}
function syncItems(){
  const state=exploration.state;
  drawers.forEach((d,i)=>{const open=state.opened.has(i);d.mesh.position.z=d.z+.13+(open?.32:0);d.handle.position.z=d.z+.36+(open?.32:0);});
  const id=drawers[state.idDrawer];
  card.position.set(id.x,.74,id.z+.48);
  card.visible=state.opened.has(state.idDrawer)&&!state.hasId;glow.visible=false;

}
function renderPhone(){
  const state=exploration.state;
  $('phone-badge').textContent=state.unread?`TAB · ${state.unread} NEW MESSAGES`:'TAB · PHONE';
  $('optional').hidden=true;
  if(lastMessageCount!==state.messages.length){
    $('messages').replaceChildren();
    for(const message of state.messages){const item=document.createElement('div');item.className='message';const sender=document.createElement('small');sender.textContent=message.sender;const text=document.createElement('p');text.textContent=message.text;item.append(sender,text);$('messages').append(item);}
    $('messages').scrollTop=$('messages').scrollHeight;lastMessageCount=state.messages.length;
  }
}
function setPhone(value){if(value&&costume.state.worn){notify('Remove the costume to read your phone.');return;}phoneOpen=value;$('phone').hidden=!value;if(value)exploration.read();renderPhone();}
function notify(text){toast=text;toastTime=3;}
function nearestDrawer(){
  const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
  let match=-1,best=1.8;
  drawers.forEach((d,i)=>{
    if((d.x>3)!==(camera.position.x>3))return;
    const offset=new THREE.Vector3(d.x-camera.position.x,0,d.z-camera.position.z),distance=offset.length();
    if(distance<best&&offset.normalize().dot(forward)>.3){match=i;best=distance;}
  });return match;
}
function nearMascot(){return !costume.state.owned&&Math.hypot(camera.position.x-1.65,camera.position.z-10.4)<2.4;}
function sheltered(){return isSheltered(camera.position.x,camera.position.z);}
function toggleCostume(){
  if(!costume.toggle()){notify(costume.state.separated?'The tether is cut. You cannot wear it again.':'Find the mascot costume first.');return;}
  setPhone(false);notify(costume.state.worn?'DISGUISED · They mistake you for one of them.':'EXPOSED · Recover control in Classroom 111.');
}
function updateCostume(dt){
  const report=costume.update(encounterPhase==='inspect'?0:dt,sheltered());
  const state=costume.state;
  $('mask').hidden=!state.worn;
  $('suit-hand').hidden=!state.worn||state.influence<35;
  $('suit-hand').classList.toggle('reaching',state.influence>=75);
  $('control-meter').value=state.influence;
  $('suit-status').textContent=state.separated?'TETHER CUT · Stay clear of the watcher':!state.owned?'E · Find the mascot costume':state.worn?(state.influence>=75?'IT IS WALKING FOR YOU · C TO REMOVE':state.influence>=35?'THAT WAS NOT YOUR HAND · C TO REMOVE':'DISGUISED · C to remove'):sheltered()?'AMBER SHELTER · Your control is recovering':'EXPOSED · C to wear costume';
  if(report.firstMovement){notify('Your hand waved. You did not move it.');exploration.message('COSTUME TAG','If the glove moves first, take it off. Do not wait for the zipper to close.');}
  if(report.drift){const dx=-Math.sin(yaw)*dt*.55,dz=-Math.cos(yaw)*dt*.55;if(canMove(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(canMove(camera.position.x,camera.position.z+dz))camera.position.z+=dz;}
  if(report.takenOver)finish('TAKEN OVER','Your hands stop listening.<br>Morrow returns to its place by reception. With you inside.');
}
function finish(title,body){won=true;setPhone(false);$('mask').hidden=true;$('suit-hand').hidden=true;$('intro').innerHTML=title+'<br>'+body;$('objective').textContent=title;pause();document.exitPointerLock?.();}
const environment=dressEnvironment(scene,box,sign);
scene.traverse(o=>{if(o.isMesh){o.receiveShadow=true;if(o.geometry.type!=='PlaneGeometry')o.castShadow=true;}});
syncItems();renderPhone();
function pause(){setPhone(false);$('mask').hidden=true;if(caught){scareTime=1.5;$('blackout').style.opacity='1';}audio.stop();active=false;keys.clear();$('menu').classList.remove('hidden');$('start').firstChild.textContent=caught?'TRY AGAIN ':won?'PLAY AGAIN ':'RESUME ';}
function reset(){backstage.reset();encounterPhase='none';costume.reset();mascot.visible=true;$('mask').hidden=true;$('suit-hand').hidden=true;exploration.reset();lastMessageCount=-1;toastTime=0;setPhone(false);syncItems();camera.position.set(0,1.65,12);yaw=pitch=0;hasCard=won=powered=caught=false;scareTime=0;$('blackout').style.opacity='0';setPower(false);torch.visible=true;creature.reset();card.visible=glow.visible=false;$('objective').textContent='Find Morrow, the moth costume beside reception.';$('intro').innerHTML='They do not check inside.<br>But something inside is checking you.';}
$('start').onclick=()=>{
  if(won||caught)reset();audio.start().then(ok=>{if(!ok)$('status').textContent='Audio unavailable; you can still play.';});active=true;$('menu').classList.add('hidden');
  try{const request=renderer.domElement.requestPointerLock?.();request?.catch(()=>{});}catch{}
};
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&active)pause();});
document.addEventListener('mousemove',(e)=>{if(active&&document.pointerLockElement){yaw-=e.movementX*.002;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.002,-1.2,1.2);}});
document.addEventListener('keydown',(e)=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
  if(e.code==='KeyM'&&!e.repeat){toggleMute();return;}
  if(e.code==='Escape'){pause();document.exitPointerLock?.();return;}
  if(e.code==='Tab'){e.preventDefault();if(active&&!e.repeat)setPhone(!phoneOpen);return;}
  if(!active)return;keys.add(e.code);
  if(e.code==='KeyC'&&!e.repeat){toggleCostume();return;}
  if(e.code==='KeyF'&&!e.repeat)torch.visible=!torch.visible;
  if(e.code==='KeyE'&&!e.repeat)interact();
});
document.addEventListener('keyup',(e)=>keys.delete(e.code));
window.addEventListener('blur',()=>{if(active)pause();});
function nearExit(){return camera.position.z<-17&&Math.abs(camera.position.x)<1.5;}
function nearPower(){return Math.hypot(camera.position.x-5.5,camera.position.z+27.6)<1.8;}
function setPower(value){
  powered=value;roomLight.intensity=value?13:1;
  powerGlow.color.setHex(value?0x79dc93:0xd66e33);
  powerLever.rotation.x=value?-.7:.7;
  reader.material.color.setHex(value?0x629978:0x44251c);
  readerLabel.visible=!value;
}
setPower(false);
function interact(){
  if(phoneOpen){notify('TAB · Put your phone away to interact.');return;}
  if(nearMascot()){costume.take();mascot.visible=false;creature.reveal(camera);encounterPhase='approach';notify('Something noticed the costume. Keep it on.');$('objective').textContent='Search Classroom 111 for your student ID.';return;}
  if(!costume.state.owned){notify('Find the moth costume beside reception first.');return;}
  if(nearExit()&&hasCard&&powered){
    if(costume.state.worn)finish('ENDING 01 / STILL WEARING IT','You reach the street.<br>The zipper has disappeared.');
    else finish('ENDING 02 / BORROWED TIME','You leave the costume behind.<br>From the university window, your empty glove waves goodbye.');
    return;
  }
  if(costume.state.worn){notify('C · Remove the costume to use your hands. Classroom 111 is a refuge.');return;}
  const drawer=nearestDrawer();
  if(drawer>=0){
    const found=exploration.search(drawer);syncItems();renderPhone();
    if(found==='opened')notify('Drawer opened. E · Examine the contents.');
    else if(found==='id'){hasCard=true;$('objective').textContent=powered?'ID found. Reach the exit.':'ID found. Find the power switch in the room near the exit.';notify('STUDENT ID COLLECTED');}
    else notify('Old worksheets. Nothing else here.');
  }
  else if(nearPower()){
    if(!hasCard){notify('Find your student ID in Classroom 111 first.');return;}
    if(!powered){setPower(true);audio.power();notify('POWER RESTORED · Get to the exit.');$('objective').textContent='Use your student ID at the exit.';}
  }
  else if(nearExit())notify(hasCard?'Find the power switch in the room near this exit.':'Find your student ID in Classroom 111.');

}
function catchPlayer(){
  setPhone(false);caught=true;scareTime=0;active=false;keys.clear();
  creature.closeUp(camera);torch.visible=true;
  audio.power();
  $('hint').textContent='';$('mask').hidden=true;$('suit-hand').hidden=true;$('objective').textContent='It recognised you.';
  $('intro').innerHTML='It was closer than you thought.<br>Wear Morrow in the corridor. Take it off in the refuge.';
}
function canMove(x,z){return !solids.some(s=>!s.disabled&&Math.abs(x-s.x)<s.w/2+.24&&Math.abs(z-s.z)<s.d/2+.24);}
let previous=performance.now();
function frame(now){
  requestAnimationFrame(frame);const dt=Math.min((now-previous)/1000,.05);previous=now;elapsed+=dt;
  const oldX=camera.position.x,oldZ=camera.position.z;
  if(active){
    yaw+=((keys.has('ArrowLeft')?1:0)-(keys.has('ArrowRight')?1:0))*dt*1.7;
    pitch=THREE.MathUtils.clamp(pitch+((keys.has('ArrowUp')?1:0)-(keys.has('ArrowDown')?1:0))*dt,-1.2,1.2);
    exploration.update(dt);if(phoneOpen)exploration.read();renderPhone();toastTime=Math.max(0,toastTime-dt);
    const forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0);
    const strafe=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);
    const length=Math.hypot(forward,strafe)||1;
    const dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*strafe)/length*dt*2.5;
    const dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*strafe)/length*dt*2.5;
    if(canMove(camera.position.x+dx,camera.position.z))camera.position.x+=dx;
    if(canMove(camera.position.x,camera.position.z+dz))camera.position.z+=dz;
    updateCostume(dt);
    const target=nearestDrawer();
    $('hint').textContent=toastTime>0?toast:phoneOpen?'TAB · LOWER PHONE':nearMascot()?'E · CLIMB INTO MORROW':nearExit()?(hasCard&&powered?'E · LEAVE THE BUILDING':'Exit requires your ID and power.'):costume.state.worn?(sheltered()?'C · STEP OUT OF MORROW TO SEARCH':'C · REMOVE COSTUME'):nearPower()?(powered?'POWER RESTORED':'E · TURN ON EXIT POWER'):target>=0?`E · ${exploration.state.opened.has(target)?'SEARCH':'OPEN'} ${drawers[target].label}`:sheltered()?'Search the room. The ghost waits outside.':'';
  }
  if(!caught)camera.rotation.set(pitch,yaw,0);
  if(caught&&scareTime<1.5){
    scareTime+=dt;
    $('blackout').style.opacity=String(Math.min(1,Math.max(0,(scareTime-.45)/.45)));
    if(scareTime>=1.5){pause();document.exitPointerLock?.();}
  }
  torch.position.copy(camera.position);
  if(active){
    const sound=creature.update(dt,camera,costume.state.worn);
    if(sound.encounter!==encounterPhase){
      encounterPhase=sound.encounter||'none';
      if(encounterPhase==='inspect')notify('It is looking through the eyeholes. Keep the costume on.');
      if(encounterPhase==='depart'){
        notify('It turns away. The disguise worked.');
        exploration.message('YOU','It looked straight at me and left. The costume works.');
      }
    }
    if(sound.caught)catchPlayer();
    audio.update(dt,{distanceMoved:Math.hypot(camera.position.x-oldX,camera.position.z-oldZ),creatureMoving:sound.moving,creatureDistance:sound.distance,pan:sound.pan,powered,roomDistance:Math.hypot(camera.position.x-6.5,camera.position.z+7)});
  }
  const direction=new THREE.Vector3();camera.getWorldDirection(direction);torch.target.position.copy(camera.position).add(direction);
  // A gentle irregular light variation, without rapid flashing.
  lights[2].intensity=8+Math.sin(elapsed*1.4)*2;
  environment.update(elapsed);
  renderer.render(scene,camera);
}
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
$('status').textContent='E · Interact. C · Wear / remove costume. Find shelter before it takes control.';
requestAnimationFrame(frame);
