// 놀이 난이도 레벨 스테퍼(−/Lv숫자/+) 공용 컴포넌트 - 1~max 레벨, localStorage 저장 후 onChange 호출
window.LevelStepper = function(opts){
  var el = document.querySelector(opts.el || '#diff');
  if(!el) return;
  var min = opts.min || 1, max = opts.max || 10, key = opts.key;
  var lv = parseInt(localStorage.getItem(key), 10) || opts.initial || min;
  lv = Math.max(min, Math.min(max, lv));
  el.innerHTML = '';
  function mkBtn(t){ var b=document.createElement('button'); b.type='button'; b.textContent=t; return b; }
  var minus = mkBtn('−'), plus = mkBtn('+');
  var num = document.createElement('span');
  num.style.cssText = 'min-width:2.4em;text-align:center;font-weight:800;color:#6b5b39;font-size:min(5.5vw,30px);align-self:center;';
  function apply(fire){ num.textContent = 'Lv ' + lv; try{ localStorage.setItem(key, lv); }catch(e){} if(fire) opts.onChange(lv); }
  minus.addEventListener('click', function(){ if(lv>min){ lv--; apply(true); } });
  plus.addEventListener('click', function(){ if(lv<max){ lv++; apply(true); } });
  el.appendChild(minus); el.appendChild(num); el.appendChild(plus);
  apply(false);
  opts.onChange(lv); // 초기 적용
};
