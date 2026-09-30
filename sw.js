// GlobalMotos Pro - Service Worker
// Archivos propios: primero la red (siempre la version mas nueva) y, sin
// internet, la copia guardada. Librerias externas (Firebase, lector de codigos,
// fuentes): se guardan la primera vez para que el software abra sin internet.
// Las llamadas a Firebase, Google Drive y Gemini nunca pasan por la cache.
var CACHE = 'globalmotos-v1';
var PROPIOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
var LIBRERIAS = [
  'https://www.gstatic.com/firebasejs/',
  'https://unpkg.com/html5-qrcode',
  'https://fonts.googleapis.com/css2',
  'https://fonts.gstatic.com/'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(PROPIOS).catch(function () {}); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = req.url;

  if (new URL(url).origin === self.location.origin) {
    // version.json siempre desde la red
    if (url.indexOf('version.json') >= 0) return;
    var red = req.mode === 'navigate'
      ? fetch(url, { cache: 'no-cache', credentials: 'same-origin' })
      : fetch(req, { cache: 'no-cache' });
    e.respondWith(red.then(function (res) {
      if (res && res.ok) {
        var copia = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req.mode === 'navigate' ? './index.html' : req, copia); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (r) { return r || caches.match('./index.html'); });
    }));
    return;
  }

  if (LIBRERIAS.some(function (p) { return url.indexOf(p) === 0; })) {
    e.respondWith(caches.match(req).then(function (guardado) {
      if (guardado) return guardado;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var copia = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copia); });
        }
        return res;
      });
    }));
  }
});
