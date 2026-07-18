// 틀린그림찾기 장면 콘텐츠 팩 - 기본 4종
// 정원/바닷속은 6세부터, 오브젝트가 더 많고 복잡한 도로/우주 장면은 8세부터 노출
window.CONTENT_PACKS = window.CONTENT_PACKS || { pictures: [], scenes: [], numberThemes: [], hangulWordPacks: [] };
window.CONTENT_PACKS.scenes.push(
  {
    id:'garden', name:'정원', background:'#bfe9ff', ageMin:6, ageMax:99,
    objects:[
      {type:'circle', x:50,y:50,r:30,color:'#ffd54f', diffColor:'#ff7043'},
      {type:'rect', x:100,y:40,w:50,h:22,color:'#ffffff', diffScale:0.02},
      {type:'rect', x:230,y:55,w:70,h:28,color:'#ffffff'},
      {type:'rect', x:60,y:230,w:18,h:60,color:'#8d6e42'},
      {type:'circle', x:60,y:190,r:40,color:'#4caf50', diffScale:0.6},
      {type:'circle', x:150,y:250,r:14,color:'#e91e63'},
      {type:'circle', x:190,y:260,r:14,color:'#e91e63', diffColor:'#9c27b0'},
      {type:'rect', x:160,y:300,w:320,h:40,color:'#8bc34a'},
      {type:'triangle', x:250,y:150,r:18,color:'#ff9800', diffScale:1.6},
      {type:'circle', x:110,y:290,r:16,color:'#9e9e9e'}
    ]
  },
  {
    id:'underwater', name:'바닷속', background:'#b3e5fc', ageMin:6, ageMax:99,
    objects:[
      {type:'circle', x:150,y:150,r:45,color:'#ff8a65', diffColor:'#4fc3f7'},
      {type:'circle', x:250,y:90,r:20,color:'#ffd54f', diffScale:1.8},
      {type:'rect', x:40,y:280,w:14,h:100,color:'#2e7d32'},
      {type:'rect', x:70,y:280,w:14,h:80,color:'#388e3c', diffScale:0.02},
      {type:'triangle', x:200,y:250,r:22,color:'#fbc02d', diffColor:'#f44336'},
      {type:'circle', x:100,y:60,r:10,color:'#ffffff'},
      {type:'circle', x:130,y:40,r:7,color:'#ffffff'},
      {type:'circle', x:280,y:290,r:25,color:'#8d6e63'},
      {type:'triangle', x:270,y:230,r:18,color:'#e91e63', diffScale:1.7},
      {type:'rect', x:160,y:305,w:320,h:30,color:'#f0e0a0'},
      {type:'circle', x:50,y:150,r:16,color:'#ce93d8', diffColor:'#7b1fa2'}
    ]
  },
  {
    id:'road', name:'신나는 도로', background:'#87ceeb', ageMin:8, ageMax:99,
    objects:[
      {type:'rect', x:160,y:270,w:320,h:100,color:'#78716c'},
      {type:'rect', x:110,y:230,w:90,h:40,color:'#e74c3c', diffColor:'#4aa3df'},
      {type:'rect', x:120,y:205,w:55,h:30,color:'#e74c3c'},
      {type:'circle', x:90,y:270,r:14,color:'#222222'},
      {type:'circle', x:150,y:270,r:14,color:'#222222'},
      {type:'circle', x:260,y:60,r:28,color:'#ffd54f', diffScale:0.6},
      {type:'rect', x:60,y:50,w:50,h:20,color:'#ffffff', diffScale:0.02},
      {type:'circle', x:250,y:200,r:30,color:'#4caf50', diffColor:'#8bc34a'},
      {type:'rect', x:250,y:235,w:12,h:30,color:'#8d6e42'},
      {type:'triangle', x:280,y:250,r:16,color:'#ffeb3b', diffScale:1.8},
      {type:'rect', x:160,y:280,w:40,h:8,color:'#ffffff'}
    ]
  },
  {
    id:'space', name:'우주 탐험', background:'#0d1b2a', ageMin:8, ageMax:99,
    objects:[
      {type:'rect', x:160,y:300,w:320,h:40,color:'#37474f'},
      {type:'triangle', x:150,y:90,r:22,color:'#e74c3c'},
      {type:'rect', x:150,y:150,w:40,h:90,color:'#eceff1'},
      {type:'triangle', x:150,y:205,r:18,color:'#2f7cb8', diffScale:1.7},
      {type:'circle', x:150,y:140,r:12,color:'#4aa3df', diffColor:'#ffeb3b'},
      {type:'circle', x:250,y:80,r:26,color:'#ff8a65', diffScale:0.5},
      {type:'circle', x:60,y:60,r:3,color:'#ffffff'},
      {type:'circle', x:90,y:120,r:3,color:'#ffffff'},
      {type:'circle', x:260,y:180,r:3,color:'#ffffff'},
      {type:'circle', x:40,y:220,r:3,color:'#ffffff', diffScale:0.02},
      {type:'rect', x:230,y:270,w:30,h:30,color:'#90a4ae', diffColor:'#607d8b'},
      {type:'circle', x:90,y:270,r:18,color:'#eceff1'}
    ]
  }
);
