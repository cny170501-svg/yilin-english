/* Service Worker：应用离线缓存（PWA）
   v40 安全整改（YL-TASK-P3 / 已批准方案）：
   R1 安装失败关闭——每个资源 fetch(cache:'reload') 并校验 ok/200/未重定向后才 put；
      全部成功才 skipWaiting（全文件唯一一处）；任一失败 → 清理本版半成品缓存并 rethrow（新版作废，旧版继续服务）。
   R2 激活命名空间清理——仅删除本项目旧版本缓存 /^yilin-english-v\d+$/，不影响其他项目缓存。
   版本升级时改 CACHE 号即可（v39 → v40）。 */
var CACHE = 'yilin-english-v40';
var OWN_OLD = /^yilin-english-v\d+$/;
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './css/tw-typography.css',
  './css/ui2.css',
  './js/util.js',
  './js/storage.js',
  './js/audio-pack.js',
  './js/tts.js',
  './js/theme.js',
  './js/content.js',
  './js/exercise.js',
  './js/app.js',
  './js/views/home.js',
  './js/views/unit.js',
  './js/views/knowledge.js',
  './js/views/hub.js',
  './js/views/immersive.js',
  './js/views/library.js',
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
  './data/unit-knowledge.js',
  './vendor/pdf.min.js',
  './vendor/pdf.worker.min.js',
  './vendor/mammoth.browser.min.js',
  './vendor/xlsx.full.min.js',
  './js/lib/idb.js',
  './js/lib/parsers.js',
  /* 音频包清单（mp3 体积较大，按需在首次播放时由 fetch 处理器缓存）
     fb6f816f9d71a438.wav = Labour 教材真人读音（baf729c），预缓存保证离线可用 */
  './audio/manifest.js',
  './audio/fb6f816f9d71a438.wav',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

/* R1：单资源预缓存——校验通过才写入；返回 Promise（失败即 reject） */
function precacheOne(cache, a) {
  var expected = new URL(a, self.location.href).href;
  return fetch(a, { cache: 'reload' }).then(function (res) {
    if (!res || !res.ok || res.status !== 200) {
      throw new Error('precache ' + a + ' HTTP ' + (res && res.status));
    }
    /* 重定向防护：实际 URL 与期望不一致（如目录穿越跳转）视为失败 */
    if (res.redirected && res.url !== expected) {
      throw new Error('precache ' + a + ' redirected to ' + res.url);
    }
    /* Vary: * 等响应会让 cache.put 拒绝——同样视为本资源失败 */
    return cache.put(a, res).then(function () { return a; });
  });
}

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* 全部必需资源成功才允许激活；任一失败：清半成品并向上抛出（install rejected → 新版 redundant，旧版继续服务） */
      return Promise.all(ASSETS.map(function (a) {
        return precacheOne(cache, a);
      })).then(function () {
        return self.skipWaiting();   /* 全文件唯一 skipWaiting */
      });
    }).catch(function (err) {
      console.error('[SW v' + CACHE.slice(-3) + '] 安装失败，已清理半成品缓存：', err && err.message);
      return caches.delete(CACHE).then(function () {
        throw err;   /* rethrow：让 waitUntil 变 rejected，确保新版被判 redundant */
      });
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      /* R2：仅清本项目旧版本（yilin-english-vNN 且 ≠ 当前版）；其他项目缓存一概不动 */
      return Promise.all(keys.filter(function (k) {
        return OWN_OLD.test(k) && k !== CACHE;
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
