@AGENTS.md

# PROJECT CONTEXT — BERNY DEV Portfolio

> Este archivo es para ser leído por Claude al inicio de cada sesión. Conciso, denso, útil.

---

## Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js | ^15.5.13 |
| UI | React | ^18.3.1 |
| Lenguaje | TypeScript | ^5 |
| Estilos | Tailwind CSS v4 | ^4 |
| Animaciones 2D | Framer Motion | ^12.38.0 |
| Animaciones 3D | React Three Fiber + Drei | ^9.5 / ^10.7 |
| 3D Engine | Three.js | ^0.183.2 |
| Animaciones imperativas | GSAP | ^3.14.2 |
| Font | Inter (Google Fonts) | — |

**Scripts:** `next dev` / `next build` / `next start` / `eslint`  
**Alias de path:** `@/*` → `./*`  
**Modo:** `strict: true`, `noEmit: true`, `moduleResolution: bundler`

---

## Estructura de Carpetas

```
portfolio-pro/
├── app/
│   ├── layout.tsx          # Root layout — metadata, BodyWrapper, Inter font
│   ├── page.tsx            # Home: ScrollProgress + Navbar + 4 secciones
│   ├── globals.css         # CSS vars, keyframes, scrollbar, selección
│   └── projects/
│       └── page.tsx        # /projects route — usa ProjectsPage
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ProjectsPage.tsx
│   ├── ContactSection.tsx
│   ├── ScrollProgress.tsx
│   └── BodyWrapper.tsx
└── public/
    └── bernydev/
        ├── logosinfondo.png    # Logo navbar
        ├── bernydevhero.png    # Hero image
        └── logoconfondo.png    # Favicon
```

---

## Componentes Principales

### `app/layout.tsx`
- Metadata: título, favicon (`/bernydev/logoconfondo.png`)
- Font: Inter con variable `--font-inter`
- Envuelve children en `<BodyWrapper>`
- Body: `bg: #0A0A0F`, `text-white`, `scroll-behavior: smooth`

### `app/page.tsx`
Orden de renderizado:
1. `<ScrollProgress />`
2. `<Navbar />`
3. `<HeroSection />` → `id="hero"`
4. `<AboutSection />` → `id="about"`
5. `<ProjectsSection />` → (no tiene id explícito)
6. `<ContactSection />` → `id="contact"`

### `components/Navbar.tsx`
- Fixed, detecta scroll > 50px → aplica backdrop-blur
- Logo: `/bernydev/logosinfondo.png`
- Links: Inicio (`/`), Sobre Mí (`#about`), Proyectos (`/projects`), Contacto (`#contact`)
- Mobile: hamburger con overlay, animado con AnimatePresence
- FM: navbar `y: -80→0` on mount; mobile menu `x: 100%→0`; underline `scaleX: 0→1` on hover

### `components/HeroSection.tsx`
- `id="hero"`
- Background image con gradients overlay
- Glow orbs decorativos
- FM: h1 `y:30→0`, p `y:20→0`, CTA `whileHover scale:1.05`

### `components/AboutSection.tsx`
- `id="about"`
- Layout 2 columnas (lg): izquierda sticky (avatar + conector + serpiente 3D), derecha scroll
- Avatar 380×380px con glow pulsante (`/avatar/avatar.png`)
- **Serpiente 3D con React Three Fiber**: 45 segmentos, `SerpentChain`, `SpineConnector`, `EnergyTrail`, `SheddingParticles` (cada 600ms), `SceneLighting`
- 3D cards con `rotateX`/`rotateY` al hover usando `useMotionValue` + `useTransform`
- FM: `useInView` para entrada de cada bloque; avatar float `y:[0,-12,0]` 5s infinite

### `components/ProjectsSection.tsx`
- Grid 2×2 de 4 project cards
- Botón "Ver Todos" → `/projects`
- Cards con `rotateX`/`rotateY` via `useSpring` al hover
- FM: cards `opacity:0, y:100, scale:0.9` → `opacity:1, y:0, scale:1`; orbs flotantes con `animate` sequences 10s–15s
- Parallax via `useScroll()` con `offset`

### `components/ProjectsPage.tsx`
- Ruta `/projects`
- Grid 3 columnas, 7 project cards
- Demo + GitHub buttons visibles al hover
- FM: `whileInView`, stagger en cards

