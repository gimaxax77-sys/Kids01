// 물·모래 붓기 퍼즐 로직 - 튜브에 부어 같은 색끼리 모으기(워터소트). 외부 스크립트
const COLORS = ['#e23b3b','#f5c518','#3b7de2','#3fae54','#ef7d1a','#9b4fd0','#00bcd4','#e91e63','#8d6e63','#546e7a'];
const CAP = 4;
let nColors = 3;         // 색 수(난이도)
let mode = 'water';      // 'water' | 'sand'
let tubes = [];          // 각 튜브: 아래→위 색 인덱스 배열
let sel = -1;            // 선택된(들어올린) 튜브

const board = document.getElementById('board');

function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function newPuzzle(){
  const bag = [];
  for(let c=0;c<nColors;c++) for(let k=0;k<CAP;k++) bag.push(c);
  shuffle(bag);
  const nTubes = nColors + 2; // 빈 튜브 2개로 여유
  tubes = Array.from({length:nTubes}, ()=>[]);
  let i=0;
  for(let t=0;t<nColors;t++) for(let k=0;k<CAP;k++) tubes[t].push(bag[i++]);
  sel = -1; render();
}

function topRun(t){ const a=tubes[t]; if(!a.length) return null; const c=a[a.length-1]; let n=0; for(let i=a.length-1;i>=0 && a[i]===c;i--) n++; return {color:c, n}; }
function canPour(s,d){
  if(s===d) return 0; const src=tubes[s]; if(!src.length) return 0; const dst=tubes[d]; if(dst.length>=CAP) return 0;
  const tr=topRun(s); if(dst.length && dst[dst.length-1]!==tr.color) return 0;
  return Math.min(tr.n, CAP-dst.length);
}
function pour(s,d){ const n=canPour(s,d); if(!n) return 0; const tr=topRun(s); for(let k=0;k<n;k++){ tubes[s].pop(); tubes[d].push(tr.color); } return n; }
function isWin(){ return tubes.every(t=> t.length===0 || (t.length===CAP && t.every(c=>c===t[0]))); }

function render(){
  board.innerHTML='';
  tubes.forEach((arr, t)=>{
    const tube=document.createElement('div'); tube.className='tube'+(t===sel?' sel':''); tube.dataset.t=t;
    for(let k=0;k<CAP;k++){
      const seg=document.createElement('div'); seg.className='seg';
      const idx = arr[k];
      if(idx!==undefined){ seg.classList.add(mode); seg.style.background = COLORS[idx]; }
      else { seg.classList.add('empty'); }
      tube.appendChild(seg); // column-reverse라 배열0이 바닥
    }
    tube.addEventListener('pointerdown', ()=> tap(t));
    board.appendChild(tube);
  });
}

function tap(t){
  audio();
  if(sel<0){ if(tubes[t].length){ sel=t; ping(); render(); } return; }
  if(sel===t){ sel=-1; render(); return; }
  const n=pour(sel,t);
  if(n>0){ pourSound(); sel=-1; render(); if(isWin()) win(); }
  else { sel = tubes[t].length? t : -1; ping(); render(); } // 못 부으면 그 튜브를 새로 선택
}

function win(){
  [...document.querySelectorAll('.tube')].forEach((el,i)=> setTimeout(()=>{ el.classList.remove('cheer'); void el.offsetWidth; el.classList.add('cheer'); }, i*90));
  chord();
  setTimeout(newPuzzle, 1500);
}

// 컨트롤
document.getElementById('mode').addEventListener('pointerdown', (e)=>{ mode = mode==='water'?'sand':'water'; e.currentTarget.textContent = mode==='water'?'💧':'🏖️'; render(); ping(); });
document.getElementById('new').addEventListener('pointerdown', ()=>{ newPuzzle(); ping(); });
// 레벨 1~10 → 색 수 2~10 (빈 튜브 2개 여유)
LevelStepper({ key:'lv_pour', max:10, onChange:(lv)=>{ nColors = Math.min(1+lv, COLORS.length); newPuzzle(); } });

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function pourSound(){ // 물 흐르는 듯 하강음
  const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type='sine'; o.frequency.setValueAtTime(520,a.currentTime); o.frequency.exponentialRampToValueAtTime(300,a.currentTime+0.25);
  g.gain.setValueAtTime(0.14,a.currentTime); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.28); o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime+0.3);
}
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.35,'triangle'),i*110)); }
function ping(){ beep(620,0.1,'triangle',0.08); }

window.addEventListener('resize', render);
