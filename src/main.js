import './style.css';
import {newGame,reveal,flag,levels} from './game.js';
let game=newGame(),level='easy',flagMode=false,startTime=null,seconds=0;
document.querySelector('#app').innerHTML=`<main><header><a class="brand" href="https://1gp-game-platform.vercel.app" target="_blank" rel="noopener">1GP <span>ARCADE</span></a><span class="edition">NO. 001 / MINESWEEPER</span></header><section class="intro"><span class="eyebrow">慢一点，也能赢。</span><h1>小小扫雷<span class="spark">✳</span></h1><p>每一个数字，都是一条线索。<br>找出地雷，让这片小小的世界安全起来。</p></section><section class="game-card" aria-label="扫雷游戏"><div class="toolbar"><div class="levels" aria-label="难度">${Object.keys(levels).map((key,i)=>`<button data-level="${key}" aria-pressed="${i===0}">${['轻松','挑战','高手'][i]}</button>`).join('')}</div><button id="restart" class="restart">↻ 重新开始</button></div><div class="stats"><div><span class="stat-label">待标记地雷</span><strong id="remaining">10</strong></div><div class="status"><span id="status-icon">✳</span><p id="status" role="status" aria-live="polite">选一格，开始探索</p></div><div class="timer"><span class="stat-label">用时 / 秒</span><strong id="timer">000</strong></div></div><div class="board-wrap"><div id="board" role="group" aria-label="扫雷棋盘"></div></div><div class="bottom-bar"><button id="flag-mode" aria-pressed="false">⚑ 插旗模式 <span>关</span></button><span id="progress">首击安全 · 放心开始</span></div></section><div class="howto"><span><b>01</b> 点击翻开格子</span><span><b>02</b> 数字 = 周围地雷数</span><span><b>03</b> 右键或插旗模式标记</span></div><footer><span>一点耐心，一点好运。</span><span>MADE FOR A LITTLE BREAK.</span></footer></main>`;
const board=document.querySelector('#board');
function reset(){game=newGame(level);seconds=0;startTime=null;flagMode=false;document.querySelector('#timer').textContent='000';render();}
function render(focusIndex){
  board.style.setProperty('--size',game.size);
  board.innerHTML=game.cells.map((c,i)=>{const showMine=c.mine&&game.state==='lost';const wrong=c.flag&&!c.mine&&game.state==='lost';const text=wrong?'×':showMine?'✳':c.flag?'⚑':c.open&&c.count?c.count:'';const label=`第${Math.floor(i/game.size)+1}行第${i%game.size+1}列，${wrong?'错误标记':showMine?'地雷':c.flag?'已标记':c.open?c.count+'个相邻地雷':'未翻开'}`;return `<button class="cell ${c.open?'open':''} ${c.flag?'flag':''} ${i===game.exploded?'exploded':''} ${wrong?'wrong':''}" data-index="${i}" data-number="${c.count}" aria-label="${label}" ${['won','lost'].includes(game.state)?'disabled':''}>${text}</button>`;}).join('');
  document.querySelector('#remaining').textContent=String(game.mines-game.cells.filter(c=>c.flag).length).padStart(2,'0');
  document.querySelector('#status').textContent={new:'选一格，开始探索',playing:'慢慢来，线索就在眼前',won:'全部排除，漂亮！',lost:'踩到地雷啦，再来一局？'}[game.state];
  document.querySelector('#status-icon').textContent={new:'✳',playing:'◉',won:'✦',lost:'✳'}[game.state];
  document.querySelector('.game-card').dataset.state=game.state;
  document.querySelector('#progress').textContent=game.state==='new'?'首击安全 · 放心开始':`${game.revealed} / ${game.cells.length-game.mines} 格安全区域`;
  const mode=document.querySelector('#flag-mode');mode.setAttribute('aria-pressed',String(flagMode));mode.querySelector('span').textContent=flagMode?'开':'关';
  if(focusIndex!==undefined)board.querySelector(`[data-index="${focusIndex}"]`)?.focus({preventScroll:true});
}
function act(index,mark=false,keyboard=false){if(mark||flagMode)flag(game,index);else reveal(game,index);if(game.state==='playing'&&startTime===null)startTime=Date.now();render(keyboard?index:undefined);}
board.addEventListener('click',e=>{const cell=e.target.closest('[data-index]');if(cell)act(Number(cell.dataset.index),false,e.detail===0);});
board.addEventListener('contextmenu',e=>{const cell=e.target.closest('[data-index]');if(cell){e.preventDefault();act(Number(cell.dataset.index),true);}});
board.addEventListener('keydown',e=>{const cell=e.target.closest('[data-index]');if(!cell)return;const i=Number(cell.dataset.index);if(e.key.toLowerCase()==='f'){e.preventDefault();flag(game,i);render(i);}const offsets={ArrowUp:-game.size,ArrowDown:game.size,ArrowLeft:-1,ArrowRight:1};if(e.key in offsets){e.preventDefault();board.querySelector(`[data-index="${Math.max(0,Math.min(game.cells.length-1,i+offsets[e.key]))}"]`)?.focus();}});
document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>{level=button.dataset.level;document.querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));reset();}));
document.querySelector('#restart').addEventListener('click',reset);
document.querySelector('#flag-mode').addEventListener('click',()=>{flagMode=!flagMode;render();});
setInterval(()=>{if(game.state==='playing'&&startTime!==null){seconds=Math.floor((Date.now()-startTime)/1000);document.querySelector('#timer').textContent=String(seconds).padStart(3,'0');}},250);
render();
