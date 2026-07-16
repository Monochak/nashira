// site.js — canon FORMA: carga la ficha del proyecto (site.json) antes del primer paint.
// Debe incluirse como PRIMER <script> del <head>, sin defer/async: los motores de cada
// página leen window.SITE de forma síncrona en cuanto arrancan.
//
// Contrato:
//   window.SITE          — la ficha completa (ver SITE-SCHEMA.md en 01_Admin)
//   [data-site="a.b.c"]  — al DOMContentLoaded, el textContent del elemento se
//                          reemplaza por el valor de esa ruta dentro de la ficha.
//   SITE_GET('a.b.c')    — helper para leer rutas desde los motores.

(function () {
  'use strict';

  // XHR síncrono a propósito: site.json es pequeño (~7 KB) y necesitamos la ficha
  // resuelta antes de que corran los scripts inline de la página (sin FOUC de copy).
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'site.json', false);
  xhr.send(null);

  if (xhr.status !== 200 && xhr.status !== 0) {
    console.error('site.js: no se pudo cargar site.json (' + xhr.status + ')');
    return;
  }

  var SITE;
  try {
    SITE = JSON.parse(xhr.responseText);
  } catch (e) {
    console.error('site.js: site.json inválido — ' + e.message);
    return;
  }

  window.SITE = SITE;

  function get(path) {
    return path.split('.').reduce(function (o, k) {
      return (o == null) ? undefined : o[k];
    }, SITE);
  }
  window.SITE_GET = get;

  // Copy declarativo: <span data-site="pages.action.copy.heading"></span>
  // Placeholders:     <input data-site-placeholder="pages.ownership.copy.formPlaceholders.nombre">
  document.addEventListener('DOMContentLoaded', function () {
    var nodes = document.querySelectorAll('[data-site]');
    for (var i = 0; i < nodes.length; i++) {
      var v = get(nodes[i].getAttribute('data-site'));
      if (typeof v === 'string') nodes[i].textContent = v;
    }
    var ph = document.querySelectorAll('[data-site-placeholder]');
    for (var j = 0; j < ph.length; j++) {
      var p = get(ph[j].getAttribute('data-site-placeholder'));
      if (typeof p === 'string') ph[j].setAttribute('placeholder', p);
    }
  });
})();
