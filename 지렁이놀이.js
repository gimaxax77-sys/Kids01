// 지렁이 키우기 - 스와이프 조작. 60fps 보간 렌더(칸 이동을 부드럽게). 도전 모드(?mode=pro): 벽 충돌 사망 + 목숨 + 최고점
(function(){
  const PRO = new URLSearchParams(location.search).get('mode') === 'pro';
  if (PRO) document.title = '지렁이 키우기 · 도전';
  const N = PRO ? 15 : 13;               // 격자 칸 수
  const MAX_LIVES = 3;
  const FRUITS = ['🍎','🍓','🍌','🍇','🍊','🍒','🥝','🍑'];
  const cv = document.getElementById('art');
  const ctx = cv.getContext('2d');
  const scoreEl = document.getElementById('score');

  let cell = 20, snake = null, prev = null, dir, nextDir, food, score = 0;
  let baseSpeed = 180, speed = 180, timer = null, paused = false, flashUntil = 0, lastTick = 0;
  let lives = MAX_LIVES;
  let best = +(localStorage.getItem('wormBest') || 0);

  function layout(){
    const mid = document.getElementById('mid');
    const w = mid.clientWidth, h = mid.clientHeight;
    if(!w || !h){ requestAnimationFrame(layout); return; }
    const size = Math.min(w, h);
    cell = Math.floor(size / N);
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    cv.style.width = cv.style.height = (cell*N) + 'px';
    cv.width = cv.height = Math.round(cell*N*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function updateScore(){
    let s = '🐛 ' + score;
    if(PRO){ const hp = Math.max(0, lives);
      s += ' <span style="font-size:.62em">' + '❤️'.repeat(hp) + '🖤'.repeat(MAX_LIVES-hp) + ' 🏆' + best + '</span>'; }
    scoreEl.innerHTML = s;
  }

  function respawn(){ // 위치만 초기화(점수는 유지)
    const c = (N/2)|0;
    snake = [{x:c-1,y:c},{x:c-2,y:c},{x:c-3,y:c}];
    prev = snake.map(s=>({x:s.x,y:s.y}));
    dir = {x:1,y:0}; nextDir = dir;
    placeFood(); lastTick = performance.now();
  }
  function newGame(){ score = 0; lives = MAX_LIVES; speed = baseSpeed; respawn(); updateScore(); run(); }

  function placeFood(){
    let p, on;
    do { p = {x:(Math.random()*N)|0, y:(Math.random()*N)|0};
      on = snake.some(s => s.x===p.x && s.y===p.y);
    } while(on);
    food = {x:p.x, y:p.y, emoji: FRUITS[(Math.random()*FRUITS.length)|0]};
  }

  function run(){ if(timer) clearInterval(timer); timer = setInterval(tick, speed); }
  function speedUp(){
    const floor = PRO?140:90, every = PRO?2:3, step = PRO?10:8;
    if(speed>floor && score%every===0){ speed = Math.max(floor, speed-step); run(); }
  }

  function tick(){
    if(paused || !snake) return;
    dir = nextDir;
    prev = snake.map(s=>({x:s.x,y:s.y}));
    let nx = snake[0].x + dir.x, ny = snake[0].y + dir.y;
    if(PRO){ if(nx<0 || nx>=N || ny<0 || ny>=N){ loseLife(); return; } }  // 도전: 벽에 부딪히면 사망
    else { nx = (nx+N)%N; ny = (ny+N)%N; }                                 // 유아: 벽 통과
    const head = {x:nx, y:ny};
    if(snake.some((s,i)=> i<snake.length-1 && s.x===head.x && s.y===head.y)){ loseLife(); return; }
    snake.unshift(head);
    if(head.x===food.x && head.y===food.y){ score++; placeFood(); updateScore(); speedUp(); }
    else snake.pop();
    lastTick = performance.now();
  }

  function loseLife(){
    paused = true; flashUntil = performance.now() + 700; bump();
    setTimeout(()=>{
      if(PRO){
        lives--;
        if(lives<=0){ if(score>best){ best=score; try{ localStorage.setItem('wormBest', best); }catch(e){} } score=0; lives=MAX_LIVES; speed=baseSpeed; run(); }
        respawn();
      } else { score = 0; speed = baseSpeed; run(); respawn(); }
      updateScore(); paused = false;
    }, 700);
  }

  // --- 렌더(보간) ---
  function segPos(i, t){
    const cur = snake[i], p = prev && prev[i];
    if(!p) return {x:cur.x, y:cur.y};
    if(Math.abs(p.x-cur.x)>1 || Math.abs(p.y-cur.y)>1) return {x:cur.x, y:cur.y}; // 벽 통과는 보간 없이
    return { x:p.x + (cur.x-p.x)*t, y:p.y + (cur.y-p.y)*t };
  }
  function draw(t){
    if(!snake) return;
    const W = cell*N;
    ctx.globalAlpha = (performance.now()<flashUntil && ((performance.now()/120)|0)%2) ? 0.35 : 1;
    ctx.clearRect(0,0,W,W);
    for(let y=0;y<N;y++) for(let x=0;x<N;x++){ ctx.fillStyle = (x+y)%2===0 ? '#eef7e8' : '#f7fcf4'; ctx.fillRect(x*cell,y*cell,cell,cell); }
    if(PRO){ ctx.strokeStyle='#c94f4f'; ctx.lineWidth=Math.max(2,cell*0.12); ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, W-ctx.lineWidth, W-ctx.lineWidth); } // 벽 경고
    ctx.font = Math.floor(cell*0.8)+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(food.emoji, food.x*cell+cell/2, food.y*cell+cell/2);
    for(let i=snake.length-1;i>=0;i--){
      const s = segPos(i,t);
      const k = i/Math.max(1,snake.length);
      ctx.fillStyle = i===0 ? '#4a9e2e' : `hsl(96,55%,${48+k*18}%)`;
      round(s.x*cell+cell*0.06, s.y*cell+cell*0.06, cell*0.88, cell*0.88, cell*0.32); ctx.fill();
    }
    const hd = segPos(0,t);
    const ex = hd.x*cell+cell/2, ey = hd.y*cell+cell/2, r=cell*0.11, off=cell*0.18;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ex-off,ey-off,r,0,7); ctx.arc(ex+off,ey-off,r,0,7); ctx.fill();
    ctx.fillStyle='#222'; ctx.beginPath();
    ctx.arc(ex-off+dir.x*r*0.5, ey-off+dir.y*r*0.5, r*0.5,0,7); ctx.arc(ex+off+dir.x*r*0.5, ey-off+dir.y*r*0.5, r*0.5,0,7); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function round(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

  function frame(){ // 60fps: 칸 사이를 부드럽게 보간
    const t = paused ? 1 : Math.min(1, (performance.now()-lastTick)/speed);
    draw(t);
    requestAnimationFrame(frame);
  }

  function setDir(x,y){
    if(x===-dir.x && y===-dir.y) return;          // 반대 방향 금지
    if(x===dir.x && y===dir.y) return;            // 같은 방향이면 무시
    nextDir = {x,y};
    // 반응성: 이미 한 칸의 절반 이상 지났으면 기다리지 않고 즉시 진행
    if(!paused && performance.now()-lastTick >= speed*0.3){ tick(); run(); }
  }

  let sx=0, sy=0;
  cv.addEventListener('pointerdown', e=>{ sx=e.clientX; sy=e.clientY; });
  cv.addEventListener('pointermove', e=>{        // 손 떼기 전에 바로 인식 → 훨씬 빠른 반응
    const dx=e.clientX-sx, dy=e.clientY-sy;
    if(Math.abs(dx)<14 && Math.abs(dy)<14) return;
    if(Math.abs(dx)>Math.abs(dy)) setDir(dx>0?1:-1,0); else setDir(0,dy>0?1:-1);
    sx=e.clientX; sy=e.clientY;                   // 기준점 갱신 → 한 번의 드래그로 연속 조작
  });
  cv.addEventListener('pointerup', e=>{           // 짧은 플릭 보완
    const dx=e.clientX-sx, dy=e.clientY-sy;
    if(Math.abs(dx)<12 && Math.abs(dy)<12) return;
    if(Math.abs(dx)>Math.abs(dy)) setDir(dx>0?1:-1,0); else setDir(0,dy>0?1:-1);
  });
  window.addEventListener('keydown', e=>{
    const k={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(k){ e.preventDefault(); setDir(k[0],k[1]); }
  });

  document.getElementById('reset').addEventListener('click', newGame);
  document.querySelectorAll('#diff button').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('#diff button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      baseSpeed = Math.round(+b.dataset.s * (PRO?1.5:1)); speed = baseSpeed; run();
    });
  });
  const defBtn = document.querySelector('#diff [data-s="130"]');
  if(defBtn){ defBtn.classList.add('on'); baseSpeed = Math.round(130*(PRO?1.5:1)); speed = baseSpeed; }

  // --- 소리 ---
  let ac; function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
  function bump(){ try{ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type='sine'; o.frequency.setValueAtTime(300,a.currentTime); o.frequency.exponentialRampToValueAtTime(120,a.currentTime+0.25);
    g.gain.setValueAtTime(0.12,a.currentTime); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.3); o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime+0.32); }catch(e){} }

  if(new URLSearchParams(location.search).get('debug'))
    window.__worm = { get snake(){return snake;}, get prev(){return prev;}, get score(){return score;}, get lives(){return lives;}, get N(){return N;}, get paused(){return paused;}, tick, draw, segPos, setDir, PRO };

  window.addEventListener('resize', layout);
  layout(); newGame(); requestAnimationFrame(frame);
})();
