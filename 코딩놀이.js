// 코딩 놀이 로직 - 화살표를 순서대로 놓아 로봇을 별까지 이동. 외부 스크립트
const G = 5;             // 격자 크기
let walls = 2;           // 벽 수(난이도)
let start = {r:4,c:0}, goal = {r:0,c:4}, wallSet = new Set();
let pos = {r:4,c:0}, queue = [], running = false;

const grid = document.getElementById('grid');
const qEl = document.getElementById('queue');
let bot;
const key = (r,c)=> r+','+c;
function rnd(n){ return Math.floor(Math.random()*n); }

function newLevel(){
  running=false; queue=[]; renderQueue();
  start = {r:4, c:0};
  do { goal = {r:rnd(G), c:rnd(G)}; } while(goal.r===start.r && goal.c===start.c);
  // 벽 배치 - 도착 가능한 배치가 될 때까지 재시도
  for(let attempt=0; attempt<40; attempt++){
    wallSet = new Set();
    let tries=0;
    while(wallSet.size<walls && tries<200){ tries++; const w=key(rnd(G),rnd(G)); if(w===key(start.r,start.c)||w===key(goal.r,goal.c)) continue; wallSet.add(w); }
    if(reachable()) break;
  }
  pos = {...start};
  buildGrid();
}
function reachable(){ // start→goal 경로 존재 여부(BFS)
  const seen=new Set([key(start.r,start.c)]); const st=[{...start}];
  while(st.length){ const p=st.pop(); if(p.r===goal.r&&p.c===goal.c) return true;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{ const nr=p.r+dr,nc=p.c+dc, k=key(nr,nc);
      if(nr>=0&&nr<G&&nc>=0&&nc<G&&!wallSet.has(k)&&!seen.has(k)){ seen.add(k); st.push({r:nr,c:nc}); } });
  }
  return false;
}

function buildGrid(){
  grid.innerHTML='';
  const size = grid.clientWidth; const cell = size / G;
  for(let r=0;r<G;r++) for(let c=0;c<G;c++){
    const d=document.createElement('div'); d.className='cell';
    if(wallSet.has(key(r,c))) d.classList.add('wall');
    if(goal.r===r&&goal.c===c){ d.classList.add('goal'); d.textContent='⭐'; }
    grid.appendChild(d);
  }
  bot=document.createElement('div'); bot.id='bot'; bot.textContent='🤖';
  bot.style.width=bot.style.height=cell+'px';
  grid.appendChild(bot);
  placeBot();
}
function placeBot(){ const cell=grid.clientWidth/G; bot.style.left=(pos.c*cell)+'px'; bot.style.top=(pos.r*cell)+'px'; }

const DIR = { U:{r:-1,c:0}, D:{r:1,c:0}, L:{r:0,c:-1}, R:{r:0,c:1} };
function add(dir){ if(running) return; queue.push(dir); renderQueue(); ping(); audio(); }
function renderQueue(){
  qEl.innerHTML=''; const ICON={U:'⬆️',D:'⬇️',L:'⬅️',R:'➡️'};
  queue.forEach(d=>{ const s=document.createElement('span'); s.className='qchip'; s.textContent=ICON[d]; qEl.appendChild(s); });
}

function run(){
  if(running || !queue.length) return; running=true; audio();
  pos={...start}; placeBot();
  let i=0;
  const step=()=>{
    if(i>=queue.length){ running=false; if(pos.r===goal.r&&pos.c===goal.c) win(); else miss(); return; }
    const d=DIR[queue[i++]]; const nr=pos.r+d.r, nc=pos.c+d.c;
    if(nr>=0&&nr<G&&nc>=0&&nc<G && !wallSet.has(key(nr,nc))){ pos.r=nr; pos.c=nc; placeBot(); moveSound(); }
    else { bot.classList.remove('bump'); void bot.offsetWidth; bot.classList.add('bump'); }
    setTimeout(step, 360);
  };
  setTimeout(step, 200);
}
function win(){ bot.classList.add('yay'); chord(); setTimeout(newLevel, 1500); }
function miss(){ blip(); setTimeout(()=>{ pos={...start}; placeBot(); queue=[]; renderQueue(); }, 600); }

document.getElementById('up').addEventListener('pointerdown',()=>add('U'));
document.getElementById('down').addEventListener('pointerdown',()=>add('D'));
document.getElementById('left').addEventListener('pointerdown',()=>add('L'));
document.getElementById('right').addEventListener('pointerdown',()=>add('R'));
document.getElementById('run').addEventListener('pointerdown',run);
document.getElementById('clear').addEventListener('pointerdown',()=>{ if(running) return; queue=[]; renderQueue(); pos={...start}; placeBot(); ping(); });
document.getElementById('new').addEventListener('pointerdown',()=>{ newLevel(); ping(); });
// 레벨 1~10 → 벽 수 2~11 (도착 가능 보장)
LevelStepper({ key:'lv_code', max:10, onChange:(lv)=>{ walls = 1+lv; newLevel(); } });
window.addEventListener('resize', ()=>{ buildGrid(); });

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function moveSound(){ beep(500,0.08,'triangle',0.06); }
function blip(){ beep(200,0.16,'sine',0.07); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.35,'triangle'),i*110)); }
function ping(){ beep(600,0.1,'triangle',0.07); }

requestAnimationFrame(newLevel);
window.addEventListener('load', ()=>{ if(!grid.querySelector('.cell')) newLevel(); });
