"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { TorusKnot, Float } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 8,
      size: 2 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-gradient-to-b from-violet-500/60 to-transparent rounded-full animate-drift-up"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 3,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function BackgroundImage() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <Image
        src="/bernydev/bernydevhero.png"
        alt=""
        fill
        className="object-cover opacity-[0.12] blur-[3px] scale-110"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/90 to-[#0A0A0F]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-[#0A0A0F]/80" />
    </div>
  );
}

// 🔥 PARALLAX REAL (logo fijo)
function BackgroundLogo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[1]">
      <div className="relative w-[700px] h-[700px] opacity-[0.04]">
        <Image
          src="/bernydev/logosinfondo.png"
          alt=""
          fill
          className="object-contain blur-[6px]"
          priority
        />
      </div>
    </div>
  );
}

function GlowOrbs({ mouseX, mouseY }) {
  return (
    <>
      <motion.div
        className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-violet-600/15 rounded-full blur-[120px] z-[2]"
        style={{ x: mouseX, y: mouseY }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] z-[2]"
        style={{ x: mouseX, y: mouseY }}
      />
    </>
  );
}

function AnimatedGeometry() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <TorusKnot ref={meshRef} args={[0.8, 0.25, 100, 16]} scale={1.2}>
        <meshStandardMaterial
          color="#A855F7"
          emissive="#A855F7"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </TorusKnot>
    </Float>
  );
}

function Scene3D() {
  return (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[400px] h-[400px] z-[3] hidden lg:block">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#A855F7" />
        <AnimatedGeometry />
      </Canvas>
    </div>
  );
}

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const move = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 40 - 20);
      mouseY.set((e.clientY / window.innerHeight) * 40 - 20);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]"
    >
      <BackgroundImage />
      <BackgroundLogo />
      <Particles />
      <GlowOrbs mouseX={smoothX} mouseY={smoothY} />
      <Scene3D />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              className="text-6xl md:text-8xl font-black leading-[0.9]"
            >
              <span className="bg-gradient-to-b from-white to-violet-200 bg-clip-text text-transparent">
                BERNY
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                DEV
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              className="text-lg text-zinc-400"
            >
              Full Stack Developer crafting modern web experiences powered by{" "}
              <span className="text-violet-400">AI</span>
            </motion.p>
          </div>

          <div className="flex-1 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}