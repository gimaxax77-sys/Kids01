// packs/*.js의 그림 데이터를 독립 SVG 파일(pack-<id>.svg)로 변환. 메인 앱 렌더러 재사용
// 사용법: packs 그림 추가/변경 후  node scripts/gen-svg.js  → 이어서 gen-manifest.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

// 메인 앱(유아-학습놀이.html)과 동일한 렌더러
function shapeToTag(s){
  const attrStr = Object.entries(s.attrs).map(([k,v])=> k+'="'+v+'"').join(' ');
  if(s.fillable) return '<'+s.tag+' '+attrStr+' fill="'+s.color+'" stroke="#333" stroke-width="5"/>';
  if(s.tag==='line') return '<line '+attrStr+' stroke="'+(s.stroke||'#333')+'" stroke-width="3"/>';
  if(s.tag==='path') return '<path '+attrStr+' stroke="'+(s.stroke||'#333')+'" stroke-width="4" fill="'+(s.fill||'none')+'"/>';
  return '<'+s.tag+' '+attrStr+' fill="'+(s.fill||'#222')+'"/>';
}
const buildSvg = shapes => '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">'+shapes.map(shapeToTag).join('')+'</svg>';
function sunRays(){ const r=[]; for(let i=0;i<8;i++) r.push({tag:'polygon',fillable:true,color:'#ffcc33',attrs:{points:'140,95 160,95 150,45',transform:'rotate('+(i*45)+' 150 150)'}}); return r; }

const sandbox = { window:{}, sunRays };
vm.createContext(sandbox);
['packs/core-pictures.js','packs/theme-dinosaurs.js','packs/theme-marvel-heroes.js'].forEach(f=>{
  vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'), sandbox, {filename:f});
});

// 캐릭터(마블 등)는 저작권상 배포 제외 — 사용자가 퍼즐에서 직접 사진을 골라 사용. 여기선 생성 안 함.
const MAP = {
  trex:'공룡', triceratops:'공룡', stego:'공룡', brachio:'공룡', ptero:'공룡',
  car:'자동차',
  apple:'사물', house:'사물', fish:'사물', butterfly:'사물', sun:'사물', ball:'사물', umbrella:'사물', robot:'사물', plane:'사물', rocket:'사물',
};
let n=0;
sandbox.window.CONTENT_PACKS.pictures.forEach(p=>{
  const theme = MAP[p.id]; if(!theme) return;
  const dir = path.join(ROOT,'images',theme);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'pack-'+p.id+'.svg'), buildSvg(p.shapes), 'utf8');
  n++;
});
console.log('generated', n, 'svg files');
