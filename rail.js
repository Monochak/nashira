/* FORMA — navegación canónica de las 5 páginas.
   Escritorio: pastilla de vidrio arriba al centro, con el nombre del proyecto,
   las secciones en TEXTO y Contacto como botón de acento.
   Móvil (≤767px): barra inferior de iconos + etiquetas.
   Colisiones: se oculta cuando el panel de unidad (ownership) está abierto. */
(function () {
  const PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const ICONS = {
    emotion:   '<svg viewBox="0 0 24 24"><path d="M3 12c3-6 6-6 9 0s6 6 9 0"/></svg>',
    ownership: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="18"/><path d="M9 9h6M9 15h6"/></svg>',
    action:    '<svg viewBox="0 0 24 24"><path d="M6 18L18 6M10 6h8v8"/></svg>',
    location:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>',
    contact:   '<svg viewBox="0 0 24 24"><path d="M12 4l8 8-8 8-8-8z"/></svg>'
  };

  // La navegación la define la ficha (window.SITE.nav, editable en el panel:
  // Secciones visibles). Una sección con enabled:false no aparece en el rail.
  // El fallback cubre el caso de que la ficha no cargara.
  const FALLBACK = [
    { key: 'emotion',   label: 'Emotion',   href: 'emotion.html'   },
    { key: 'ownership', label: 'Ownership', href: 'ownership.html' },
    { key: 'action',    label: 'Action',    href: 'action.html'    },
    { key: 'location',  label: 'Location',  href: 'location.html'  },
    { key: 'contact',   label: 'Contacto',  href: '#', accent: true }
  ];
  const NAV = (window.SITE && Array.isArray(window.SITE.nav) && window.SITE.nav.length)
    ? window.SITE.nav : FALLBACK;
  const ITEMS = NAV
    .filter(it => it.enabled !== false)
    .map(it => ({ key: it.key, label: it.label, href: it.href,
                  cls: it.accent ? 'rail-contact' : it.cls }));

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

    /* Nombre del proyecto: ancla de identidad en la pastilla de escritorio.
       En móvil la barra inferior es solo navegación — la marca no aparece. */
    .rail-brand { display: none; }

    .rail-item {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      text-decoration: none;
      position: relative; /* ancla para el label absoluto en emotion */
      /* todos los iconos en acento; el inactivo a media intensidad, el activo pleno */
      color: var(--rail, var(--accent, oklch(54.8% 0.157 35.7)));
      opacity: 0.55;
      transition: opacity 0.2s ease-out;
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
    .rail-item:hover { opacity: 1; }
    .rail-item:hover .rail-label,
    .rail-item:focus-visible .rail-label { opacity: 1; transform: translateX(0); }
    .rail-item.active { opacity: 1; }
    .rail-item:focus-visible {
      opacity: 1;
      outline: 2px solid var(--rail, var(--accent, oklch(54.8% 0.157 35.7)));
      outline-offset: 3px;
      border-radius: 50%;
    }
    .rail-contact { opacity: 1; margin-top: 14px; }

    /* Tema grafito — el acento es igual en ambos temas; solo el label cambia */
    html[data-theme='grafito'] .rail-label { color: oklch(93% 0.005 250); }

    /* ── ESCRITORIO: pastilla de navegación ARRIBA, con los nombres en TEXTO.
       Móvil conserva su barra inferior de iconos (bloque max-width al final,
       que por orden de cascada gana sobre esto). ── */
    @media (min-width: 768px) {
      /* emotion: los chevrons laterales se ocultan; el stop-pill inferior
         (prev/next + contador) asume la navegación entre escenas */
      .nav-chevron { display: none !important; }

      #rail {
        top: 20px;
        right: auto;
        left: 50%;
        transform: translateX(-50%);
        flex-direction: row;
        align-items: center;
        gap: 30px;
        padding: 11px 12px 11px 24px;
        background: var(--glass-bg, oklch(97% 0.006 85 / 0.82));
        backdrop-filter: blur(20px) saturate(1.4);
        -webkit-backdrop-filter: blur(20px) saturate(1.4);
        border: 1px solid var(--glass-border, oklch(20% 0.006 85 / 0.14));
        border-radius: 100px;
        white-space: nowrap;
        max-width: calc(100vw - 40px);
      }

      .rail-brand {
        display: block;
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        /* Color elegible en el panel; ausente = color de texto del tema, algo
           atenuado. La atenuación va en el color por defecto (no en opacity),
           para que un color elegido se vea exacto y no al 75%. */
        color: var(--brand-color, oklch(from var(--text, oklch(24% 0.006 85)) l c h / 0.75));
      }

      /* La nav es TEXTO: el icono cede su lugar al nombre de la sección. */
      .rail-icon { display: none; }
      .rail-item { opacity: 1; gap: 0; }
      .rail-label {
        position: static;
        opacity: 0.42;
        transform: none;
        pointer-events: auto;
        font-size: 0.6875rem;
        letter-spacing: 0.10em;
        transition: opacity 0.2s ease-out;
      }
      .rail-item:hover .rail-label { opacity: 0.85; }
      .rail-item.active .rail-label { opacity: 1; }
      .rail-item:focus-visible { border-radius: 100px; outline-offset: 4px; }

      /* Contacto: botón de acento dentro de la pastilla (como el pill original). */
      .rail-contact { margin-top: 0; }
      #rail .rail-contact .rail-label {
        opacity: 1;
        background: var(--accent, oklch(54.8% 0.157 35.7));
        color: oklch(97% 0.01 85);
        padding: 7px 18px;
        border-radius: 100px;
        font-weight: 700;
        letter-spacing: 0.06em;
        transition: filter 0.2s ease-out;
      }
      #rail .rail-contact:hover .rail-label { filter: brightness(1.08); }

      /* La pastilla ya trae su propio vidrio en TODAS las páginas, así que el
         respaldo especial de Emotion y las etiquetas flotantes de Ownership
         (que existían para el rail vertical) dejaron de hacer falta. */
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
  // Ancla de identidad de la pastilla: el visitante ve siempre el nombre del
  // PROYECTO (canon), nunca el del estudio. Sin ficha, la pastilla va sin marca.
  const MARCA = (window.SITE && window.SITE.brand && window.SITE.brand.name) || '';
  const escapa = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  nav.innerHTML = (MARCA ? `<span class="rail-brand">${escapa(MARCA)}</span>` : '') +
    ITEMS.map(it => {
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
