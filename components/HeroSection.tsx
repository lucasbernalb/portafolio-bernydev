"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";

function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 8,
      size: 2 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-gradient-to-b from-violet-500/60 to-transparent rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size * 3,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
}

function GlowOrbs({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const orb1X = useTransform(mouseX, [-1, 1], [-30, 30]);
  const orb1Y = useTransform(mouseY, [-1, 1], [-30, 30]);
  const orb2X = useTransform(mouseX, [-1, 1], [20, -20]);
  const orb2Y = useTransform(mouseY, [-1, 1], [20, -20]);

  return (
    <>
      <motion.div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]"
        style={{ x: orb1X, y: orb1Y }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[100px]"
        style={{ x: orb2X, y: orb2Y }}
      />
      <div className="absolute top-1/2 right-1/3 w-[250px] h-[250px] bg-violet-500/10 rounded-full blur-[80px] animate-pulse-glow" />
    </>
  );
}

function FloatingImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/40 via-purple-600/30 to-violet-600/40 rounded-3xl blur-3xl scale-95 animate-pulse-glow" />
      
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="relative w-[400px] h-[500px] md:w-[450px] md:h-[560px]">
          <Image
            src="/bernydev/bernydevhero.png"
            alt="Berny Dev - Full Stack Developer"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </motion.div>

      <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-transparent to-purple-500/20 rounded-full blur-xl opacity-50" />
    </motion.div>
  );
}

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
      setMousePosition({ x: normalizedX, y: normalizedY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]"
    >
      <Particles />
      <GlowOrbs mouseX={smoothMouseX} mouseY={smoothMouseY} />

      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-[#0A0A0F] to-[#0A0A0F]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm"
            >
              <motion.span
                className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-violet-200 tracking-wide">
                Available for projects
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              <span className="bg-gradient-to-b from-white via-violet-100 to-violet-200 bg-clip-text text-transparent">
                BERNY
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-300 bg-clip-text text-transparent">
                DEV
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Full Stack Developer crafting modern web experiences powered by{" "}
              <span className="text-violet-400 font-medium">AI</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm text-zinc-500 max-w-md mx-auto lg:mx-0"
            >
              Building the future, one line of code at a time. Specializing in 
              scalable applications and intelligent systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(168,85,247,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="relative px-8 py-4 rounded-full font-semibold text-sm overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Projects
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02, borderColor: "rgba(168,85,247,0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="relative px-8 py-4 rounded-full font-medium text-sm border border-zinc-700 text-zinc-300 hover:text-white hover:border-violet-500/50 transition-all duration-300"
              >
                <span className="relative z-10">Contact</span>
              </motion.a>
            </motion.div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <FloatingImage />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-medium">
            Scroll
          </span>
          <div className="relative w-5 h-9 border border-zinc-700/50 rounded-full">
            <motion.div
              className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
