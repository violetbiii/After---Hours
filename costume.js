export function createCostumeState(){
  const state={owned:false,worn:false,influence:0,separated:false,handMoved:false};
  return {state,reset(){Object.assign(state,{owned:false,worn:false,influence:0,separated:false,handMoved:false});},take(){state.owned=true;state.worn=true;},toggle(){if(!state.owned||state.separated)return false;state.worn=!state.worn;return true;},update(dt,sheltered){
    state.influence=Math.max(0,Math.min(100,state.influence+dt*(state.worn?2.2:sheltered?-9:-3)));
    const firstMovement=state.worn&&state.influence>=35&&!state.handMoved;
    if(firstMovement)state.handMoved=true;
    return {firstMovement,takenOver:state.influence>=100,drift:state.worn&&state.influence>=75};
  },separate(){if(state.worn)return false;state.separated=true;state.influence=0;return true;}};
}
