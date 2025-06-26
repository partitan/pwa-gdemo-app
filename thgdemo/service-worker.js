const CACHE_NAME = "my-demo-pwa-v1";
const toCache = [
  "/",
  "/index.html",
  "/home.html",
  "/product.html",
  "/search.html",
  "/contact.html",
  "/main.js",
  "/style.css",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(toCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});