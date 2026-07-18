// 색칠공부/조각맞추기 공용 그림 콘텐츠 팩 - 기본 11종
// 단순한 그림(사과/물고기/해님/공/우산)은 6세부터, 도형이 많고 복잡한 그림(집/나비/자동차/비행기/우주선/로봇)은 8세부터 노출
window.CONTENT_PACKS = window.CONTENT_PACKS || { pictures: [], scenes: [], numberThemes: [], hangulWordPacks: [] };
window.CONTENT_PACKS.pictures.push(
  {id:'apple', name:'사과', emoji:'🍎', ageMin:6, ageMax:99, shapes:[
    {tag:'ellipse', fillable:true, color:'#e6483c', attrs:{cx:150,cy:170,rx:80,ry:90}},
    {tag:'ellipse', fillable:true, color:'#4caf50', attrs:{cx:190,cy:70,rx:26,ry:14,transform:'rotate(-30 190 70)'}},
    {tag:'rect', fillable:true, color:'#7a4a20', attrs:{x:145,y:50,width:10,height:35,rx:4}}
  ]},
  {id:'house', name:'집', emoji:'🏠', ageMin:8, ageMax:99, shapes:[
    {tag:'polygon', fillable:true, color:'#d9534f', attrs:{points:'50,150 150,70 250,150'}},
    {tag:'rect', fillable:true, color:'#f0d9a8', attrs:{x:70,y:150,width:160,height:120}},
    {tag:'rect', fillable:true, color:'#7a4a20', attrs:{x:135,y:200,width:30,height:70}},
    {tag:'rect', fillable:true, color:'#7ec8e3', attrs:{x:95,y:180,width:35,height:35}},
    {tag:'rect', fillable:true, color:'#7ec8e3', attrs:{x:170,y:180,width:35,height:35}}
  ]},
  {id:'fish', name:'물고기', emoji:'🐟', ageMin:6, ageMax:99, shapes:[
    {tag:'ellipse', fillable:true, color:'#4aa3df', attrs:{cx:140,cy:150,rx:90,ry:55}},
    {tag:'polygon', fillable:true, color:'#2f7cb8', attrs:{points:'225,150 285,105 285,195'}},
    {tag:'polygon', fillable:true, color:'#2f7cb8', attrs:{points:'120,105 155,85 165,120'}},
    {tag:'circle', fillable:false, fill:'#222222', attrs:{cx:90,cy:140,r:8}}
  ]},
  {id:'butterfly', name:'나비', emoji:'🦋', ageMin:8, ageMax:99, shapes:[
    {tag:'ellipse', fillable:true, color:'#c66fd1', attrs:{cx:105,cy:120,rx:55,ry:38,transform:'rotate(-20 105 120)'}},
    {tag:'ellipse', fillable:true, color:'#c66fd1', attrs:{cx:195,cy:120,rx:55,ry:38,transform:'rotate(20 195 120)'}},
    {tag:'ellipse', fillable:true, color:'#9b4fae', attrs:{cx:115,cy:185,rx:38,ry:26,transform:'rotate(-15 115 185)'}},
    {tag:'ellipse', fillable:true, color:'#9b4fae', attrs:{cx:185,cy:185,rx:38,ry:26,transform:'rotate(15 185 185)'}},
    {tag:'rect', fillable:true, color:'#3d2b1f', attrs:{x:145,y:95,width:10,height:110,rx:5}},
    {tag:'line', fillable:false, attrs:{x1:147,y1:95,x2:130,y2:65}},
    {tag:'line', fillable:false, attrs:{x1:153,y1:95,x2:170,y2:65}}
  ]},
  {id:'sun', name:'해님', emoji:'☀️', ageMin:6, ageMax:99, shapes:[
    {tag:'circle', fillable:true, color:'#ffcc33', attrs:{cx:150,cy:150,r:55}},
    ...sunRays(),
    {tag:'circle', fillable:false, fill:'#222222', attrs:{cx:132,cy:140,r:6}},
    {tag:'circle', fillable:false, fill:'#222222', attrs:{cx:168,cy:140,r:6}},
    {tag:'path', fillable:false, attrs:{d:'M120,168 Q150,195 180,168'}}
  ]},
  {id:'car', name:'자동차', emoji:'🚗', ageMin:8, ageMax:99, shapes:[
    {tag:'rect', fillable:true, color:'#e74c3c', attrs:{x:50,y:160,width:200,height:60,rx:14}},
    {tag:'polygon', fillable:true, color:'#e74c3c', attrs:{points:'90,160 115,110 195,110 220,160'}},
    {tag:'rect', fillable:true, color:'#a8dadc', attrs:{x:120,y:118,width:70,height:35,rx:4}},
    {tag:'circle', fillable:true, color:'#2b2b2b', attrs:{cx:95,cy:222,r:24}},
    {tag:'circle', fillable:true, color:'#2b2b2b', attrs:{cx:205,cy:222,r:24}},
    {tag:'circle', fillable:false, fill:'#cfd8dc', attrs:{cx:95,cy:222,r:9}},
    {tag:'circle', fillable:false, fill:'#cfd8dc', attrs:{cx:205,cy:222,r:9}},
    {tag:'circle', fillable:true, color:'#ffe082', attrs:{cx:242,cy:178,r:9}}
  ]},
  {id:'plane', name:'비행기', emoji:'✈️', ageMin:8, ageMax:99, shapes:[
    {tag:'ellipse', fillable:true, color:'#4aa3df', attrs:{cx:140,cy:160,rx:100,ry:32}},
    {tag:'polygon', fillable:true, color:'#2f7cb8', attrs:{points:'55,160 30,105 85,140'}},
    {tag:'polygon', fillable:true, color:'#2f7cb8', attrs:{points:'150,178 110,240 195,240'}},
    {tag:'circle', fillable:true, color:'#f4d35e', attrs:{cx:245,cy:160,r:18}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:150,cy:155,r:8}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:175,cy:155,r:8}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:200,cy:155,r:8}}
  ]},
  {id:'rocket', name:'우주선', emoji:'🚀', ageMin:8, ageMax:99, shapes:[
    {tag:'ellipse', fillable:true, color:'#e74c3c', attrs:{cx:150,cy:170,rx:45,ry:90}},
    {tag:'polygon', fillable:true, color:'#c0392b', attrs:{points:'150,55 110,120 190,120'}},
    {tag:'circle', fillable:true, color:'#a8dadc', attrs:{cx:150,cy:140,r:20}},
    {tag:'polygon', fillable:true, color:'#2f7cb8', attrs:{points:'105,200 70,260 105,250'}},
    {tag:'polygon', fillable:true, color:'#2f7cb8', attrs:{points:'195,200 230,260 195,250'}},
    {tag:'polygon', fillable:true, color:'#ff9800', attrs:{points:'130,258 150,300 170,258'}}
  ]},
  {id:'robot', name:'로봇', emoji:'🤖', ageMin:8, ageMax:99, shapes:[
    {tag:'circle', fillable:true, color:'#ff5252', attrs:{cx:150,cy:30,r:8}},
    {tag:'line', fillable:false, attrs:{x1:150,y1:60,x2:150,y2:38}},
    {tag:'rect', fillable:true, color:'#90a4ae', attrs:{x:110,y:60,width:80,height:60,rx:10}},
    {tag:'circle', fillable:false, fill:'#29b6f6', attrs:{cx:130,cy:90,r:9}},
    {tag:'circle', fillable:false, fill:'#29b6f6', attrs:{cx:170,cy:90,r:9}},
    {tag:'rect', fillable:true, color:'#607d8b', attrs:{x:95,y:120,width:110,height:90,rx:12}},
    {tag:'rect', fillable:false, fill:'#37474f', attrs:{x:130,y:145,width:40,height:30,rx:4}},
    {tag:'rect', fillable:true, color:'#90a4ae', attrs:{x:55,y:130,width:35,height:70,rx:10}},
    {tag:'rect', fillable:true, color:'#90a4ae', attrs:{x:210,y:130,width:35,height:70,rx:10}},
    {tag:'rect', fillable:true, color:'#607d8b', attrs:{x:110,y:210,width:35,height:60,rx:8}},
    {tag:'rect', fillable:true, color:'#607d8b', attrs:{x:155,y:210,width:35,height:60,rx:8}}
  ]},
  {id:'ball', name:'공', emoji:'⚽', ageMin:6, ageMax:99, shapes:[
    {tag:'circle', fillable:true, color:'#ff7043', attrs:{cx:150,cy:150,r:90}},
    {tag:'ellipse', fillable:true, color:'#ffeb3b', attrs:{cx:150,cy:150,rx:26,ry:90}},
    {tag:'ellipse', fillable:true, color:'#4aa3df', attrs:{cx:150,cy:150,rx:90,ry:26}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:120,cy:110,r:14,opacity:0.5}}
  ]},
  {id:'umbrella', name:'우산', emoji:'☂️', ageMin:6, ageMax:99, shapes:[
    {tag:'path', fillable:true, color:'#4aa3df', attrs:{d:'M60,150 A90,90 0 0 1 240,150 Z'}},
    {tag:'circle', fillable:true, color:'#2f7cb8', attrs:{cx:150,cy:60,r:8}},
    {tag:'rect', fillable:true, color:'#7a4a20', attrs:{x:145,y:150,width:10,height:85,rx:4}},
    {tag:'path', fillable:false, stroke:'#7a4a20', attrs:{d:'M150,235 q0,25 22,25 q18,0 18,-14'}}
  ]}
);
