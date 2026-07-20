// 화살표 탈출 - 꺾이는(ㄱ자) 화살표를 머리 방향으로 자기 경로를 따라 미끄러뜨려 빼내기. 항상 클리어 가능
(function(){
  const PRO = new URLSearchParams(location.search).get('mode') === 'pro'; // 일반(도전) 모드
  if (PRO) document.title = '화살표 탈출 · 도전';
  const cv = document.getElementById('board');
  const ctx = cv.getContext('2d');
  const mid = document.getElementById('mid');
  const livesEl = document.getElementById('lives');
  const MAX_LIVES = 5;
  const DV = { U:{dr:-1,dc:0}, D:{dr:1,dc:0}, L:{dr:0,dc:-1}, R:{dr:0,dc:1} };
  const COLOR = { U:'#e23b3b', D:'#3b7de2', L:'#3fae54', R:'#ef7d1a' };
  const UNI = [38,44,66];                 // 20단계 통일색(짙은 남색/검정 계열)
  let colorOf = Object.assign({}, COLOR); // 실제로 쓰는 색(레벨에 따라 옅어짐)
  function updateColors(){ // 도전 10단계부터 서서히 옅어지고 20단계에 전부 같은 색
    if(!PRO){ colorOf = Object.assign({}, COLOR); return; }
    const t = Math.max(0, Math.min(1, (curLv-10)/10));
    if(t<=0){ colorOf = Object.assign({}, COLOR); return; }
    const mix = (hex)=>{
      const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
      return 'rgb('+Math.round(r+(UNI[0]-r)*t)+','+Math.round(g+(UNI[1]-g)*t)+','+Math.round(b+(UNI[2]-b)*t)+')';
    };
    colorOf = { U:mix(COLOR.U), D:mix(COLOR.D), L:mix(COLOR.L), R:mix(COLOR.R) };
  }
  const REV = { U:'D', D:'U', L:'R', R:'L' };

  let N = 3, cell = 20, S = 0, curLv = 1, effLv = 1; // effLv: 실제 난이도(도전은 +9 상향)
  let cells = [];                        // N*N: 화살표 id 또는 -1
  let mask = [];                         // N*N: 화살표를 놓을 수 있는 칸(판 형상)
  let arrows = [];                       // {id,path,d,track,off,maxOff,sliding,blockUntil,removed}
  let remaining = 0, busy = false, lives = MAX_LIVES, anim = null, winPending = false;

  const idx = (r,c)=> r*N + c;
  const inb = (r,c)=> r>=0 && r<N && c>=0 && c<N;
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function renderLives(){ if(PRO && livesEl) livesEl.textContent = '❤️'.repeat(lives) + '🖤'.repeat(MAX_LIVES - lives); }

  function frontClear(hr,hc,d){ const v=DV[d]; let r=hr+v.dr, c=hc+v.dc; while(inb(r,c)){ if(cells[idx(r,c)]>=0) return false; r+=v.dr; c+=v.dc; } return true; }

  // 자기 회피 경로(꺾임 허용) 하나 만들기
  const MINLEN = 3; // 최소 3칸짜리부터 배치
  function randPath(maxLen, sr, sc){
    if(sr===undefined){ sr=(Math.random()*N)|0; sc=(Math.random()*N)|0; }
    if(!mask[idx(sr,sc)] || cells[idx(sr,sc)]>=0) return null;
    let d = ['U','D','L','R'][(Math.random()*4)|0];
    const path=[[sr,sc]]; const used=new Set([idx(sr,sc)]);
    const L = MINLEN + ((Math.random()*Math.max(1, maxLen-MINLEN+1))|0);
    while(path.length < L){
      const [lr,lc]=path[path.length-1];
      const perp = (d==='U'||d==='D') ? shuffle(['L','R']) : shuffle(['U','D']);
      const straight = Math.max(0.42, 0.68 - effLv*0.006); // 레벨 높을수록 더 자주 꺾임
      const opts = Math.random()<straight ? [d, ...perp] : [...perp, d];
      let moved=false;
      for(const nd of opts){ if(nd===REV[d]) continue; const v=DV[nd]; const nr=lr+v.dr, nc=lc+v.dc;
        if(inb(nr,nc) && mask[idx(nr,nc)] && cells[idx(nr,nc)]<0 && !used.has(idx(nr,nc))){ path.push([nr,nc]); used.add(idx(nr,nc)); d=nd; moved=true; break; } }
      if(!moved) break;
    }
    if(path.length < MINLEN) return null; // 1~2칸짜리는 버림
    return { path, d }; // d = 마지막 이동 방향(머리 방향)
  }

  function makeArrow(id, path, d){
    const dv=DV[d];
    const pts = path.map(([r,c])=>({x:c+0.5, y:r+0.5}));
    if(pts.length===1) pts.unshift({ x:pts[0].x - dv.dc*0.55, y:pts[0].y - dv.dr*0.55 }); // 한 칸이면 짧은 꼬리
    const baseCount = pts.length;
    const head = path[path.length-1];
    const extSteps = N + 2;
    for(let s=1;s<=extSteps;s++) pts.push({ x:head[1]+0.5 + dv.dc*s, y:head[0]+0.5 + dv.dr*s });
    const cum=[0]; for(let i=1;i<pts.length;i++){ cum.push(cum[i-1] + Math.hypot(pts[i].x-pts[i-1].x, pts[i].y-pts[i-1].y)); }
    const bodyLen = cum[baseCount-1];
    let hb=0, r=head[0]+dv.dr, c=head[1]+dv.dc; while(inb(r,c)){ hb++; r+=dv.dr; c+=dv.dc; }
    return { id, path, d, track:{ pts, cum, total:cum[cum.length-1], bodyLen }, off:0, maxOff:bodyLen+hb+1, sliding:false, blockUntil:0, removed:false };
  }

  function tryPlace(path, d){ // 경로를 놓아보고, 머리 앞이 안 열리면 롤백. 성공 시 true
    const id = arrows.length;
    path.forEach(([r,c])=> cells[idx(r,c)]=id);
    const head = path[path.length-1];
    if(!frontClear(head[0],head[1],d)){ path.forEach(([r,c])=> cells[idx(r,c)]=-1); return false; }
    arrows.push(makeArrow(id, path, d)); return true;
  }
  // 판 형상(사각형 외 여러 모양). 작은 격자는 사각형만
  function makeMask(){
    const m = new Array(N*N).fill(true);
    if(N < 7) return m;
    const kinds = ['square','circle','diamond','cross','octagon','steps'];
    const kind = kinds[(Math.random()*kinds.length)|0];
    if(kind === 'square') return m;
    const mid = (N-1)/2;
    for(let r=0;r<N;r++) for(let c=0;c<N;c++){
      const dr=r-mid, dc=c-mid; let ok=true;
      if(kind==='circle')  ok = (dr*dr+dc*dc) <= (mid+0.35)*(mid+0.35);
      if(kind==='diamond') ok = (Math.abs(dr)+Math.abs(dc)) <= mid+0.5;
      if(kind==='cross'){ const w=Math.max(1, Math.round(N/3)); ok = Math.abs(dr)<=w/2 || Math.abs(dc)<=w/2; }
      if(kind==='octagon'){ const k=Math.max(1, Math.floor(N/4));
        ok = (r+c>=k) && (r+(N-1-c)>=k) && ((N-1-r)+c>=k) && ((N-1-r)+(N-1-c)>=k); }
      if(kind==='steps')   ok = c <= N-1 - Math.floor(r/2); // 계단 모양
      if(!ok) m[idx(r,c)] = false;
    }
    return m;
  }

  function generate(){
    const maxLen = Math.min(PRO ? (5 + Math.floor(effLv/3)) : 5, N+2); // 도전은 레벨 오를수록 화살표가 길어짐
    mask = makeMask();
    const playable = mask.reduce((n,v)=>n+(v?1:0),0);
    let best=null, bestOcc=-1;
    for(let att=0; att<8; att++){
      cells = new Array(N*N).fill(-1); arrows = [];
      // 안쪽(가장자리에서 먼 칸)부터 채움 → 바깥쪽 통로가 비어 있어 촘촘히 참
      const order = shuffle([...Array(N*N).keys()]).filter(i=>mask[i]).sort((a,b)=>{
        const bd=i=>{ const r=(i/N)|0,c=i%N; return Math.min(r,c,N-1-r,N-1-c); };
        return bd(b)-bd(a);
      });
      let progress=true, guard=0;
      while(progress && guard++ < N*N*3){ // 빈 칸이 채워질 때까지: 각 빈칸에서 화살표를 키워 메움
        progress=false;
        for(const i of order){ if(cells[i]>=0) continue; const r=(i/N)|0, c=i%N;
          for(let t=0;t<12;t++){ const pr = randPath(maxLen, r, c); if(pr && tryPlace(pr.path, pr.d)){ progress=true; break; } }
        }
      }
      const occ = cells.filter(x=>x>=0).length;
      if(occ > bestOcc){ bestOcc=occ; best={ cells:cells.slice(), arrows:arrows.slice() }; }
      if(occ === playable) break; // 형상 전체가 꽉 참
    }
    cells = best.cells; arrows = best.arrows; remaining = arrows.length;
  }

  function fit(){
    const w = mid.clientWidth, h = mid.clientHeight;
    if(!w || !h){ requestAnimationFrame(fit); return; }
    const cs = getComputedStyle(mid);
    const availW = w - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const availH = h - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    S = Math.floor(Math.min(availW, availH));
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    cv.style.width = cv.style.height = S + 'px';
    cv.width = cv.height = Math.round(S * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    cell = S / N;
    draw();
  }

  function ptAt(track, arc){
    const cum=track.cum, pts=track.pts;
    for(let i=0;i<cum.length-1;i++){
      if(arc <= cum[i+1]){ const seg=(cum[i+1]-cum[i])||1; const t=(arc-cum[i])/seg;
        return { x:pts[i].x+(pts[i+1].x-pts[i].x)*t, y:pts[i].y+(pts[i+1].y-pts[i].y)*t,
                 dx:Math.sign(pts[i+1].x-pts[i].x), dy:Math.sign(pts[i+1].y-pts[i].y) }; }
    }
    const L=pts[pts.length-1]; return { x:L.x, y:L.y, dx:0, dy:0 };
  }
  function windowPts(track, lo, hi){
    lo=Math.max(0,lo); hi=Math.min(track.total,hi); if(hi<=lo+1e-4) return null;
    const out=[ptAt(track,lo)];
    for(let i=0;i<track.pts.length;i++){ if(track.cum[i]>lo && track.cum[i]<hi) out.push(track.pts[i]); }
    out.push(ptAt(track,hi)); return out;
  }

  function drawHead(cx,cy,dx,dy,col){
    if(!dx && !dy) return;
    const hh=cell*0.20;
    const tipx=cx+dx*cell*0.20, tipy=cy+dy*cell*0.20, bx=cx-dx*cell*0.03, by=cy-dy*cell*0.03, px=-dy, py=dx;
    ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(tipx,tipy); ctx.lineTo(bx+px*hh,by+py*hh); ctx.lineTo(bx-px*hh,by-py*hh); ctx.closePath(); ctx.fill();
  }
  function drawArrow(a){
    let shx=0, shy=0;
    if(a.blockUntil>Date.now()){ const m=Math.sin((a.blockUntil-Date.now())/24)*0.12; const dv=DV[a.d]; shx=(-dv.dr)*m; shy=(dv.dc)*m; }
    const hi = Math.min(a.off + a.track.bodyLen, a.track.total);
    const w = windowPts(a.track, a.off, hi); if(!w) return;
    ctx.strokeStyle=colorOf[a.d]; ctx.lineWidth=cell*0.26; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); w.forEach((p,i)=>{ const X=(p.x+shx)*cell, Y=(p.y+shy)*cell; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }); ctx.stroke();
    const f = ptAt(a.track, hi);
    drawHead((f.x+shx)*cell, (f.y+shy)*cell, f.dx, f.dy, colorOf[a.d]);
  }
  // --- 폭죽 ---
  let parts = [];
  const SPARK = ['#e23b3b','#3b7de2','#3fae54','#ef7d1a','#f5c518','#9b4fd0','#ec5a92'];
  function burst(x,y){
    for(let i=0;i<30;i++){
      const a=Math.random()*Math.PI*2, sp=(1+Math.random()*3.4)*(S/360);
      parts.push({ x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-1.2*(S/360), life:1,
                   col:SPARK[(Math.random()*SPARK.length)|0], r:(2+Math.random()*2.6)*(S/360) });
    }
  }
  function stepParts(){
    for(const p of parts){ p.x+=p.vx; p.y+=p.vy; p.vy+=0.09*(S/360); p.vx*=0.99; p.life-=0.018; }
    parts = parts.filter(p=>p.life>0);
  }
  function drawParts(){
    for(const p of parts){ ctx.globalAlpha=Math.max(0,p.life); ctx.fillStyle=p.col;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); }
    ctx.globalAlpha=1;
  }

  function draw(){ ctx.clearRect(0,0,S,S); arrows.forEach(a=>{ if(!a.removed) drawArrow(a); }); drawParts(); }

  function ensureAnim(){ if(!anim) anim=setInterval(step,16); }
  function step(){
    let active=false; const now=Date.now();
    arrows.forEach(a=>{ if(a.sliding){ active=true; a.off+=0.55; if(a.off>=a.maxOff){ a.sliding=false; a.removed=true; } } if(a.blockUntil>now) active=true; });
    if(parts.length){ stepParts(); active=true; }
    draw();
    if(remaining<=0 && !arrows.some(a=>a.sliding) && !winPending && !busy){ winPending=true; win(); }
    if(!active){ clearInterval(anim); anim=null; }
  }

  function tap(id){
    const a=arrows[id]; if(!a || a.sliding || a.removed || busy) return;
    audio();
    const head=a.path[a.path.length-1];
    if(frontClear(head[0], head[1], a.d)){
      a.path.forEach(([r,c])=>{ if(cells[idx(r,c)]===id) cells[idx(r,c)]=-1; }); // 즉시 논리 제거(연쇄 가능)
      remaining--; a.sliding=true; a.off=0; good(); ensureAnim();
    } else {
      a.blockUntil=Date.now()+280; ensureAnim(); blip();
      if(PRO){ lives--; renderLives(); if(lives<=0) gameOver(); }
    }
  }

  cv.addEventListener('click', (e)=>{
    if(busy || !S) return;
    const rect=cv.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width*S, y=(e.clientY-rect.top)/rect.height*S;
    const c=(x/cell)|0, r=(y/cell)|0; if(!inb(r,c)) return;
    const id=cells[idx(r,c)]; if(id>=0) tap(id);
  });

  function win(){ // 클리어: 폭죽 + 팡파레
    busy=true; fanfare();
    let n=0;
    burst(S*0.5, S*0.42); ensureAnim();
    const t=setInterval(()=>{
      burst(S*(0.18+Math.random()*0.64), S*(0.18+Math.random()*0.5));
      pop(); ensureAnim();
      if(++n>=5) clearInterval(t);
    }, 230);
    setTimeout(()=>{ busy=false; winPending=false; parts=[]; newPuzzle(); }, 2200);
  }
  function gameOver(){ busy=true; sad(); setTimeout(()=>{ busy=false; newPuzzle(); }, 1300); }
  function newPuzzle(){ lives=MAX_LIVES; renderLives(); winPending=false; generate(); fit(); }

  document.getElementById('new').addEventListener('click', ()=>{ if(!busy){ newPuzzle(); ping(); } });
  window.addEventListener('resize', fit);

  if(new URLSearchParams(location.search).get('debug'))
    window.__ae = { get arrows(){return arrows;}, get cells(){return cells;}, get mask(){return mask;}, get N(){return N;}, get S(){return S;}, get cell(){return cell;}, DV, frontClear, tap };

  // 유아: 레벨 1~10 (3×3~9×9) / 도전: 레벨 1~50 (난이도 10단계 상향: 새 1단계 = 옛 10단계)
  LevelStepper({ key: PRO?'lv_arrowpro':'lv_arrow', max: PRO?50:10, onChange:(lv)=>{
    curLv = lv;
    effLv = PRO ? lv + 9 : lv;
    updateColors();
    N = PRO ? Math.min(4 + effLv, 24) : Math.min(3 + Math.floor((lv-1)*0.7), 9);
    newPuzzle();
  } });

  // --- 소리 ---
  let ac;
  function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
  function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
  function good(){ // 탈출: 또렷한 상승음
    beep(660,0.12,'triangle',0.22); setTimeout(()=>beep(990,0.16,'triangle',0.20),55); setTimeout(()=>beep(1320,0.12,'sine',0.12),115);
  }
  function blip(){ beep(150,0.18,'square',0.13); setTimeout(()=>beep(110,0.14,'sine',0.10),50); } // 막힘: 묵직하게
  function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.34,'triangle',0.18),i*90)); }
  function sad(){ [440,392,330,262].forEach((f,i)=>setTimeout(()=>beep(f,0.30,'sine',0.15),i*150)); }
  function ping(){ beep(600,0.1,'triangle',0.12); }
  function pop(){ // 폭죽 터지는 소리
    const a=audio(); const o=a.createOscillator(), g=a.createGain();
    o.type='triangle'; o.frequency.setValueAtTime(900+Math.random()*500, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, a.currentTime+0.22);
    g.gain.setValueAtTime(0.22, a.currentTime); g.gain.exponentialRampToValueAtTime(0.001, a.currentTime+0.26);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime+0.28);
  }
  function fanfare(){ // 팡파레
    const seq=[[523,0],[659,90],[784,180],[1046,270],[988,430],[1046,520]];
    seq.forEach(([f,t])=> setTimeout(()=>beep(f,0.34,'triangle',0.26), t));
    setTimeout(()=>{ [523,659,784,1046].forEach(f=>beep(f,0.75,'triangle',0.16)); }, 660);
    setTimeout(()=>{ [659,784,988,1319].forEach(f=>beep(f,0.85,'triangle',0.15)); }, 1150);
  }
})();
