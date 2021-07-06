// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

var CACHE_STATIC_NAME = 'static-v5';
var CACHE_DYNAMIC_NAME = 'dynamic-v5';
var STATIC_FILES = [
  // '/',
  '/script.bundle.js',
  '/src_js_index_js.bundle.js',
  '/assets/coverPic.jpg',
  '/assets/coverPic.png',
  '/assets/loading-dots.gif',
  '/assets/profilePic.jpeg',
  '/assets/we_groove_logo.png',
  'https://kit.fontawesome.com/adf7886e69.js',
  'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@%5E1/en/emojibase/data.json',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9zo-mM5Ez.woff2',
  'https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9zo2mM5Ez.woff2',
  'https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9zoamM5Ez.woff2',
  'https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9zoymM5Ez.woff2',
  'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu72xKOzY.woff2',
  'https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9zoKmMw.woff2',
  'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu5mxKOzY.woff2',
  'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu7mxKOzY.woff2',
  'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4WxKOzY.woff2',
  'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu7WxKOzY.woff2',
  'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu7GxKOzY.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCp6KVjbNBYlgoKejZPslyCN4Ffgg.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCp6KVjbNBYlgoKejZPslyMN4Ffgg.woff2',
  'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCp6KVjbNBYlgoKejZPslyLN4Ffgg.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCp6KVjbNBYlgoKejZPslyDN4Ffgg.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCp6KVjbNBYlgoKejZPslyBN4Ffgg.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCp6KVjbNBYlgoKejZPslyPN4E.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgoKcg72j00.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgoKew72j00.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgoKcw72j00.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgoKfA72j00.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgoKcQ72j00.woff2',
  'https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgoKfw72.woff2',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
  'https://fonts.googleapis.com/css2?family=Lobster&family=Roboto&family=Ubuntu:ital,wght@0,400;1,700&display=swap',
  '/'
  // '/',
];

self.addEventListener('install', function (event) {
  console.log("[Service worker] Installing Service worker...", event)

  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILES);
      })
  )
})

self.addEventListener('activate', function (event) {
  console.log("[Service worker] Activating Service worker...", event)

  caches.keys()
    .then(keys => {
      return Promise.all(keys.map(key => {
        console.log("[Service worker] to be deleted " + key);
        if (key != CACHE_STATIC_NAME && key != CACHE_DYNAMIC_NAME) {
          return caches.delete(key)
        }
      }))
    })
    .then(res => {
      console.log(res)
    })
})

self.addEventListener('fetch', function (event) {
  var url = 'http://localhost:3000/';


  function isInArray(string, array) {
    var cachePath;
    if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
      console.log('matched ', string);
      cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else {
      cachePath = string; // store the full request (for CDNs)
    }
    return array.indexOf(cachePath) > -1;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function (res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function (cache) {
                  // trimCache(CACHE_DYNAMIC_NAME, 3);
                  if (event.request.url.indexOf('socket.io') == -1) {
                    cache.put(event.request.url, res.clone());
                  }
                  return res;
                })
            })
            .catch(function (err) {
              return caches.open(CACHE_STATIC_NAME)
                .then(function (cache) {
                  if (event.request.headers.get('accept')?.includes('text/html')) {
                    return cache.match('/offline.html');
                  }
                });
            });
        }
      })
  );
});
