const CACHE_NAME = 'holiday-packing-v3';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

// The app shell (index.html / the nav request) is network-first: every load
// gets whatever's actually live, falling back to the cached copy only when
// offline. This file (sw.js) rarely changes, so the byte-diff browsers use
// to detect a new service worker rarely fires on its own — without this,
// a plain cache-first index.html would keep serving whatever was cached at
// install time forever, no matter how many commits land afterwards.
// Everything else (icons, manifest) stays cache-first since it almost never
// changes and benefits from loading instantly/offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const isAppShell = event.request.mode === 'navigate' || event.request.url.endsWith('/index.html') || event.request.url.endsWith('.github.io/holiday-checklist/');
  if (isAppShell) {
    event.respondWith(
      fetch(event.request)
        .then((fresh) => {
          // Keep the worker alive until the cache write finishes — without
          // waitUntil this is a fire-and-forget promise the browser can (and
          // does) kill right after respondWith resolves, so the cache never
          // actually gets updated.
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, fresh.clone())));
          return fresh;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html'))),
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match('./index.html'));
    }),
  );
});
