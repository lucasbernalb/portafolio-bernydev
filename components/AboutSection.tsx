"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useTransform, useInView, useScroll } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Image from "next/image";

const capabilities = [
  {
    title: "Desarrollo Full Stack",
    description: "Soluciones de extremo a extremo con las mejores prácticas de arquitectura y código limpio.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Tecnologías de Vanguardia",
    description: "Implementando herramientas de última generación para crear experiencias digitales que marquen la diferencia.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Rendimiento Premium",
    description: "Aplicaciones ultrarrápidas optimizadas al máximo para que cada interacción se sienta fluida e instantánea.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Dirección Creativa",
    description: "Donde la precisión técnica se encuentra con la visión estética para entregar resultados que destacan.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

const skills = [
  { name: "Ingeniería Frontend", level: "Experto", description: "React, Next.js, animaciones, sistemas de UI" },
  { name: "Backend & APIs", level: "Avanzado", description: "Node.js, bases de datos, arquitectura escalable" },
  { name: "Stack Moderno", level: "Avanzado", description: "Herramientas de última generación integradas al workflow" },
  { name: "3D & Interactivo", level: "Intermedio", description: "Three.js, WebGL, experiencias inmersivas" },
  { name: "Rendimiento", level: "Avanzado", description: "Optimización, renderizado, velocidad UX" },
  { name: "Dirección Creativa", level: "Avanzado", description: "Diseño, branding, identidad visual" },
];

function SectionLabel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-4"
    >
      <motion.span
        className="w-12 h-px bg-gradient-to-r from-transparent to-violet-500"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <span className="text-xs font-medium tracking-[0.3em] uppercase text-violet-400">
        Sobre Mí
      </span>
    </motion.div>
  );
}

function SectionTitle({ title }: { title: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4"
    >
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-500">
        {title}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-zinc-800/50" />
    </motion.div>
  );
}

