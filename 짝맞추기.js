// 짝 맞추기(기억) 로직 - 카드를 뒤집어 같은 그림 찾기. 외부 스크립트
const POOL = ['🦕','🚗','🍎','⭐','🐟','🎈','🌈','🐰','🌸','🚀','🐶','🍓','🦋','🎁','⚽','🐥','🐸','🐧','🦁','🐼','🍌','🍉','🍕','🍩','🌵','🌻','🚕','🚒','🎸','🥁','👑','💎','🐢','🦉','🐝','🦄','🐷','🐵','🍇','🐙'];
let pairs = 3;           // 짝 수(난이도)
let cards = [];          // {emoji, matched}
let flipped = [];        // 열린 카드 인덱스
let lock = false;

const board = document.getElementById('board');
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function newGame(){
  const pick = shuffle([...POOL]).slice(0, pairs);
  cards = shuffle([...pick, ...pick]).map(e=>({emoji:e, matched:false}));
  flipped = []; lock = false; render();
}

function render(){
  board.innerHTML='';
  const cols = pairs<=3 ? 3 : (pairs<=8 ? 4 : (pairs<=12 ? 5 : 6));
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  fitCards(cols, cards.length);
  cards.forEach((c,i)=>{
    const el=document.createElement('button'); el.className='card';
    const open = c.matched || flipped.includes(i);
    if(open) el.classList.add('open'); if(c.matched) el.classList.add('done');
    el.textContent = open ? c.emoji : '';
    el.addEventListener('pointerdown', ()=> tap(i));
    board.appendChild(el);
  });
}

function fitCards(cols, count){ // 카드 수에 맞춰 카드 크기 자동 조정(넘침 방지)
  if(!board.clientWidth||!board.clientHeight) return; // 레이아웃 전이면 CSS 기본값 사용
  const cs=getComputedStyle(board);
  const gap=parseFloat(cs.gap)||0;
  const availW=board.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - gap*(cols-1);
  const rows=Math.ceil(count/cols);
  const availH=board.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - gap*(rows-1);
  const sz=Math.max(28, Math.floor(Math.min(availW/cols, availH/rows)));
  board.style.setProperty('--cw', sz+'px');
}

function tap(i){
  audio();
  if(lock || cards[i].matched || flipped.includes(i)) return;
  flipped.push(i); flip();
  render();
  if(flipped.length===2){
    lock = true;
    const [a,b]=flipped;
    if(cards[a].emoji===cards[b].emoji){
      cards[a].matched=cards[b].matched=true; flipped=[]; lock=false;
      setTimeout(()=>{ render(); good(); if(cards.every(c=>c.matched)) win(); }, 150);
    } else {
      setTimeout(()=>{ flipped=[]; lock=false; render(); }, 850);
    }
  }
}

function win(){
  [...document.querySelectorAll('.card')].forEach((el,i)=> setTimeout(()=>{ el.classList.remove('cheer'); void el.offsetWidth; el.classList.add('cheer'); }, i*70));
  chord(); setTimeout(newGame, 1600);
}

document.getElementById('new').addEventListener('pointerdown', ()=>{ newGame(); ping(); });
// 레벨 1~10 → 짝 수 3~12
LevelStepper({ key:'lv_match', max:10, onChange:(lv)=>{ pairs = Math.min(2+lv, POOL.length); newGame(); } });

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function flip(){ beep(500,0.08,'triangle',0.07); }
function good(){ beep(660,0.12); setTimeout(()=>beep(880,0.16),90); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.35,'triangle'),i*110)); }
function ping(){ beep(600,0.1,'triangle',0.08); }
