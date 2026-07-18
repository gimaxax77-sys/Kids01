// 선 따라 그리기 로직 - 흐린 안내선을 따라 그으면 채워지고 완성. 외부 스크립트
const RES = 560, PAD = 70;
const COLORS = ['#e23b3b','#ef7d1a','#3fae54','#3b7de2','#9b4fd0','#ec5a92'];
// 안내 도형(0~1 좌표 파라메트릭)
const SHAPES = [
  { name:'line',   pts:t=>({x:t, y:0.5}) },
  { name:'wave',   pts:t=>({x:t, y:0.5 + 0.28*Math.sin(t*Math.PI*3)}) },
  { name:'updown', pts:t=>({x:0.5, y:t}) },
  { name:'zigzag', pts:t=>({x:t, y:0.3 + 0.4*Math.abs(((t*4)%2)-1)}) },
  { name:'circle', pts:t=>({x:0.5+0.42*Math.cos(t*2*Math.PI-Math.PI/2), y:0.5+0.42*Math.sin(t*2*Math.PI-Math.PI/2)}) },
  { name:'square', pts:t=>squarePt(t) },
  { name:'triangle', pts:t=>triPt(t) },
  { name:'star',   pts:t=>starPt(t) },
];
function squarePt(t){ const s=t*4, e=Math.floor(s)%4, f=s-Math.floor(s); const c=[[0.1,0.1],[0.9,0.1],[0.9,0.9],[0.1,0.9],[0.1,0.1]]; const a=c[e],b=c[e+1]; return {x:a[0]+(b[0]-a[0])*f, y:a[1]+(b[1]-a[1])*f}; }
function triPt(t){ const s=t*3, e=Math.floor(s)%3, f=s-Math.floor(s); const c=[[0.5,0.08],[0.92,0.9],[0.08,0.9],[0.5,0.08]]; const a=c[e],b=c[e+1]; return {x:a[0]+(b[0]-a[0])*f, y:a[1]+(b[1]-a[1])*f}; }
function starPt(t){ const pts=[]; for(let i=0;i<=10;i++){ const ang=-Math.PI/2 + i*Math.PI/5; const r=i%2?0.18:0.44; pts.push([0.5+r*Math.cos(ang), 0.5+r*Math.sin(ang)]); } const s=t*10, e=Math.floor(s)%10, f=s-Math.floor(s); const a=pts[e],b=pts[e+1]; return {x:a[0]+(b[0]-a[0])*f, y:a[1]+(b[1]-a[1])*f}; }

let shapeIdx = 0, guidePts = [], covered = [], coveredN = 0, color = COLORS[0], drawing=false, last=null, done=false;
const canvas = document.getElementById('art');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = RES;

function fit(){ const mid=document.getElementById('mid'); const s=Math.min(mid.clientWidth, mid.clientHeight)*0.95; canvas.style.width=canvas.style.height=s+'px'; }

function loadShape(){
  fit(); done=false; color = COLORS[shapeIdx % COLORS.length];
  const sh = SHAPES[shapeIdx % SHAPES.length];
  guidePts = []; for(let i=0;i<=90;i++){ const p=sh.pts(i/90); guidePts.push({x:PAD+p.x*(RES-2*PAD), y:PAD+p.y*(RES-2*PAD)}); }
  covered = guidePts.map(()=>false); coveredN=0;
  drawGuide();
}
function drawGuide(){
  ctx.clearRect(0,0,RES,RES);
  ctx.lineCap='round'; ctx.lineJoin='round';
  // 안내선(흐린 굵은 회색)
  ctx.strokeStyle='#c9cdd6'; ctx.lineWidth=RES*0.075; ctx.beginPath();
  guidePts.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.stroke();
  // 출발점 표시
  ctx.fillStyle='#3fae54'; ctx.beginPath(); ctx.arc(guidePts[0].x, guidePts[0].y, RES*0.045, 0, 7); ctx.fill();
}

function xy(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*RES, y:(e.clientY-r.top)/r.height*RES}; }
function markCover(p){
  const R=RES*0.07;
  for(let i=0;i<guidePts.length;i++){ if(covered[i]) continue; const dx=guidePts[i].x-p.x, dy=guidePts[i].y-p.y; if(dx*dx+dy*dy < R*R){ covered[i]=true; coveredN++; } }
  if(!done && coveredN/guidePts.length > 0.8){ done=true; complete(); }
}
function stroke(p){
  ctx.strokeStyle=color; ctx.lineWidth=RES*0.05; ctx.lineCap='round'; ctx.lineJoin='round';
  if(last){ ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(p.x,p.y,RES*0.025,0,7); ctx.fillStyle=color; ctx.fill();
  markCover(p); last=p;
}
canvas.addEventListener('pointerdown',(e)=>{ drawing=true; last=null; audio(); stroke(xy(e)); scratch(); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove',(e)=>{ if(drawing) stroke(xy(e)); });
function end(){ drawing=false; last=null; } canvas.addEventListener('pointerup',end); canvas.addEventListener('pointercancel',end);

function complete(){ chord(); setTimeout(()=>{ shapeIdx++; loadShape(); }, 1300); }

document.getElementById('next').addEventListener('click', ()=>{ shapeIdx++; loadShape(); ping(); });
document.getElementById('reset').addEventListener('click', ()=>{ loadShape(); ping(); });
window.addEventListener('resize', fit);

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.08){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
let lastScratch=0;
function scratch(){ const now=Date.now(); if(now-lastScratch<40) return; lastScratch=now; beep(300+Math.random()*100,0.06,'triangle',0.04); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.35,'triangle'),i*110)); }
function ping(){ beep(600,0.1,'triangle',0.07); }

loadShape();
