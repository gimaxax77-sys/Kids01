// 놀이방 홈 - 연령 배지 + 잔잔한 BGM(WebAudio 합성, 저작권 없음). 외부 스크립트
// 순서: 그림판,분류,퍼즐,색칠,소리,붓기,숫자,그림자,선그리기,짝맞추기,코딩,한글,셈,패턴
const AGES = [1,2,3,2,1,4,3,3,3,4,5,5,5,4];
document.querySelectorAll('.toy').forEach((t,i)=>{
  const s=document.createElement('span'); s.className='age'; s.textContent=(AGES[i]||1)+'세+';
  t.appendChild(s);
});

// ---- BGM: 펜타토닉 자장가풍 반복 멜로디 ----
const N = { C4:261.63, D4:293.66, E4:329.63, G4:392.00, A4:440.00, C5:523.25, G3:196.00, C3:130.81 };
// [주파수, 박자] — 부드러운 프레이즈
const MEL = [
  ['E4',1],['G4',1],['A4',1],['G4',1], ['E4',1],['D4',1],['C4',2],
  ['D4',1],['E4',1],['G4',1],['E4',1], ['D4',1],['C4',1],['D4',2],
  ['G4',1],['A4',1],['C5',1],['A4',1], ['G4',1],['E4',1],['G4',2],
  ['E4',1],['D4',1],['C4',1],['D4',1], ['E4',1],['G4',1],['C4',2],
];
const BEAT = 0.46; // 한 박자(초)
let ac=null, master=null, bgmOn=false, bgmTimer=null;

function ensureAudio(){
  if(ac) return ac;
  ac = new (window.AudioContext||window.webkitAudioContext)();
  master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination);
  return ac;
}
function tone(t, freq, dur, vol, type){
  const o=ac.createOscillator(), g=ac.createGain(); o.type=type||'triangle'; o.frequency.value=freq;
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol, t+0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  o.connect(g).connect(master); o.start(t); o.stop(t+dur+0.05);
}
function playPhrase(){
  if(!bgmOn) return;
  ensureAudio(); if(ac.state==='suspended') ac.resume();
  let t = ac.currentTime + 0.06; const start=t;
  MEL.forEach(([n,b])=>{ const d=b*BEAT; tone(t, N[n], d*0.92, 0.06, 'triangle'); t+=d; });
  // 잔잔한 베이스 드론(프레이즈 앞부분)
  tone(start, N.C3, 4*BEAT, 0.05, 'sine');
  tone(start+8*BEAT, N.G3, 4*BEAT, 0.05, 'sine');
  const len = t - start;
  bgmTimer = setTimeout(playPhrase, len*1000 - 60);
}
function startBgm(){ if(bgmOn) return; bgmOn=true; setBtn(); playPhrase(); }
function stopBgm(){ bgmOn=false; if(bgmTimer){ clearTimeout(bgmTimer); bgmTimer=null; } setBtn(); }
function setBtn(){ const b=document.getElementById('bgm'); b.textContent = bgmOn?'🔊':'🔈'; b.classList.toggle('off', !bgmOn); }

const muted = localStorage.getItem('bgmMuted')==='1';
setBtn();
// 브라우저 자동재생 정책: 첫 사용자 입력 후 시작(음소거 설정이 아니면)
function firstStart(e){ if(e.target && e.target.closest && e.target.closest('#bgm')) return; document.removeEventListener('pointerdown', firstStart); if(!muted && !bgmOn) startBgm(); }
document.addEventListener('pointerdown', firstStart);

document.getElementById('bgm').addEventListener('click', (e)=>{
  e.stopPropagation();
  if(bgmOn){ stopBgm(); localStorage.setItem('bgmMuted','1'); }
  else { localStorage.setItem('bgmMuted','0'); startBgm(); }
});
