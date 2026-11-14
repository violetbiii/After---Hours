// Collision-aware corridor/backstage pathfinding on a half-metre grid.
export function createNavigation(solids){
 const step=.5;
 function allowed(x,z){return (x>=-2.5&&x<=2.5&&z>=-18.5&&z<=14.5)||(x>=2.5&&x<=9.5&&z>=-27.5&&z<=-12.5);}
 function clear(x,z){return allowed(x,z)&&!solids.some(s=>!s.disabled&&Math.abs(x-s.x)<s.w/2+.32&&Math.abs(z-s.z)<s.d/2+.32);}
 function route(startX,startZ,endX,endZ){
  const sx=Math.round(startX/step),sz=Math.round(startZ/step),tx=Math.round(endX/step),tz=Math.round(endZ/step);
  const key=(x,z)=>x+','+z,queue=[[sx,sz]],parent=new Map([[key(sx,sz),null]]);let found=null;
  for(let i=0;i<queue.length&&i<5000;i++){
   const [x,z]=queue[i];if(x===tx&&z===tz){found=[x,z];break;}
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(!parent.has(k)&&clear(nx*step,nz*step)){parent.set(k,[x,z]);queue.push([nx,nz]);}}
  }
  if(!found)return [];
  const path=[];while(found){path.push({x:found[0]*step,z:found[1]*step});found=parent.get(key(...found));}return path.reverse().slice(1);
 }
 return {route,clear};
}
