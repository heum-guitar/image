const CACHE = 'heum-v1';
const FILES = [
  '/image/',
  '/image/index.html',
  '/image/heum_icon_192.png',
  '/image/heum_icon_512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
