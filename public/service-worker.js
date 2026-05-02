const CACHE_NAME = 'one-drop-v12';
const APP_SHELL = [
  './',
  './index.html',
  './hero-top.jpeg',
  './manifest.webmanifest',
  './one-drop-header-wordmark-v2.png',
  './one-drop-icon-192-v3.png',
  './one-drop-icon-512-v3.png',
  './apple-touch-icon-v3.png',
  './one-drop-maskable-icon-512-v3.png',
].map((path) => new URL(path, self.location.href).toString());
const FALLBACK_URL = new URL('./index.html', self.location.href).toString();

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();

          if (new URL(event.request.url).origin === self.location.origin) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }

          return response;
        })
        .catch(() => caches.match(FALLBACK_URL));
    }),
  );
});
