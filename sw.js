const CACHE = 'heum-v4';
const FILES = [
  '/image/',
  '/image/index.html',
  '/image/heum_icon_192.png',
  '/image/heum_icon_512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // 옛 버전 캐시 전부 삭제
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    // 이미 열려 있는(옛 버전이 떠 있는) 창을 강제로 새로고침해 최신으로 교체
    const wins = await self.clients.matchAll({ type: 'window' });
    for (const w of wins) {
      try { await w.navigate(w.url); } catch (e) {}
    }
  })());
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('googleapis') || url.includes('gstatic') || url.includes('firestore') || url.includes('firebase')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // 네트워크 우선: 항상 최신을 받아오고, 실패 시에만 캐시 폴백
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
