# Manual de uso — Plantilla de landing cinematic

Este documento explica cómo convertir `template.html` en un proyecto propio, desde cero, sin conocimientos previos de programación.

---

## Qué hace esta plantilla

Una página web de una sola pantalla donde:

1. Aparece una barra de carga mientras se preparan las imágenes.
2. Se reproduce un video de introducción (opcional).
3. El usuario navega entre **paradas** (stops) usando scroll, swipe, teclado o arrastre horizontal.
4. En cada parada, se reproduce un video a pantalla completa con un título y texto animado encima.
5. El fondo entre paradas es una secuencia de imágenes que se anima como scrubbing de video.

---

## Estructura de archivos que necesitas

Antes de tocar cualquier código, prepara esta estructura de carpetas:

```
mi-proyecto/
├── index.html                  ← copia de template.html, renombrada
├── content/
│   ├── videos/
│   │   ├── intro.mp4           ← video de introducción (opcional)
│   │   ├── video-01.mp4
│   │   ├── video-02.mp4
│   │   ├── video-03.mp4
│   │   ├── video-04.mp4
│   │   ├── video-05.mp4
│   │   └── video-06.mp4
│   └── images/
│       └── sequence/
│           ├── frame_001.jpg
│           ├── frame_002.jpg
│           ├── frame_003.jpg
│           └── … (hasta frame_360.jpg)
```

> **Importante:** Los nombres de archivo deben estar en **minúsculas** si vas a publicar en GitHub Pages (el servidor es sensible a mayúsculas/minúsculas).

---

## Paso 1 — Duplicar la plantilla

1. Copia el archivo `template.html`.
2. Pégalo en la carpeta de tu nuevo proyecto.
3. Renómbralo a `index.html`.

No toques nada más todavía.

---

## Paso 2 — Llenar el config

Abre `index.html` con cualquier editor de texto (Bloc de notas, VS Code, TextEdit).

Busca el bloque que empieza así:

```html
<script type="application/json" id="site-config">
```

Dentro encontrarás un JSON. Este es el único lugar donde editas el **contenido** del sitio. Aquí está explicado campo por campo:

---

### `brand`

El nombre de tu proyecto. Aparece en el nav, en la pantalla de carga y en la pestaña del navegador.

```json
"brand": "FORMA"
```

Cámbialo por el nombre de tu proyecto:

```json
"brand": "ATLAS"
```

---

### `nav` — la barra de navegación

Define los links del menú y el botón de acción.

```json
"nav": {
  "links": [
    { "label": "Servicios",  "href": "#" },
    { "label": "Proyectos",  "href": "#" },
    { "label": "Contacto",   "href": "#" }
  ],
  "cta": { "label": "Agendar llamada", "href": "#" }
}
```

- `label`: el texto que aparece en pantalla.
- `href`: la URL a la que lleva. Usa `"#"` si aún no tienes destino.
- Puedes tener entre 1 y 4 links. En móvil los links se ocultan (solo queda el botón CTA).

---

### `totalFrames`

Cuántas imágenes tiene tu secuencia. Si tienes 240 frames, pon `240`. Si tienes 360, pon `360`.

```json
"totalFrames": 360
```

---

### `frameDir`, `framePrefix`, `framePad`, `frameExt`

Describen cómo se llaman tus archivos de imagen.

| Campo | Valor por defecto | Qué controla |
|---|---|---|
| `frameDir` | `"content/images/sequence/"` | Carpeta donde están las imágenes |
| `framePrefix` | `"frame_"` | Prefijo del nombre de archivo |
| `framePad` | `3` | Cuántos dígitos tiene el número (`3` → `001`, `4` → `0001`) |
| `frameExt` | `".jpg"` | Extensión del archivo |

Con los valores por defecto, el sistema busca archivos como:
```
content/images/sequence/frame_001.jpg
content/images/sequence/frame_002.jpg
…
content/images/sequence/frame_360.jpg
```

Si tus archivos se llaman diferente (por ejemplo `img-0001.png`), ajusta así:

```json
"frameDir":    "content/images/sequence/",
"framePrefix": "img-",
"framePad":    4,
"frameExt":    ".png"
```

---

### `intro`

Ruta al video de introducción. Se reproduce una sola vez al cargar.

```json
"intro": "content/videos/intro.mp4"
```

Si **no quieres intro**, déjalo vacío:

```json
"intro": ""
```

---

### `stops` — las paradas

Este es el corazón del config. Cada objeto en el array es una parada.

