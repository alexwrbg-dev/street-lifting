// Street Lifting : cache hors ligne
const C = 'street-lifting-v1';
const CORE = ['./', './index.html', './chart.umd.min.js', './manifest.webmanifest', './icon-192.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') { // page : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put('./index.html', cp)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; })));
});
