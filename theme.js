/* FORMA — tema dual: papel (default) / grafito.
   Cargar síncrono en <head> para aplicar el tema guardado antes del primer paint.
   Páginas con data-theme fijo en <html> (emotion: la sala de cine siempre es
   oscura) no reciben botón ni cambian de tema. */
(function () {
  const root  = document.documentElement;
  const FIXED = root.hasAttribute('data-theme');

  let stored = null;
  try { stored = localStorage.getItem('forma-theme'); } catch (e) {}
  if (!FIXED && stored === 'grafito') root.dataset.theme = 'grafito';

  if (FIXED) return;

  function setTheme(theme) {
    if (theme === 'grafito') root.dataset.theme = 'grafito';
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('forma-theme', theme); } catch (e) {}
    if (window.__applyTheme3D) window.__applyTheme3D(theme === 'grafito');
  }

  function mount() {
    const style = document.createElement('style');
    style.textContent = `
      #theme-toggle {
        position: fixed;
        bottom: 36px;
        left: 32px;
        z-index: 20;
        background: var(--glass-bg, oklch(97% 0.006 85 / 0.78));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--border, oklch(85% 0.008 85));
        color: var(--muted, oklch(52% 0.008 85));
        font-family: 'Barlow', system-ui, sans-serif;
        font-size: 0.5625rem;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        padding: 8px 14px;
        border-radius: 100px;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
      }
      #theme-toggle:hover { color: var(--text); border-color: var(--muted); }
      #theme-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
      @media (max-width: 767px) {
        #theme-toggle { bottom: calc(72px + env(safe-area-inset-bottom)); left: 14px; }
      }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.setAttribute('aria-label', 'Alternar tema papel / grafito');
    const label = () => { btn.textContent = root.dataset.theme === 'grafito' ? 'Ver en papel' : 'Ver en grafito'; };
    label();
    btn.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'grafito' ? 'papel' : 'grafito');
      label();
    });
    document.body.appendChild(btn);
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
