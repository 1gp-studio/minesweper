export const levels = { easy: {size:9, mines:10}, medium:{size:12,mines:24}, hard:{size:16,mines:40} };
export function neighbors(index,size) {
  const result=[],row=Math.floor(index/size),col=index%size;
  for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)if((x||y)&&row+y>=0&&row+y<size&&col+x>=0&&col+x<size)result.push((row+y)*size+col+x);
  return result;
}
export function newGame(level='easy') {
  const {size,mines}=levels[level];
  return {size,mines,state:'new',revealed:0,cells:Array.from({length:size*size},()=>({mine:false,open:false,flag:false,count:0})),exploded:-1};
}
function seed(game,first,random) {
  const safe=new Set([first,...neighbors(first,game.size)]);
  const candidates=game.cells.map((_,i)=>i).filter(i=>!safe.has(i));
  for(let i=candidates.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]];}
  for(const i of candidates.slice(0,game.mines))game.cells[i].mine=true;
  game.cells.forEach((c,i)=>c.count=neighbors(i,game.size).filter(n=>game.cells[n].mine).length);
  game.state='playing';
}
export function flag(game,index) {
  const c=game.cells[index];
  if(!c||c.open||['won','lost'].includes(game.state))return;
  if(!c.flag&&game.cells.filter(c=>c.flag).length>=game.mines)return;
  c.flag=!c.flag;
}
export function reveal(game,index,random=Math.random) {
  const cell=game.cells[index];
  if(!cell||cell.flag||cell.open||['won','lost'].includes(game.state))return;
  if(game.state==='new')seed(game,index,random);
  if(cell.mine){cell.open=true;game.exploded=index;game.state='lost';return;}
  const pending=[index];
  while(pending.length){const i=pending.pop(),c=game.cells[i];if(c.open||c.flag||c.mine)continue;c.open=true;game.revealed++;if(c.count===0)pending.push(...neighbors(i,game.size));}
  if(game.revealed===game.cells.length-game.mines){game.state='won';game.cells.forEach(c=>{if(c.mine)c.flag=true;});}
}
