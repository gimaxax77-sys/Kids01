// 지렁이 키우기 게임 로직 - 스와이프로 방향 전환, 과일 먹으면 성장(벽은 통과, 자기몸 닿으면 리셋)
(function(){
  const N = 13;                 // 격자 칸 수
  const FRUITS = ['🍎','🍓','🍌','🍇','🍊','🍒','🥝','🍑'];
  const cv = document.getElementById('art');
  const ctx = cv.getContext('2d');
  const scoreEl = document.getElementById('score');

  let cell = 20, snake, dir, nextDir, food, score, speed = 180, timer = null, dead = false;

  function layout(){
    const mid = document.getElementById('mid');
    const w = mid.clientWidth, h = mid.clientHeight;
    if(!w || !h){ requestAnimationFrame(layout); return; }
    const size = Math.min(w, h);
    cell = Math.floor(size / N);
    cv.width = cv.height = cell * N;
    draw();
  }

  function reset(){
    const c = (N/2)|0;
    snake = [{x:c-1,y:c},{x:c-2,y:c},{x:c-3,y:c}];
    dir = {x:1,y:0}; nextDir = dir;
    score = 0; dead = false;
    placeFood();
    scoreEl.textContent = '🐛 0';
    run();
    draw();
  }

  function placeFood(){
    let p, on;
    do { p = {x:(Math.random()*N)|0, y:(Math.random()*N)|0};
      on = snake.some(s => s.x===p.x && s.y===p.y);
    } while(on);
    food = {x:p.x, y:p.y, emoji: FRUITS[(Math.random()*FRUITS.length)|0]};
  }

  function run(){ if(timer) clearInterval(timer); timer = setInterval(tick, speed); }

  function tick(){
    if(dead) return;
    dir = nextDir;
    let head = {x:(snake[0].x+dir.x+N)%N, y:(snake[0].y+dir.y+N)%N}; // 벽 통과(래핑)
    if(snake.some((s,i)=> i<snake.length-1 && s.x===head.x && s.y===head.y)){ // 자기 몸 충돌
      dead = true; flashReset(); return;
    }
    snake.unshift(head);
    if(head.x===food.x && head.y===food.y){
      score++; scoreEl.textContent = '🐛 ' + score;
      placeFood();
      if(speed>90 && score%3===0){ speed = Math.max(90, speed-8); run(); } // 조금씩 빨라짐
    } else {
      snake.pop();
    }
    draw();
  }

  function flashReset(){
    let n = 0;
    const blink = setInterval(()=>{ ctx.globalAlpha = (n%2)?1:.3; draw(); ctx.globalAlpha=1; if(++n>=4){ clearInterval(blink); reset(); } }, 130);
  }

  function draw(){
    if(!snake) return; // reset() 이전(레이아웃 초기화 시) 방어
    ctx.clearRect(0,0,cv.width,cv.height);
    // 배경 격자
    ctx.fillStyle = '#f3faef';
    for(let y=0;y<N;y++) for(let x=0;x<N;x++){ if((x+y)%2===0){ ctx.fillStyle='#eef7e8'; ctx.fillRect(x*cell,y*cell,cell,cell);} }
    // 과일
    ctx.font = Math.floor(cell*0.8)+'px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(food.emoji, food.x*cell+cell/2, food.y*cell+cell/2);
    // 지렁이 몸
    for(let i=snake.length-1;i>=0;i--){
      const s = snake[i];
      const t = i/Math.max(1,snake.length);
      ctx.fillStyle = i===0 ? '#4a9e2e' : `hsl(96,55%,${48+t*18}%)`;
      round(s.x*cell+cell*0.06, s.y*cell+cell*0.06, cell*0.88, cell*0.88, cell*0.32);
      ctx.fill();
    }
    // 머리 눈
    const hd = snake[0];
    ctx.fillStyle='#fff';
    const ex = hd.x*cell+cell/2, ey = hd.y*cell+cell/2, r=cell*0.11, off=cell*0.18;
    ctx.beginPath(); ctx.arc(ex-off,ey-off,r,0,7); ctx.arc(ex+off,ey-off,r,0,7); ctx.fill();
    ctx.fillStyle='#222';
    ctx.beginPath(); ctx.arc(ex-off+dir.x*r*0.5,ey-off+dir.y*r*0.5,r*0.5,0,7); ctx.arc(ex+off+dir.x*r*0.5,ey-off+dir.y*r*0.5,r*0.5,0,7); ctx.fill();
  }
  function round(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

  function setDir(x,y){ if(x===-dir.x && y===-dir.y) return; nextDir={x,y}; } // 반대 방향 금지

  // 스와이프 조작
  let sx=0, sy=0;
  cv.addEventListener('pointerdown', e=>{ sx=e.clientX; sy=e.clientY; });
  cv.addEventListener('pointerup', e=>{
    const dx=e.clientX-sx, dy=e.clientY-sy;
    if(Math.abs(dx)<12 && Math.abs(dy)<12) return;
    if(Math.abs(dx)>Math.abs(dy)) setDir(dx>0?1:-1,0); else setDir(0,dy>0?1:-1);
  });
  window.addEventListener('keydown', e=>{
    const k={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(k){ e.preventDefault(); setDir(k[0],k[1]); }
  });

  document.getElementById('reset').addEventListener('click', reset);
  document.querySelectorAll('#diff button').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('#diff button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on'); speed = +b.dataset.s; run();
    });
  });
  document.querySelector('#diff [data-s="180"]').classList.add('on');

  window.addEventListener('resize', layout);
  layout(); reset();
})();
