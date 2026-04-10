"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

// ─── types & constants ────────────────────────────────────────────────────────

type Waypoint = { x: number; y: number }; // vw / vh units
type Section  = "hero" | "about" | "projects" | "contact";

const NODES: Record<Section, Waypoint> = {
  hero:     { x: 68, y: 44 },
  about:    { x: 88, y: 32 },
  projects: { x: 10, y: 52 },
  contact:  { x: 82, y: 58 },
};

// Rutas explícitas de IDA y VUELTA (mismo flujo, sin invertir)
const ROUTES_FORWARD: Record<string, Waypoint[]> = {
  "hero→about":    [{ x:68,y:44 }, { x:92,y:15 }, { x:88,y:32 }],
  "about→projects":[{ x:88,y:32 }, { x:95,y:55 }, { x:55,y:75 }, { x:10,y:52 }],
  "projects→contact":[{ x:10,y:52 }, { x:5, y:75 }, { x:40,y:85 }, { x:82,y:58 }],
};

const ROUTES_BACKWARD: Record<string, Waypoint[]> = {
  "contact→projects": [{ x:82,y:58 }, { x:40,y:85 }, { x:55,y:75 }, { x:10,y:52 }],
  "projects→about":   [{ x:10,y:52 }, { x:5, y:75 }, { x:40,y:85 }, { x:82,y:58 }],
  "about→hero":       [{ x:88,y:32 }, { x:92,y:15 }, { x:68,y:44 }],
};

// Secciones donde la serpiente va por DETRÁS (depth mode) cuando transita
const DEPTH_TRANSIT_SECTIONS: Section[] = ["about", "projects"];

// Secciones donde la serpiente va por DELANTE (foreground) cuando está quieta
const FOREGROUND_IDLE_SECTIONS: Section[] = ["hero", "contact"];

// Orden del flujo para determinar dirección (forward = hacia adelante, backward = hacia atrás)
const SECTION_ORDER: Section[] = ["hero", "about", "projects", "contact"];

const SEGMENT_SIZES  = [28,26,24,22,20,18,16,14,12,10,8,6];
const SEGMENT_COUNT  = SEGMENT_SIZES.length; // 12
const SEGMENT_COLORS = [
  ...Array(4).fill("linear-gradient(to bottom, #8b5cf6, #7c3aed)"),
  ...Array(4).fill("linear-gradient(to bottom, #a855f7, #8b5cf6)"),
  ...Array(4).fill("linear-gradient(to bottom, #d946ef, #a855f7)"),
];

// FIX 1: real positional trail
const SEGMENT_SPACING_FRAMES = 4; // history frames between adjacent segments
const HISTORY_SIZE = SEGMENT_COUNT * SEGMENT_SPACING_FRAMES + SEGMENT_COUNT; // 60

const PARTICLE_SURFACE = ["#7c3aed","#a855f7","#c084fc"] as const;
const PARTICLE_DEPTH   = ["#1a1a2e","#16213e","#0f3460"] as const;

// ─── helpers ─────────────────────────────────────────────────────────────────

function toPixels(wp: Waypoint) {
  return {
    px: (wp.x / 100) * window.innerWidth,
    py: (wp.y / 100) * window.innerHeight,
  };
}

function getRoute(from: Section, to: Section, isBackward: boolean): Waypoint[] {
  const key = `${from}→${to}`;
  const routes = isBackward ? ROUTES_BACKWARD : ROUTES_FORWARD;
  if (routes[key]) return routes[key];
  return [NODES[from], NODES[to]];
}

/**
 * FIX 2: proximity-based advancement, min 1200ms per leg.
 * No longer sets head rotation (RAF handles it from actual delta).
 */
