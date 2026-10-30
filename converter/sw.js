const CACHE_NAME = 'gbp-eur-converter-v1';
const PRECACHE_URLS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Same-origin: network-first so updates land, cache when offline. Rate API calls are never cached here.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => { const copy = res.clone(); e.waitUntil(caches.open(CACHE_NAME).then((c) => c.put(e.request, copy))); return res; })
      .catch(() => caches.match(e.request).then((m) => m || caches.match('./index.html'))),
  );
});
