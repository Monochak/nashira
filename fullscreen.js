/* FORMA — botón de pantalla completa (canon, auto-inyectado en todas las
   páginas). Usa la Fullscreen API. Se auto-oculta donde la API no existe
   (Safari de iPhone), para no mostrar un control roto.
   Estética glass coherente con theme.js / rail.js; soporta grafito. */
(function () {
  const el = document.documentElement;
  const request = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  const exit    = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
  if (!request) return;   // iPhone Safari: sin Fullscreen API → sin botón

  const isFS = () =>
    !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);

  // ── Persistencia entre secciones ─────────────────────────────────────────
  // La Fullscreen API se sale al navegar a otra URL y la página nueva no puede
  // re-entrar sin gesto del usuario. Guardamos la intención y re-entramos en la
  // primera interacción de la página nueva.
  const FLAG = 'forma-fullscreen';
  const wantsFS = () => { try { return sessionStorage.getItem(FLAG) === '1'; } catch (e) { return false; } };
  const setWant = (v) => { try { v ? sessionStorage.setItem(FLAG, '1') : sessionStorage.removeItem(FLAG); } catch (e) {} };

  // Marcar cuando una navegación está en curso, para no confundirla con un
  // Esc / cierre intencional al actualizar la intención guardada.
  let navigating = false;
  document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href && href[0] !== '#' && href.indexOf('javascript:') !== 0 && a.target !== '_blank') {
      navigating = true;
    }
  }, true);
  window.addEventListener('pagehide', () => { navigating = true; });

  function reenterOnFirstGesture() {
    if (!wantsFS() || isFS()) return;
    const go = () => {
      cleanup();
      if (wantsFS() && !isFS()) { try { const p = request.call(el); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
    };
    const cleanup = () => {
      document.removeEventListener('pointerdown', go, true);
      document.removeEventListener('keydown', go, true);
    };
    document.addEventListener('pointerdown', go, true);
    document.addEventListener('keydown', go, true);
  }

  function mount() {
    const style = document.createElement('style');
    style.textContent = `
      #fs-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 57;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: var(--glass-bg, oklch(97% 0.006 85 / 0.78));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--glass-border, oklch(85% 0.008 85));
        border-radius: 100px;
        color: var(--muted, oklch(52% 0.008 85));
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
      }
      #fs-toggle:hover { color: var(--text, oklch(24% 0.006 85)); border-color: var(--muted, oklch(52% 0.008 85)); }
      #fs-toggle:focus-visible { outline: 2px solid var(--accent, oklch(54.8% 0.157 35.7)); outline-offset: 3px; }
      #fs-toggle svg {
        width: 17px; height: 17px;
        stroke: currentColor; stroke-width: 1.6; fill: none;
        stroke-linecap: round; stroke-linejoin: round;
      }
      #fs-toggle .fs-exit  { display: none; }
      #fs-toggle.is-fs .fs-enter { display: none; }
      #fs-toggle.is-fs .fs-exit  { display: block; }
      @media (max-width: 767px) {
        #fs-toggle { top: 24px; right: 14px; width: 40px; height: 40px; }
      }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'fs-toggle';
    btn.setAttribute('aria-label', 'Pantalla completa');
    btn.innerHTML = `
      <svg class="fs-enter" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>
      </svg>
      <svg class="fs-exit" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>
      </svg>`;

    btn.addEventListener('click', () => {
      if (!isFS()) { setWant(true); try { const p = request.call(el); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
      else { setWant(false); if (exit) exit.call(document); }
    });

    function sync() {
      const fs = isFS();
      btn.classList.toggle('is-fs', fs);
      btn.setAttribute('aria-label', fs ? 'Salir de pantalla completa' : 'Pantalla completa');
      if (fs) setWant(true);
      // Salió sin navegar (Esc o botón) → el usuario ya no quiere fullscreen.
      else if (!navigating) setWant(false);
    }
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    document.addEventListener('msfullscreenchange', sync);

    document.body.appendChild(btn);

    // Si venimos de otra sección con fullscreen activo, re-entrar al primer gesto.
    reenterOnFirstGesture();
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
