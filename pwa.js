/* FORMA / Nashira — registro del service worker (instalabilidad PWA). */
(function () {
  if (!('serviceWorker' in navigator)) return;

  // En desarrollo local el SW solo estorba: cachea el HTML y el site.json y
  // enmascara las ediciones (una edición "no aparece" hasta limpiar el SW a mano).
  // En localhost/127.0.0.1 NO se registra y, si quedó uno de una visita previa,
  // se desregistra y se limpian sus caches — así probar en local es siempre fresco.
  // En producción el comportamiento es el de siempre (PWA instalable, offline).
  var h = location.hostname;
  var esLocal = h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '';
  if (esLocal) {
    navigator.serviceWorker.getRegistrations()
      .then(function (regs) { regs.forEach(function (r) { r.unregister(); }); })
      .catch(function () {});
    if (window.caches && caches.keys) {
      caches.keys()
        .then(function (ks) { ks.forEach(function (k) { caches.delete(k); }); })
        .catch(function () {});
    }
    return;
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
})();
