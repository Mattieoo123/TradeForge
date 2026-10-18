/* TradeForge v7 service worker — network-first app updates, offline fallback. */
const CACHE = 'tradeforge-v7-20261018';
const ASSETS = ['./index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith('tradeforge-') && key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== self.location.origin) return;

  // Always try to load the latest HTML from GitHub Pages first.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, {cache: 'no-store'})
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE).then(cache => cache.put('./index.html', copy)));
          }
          return response;
        })
        .catch(async () => (await caches.match('./index.html')) || Response.error())
    );
    return;
  }

  // Manifest and icon work offline; cache misses fall back to the network.
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request).then(response => {
        if (response.ok && (requestURL.pathname.endsWith('/icon.svg') || requestURL.pathname.endsWith('/manifest.webmanifest'))) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
        }
        return response;
      }))
  );
});
