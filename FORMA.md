# FORMA — Project State

## What it is
Cinematic single-page experience. A 360-frame JPEG image sequence plays as a canvas-based scroll scrubber. At 6 defined stops, a full-screen video plays with animated text overlay. No routing, no frameworks — single HTML file.

**Live URL:** https://monochak.github.io/forma/
**Repo:** https://github.com/Monochak/forma.git (branch: `master`)
**File:** `C:\Users\jorge\Documents\Skills\landing\index.html`

---

## Architecture

### Single file
All HTML, CSS, and JS live in `index.html`. No build step, no bundler.

### Image sequence
- 360 JPEG frames in `content/frames/` (named `frame-001.jpg` … `frame-360.jpg`)
- Rendered via `<canvas>` with a custom `drawCover()` function that replicates `object-fit: cover`
- HiDPI-aware: canvas sized at `cssWidth * devicePixelRatio`
- Frame decode: `createImageBitmap()` for critical frames (off-thread), plain `<img>` for the rest

### Stop videos
- 6 stops defined in the inline `<script type="application/json">` config block
- Each stop has: `frame` index, `video` path, `num`, `label`, `body` text
- One `<video>` element per stop, created at boot with `preload="auto"` and appended to `#stop-overlay`
- Pool stored in `preloadedVideos[]` — videos buffer in background so playback is instant on arrival
- Intro video (`intro.mp4`) is separate, plays once at boot, has its own `#intro-overlay`

### Loading strategy (two-phase)
1. **Phase 1 — critical:** Load only the 6 stop frames. Progress bar fills. Experience starts.
2. **Phase 2 — background:** Remaining 354 frames load in batches of 12, after a 200ms delay.

---

## Navigation model

One gesture = advance one stop. Always plays the stop video, regardless of direction.

| Input | Forward | Backward |
|---|---|---|
| Mouse wheel | scroll down | scroll up |
| Touch swipe | swipe up | swipe down |
| Keyboard | `↓` / `→` / `Space` / `PageDown` | `↑` / `←` / `PageUp` |
| Mouse drag | drag left | drag right |

**Threshold:** 24px minimum for drag and swipe.  
**Cursor:** `ew-resize` on stage to signal horizontal drag.

### Loop
Frame sequence wraps: last frame connects back to frame 0. `wrapFrame(f)` handles modulo. `animateToFrame()` takes a `forward` boolean to cross the boundary in the correct direction.

### State variables
```
currentFrame      — last rendered frame index (-1 before first render)
currentStopIndex  — which stop the user is at (0–5)
isTransitioning   — true while frame tween is running (blocks new nav)
inputCooldown     — true until boot stop-0 video finishes
isDragging        — true during active mouse drag
skipCurrentVideo  — function reference; call to interrupt current stop video
textVisible       — guard to skip redundant hideText() work
```

---

## Animation

### Frame tween (`animateToFrame`)
- Ease-out-quart
- Duration: `clamp(distance × 16ms, 1200ms, 2400ms)`
- Loop-aware: adjusts `effectiveTo` by ±totalFrames when crossing the boundary

### Text overlay (`showStopText`)
Stagger sequence after stop video begins:
- `0ms` — stop number fades + rises
- `120ms` — heading fades + rises
- `320ms + (wordIndex × 45ms)` — body words, one by one

### Pill backdrop
- `::before` pseudo-element on `.stop-text`, `backdrop-filter: blur(4px) saturate(0.6)`
- Controlled via CSS custom properties `--bd-opacity` and `--bd-dur`
- Fades in on `showStopText`, snaps to 0 instantly on `hideText`

---

## Visual design

### Colors (OKLCH)
```css
--bg:     oklch(9% 0.008 250)   /* near-black, blue-tinted */
--text:   oklch(93% 0.005 250)  /* off-white */
--muted:  oklch(48% 0.01 250)
--dim:    oklch(28% 0.009 250)
--accent: oklch(70% 0.175 52)   /* warm amber */
--border: oklch(17% 0.01 250)
```

### Fonts
- **Big Shoulders Display 700** — stop headings
- **Barlow 400/500/600** — body, UI, labels

### Cinematic scrim (`#stage::after`)
Three-layer gradient: vertical (bottom fade) + horizontal (left fade) + radial (bottom-left corner pool).

### Text position
`#text-overlay`: `position: fixed; left: 64px; bottom: 100px; width: 400px`

---

## CSS layout notes
- `html, body`: `overflow: hidden` — no native scroll, all nav is gesture-driven
- `#stage`: `position: sticky; top: 0; height: 100dvh` — full-viewport canvas container
- `#stop-overlay`: `z-index: 40`, fades in/out via `.in` class toggle
- `#text-overlay`: `z-index: 45` — sits above stop video
- `isolation: isolate` on `.stop-text` — creates local stacking context for `::before z-index: -1`

---

## Deployment
- GitHub Pages, branch `master`, root `/`
- `.gitignore` excludes nothing — all 500MB+ of content is committed
- Linux filesystem is case-sensitive: video filenames must be lowercase (`video-01.mp4`, not `Video-01.mp4`)
- After push, GitHub Pages takes ~1 min to reflect changes