function AvatarContainer() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mx-auto"
      style={{ width: 380, height: 380 }}
    >
      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full"
      >
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: [
              "0 0 60px rgba(168, 85, 247, 0.25), 0 0 120px rgba(168, 85, 247, 0.1)",
              "0 0 80px rgba(168, 85, 247, 0.4), 0 0 150px rgba(168, 85, 247, 0.15)",
              "0 0 60px rgba(168, 85, 247, 0.25), 0 0 120px rgba(168, 85, 247, 0.1)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="absolute inset-0 rounded-3xl p-[3px] bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-600 animate-gradient-flow">
          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            <Image
              src="/avatar/avatar.png"
              alt="Berny Dev"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-600/40 via-transparent to-fuchsia-600/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(168,85,247,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(244,63,94,0.15),transparent_50%)]" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2"
      >
        {/* Badge principal */}
        <div className="px-5 py-2.5 rounded-full bg-zinc-900/90 backdrop-blur border border-zinc-800 flex items-center gap-2">
          {/* Punto verde con glow y partículas */}
          <div className="relative">
            {/* Partículas flotantes */}
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-emerald-400"
              animate={{
                x: [-4, -6, -4],
                y: [-2, -4, -2],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-emerald-400"
              animate={{
                x: [4, 6, 4],
                y: [2, 4, 2],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute w-0.5 h-0.5 rounded-full bg-emerald-300"
              animate={{
                x: [-2, -4, -2],
                y: [3, 5, 3],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1 }}
            />
            <motion.div
              className="absolute w-0.5 h-0.5 rounded-full bg-emerald-300"
              animate={{
                x: [2, 4, 2],
                y: [-3, -5, -3],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
            />
            
            {/* Punto central verde */}
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-emerald-400"
              animate={{
                boxShadow: [
                  "0 0 8px rgba(52, 211, 153, 0.8), 0 0 16px rgba(52, 211, 153, 0.4)",
                  "0 0 12px rgba(52, 211, 153, 1), 0 0 24px rgba(52, 211, 153, 0.6)",
                  "0 0 8px rgba(52, 211, 153, 0.8), 0 0 16px rgba(52, 211, 153, 0.4)",
                ],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <span className="text-xs font-medium text-zinc-400">Disponible para trabajar</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VisualConnector() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="relative flex items-center justify-center py-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-violet-500/10 blur-lg" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-500/60" />
      <motion.div
        ref={ref}
        className="w-px h-16 bg-gradient-to-b from-transparent via-violet-500/40 to-transparent"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </div>
  );
}

function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return "#" + c1.lerp(c2, t).getHexString();
}

function SerpentSegment({ x, y, z, radius, colorT, index }: {
  x: number;
  y: number;
  z: number;
  radius: number;
  colorT: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phaseOffset = index * 0.15;

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (meshRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.5 + phaseOffset) * 0.15 + 1;
      meshRef.current.scale.setScalar(breathe);
    }
  });

  const color = interpolateColor("#7c3aed", "#c084fc", colorT);

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[radius, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8 + colorT * 0.2}
      />
    </mesh>
  );
}

function SpineConnector() {
  return (
    <mesh>
      <cylinderGeometry args={[0.012, 0.012, 4.5, 8]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={0.4}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function SerpentChain() {
  const segments = 45;
  const curveHeight = 4.5;

  const segmentPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const y = (t - 0.5) * curveHeight;
      const waveOffset = Math.sin(t * Math.PI * 3) * 0.08;
      const x = waveOffset;
      const z = Math.cos(t * Math.PI * 2) * 0.08;
      const scaleFactor = t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 1;
      const radius = 0.07 * scaleFactor;
      positions.push({ x, y, z, radius, colorT: t, index: i });
    }
    return positions;
  }, []);

  return (
    <group>
      <SpineConnector />
      {segmentPositions.map((seg) => (
        <SerpentSegment key={seg.index} {...seg} />
      ))}
    </group>
  );
}

function EnergyTrail() {
  const pointsRef = useRef<THREE.Points>(null);

  const trailPositions = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segCount = 60;
    for (let i = 0; i < segCount; i++) {
      const t = i / (segCount - 1);
      const y = (t - 0.5) * 4.5;
      const waveOffset = Math.sin(t * Math.PI * 3) * 0.08;
      pts.push(new THREE.Vector3(waveOffset, y, 0.02));
    }
    return pts;
  }, []);

  const positionArray = useMemo(() => {
    return new Float32Array(trailPositions.flatMap(p => [p.x, p.y, p.z]));
  }, [trailPositions]);

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const t = i / positions.length;
        positions[i] += Math.sin(state.clock.elapsedTime * 2 + t * 10) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#c084fc"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function AnimatedSerpent() {
  const groupRef = useRef<THREE.Group>(null);

  // Rotación muy sutil siguiendo al cursor
  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <SerpentChain />
      <EnergyTrail />
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.2} color="#1a1a2e" />
      <pointLight position={[0, 2, 2]} intensity={1} color="#a855f7" distance={6} />
      <pointLight position={[0, -2, 2]} intensity={0.6} color="#c084fc" distance={5} />
      <pointLight position={[-2, 0, 1]} intensity={0.4} color="#7c3aed" distance={4} />
    </>
  );
}

function EnergySpine({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const yOffset = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{ y: yOffset }}
      className="relative w-full h-full"
    >
      {/* Fallback background - ALWAYS visible */}
      <div className="absolute inset-0 bg-violet-500/10 rounded-2xl flex items-center justify-center">
        <div className="w-3 h-48 rounded-full bg-gradient-to-b from-violet-600 via-purple-500 to-fuchsia-600 animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.6)]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-32 h-64 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{
            background: "linear-gradient(to top, rgba(168, 85, 247, 0.4), transparent)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 2.4], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneLighting />
        <AnimatedSerpent />
      </Canvas>
    </motion.div>
  );
}

