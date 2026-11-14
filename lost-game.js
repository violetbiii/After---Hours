import {inspections,evidenceArt} from './inspection.js';
import {cases,createShift} from './claims.js';
import {createOffice} from './lost-scene.js';
import {createAudio} from './audio.js';
const $=id=>document.getElementById(id);
const shift=createShift(),audio=createAudio();let office,playing=false,paused=false,muted=false,view='desk',flash=0,time=0,last=performance.now(),shownEnding=false,photo=0;
audio.setVolume(.3);
try{office=createOffice($('office'));office.showItem('coat');$('start').disabled=false;$('start').textContent='Begin your shift →';$('load-status').textContent='The office is ready.';}catch(error){$('load-status').textContent='The 3D office could not start. Enable WebGL in your browser and reload.';console.error(error);}
function setView(v){if(v!=='item')closeDiscovery();view=v;office?.setView(v);$('shelf-panel').hidden=v!=='shelf';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===v)));}
function closeDiscovery(){ $('discovery').hidden=true;$('eyeholes').hidden=true;office?.clearEffect();}
let swipeStart=null;
$('evidence-art').addEventListener('pointerdown',e=>{swipeStart=e.clientX;});
$('evidence-art').addEventListener('pointerup',e=>{if(swipeStart!==null&&Math.abs(e.clientX-swipeStart)>35&&playing&&!paused&&cases[shift.state.index].id==='phone'&&shift.state.inspected)discover('scare');swipeStart=null;});
$('evidence-art').addEventListener('pointercancel',()=>swipeStart=null);
$('close-discovery').onclick=()=>{if(!playing||paused)return;closeDiscovery();setView('item');};
function discover(part){
 if(!shift.examine(part))return;
 const id=cases[shift.state.index].id,config=inspections[id];
 if(id==='phone'&&part==='scare')photo=photo%3+1;
 render();office.inspectEffect(id,part);
 $('discovery').hidden=false;$('evidence-art').innerHTML=evidenceArt(id,part==='scare',photo);
 $('discovery-caption').textContent=part==='clue'?config.evidence:config.fear;
 if(id==='mask'&&part==='scare'){ $('eyeholes').hidden=false;$('evidence-art').innerHTML='';$('discovery-caption').textContent='Look beside the service hatch. Lower the head when you are ready.';}
 if(id==='voice'&&part==='clue')audio.melody();else audio.power();
}
function button(label,fn,style=''){const b=document.createElement('button');b.textContent=label;b.className=style;b.onclick=()=>{if(!playing||paused)return;fn();};$('actions').append(b);}
function render(){
 const s=shift.state,c=cases[s.index];$('case-number').textContent=`CLAIM ${String(s.index+1).padStart(2,'0')} / 06`;$('clock').textContent=c.time;$('tag').textContent=c.tag;$('item-title').textContent=c.name;$('actions').replaceChildren();
 $('inventory').textContent=s.stored.length?s.stored.map(id=>cases.find(c=>c.id===id).name).join(' · '):'The shelves are quiet. Nothing has been kept yet.';
 $('evidence').hidden=!s.inspected;$('notes').textContent=c.inspection;office.setStored(s.stored);office.setVisitor(s.phase==='claim',s.index);
 if(s.phase==='delivery'){
  $('narrative').textContent=s.inspected?c.inspection:c.delivery;$('speaker').textContent=s.inspected?'INSPECTION COMPLETE':'INCOMING PROPERTY';$('dialogue').textContent=s.inspected?'Remember what you found. Ring the bell when you are ready to hear the claimant.':'Inspect the object before opening the service hatch. Not everything belongs to the person who asks for it.';
  if(!s.examining)button('Pick up the object',()=>{shift.inspect();setView('item');office.setInspection(true);render();},'primary');
  else {
   const config=inspections[c.id];
   $('narrative').textContent=s.inspected?config.evidence:config.hint;
   $('dialogue').textContent='Drag the object to rotate it, or use the turn buttons. Investigate a detail to uncover its clue.';
   button('Turn left',()=>{closeDiscovery();setView('item');office.rotateItem(-.65);});
   button('Turn right',()=>{closeDiscovery();setView('item');office.rotateItem(.65);});
   button(config.clue,()=>discover('clue'),'primary');
   if(s.inspected)button(config.scare,()=>discover('scare'));
  }
  if(s.inspected)button('Ring for claimant',()=>{closeDiscovery();office.setInspection(false);shift.summon();setView('desk');audio.power();render();});
 }else if(s.phase==='claim'){
  $('narrative').textContent=c.detail;$('speaker').textContent=c.claimant;$('dialogue').textContent=c.speech;
  button('Return',()=>decide('return'));button('Keep',()=>decide('keep'));button('Dispose',()=>decide('dispose'),'destructive');
 }else if(s.phase==='result'){
  const action=s.choices.at(-1).action;$('narrative').textContent=c.result[action];$('speaker').textContent='RECORDED / '+action.toUpperCase();$('dialogue').textContent=action==='keep'?'It is on the shelves now. Keep the lamp nearby.':'The hatch closes. There is already someone else outside.';
  button('Next delivery →',()=>{shift.next();photo=0;closeDiscovery();office.showItem(cases[shift.state.index].id);setView('desk');$('evidence').open=false;render();},'primary');
 }else showEnding();
}
function decide(action){closeDiscovery();office.setInspection(false);if(!shift.choose(action))return;audio.power();office.showItem(null);if(action==='dispose')setView('chute');if(action==='keep')setView('shelf');render();}
function showEnding(){if(shownEnding)return;shownEnding=true;playing=false;closeDiscovery();office.setInspection(false);audio.stop();const s=shift.state;$('game').hidden=true;$('ending').hidden=false;$('ending-label').textContent=s.ending.id==='taken'?'SHIFT TERMINATED':'SHIFT COMPLETE';$('ending-title').textContent=s.ending.title;$('ending-body').textContent=s.ending.text;$('ending-stats').textContent=`${s.choices.length} claims processed · ${s.stored.length} object${s.stored.length===1?'':'s'} kept · Ending: ${s.ending.id.toUpperCase()}`;$('register').replaceChildren();for(const choice of s.choices){const li=document.createElement('li');li.textContent=cases.find(c=>c.id===choice.id).name+' — '+choice.action.toUpperCase();$('register').append(li);}$('restart').focus();office.setVisitor(false);}
function start(){photo=0;closeDiscovery();office.setInspection(false);shift.reset($('calm').checked);playing=true;paused=false;shownEnding=false;flash=0;$('menu').hidden=true;$('ending').hidden=true;$('pause-menu').hidden=true;$('game').hidden=false;$('evidence').open=false;office.showItem('coat');setView('desk');audio.start();render();}
function pause(value){if(!playing)return;paused=value;office.setInspection(!value&&shift.state.examining&&shift.state.phase==='delivery');if(value)closeDiscovery();$('pause-menu').hidden=!value;if(value){audio.stop();$('resume').focus();}else audio.start();}
$('start').onclick=start;$('restart').onclick=start;$('restart-pause').onclick=start;$('pause').onclick=()=>pause(true);$('resume').onclick=()=>pause(false);
$('hush').onclick=()=>{if(!playing||paused||view!=='shelf')return;if(shift.hush()){flash=1;audio.power();}};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{if(playing&&!paused)setView(b.dataset.view);});
$('mute').onclick=()=>{muted=!muted;audio.setMuted(muted);$('mute').textContent=muted?'Sound off':'Sound on';$('mute').setAttribute('aria-pressed',String(muted));};$('volume').oninput=e=>audio.setVolume(e.target.value);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();pause(!paused);}});document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);});window.addEventListener('blur',()=>pause(true));
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.1,(now-last)/1000);last=now;if(!paused){time+=dt;flash=Math.max(0,flash-dt*.8);}if(playing&&!paused){shift.tick(dt);const s=shift.state;$('pressure').value=s.pressure;document.body.classList.toggle('danger-high',s.pressure>=65);$('warning').textContent=s.pressure>=65?'They are moving. Look at the shelves.':s.pressure>=35?'Something is shifting behind you.':'Keep an eye on the shelves.';$('hush').disabled=s.cooldown>0;$('hush').textContent=s.cooldown>0?`Lamp recharging · ${Math.ceil(s.cooldown)}s`:'Hold the lamp on the shelves';audio.update(dt,{creatureMoving:s.pressure>40,creatureDistance:30-s.pressure*.27,pan:-.7,powered:true,roomDistance:0});if(s.phase==='ended')showEnding();}office?.update(paused?0:dt,time,shift.state.pressure,flash);}
requestAnimationFrame(frame);
