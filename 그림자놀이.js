// 그림자 맞추기 로직 - 밝은 그림을 같은 모양 그림자 위로 끌어놓기. 외부 스크립트
const ITEMS = ['🦕','🚗','🍎','⭐','🐟','🎈','🌈','🐰','🚀','🦋','🐶','🍓','🐸','🐧','🦁','🐼','🍌','🍕','🎸','👑','🐢','🦉','🐝','🦄','🚁','⛵','🌵','🍩','🐷','🐙','🌻','🎈'];
let n = 3; // 개수(난이도)

const shadows = document.getElementById('shadows');
const tray = document.getElementById('tray');
let dragging = null;
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function newRound(){
  const pick = shuffle([...ITEMS]).slice(0, n);
  shadows.innerHTML=''; tray.innerHTML='';
  shuffle([...pick]).forEach(em=>{
    const s=document.createElement('div'); s.className='shadow'; s.dataset.key=em; s.textContent=em;
    shadows.appendChild(s);
  });
  shuffle([...pick]).forEach(em=>{
    const o=document.createElement('div'); o.className='obj'; o.dataset.key=em; o.textContent=em;
    attachDrag(o); tray.appendChild(o);
  });
}

function attachDrag(o){
  let offX=0, offY=0;
  o.addEventListener('pointerdown',(e)=>{
    if(o.classList.contains('placed')) return;
    dragging=o; audio(); const r=o.getBoundingClientRect();
    o.classList.add('lift'); o.style.width=r.width+'px'; o.style.height=r.height+'px';
    offX=e.clientX-r.left; offY=e.clientY-r.top; o.style.left=r.left+'px'; o.style.top=r.top+'px';
    o.setPointerCapture(e.pointerId);
  });
  o.addEventListener('pointermove',(e)=>{ if(dragging!==o) return; o.style.left=(e.clientX-offX)+'px'; o.style.top=(e.clientY-offY)+'px'; });
  o.addEventListener('pointerup',(e)=>{
    if(dragging!==o) return; dragging=null;
    const slot=[...shadows.querySelectorAll('.shadow')].find(s=>{ const r=s.getBoundingClientRect(); return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom; });
    if(slot && slot.dataset.key===o.dataset.key && !slot.classList.contains('filled')){
      o.classList.remove('lift'); o.classList.add('placed'); o.style.left=o.style.top=''; o.style.width=o.style.height='';
      slot.classList.add('filled'); slot.appendChild(o); slot.classList.remove('pop'); void slot.offsetWidth; slot.classList.add('pop'); good();
      if(shadows.querySelectorAll('.shadow.filled').length===n) win();
    } else { o.classList.remove('lift'); o.style.left=o.style.top=''; o.style.width=o.style.height=''; tray.appendChild(o); blip(); }
  });
}

function win(){ [...shadows.querySelectorAll('.shadow')].forEach((el,i)=> setTimeout(()=>{ el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }, i*90)); chord(); n = Math.min(n+1, 8); setTimeout(newRound, 1500); } // 완성할 때마다 그림 1개씩 증가(최대 8)

document.getElementById('new').addEventListener('pointerdown', ()=>{ newRound(); ping(); });
document.querySelectorAll('#diff button').forEach(btn=>{
  if(+btn.dataset.n===n) btn.classList.add('on');
  btn.addEventListener('pointerdown', ()=>{ n=+btn.dataset.n; document.querySelectorAll('#diff button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); newRound(); ping(); });
});
window.addEventListener('resize', ()=>{}); // 레이아웃 CSS 기반

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
function good(){ beep(660,0.12); setTimeout(()=>beep(880,0.16),80); }
function blip(){ beep(200,0.14,'sine',0.07); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.35,'triangle'),i*110)); }
function ping(){ beep(600,0.1,'triangle',0.08); }

newRound();
