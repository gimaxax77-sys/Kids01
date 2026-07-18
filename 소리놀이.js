// 소리·악기 놀이 로직 - 펜타토닉 패드 + WebAudio 합성(외부 스크립트로 분리)
// 펜타토닉 음계(도레미솔라...) — 어느 조합이나 어울림 → 틀린 소리 없음
const NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
const PAD_COLORS = ['#e23b3b','#ef7d1a','#f5c518','#3fae54','#22b5b0','#3b7de2','#7a5cd0','#ec5a92'];
const INSTRUMENTS = [
  { id:'piano',  icon:'🎹', name:'피아노' },
  { id:'bell',   icon:'🔔', name:'실로폰' },
  { id:'organ',  icon:'🎺', name:'오르간' },
  { id:'drum',   icon:'🥁', name:'드럼' },
];
const DRUM_ICON = ['🥁','👏','🔔','🎵','💥','🪘','🔴','⭐'];
let instIdx = 0;

const padsEl = document.getElementById('pads');
function layout(){
  // 화면 비율에 따라 열 수 결정(세로=2열4행, 가로=4열2행)
  const portrait = window.innerHeight >= window.innerWidth;
  padsEl.style.gridTemplateColumns = portrait ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  padsEl.style.gridTemplateRows = portrait ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)';
}
window.addEventListener('resize', layout);

// 패드 생성
NOTES.forEach((freq, i) => {
  const p = document.createElement('button');
  p.className = 'pad'; p.style.background = PAD_COLORS[i]; p.dataset.i = i;
  p.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    hit(p, i, e);
  });
  padsEl.appendChild(p);
});

function hit(p, i, e){
  audio();
  const inst = INSTRUMENTS[instIdx].id;
  if(inst === 'drum') playDrum(i); else playNote(NOTES[i], inst);
  p.textContent = inst === 'drum' ? DRUM_ICON[i] : '';
  p.classList.remove('hit'); void p.offsetWidth; p.classList.add('hit');
  setTimeout(()=>p.classList.remove('hit'), 120);
  // 물결
  const r = document.createElement('span'); r.className = 'ripple';
  const rect = p.getBoundingClientRect();
  r.style.left = ((e.clientX||rect.left+rect.width/2) - rect.left) + 'px';
  r.style.top  = ((e.clientY||rect.top+rect.height/2) - rect.top) + 'px';
  r.style.width = r.style.height = rect.width + 'px';
  p.appendChild(r); void r.offsetWidth; r.classList.add('go');
  setTimeout(()=>r.remove(), 500);
}

// --- 소리 합성 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function playNote(freq, inst){
  const a = audio(), t = a.currentTime;
  const g = a.createGain(); g.connect(a.destination);
  const o = a.createOscillator(); o.connect(g); o.frequency.value = freq;
  if(inst === 'piano'){
    o.type='triangle'; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.35,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+0.7); o.start(t); o.stop(t+0.75);
    const o2=a.createOscillator(); o2.type='sine'; o2.frequency.value=freq*2; const g2=a.createGain(); g2.connect(a.destination); o2.connect(g2); g2.gain.setValueAtTime(0.0001,t); g2.gain.exponentialRampToValueAtTime(0.12,t+0.01); g2.gain.exponentialRampToValueAtTime(0.0001,t+0.4); o2.start(t); o2.stop(t+0.45);
  } else if(inst === 'bell'){
    o.type='sine'; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.4,t+0.005); g.gain.exponentialRampToValueAtTime(0.0001,t+0.9); o.start(t); o.stop(t+0.95);
    const o2=a.createOscillator(); o2.type='sine'; o2.frequency.value=freq*3.01; const g2=a.createGain(); g2.connect(a.destination); o2.connect(g2); g2.gain.setValueAtTime(0.0001,t); g2.gain.exponentialRampToValueAtTime(0.15,t+0.005); g2.gain.exponentialRampToValueAtTime(0.0001,t+0.5); o2.start(t); o2.stop(t+0.55);
  } else { // organ: 지속음
    o.type='sine'; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.28,t+0.03); g.gain.setValueAtTime(0.28,t+0.35); g.gain.exponentialRampToValueAtTime(0.0001,t+0.6); o.start(t); o.stop(t+0.65);
    const o2=a.createOscillator(); o2.type='sine'; o2.frequency.value=freq*2; const g2=a.createGain(); g2.connect(a.destination); o2.connect(g2); g2.gain.setValueAtTime(0.0001,t); g2.gain.exponentialRampToValueAtTime(0.1,t+0.03); g2.gain.exponentialRampToValueAtTime(0.0001,t+0.6); o2.start(t); o2.stop(t+0.65);
  }
}
let noiseBuf;
function noise(){ if(!noiseBuf){ const a=audio(); noiseBuf=a.createBuffer(1,a.sampleRate*0.5,a.sampleRate); const d=noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; } return noiseBuf; }
function playDrum(i){
  const a=audio(), t=a.currentTime;
  const kind = i % 4;
  if(kind===0){ // 킥
    const o=a.createOscillator(), g=a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(50,t+0.12); g.gain.setValueAtTime(0.6,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.2); o.start(t); o.stop(t+0.22);
  } else if(kind===1){ // 스네어
    const n=a.createBufferSource(); n.buffer=noise(); const f=a.createBiquadFilter(); f.type='highpass'; f.frequency.value=1500; const g=a.createGain(); n.connect(f); f.connect(g); g.connect(a.destination); g.gain.setValueAtTime(0.4,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.18); n.start(t); n.stop(t+0.2);
  } else if(kind===2){ // 하이햇
    const n=a.createBufferSource(); n.buffer=noise(); const f=a.createBiquadFilter(); f.type='highpass'; f.frequency.value=7000; const g=a.createGain(); n.connect(f); f.connect(g); g.connect(a.destination); g.gain.setValueAtTime(0.25,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.06); n.start(t); n.stop(t+0.08);
  } else { // 탐
    const o=a.createOscillator(), g=a.createGain(); o.type='sine'; o.connect(g); g.connect(a.destination); o.frequency.setValueAtTime(220,t); o.frequency.exponentialRampToValueAtTime(110,t+0.2); g.gain.setValueAtTime(0.5,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.25); o.start(t); o.stop(t+0.27);
  }
}

// 악기 바꾸기
document.getElementById('inst').addEventListener('click', () => {
  instIdx = (instIdx + 1) % INSTRUMENTS.length;
  document.getElementById('inst').textContent = INSTRUMENTS[instIdx].icon;
  document.getElementById('instname').textContent = INSTRUMENTS[instIdx].name;
  // 드럼 아니면 패드 글자 지움
  document.querySelectorAll('.pad').forEach(p=>{ if(INSTRUMENTS[instIdx].id!=='drum') p.textContent=''; });
  audio();
});


// 초기 레이아웃
layout();
