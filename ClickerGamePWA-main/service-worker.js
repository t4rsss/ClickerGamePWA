const CACHE_NAME = "meu-pwa-cache-v1";
const ASSETS = [
    "/",
    "/index.html",
    "/styles.css", 
    "/app.js",
    "/manifest.json",
    "/icone1.png",
    "/icone2.png"
];

// Instala o Service Worker e armazena os arquivos no cache
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Intercepta requisições e tenta carregar do cache primeiro
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Atualiza o cache quando houver novas versões
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});
