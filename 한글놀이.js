// 한글 놀이 로직 - 획순 화살표를 따라 그으면 완성 + 음성. 외부 스크립트
const RES = 560, PAD = 78;
function circ(cx,cy,r){ const p=[]; for(let i=0;i<=18;i++){ const a=-Math.PI/2 + i/18*2*Math.PI; p.push([cx+r*Math.cos(a), cy+r*Math.sin(a)]); } return p; }
// 자모 획 데이터(0~1 좌표, 획 순서대로)
const ST = {
  'ㄱ':[[[.2,.24],[.8,.24],[.76,.8]]],
  'ㄴ':[[[.3,.2],[.3,.78],[.82,.78]]],
  'ㄷ':[[[.2,.24],[.82,.24]],[[.2,.24],[.2,.78],[.82,.78]]],
  'ㄹ':[[[.24,.22],[.76,.22],[.76,.5]],[[.24,.5],[.76,.5]],[[.24,.5],[.24,.8],[.78,.8]]],
  'ㅁ':[[[.26,.22],[.26,.8]],[[.26,.22],[.76,.22],[.76,.8],[.26,.8]]],
  'ㅂ':[[[.28,.16],[.28,.84]],[[.72,.16],[.72,.84]],[[.28,.52],[.72,.52]],[[.28,.84],[.72,.84]]],
  'ㅅ':[[[.5,.2],[.24,.82]],[[.53,.42],[.8,.82]]],
  'ㅇ':[circ(.5,.5,.3)],
  'ㅈ':[[[.22,.26],[.8,.26]],[[.5,.26],[.28,.82]],[[.53,.46],[.8,.82]]],
  'ㅊ':[[[.42,.12],[.6,.12]],[[.22,.34],[.8,.34]],[[.5,.34],[.28,.82]],[[.53,.52],[.8,.82]]],
  'ㅋ':[[[.2,.24],[.8,.24],[.76,.8]],[[.28,.52],[.74,.52]]],
  'ㅌ':[[[.2,.24],[.82,.24]],[[.2,.24],[.2,.8],[.82,.8]],[[.26,.52],[.78,.52]]],
  'ㅍ':[[[.2,.26],[.8,.26]],[[.34,.26],[.34,.76]],[[.66,.26],[.66,.76]],[[.2,.76],[.8,.76]]],
  'ㅎ':[[[.42,.1],[.6,.1]],[[.22,.32],[.8,.32]],circ(.5,.64,.19)],
  'ㅏ':[[[.5,.14],[.5,.86]],[[.5,.5],[.84,.5]]],
  'ㅑ':[[[.5,.14],[.5,.86]],[[.5,.36],[.84,.36]],[[.5,.64],[.84,.64]]],
  'ㅓ':[[[.16,.5],[.5,.5]],[[.5,.14],[.5,.86]]],
  'ㅕ':[[[.16,.36],[.5,.36]],[[.16,.64],[.5,.64]],[[.5,.14],[.5,.86]]],
  'ㅗ':[[[.5,.16],[.5,.5]],[[.16,.5],[.84,.5]]],
  'ㅛ':[[[.38,.16],[.38,.5]],[[.62,.16],[.62,.5]],[[.16,.5],[.84,.5]]],
  'ㅜ':[[[.16,.5],[.84,.5]],[[.5,.5],[.5,.84]]],
  'ㅠ':[[[.16,.5],[.84,.5]],[[.38,.5],[.38,.84]],[[.62,.5],[.62,.84]]],
  'ㅡ':[[[.14,.5],[.86,.5]]],
  'ㅣ':[[[.5,.14],[.5,.86]]],
};
const NAME = {'ㄱ':'기역','ㄴ':'니은','ㄷ':'디귿','ㄹ':'리을','ㅁ':'미음','ㅂ':'비읍','ㅅ':'시옷','ㅇ':'이응','ㅈ':'지읒','ㅊ':'치읓','ㅋ':'키읔','ㅌ':'티읕','ㅍ':'피읖','ㅎ':'히읗','ㅏ':'아','ㅑ':'야','ㅓ':'어','ㅕ':'여','ㅗ':'오','ㅛ':'요','ㅜ':'우','ㅠ':'유','ㅡ':'으','ㅣ':'이'};
const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const VERT = new Set(['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅣ']);

const SETS = {
  jaum: 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ'.split(''),
  moum: 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ'.split(''),
  geul: '가나다라마바사아자차카타파하'.split(''),
};
let setKey='jaum', idx=0;
let strokesN=[], guidePts=[], covered=[], coveredN=0, drawing=false, last=null, done=false;

const canvas=document.getElementById('art');
const ctx=canvas.getContext('2d',{willReadFrequently:true});
canvas.width=canvas.height=RES;
function fit(){ // 안쪽 여백 제외한 실제 영역 기준(가로모드에서 화면 밖으로 안 넘치게)
  const mid=document.getElementById("mid"), cs=getComputedStyle(mid);
  const aw=mid.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
  const ah=mid.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  const s=Math.floor(Math.min(aw,ah)); canvas.style.width=canvas.style.height=s+"px"; }