```json
"stops": [
  {
    "frame": 0,
    "video": "content/videos/video-01.mp4",
    "num":   "01",
    "label": "Origen",
    "body":  "Texto descriptivo de esta parada. Puede ser corto o largo."
  },
  {
    "frame": 60,
    "video": "content/videos/video-02.mp4",
    "num":   "02",
    "label": "Impulso",
    "body":  "Otro texto aquí."
  }
]
```

| Campo | Qué hace |
|---|---|
| `frame` | En qué frame de la secuencia aparece esta parada (0 al totalFrames−1) |
| `video` | Ruta al video que se reproduce en esta parada |
| `num` | Número decorativo (aparece en acento encima del título) |
| `label` | Título de la parada |
| `body` | Texto descriptivo (aparece debajo del título, palabra por palabra) |

**Cuántas paradas puedes tener:** cualquier número. No está limitado a 6.

**Cómo distribuir los frames:** si tienes 360 frames y 6 paradas, repártelas en intervalos iguales: 0, 60, 120, 180, 240, 300. Si tienes 4 paradas: 0, 90, 180, 270.

> **Regla de oro:** la primera parada siempre debe tener `"frame": 0`.

---

## Paso 3 — Cambiar los colores

Busca en el CSS el bloque marcado como `THEME`. Lo encontrarás aquí:

```css
:root {
  --bg:       oklch(9%  0.008 250);
  --text:     oklch(93% 0.005 250);
  --text-dim: oklch(88% 0.006 250);
  --muted:    oklch(48% 0.01  250);
  --dim:      oklch(28% 0.009 250);
  --border:   oklch(17% 0.01  250);
  --accent:   oklch(70% 0.175  52);
  ...
}
```

Los colores usan formato OKLCH: `oklch(luminosidad% croma matiz)`.

### Cambiar el tinte de los neutros

El número al final (el **matiz**) controla el color del tinte. Por defecto es `250` (azul-frío). Cambia ese número en todos los neutros al mismo tiempo:

| Matiz | Color resultante |
|---|---|
| `250` | Azul-frío (default) |
| `200` | Cian-teal |
| `150` | Verde |
| `30`  | Naranja-tierra |
| `0`   | Rojo |
| `300` | Púrpura |

Ejemplo — cambiar a tinte verde-oscuro:

```css
--bg:       oklch(9%  0.008 150);
--text:     oklch(93% 0.005 150);
--text-dim: oklch(88% 0.006 150);
--muted:    oklch(48% 0.01  150);
--dim:      oklch(28% 0.009 150);
--border:   oklch(17% 0.01  150);
```

### Cambiar el color de acento

El `--accent` es el único color saturado. Controla el botón CTA, los números de parada y la barra de progreso.

```css
--accent: oklch(70% 0.175 52);   /* ámbar cálido */
```

Para cambiarlo, ajusta el **matiz** (último número):

```css
--accent: oklch(70% 0.175 270);  /* índigo */
--accent: oklch(70% 0.175 145);  /* verde esmeralda */
--accent: oklch(70% 0.175 0);    /* rojo */
--accent: oklch(65% 0.20  30);   /* naranja fuerte */
```

> La luminosidad (`70%`) y el croma (`0.175`) funcionan bien para la mayoría de colores. Ajústalos si el color se ve muy oscuro o muy lavado.

---

## Paso 4 — Cambiar las fuentes

El proyecto usa dos fuentes de Google Fonts:

- **Big Shoulders Display** — para los títulos de parada.
- **Barlow** — para todo lo demás.

Para cambiarlas:

