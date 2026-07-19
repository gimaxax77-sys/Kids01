// 화살표 탈출 로직 - 화살표 방향으로 가장자리까지 비었으면 탭해서 빼내기. 항상 클리어 가능(빼면 길이 열리기만 함)
(function(){
  const DIRS = {
    U:{dr:-1,dc:0, ch:'↑', color:'#e23b3b'},
    D:{dr: 1,dc:0, ch:'↓', color:'#3b7de2'},
    L:{dr:0,dc:-1, ch:'←', color:'#3fae54'},
    R:{dr:0,dc: 1, ch:'→', color:'#ef7d1a'},
  };
  const grid = document.getElementById('grid');
  const mid = document.getElementById('mid');
  let N = 3;          // 격자 크기(레벨)
  let cells = [];     // N*N: 방향 문자 또는 null
  let remaining = 0;
  let busy = false;

  const idx = (r,c)=> r*N + c;
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a; }

  function pathClear(r,c,d){ // (r,c)에서 d방향으로 가장자리까지 다른 화살표 없으면 true
    const dd = DIRS[d]; let rr=r+dd.dr, cc=c+dd.dc;
    while(rr>=0 && rr<N && cc>=0 && cc<N){ if(cells[idx(rr,cc)]) return false; rr+=dd.dr; cc+=dd.dc; }
    return true;
  }

  function generate(){
    // 빈 격자에 "지금 놓인 화살표 기준으로 길이 열린" 화살표만 계속 추가 → 역순이 항상 해가 됨
    for(let attempt=0; attempt<8; attempt++){
      cells = new Array(N*N).fill(null);
      let tries = N*N*8, count = 0;
      while(tries-- > 0){
        const empties = [];
        for(let i=0;i<N*N;i++) if(!cells[i]) empties.push(i);
        if(!empties.length) break;
        const i = empties[(Math.random()*empties.length)|0];
        const r = (i/N)|0, c = i%N;
        const dirs = shuffle(['U','D','L','R']);
        for(const d of dirs){ if(pathClear(r,c,d)){ cells[i]=d; count++; break; } }
      }
      remaining = count;
      if(count >= Math.max(4, N)) return; // 너무 적으면 다시
    }
  }

  function fit(){
    const w = mid.clientWidth, h = mid.clientHeight;
    if(!w || !h){ requestAnimationFrame(fit); return; }
    const s = Math.min(w, h);
    grid.style.width = grid.style.height = s + 'px';
  }

  function render(){
    grid.style.gridTemplateColumns = 'repeat('+N+', 1fr)';
    grid.innerHTML = '';
    const fs = Math.round(Math.min(mid.clientWidth, mid.clientHeight) / N * 0.5);
    for(let i=0;i<N*N;i++){
      const cell = document.createElement('div'); cell.className='cell';
      const d = cells[i];
      if(d){
        const b = document.createElement('button'); b.className='arrow'; b.dataset.i=i;
        b.textContent = DIRS[d].ch; b.style.background = DIRS[d].color;
        b.style.fontSize = fs + 'px';
        b.addEventListener('click', ()=> tap(i, b));
        cell.appendChild(b);
      }
      grid.appendChild(cell);
    }
  }

  function tap(i, btn){
    if(busy || !cells[i]) return;
    audio();
    const r=(i/N)|0, c=i%N, d=cells[i], dd=DIRS[d];
    if(pathClear(r,c,d)){
      // 탈출: 방향으로 미끄러져 나감
      cells[i]=null; remaining--;
      good();
      btn.style.transform = 'translate('+(dd.dc*140)+'%,'+(dd.dr*140)+'%)';
      btn.classList.add('gone');
      const parent = btn.parentNode;
      setTimeout(()=>{ if(parent) parent.innerHTML=''; if(remaining<=0) win(); }, 280);
    } else {
      btn.classList.remove('blocked'); void btn.offsetWidth; btn.classList.add('blocked'); blip();
    }
  }

  function win(){
    busy = true; chord();
    setTimeout(()=>{ busy=false; generate(); fit(); render(); }, 1300);
  }

  function newPuzzle(){ generate(); fit(); render(); }

  document.getElementById('new').addEventListener('click', ()=>{ if(!busy){ newPuzzle(); ping(); } });
  window.addEventListener('resize', ()=>{ fit(); render(); });

  // 레벨 1~10 → 격자 3×3 ~ 7×7
  LevelStepper({ key:'lv_arrow', max:10, onChange:(lv)=>{ N = Math.min(3 + ((lv-1)>>1), 7); newPuzzle(); } });

  // --- 소리 ---
  let ac;
  function audio(){ if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
  function beep(f,d,type='sine',v=0.1){ const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type;o.frequency.value=f;g.gain.value=0.001;o.connect(g).connect(a.destination);o.start(); g.gain.linearRampToValueAtTime(v,a.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d); o.stop(a.currentTime+d+0.02); }
  function good(){ beep(660,0.1,'triangle'); setTimeout(()=>beep(990,0.14,'triangle'),70); }
  function blip(){ beep(180,0.14,'sine',0.06); }
  function chord(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.32,'triangle'),i*100)); }
  function ping(){ beep(600,0.1,'triangle',0.08); }
})();
