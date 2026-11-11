// FEEL · funziona anche offline dopo la prima apertura
const CACHE = "feel-v1";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // rete prima (così vedi sempre l'ultima versione), cache se sei offline
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      if (res.ok && (e.request.url.startsWith(self.location.origin) || e.request.url.includes("fonts.g"))) caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
