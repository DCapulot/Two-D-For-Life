// service-worker.js - Two D for Life (TDFL)
// Cache com estratégia "cache-first" para funcionamento offline.

const CACHE_NAME = "tdfl-cache-v2";

const ARQUIVOS_PARA_CACHE = [
  "./",
  "./index.html",
  "./estilo.css",
  "./calculoimc.js",
  "./manifest.json",
  "./imagem/imc.jpg",
  "./imagem/obesidade.jpg",
  "./imagem/davidedaniel.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Instala o service worker e guarda os arquivos principais no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS_PARA_CACHE);
    })
  );
  self.skipWaiting();
});

// Remove caches antigos quando uma nova versão é ativada
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nomesDeCache) => {
      return Promise.all(
        nomesDeCache
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      );
    })
  );
  self.clients.claim();
});

// Estratégia: tenta o cache primeiro, senão busca na rede e guarda no cache
self.addEventListener("fetch", (event) => {
  // Só trata requisições GET (evita erros com POST, etc.)
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((respostaCache) => {
      if (respostaCache) {
        return respostaCache;
      }

      return fetch(event.request)
        .then((respostaRede) => {
          // Clona a resposta para poder guardar no cache e ainda retorná-la
          const respostaClonada = respostaRede.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, respostaClonada);
          });
          return respostaRede;
        })
        .catch(() => {
          // Se estiver offline e não tiver no cache, tenta cair no index.html
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
