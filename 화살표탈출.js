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
  const REV = { U:'D', D:'U', L:'R', R:'L' };

  let N = 3, cell = 20, S = 0, curLv = 1;
  let cells = [];                        // N*N: 화살표 id 또는 -1
  let arrows = [];                       // {id,path,d,track,off,maxOff,sliding,blockUntil,removed}
  let remaining = 0, busy = false, lives = MAX_LIVES, anim = null, winPending = false;

  const idx = (r,c)=> r*N + c;
  const inb = (r,c)=> r>=0 && r<N && c>=0 && c<N;
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function renderLives(){ if(PRO && livesEl) livesEl.textContent = '❤️'.repeat(lives) + '🖤'.repeat(MAX_LIVES - lives); }

  function frontClear(hr,hc,d){ const v=DV[d]; let r=hr+v.dr, c=hc+v.dc; while(inb(r,c)){ if(cells[idx(r,c)]>=0) return false; r+=v.dr; c+=v.dc; } return true; }

  // 자기 회피 경로(꺾임 허용) 하나 만들기
  function randPath(maxLen){
    const sr=(Math.random()*N)|0, sc=(Math.random()*N)|0;
    if(cells[idx(sr,sc)]>=0) return null;
    let d = ['U','D','L','R'][(Math.random()*4)|0];
    const path=[[sr,sc]]; const used=new Set([idx(sr,sc)]);
    const L = 1 + ((Math.random()*maxLen)|0);
    while(path.length < L){
      const [lr,lc]=path[path.length-1];
      const perp = (d==='U'||d==='D') ? shuffle(['L','R']) : shuffle(['U','D']);
      const opts = Math.random()<0.68 ? [d, ...perp] : [...perp, d];
      let moved=false;
      for(const nd of opts){ if(nd===REV[d]) continue; const v=DV[nd]; const nr=lr+v.dr, nc=lc+v.dc;
        if(inb(nr,nc) && cells[idx(nr,nc)]<0 && !used.has(idx(nr,nc))){ path.push([nr,nc]); used.add(idx(nr,nc)); d=nd; moved=true; break; } }
      if(!moved) break;
    }
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

  function generate(){
    const maxLen = Math.min(PRO ? (5 + Math.floor(curLv/3)) : 5, N+2); // 도전은 레벨 오를수록 화살표가 길어짐
    for(let att=0; att<8; att++){
      cells = new Array(N*N).fill(-1); arrows = [];
      let tries = N*N*30;
      while(tries-- > 0){
        const pr = randPath(maxLen); if(!pr) continue;
        const id = arrows.length;
        pr.path.forEach(([r,c])=> cells[idx(r,c)]=id);
        const head = pr.path[pr.path.length-1];
        if(!frontClear(head[0],head[1],pr.d)){ pr.path.forEach(([r,c])=> cells[idx(r,c)]=-1); continue; } // 못 빠지면 롤백
        arrows.push(makeArrow(id, pr.path, pr.d));
      }
      const occ = cells.filter(x=>x>=0).length;
      if(occ >= N*N*0.5 && arrows.length >= Math.max(3, N-2)){ remaining=arrows.length; return; }
    }
    remaining = arrows.length;
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
    const hh=cell*0.30;
    const tipx=cx+dx*cell*0.26, tipy=cy+dy*cell*0.26, bx=cx-dx*cell*0.05, by=cy-dy*cell*0.05, px=-dy, py=dx;
    ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(tipx,tipy); ctx.lineTo(bx+px*hh,by+py*hh); ctx.lineTo(bx-px*hh,by-py*hh); ctx.closePath(); ctx.fill();
  }
  function drawArrow(a){
    let shx=0, shy=0;
    if(a.blockUntil>Date.now()){ const m=Math.sin((a.blockUntil-Date.now())/24)*0.12; const dv=DV[a.d]; shx=(-dv.dr)*m; shy=(dv.dc)*m; }
    const hi = Math.min(a.off + a.track.bodyLen, a.track.total);
    const w = windowPts(a.track, a.off, hi); if(!w) return;
    ctx.strokeStyle=COLOR[a.d]; ctx.lineWidth=cell*0.42; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); w.forEach((p,i)=>{ const X=(p.x+shx)*cell, Y=(p.y+shy)*cell; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }); ctx.stroke();
    const f = ptAt(a.track, hi);
    drawHead((f.x+shx)*cell, (f.y+shy)*cell, f.dx, f.dy, COLOR[a.d]);
  }
  function draw(){ ctx.clearRect(0,0,S,S); arrows.forEach(a=>{ if(!a.removed) drawArrow(a); }); }

  function ensureAnim(){ if(!anim) anim=setInterval(step,16); }
  function step(){
    let active=false; const now=Date.now();
    arrows.forEach(a=>{ if(a.sliding){ active=true; a.off+=0.55; if(a.off>=a.maxOff){ a.sliding=false; a.removed=true; } } if(a.blockUntil>now) active=true; });
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

  function win(){ busy=true; chord(); setTimeout(()=>{ busy=false; winPending=false; newPuzzle(); }, 1300); }
  function gameOver(){ busy=true; sad(); setTimeout(()=>{ busy=false; newPuzzle(); }, 1300); }
  function newPuzzle(){ lives=MAX_LIVES; renderLives(); winPending=false; generate(); fit(); }

  document.getElementById('new').addEventListener('click', ()=>{ if(!busy){ newPuzzle(); ping(); } });
  window.addEventListener('resize', fit);

  if(new URLSearchParams(location.search).get('debug'))
    window.__ae = { get arrows(){return arrows;}, get cells(){return cells;}, get N(){return N;}, get S(){return S;}, get cell(){return cell;}, DV, frontClear, tap };

  // 유아: 레벨 1~10 (3×3~7×7) / 도전: 레벨 1~20 (5×5~16×16, 상위는 화살표 길이로 난도 상승)
  LevelStepper({ key: PRO?'lv_arrowpro':'lv_arrow', max: PRO?20:10, onChange:(lv)=>{
    curLv = lv;
    N = PRO ? Math.min(4 + lv, 16) : Math.min(3 + ((lv-1)>>1), 7);
    newPuzzle();
  } });

  // --- 소리 ---
  let ac;
  function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
  function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
  function good(){ beep(660,0.1,'triangle'); setTimeout(()=>beep(990,0.14,'triangle'),70); }
  function blip(){ beep(180,0.14,'sine',0.06); }
  function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.32,'triangle'),i*100)); }
  function sad(){ [440,392,330].forEach((f,i)=>setTimeout(()=>beep(f,0.28,'sine',0.09),i*160)); }
  function ping(){ beep(600,0.1,'triangle',0.08); }
})();
