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
      /* El botón ES una ficha del color al que vas: en papel se ve grafito,
         en grafito se ve papel. Siempre contrasta con el fondo, porque es
         literalmente el fondo del tema contrario. La etiqueta emerge al pasar. */
      #theme-toggle {
        position: fixed;
        bottom: 36px;
        left: 32px;
        z-index: 20;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Barlow', system-ui, sans-serif;
      }
      #theme-toggle .tt-chip {
        width: 26px;
        height: 26px;
        border-radius: 7px;
        flex-shrink: 0;
        background: oklch(18% 0.008 250);                    /* destino: grafito */
        box-shadow: 0 0 0 1px oklch(24% 0.006 85 / 0.22);
        transition: transform 0.2s ease-out, background 0.35s ease, box-shadow 0.35s ease;
      }
      html[data-theme='grafito'] #theme-toggle .tt-chip {
        background: oklch(94% 0.010 85);                     /* destino: papel */
        box-shadow: 0 0 0 1px oklch(93% 0.005 250 / 0.28);
      }
      #theme-toggle:hover .tt-chip { transform: scale(1.08); }
      #theme-toggle .tt-label {
        font-size: 0.5625rem;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--muted, oklch(52% 0.008 85));
        white-space: nowrap;
        opacity: 0;
        transform: translateX(-4px);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
      }
      #theme-toggle:hover .tt-label,
      #theme-toggle:focus-visible .tt-label { opacity: 1; transform: translateX(0); }
      #theme-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 8px; }
      @media (max-width: 767px) {
        #theme-toggle { bottom: calc(72px + env(safe-area-inset-bottom)); left: 14px; }
        /* En táctil no hay hover: la etiqueta se queda puesta. */
        #theme-toggle .tt-label { opacity: 1; transform: none; }
      }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.innerHTML = '<span class="tt-chip" aria-hidden="true"></span><span class="tt-label"></span>';
    const txt = btn.querySelector('.tt-label');
    // El color de la ficha lo pone el CSS según el tema; aquí solo el texto.
    // aria-label explícito: un color no dice nada a un lector de pantalla.
    const label = () => {
      const aGrafito = root.dataset.theme !== 'grafito';
      txt.textContent = aGrafito ? 'Grafito' : 'Papel';
      btn.setAttribute('aria-label', aGrafito ? 'Cambiar al tema grafito' : 'Cambiar al tema papel');
    };
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
