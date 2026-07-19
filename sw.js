// 서비스워커 - 오프라인 캐시(앱 셸 프리캐시 + 런타임 캐시). 개인용 PWA
const CACHE = 'kids01-v9';
const CORE = [
  './', 'index.html', 'manifest.json', 'icons/icon.svg',
  '놀이방.html', '놀이방.js', 'bgm.js', 'level.js',
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
      // cache:'reload'로 HTTP 캐시 우회 → 항상 최신본을 프리캐시(옛 화면 고착 방지)
      .then(c => Promise.allSettled(CORE.map(u => c.add(new Request(u, {cache:'reload'})))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// HTML/JS/JSON: 네트워크 우선(항상 최신, 실패 시 캐시). 이미지/오디오 등: 캐시 우선(런타임 캐시)
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const fresh = req.mode === 'navigate' || /\.(html|js|json)$/.test(url.pathname);
  if (url.origin === location.origin && fresh) {
    // HTTP 캐시까지 우회해 항상 최신본 수신(옛 파일 고착 방지), 실패 시 캐시
    e.respondWith(
      fetch(new Request(url.href, {cache:'reload'})).then(res => {
        if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.ok && url.origin === location.origin) {
        const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp));
      }
      return res;
    }).catch(() => cached))
  );
});
