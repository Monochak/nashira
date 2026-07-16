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

  // ── VISTA PREVIA ──────────────────────────────────────────────────────
  // ?preview=ficha → el sitio lee el BORRADOR de la nube (tabla fichas) en
  // vez de la ficha publicada. Persiste en la pestaña (sessionStorage) para
  // sobrevivir la navegación del rail; ?preview=off o el letrero la apagan.
  // Solo lectura: no escribe ni publica nada.
  var q = new URLSearchParams(location.search);
  if (q.get('preview') === 'off') { try { sessionStorage.removeItem('forma-preview'); } catch (e) {} }
  var esPreview = q.get('preview') === 'ficha' ||
    (function () { try { return sessionStorage.getItem('forma-preview') === '1'; } catch (e) { return false; } })();

  if (esPreview && SITE.backend) {
    try {
      var px = new XMLHttpRequest();
      px.open('GET', SITE.backend.supabaseUrl + '/rest/v1/fichas?proyecto_slug=eq.' + SITE.slug + '&select=data', false);
      px.setRequestHeader('apikey', SITE.backend.supabaseAnonKey);
      px.setRequestHeader('Authorization', 'Bearer ' + SITE.backend.supabaseAnonKey);
      px.send(null);
      var rows = JSON.parse(px.responseText);
      if (rows.length) {
        SITE = rows[0].data;
        try { sessionStorage.setItem('forma-preview', '1'); } catch (e) {}
      } else { esPreview = false; }
    } catch (e) {
      console.warn('site.js: vista previa no disponible — ' + e.message);
      esPreview = false;
    }
  } else if (esPreview) { esPreview = false; }

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

    // Vista previa: aplicar acento del borrador en runtime + letrero de salida
    if (esPreview) {
      if (SITE.tokens && SITE.tokens.accent) {
        document.documentElement.style.setProperty('--accent', SITE.tokens.accent);
      }
      var aviso = document.createElement('button');
      aviso.textContent = 'VISTA PREVIA · clic para salir';
      aviso.setAttribute('style',
        'position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:99999;' +
        'background:rgba(20,20,24,0.85);color:#fff;border:1px solid rgba(255,255,255,0.25);' +
        'border-radius:999px;padding:6px 14px;font:600 10px/1 system-ui,sans-serif;' +
        'letter-spacing:0.14em;cursor:pointer;backdrop-filter:blur(6px);');
      aviso.addEventListener('click', function () {
        try { sessionStorage.removeItem('forma-preview'); } catch (e) {}
        location.href = location.pathname;
      });
      document.body.appendChild(aviso);
    }
  });
})();
