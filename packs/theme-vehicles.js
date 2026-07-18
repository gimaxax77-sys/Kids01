// 자동차 테마 콘텐츠 팩 - 색칠놀이용 탈것 선그림(버스/트럭/택시). core-pictures의 '자동차'와 함께 구성
// core-pictures.js와 동일한 shapes 형식(viewBox 0 0 300 300, fillable=칠하는 영역). 6세부터
window.CONTENT_PACKS = window.CONTENT_PACKS || { pictures: [], scenes: [], numberThemes: [], hangulWordPacks: [] };
window.CONTENT_PACKS.pictures.push(
  {id:'bus', name:'버스', emoji:'🚌', ageMin:6, ageMax:99, shapes:[
    {tag:'rect', fillable:true, color:'#fbc02d', attrs:{x:45,y:110,width:210,height:110,rx:16}},
    {tag:'rect', fillable:true, color:'#4fc3f7', attrs:{x:60,y:128,width:40,height:38,rx:5}},
    {tag:'rect', fillable:true, color:'#4fc3f7', attrs:{x:112,y:128,width:40,height:38,rx:5}},
    {tag:'rect', fillable:true, color:'#4fc3f7', attrs:{x:164,y:128,width:40,height:38,rx:5}},
    {tag:'rect', fillable:true, color:'#e0e0e0', attrs:{x:214,y:126,width:30,height:64,rx:5}},
    {tag:'circle', fillable:true, color:'#2b2b2b', attrs:{cx:95,cy:222,r:24}},
    {tag:'circle', fillable:true, color:'#2b2b2b', attrs:{cx:205,cy:222,r:24}},
    {tag:'circle', fillable:false, fill:'#cfd8dc', attrs:{cx:95,cy:222,r:9}},
    {tag:'circle', fillable:false, fill:'#cfd8dc', attrs:{cx:205,cy:222,r:9}},
    {tag:'circle', fillable:true, color:'#ffe082', attrs:{cx:248,cy:200,r:8}}
  ]},
  {id:'truck', name:'트럭', emoji:'🚚', ageMin:6, ageMax:99, shapes:[
    {tag:'rect', fillable:true, color:'#8d6e63', attrs:{x:40,y:120,width:130,height:100,rx:10}},
    {tag:'rect', fillable:true, color:'#42a5f5', attrs:{x:172,y:150,width:68,height:70,rx:10}},
    {tag:'rect', fillable:true, color:'#bbdefb', attrs:{x:184,y:160,width:42,height:32,rx:4}},
    {tag:'circle', fillable:true, color:'#2b2b2b', attrs:{cx:85,cy:222,r:24}},
    {tag:'circle', fillable:true, color:'#2b2b2b', attrs:{cx:205,cy:222,r:24}},
    {tag:'circle', fillable:false, fill:'#cfd8dc', attrs:{cx:85,cy:222,r:9}},
    {tag:'circle', fillable:false, fill:'#cfd8dc', attrs:{cx:205,cy:222,r:9}},
    {tag:'circle', fillable:true, color:'#ffe082', attrs:{cx:236,cy:200,r:8}}
  ]},
  {id:'taxi', name:'택시', emoji:'🚕', ageMin:6, ageMax:99, shapes:[
    {tag:'rect', fillable:true, color:'#ffca28', attrs:{x:50,y:160,width:200,height:60,rx:14}},
    {tag:'polygon', fillable:true, color:'#ffca28', attrs:{points:'90,160 115,110 195,110 220,160'}},
    {tag:'rect', fillable:true, color:'#b3e5fc', attrs:{x:120,y:118,width:70,height:35,rx:4}},
    {tag:'rect', fillable:true, color:'#212121', attrs:{x:135,y:95,width:30,height:16,rx:3}},
    {tag:'circle', fillable:true, color:'#2b2b2b', attrs:{cx:95,cy:222,r:24}},
    {tag:'circle', fillable:true, color:'#2b2b2b', attrs:{cx:205,cy:222,r:24}},
    {tag:'circle', fillable:false, fill:'#cfd8dc', attrs:{cx:95,cy:222,r:9}},
    {tag:'circle', fillable:false, fill:'#cfd8dc', attrs:{cx:205,cy:222,r:9}}
  ]}
);
