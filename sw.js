/* FORMA / Nashira — service worker mínimo.
   Su único propósito es hacer el sitio instalable (PWA). No precachea los
   assets pesados (GLB, panoramas); sirve de red con respaldo de caché en
   tiempo de ejecución para navegación más rápida y un fallback offline básico. */
const CACHE = 'forma-nashira-v1';

// En desarrollo local el SW solo estorba: puede servir respuestas de caché
// (fallback offline transitorio) y enmascarar ediciones. En localhost el SW se
// AUTODESREGISTRA, borra sus caches y no intercepta fetch — así probar en local
// es siempre fresco. El navegador re-descarga sw.js en cada navegación, por lo
// que un SW viejo instalado se cura solo en 1-2 recargas. En producción, igual
// que siempre (PWA instalable, network-first con respaldo de caché).
const ES_LOCAL = self.location.hostname === 'localhost'
              || self.location.hostname === '127.0.0.1'
              || self.location.hostname === '[::1]';

if (ES_LOCAL) {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (e) => {
    e.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => { try { c.navigate(c.url); } catch (_) {} });
    })());
  });
  // sin handler de fetch: la red pasa directo, sin caché
} else {
  self.addEventListener('install', () => self.skipWaiting());

  self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      ).then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;
    e.respondWith(
      fetch(req)
        .then((res) => {
          // cachea en runtime solo respuestas propias y válidas
          if (res && res.ok && new URL(req.url).origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
  });
}
