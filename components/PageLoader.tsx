"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [phase, setPhase] = useState<"initial" | "logo-in" | "fade-out">("initial");
  const [isComplete, setIsComplete] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detectar preferencia de movimiento reducido
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, saltamos el loader
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Secuencia de animaciones
    const timers: NodeJS.Timeout[] = [];

    // Fase 1: Logo aparece con fade-in + scale (100ms después de mount)
    timers.push(
      setTimeout(() => {
        setPhase("logo-in");
      }, 150)
    );

    // Fase 2: Loader comienza a desvanecerse y el logo transiciona
    timers.push(
      setTimeout(() => {
        setPhase("fade-out");
      }, 1200)
    );

    // Fase 3: Notificar que terminó
    timers.push(
      setTimeout(() => {
        setIsComplete(true);
        onComplete();
      }, 1500)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete, prefersReducedMotion]);

  // Si prefiere movimiento reducido, no renderizamos nada
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0F]"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "fade-out" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.4, 0, 0.2, 1] 
          }}
          style={{ 
            pointerEvents: phase === "fade-out" ? "none" : "all",
            // Prevenir scroll durante el loader
            overflow: "hidden"
          }}
        >
          {/* Logo del loader con animación de entrada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ 
              opacity: phase === "logo-in" ? 1 : 0, 
              scale: phase === "logo-in" ? 1 : 0.95, 
              y: phase === "logo-in" ? 0 : -10 
            }}
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1], // spring-like easing
            }}
          >
            {/* Wrapper con layoutId para la transición hacia navbar */}
            <motion.div
              layoutId="logo-loader"
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
                mass: 0.8,
              }}
            >
              <Logo
                animate={phase !== "initial"}
                showCursor={phase === "logo-in"}
                imageClassName="brightness-110"
              />
            </motion.div>
          </motion.div>

          {/* Efecto glow ambiental detrás del logo */}
          <motion.div
            className="absolute w-40 h-40 rounded-full pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: phase === "logo-in" ? 1 : 0,
              scale: phase === "logo-in" ? [1, 1.3, 1] : 1,
              background: [
                "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Anillo decorativo sutil */}
          <motion.div
            className="absolute w-64 h-64 rounded-full border border-violet-500/10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: phase === "logo-in" ? [0.3, 0.6, 0.3] : 0,
              scale: phase === "logo-in" ? [1, 1.1, 1] : 1,
              rotate: 360,
            }}
            transition={{
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
