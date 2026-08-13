/* FORMA — contacto canónico, compartido por las 5 páginas.
   Antes el formulario vivía dentro de ownership.html, enredado con su panel de
   unidad: era el único del sitio y el botón Contacto del rail no llevaba a
   ninguna parte (href="#"). Aquí sale a una pieza propia — panel, formulario,
   confirmación y canales directos — que cualquier página puede abrir.

   API:  FormaContacto.abrir({ titulo, subtitulo, mensaje })  ·  FormaContacto.cerrar()
   El `mensaje` es lo que se guarda en el lead: ownership manda ahí la unidad.

   Los canales directos (correo, teléfono, WhatsApp) salen de la ficha, en
   `contacto`, y cada uno se enciende por separado desde el panel. Un canal sin
   número no aparece — nunca se muestra un enlace que no lleva a nada. */
(function () {
  'use strict';

  const G = (ruta, dflt) => {
    const v = window.SITE_GET ? window.SITE_GET(ruta) : undefined;
    return (v === undefined || v === null || v === '') ? dflt : v;
  };
  const esc = t => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // ── Canales directos ──────────────────────────────────────────────────────
  // Solo teléfono y WhatsApp se normalizan a dígitos: el href los necesita sin
  // espacios ni guiones, pero en pantalla se muestra tal como se capturó.
  const soloDigitos = t => String(t || '').replace(/[^\d+]/g, '');

  function canales() {
    const c = G('contacto', {}) || {};
    const lista = [];
    if (c.email && c.emailActivo !== false) {
      lista.push({
        clase: 'correo', etiqueta: 'Correo', valor: c.email,
        href: 'mailto:' + c.email,
        icono: '<path d="M3 6.5h18v11H3z"/><path d="M3 7l9 6.5L21 7"/>',
      });
    }
    if (c.telefono && c.telefonoActivo !== false) {
      lista.push({
        clase: 'telefono', etiqueta: 'Teléfono', valor: c.telefono,
        href: 'tel:' + soloDigitos(c.telefono),
        icono: '<path d="M20.5 16.4v2.3a1.6 1.6 0 0 1-1.8 1.6 15.9 15.9 0 0 1-6.9-2.5 15.6 15.6 0 0 1-4.8-4.8A15.9 15.9 0 0 1 4.5 6a1.6 1.6 0 0 1 1.6-1.8h2.3a1.6 1.6 0 0 1 1.6 1.4c.1.8.3 1.5.5 2.2a1.6 1.6 0 0 1-.4 1.7l-1 1a12.8 12.8 0 0 0 4.8 4.8l1-1a1.6 1.6 0 0 1 1.7-.4c.7.2 1.4.4 2.2.5a1.6 1.6 0 0 1 1.4 1.6z"/>',
      });
    }
    if (c.whatsapp && c.whatsappActivo !== false) {
      lista.push({
        clase: 'whatsapp', etiqueta: 'WhatsApp', valor: c.whatsapp,
        href: null,   // se arma al abrir: lleva el contexto en el mensaje
        wa: soloDigitos(c.whatsapp).replace(/^\+/, ''),
        icono: '<path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.6-4.5a8.4 8.4 0 1 1 15.4-4.4z"/><path d="M9 9.3c.2 2.2 2.5 4.5 4.7 4.7l1-1.2 1.8.8-.3 1.4c-2.9.6-6.8-3.3-6.2-6.2l1.4-.3.8 1.8z"/>',
      });
    }
    return lista;
  }

  // El mensaje prellenado le ahorra al asesor la primera pregunta.
  function urlWhatsApp(numero, contexto) {
    const proyecto = (window.SITE && window.SITE.brand && window.SITE.brand.name) || '';
    const base = G('contacto.whatsappMensaje', 'Hola, me interesa {proyecto}.');
    let txt = String(base).replace('{proyecto}', proyecto);
    if (contexto) txt += ' ' + contexto;
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(txt);
  }

  // ── Estilos ───────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #fc-dim {
      position: fixed; inset: 0; z-index: 90;
      background: oklch(from var(--bg, oklch(94% 0.01 85)) l c h / 0.55);
      backdrop-filter: blur(3px);
      opacity: 0; pointer-events: none;
      transition: opacity 0.35s ease;
    }
    #fc-dim.abierto { opacity: 1; pointer-events: auto; }

    #fc-panel {
      position: fixed; top: 0; right: 0; bottom: 0; z-index: 91;
      width: min(390px, 100vw);
      display: flex; flex-direction: column;
      background: var(--glass-bg, oklch(97% 0.006 85 / 0.92));
      backdrop-filter: blur(24px) saturate(1.4);
      -webkit-backdrop-filter: blur(24px) saturate(1.4);
      border-left: 1px solid var(--glass-border, oklch(78% 0.01 85 / 0.55));
      color: var(--text, oklch(24% 0.006 85));
      font-family: var(--font-body, 'Barlow', system-ui, sans-serif);
      transform: translateX(100%);
      transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1);
      overflow-y: auto;
    }
    #fc-panel.abierto { transform: translateX(0); }

    #fc-panel .fc-cab { padding: 26px 28px 0; position: relative; }
    #fc-cerrar {
      position: absolute; top: 18px; right: 18px;
      width: 34px; height: 34px; border-radius: 50%;
      border: 1px solid var(--glass-border, oklch(78% 0.01 85 / 0.55));
      background: none; color: inherit; cursor: pointer;
      font-size: 17px; line-height: 1; opacity: 0.6;
      transition: opacity 0.2s;
    }
    #fc-cerrar:hover { opacity: 1; }
    .fc-eyebrow {
      font-size: 0.5625rem; font-weight: 600; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--muted, oklch(52% 0.008 85));
      display: block; min-height: 12px;
    }
    .fc-titulo {
      font-family: var(--font-display, 'Big Shoulders Display', system-ui, sans-serif);
      font-size: 2rem; font-weight: 700; letter-spacing: 0.03em;
      line-height: 1.05; margin: 6px 0 0;
    }
    /* Logotipo del proyecto en lugar del nombre en texto. Ocupa el mismo hueco
       —de ahí el alto acotado— para que el panel no salte al aparecer. */
    .fc-logo {
      display: block; margin: 8px 0 2px;
      /* Los dos topes guardan la proporción original (34/210): si solo subiera
         el alto, un logotipo ancho seguiría frenado por el ancho y no crecería. */
      max-height: 43px; max-width: min(100%, 266px); height: auto; width: auto;
    }
    .fc-logo[hidden] { display: none; }

    #fc-cuerpo { padding: 22px 28px 32px; display: flex; flex-direction: column; gap: 22px; }
    .fc-campos { display: flex; flex-direction: column; gap: 14px; }
    .fc-campo { display: flex; flex-direction: column; gap: 5px; }
    .fc-label {
      font-size: 0.5625rem; font-weight: 600; letter-spacing: 0.16em;
      text-transform: uppercase; color: var(--muted, oklch(52% 0.008 85));
    }
    .fc-input {
      font-family: inherit; font-size: 0.875rem; color: inherit;
      background: oklch(from var(--bg, oklch(94% 0.01 85)) l c h / 0.6);
      border: 1px solid var(--glass-border, oklch(78% 0.01 85 / 0.55));
      border-radius: 8px; padding: 11px 13px; width: 100%;
      transition: border-color 0.2s;
    }
    .fc-input:focus { outline: none; border-color: var(--accent, #ab4e30); }
    .fc-input.error { border-color: var(--error, #c0392b); }
    .fc-error {
      font-size: 0.6875rem; color: var(--error, #c0392b);
      opacity: 0; height: 0; transition: opacity 0.2s;
    }
    .fc-error.visible { opacity: 1; height: auto; }

    .fc-enviar {
      font-family: inherit; font-size: 0.625rem; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      background: var(--accent, #ab4e30); color: oklch(97% 0.01 85);
      border: none; border-radius: 100px; padding: 14px 20px;
      cursor: pointer; transition: filter 0.2s;
    }
    .fc-enviar:hover { filter: brightness(1.08); }
    .fc-enviar:disabled { opacity: 0.6; cursor: default; }

    /* ── Canales directos ── */
    .fc-canales {
      display: flex; flex-direction: column; gap: 9px;
      padding-top: 20px; border-top: 1px solid var(--glass-border, oklch(78% 0.01 85 / 0.55));
    }
    .fc-canales-titulo {
      font-size: 0.5625rem; font-weight: 600; letter-spacing: 0.16em;
      text-transform: uppercase; color: var(--muted, oklch(52% 0.008 85));
      margin-bottom: 2px;
    }
    .fc-canal {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px; border-radius: 10px;
      border: 1px solid var(--glass-border, oklch(78% 0.01 85 / 0.55));
      color: inherit; text-decoration: none;
      transition: border-color 0.2s, transform 0.2s ease-out;
    }
    .fc-canal:hover { border-color: var(--accent, #ab4e30); transform: translateX(2px); }
    .fc-canal svg {
      width: 17px; height: 17px; flex-shrink: 0;
      stroke: var(--accent, #ab4e30); stroke-width: 1.6; fill: none;
      stroke-linecap: round; stroke-linejoin: round;
    }
    .fc-canal-txt { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    .fc-canal-et {
      font-size: 0.5rem; font-weight: 600; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--muted, oklch(52% 0.008 85));
    }
    .fc-canal-val {
      font-size: 0.8125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    /* ── Confirmación ── */
    #fc-exito { display: none; flex-direction: column; align-items: flex-start; gap: 10px; }
    #fc-panel.enviado #fc-form, #fc-panel.enviado .fc-canales { display: none; }
    #fc-panel.enviado #fc-exito { display: flex; }
    .fc-ring {
      width: 44px; height: 44px; border-radius: 50%;
      border: 1px solid var(--accent, #ab4e30); color: var(--accent, #ab4e30);
      display: grid; place-items: center; font-size: 19px;
    }
    .fc-exito-t {
      font-size: 0.5625rem; font-weight: 600; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--muted, oklch(52% 0.008 85));
    }
    .fc-exito-b { font-size: 0.8125rem; color: var(--muted, oklch(52% 0.008 85)); white-space: pre-line; }

    @media (max-width: 767px) {
      #fc-panel { width: 100vw; padding-bottom: env(safe-area-inset-bottom); }
    }
    @media (prefers-reduced-motion: reduce) {
      #fc-panel, #fc-dim, .fc-canal { transition: none; }
    }
  `;
  document.head.appendChild(style);

  // ── Marcado ───────────────────────────────────────────────────────────────
  const dim = document.createElement('div');
  dim.id = 'fc-dim';

  const panel = document.createElement('aside');
  panel.id = 'fc-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Contacto');
  panel.innerHTML = `
    <div class="fc-cab">
      <button id="fc-cerrar" type="button" aria-label="Cerrar">&#215;</button>
      <span class="fc-eyebrow" id="fc-eyebrow"></span>
      <img class="fc-logo" id="fc-logo" alt="" hidden>
      <h2 class="fc-titulo" id="fc-titulo"></h2>
    </div>
    <div id="fc-cuerpo">
      <form id="fc-form" novalidate>
        <div class="fc-campos">
          <div class="fc-campo">
            <label class="fc-label" for="fc-nombre">${esc(G('pages.ownership.copy.formLabels.nombre', 'Nombre'))}</label>
            <input class="fc-input" id="fc-nombre" type="text" required autocomplete="name"
                   placeholder="${esc(G('pages.ownership.copy.formPlaceholders.nombre', 'Tu nombre completo'))}">
            <span class="fc-error" id="fc-nombre-error" role="alert">${esc(G('pages.ownership.copy.formErrors.required', 'Campo requerido'))}</span>
          </div>
          <div class="fc-campo">
            <label class="fc-label" for="fc-email">${esc(G('pages.ownership.copy.formLabels.email', 'Email'))}</label>
            <input class="fc-input" id="fc-email" type="email" required autocomplete="email"
                   placeholder="${esc(G('pages.ownership.copy.formPlaceholders.email', 'tu@email.com'))}">
            <span class="fc-error" id="fc-email-error" role="alert">${esc(G('pages.ownership.copy.formErrors.email', 'Email válido requerido'))}</span>
          </div>
          <div class="fc-campo">
            <label class="fc-label" for="fc-tel">${esc(G('pages.ownership.copy.formLabels.telefono', 'Teléfono'))}</label>
            <input class="fc-input" id="fc-tel" type="tel" autocomplete="tel"
                   placeholder="${esc(G('pages.ownership.copy.formPlaceholders.telefono', '+52 000 000 0000'))}">
          </div>
        </div>
        <button type="submit" class="fc-enviar" id="fc-enviar" style="margin-top:18px; width:100%">
          ${esc(G('pages.ownership.copy.formSubmit', 'Enviar solicitud'))}
        </button>
      </form>

      <div id="fc-canales"></div>

      <div id="fc-exito">
        <div class="fc-ring">&#10003;</div>
        <span class="fc-exito-t">${esc(G('pages.ownership.copy.successTitle', 'Enviado'))}</span>
        <p class="fc-exito-b">${esc(G('pages.ownership.copy.successBody', 'Tu solicitud fue enviada.\nUn asesor te contactará en breve.'))}</p>
      </div>
    </div>`;

  function montar() {
    document.body.appendChild(dim);
    document.body.appendChild(panel);
  }
  if (document.body) montar();
  else document.addEventListener('DOMContentLoaded', montar);

  // ── Apertura y cierre ─────────────────────────────────────────────────────
  let contextoMensaje = null;
  let ultimoFoco = null;

  function pintarCanales(contexto) {
    const caja = panel.querySelector('#fc-canales');
    const lista = canales();
    if (!lista.length) { caja.innerHTML = ''; return; }
    caja.innerHTML = `
      <div class="fc-canales">
        <span class="fc-canales-titulo">${esc(G('contacto.titulo', 'O escríbenos directo'))}</span>
        ${lista.map(c => {
          const href = c.wa ? urlWhatsApp(c.wa, contexto) : c.href;
          const extra = c.wa ? ' target="_blank" rel="noopener"' : '';
          return `<a class="fc-canal" href="${esc(href)}"${extra}>
            <svg viewBox="0 0 24 24" aria-hidden="true">${c.icono}</svg>
            <span class="fc-canal-txt">
              <span class="fc-canal-et">${esc(c.etiqueta)}</span>
              <span class="fc-canal-val">${esc(c.valor)}</span>
            </span>
          </a>`;
        }).join('')}
      </div>`;
  }

  // Cuando el encabezado es el PROYECTO se prefiere su logotipo; cuando es una
  // unidad ("601") manda el texto, porque ahí el dato es el número y cambiarlo
  // por el logo perdería justo lo que el visitante quiere confirmar.
  // El logo solo aparece si de verdad carga: si el archivo no está subido, se
  // queda el nombre en texto y no hay hueco ni parpadeo.
  function encabezado(titulo, esProyecto) {
    const B = (window.SITE && window.SITE.brand) || {};
    const logo = panel.querySelector('#fc-logo');
    const txt  = panel.querySelector('#fc-titulo');
    txt.textContent = titulo;
    txt.hidden = false;
    logo.hidden = true;
    if (!esProyecto || !B.wordmark) return;
    logo.alt = B.fullName || B.name || '';
    logo.onload  = () => { logo.hidden = false; txt.hidden = true; };
    logo.onerror = () => { logo.hidden = true;  txt.hidden = false; };
    logo.src = B.wordmark;
  }

  function abrir(ctx) {
    ctx = ctx || {};
    const marca = (window.SITE && window.SITE.brand && window.SITE.brand.name) || '';
    panel.querySelector('#fc-eyebrow').textContent = ctx.subtitulo || '';
    encabezado(ctx.titulo || marca, !ctx.titulo);
    contextoMensaje = ctx.mensaje || null;
    panel.classList.remove('enviado');
    pintarCanales(ctx.contextoWhatsApp || ctx.subtitulo || '');
    ultimoFoco = document.activeElement;
    dim.classList.add('abierto');
    panel.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    document.dispatchEvent(new CustomEvent('forma:contacto-abierto'));
    setTimeout(() => panel.querySelector('#fc-nombre').focus(), 420);
  }

  function cerrar() {
    if (!panel.classList.contains('abierto')) return;
    dim.classList.remove('abierto');
    panel.classList.remove('abierto');
    document.body.style.overflow = '';
    // Las páginas que esconden algo mientras el panel está encima (el CTA de
    // ownership) necesitan saber cuándo devolverlo.
    document.dispatchEvent(new CustomEvent('forma:contacto-cerrado'));
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    // El formulario se limpia DESPUÉS de la animación: si no, se ve vaciarse.
    setTimeout(() => {
      panel.querySelector('#fc-form').reset();
      panel.classList.remove('enviado');
      panel.querySelectorAll('.fc-input').forEach(i => i.classList.remove('error'));
      panel.querySelectorAll('.fc-error').forEach(e => e.classList.remove('visible'));
    }, 460);
  }

  const abierto = () => panel.classList.contains('abierto');

  panel.querySelector('#fc-cerrar').addEventListener('click', cerrar);
  dim.addEventListener('click', cerrar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && abierto()) cerrar(); });

  // El botón Contacto del rail no llevaba a ninguna parte (href="#"). Se
  // intercepta por delegación para no depender de que rail.js ya haya corrido.
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('.rail-contact');
    if (!a) return;
    e.preventDefault();
    abrir({});
  });

  // ── Envío ─────────────────────────────────────────────────────────────────
  panel.querySelector('#fc-form').addEventListener('submit', async e => {
    e.preventDefault();
    const elNombre = panel.querySelector('#fc-nombre');
    const elEmail  = panel.querySelector('#fc-email');
    const nombre   = elNombre.value.trim();
    const email    = elEmail.value.trim();
    const telefono = panel.querySelector('#fc-tel').value.trim();
    const reEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let ok = true;
    elNombre.classList.toggle('error', !nombre);
    panel.querySelector('#fc-nombre-error').classList.toggle('visible', !nombre);
    if (!nombre) { ok = false; elNombre.focus(); }

    const emailMal = !email || !reEmail.test(email);
    elEmail.classList.toggle('error', emailMal);
    panel.querySelector('#fc-email-error').classList.toggle('visible', emailMal);
    if (emailMal) { ok = false; if (nombre) elEmail.focus(); }
    if (!ok) return;

    const btn = panel.querySelector('#fc-enviar');
    const etiquetaOriginal = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    try {
      await window.MonolitoBackend.enviarLead({
        nombre, email,
        telefono: telefono || null,
        mensaje: contextoMensaje || 'Interés general en el proyecto',
      });
      panel.classList.add('enviado');
      setTimeout(cerrar, 3200);
    } catch (err) {
      btn.textContent = 'Error — reintentar';
    } finally {
      btn.disabled = false;
      setTimeout(() => { if (!panel.classList.contains('enviado')) btn.textContent = etiquetaOriginal; }, 2500);
    }
  });

  window.FormaContacto = { abrir, cerrar, abierto };
})();
