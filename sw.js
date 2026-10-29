/* Service Worker：应用离线缓存（PWA）
   更新任何资源文件时，请把 CACHE 版本号 +1（如 v5 → v6），用户下次打开会自动更新 */
var CACHE = 'yilin-english-v26';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './css/tw-typography.css',
  './js/util.js',
  './js/storage.js',
  './js/tts.js',
  './js/content.js',
  './js/exercise.js',
  './js/app.js',
  './js/views/home.js',
  './js/views/unit.js',
  './js/views/practice.js',
  './js/views/wrong.js',
  './js/views/reading.js',
  './js/views/article.js',
  './js/views/grammar.js',
  './js/views/dictation.js',
  './js/views/progress.js',
  './js/views/settings.js',
  './data/yilin-4a.js',
  './data/listening.js',
  './data/reading.js',
  './data/grammar.js',
  './data/dictation.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* 单个文件失败不影响整体安装 */
      return Promise.allSettled(ASSETS.map(function (a) {
        return cache.add(a);
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k !== CACHE;
      }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        /* 成功的同源响应加入缓存，便于下次离线使用 */
        if (res && res.ok && new URL(e.request.url).origin === location.origin) {
          var clone = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function () {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
