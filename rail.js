/* FORMA — rail de navegación vertical (prototipo).
   Iconos geométricos a la derecha; label emerge al hover.
   Desktop: reemplaza el pill. Móvil: conserva el pill existente.
   Colisiones: se oculta cuando el panel de unidad (ownership) está abierto;
   desplaza el chevron derecho (emotion) hacia adentro. */
(function () {
  const PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const ICONS = {
    emotion:   '<svg viewBox="0 0 24 24"><path d="M3 12c3-6 6-6 9 0s6 6 9 0"/></svg>',
    ownership: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="18"/><path d="M9 9h6M9 15h6"/></svg>',
    action:    '<svg viewBox="0 0 24 24"><path d="M6 18L18 6M10 6h8v8"/></svg>',
    location:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>',
    contact:   '<svg viewBox="0 0 24 24"><path d="M12 4l8 8-8 8-8-8z"/></svg>'
  };

  const ITEMS = [
    { key: 'emotion',   label: 'Emotion',   href: 'emotion.html'   },
    { key: 'ownership', label: 'Ownership', href: 'ownership.html' },
    { key: 'action',    label: 'Action',    href: 'action.html'    },
    { key: 'location',  label: 'Location',  href: 'location.html'  },
    { key: 'contact',   label: 'Contacto',  href: '#', cls: 'rail-contact' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    #rail {
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 56;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: opacity 0.3s ease-out;
    }
    #rail.rail-hidden { opacity: 0; pointer-events: none; }

    .rail-item {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      text-decoration: none;
      color: oklch(52% 0.008 85);
      transition: color 0.2s ease-out;
    }
    .rail-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .rail-icon svg {
      width: 20px;
      height: 20px;
      stroke: currentColor;
      stroke-width: 1.5;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .rail-label {
      font-family: 'Barlow', system-ui, sans-serif;
      font-size: 0.5625rem;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: oklch(24% 0.006 85);
      white-space: nowrap;
      opacity: 0;
      transform: translateX(6px);
      transition: opacity 0.25s ease-out, transform 0.25s ease-out;
      pointer-events: none;
    }
    .rail-item:hover { color: oklch(28% 0.006 85); }
    .rail-item:hover .rail-label,
    .rail-item:focus-visible .rail-label { opacity: 1; transform: translateX(0); }
    .rail-item.active { color: oklch(62% 0.21 40); }
    .rail-item:focus-visible {
      outline: 2px solid oklch(62% 0.21 40);
      outline-offset: 3px;
      border-radius: 50%;
    }
    .rail-contact { color: oklch(62% 0.21 40); margin-top: 14px; }
    .rail-contact:hover { color: oklch(54% 0.19 40); }

    /* Tema grafito */
    html[data-theme='grafito'] .rail-item          { color: oklch(48% 0.01 250); }
    html[data-theme='grafito'] .rail-item:hover    { color: oklch(82% 0.005 250); }
    html[data-theme='grafito'] .rail-label         { color: oklch(93% 0.005 250); }
    html[data-theme='grafito'] .rail-item.active   { color: oklch(62% 0.21 40); }
    html[data-theme='grafito'] .rail-contact       { color: oklch(62% 0.21 40); }
    html[data-theme='grafito'] .rail-contact:hover { color: oklch(70% 0.18 40); }

    /* El rail reemplaza al pill en todos los tamaños */
    #nav-wrapper { display: none !important; }

    @media (min-width: 768px) {
      /* emotion: los chevrons laterales se ocultan; el stop-pill inferior
         (prev/next + contador) asume la navegación entre escenas */
      .nav-chevron { display: none !important; }
    }

    /* ── Móvil: barra inferior con iconos + labels ── */
    @media (max-width: 767px) {
      #rail {
        right: 0;
        left: 0;
        top: auto;
        bottom: 0;
        transform: none;
        flex-direction: row;
        justify-content: space-around;
        align-items: stretch;
        gap: 0;
        padding: 5px 8px calc(5px + env(safe-area-inset-bottom));
        background: oklch(97% 0.006 85 / 0.82);
        backdrop-filter: blur(20px) saturate(1.4);
        -webkit-backdrop-filter: blur(20px) saturate(1.4);
        border-top: 1px solid oklch(78% 0.01 85 / 0.6);
      }
      html[data-theme='grafito'] #rail {
        background: oklch(13% 0.01 250 / 0.72);
        border-top: 1px solid oklch(25% 0.012 250 / 0.55);
      }
      .rail-item {
        flex-direction: column-reverse; /* icono arriba, label abajo */
        justify-content: center;
        gap: 3px;
        flex: 1;
        min-height: 50px;
      }
      .rail-icon { width: auto; height: 22px; }
      .rail-label {
        opacity: 1;
        transform: none;
        font-size: 0.5rem;
        letter-spacing: 0.08em;
        color: inherit;
      }
      .rail-contact { margin-top: 0; }
      .rail-item:focus-visible { border-radius: 8px; }

      /* Colisiones del borde inferior con la barra */
      #nav-stop-pill { bottom: calc(66px + env(safe-area-inset-bottom)) !important; }
      #chapters      { bottom: calc(72px + env(safe-area-inset-bottom)) !important; }
      #info-btn      { bottom: calc(72px + env(safe-area-inset-bottom)) !important; }
    }
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.id = 'rail';
  nav.setAttribute('aria-label', 'Navegación principal');
  nav.innerHTML = ITEMS.map(it => {
    const active = PAGE === it.href.toLowerCase();
    return `<a class="rail-item${active ? ' active' : ''}${it.cls ? ' ' + it.cls : ''}"` +
           ` href="${it.href}"${active ? ' aria-current="page"' : ''}>` +
           `<span class="rail-label">${it.label}</span>` +
           `<span class="rail-icon" aria-hidden="true">${ICONS[it.key]}</span></a>`;
  }).join('');
  document.body.appendChild(nav);

  // ── Ownership: ocultar el rail mientras el panel de unidad está abierto
  const unitPanel = document.getElementById('unit-panel');
  if (unitPanel) {
    new MutationObserver(() => {
      nav.classList.toggle('rail-hidden', unitPanel.classList.contains('open'));
    }).observe(unitPanel, { attributes: true, attributeFilter: ['class'] });
  }
})();
