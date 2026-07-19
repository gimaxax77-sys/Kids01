// 모든 놀이 화면 공용 배경음악 - 여러 곡 셔플 믹스 재생, 음소거 상태 공유(bgmMuted)
(function(){
  var TRACKS = ['music/bgm.mp3','music/bgm2.mp3','music/bgm3.mp3'];
  // 셔플 순서
  for (var i=TRACKS.length-1;i>0;i--){ var j=(Math.random()*(i+1))|0; var t=TRACKS[i]; TRACKS[i]=TRACKS[j]; TRACKS[j]=t; }
  var idx = 0;
  var audio = new Audio();
  audio.volume = 0.32;
  function load(){ audio.src = TRACKS[idx]; }
  audio.addEventListener('ended', function(){ idx=(idx+1)%TRACKS.length; load(); play(); }); // 곡 끝나면 다음 곡(믹스)
  load();

  var muted = localStorage.getItem('bgmMuted')==='1';
  function play(){ if(!muted) audio.play().catch(function(){}); }

  var btn = document.createElement('button');
  btn.id='bgmBtn'; btn.type='button'; btn.setAttribute('aria-label','배경음악');
  btn.textContent = muted ? '🔇' : '🎵';
  btn.style.cssText = 'position:fixed;right:calc(3vw + env(safe-area-inset-right));bottom:calc(1.6vh + env(safe-area-inset-bottom));z-index:30;'
    + 'width:1.2cm;height:1.2cm;max-width:9vw;max-height:5.5vh;border-radius:50%;border:none;'
    + 'background:rgba(255,255,255,.82);font-size:min(4.6vw,26px);box-shadow:0 2px 6px rgba(0,0,0,.18);cursor:pointer;';
  btn.addEventListener('click', function(){
    muted = !muted;
    localStorage.setItem('bgmMuted', muted?'1':'0');
    btn.textContent = muted ? '🔇' : '🎵';
    if(muted) audio.pause(); else play();
  });
  function mount(){ if(document.body) document.body.appendChild(btn); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  // 자동재생 정책: 첫 터치/클릭 때 시작
  window.addEventListener('pointerdown', play, {once:true});
  // 홈으로 나가거나 화면 떠날 때 정지(페이지 전환 시 자동이지만 명시)
  window.addEventListener('pagehide', function(){ audio.pause(); });
})();