function runRoute(
  waypoints: Waypoint[],
  posX: MotionValue<number>,
  posY: MotionValue<number>,
  smoothX: MotionValue<number>,
  smoothY: MotionValue<number>,
  onComplete: () => void
): () => void {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const step = (idx: number) => {
    if (cancelled) return;
    if (idx >= waypoints.length) { onComplete(); return; }

    const { px, py } = toPixels(waypoints[idx]);
    posX.set(px);
    posY.set(py);

    // Wait 1200ms minimum, then poll every 50ms until within 15px
    const waitThenCheck = () => {
      if (cancelled) return;
      const dist = Math.hypot(px - smoothX.get(), py - smoothY.get());
      if (dist < 15) {
        timer = setTimeout(() => step(idx + 1), 80);
      } else {
        timer = setTimeout(waitThenCheck, 50);
      }
    };
    timer = setTimeout(waitThenCheck, 1200);
  };

  step(1); // index 0 is starting position — skip it
  return () => { cancelled = true; if (timer) clearTimeout(timer); };
}

// ─── SnakeParticles ───────────────────────────────────────────────────────────

function SnakeParticles({ active, depthMode }: { active: boolean; depthMode: boolean }) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string; delay: number }>
  >([]);

  const colors   = depthMode ? PARTICLE_DEPTH   : PARTICLE_SURFACE;
  const maxOpac  = depthMode ? 0.3  : 0.7;
  const maxCount = depthMode ? 4    : 8;
  const travelY  = depthMode ? 40   : 80;
  const duration = depthMode ? 4    : 3;
  const minSize  = depthMode ? 2    : 3;
  const maxSize  = depthMode ? 3    : 4;
  const intMs    = depthMode ? 800  : 600;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles([]);
    if (!active) return;
    const id = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-maxCount),
        {
          id:    Date.now() + Math.random(),
          x:     (Math.random() - 0.5) * 80,
          y:     (Math.random() - 0.5) * 80,
          size:  minSize + Math.random() * (maxSize - minSize),
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
        },
      ]);
    }, intMs);
    return () => clearInterval(id);
  }, [active, depthMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null;
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{ width: p.size, height: p.size, background: p.color, left: "50%", top: "50%" }}
          initial={{ x: p.x, y: p.y, opacity: maxOpac }}
          animate={{ y: [p.y, p.y - travelY], opacity: [maxOpac, 0] }}
          transition={{ duration, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

// ─── SnakeHead ────────────────────────────────────────────────────────────────

function SnakeHead({ mouseX, mouseY, isMoving }: {
  mouseX: number; mouseY: number; isMoving: boolean;
}) {
  const irisX  = useMotionValue(0);
  const irisY  = useMotionValue(0);
  const sIrisX = useSpring(irisX, { stiffness: 150, damping: 20 });
  const sIrisY = useSpring(irisY, { stiffness: 150, damping: 20 });
  const hX     = useMotionValue(0);
  const hY     = useMotionValue(0);
  const sHX    = useSpring(hX, { stiffness: 150, damping: 20 });
  const sHY    = useSpring(hY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (isMoving) {
      irisX.set(-2); irisY.set(0); hX.set(0); hY.set(0);
    } else {
      irisX.set(Math.max(-3, Math.min(3, (mouseX - 0.5) * 8)));
      irisY.set(Math.max(-3, Math.min(3, (mouseY - 0.5) * 6)));
      hX.set((mouseX - 0.5) * 15);
      hY.set((mouseY - 0.5) * 10);
    }
  }, [mouseX, mouseY, isMoving, irisX, irisY, hX, hY]);

  const tongueAngle  = isMoving ? 0  : (0.5 - mouseX) * 40;
  const tongueLength = isMoving ? 18 : Math.max(10, Math.abs(0.5 - mouseX) * 35);

  return (
    <motion.div className="relative" style={{ x: sHX, y: sHY }}>
      <div className="w-20 h-14 rounded-full bg-gradient-to-br from-violet-500 via-violet-600 to-purple-600 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
        <div className="absolute top-2 left-3 w-6 h-4 rounded-full bg-white/20 blur-sm" />
        <div className="absolute top-4 left-3 w-4 h-5 bg-white rounded-full overflow-hidden">
          <motion.div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full" style={{ x: sIrisX, y: sIrisY }} />
        </div>
        <div className="absolute top-4 right-3 w-4 h-5 bg-white rounded-full overflow-hidden">
          <motion.div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full" style={{ x: sIrisX, y: sIrisY }} />
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-1 h-1 bg-violet-800/50 rounded-full" />
          <div className="w-1 h-1 bg-violet-800/50 rounded-full" />
        </div>
      </div>
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-red-500 to-red-600 rounded-b-full origin-top"
        style={{ transform: `rotate(${tongueAngle}deg)`, height: `${tongueLength}px` }}
      >
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 -rotate-[30deg]">
          <div className="w-1 h-2 bg-red-500 rounded-full" />
          <div className="w-1 h-2 bg-red-500 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── FloatingSnake ────────────────────────────────────────────────────────────

export default function FloatingSnake() {
  const [mouseX, setMouseX]       = useState(0.5);
  const [mouseY, setMouseY]       = useState(0.5);
  const [isIdle, setIsIdle]       = useState(false);
  const [isMoving, setIsMoving]   = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [depthMode, setDepthMode] = useState(false);
  const [zDepth, setZDepth]       = useState(false);

  // FIX 2: softer spring for organic feel
  const posX    = useMotionValue(0);
  const posY    = useMotionValue(0);
  const smoothX = useSpring(posX, { stiffness: 35, damping: 20 });
  const smoothY = useSpring(posY, { stiffness: 35, damping: 20 });

  // FIX 3: rotation spring
  const headRotValue   = useMotionValue(0);
  const headRot        = useSpring(headRotValue, { stiffness: 60, damping: 18 });
  const headScaleValue = useMotionValue(1);
  const headScale      = useSpring(headScaleValue, { stiffness: 300, damping: 20 });

  const currentSectionRef = useRef<Section>("hero");
  const abortRouteRef     = useRef<(() => void) | null>(null);
  const idleTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const positionHistory   = useRef<Array<{ x: number; y: number }>>([]);
  const bodyRefs          = useRef<Array<HTMLDivElement | null>>([]);
  const isIdleRef         = useRef(false);
  const isMovingRef       = useRef(false);
  const lastSectionChange = useRef(0);
  const segCurrentPos     = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: SEGMENT_COUNT }, () => ({ x: 0, y: 0 }))
  );
  const prevHeadPos  = useRef({ x: 0, y: 0 });
  const inDepthRef   = useRef(false); // guard for emerge bounce
  const isBackwardRef = useRef(false); // true = yendo hacia atrás en el flujo

  // ── Init ──
  useEffect(() => {
    const { px, py } = toPixels(NODES.hero);
    posX.set(px); posY.set(py);
    positionHistory.current = Array.from({ length: HISTORY_SIZE }, () => ({ x: px, y: py }));
    segCurrentPos.current.forEach((p) => { p.x = px; p.y = py; });
    prevHeadPos.current = { x: px, y: py };
    bodyRefs.current.forEach((el) => {
      if (!el) return;
      el.style.left = `${px}px`;
      el.style.top  = `${py}px`;
    });
    idleTimerRef.current = setTimeout(() => setIsIdle(true), 2000);
  }, [posX, posY]);

  // ── Cleanup ──
  useEffect(() => () => {
    if (abortRouteRef.current) abortRouteRef.current();
    if (idleTimerRef.current)  clearTimeout(idleTimerRef.current);
    if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
  }, []);

  // ── State → refs ──
  useEffect(() => { isIdleRef.current   = isIdle;   }, [isIdle]);
  useEffect(() => { isMovingRef.current = isMoving; }, [isMoving]);

  // ── Depth mode: serpiente por detrás SIEMPRE durante tránsito por about/projects
  // Se calcula en tiempo real basado en: está moviéndose + sección destino es tránsito
  // El ref currentSectionRef se actualiza ANTES de moverse, por eso usamos isMoving para saber
  // si realmente está en tránsito o si llegó a destino
  useEffect(() => {
    // Solo calcular si hay un cambio
    if (!isMovingRef.current) return;
    
    const targetSection = currentSectionRef.current;
    if (DEPTH_TRANSIT_SECTIONS.includes(targetSection)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDepthMode(true);
      setZDepth(true); // inmediato, sin delay
    }
  }, [isMoving]);

  // ── Depth: z-index baja después de que el fade termina (800ms delay) ──
  // Solo para transiciones de surface → depth (no cuando ya estamos en depth por isMoving)
  useEffect(() => {
    if (depthMode && !isMovingRef.current) {
      const t = setTimeout(() => setZDepth(true), 800);
      return () => clearTimeout(t);
    }
    if (!depthMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZDepth(false);
    }
  }, [depthMode]);

  const moveTo = useCallback(
    (section: Section) => {
      if (section === currentSectionRef.current) return;
      const now = Date.now();
      if (now - lastSectionChange.current < 800) return; // cooldown 800ms
      lastSectionChange.current = now;
      const from = currentSectionRef.current;
      currentSectionRef.current = section;

      if (abortRouteRef.current) abortRouteRef.current();
      if (idleTimerRef.current)  clearTimeout(idleTimerRef.current);

      setIsIdle(false);
      setIsMoving(true);
      setShowBurst(false);

      // Determinar dirección en el flujo
      const fromIdx = SECTION_ORDER.indexOf(from);
      const toIdx   = SECTION_ORDER.indexOf(section);
      const isBackward = toIdx < fromIdx;
      isBackwardRef.current = isBackward;

      // Depth mode: serpiente por detrás cuando transita por about/projects
      const enterDepth = DEPTH_TRANSIT_SECTIONS.includes(section);
      setDepthMode(enterDepth);
      if (enterDepth) inDepthRef.current = true;

      abortRouteRef.current = runRoute(
        getRoute(from, section, isBackward),
        posX, posY, smoothX, smoothY,
        () => {
          setIsMoving(false);
          // Desactivar depth mode solo si estamos en una sección foreground para idle
          // (hero o contact)
          if (FOREGROUND_IDLE_SECTIONS.includes(section)) {
            setDepthMode(false);
          }
          headRotValue.set(0);

          headScaleValue.set(1.1);
          setTimeout(() => headScaleValue.set(1), 200);

          setShowBurst(true);
          if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
          burstTimerRef.current = setTimeout(() => setShowBurst(false), 3000);

          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
          idleTimerRef.current  = setTimeout(() => setIsIdle(true), 2000);
        }
      );
    },
    [posX, posY, smoothX, smoothY, headRotValue, headScaleValue]
  );

  // ── RAF loop ──
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      const hx   = smoothX.get();
      const hy   = smoothY.get();
      const prev = prevHeadPos.current;

      // FIX 1: append current head position to history
      positionHistory.current.unshift({ x: hx, y: hy });
      if (positionHistory.current.length > HISTORY_SIZE) {
        positionHistory.current.length = HISTORY_SIZE;
      }

      const idle   = isIdleRef.current;
      const moving = isMovingRef.current;
      const dx     = hx - prev.x;
      const dy     = hy - prev.y;

      // FIX 3: rotation from actual movement delta (not spring target)
      if (moving && (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3)) {
        headRotValue.set(Math.atan2(dy, dx) * (180 / Math.PI));
      } else if (idle) {
        headRotValue.set(hx > window.innerWidth / 2 ? 0 : 180);
      }

      prevHeadPos.current = { x: hx, y: hy };

      const now = Date.now();
      bodyRefs.current.forEach((el, i) => {
        if (!el) return;
        const cur = segCurrentPos.current[i];

        if (moving) {
          // FIX 1: segment N follows history[N * SPACING_FRAMES] — real path trail
          const histIdx = (i + 1) * SEGMENT_SPACING_FRAMES;
          const hp      = positionHistory.current[histIdx] ?? { x: hx, y: hy };
          cur.x += (hp.x - cur.x) * 0.2;
          cur.y += (hp.y - cur.y) * 0.2;
        } else {
          // Stationary: extend body to opposite side of screen
          const dir    = hx > window.innerWidth / 2 ? -1 : 1;
          const factor = idle ? 0.04 : 0.08;
          cur.x += (hx + dir * (i + 1) * 18 - cur.x) * factor;
          cur.y += (hy - cur.y) * factor;
        }

        // FIX 4: sinusoidal wave added to Y
        const amplitude = moving ? 8 : 3;
        const wave      = Math.sin(now * 0.003 + i * 0.5) * amplitude;

        el.style.left = `${cur.x}px`;
        el.style.top  = `${cur.y + wave}px`;
      });

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mouse tracking ──
  useEffect(() => {
    const h = (e: MouseEvent) => {
      setMouseX(e.clientX / window.innerWidth);
      setMouseY(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // ── Section detection ──
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const sections: Section[] = ["hero","about","contact"];
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(s);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          const p = scrollYProgress.get();
          if (p >= 0.45 && p <= 0.75) return;
          moveTo(s);
        },
        { threshold: 0.01 }
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [moveTo, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.45 && v < 0.75) moveTo("projects");
  });

  // ── Depth variants ──
  const depthVariants = {
    surface: { opacity: 1,    filter: "brightness(1) blur(0px)",     scale: 1    },
    depth:   { opacity: 0.18, filter: "brightness(0.4) blur(0.8px)", scale: 0.85 },
  };
  const depthState = depthMode ? "depth" : "surface";
  const zHead      = zDepth ? 1 : 50;
  const zParticles = zDepth ? 1 : 48;

  // ── Render ──
  return (
    <div className="hidden lg:block">
      {/* Particles anchored to head — depth via FM variants */}
      <motion.div
        className="fixed pointer-events-none"
        style={{ left: smoothX, top: smoothY, x: "-50%", y: "-50%", zIndex: zParticles }}
        animate={depthState}
        variants={depthVariants}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <SnakeParticles active={isIdle || showBurst} depthMode={depthMode} />
      </motion.div>

      {/* Body segments — depth via inline opacity + filter transitions */}
      {SEGMENT_SIZES.map((size, i) => (
        <div
          key={i}
          ref={(el) => { bodyRefs.current[i] = el; }}
          className="fixed rounded-full pointer-events-none"
          style={{
            width:      size,
            height:     size,
            zIndex:     zDepth ? 1 : 49 - i,
            transform:  "translate(-50%, -50%)",
            background: SEGMENT_COLORS[i],
            boxShadow:  `0 0 ${Math.max(15 - i, 2)}px rgba(139,92,246,${Math.max(0.5 - i * 0.03, 0.1).toFixed(2)})`,
            left:       0,
            top:        0,
            opacity:    depthMode ? 0.18 : 1,
            transition: "opacity 0.8s ease-in-out",
          }}
        />
      ))}

      {/* Head — depth via FM variants */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left:   smoothX,
          top:    smoothY,
          x:      "-50%",
          y:      "-50%",
          rotate: headRot,
          scale:  headScale,
          zIndex: zHead,
        }}
        initial={{ opacity: 0 }}
        animate={depthState}
        variants={depthVariants}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onAnimationComplete={(definition) => {
          // Emerge bounce: only after a real depth→surface transition
          if (definition === "surface" && inDepthRef.current) {
            inDepthRef.current = false;
            headScaleValue.set(1.05);
            setTimeout(() => headScaleValue.set(1), 200);
          }
        }}
      >
        <SnakeHead mouseX={mouseX} mouseY={mouseY} isMoving={isMoving} />
      </motion.div>
    </div>
  );
}
