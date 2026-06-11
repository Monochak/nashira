/* FORMA — transición compartida entre páginas.
   Capa --bg que cubre la pantalla 400ms antes de navegar (fade-out)
   y se disuelve al llegar (fade-in). Respeta prefers-reduced-motion. */
(function () {
  const DUR = 400;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const veil = document.createElement('div');
  veil.id = 'page-veil';
  veil.style.cssText =
    'position:fixed;inset:0;z-index:200;pointer-events:none;' +
    'background:var(--bg, oklch(9% 0.008 250));opacity:1;' +
    'transition:opacity ' + DUR + 'ms ease-out;';
  document.body.appendChild(veil);

  // ── Fade-in al llegar
  if (reduced) {
    veil.style.transition = 'none';
    veil.style.opacity = '0';
  } else {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      veil.style.opacity = '0';
    }));
  }

  // ── bfcache: al volver con el botón atrás, no dejar el velo puesto
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      veil.style.transition = 'none';
      veil.style.opacity = '0';
      requestAnimationFrame(() => { veil.style.transition = 'opacity ' + DUR + 'ms ease-out'; });
    }
  });

  // ── Fade-out antes de navegar (solo links internos .html)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:')) return;
    if (!/\.html(\?|#|$)/.test(href)) return;
    if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    e.preventDefault();
    if (reduced) { window.location.href = href; return; }

    veil.style.pointerEvents = 'auto';
    veil.style.opacity = '1';
    setTimeout(() => { window.location.href = href; }, DUR);
  });
})();
