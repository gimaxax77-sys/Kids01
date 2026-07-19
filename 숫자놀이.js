// 숫자 세기 로직 - 물건을 하나씩 탭해 세기. 외부 스크립트
const ITEMS = ['🍎','⭐','🐟','🎈','🍓','🐥','🌸','🚗','🦋','🐰','🍊','🐢','🍌','🐶','⚽','🍩','🐧','🌵','🚀','🐝','🍇','🐙','🦄','🎁'];
let maxN = 5;            // 난이도(최대 개수)
let total = 0, counted = 0;

const board = document.getElementById('board');
const bignum = document.getElementById('bignum');
function rnd(n){ return Math.floor(Math.random()*n); }

function newRound(){
  total = 1 + rnd(maxN); counted = 0;
  bignum.textContent = '0';
  const emoji = ITEMS[rnd(ITEMS.length)];
  board.innerHTML='';
  for(let i=0;i<total;i++){
    const b=document.createElement('button'); b.className='obj'; b.textContent=emoji;
    b.addEventListener('pointerdown', ()=> count(b));
    board.appendChild(b);
  }
}

function count(b){
  if(b.classList.contains('done')) return;
  audio();
  b.classList.add('done');
  counted++;
  bignum.textContent = counted;
  bignum.classList.remove('pop'); void bignum.offsetWidth; bignum.classList.add('pop');
  countSound(counted);
  if(counted===total){ setTimeout(()=>{ bignum.classList.add('big'); chord(); }, 200); setTimeout(newRound, 1700); }
}

document.getElementById('new').addEventListener('click', ()=>{ newRound(); ping(); });
document.querySelectorAll('#diff button').forEach(btn=>{
  if(+btn.dataset.n===maxN) btn.classList.add('on');
  btn.addEventListener('click', ()=>{ maxN=+btn.dataset.n; document.querySelectorAll('#diff button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); bignum.classList.remove('big'); newRound(); ping(); });
});

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function countSound(n){ beep(300 + n*45, 0.14, 'triangle', 0.1); } // 셀수록 높은음
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.35,'triangle'),i*110)); }
function ping(){ beep(600,0.1,'triangle',0.08); }

newRound();
