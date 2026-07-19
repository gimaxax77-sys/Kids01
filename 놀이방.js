// 놀이방 홈 - 연령대별 정렬 + 연령 배지 + 실음원 BGM(재생/정지). 외부 스크립트
// 원본 타일 순서: 그림판,분류,퍼즐,색칠,소리,붓기,숫자,그림자,선그리기,짝맞추기,코딩,한글,셈,패턴
const AGES = [1,2,3,2,1,4,3,3,3,4,5,5,5,4];

// 배지 부여 + 연령대별 재배치
const room = document.getElementById('room');
const toys = [...document.querySelectorAll('.toy')];
toys.forEach((t,i)=>{
  t._age = AGES[i] || 1;
  const s=document.createElement('span'); s.className='age'; s.textContent=t._age+'세+'; t.appendChild(s);
});
toys.forEach(t=> t.remove());
const GROUPS = [
  { label:'처음 놀이  1~2세', test:a=>a<=2 },
  { label:'쑥쑥 놀이  3~4세', test:a=>a===3||a===4 },
  { label:'배움 놀이  5세+',  test:a=>a>=5 },
];
GROUPS.forEach(g=>{
  const hdr=document.createElement('div'); hdr.className='grouphdr'; hdr.textContent=g.label; room.appendChild(hdr);
  toys.filter(t=>g.test(t._age)).sort((a,b)=>a._age-b._age).forEach(t=> room.appendChild(t));
});

// ---- BGM: 실음원(Carefree, Kevin MacLeod, CC-BY) 반복 ----
const audioEl = document.getElementById('bgmaudio');
audioEl.volume = 0.35;
let bgmOn = false;
function setBtn(){ const b=document.getElementById('bgm'); b.textContent = bgmOn?'🔊':'🔈'; b.classList.toggle('off', !bgmOn); }
function startBgm(){ audioEl.play().then(()=>{ bgmOn=true; setBtn(); }).catch(()=>{ bgmOn=false; setBtn(); }); }
function stopBgm(){ audioEl.pause(); bgmOn=false; setBtn(); }

const muted = localStorage.getItem('bgmMuted')==='1';
setBtn();
// 자동재생 정책: 첫 화면 터치 후 시작(음소거가 아니면). 음악 버튼 탭은 제외
function firstStart(e){ if(e.target && e.target.closest && e.target.closest('#bgm')) return; document.removeEventListener('pointerdown', firstStart); if(!muted && !bgmOn) startBgm(); }
document.addEventListener('pointerdown', firstStart);
document.getElementById('bgm').addEventListener('click', (e)=>{
  e.stopPropagation();
  if(bgmOn){ stopBgm(); localStorage.setItem('bgmMuted','1'); }
  else { localStorage.setItem('bgmMuted','0'); startBgm(); }
});
