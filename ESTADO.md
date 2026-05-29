# FORMA — Estado operativo del proyecto

_Actualizado: 2026-05-29_

---

## Qué es esto

Landing page cinemática de una sola pantalla. Fondo animado con 360 frames JPEG renderizados en canvas. Entre paradas, el canvas hace scrubbing de frames. En cada parada, un video fullscreen con texto animado encima.

**Archivo principal:** `index.html` (todo en un solo archivo: HTML + CSS + JS)  
**Assets:** `content/videos/` y `content/images/sequence/`  
**Publicado en:** GitHub Pages

---

## Navegación — modelo actual

### Inputs activos (botones únicamente)

| Control | Acción | Visibilidad |
|---|---|---|
| Chevron izquierdo | `goPrev()` | Fijo en borde izq., `opacity: 0.80` en móvil |
| Chevron derecho | `goNext()` | Fijo en borde der., `opacity: 0.80` en móvil |
| Pill `‹` (bottom center) | `goPrev()` | Glass pill, siempre visible |
| Pill `›` (bottom center) | `goNext()` | Glass pill, siempre visible |

### Inputs desactivados temporalmente (comentados en JS)

- Scroll / wheel
- Swipe touch
- Teclado (flechas, Space, Page)
- Drag horizontal en canvas
- Click en zona derecha/izquierda del canvas

> Todos están en el código, solo comentados con `/* */`. Se reactivan descomentando.

---

## Secuencia de boot

```
1. Pantalla de carga — barra ámbar al 100%
2. loadCriticalFrames() — carga los 6 frames de stop (frames 1,61,121,181,241,301)
3. Chevrones y pill aparecen — permanentes desde este momento
4. 400ms delay → removeDisplay del loading screen
5. playIntro() — video fullscreen sin skip (bug P0 pendiente)
6. playStopVideo(0) — stop-0 con texto animado
7. enableNav() → inputCooldown = false → navegación habilitada
8. loadRemainingFrames() — 354 frames en background, batches de 12
```

---

## Sistema de frames

- Total: 360 frames (frame_001.jpg … frame_360.jpg)
- Los frames de stop son: 1, 61, 121, 181, 241, 301
- Frames reservados (post-video): 1, 61, 121, 181, 241, 301 → skipped en tweens
- `isReserved(f)` → `Set` O(1) lookup → evita que el tween aterrice en el frame post-video
- La función `wrapFrame(n)` normaliza 1-based: `frame 0 en config → index 1 interno`
- Duración del tween: `clamp(distancia × 20ms, 1800ms, 3200ms)`
- Easing: ease-in-out-cubic — `t < 0.5 ? 4t³ : 1 - ((-2t+2)³)/2`

---

## Responsivo — estado post-fix (2026-05-29)

### Desktop (>768px)

| Elemento | Posición | Tamaño |
|---|---|---|
| Chevrones | `left:0 / right:0`, `top:50%` | SVG 28px, padding 32×18px |
| Chevrones (visible) | `opacity: 0.50` | hover → 1.00 |
| Pill | `bottom: 40px`, centrado | Fuente 0.625rem |
| Pill botones | `opacity: 0.45` | SVG 14px |

### Móvil (≤767px)

| Elemento | Posición | Tamaño |
|---|---|---|
| Chevrones | Igual borde | SVG **36px**, padding **28×20px** |
| Chevrones (visible) | **`opacity: 0.80`** | hover → 1.00 |
| Pill | **`bottom: 32px`** | padding 8×10×8×16px |
| Pill botones | **`opacity: 0.70`** | SVG **18px** |
| Scroll hint | `display: none` | — |

### Landscape móvil (max-height: 500px)

| Elemento | Cambio |
|---|---|
| Pill | `bottom: 16px` |
| Chevrones | SVG 28px, padding 20×16px |

---

## Bugs conocidos (del critique)

### P0 — Bloqueantes

| # | Bug | Fix requerido |
|---|---|---|
| 1 | **Intro sin skip** — si el video dura >45s el usuario abandona | Un `click`/`touchstart` sobre `#intro-overlay` llama `finish()` |
| 2 | **"Navigate" hint nunca se descarta** — los listeners están en inputs desactivados; el hint persiste para siempre y dice "Navigate" cuando los gestos no funcionan | Cambiar copy a "Tap arrows" o quitar el elemento; añadir `hideHint` en click de chevron/pill |

### P1 — Importantes

| # | Bug | Fix requerido |
|---|---|---|
| 3 | **Sin estado de fin** — stop-6 hace loop a stop-1 silenciosamente | Stop-6 necesita estado especial + CTA |
| 4 | **Chapter dots no interactivos** — usuarios esperan clickearlos | `pointer-events: auto` + listener de click por índice |

### P2 — Mejoras

| # | Bug | Fix requerido |
|---|---|---|
| 5 | **Clicks swallowed sin feedback** — durante `inputCooldown`, el chevron no reacciona visualmente | `transform: scale(0.93)` en el botón al click, incluso si se rechaza |
| 6 | **Nav links muertos** — "Emotion / Ownership / Action / Location" van a `href="#"` | Asignar destinos o eliminar |

### P3 — Menores

| # | Observación |
|---|---|
| 7 | `aria-label` en `#stage` promete "arrow keys or swipe" — inputs desactivados |
| 8 | `.nav-brand` y `.nav-links a` usan `oklch(93% 0.005 250 / 0.x)` hardcodeado — debería ser `oklch(from var(--text) l c h / 0.x)` |
| 9 | `aria-live="polite"` en `#nav-stop-pill` mezclado con botones interactivos — anti-pattern |
| 10 | `#scroll-wrapper` height no se actualiza en rotación de dispositivo |

---

## Accesibilidad — estado actual

| Check | Estado |
|---|---|
| `prefers-reduced-motion` | ✅ Detectado en JS + CSS media query |
| `role="application"` en `#stage` | ✅ |
| `aria-label` en videos | ✅ |
| `tabindex="0"` en `#stage` | ✅ |
| `focus-visible` en nav CTA | ✅ |
| `h1.sr-only` | ✅ |
| Contraste nav links | ✅ ~5:1 (oklch 93% / 0.80 sobre glass) |
| Keyboard nav | ❌ Desactivado temporalmente |
| aria-label contenido correcto | ⚠️ Dice "arrow keys or swipe" — desactivados |

---

## Comandos de desarrollo

```bash
# Servidor local
python -m http.server 8080
# Luego abrir: http://localhost:8080

# Git status
git status
git log --oneline -10

# Publicar a GitHub Pages
git add index.html
git commit -m "mensaje"
git push origin main
```

---

## Próximos pasos sugeridos (en orden de impacto)

1. **`/impeccable harden`** — Fix P0: skip de intro, y P0: hint copy correcto
2. **`/impeccable adapt`** — Verificar móvil en Chrome DevTools con dimensiones reales
3. Reactivar gestos (scroll + swipe) y evaluar si el modelo de solo-botones sigue siendo preferido
4. **`/impeccable onboard`** — Diseñar estado de fin en stop-6 (CTA, loop visible, etc.)
5. Hacer chapter dots interactivos (navegar directo al stop)
