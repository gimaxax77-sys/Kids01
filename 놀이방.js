// 놀이방 홈 - 연령대별 정렬 + 즐겨찾기(부모설정) + 실음원 BGM + PWA. 외부 스크립트
if('serviceWorker' in navigator){ window.addEventListener('load', ()=> navigator.serviceWorker.register('sw.js').catch(()=>{})); }

// 타일 순서: 그림판,분류,퍼즐,색칠,소리,붓기,숫자,그림자,선그리기,짝맞추기,코딩,한글,셈,패턴,미로,시계,알파벳,틀린그림,지렁이
const AGES = [1,2,3,2,1,4,3,3,3,4,5,5,5,4,4,5,5,4,4];
const room = document.getElementById('room');
const toys = [...document.querySelectorAll('.toy')];
toys.forEach((t,i)=>{
  t._age = AGES[i] || 1;
  t._href = t.getAttribute('href');
  t._label = t.getAttribute('aria-label');
  const s=document.createElement('span'); s.className='age'; s.textContent=t._age+'세+'; t.appendChild(s);
});

// 즐겨찾기 상태
function loadFavs(){ try{ return new Set(JSON.parse(localStorage.getItem('favs')||'[]')); }catch(e){ return new Set(); } }
function saveFavs(s){ try{ localStorage.setItem('favs', JSON.stringify([...s])); }catch(e){} }
let favs = loadFavs();
let favOnly = localStorage.getItem('favOnly')==='1';

const GROUPS = [
  { label:'처음 놀이  1~2세', test:a=>a<=2 },
  { label:'쑥쑥 놀이  3~4세', test:a=>a===3||a===4 },
  { label:'배움 놀이  5세+',  test:a=>a>=5 },
];

function render(){
  // 기존 그룹/타일 제거(안내 배너는 유지)
  room.querySelectorAll('.grouphdr, .toy, .emptyfav').forEach(el=> el.remove());
  const visible = favOnly ? toys.filter(t=>favs.has(t._href)) : toys;
  // 별 표시 갱신
  toys.forEach(t=>{ const old=t.querySelector('.favstar'); if(old) old.remove(); if(favs.has(t._href)){ const st=document.createElement('span'); st.className='favstar'; st.textContent='⭐'; t.appendChild(st); } });
  if(favOnly && !visible.length){
    const n=document.createElement('div'); n.className='emptyfav guide'; n.innerHTML='즐겨찾기가 없어요 <small>⚙️ 부모 설정에서 별을 눌러 골라주세요</small>';
    room.appendChild(n); return;
  }
  GROUPS.forEach(g=>{
    const inG = visible.filter(t=>g.test(t._age)).sort((a,b)=>{
      const fa=favs.has(a._href)?0:1, fb=favs.has(b._href)?0:1;
      return fa-fb || a._age-b._age;
    });
    if(!inG.length) return;
    const hdr=document.createElement('div'); hdr.className='grouphdr'; hdr.textContent=g.label; room.appendChild(hdr);
    inG.forEach(t=> room.appendChild(t));
  });
}
render();

// 부모 패널
const panel=document.getElementById('panel');
function buildFavList(){
  const list=document.getElementById('favlist'); list.innerHTML='';
  toys.forEach(t=>{
    const row=document.createElement('div'); row.className='favitem';
    const name=document.createElement('span'); name.textContent=t._label+'  ('+t._age+'세+)';
    const btn=document.createElement('button'); btn.textContent = favs.has(t._href)?'⭐':'☆';
    btn.addEventListener('click', ()=>{ if(favs.has(t._href)) favs.delete(t._href); else favs.add(t._href); saveFavs(favs); btn.textContent=favs.has(t._href)?'⭐':'☆'; render(); });
    row.appendChild(name); row.appendChild(btn); list.appendChild(row);
  });
}
document.getElementById('parent').addEventListener('click',(e)=>{ e.stopPropagation(); buildFavList(); document.getElementById('favonly').checked=favOnly; panel.classList.add('open'); });
document.getElementById('pclose').addEventListener('click',()=> panel.classList.remove('open'));
panel.addEventListener('click',(e)=>{ if(e.target===panel) panel.classList.remove('open'); });
document.getElementById('favonly').addEventListener('change',(e)=>{ favOnly=e.target.checked; localStorage.setItem('favOnly', favOnly?'1':'0'); render(); });

// ---- BGM: 실음원(Carefree, Kevin MacLeod, CC-BY) 반복 ----
const audioEl = document.getElementById('bgmaudio');
audioEl.volume = 0.35;
let bgmOn = false;
function setBtn(){ const b=document.getElementById('bgm'); b.textContent = bgmOn?'🔊':'🔈'; b.classList.toggle('off', !bgmOn); }
function startBgm(){ audioEl.play().then(()=>{ bgmOn=true; setBtn(); }).catch(()=>{ bgmOn=false; setBtn(); }); }
function stopBgm(){ audioEl.pause(); bgmOn=false; setBtn(); }
const muted = localStorage.getItem('bgmMuted')==='1';
setBtn();
function firstStart(e){ if(e.target && e.target.closest && (e.target.closest('#bgm')||e.target.closest('#parent')||e.target.closest('#panel'))) return; document.removeEventListener('pointerdown', firstStart); if(!muted && !bgmOn) startBgm(); }
document.addEventListener('pointerdown', firstStart);
document.getElementById('bgm').addEventListener('click', (e)=>{
  e.stopPropagation();
  if(bgmOn){ stopBgm(); localStorage.setItem('bgmMuted','1'); }
  else { localStorage.setItem('bgmMuted','0'); startBgm(); }
});
