importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';

workbox.setConfig({ debug: true });
// workbox.skipWaiting();
// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

precacheAndRoute([
  { url: '/', revision: 'dasdasczxczxc2323' },
  { url: '/script.bundle.js', revision: '123123asdasdasd' },
  { url: '/src_js_index_js.bundle.js', revision: 'asdasdasd' },
  { url: '/assets/coverPic.jpg', revision: '2e12ue1u2en' },
  { url: '/assets/coverPic.png', revision: 'daknsduabdbbdbd' },
  { url: '/assets/loading-dots.gif', revision: null },
  { url: '/assets/profilePic.jpeg', revision: null },
  { url: '/assets/we_groove_logo.png', revision: null },
  { url: 'https://kit.fontawesome.com/adf7886e69.js', revision: null },
  { url: 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@%5E1/en/emojibase/data.json', revision: null },
  { url: 'https://fonts.googleapis.com/css?family=Roboto:400,700', revision: null },
  { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: null },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css', revision: null },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js', revision: null },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css', revision: null },
  { url: 'https://fonts.googleapis.com/css2?family=Lobster&family=Roboto&family=Ubuntu:ital,wght@0,400;1,700&display=swap', revision: null },
  { url: 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@%5E1/en/emojibase/data.json', revision: null },
])

registerRoute(
  ({ request, url }) => request.destination === 'image' || url.pathname.startsWith('/uploads/'),
  new StaleWhileRevalidate({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ]
  })
);

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate()
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/socket.io/'),
  new NetworkOnly()
);

registerRoute(
  ({ url }) => url.hostname === 'fonts.gstatic.com' || url.hostname === 'ka-f.fontawesome.com',
  new CacheFirst({
    cacheName: 'font-awesome-cache'
  }),
);

registerRoute(
  ({ request, sameOrigin }) => sameOrigin && request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'documents',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
        maxEntries: 50
      }),
    ]
  }),
);
