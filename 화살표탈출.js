// 화살표 탈출 - 여러 칸을 이은 화살표를 방향으로 미끄러뜨려 빼내기. 캔버스. 항상 클리어 가능(빼면 길이 열리기만 함)
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

  let N = 3, cell = 20, S = 0;          // 격자 수 / 칸 픽셀 / 보드 CSS 크기
  let cells = [];                        // N*N: 화살표 id 또는 -1
  let arrows = [];                       // {id,hr,hc,d,L,body,off,sliding,blockUntil,removed}
  let remaining = 0, busy = false, lives = MAX_LIVES, anim = null;

  const idx = (r,c)=> r*N + c;
  const inb = (r,c)=> r>=0 && r<N && c>=0 && c<N;
  function renderLives(){ if(PRO && livesEl) livesEl.textContent = '❤️'.repeat(lives) + '🖤'.repeat(MAX_LIVES - lives); }

  function frontClear(hr,hc,d){ // 머리 앞쪽으로 가장자리까지 다른 화살표 없으면 true
    const v=DV[d]; let r=hr+v.dr, c=hc+v.dc;
    while(inb(r,c)){ if(cells[idx(r,c)]>=0) return false; r+=v.dr; c+=v.dc; }
    return true;
  }

  function generate(){
    const maxLen = Math.min(N, PRO?6:4);
    for(let att=0; att<8; att++){
      cells = new Array(N*N).fill(-1); arrows = [];
      let tries = N*N*30;
      while(tries-- > 0){
        const d = ['U','D','L','R'][(Math.random()*4)|0]; const v = DV[d];
        const L = 1 + ((Math.random()*maxLen)|0);
        const hr = (Math.random()*N)|0, hc = (Math.random()*N)|0;
        const body = []; let ok = true;
        for(let k=0;k<L;k++){ const r=hr-v.dr*k, c=hc-v.dc*k; if(!inb(r,c) || cells[idx(r,c)]>=0){ ok=false; break; } body.push([r,c]); }
        if(!ok) continue;
        if(!frontClear(hr,hc,d)) continue;
        const id = arrows.length; body.forEach(([r,c])=> cells[idx(r,c)]=id);
        arrows.push({id,hr,hc,d,L,body,off:0,sliding:false,blockUntil:0,removed:false});
      }
      const occ = cells.filter(x=>x>=0).length;
      if(occ >= N*N*0.55 && arrows.length >= Math.max(3, N-1)){ remaining = arrows.length; return; }
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

  function draw(){
    ctx.clearRect(0,0,S,S);
    const pad = cell*0.5;
    arrows.forEach(a=>{ if(!a.removed) drawArrow(a); });
  }

  function drawArrow(a){
    const v = DV[a.d];
    const ox = v.dc*a.off*cell, oy = v.dr*a.off*cell;
    let dx=0, dy=0;
    if(a.blockUntil > Date.now()){ const t=(a.blockUntil-Date.now())/70; dx=Math.sin(t*3.14)* (v.dr?cell*0.12:0); dy=Math.sin(t*3.14)*(v.dc?cell*0.12:0); }
    const headCx = (a.hc+0.5)*cell + ox + dx, headCy = (a.hr+0.5)*cell + oy + dy;
    const tail = a.body[a.body.length-1];
    const tailCx = (tail[1]+0.5)*cell + ox + dx, tailCy = (tail[0]+0.5)*cell + oy + dy;
    const col = COLOR[a.d];
    // 몸통(둥근 막대). 머리 삼각형 자리를 조금 남김
    const baseCx = headCx - v.dc*cell*0.14, baseCy = headCy - v.dr*cell*0.14;
    ctx.strokeStyle = col; ctx.lineWidth = cell*0.46; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(tailCx, tailCy); ctx.lineTo(baseCx, baseCy); ctx.stroke();
    // 화살촉
    const fx=v.dc, fy=v.dr, px=-v.dr, py=v.dc, hh=cell*0.34;
    const tipx=headCx+fx*cell*0.30, tipy=headCy+fy*cell*0.30;
    const bx=headCx-fx*cell*0.10, by=headCy-fy*cell*0.10;
    ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(tipx,tipy); ctx.lineTo(bx+px*hh, by+py*hh); ctx.lineTo(bx-px*hh, by-py*hh); ctx.closePath(); ctx.fill();
  }

  function ensureAnim(){ if(!anim) anim = setInterval(step, 16); }
  function step(){
    let active = false; const now = Date.now();
    arrows.forEach(a=>{
      if(a.sliding){ active=true; a.off += 0.7; if(a.off >= N + a.L + 1){ a.sliding=false; a.removed=true; } }
      if(a.blockUntil > now) active = true;
    });
    draw();
    if(remaining <= 0 && !arrows.some(a=>a.sliding)) { winCheck(); }
    if(!active){ clearInterval(anim); anim=null; }
  }

  let winPending = false;
  function winCheck(){ if(winPending || busy) return; if(remaining<=0){ winPending=true; win(); } }

  function tap(id){
    const a = arrows[id]; if(!a || a.sliding || a.removed || busy) return;
    audio();
    if(frontClear(a.hr, a.hc, a.d)){
      a.body.forEach(([r,c])=>{ if(cells[idx(r,c)]===id) cells[idx(r,c)]=-1; }); // 논리적으로 즉시 제거(연쇄 탈출 가능)
      remaining--; a.sliding=true; a.off=0; good(); ensureAnim();
    } else {
      a.blockUntil = Date.now()+280; ensureAnim(); blip();
      if(PRO){ lives--; renderLives(); if(lives<=0) gameOver(); }
    }
  }

  cv.addEventListener('click', (e)=>{
    if(busy || !S) return;
    const rect = cv.getBoundingClientRect();
    const x = (e.clientX-rect.left)/rect.width*S, y = (e.clientY-rect.top)/rect.height*S;
    const c=(x/cell)|0, r=(y/cell)|0; if(!inb(r,c)) return;
    const id = cells[idx(r,c)]; if(id>=0) tap(id);
  });

  function win(){ busy=true; chord(); setTimeout(()=>{ busy=false; winPending=false; newPuzzle(); }, 1300); }
  function gameOver(){ busy=true; sad(); setTimeout(()=>{ busy=false; newPuzzle(); }, 1300); }
  function newPuzzle(){ lives=MAX_LIVES; renderLives(); winPending=false; generate(); fit(); }

  document.getElementById('new').addEventListener('click', ()=>{ if(!busy){ newPuzzle(); ping(); } });
  window.addEventListener('resize', fit);

  if(new URLSearchParams(location.search).get('debug')) // 테스트 전용 훅
    window.__ae = { get arrows(){return arrows;}, get cells(){return cells;}, get N(){return N;}, get S(){return S;}, get cell(){return cell;}, DV, frontClear, tap };

  // 레벨 1~10 → 유아: 3×3~7×7 / 도전: 5×5~12×12
  LevelStepper({ key: PRO?'lv_arrowpro':'lv_arrow', max:10, onChange:(lv)=>{
    N = PRO ? Math.min(4 + lv, 12) : Math.min(3 + ((lv-1)>>1), 7);
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
