const CACHE_NAME = "spine-shell";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for the app shell: always try to fetch the latest copy while online (and stash
// it in the cache for offline use), only falling back to the cache when the network fails. This
// means shell updates reach the app automatically on the next load — no CACHE_NAME bump needed.
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  const isShellFile = url.origin === self.location.origin;
  if (!isShellFile) return;

  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
