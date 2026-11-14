// Original procedural sounds: no downloaded recordings or autoplay.
export function createAudio() {
  let ctx,master,hum,scrape,scrapePan,noise,playing=false,muted=false,volume=.35;
  let stride=0,phase=0,drone,air,rumble,scrapeFilter,echo,echoReturn;
  let nextEcho=9,dragPhase=0,dragSpeed=2.1;
  const voices=new Set();
  function gain(node,value){if(!ctx)return;node.gain.cancelScheduledValues(ctx.currentTime);node.gain.setTargetAtTime(value,ctx.currentTime,.025);}
  function refresh(){if(master)gain(master,playing&&!muted?volume:0);}
  function init(){
    const AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!AudioContext)return false;
    ctx=new AudioContext();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
    noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
    const samples=noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
    // Close frequencies beat slowly against one another, like distant machinery.
    drone=ctx.createGain();drone.gain.value=0;drone.connect(master);
    for(const frequency of [43,44.3,65.4,87.7]){
      const osc=ctx.createOscillator();osc.frequency.value=frequency;osc.connect(drone);osc.start();
    }
    const wind=ctx.createBufferSource();wind.buffer=noise;wind.loop=true;
    const windFilter=ctx.createBiquadFilter();windFilter.type='lowpass';windFilter.frequency.value=280;
    air=ctx.createGain();air.gain.value=0;wind.connect(windFilter).connect(air).connect(master);wind.start();
    rumble=ctx.createGain();rumble.gain.value=0;rumble.connect(master);
    const throat=ctx.createOscillator();throat.type='triangle';throat.frequency.value=58;throat.connect(rumble);throat.start();
    // A single dark echo, with no feedback loop or accumulating volume.
    echo=ctx.createDelay(2);echo.delayTime.value=.43;
    const echoFilter=ctx.createBiquadFilter();echoFilter.type='lowpass';echoFilter.frequency.value=1100;
    echoReturn=ctx.createGain();echoReturn.gain.value=.16;
    echo.connect(echoFilter).connect(echoReturn).connect(master);
    hum=ctx.createGain();hum.gain.value=0;hum.connect(master);
    for(const frequency of [50,100,151]){const osc=ctx.createOscillator();osc.frequency.value=frequency;osc.type='sine';osc.connect(hum);osc.start();}
    const loop=ctx.createBufferSource();loop.buffer=noise;loop.loop=true;
    const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=460;filter.Q.value=2.4;scrapeFilter=filter;
    scrape=ctx.createGain();scrape.gain.value=0;scrapePan=ctx.createStereoPanner();
    loop.connect(filter).connect(scrape).connect(scrapePan).connect(master);loop.start();return true;
  }
  async function start(){
    try{if(!ctx&&!init())return false;playing=true;await ctx.resume();refresh();return true;}
    catch{playing=false;return false;}
  }
  function burst(frequency,duration,level,tonal=false){
    if(!ctx||!playing)return;
    const source=tonal?ctx.createOscillator():ctx.createBufferSource();
    if(tonal){source.frequency.setValueAtTime(frequency,ctx.currentTime);source.frequency.exponentialRampToValueAtTime(frequency*.45,ctx.currentTime+duration);}else source.buffer=noise;
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=tonal?1000:frequency;
    const envelope=ctx.createGain();envelope.gain.setValueAtTime(0,ctx.currentTime);envelope.gain.linearRampToValueAtTime(level,ctx.currentTime+.008);envelope.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
    source.connect(filter).connect(envelope).connect(master);envelope.connect(echo);voices.add(source);
    source.onended=()=>{source.disconnect();filter.disconnect();envelope.disconnect();voices.delete(source);};
    source.start();source.stop(ctx.currentTime+duration+.02);
  }
  function metallicEcho(){
    // Sparse, dissonant pipe resonance. Slow attack avoids a jump-scare spike.
    const pan=ctx.createStereoPanner();pan.pan.value=(Math.random()>.5?1:-1)*.7;pan.connect(master);
    let remaining=3;
    for(const frequency of [173,241,367]){
      const source=ctx.createOscillator(),envelope=ctx.createGain();
      source.frequency.setValueAtTime(frequency,ctx.currentTime);
      source.frequency.exponentialRampToValueAtTime(frequency*.94,ctx.currentTime+3);
      envelope.gain.setValueAtTime(0,ctx.currentTime);envelope.gain.linearRampToValueAtTime(.013,ctx.currentTime+.18);envelope.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+3);
      source.connect(envelope).connect(pan);envelope.connect(echo);voices.add(source);
      source.onended=()=>{source.disconnect();envelope.disconnect();voices.delete(source);if(--remaining===0)pan.disconnect();};source.start();source.stop(ctx.currentTime+3.1);
    }
  }
  function stop(){playing=false;stride=phase=dragPhase=0;nextEcho=9;for(const voice of voices){try{voice.stop();}catch{}}if(scrape){for(const layer of [scrape,hum,drone,air,rumble])gain(layer,0);}refresh();}
  function update(dt,{distanceMoved=0,creatureMoving=false,creatureDistance=30,pan=0,powered=false,roomDistance=30}){
    if(!ctx||!playing)return;
    if(distanceMoved>0){stride+=distanceMoved;if(stride>=1.05){stride%=1.05;burst(190,.15,.24);burst(82,.11,.1,true);}}else stride=0;
    phase+=dt;
    const proximity=Math.max(0,1-creatureDistance/24);
    gain(drone,.009+.004*Math.sin(phase*.31)+proximity*.007);
    gain(air,.018+.012*(.5+.5*Math.sin(phase*.47)));
    if(phase>nextEcho){metallicEcho();nextEcho=phase+12+Math.random()*13;}
    if(creatureMoving){dragPhase+=dt*dragSpeed;if(dragPhase>Math.PI*2){dragPhase%=Math.PI*2;dragSpeed=1.5+Math.random()*1.8;}}else dragPhase=0;
    const drag=.12+.88*Math.pow(Math.max(0,Math.sin(dragPhase)),3);
    gain(scrape,creatureMoving?(.045+proximity*.28)*drag:0);
    gain(rumble,creatureMoving?proximity*.024*drag:0);
    scrapeFilter.frequency.setTargetAtTime(240+180*drag+70*Math.sin(phase*.81),ctx.currentTime,.12);
    scrapePan.pan.setTargetAtTime(Math.max(-1,Math.min(1,pan)),ctx.currentTime,.08);
    gain(hum,powered?.016*Math.max(.08,1-roomDistance/22):0);
  }
  function melody(){
    if(!ctx||!playing)return;
    [261.63,329.63,392].forEach((frequency,i)=>{
      const osc=ctx.createOscillator(),env=ctx.createGain(),at=ctx.currentTime+i*.38;
      osc.type='sine';osc.frequency.value=frequency;env.gain.setValueAtTime(0,at);env.gain.linearRampToValueAtTime(.09,at+.04);env.gain.exponentialRampToValueAtTime(.0001,at+.6);
      osc.connect(env).connect(master);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();env.disconnect();};osc.start(at);osc.stop(at+.65);
    });
  }
  return {start,stop,update,melody,power(){burst(220,.25,.55);burst(95,.3,.22,true);},setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));refresh();},setMuted(value){muted=Boolean(value);refresh();}};
}
