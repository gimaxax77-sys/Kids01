// images/ 폴더를 스캔해 퍼즐 매니페스트(packs/puzzle-manifest.js) 자동 생성. 히어로는 저작권상 제외
// 사용법: 이미지 추가/삭제 후  node scripts/gen-manifest.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const THEMES = ['공룡','자동차','사물']; // 히어로는 공개 배포 제외(로컬 probe로 처리)

const out = {};
THEMES.forEach(t=>{
  const dir = path.join(ROOT,'images',t);
  out[t] = fs.readdirSync(dir).filter(f=>/\.(svg|png|jpg|jpeg|webp)$/i.test(f)).sort()
             .map(f=>'images/'+t+'/'+f);
});
const js = '// 퍼즐 이미지 매니페스트 (scripts/gen-manifest.js로 자동 생성 - 직접 수정 금지)\n'
         + 'window.PUZZLE_IMAGES = ' + JSON.stringify(out, null, 1) + ';\n';
fs.writeFileSync(path.join(ROOT,'packs','puzzle-manifest.js'), js, 'utf8');
console.log('manifest:', Object.entries(out).map(([k,v])=>k+'='+v.length).join(', '));
