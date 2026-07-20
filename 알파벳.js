// 알파벳 놀이 - 흐린 글자를 따라 그으면 완성 + 음성(영어). 외부 스크립트
const RES = 560;
const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
};
let setKey='upper', idx=0;
let guidePts=[], covered=[], coveredN=0, drawing=false, last=null, done=false;

const canvas=document.getElementById('art');
const ctx=canvas.getContext('2d',{willReadFrequently:true});
canvas.width=canvas.height=RES;
function fit(){ // 안쪽 여백 제외한 실제 영역 기준(가로모드에서 화면 밖으로 안 넘치게)
  const mid=document.getElementById("mid"), cs=getComputedStyle(mid);
  const aw=mid.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
  const ah=mid.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  const s=Math.floor(Math.min(aw,ah)); canvas.style.width=canvas.style.height=s+"px"; }

function loadChar(){
  const mid=document.getElementById('mid');
  if(!mid.clientWidth||!mid.clientHeight){ requestAnimationFrame(loadChar); return; }
  fit(); done=false;
  const set=SETS[setKey]; const ch=set[idx%set.length];
  ctx.clearRect(0,0,RES,RES);
  ctx.fillStyle='#d7d2c4'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.font='bold '+(RES*0.78)+'px sans-serif';
  ctx.fillText(ch, RES/2, RES*0.5);
  const d=ctx.getImageData(0,0,RES,RES).data;
  guidePts=[];
  for(let y=6;y<RES;y+=11) for(let x=6;x<RES;x+=11){ const i=(y*RES+x)*4; if(d[i+3]>40 && d[i]<230) guidePts.push({x,y}); }
  covered=guidePts.map(()=>false); coveredN=0;
  // 시작점 표시
  if(guidePts.length){ ctx.fillStyle='#ff8f3c'; ctx.beginPath(); ctx.arc(guidePts[0].x,guidePts[0].y,RES*0.04,0,7); ctx.fill(); }
}

function xy(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*RES, y:(e.clientY-r.top)/r.height*RES}; }
function markCover(p){
  const R=RES*0.075;
  for(let i=0;i<guidePts.length;i++){ if(covered[i]) continue; const dx=guidePts[i].x-p.x, dy=guidePts[i].y-p.y; if(dx*dx+dy*dy<R*R){ covered[i]=true; coveredN++; } }
  if(!done && guidePts.length && coveredN/guidePts.length > 0.6){ done=true; complete(); }
}
function stroke(p){
  ctx.strokeStyle='#3b7de2'; ctx.lineWidth=RES*0.055; ctx.lineCap='round'; ctx.lineJoin='round';
  if(last){ ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(p.x,p.y,RES*0.028,0,7); ctx.fillStyle='#3b7de2'; ctx.fill();
  markCover(p); last=p;
}
canvas.addEventListener('pointerdown',(e)=>{ drawing=true; last=null; audio(); stroke(xy(e)); scratch(); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove',(e)=>{ if(drawing) stroke(xy(e)); });
function end(){ drawing=false; last=null; } canvas.addEventListener('pointerup',end); canvas.addEventListener('pointercancel',end);

function complete(){ const ch=SETS[setKey][idx%SETS[setKey].length]; speak(ch.toUpperCase()); chord(); setTimeout(()=>{ idx++; loadChar(); },1600); }
function speak(t){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='en-US'; u.rate=0.8; speechSynthesis.speak(u); }catch(e){} }

document.getElementById('next').addEventListener('pointerdown',()=>{ idx++; loadChar(); ping(); });
document.getElementById('reset').addEventListener('pointerdown',()=>{ loadChar(); ping(); });
document.querySelectorAll('#diff button').forEach(btn=>{
  if(btn.dataset.k===setKey) btn.classList.add('on');
  btn.addEventListener('pointerdown',()=>{ setKey=btn.dataset.k; idx=0; document.querySelectorAll('#diff button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); loadChar(); ping(); });
});
window.addEventListener('resize', fit);

let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.08){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
let lastScratch=0;
function scratch(){ const now=Date.now(); if(now-lastScratch<45) return; lastScratch=now; beep(320+Math.random()*90,0.06,'triangle',0.04); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.32,'triangle'),i*100)); }
function ping(){ beep(600,0.1,'triangle',0.07); }

loadChar();
window.addEventListener('load', loadChar);
