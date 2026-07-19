// 한글 놀이 로직 - 흐린 글자를 따라 그으면 완성(글자 픽셀 커버 판정). 외부 스크립트
const RES = 560;
const SETS = {
  jaum: 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ'.split(''),
  moum: 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ'.split(''),
  geul: '가나다라마바사아자차카타파하'.split(''),
};
let setKey = 'jaum', idx = 0;
let guidePts = [], covered = [], coveredN = 0, drawing=false, last=null, done=false;
const color = '#3b7de2';

const canvas = document.getElementById('art');
const ctx = canvas.getContext('2d', { willReadFrequently:true });
canvas.width = canvas.height = RES;
function fit(){ const mid=document.getElementById('mid'); const s=Math.min(mid.clientWidth, mid.clientHeight)*0.95; canvas.style.width=canvas.style.height=s+'px'; }

function loadChar(){
  const mid=document.getElementById('mid');
  if(!mid.clientWidth || !mid.clientHeight){ requestAnimationFrame(loadChar); return; } // 레이아웃 전이면 재시도
  fit(); done=false;
  const set = SETS[setKey]; const ch = set[idx % set.length];
  ctx.clearRect(0,0,RES,RES);
  ctx.fillStyle='#d7d2c4'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.font = 'bold '+(RES*0.72)+'px sans-serif';
  ctx.fillText(ch, RES/2, RES*0.52);
  // 글자 픽셀에서 커버 포인트 추출
  const d = ctx.getImageData(0,0,RES,RES).data;
  guidePts=[];
  for(let y=6;y<RES;y+=11) for(let x=6;x<RES;x+=11){ const i=(y*RES+x)*4; if(d[i+3]>40 && d[i]<230) guidePts.push({x,y}); }
  covered = guidePts.map(()=>false); coveredN=0;
}

function xy(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*RES, y:(e.clientY-r.top)/r.height*RES}; }
function markCover(p){
  const R=RES*0.075;
  for(let i=0;i<guidePts.length;i++){ if(covered[i]) continue; const dx=guidePts[i].x-p.x, dy=guidePts[i].y-p.y; if(dx*dx+dy*dy<R*R){ covered[i]=true; coveredN++; } }
  if(!done && guidePts.length && coveredN/guidePts.length > 0.62){ done=true; complete(); }
}
function stroke(p){
  ctx.strokeStyle=color; ctx.lineWidth=RES*0.055; ctx.lineCap='round'; ctx.lineJoin='round';
  if(last){ ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(p.x,p.y,RES*0.028,0,7); ctx.fillStyle=color; ctx.fill();
  markCover(p); last=p;
}
canvas.addEventListener('pointerdown',(e)=>{ drawing=true; last=null; audio(); stroke(xy(e)); scratch(); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove',(e)=>{ if(drawing) stroke(xy(e)); });
function end(){ drawing=false; last=null; } canvas.addEventListener('pointerup',end); canvas.addEventListener('pointercancel',end);
function complete(){ chord(); setTimeout(()=>{ idx++; loadChar(); }, 1300); }

document.getElementById('next').addEventListener('click',()=>{ idx++; loadChar(); ping(); });
document.getElementById('reset').addEventListener('click',()=>{ loadChar(); ping(); });
document.querySelectorAll('#diff button').forEach(btn=>{
  if(btn.dataset.k===setKey) btn.classList.add('on');
  btn.addEventListener('click',()=>{ setKey=btn.dataset.k; idx=0; document.querySelectorAll('#diff button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); loadChar(); ping(); });
});
window.addEventListener('resize', fit);

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.08){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
let lastScratch=0;
function scratch(){ const now=Date.now(); if(now-lastScratch<45) return; lastScratch=now; beep(320+Math.random()*90,0.06,'triangle',0.04); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.35,'triangle'),i*110)); }
function ping(){ beep(600,0.1,'triangle',0.07); }

loadChar();
window.addEventListener('load', loadChar);