**1.** Ve a [fonts.google.com](https://fonts.google.com), elige tus fuentes y copia la URL del `<link>`.

**2.** Reemplaza la URL en el bloque `FONTS` del HTML:

```html
<link href="https://fonts.googleapis.com/css2?family=TuFuenteDisplay:wght@700&family=TuFuenteCuerpo:wght@400;500;600&display=swap" rel="stylesheet">
```

**3.** Actualiza las variables CSS en el bloque `THEME`:

```css
--font-display: 'TuFuenteDisplay', system-ui, sans-serif;
--font-body:    'TuFuenteCuerpo',  system-ui, sans-serif;
```

---

## Paso 5 — Preparar los assets

### Secuencia de imágenes

- Formato recomendado: **JPEG**, calidad 80–85%.
- Tamaño recomendado: **1920 × 1080 px** o mayor (el sistema hace cover automáticamente).
- Las imágenes deben estar numeradas de forma continua comenzando en 1: `frame_001.jpg`, `frame_002.jpg`, etc.
- Herramientas para exportar secuencias: After Effects, DaVinci Resolve, Blender.

### Videos de parada

- Formato recomendado: **MP4 (H.264)**.
- Deben ser **sin audio** (o con audio desactivado, el player los pone en mute de todas formas).
- Resolución recomendada: **1920 × 1080 px**.
- Duración: entre **5 y 20 segundos** — el usuario puede saltarlos con cualquier gesto.
- Usa nombres en minúsculas: `video-01.mp4`, no `Video-01.mp4`.

### Video de intro (opcional)

Mismas especificaciones que los videos de parada. Se reproduce una sola vez al cargar la página.

---

## Paso 6 — Probar en local

No puedes abrir `index.html` directamente haciendo doble clic — el navegador bloqueará la carga de las imágenes por seguridad.

Necesitas un servidor local. La forma más simple:

### Con VS Code

1. Instala la extensión **Live Server**.
2. Haz clic derecho en `index.html` → "Open with Live Server".
3. Se abrirá en `http://localhost:5500`.

### Con Python (si lo tienes instalado)

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Python 3
python -m http.server 8080
```

Luego abre `http://localhost:8080` en el navegador.

---

## Paso 7 — Publicar en GitHub Pages

1. Crea un repositorio en [github.com](https://github.com).
2. Sube todos los archivos (incluyendo la carpeta `content/`).
3. Ve a **Settings → Pages → Branch** y selecciona `main` (o `master`) desde la raíz `/`.
4. Espera ~1 minuto y tu sitio estará en `https://tu-usuario.github.io/nombre-repo/`.

> **Advertencia de tamaño:** si la carpeta `content/` supera ~1 GB, GitHub puede rechazar el push. Comprime bien los videos y las imágenes antes de subir.

---

## Errores frecuentes

### Las imágenes no cargan / la barra de carga se queda al 0%

- Verifica que los nombres de los archivos coincidan exactamente con `frameDir + framePrefix + número + frameExt` del config.
- Verifica que estás usando un servidor local (no abriendo el archivo directamente).
- Abre las herramientas de desarrollo del navegador (F12 → Consola) para ver el error específico.

### El video no se reproduce

- Verifica que la ruta en `stops[n].video` es correcta.
- El archivo debe ser MP4 (H.264). WebM también funciona pero tiene menor compatibilidad en Safari.
- En móvil, los videos **deben estar en mute** para reproducirse automáticamente. La plantilla ya los pone en mute.

### El texto o el video se ven "estirados"

- Las imágenes y los videos se recortan automáticamente para llenar la pantalla (comportamiento `cover`). Si el recorte no te gusta, ajusta la resolución o el encuadre del asset original.

### En móvil se ve diferente al escritorio

- La barra del nav colapsa en móvil (solo quedan el brand y el CTA).
- El texto se mueve a `left: 24px` con ancho automático.
- Esto es comportamiento esperado y está definido en los media queries del CSS.

### Los cambios en GitHub Pages no se reflejan inmediatamente

- Espera 1–2 minutos después del push.
- Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R).

---

## Referencia rápida del config

```json
{
  "brand": "NOMBRE DEL PROYECTO",

  "nav": {
    "links": [
      { "label": "Link 1", "href": "#" },
      { "label": "Link 2", "href": "#" }
    ],
    "cta": { "label": "Botón", "href": "#" }
  },

  "totalFrames": 360,
  "frameDir":    "content/images/sequence/",
  "framePrefix": "frame_",
  "framePad":    3,
  "frameExt":    ".jpg",

  "intro": "content/videos/intro.mp4",

  "stops": [
    { "frame": 0,   "video": "content/videos/video-01.mp4", "num": "01", "label": "Título", "body": "Descripción." },
    { "frame": 60,  "video": "content/videos/video-02.mp4", "num": "02", "label": "Título", "body": "Descripción." },
    { "frame": 120, "video": "content/videos/video-03.mp4", "num": "03", "label": "Título", "body": "Descripción." }
  ]
}
```

---

## Referencia rápida de navegación

| Dispositivo | Avanzar | Retroceder |
|---|---|---|
| Mouse (scroll) | Scroll abajo | Scroll arriba |
| Trackpad | Deslizar abajo | Deslizar arriba |
| Touch | Swipe arriba | Swipe abajo |
| Teclado | `↓` `→` `Space` `PageDown` | `↑` `←` `PageUp` |
| Arrastre | Arrastrar a la izquierda | Arrastrar a la derecha |

Cualquier gesto mientras un video está reproduciéndose lo interrumpe y continúa la navegación.

---

*Archivo generado para el proyecto FORMA — plantilla de landing cinematic.*
