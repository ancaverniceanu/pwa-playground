const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html',
];

// Limit cache size
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Listen the install event
self.addEventListener('install', (event) => {
  console.log('Service worker has been installed');
  // Add assets to the cache here - because it triggers every time when the SW changes and then we reload the page
  // The App Shell Model - https://developers.google.com/web/fundamentals/architecture/app-shell
  // waitUntil() -> don't finish the install event until the promise is resolved
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      // console.log('Caching shell assets');
      cache.addAll(assets);
    })
  );
});

// Listen the activate event
self.addEventListener('activate', (event) => {
  //console.log('service worker activated');
  event.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Listen the fetch events
self.addEventListener('fetch', (event) => {
  // console.log('Fetch event', event);
  // Intercept the cached resources and search cache and return them to the browser
  // Check if there is something cached that matches our request
  if (event.request.url.indexOf('firestore.googleapis.com') === -1) {
    event.respondWith(
      caches
        .match(event.request)
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(event.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                cache.put(event.request.url, fetchRes.clone());
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => {
          if (event.request.url.indexOf('.html') > -1) {
            return caches.match('/pages/fallback.html');
          }
        })
    );
  }
});
