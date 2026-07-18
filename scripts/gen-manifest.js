// images/(퍼즐)·color-pages/(색칠) 폴더를 스캔해 매니페스트 자동 생성
// 사용법: 이미지 추가/삭제 후  node scripts/gen-manifest.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const rx = /\.(svg|png|jpg|jpeg|webp)$/i;

function scan(baseDir, themes){
  const out = {};
  themes.forEach(t=>{
    const dir = path.join(ROOT, baseDir, t);
    if(!fs.existsSync(dir)) { out[t] = []; return; }
    out[t] = fs.readdirSync(dir).filter(f=>rx.test(f)).sort().map(f=> baseDir+'/'+t+'/'+f);
  });
  return out;
}

// 퍼즐(캐릭터는 사용자 사진이라 제외)
const puzzle = scan('images', ['공룡','자동차','사물']);
fs.writeFileSync(path.join(ROOT,'packs','puzzle-manifest.js'),
  '// 퍼즐 이미지 매니페스트 (scripts/gen-manifest.js 자동생성 - 직접수정 금지)\nwindow.PUZZLE_IMAGES = '+JSON.stringify(puzzle,null,1)+';\n','utf8');

// 색칠(선그림, 캐릭터 포함=일반 캐릭터 아웃라인)
const color = scan('color-pages', ['공룡','자동차','사물','캐릭터']);
fs.writeFileSync(path.join(ROOT,'packs','color-manifest.js'),
  '// 색칠 선그림 매니페스트 (scripts/gen-manifest.js 자동생성 - 직접수정 금지)\nwindow.COLOR_PAGES = '+JSON.stringify(color,null,1)+';\n','utf8');

console.log('puzzle:', Object.entries(puzzle).map(([k,v])=>k+'='+v.length).join(', '));
console.log('color:', Object.entries(color).map(([k,v])=>k+'='+v.length).join(', '));
