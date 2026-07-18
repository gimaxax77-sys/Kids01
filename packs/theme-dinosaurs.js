// 공룡 테마 콘텐츠 팩 - 색칠공부/조각맞추기용 그림 5종 + 틀린그림찾기 장면 1종
// 다리/뿔/날개 등 도형이 적은 트리케라톱스/스테고사우루스는 6세부터, 나머지는 8세부터 노출
// 몸통/꼬리/목을 곡선 path 하나로 이어 그리고, 큰 눈동자+반짝임+볼터치+하이라이트로 귀여운 인상을 강화함(2026-07-05 2차 품질 개선)
window.CONTENT_PACKS = window.CONTENT_PACKS || { pictures: [], scenes: [], numberThemes: [], hangulWordPacks: [] };
window.CONTENT_PACKS.pictures.push(
  {id:'trex', name:'티라노사우루스', emoji:'🦖', ageMin:8, ageMax:99, shapes:[
    {tag:'path', fillable:true, color:'#7cb342', attrs:{d:'M20,178 Q55,158 88,168 Q98,132 155,122 Q212,113 245,138 Q255,148 246,158 L242,178 Q232,183 222,170 Q168,188 108,184 Q68,196 28,195 Q13,190 20,178 Z'}},
    {tag:'ellipse', fillable:false, fill:'#a5d6a7', attrs:{cx:130,cy:150,rx:35,ry:14,opacity:0.6}},
    {tag:'path', fillable:true, color:'#558b2f', attrs:{d:'M118,205 Q112,225 108,240 Q106,250 118,250 Q128,250 128,240 Q130,222 132,206 Z'}},
    {tag:'path', fillable:true, color:'#558b2f', attrs:{d:'M168,203 Q163,225 160,240 Q159,250 171,250 Q181,250 180,240 Q181,222 182,204 Z'}},
    {tag:'ellipse', fillable:true, color:'#c5e1a5', attrs:{cx:150,cy:180,rx:55,ry:20}},
    {tag:'rect', fillable:true, color:'#558b2f', attrs:{x:205,y:150,width:22,height:11,rx:5}},
    {tag:'ellipse', fillable:true, color:'#7cb342', attrs:{cx:240,cy:112,rx:40,ry:34}},
    {tag:'path', fillable:true, color:'#7cb342', attrs:{d:'M228,132 Q265,132 292,142 Q268,154 230,152 Z'}},
    {tag:'polygon', fillable:false, fill:'#ffffff', attrs:{points:'240,144 246,154 252,144'}},
    {tag:'polygon', fillable:false, fill:'#ffffff', attrs:{points:'258,146 264,155 269,146'}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:222,cy:96,rx:11,ry:13}},
    {tag:'circle', fillable:false, fill:'#33691e', attrs:{cx:224,cy:99,r:4.5}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:226,cy:95,r:1.5}},
    {tag:'ellipse', fillable:false, fill:'#aed581', attrs:{cx:210,cy:112,rx:7,ry:5,opacity:0.6}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:224,cy:88,rx:9,ry:5,opacity:0.3}}
  ]},
  {id:'triceratops', name:'트리케라톱스', emoji:'🦕', ageMin:6, ageMax:99, shapes:[
    {tag:'path', fillable:true, color:'#4fa3a3', attrs:{d:'M20,178 Q55,158 88,168 Q98,132 155,122 Q212,113 245,138 Q255,148 246,158 L242,178 Q232,183 222,170 Q168,188 108,184 Q68,196 28,195 Q13,190 20,178 Z'}},
    {tag:'ellipse', fillable:false, fill:'#80cbc4', attrs:{cx:130,cy:150,rx:35,ry:14,opacity:0.6}},
    {tag:'polygon', fillable:true, color:'#3d8b8b', attrs:{points:'196,86 170,68 184,116 168,140 198,158 218,126 212,90'}},
    {tag:'path', fillable:true, color:'#2f7373', attrs:{d:'M118,205 Q112,225 108,240 Q106,250 118,250 Q128,250 128,240 Q130,222 132,206 Z'}},
    {tag:'path', fillable:true, color:'#2f7373', attrs:{d:'M168,203 Q163,225 160,240 Q159,250 171,250 Q181,250 180,240 Q181,222 182,204 Z'}},
    {tag:'ellipse', fillable:true, color:'#4fa3a3', attrs:{cx:238,cy:128,rx:40,ry:32}},
    {tag:'polygon', fillable:true, color:'#e8e6d9', attrs:{points:'272,132 306,138 272,145'}},
    {tag:'polygon', fillable:true, color:'#e8e6d9', attrs:{points:'210,104 224,98 214,64'}},
    {tag:'polygon', fillable:true, color:'#e8e6d9', attrs:{points:'228,99 242,96 236,62'}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:222,cy:120,rx:11,ry:13}},
    {tag:'circle', fillable:false, fill:'#00363a', attrs:{cx:224,cy:123,r:4.5}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:226,cy:119,r:1.5}},
    {tag:'ellipse', fillable:false, fill:'#b2dfdb', attrs:{cx:208,cy:136,rx:7,ry:5,opacity:0.6}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:222,cy:112,rx:9,ry:5,opacity:0.3}}
  ]},
  {id:'stego', name:'스테고사우루스', emoji:'🦕', ageMin:6, ageMax:99, shapes:[
    {tag:'path', fillable:true, color:'#8d6e63', attrs:{d:'M20,180 Q45,150 78,148 Q110,108 165,106 Q222,110 248,150 Q258,158 248,170 L243,186 Q233,190 223,178 Q168,194 108,190 Q68,200 28,199 Q12,194 20,180 Z'}},
    {tag:'ellipse', fillable:false, fill:'#bcaaa4', attrs:{cx:130,cy:150,rx:35,ry:14,opacity:0.6}},
    {tag:'path', fillable:true, color:'#5d4037', attrs:{d:'M118,205 Q112,225 108,240 Q106,250 118,250 Q128,250 128,240 Q130,222 132,206 Z'}},
    {tag:'path', fillable:true, color:'#5d4037', attrs:{d:'M168,203 Q163,225 160,240 Q159,250 171,250 Q181,250 180,240 Q181,222 182,204 Z'}},
    {tag:'ellipse', fillable:true, color:'#8d6e63', attrs:{cx:236,cy:150,rx:30,ry:23}},
    {tag:'polygon', fillable:true, color:'#a1887f', attrs:{points:'70,145 88,105 100,148'}},
    {tag:'polygon', fillable:true, color:'#a1887f', attrs:{points:'105,132 122,90 135,136'}},
    {tag:'polygon', fillable:true, color:'#a1887f', attrs:{points:'140,124 157,84 170,128'}},
    {tag:'polygon', fillable:true, color:'#a1887f', attrs:{points:'175,122 190,86 202,126'}},
    {tag:'polygon', fillable:true, color:'#6d4c41', attrs:{points:'22,180 5,160 12,192'}},
    {tag:'polygon', fillable:true, color:'#6d4c41', attrs:{points:'18,192 2,180 8,205'}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:246,cy:140,rx:9,ry:11}},
    {tag:'circle', fillable:false, fill:'#3e2723', attrs:{cx:248,cy:143,r:4}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:250,cy:139,r:1.3}},
    {tag:'ellipse', fillable:false, fill:'#d7ccc8', attrs:{cx:222,cy:155,rx:6,ry:4,opacity:0.6}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:224,cy:134,rx:8,ry:4,opacity:0.3}}
  ]},
  {id:'brachio', name:'브라키오사우루스', emoji:'🦕', ageMin:8, ageMax:99, shapes:[
    {tag:'path', fillable:true, color:'#66bb6a', attrs:{d:'M20,205 Q50,188 80,196 Q90,168 140,162 Q190,157 215,178 Q222,186 214,193 L210,208 Q200,212 192,202 Q150,215 100,212 Q65,222 30,220 Q13,216 20,205 Z'}},
    {tag:'ellipse', fillable:false, fill:'#a5d6a7', attrs:{cx:100,cy:190,rx:32,ry:12,opacity:0.6}},
    {tag:'path', fillable:true, color:'#43a047', attrs:{d:'M108,225 Q102,245 98,258 Q96,268 108,268 Q118,268 118,258 Q120,242 122,226 Z'}},
    {tag:'path', fillable:true, color:'#43a047', attrs:{d:'M158,223 Q153,245 150,258 Q149,268 161,268 Q171,268 170,258 Q171,242 172,224 Z'}},
    {tag:'path', fillable:true, color:'#66bb6a', attrs:{d:'M155,172 Q170,120 195,70 Q210,45 235,42 Q250,42 250,58 Q248,72 232,72 Q218,74 205,100 Q188,132 178,180 Z'}},
    {tag:'ellipse', fillable:true, color:'#66bb6a', attrs:{cx:240,cy:56,rx:26,ry:20}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:250,cy:48,rx:10,ry:12}},
    {tag:'circle', fillable:false, fill:'#1b5e20', attrs:{cx:252,cy:51,r:4}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:254,cy:47,r:1.3}},
    {tag:'ellipse', fillable:false, fill:'#aed581', attrs:{cx:230,cy:62,rx:6,ry:4,opacity:0.6}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:228,cy:44,rx:8,ry:4,opacity:0.3}}
  ]},
  {id:'ptero', name:'프테라노돈', emoji:'🦅', ageMin:8, ageMax:99, shapes:[
    {tag:'path', fillable:true, color:'#607d8b', attrs:{d:'M140,150 Q90,120 30,105 Q15,102 20,115 Q45,140 90,158 Q110,168 130,168 Z'}},
    {tag:'path', fillable:true, color:'#607d8b', attrs:{d:'M162,150 Q212,120 272,105 Q287,102 282,115 Q257,140 212,158 Q192,168 172,168 Z'}},
    {tag:'ellipse', fillable:true, color:'#78909c', attrs:{cx:150,cy:170,rx:28,ry:20}},
    {tag:'ellipse', fillable:false, fill:'#cfd8dc', attrs:{cx:150,cy:175,rx:12,ry:6,opacity:0.6}},
    {tag:'path', fillable:true, color:'#78909c', attrs:{d:'M148,152 Q140,122 148,97 Q152,82 165,90 Q172,98 164,112 Q160,132 162,152 Z'}},
    {tag:'polygon', fillable:true, color:'#546e7a', attrs:{points:'150,97 132,52 162,92'}},
    {tag:'polygon', fillable:true, color:'#eceff1', attrs:{points:'166,102 205,110 166,118'}},
    {tag:'ellipse', fillable:false, fill:'#ffffff', attrs:{cx:157,cy:98,rx:9,ry:11}},
    {tag:'circle', fillable:false, fill:'#37474f', attrs:{cx:159,cy:101,r:3.6}},
    {tag:'circle', fillable:false, fill:'#ffffff', attrs:{cx:161,cy:97,r:1.2}},
    {tag:'ellipse', fillable:false, fill:'#eceff1', attrs:{cx:143,cy:112,rx:6,ry:4,opacity:0.6}}
  ]}
);
window.CONTENT_PACKS.scenes.push(
  {
    id:'dino-land', name:'공룡시대', background:'#a5d6a7', ageMin:6, ageMax:99,
    objects:[
      {type:'circle', x:50,y:50,r:30,color:'#ffeb3b'},
      {type:'triangle', x:250,y:100,r:50,color:'#8d6e63', diffColor:'#d84315'},
      {type:'circle', x:120,y:220,r:45,color:'#66bb6a', diffScale:0.6},
      {type:'circle', x:175,y:190,r:22,color:'#66bb6a'},
      {type:'triangle', x:70,y:230,r:20,color:'#66bb6a'},
      {type:'triangle', x:110,y:185,r:12,color:'#43a047', diffScale:1.8},
      {type:'rect', x:230,y:230,w:14,h:50,color:'#795548'},
      {type:'circle', x:230,y:195,r:28,color:'#2e7d32', diffColor:'#1b5e20'},
      {type:'circle', x:280,y:260,r:18,color:'#9e9e9e'},
      {type:'rect', x:60,y:40,w:45,h:18,color:'#ffffff', diffScale:0.02},
      {type:'rect', x:160,y:290,w:320,h:40,color:'#8bc34a'}
    ]
  }
);
