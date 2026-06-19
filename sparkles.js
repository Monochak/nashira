/* Nashira — destellos (gráfico auxiliar de marca). Canon, auto-inyectado en
   todas las páginas: cúmulo de estrellas titilantes en la esquina superior
   derecha. Decorativo: no bloquea clics (pointer-events:none). Respeta
   prefers-reduced-motion. Anclado a la izquierda del botón de pantalla
   completa para no encimarse. */
(function () {
  const SVG =
    '<svg viewBox="0 0 240 240" aria-hidden="true">' +
    '<g transform="translate(128 116) scale(2.70)"><path class="spark" style="--i:0" d="M0,-11 C1.6,-3.4 3.4,-1.6 11,0 C3.4,1.6 1.6,3.4 0,11 C-1.6,3.4 -3.4,1.6 -11,0 C-3.4,-1.6 -1.6,-3.4 0,-11 Z"/></g>' +
    '<g transform="translate(92 80) scale(1.55)"><path class="spark" style="--i:1" d="M0,-11 C1.6,-3.4 3.4,-1.6 11,0 C3.4,1.6 1.6,3.4 0,11 C-1.6,3.4 -3.4,1.6 -11,0 C-3.4,-1.6 -1.6,-3.4 0,-11 Z"/></g>' +
    '<g transform="translate(190 150) scale(1.27)"><path class="spark" style="--i:2" d="M0,-11 C1.6,-3.4 3.4,-1.6 11,0 C3.4,1.6 1.6,3.4 0,11 C-1.6,3.4 -3.4,1.6 -11,0 C-3.4,-1.6 -1.6,-3.4 0,-11 Z"/></g>' +
    '<g transform="translate(120 168) scale(1.18)"><path class="spark" style="--i:3" d="M0,-11 C1.6,-3.4 3.4,-1.6 11,0 C3.4,1.6 1.6,3.4 0,11 C-1.6,3.4 -3.4,1.6 -11,0 C-3.4,-1.6 -1.6,-3.4 0,-11 Z"/></g>' +
    '</svg>';

  function mount() {
    const style = document.createElement('style');
    style.textContent = `
      #nashira-sparkles {
        position: fixed;
        top: 6px;
        left: 12px;
        z-index: 54;
        width: var(--spk-size, 140px);
        pointer-events: none;
      }
      #nashira-sparkles svg { display: block; width: 100%; height: auto; overflow: visible; }
      #nashira-sparkles .spark {
        fill: var(--spk-color, #3b4a84);
        transform-box: fill-box; transform-origin: center;
        opacity: 0;
        animation: nashira-twinkle var(--spk-cycle, 5.5s) cubic-bezier(0.22,1,0.36,1) infinite both;
        animation-delay: calc(var(--i) * var(--spk-stagger, 0.32s));
      }
      @keyframes nashira-twinkle {
        0%   { opacity: 0;   transform: scale(.2)  rotate(-20deg); }
        7%   { opacity: 1;   transform: scale(1.15) rotate(6deg); }
        12%  { opacity: 1;   transform: scale(1)   rotate(0deg); }
        35%  { opacity: 1;   transform: scale(1)   rotate(0deg); }
        42%  { opacity: .78; transform: scale(.93) rotate(0deg); }
        49%  { opacity: 1;   transform: scale(1)   rotate(0deg); }
        60%  { opacity: 1;   transform: scale(1)   rotate(0deg); }
        68%  { opacity: 0;   transform: scale(.2)  rotate(22deg); }
        100% { opacity: 0;   transform: scale(.2)  rotate(22deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        #nashira-sparkles .spark { animation: none !important; opacity: 1 !important; transform: none !important; }
      }
      @media (max-width: 767px) {
        #nashira-sparkles { top: 8px; left: 10px; width: var(--spk-size-m, 104px); }
      }
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = 'nashira-sparkles';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = SVG;
    document.body.appendChild(div);
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
