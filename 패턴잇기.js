// 패턴 잇기 로직 - 규칙을 보고 다음에 올 것 고르기. 외부 스크립트
const POOL = ['🔴','🟡','🔵','🟢','🟣','🟠','⭐','❤️'];
let unitLen = 2;         // 규칙 길이(난이도)
let answer = null;

const seqEl = document.getElementById('seq');
const choiceEl = document.getElementById('choices');
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function newRound(){
  const pool = shuffle([...POOL]);
  const unit = pool.slice(0, unitLen);
  const showN = unitLen*2 + Math.floor(Math.random()*unitLen); // 보여줄 개수(2주기+α)
  answer = unit[showN % unitLen];
  // 순서 표시
  seqEl.innerHTML='';
  for(let i=0;i<showN;i++){ const t=document.createElement('div'); t.className='tile'; t.textContent=unit[i%unitLen]; seqEl.appendChild(t); }
  const q=document.createElement('div'); q.className='tile q'; q.textContent='?'; q.id='qslot'; seqEl.appendChild(q);
  // 선택지: unit + 방해요소 1
  const choices = [...unit];
  const extra = pool.find(p=>!unit.includes(p)); if(extra) choices.push(extra);
  shuffle(choices);
  choiceEl.innerHTML='';
  choices.forEach(c=>{
    const b=document.createElement('button'); b.className='choice'; b.textContent=c;
    b.addEventListener('pointerdown', ()=> pick(b,c));
    choiceEl.appendChild(b);
  });
}

function pick(b, c){
  audio();
  if(c===answer){
    const q=document.getElementById('qslot'); q.textContent=c; q.classList.add('filled'); q.classList.remove('q');
    good(); setTimeout(newRound, 1200);
  } else { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); blip(); }
}

document.getElementById('new').addEventListener('click', ()=>{ newRound(); ping(); });
document.querySelectorAll('#diff button').forEach(btn=>{
  if(+btn.dataset.n===unitLen) btn.classList.add('on');
  btn.addEventListener('click', ()=>{ unitLen=+btn.dataset.n; document.querySelectorAll('#diff button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); newRound(); ping(); });
});

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function good(){ beep(660,0.12); setTimeout(()=>beep(990,0.18),90); }
function blip(){ beep(200,0.14,'sine',0.07); }
function ping(){ beep(600,0.1,'triangle',0.08); }

newRound();