### `components/ContactSection.tsx`
- `id="contact"`
- 5 tarjetas de contacto: WhatsApp, Instagram, GitHub, Gmail + 1 más
- Links reales del dev (wa.me/5492265456, @berny013_, lucasbernalb)
- FM: `whileHover scale:1.05`, `whileTap scale:0.98`; entrada staggered (delay 0.4 + i*0.1s)

### `components/ScrollProgress.tsx`
- Progress bar top: `scaleX` via `useSpring(scrollYProgress)` (stiffness 100, damping 30)
- Zigzag line derecha: SVG `pathLength` animado via `useSpring`
- 4 nodos de sección con dot pulsante e label
- Posiciones: hero 0.1 / about 0.35 / projects 0.65 / contact 0.9

---

## IDs de Secciones

| Sección | ID | Posición en ScrollProgress |
|---------|----|-----------------------------|
| Hero | `hero` | 0.1 |
| About | `about` | 0.35 |
| Projects | *(sin id explícito)* | 0.65 |
| Contact | `contact` | 0.9 |

> **IMPORTANTE:** `ProjectsSection` no tiene `id` en el DOM. ScrollProgress infiere su posición por scroll ratio, no por elemento.

---

## Patrones de Animación (Framer Motion)

### Entrada estándar (fade + slide up)
```tsx
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Con scroll (`whileInView`)
```tsx
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, delay: 0.2 }}
```

### Spring suave (progress, position)
```tsx
useSpring(value, { stiffness: 100, damping: 30 }) // progress bar
```

### Float infinito
```tsx
animate={{ y: [0, -12, 0] }}
transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
```

### 3D card hover
```tsx
// useMotionValue(0) + useTransform para rotateX/rotateY
// basado en mousePos relativo al card
style={{ rotateX, rotateY, transformPerspective: 1000 }}
```

---

## Convenciones de Código

- Todos los componentes son `"use client"` (no hay Server Components por ahora)
- Imports: Framer Motion de `"framer-motion"`, Three.js de `@react-three/fiber` y `@react-three/drei`
- Nombres: PascalCase para componentes, camelCase para estado/handlers
- Tailwind v4: sin `tailwind.config.ts` — configuración via CSS (`@import "tailwindcss"`)
- CSS vars en `globals.css`: `--background`, `--surface`, `--primary`, `--secondary`, `--glow`
- `useInView` de Framer Motion para entrada de secciones (no IntersectionObserver manual)
- `useScroll()` + `useTransform()` para parallax, siempre con `target` ref cuando es local

---

## Design System (tokens reales)

```
Background: #0A0A0F
Surface:    #111827
Primary:    #A855F7  (violet)
Secondary:  #9333EA  (purple)
Glow:       #C084FC  (light purple)
Text:       #E5E7EB
```

Gradientes de texto: `from-violet-400 via-purple-400 to-fuchsia-400`  
Bordes: `border-violet-500/20`, `border-purple-500/30`  
Glassmorphism: `bg-white/5 backdrop-blur-sm border border-white/10`

---

## Cosas a NO Hacer

1. **No agregar `id="projects"` a ProjectsSection** sin actualizar ScrollProgress — rompe la sincronización.
2. **No usar `"use server"`** en ningún componente actual — toda la lógica es client-side.
4. **No usar `tailwind.config.ts`** — Tailwind v4 usa CSS-first config, no archivo JS/TS.
5. **No importar Three.js directamente** sin usar React Three Fiber — los hooks de `useFrame`/`useThree` requieren el canvas de R3F.
6. **No hacer `next build`** después de cambios (regla global del usuario).
7. **No mezclar GSAP con Framer Motion** en el mismo elemento — hay conflicto de transforms.
8. **No usar `motion.div` con `animate` estático + `useScroll`** sin `useTransform` como intermediario — causa re-renders.

---

## Assets Públicos

| Uso | Ruta |
|-----|------|
| Logo navbar | `/bernydev/logosinfondo.png` |
| Hero image | `/bernydev/bernydevhero.png` |
| Favicon | `/bernydev/logoconfondo.png` |
| Avatar | `/avatar/avatar.png` |
