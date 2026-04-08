const SW_VERSION = 'stability-os-v6';
const SHELL_CACHE = `${SW_VERSION}-shell`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;
const ASSETS = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => ![SHELL_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.origin === self.location.origin && (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname === '/San-CEO-os/')) {
    event.respondWith((async () => {
      try {
        const network = await fetch(event.request, { cache: 'no-store' });
        const cache = await caches.open(SHELL_CACHE);
        cache.put('./index.html', network.clone());
        return network;
      } catch {
        const cache = await caches.open(SHELL_CACHE);
        return (await cache.match(event.request)) || (await cache.match('./index.html'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const network = await fetch(event.request);
      if (network && network.status === 200 && url.origin === self.location.origin) {
        cache.put(event.request, network.clone());
      }
      return network;
    } catch {
      return cached || Response.error();
    }
  })());
});