function Headline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.h2
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
    >
      <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
        Soy Berny.
      </span>
      <br />
      <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
        Artista de corazón, developer por pasión.
      </span>
      <br />
      <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
        Cada web que hago es una pieza irrepetible.
      </span>
    </motion.h2>
  );
}

function CapabilityCard({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.02,
        borderColor: "rgba(168, 85, 247, 0.5)",
      }}
      className="group relative p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 transition-all duration-300"
    >
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600/0 to-fuchsia-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
      />

      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center text-violet-400 mb-4">
          {icon}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-100 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function CapabilityGrid() {
  const ref = useRef(null);

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {capabilities.map((cap, index) => (
        <CapabilityCard
          key={cap.title}
          title={cap.title}
          description={cap.description}
          icon={cap.icon}
          index={index}
        />
      ))}
    </div>
  );
}

function SkillCard({
  skill,
  index,
}: {
  skill: (typeof skills)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setMousePos({ x: 0.5, y: 0.5 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{
        scale: 1.03,
        y: -4,
        borderColor: "rgba(168, 85, 247, 0.6)",
        boxShadow: "0 0 50px rgba(168, 85, 247, 0.25), 0 12px 40px rgba(0,0,0,0.4)",
      }}
      className="relative p-6 rounded-xl bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 overflow-hidden cursor-pointer group perspective-1000"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10" />
      
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(168, 85, 247, 0.2) 0%, transparent 60%)`,
        }}
      />

      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-violet-100 transition-colors">
          {skill.name}
        </h3>

        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-4">
          {skill.level}
        </span>

        <p className="text-sm text-zinc-500 group-hover:text-zinc-400 group-hover:translate-y-0 translate-y-1 transition-all duration-300 leading-relaxed">
          {skill.description}
        </p>
      </div>
    </motion.div>
  );
}

function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {skills.map((skill, index) => (
        <SkillCard key={skill.name} skill={skill} index={index} />
      ))}
    </div>
  );
}

function ClosingPhrase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="relative pt-12"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

      <div className="flex items-start gap-4">
        <div className="w-1 h-full min-h-[48px] bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
        <p className="text-lg md:text-xl text-zinc-300 italic leading-relaxed">
          Diseñar es mi esencia, programar es mi herramienta. Cada línea de código es una decisión creativa.
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  return (
    <section
      id="about"
      className="relative py-32 lg:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.02]">
          <defs>
            <pattern id="about-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
      </div>

      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[160px]" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[160px]" />

      <div ref={containerRef} className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20 items-start">

          {/* LEFT SIDE (FIXED VISUAL COLUMN) */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 min-h-[100vh] flex flex-col justify-between">

            {/* Avatar */}
            <div className="flex-shrink-0">
              <AvatarContainer />
            </div>

            {/* Connector */}
            <div className="flex items-center justify-center py-6">
              <VisualConnector />
            </div>

            {/* Energy Spine - Serpent */}
            <div className="w-full h-[900px] flex items-center justify-center">
              <EnergySpine scrollYProgress={scrollYProgress} />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-3 max-w-xl">
            <div className="space-y-16">

              <div className="space-y-6">
                <SectionLabel />
                <Headline />
              </div>

              <div className="space-y-6">
                <SectionTitle title="Lo Que Hago" />
                <CapabilityGrid />
              </div>

              <div className="space-y-6">
                <SectionTitle title="Experiencia" />
                <SkillsGrid />
              </div>

              <div className="space-y-6">
                <SectionTitle title="Mi Filosofía" />
                <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
                  <p className="text-zinc-300 leading-relaxed">
                    <span className="text-violet-400 font-medium">Imagino. Adapto.</span> No busco lo genérico — cada web que hago tiene identidad propia, es una pieza irrepetible.
                  </p>
                </div>
              </div>

              <ClosingPhrase />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}