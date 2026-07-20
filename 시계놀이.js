// 시계 보기 로직 - 시계 바늘을 보고 몇 시인지 고르기. 외부 스크립트
let half = false;      // false=정각만, true=30분 포함
let hour = 3, minute = 0;

const clock = document.getElementById('clock');
const choiceEl = document.getElementById('choices');
function rnd(n){ return Math.floor(Math.random()*n); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function label(h,m){ return m===30 ? (h+'시 30분') : (h+'시'); }

function drawClock(){
  let nums='';
  for(let n=1;n<=12;n++){ const a=(n*30-90)*Math.PI/180; const x=100+72*Math.cos(a), y=100+72*Math.sin(a); nums+=`<text x="${x}" y="${y}" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#3a4a66" font-family="sans-serif">${n}</text>`; }
  const ha=((hour%12)+minute/60)*30-90, ma=minute*6-90;
  const hx=100+42*Math.cos(ha*Math.PI/180), hy=100+42*Math.sin(ha*Math.PI/180);
  const mx=100+62*Math.cos(ma*Math.PI/180), my=100+62*Math.sin(ma*Math.PI/180);
  clock.innerHTML = `<svg viewBox="0 0 200 200" width="100%" height="100%">
    <circle cx="100" cy="100" r="94" fill="#fff" stroke="#5a7bc0" stroke-width="6"/>
    ${nums}
    <line x1="100" y1="100" x2="${hx}" y2="${hy}" stroke="#e23b3b" stroke-width="8" stroke-linecap="round"/>
    <line x1="100" y1="100" x2="${mx}" y2="${my}" stroke="#3b7de2" stroke-width="5" stroke-linecap="round"/>
    <circle cx="100" cy="100" r="7" fill="#3a4a66"/>
  </svg>`;
}

function newRound(){
  hour = 1 + rnd(12);
  minute = half && rnd(2) ? 30 : 0;
  drawClock();
  const set = new Set([label(hour,minute)]);
  while(set.size<3){ const h=1+rnd(12); const m=half&&rnd(2)?30:0; set.add(label(h,m)); }
  const choices = shuffle([...set]);
  choiceEl.innerHTML='';
  choices.forEach(t=>{ const b=document.createElement('button'); b.className='choice'; b.textContent=t; b.addEventListener('pointerdown',()=>pick(b,t)); choiceEl.appendChild(b); });
}
function pick(b,t){
  audio();
  if(t===label(hour,minute)){ b.classList.add('right'); good(); setTimeout(newRound,1200); }
  else { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); blip(); }
}

document.getElementById('mode').addEventListener('pointerdown',(e)=>{ half=!half; e.currentTarget.textContent = half?'🕧':'🕐'; newRound(); ping(); });
document.getElementById('new').addEventListener('pointerdown',()=>{ newRound(); ping(); });

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function good(){ beep(660,0.12); setTimeout(()=>beep(990,0.18),90); }
function blip(){ beep(200,0.14,'sine',0.07); }
function ping(){ beep(600,0.1,'triangle',0.08); }

newRound();
