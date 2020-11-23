var staticCacheName = "django-pwa-v"
var filesToCache = [
  '/offline',
];

// Cache on install

self.addEventListener("install", event => {
  this.skipWaiting();
  event.waitUntil(
      caches.open(staticCacheName)
          .then(cache => {
              return cache.addAll(filesToCache);
          })
   )
 });
 self.addEventListener("install", event => {
  this.skipWaiting();
  event.waitUntil(
      caches.open(staticCacheName)
          .then(cache => {
              return fetch('/offline').then(response => cache.put('/offline', new Response(response.body)));
            })
  )
});
// cache бүгдын арилгах
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
          cacheNames.forEach(function(cacheName) {
            caches.delete(cacheName);
          })
        })
    );
});


// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline');
            })
    )
});