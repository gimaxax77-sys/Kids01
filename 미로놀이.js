// 미로 찾기 로직 - 손가락으로 길을 따라 별까지. 외부 스크립트
let size = 6; // 난이도(칸 수)
let cells = [], ball = {r:0,c:0}, trail = [], win = false;
const canvas = document.getElementById('art');
const ctx = canvas.getContext('2d');
let RES = 560, cell = 0, pad = 14;
canvas.width = canvas.height = RES;
function fit(){ const mid=document.getElementById('mid'); const s=Math.min(mid.clientWidth,mid.clientHeight)*0.95; canvas.style.width=canvas.style.height=s+'px'; }
const idx=(r,c)=>r*size+c;

function newMaze(){
  const mid=document.getElementById('mid');
  if(!mid.clientWidth||!mid.clientHeight){ requestAnimationFrame(newMaze); return; }
  fit(); win=false;
  cell=(RES-2*pad)/size;
  cells = Array.from({length:size*size}, ()=>({N:true,E:true,S:true,W:true,v:false}));
  // 재귀적 백트래커
  const st=[0]; cells[0].v=true;
  while(st.length){
    const cur=st[st.length-1]; const r=Math.floor(cur/size), c=cur%size;
    const nb=[];
    if(r>0 && !cells[idx(r-1,c)].v) nb.push(['N',idx(r-1,c)]);
    if(c<size-1 && !cells[idx(r,c+1)].v) nb.push(['E',idx(r,c+1)]);
    if(r<size-1 && !cells[idx(r+1,c)].v) nb.push(['S',idx(r+1,c)]);
    if(c>0 && !cells[idx(r,c-1)].v) nb.push(['W',idx(r,c-1)]);
    if(!nb.length){ st.pop(); continue; }
    const [dir,ni]=nb[Math.floor(Math.random()*nb.length)];
    const opp={N:'S',E:'W',S:'N',W:'E'};
    cells[cur][dir]=false; cells[ni][opp[dir]]=false; cells[ni].v=true; st.push(ni);
  }
  ball={r:0,c:0}; trail=[0]; draw();
}

function draw(){
  ctx.clearRect(0,0,RES,RES); ctx.fillStyle='#fff'; ctx.fillRect(0,0,RES,RES);
  // 지나온 길
  ctx.strokeStyle='#ffe08a'; ctx.lineWidth=cell*0.55; ctx.lineCap='round'; ctx.lineJoin='round';
  if(trail.length>1){ ctx.beginPath(); trail.forEach((ci,i)=>{ const r=Math.floor(ci/size),c=ci%size; const x=pad+c*cell+cell/2, y=pad+r*cell+cell/2; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke(); }
  // 벽
  ctx.strokeStyle='#5a6b8a'; ctx.lineWidth=Math.max(3,cell*0.09); ctx.lineCap='round';
  for(let r=0;r<size;r++) for(let c=0;c<size;c++){
    const cc=cells[idx(r,c)]; const x=pad+c*cell, y=pad+r*cell;
    ctx.beginPath();
    if(cc.N){ ctx.moveTo(x,y); ctx.lineTo(x+cell,y); }
    if(cc.W){ ctx.moveTo(x,y); ctx.lineTo(x,y+cell); }
    if(cc.E){ ctx.moveTo(x+cell,y); ctx.lineTo(x+cell,y+cell); }
    if(cc.S){ ctx.moveTo(x,y+cell); ctx.lineTo(x+cell,y+cell); }
    ctx.stroke();
  }
  // 출구(별)
  const ex=size-1; ctx.font=(cell*0.7)+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('⭐', pad+ex*cell+cell/2, pad+ex*cell+cell/2);
  // 공
  ctx.fillStyle='#e23b3b'; ctx.beginPath(); ctx.arc(pad+ball.c*cell+cell/2, pad+ball.r*cell+cell/2, cell*0.28, 0, 7); ctx.fill();
}

function open(a,b){ // a,b 인접 셀 인덱스, 벽 없으면 true
  const ar=Math.floor(a/size),ac=a%size,br=Math.floor(b/size),bc=b%size;
  if(ar===br && bc===ac+1) return !cells[a].E;
  if(ar===br && bc===ac-1) return !cells[a].W;
  if(ac===bc && br===ar+1) return !cells[a].S;
  if(ac===bc && br===ar-1) return !cells[a].N;
  return false;
}
function move(e){
  if(win) return;
  const r=canvas.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width*RES, y=(e.clientY-r.top)/r.height*RES;
  const c=Math.floor((x-pad)/cell), rr=Math.floor((y-pad)/cell);
  if(c<0||rr<0||c>=size||rr>=size) return;
  const target=idx(rr,c), cur=idx(ball.r,ball.c);
  if(target===cur) return;
  if(open(cur,target)){
    ball={r:rr,c:c};
    if(trail.length>1 && trail[trail.length-2]===target) trail.pop(); else trail.push(target);
    audio(); step();
    draw();
    if(ball.r===size-1 && ball.c===size-1){ win=true; chord(); setTimeout(newMaze,1600); }
  }
}
let drawing=false;
canvas.addEventListener('pointerdown',(e)=>{ drawing=true; audio(); move(e); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove',(e)=>{ if(drawing) move(e); });
canvas.addEventListener('pointerup',()=>drawing=false);
canvas.addEventListener('pointercancel',()=>drawing=false);

document.getElementById('new').addEventListener('click',()=>{ newMaze(); ping(); });
// 레벨 1~10 → 미로 칸 수 5~14
LevelStepper({ key:'lv_maze', max:10, onChange:(lv)=>{ size = 4+lv; newMaze(); } });
window.addEventListener('resize', ()=>{ fit(); draw(); });

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.08){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
let lastStep=0;
function step(){ const n=Date.now(); if(n-lastStep<50) return; lastStep=n; beep(420,0.05,'triangle',0.05); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.32,'triangle'),i*100)); }
function ping(){ beep(600,0.1,'triangle',0.07); }

window.addEventListener('load', newMaze);