// 획을 박스에 매핑
function mapStrokes(strokes, box){ return strokes.map(st=> st.map(([x,y])=> [box[0]+x*(box[2]-box[0]), box[1]+y*(box[3]-box[1])])); }
function charStrokes(ch){
  if(ST[ch]) return mapStrokes(ST[ch], [0,0,1,1]);
  // 글자: 초성+중성 분해
  const code=ch.charCodeAt(0)-0xAC00;
  if(code<0||code>11171) return [];
  const cho=CHO[Math.floor(code/(21*28))], jung=JUNG[Math.floor(code%(21*28)/28)];
  let out=[];
  if(VERT.has(jung)){ out=out.concat(mapStrokes(ST[cho]||[], [.04,.1,.5,.9])); out=out.concat(mapStrokes(ST[jung]||[], [.5,.1,.96,.9])); }
  else { out=out.concat(mapStrokes(ST[cho]||[], [.12,.05,.88,.5])); out=out.concat(mapStrokes(ST[jung]||[], [.12,.5,.88,.95])); }
  return out;
}

function loadChar(){
  const mid=document.getElementById('mid');
  if(!mid.clientWidth||!mid.clientHeight){ requestAnimationFrame(loadChar); return; }
  fit(); done=false;
  const set=SETS[setKey]; const ch=set[idx%set.length];
  const raw=charStrokes(ch);
  // 캔버스 좌표(패딩 적용)
  strokesN = raw.map(st=> st.map(([x,y])=> ({x:PAD+x*(RES-2*PAD), y:PAD+y*(RES-2*PAD)})));
  // 커버 포인트 = 획 위 촘촘한 점들
  guidePts=[];
  strokesN.forEach(st=>{ for(let i=0;i<st.length-1;i++){ const a=st[i],b=st[i+1]; const d=Math.hypot(b.x-a.x,b.y-a.y); const n=Math.max(1,Math.round(d/14)); for(let k=0;k<=n;k++) guidePts.push({x:a.x+(b.x-a.x)*k/n, y:a.y+(b.y-a.y)*k/n}); } });
  covered=guidePts.map(()=>false); coveredN=0;
  drawGuide();
}

function drawGuide(){
  ctx.clearRect(0,0,RES,RES);
  ctx.lineCap='round'; ctx.lineJoin='round';
  strokesN.forEach((st,si)=>{
    // 흐린 굵은 안내선
    ctx.strokeStyle='#dcd7c8'; ctx.lineWidth=RES*0.085; ctx.beginPath();
    st.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.stroke();
    // 방향 화살표(획 끝)
    const p1=st[st.length-2], p2=st[st.length-1];
    arrow(p1,p2);
    // 시작 번호
    const s0=st[0];
    ctx.fillStyle='#ff8f3c'; ctx.beginPath(); ctx.arc(s0.x,s0.y,RES*0.05,0,7); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold '+(RES*0.06)+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(String(si+1), s0.x, s0.y+1);
  });
}
function arrow(a,b){
  const ang=Math.atan2(b.y-a.y, b.x-a.x); const L=RES*0.05;
  ctx.strokeStyle='#4a90e2'; ctx.lineWidth=RES*0.02; ctx.beginPath();
  ctx.moveTo(b.x - L*Math.cos(ang-0.5), b.y - L*Math.sin(ang-0.5)); ctx.lineTo(b.x,b.y);
  ctx.lineTo(b.x - L*Math.cos(ang+0.5), b.y - L*Math.sin(ang+0.5)); ctx.stroke();
}

function xy(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*RES, y:(e.clientY-r.top)/r.height*RES}; }
function markCover(p){
  const R=RES*0.08;
  for(let i=0;i<guidePts.length;i++){ if(covered[i]) continue; const dx=guidePts[i].x-p.x, dy=guidePts[i].y-p.y; if(dx*dx+dy*dy<R*R){ covered[i]=true; coveredN++; } }
  if(!done && guidePts.length && coveredN/guidePts.length > 0.68){ done=true; complete(); }
}
function stroke(p){
  ctx.strokeStyle='#3b7de2'; ctx.lineWidth=RES*0.05; ctx.lineCap='round'; ctx.lineJoin='round';
  if(last){ ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(p.x,p.y,RES*0.026,0,7); ctx.fillStyle='#3b7de2'; ctx.fill();
  markCover(p); last=p;
}
canvas.addEventListener('pointerdown',(e)=>{ drawing=true; last=null; audio(); stroke(xy(e)); scratch(); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove',(e)=>{ if(drawing) stroke(xy(e)); });
function end(){ drawing=false; last=null; } canvas.addEventListener('pointerup',end); canvas.addEventListener('pointercancel',end);

function complete(){
  const set=SETS[setKey]; const ch=set[idx%set.length];
  speak(setKey==='geul' ? ch : (NAME[ch]||ch));
  chord(); setTimeout(()=>{ idx++; loadChar(); }, 1700);
}
function speak(text){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='ko-KR'; u.rate=0.8; u.pitch=1.15; speechSynthesis.speak(u); }catch(e){} }

document.getElementById('next').addEventListener('pointerdown',()=>{ idx++; loadChar(); ping(); });
document.getElementById('reset').addEventListener('pointerdown',()=>{ loadChar(); ping(); });
document.querySelectorAll('#diff button').forEach(btn=>{
  if(btn.dataset.k===setKey) btn.classList.add('on');
  btn.addEventListener('pointerdown',()=>{ setKey=btn.dataset.k; idx=0; document.querySelectorAll('#diff button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); loadChar(); ping(); });
});
window.addEventListener('resize', fit);

// --- 소리 ---
let ac;
function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
function beep(f,d,type='sine',v=0.08){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
let lastScratch=0;
function scratch(){ const now=Date.now(); if(now-lastScratch<45) return; lastScratch=now; beep(320+Math.random()*90,0.06,'triangle',0.04); }
function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.32,'triangle'),i*100)); }
function ping(){ beep(600,0.1,'triangle',0.07); }

loadChar();
window.addEventListener('load', loadChar);
