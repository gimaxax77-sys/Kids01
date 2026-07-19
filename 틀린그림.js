// 틀린 그림 찾기 - 두 그림에서 다른 곳 탭하기. 외부 스크립트
const POOL = ['🍎','⭐','🐟','🎈','🐰','🚗','🌸','🦋','🐶','🍓','🐥','⚽','🌈','🐢','🍌','🐝','🚀','🐧','🍉','🦄'];
const COLS = 4, ROWS = 4;
let diffN = 3;
let left = [], right = [], found = new Set(), win = false;

const gl = document.getElementById('gridL');
const gr = document.getElementById('gridR');
const status = document.getElementById('status');
function rnd(n){ return Math.floor(Math.random()*n); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function newRound(){
  const n=COLS*ROWS;
  left = Array.from({length:n}, ()=> POOL[rnd(POOL.length)]);
  right = [...left];
  // 서로 다른 칸 diffN개
  const spots = shuffle([...Array(n).keys()]).slice(0, diffN);
  spots.forEach(i=>{ let e; do { e=POOL[rnd(POOL.length)]; } while(e===left[i]); right[i]=e; });
  found = new Set(); win=false;
  build(gl, left); build(gr, right);
  updateStatus();
}
function build(grid, arr){
  grid.style.gridTemplateColumns='repeat('+COLS+',1fr)';
  grid.innerHTML='';
  arr.forEach((e,i)=>{ const c=document.createElement('button'); c.className='cell'; c.textContent=e; c.dataset.i=i;
    if(found.has(i)) c.classList.add('found');
    c.addEventListener('pointerdown', ()=> tap(i)); grid.appendChild(c); });
}
function tap(i){
  audio();
  if(win || found.has(i)) return;
  if(left[i]!==right[i]){ found.add(i); good(); markFound(i); updateStatus(); if(found.size===diffN) winRound(); }
  else { blip(); }
}
function markFound(i){ [gl,gr].forEach(g=>{ const c=g.querySelector('.cell[data-i="'+i+'"]'); if(c){ c.classList.add('found'); } }); }
function updateStatus(){ status.textContent = '🔍 ' + found.size + ' / ' + diffN; }
function winRound(){ win=true; [...document.querySelectorAll('.cell.found')].forEach((el,k)=> setTimeout(()=>{ el.classList.remove('cheer'); void el.offsetWidth; el.classList.add('cheer'); }, k*80)); chord(); setTimeout(newRound, 1600); }

document.getElementById('new').addEventListener('click',()=>{ newRound(); ping(); });
// 레벨 1~10 → 다른 곳 2~11 (16칸 격자)
LevelStepper({ key:'lv_spot', max:10, onChange:(lv)=>{ diffN = Math.min(1+lv, COLS*ROWS-1); newRound(); } });

let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function good(){ beep(660,0.12); setTimeout(()=>beep(990,0.18),80); }
function blip(){ beep(200,0.14,'sine',0.07); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.32,'triangle'),i*100)); }
function ping(){ beep(600,0.1,'triangle',0.08); }
