// 서비스워커 - 오프라인 캐시(앱 셸 프리캐시 + 런타임 캐시). 개인용 PWA
const CACHE = 'kids01-v5';
const CORE = [
  './', 'index.html', 'manifest.json', 'icons/icon.svg',
  '놀이방.html', '놀이방.js', 'bgm.js',
  'music/bgm.mp3', 'music/bgm2.mp3', 'music/bgm3.mp3',
  'packs/puzzle-manifest.js', 'packs/color-manifest.js',
  '그림판.html', '분류놀이.html',
  '퍼즐.html', '색칠놀이.html',
  '소리놀이.html', '소리놀이.js', '붓기놀이.html', '붓기놀이.js',
  '숫자놀이.html', '숫자놀이.js', '그림자놀이.html', '그림자놀이.js',
  '선그리기.html', '선그리기.js', '짝맞추기.html', '짝맞추기.js',
  '코딩놀이.html', '코딩놀이.js', '한글놀이.html', '한글놀이.js',
  '셈놀이.html', '셈놀이.js', '패턴잇기.html', '패턴잇기.js',
  '미로놀이.html', '미로놀이.js', '시계놀이.html', '시계놀이.js',
  '알파벳.html', '알파벳.js', '틀린그림.html', '틀린그림.js',
  '지렁이놀이.html', '지렁이놀이.js',
];

self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u)))) // 개별 실패 허용
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// 캐시 우선 + 런타임 캐시(이미지/선그림 등은 볼 때 채워짐)
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.ok && new URL(req.url).origin === location.origin) {
        const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp));
      }
      return res;
    }).catch(() => cached))
  );
});
