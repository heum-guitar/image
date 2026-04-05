const CACHE = 'heum-v1';
const FILES = [
  '/HEUM-s-guitar/',
  '/HEUM-s-guitar/index.html',
  '/HEUM-s-guitar/heum_icon_192.png',
  '/HEUM-s-guitar/heum_icon_512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
