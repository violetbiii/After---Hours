// Each item occupies a reachable drawer; replay shuffles both independently.
export function createExploration(random = Math.random) {
  let state;
  function reset(){
    const previous=state;
    const pick=(count,last)=>last===undefined?Math.floor(random()*count):(last+1+Math.floor(random()*(count-1)))%count;
    state={idDrawer:pick(4,previous?.idDrawer),opened:new Set(),hasId:false,recovered:false,messages:[],unread:0,age:0,stage:0};
    message('UNKNOWN','Find Morrow by reception. Wear it in the corridor: the watcher mistakes it for one of its own.');
    message('COSTUME TAG','Classroom 111 is a refuge. Remove the costume there to recover control. Search its drawers for your student ID.');
  }
  function message(sender,text){state.messages.push({sender,text});state.unread++;}
  function search(index){
    if(!state.opened.has(index)){state.opened.add(index);return 'opened';}
    if(index===state.idDrawer&&!state.hasId){state.hasId=true;message('UNKNOWN','ID recovered. Find the power switch in the room near the exit. Then get out.');return 'id';}
    return 'empty';
  }
  function update(dt){
    if(!state.hasId)return;
    state.age+=dt;
    if(state.stage===0&&state.age>=6){state.stage=1;message('UNKNOWN','The costume keeps you safe. Wearing it too long lets it keep you.');}
    if(state.stage===1&&state.age>=9){state.stage=2;message('UNKNOWN','The glove moves before the feet. C removes the costume. You can still choose.');}
  }
  reset();return {reset,search,message,update,get state(){return state;},read(){state.unread=0;}};
}
