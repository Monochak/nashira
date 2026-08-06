// site.js — canon FORMA: carga la ficha del proyecto antes del primer paint.
// Debe incluirse como PRIMER <script> del <head>, sin defer/async: los motores de cada
// página leen window.SITE de forma síncrona en cuanto arrancan.
//
// FICHA VIVA: la fuente de verdad es la nube (tabla `fichas` en Supabase, editable
// desde el panel Contenido). Lo que se guarda en el panel impacta el sitio publicado
// en la siguiente visita, sin republicar. El site.json empacado es el respaldo:
// se usa si la nube no responde o si la ficha no pasa la verificación de cordura.
// Los robots (Google/WhatsApp) leen el HTML estampado — metas/OG sí requieren publicar.
//
// Contrato:
//   window.SITE          — la ficha completa (ver SITE-SCHEMA.md en 01_Admin)
//   window.SITE_SOURCE   — 'nube' | 'nube-cache' | 'local' (diagnóstico)
//   [data-site="a.b.c"]  — al DOMContentLoaded, el textContent del elemento se
//                          reemplaza por el valor de esa ruta dentro de la ficha.
//   SITE_GET('a.b.c')    — helper para leer rutas desde los motores.

(function () {
  'use strict';

  // XHR síncrono a propósito: site.json es pequeño (~8 KB) y necesitamos la ficha
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

  // ── FICHA VIVA ────────────────────────────────────────────────────────
  // Cache por pestaña (60 s): navegar entre páginas no repite la consulta;
  // un editor que guarda en el panel ve su cambio al recargar en <1 min.
  var LIVE_TTL_MS = 60000;
  window.SITE_SOURCE = 'local';
  try {
    var cache = null;
    try { cache = JSON.parse(sessionStorage.getItem('forma-ficha-viva')); } catch (e) {}

    if (cache && cache.slug === SITE.slug && (Date.now() - cache.t) < LIVE_TTL_MS) {
      SITE = cache.data;
      window.SITE_SOURCE = 'nube-cache';
    } else if (SITE.backend) {
      var lx = new XMLHttpRequest();
      lx.open('GET', SITE.backend.supabaseUrl + '/rest/v1/fichas?proyecto_slug=eq.' +
        SITE.slug + '&select=data', false);
      lx.setRequestHeader('apikey', SITE.backend.supabaseAnonKey);
      lx.setRequestHeader('Authorization', 'Bearer ' + SITE.backend.supabaseAnonKey);
      lx.send(null);
      var rows = JSON.parse(lx.responseText);
      var f = rows.length ? rows[0].data : null;
      // Verificación de cordura: debe ser la ficha de ESTE proyecto, del schema
      // conocido y con la estructura mínima. Si no, se queda la empacada.
      if (f && f.schemaVersion === 1 && f.slug === SITE.slug && f.brand && f.pages) {
        SITE = f;
        window.SITE_SOURCE = 'nube';
        try {
          sessionStorage.setItem('forma-ficha-viva',
            JSON.stringify({ slug: f.slug, t: Date.now(), data: f }));
        } catch (e) {}
      }
    }
  } catch (e) {
    console.warn('site.js: ficha viva no disponible — usando la empacada. ' + e.message);
  }

  window.SITE = SITE;

  // ── GUARDÁN DE SECCIONES ──────────────────────────────────────────────
  // Si la sección actual fue ocultada en el panel (nav enabled:false), saltar
  // a la primera sección visible ANTES de pintar — nadie entra por link directo.
  (function () {
    var nav = SITE.nav;
    if (!Array.isArray(nav)) return;
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var actual = nav.filter(function (it) {
      return it.href && it.href.toLowerCase() === page;
    })[0];
    if (actual && actual.enabled === false) {
      var primera = nav.filter(function (it) {
        return it.enabled !== false && it.href && it.href !== '#';
      })[0];
      if (primera) location.replace(primera.href);
    }
  })();

  function get(path) {
    return path.split('.').reduce(function (o, k) {
      return (o == null) ? undefined : o[k];
    }, SITE);
  }
  window.SITE_GET = get;

  // Acento en runtime: si la ficha trae un acento hex (elegido en el panel),
  // pisa la variable estampada — así el color viaja sin republicar. El acento
  // canon (oklch) se queda como esté estampado en el HTML.
  if (SITE.tokens && typeof SITE.tokens.accent === 'string' && SITE.tokens.accent.charAt(0) === '#') {
    document.documentElement.style.setProperty('--accent', SITE.tokens.accent);
  }
  // Color del rail de navegación: si la ficha lo trae, pisa --rail (el rail usa
  // var(--rail, var(--accent))), así se elige independiente del acento. Ausente = acento.
  if (SITE.tokens && typeof SITE.tokens.railColor === 'string' && SITE.tokens.railColor.charAt(0) === '#') {
    document.documentElement.style.setProperty('--rail', SITE.tokens.railColor);
  }
  // Color del nombre del proyecto en la pastilla de navegación. Ausente = color
  // de texto del tema (papel/grafito), que es el comportamiento por defecto.
  if (SITE.tokens && typeof SITE.tokens.brandColor === 'string' && SITE.tokens.brandColor.charAt(0) === '#') {
    document.documentElement.style.setProperty('--brand-color', SITE.tokens.brandColor);
  }

  // Colores del favicon elegidos en el panel (fondo + marca). El SVG se recolorea
  // y se cambia el icono de la pestaña al vuelo, sin republicar. Si el archivo no
  // es SVG o no tiene la estructura esperada, se queda como está.
  (function () {
    var FC = SITE.brand && SITE.brand.faviconColors;
    if (!FC || (!FC.fondo && !FC.marca)) return;
    var link = document.querySelector('link[rel~="icon"][type="image/svg+xml"]') ||
               document.querySelector('link[rel~="icon"]');
    if (!link || !/\.svg(\?|$)/i.test(link.getAttribute('href') || '')) return;
    fetch(link.href).then(function (r) { return r.text(); }).then(function (svg) {
      var hex = /#[0-9a-fA-F]{3,8}/;
      if (FC.fondo) {
        svg = svg.replace(/<rect\b[^>]*\bfill="[^"]*"/i, function (m) {
          return m.replace(hex, FC.fondo);
        });
      }
      if (FC.marca) {
        svg = svg.replace(/<path\b[^>]*\bfill="[^"]*"/i, function (m) {
          return m.replace(hex, FC.marca);
        });
      }
      link.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(svg));
    }).catch(function () {});
  })();

  // Copy declarativo: <span data-site="pages.action.copy.heading"></span>
  // Placeholders:     <input data-site-placeholder="pages.ownership.copy.formPlaceholders.nombre">
  // Color por texto elegido en el panel (paleta de marca). Se aplica a la ruta
  // del data-site; ausente = color por defecto (consciente del tema).
  var TEXT_COLORS = (SITE && SITE.textColors) || {};
  // Estilo por texto (negrita + espaciado entre letras) elegido en el panel.
  var TEXT_STYLES = (SITE && SITE.textStyles) || {};
  document.addEventListener('DOMContentLoaded', function () {
    var nodes = document.querySelectorAll('[data-site]');
    for (var i = 0; i < nodes.length; i++) {
      var path = nodes[i].getAttribute('data-site');
      var v = get(path);
      if (typeof v === 'string') nodes[i].textContent = v;
      if (TEXT_COLORS[path]) nodes[i].style.color = TEXT_COLORS[path];
      var st = TEXT_STYLES[path];
      if (st) {
        if (st.negrita) nodes[i].style.fontWeight = '700';
        if (st.espaciado != null) nodes[i].style.letterSpacing = st.espaciado + 'em';
      }
    }
    var ph = document.querySelectorAll('[data-site-placeholder]');
    for (var j = 0; j < ph.length; j++) {
      var p = get(ph[j].getAttribute('data-site-placeholder'));
      if (typeof p === 'string') ph[j].setAttribute('placeholder', p);
    }
  });
})();
