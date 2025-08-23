const PREFIX = 'skinscan';
const VERSION = 'v1';
const CACHE_NAME = `${PREFIX}-${VERSION}`;
const APP_SHELL = [
  '/',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  // Network‑first for API, cache‑first for others
  if (request.url.includes('/api/')) return; // let network handle API
  e.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const resp = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, resp.clone());
      return resp;
    } catch {
      return cached || Response.error();
    }
  })());
});
