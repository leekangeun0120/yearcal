const CACHE = "yearcal-v2";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// 늘 새 데이터를 먼저 받아오고, 인터넷이 안 되면 저장해 둔 걸 보여준다
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => {
    const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)).catch(() => {}); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
