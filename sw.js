const staticCacheName = 'site-static';
// each string is a request to a certain assets/resource that we want to cache
// storing assets as a key to each asset the request url and the value for that asset is the response
const assets = [
  '/',
  '/index.html',
  '/logo.png',
  '/css/materialize.min.css',
  '/js/materialize.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// 1. install service worker
// Note: it is not installing again unless this file is modified
// Cache assets that are not changing frequently
self.addEventListener('install', evt => {
 // console.log('service worker has been installed');
 evt.waitUntil(
  caches.open(staticCacheName).then(cache => {  
    cache.addAll(assets) // cache.add(); or cache.addAll([]);
   })
 );
});

// 2. activate event
self.addEventListener('activate', evt => {
  console.log('service worker has been activated');
});

// 2. fetch event
self.addEventListener('fetch', evt => {
  // console.log('fetch event', evt);
  // Check if there is something cached that matches our request
  evt.respondWith(
    caches.match(evt.request).then(cacheResponse => {
      return cacheResponse || fetch(evt.request);
    })
  )
});
