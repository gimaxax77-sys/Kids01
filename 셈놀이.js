// 덧셈·뺄셈 로직 - 물건을 보고 답 고르기. 외부 스크립트
const EMO = ['🍎','⭐','🐟','🎈','🍓','🐥','🚗','🌸'];
let maxN = 5;            // 난이도(최대 수)
let op = '+';           // '+' | '-'
let answer = 0;

const prob = document.getElementById('prob');
const choiceEl = document.getElementById('choices');
function rnd(n){ return Math.floor(Math.random()*n); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function group(em, n, gone){ let s=''; for(let i=0;i<n;i++) s+=`<span class="ob${i>=n-gone?' gone':''}">${em}</span>`; return `<div class="grp">${s}</div>`; }

function newRound(){
  const em = EMO[rnd(EMO.length)];
  let a,b;
  if(op==='+'){ a=1+rnd(maxN-1); b=1+rnd(maxN-a>0?maxN-a:1); if(a+b>maxN) b=maxN-a; if(b<1) b=1; answer=a+b;
    prob.innerHTML = group(em,a,0) + `<div class="opr">+</div>` + group(em,b,0) + `<div class="opr">=</div><div class="qm">?</div>`;
  } else { a=2+rnd(maxN-1); b=1+rnd(a-1); answer=a-b;
    prob.innerHTML = group(em,a,b) + `<div class="opr">−</div><div class="qm">?</div>`;
  }
  // 선택지: 정답 + 방해 2
  const set=new Set([answer]); while(set.size<3){ let d=answer + (rnd(5)-2); if(d>=0 && d<=maxN) set.add(d); }
  const choices=shuffle([...set]);
  choiceEl.innerHTML='';
  choices.forEach(v=>{ const btn=document.createElement('button'); btn.className='choice'; btn.textContent=v; btn.addEventListener('pointerdown',()=>pick(btn,v)); choiceEl.appendChild(btn); });
}

function pick(btn,v){
  audio();
  if(v===answer){ btn.classList.add('right'); document.querySelector('.qm').textContent=v; document.querySelector('.qm').classList.add('right'); good(); setTimeout(newRound,1300); }
  else { btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake'); blip(); }
}

document.getElementById('op').addEventListener('click',(e)=>{ op = op==='+'?'-':'+'; e.currentTarget.textContent = op==='+'?'➕':'➖'; newRound(); ping(); });
document.getElementById('new').addEventListener('click',()=>{ newRound(); ping(); });
document.querySelectorAll('#diff button').forEach(btn=>{
  if(+btn.dataset.n===maxN) btn.classList.add('on');
  btn.addEventListener('click',()=>{ maxN=+btn.dataset.n; document.querySelectorAll('#diff button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); newRound(); ping(); });
});

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function good(){ beep(660,0.12); setTimeout(()=>beep(990,0.18),90); }
function blip(){ beep(200,0.14,'sine',0.07); }
function ping(){ beep(600,0.1,'triangle',0.08); }

newRound();
