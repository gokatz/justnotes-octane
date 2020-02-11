
// self.addEventListener('install', function (e) {
//   e.waitUntil(
//     caches.open('notes').then(function (cache) {
//       return cache.addAll([
//         '/',
//         '/offline.html'
//       ]);
//     })
//   );
// });

const CACHE_NAME = 'notes';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
    await cache.addAll([
      new Request(OFFLINE_URL, { cache: 'reload' }),
      '/lightweight.png',
      '/offline.png'
    ]);
  })());
});


self.addEventListener('fetch', (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  let url = event.request.url;
  let isOfflinePng = url.includes('/offline.png');
  let canInterceptRequest = event.request.mode === 'navigate' || isOfflinePng;

  if (canInterceptRequest) {
    event.respondWith((async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        // const preloadResponse = await event.preloadResponse;
        // if (preloadResponse) {
        //   return preloadResponse;
        // }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        let resourceToReturn = isOfflinePng ? '/offline.png' : OFFLINE_URL;
        const cachedResponse = await cache.match(resourceToReturn);
        return cachedResponse;
      }
    })());
  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});