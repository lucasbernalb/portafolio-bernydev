"use client";

import { useRef, useState, memo, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "BERNALFORGE",
    category: "E-Commerce Full Stack",
    year: "2026",
    description: "Plataforma de e-commerce para venta de herramientas con gestión de inventario y pedidos",
    tags: ["Next.js", "Supabase", "TypeScript"],
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    accent: "#6366f1",
    github: "https://github.com/lucasbernalb/ECOMMERCE-BERNALFORGE",
    deploy: "https://bernalforge.vercel.app/",
    status: null,
    image: "/proyectos/bernalforge.jpg",
  },
  {
    id: 2,
    title: "Ameli Pastoreo",
    category: "Landing Page",
    year: "2026",
    description: "Landing page para venta de huevos artesanales con integración a WhatsApp para pedidos",
    tags: ["React", "Tailwind CSS", "Responsive"],
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    accent: "#f59e0b",
    github: "https://github.com/lucasbernalb/ameli-pastoreo",
    deploy: "https://ameli-pastoreo.vercel.app/",
    status: null,
    image: "/proyectos/ameli.jpg",
  },
  {
    id: 3,
    title: "Solycell",
    category: "Tienda Online",
    year: "2026",
    description: "Tienda online especializada en reparación de hardware y venta de accesorios tecnológicos",
    tags: ["Next.js", "MercadoPago", "In Progress"],
    gradient: "from-emerald-600 via-cyan-600 to-blue-600",
    accent: "#10b981",
    github: "https://github.com/lucasbernalb/solycell",
    deploy: "https://solycell.vercel.app/",
    status: "In Progress",
    image: "/proyectos/solycell.jpg",
  },
  {
    id: 4,
    title: "Reina Artura Andrea",
    category: "Galería de Arte",
    year: "2026",
    description: "Plataforma de venta de cuadros online con catálogo de obras artísticas",
    tags: ["Next.js", "Supabase", "MercadoPago"],
    gradient: "from-violet-600 via-fuchsia-600 to-purple-600",
    accent: "#8b5cf6",
    github: "https://github.com/lucasbernalb/reinaartura-andrea",
    deploy: "https://reinaartura-andrea.vercel.app/",
    status: "In Progress",
    image: "/proyectos/reinaartura.jpg",
  },
];

const MemoizedProjectCard = memo(function ProjectCard({
  project,
  index,
  scrollYProgress,
}: {
  project: (typeof projects)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, isHovered ? -5 : 0]);
  const rotateY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isHovered ? (mousePos.x - 0.5) * 15 : 0]
  );

  const glowX = useTransform(scrollYProgress, [0, 1], ["50%", `${mousePos.x * 100}%`]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["50%", `${mousePos.y * 100}%`]);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ rotateX: smoothRotateX, rotateY: smoothRotateY }}
      className="relative group cursor-pointer perspective-1000"
    >
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${project.accent}40 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-zinc-700/80">
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, ${project.accent}30 0%, transparent 60%)`,
          }}
        />

        <div className="relative h-64 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const gradient = document.createElement('div');
                gradient.className = `absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`;
                parent.insertBefore(gradient, parent.firstChild);
              }
            }}
          />
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`}
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

          <motion.div
            className="absolute top-4 right-4 w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-xs font-mono text-zinc-400">{project.year}</span>
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)`,
            }}
          />
        </div>

        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <motion.span
              className="text-xs font-medium tracking-widest uppercase text-zinc-500"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.category}
            </motion.span>
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xs text-zinc-500">Ver</span>
              <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          </div>

          <motion.h3
            className="text-2xl font-bold text-white tracking-tight"
            animate={{ x: isHovered ? 8 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {project.title}
          </motion.h3>

          <motion.p
            className="text-sm text-zinc-400 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {project.description}
          </motion.p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="text-[10px] font-medium px-3 py-1.5 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0.6, y: isHovered ? 0 : 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, borderColor: "rgba(99, 102, 241, 0.5)" }}
              >
                {tag}
              </motion.span>
            ))}
            {project.status && (
              <motion.span
                className="text-[10px] font-medium px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.status}
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href={project.deploy}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Ver Demo</span>
            </a>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
});

function SectionTitle({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="text-center mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-3 mb-6"
      >
        <motion.span
          className="w-8 h-px bg-gradient-to-r from-transparent to-indigo-500"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <span className="text-xs font-medium tracking-[0.3em] uppercase text-indigo-400">
          Trabajos Destacados
        </span>
        <motion.span
          className="w-8 h-px bg-gradient-to-l from-transparent to-indigo-500"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
      >
        <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Proyectos
        </span>
        <br />
        <motion.span
          className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ x: -50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Destacados
        </motion.span>
      </motion.h2>

        <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8 text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed"
      >
        Una colección curada de experiencias digitales donde la innovación se encuentra con el diseño excepcional.
      </motion.p>
    </motion.div>
  );
}

function ParallaxLayer({
  children,
  speed = 0.5,
  direction = "y",
}: {
  children: React.ReactNode;
  speed?: number;
  direction?: "x" | "y";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const property = direction === "y" ? "y" : "x";
  const range = 200 * speed;

  const transformVal = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const opacityVal = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.75, 1, 1, 0.75]);

  return (
    <motion.div ref={ref} style={{ [property]: transformVal, opacity: opacityVal }}>
      {children}
    </motion.div>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-indigo-600/10 blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-pink-600/10 blur-[120px]"
        animate={{
          x: [0, -40, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/5 blur-[150px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative min-h-screen py-32 overflow-hidden bg-black"
    >
      <motion.div style={{ y: backgroundY, opacity }} className="absolute inset-0">
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-[0.03]">
            <defs>
              <pattern id="projects-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#projects-grid)" />
          </svg>
        </div>
      </motion.div>

      <FloatingOrbs />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle scrollYProgress={scrollYProgress} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.slice(0, 4).map((project, index) => (
            <ParallaxLayer
              key={project.id}
              speed={0.1 + (index % 2) * 0.05}
              direction={index % 2 === 0 ? "y" : "y"}
            >
              <MemoizedProjectCard
                project={project}
                index={index}
                scrollYProgress={scrollYProgress}
              />
            </ParallaxLayer>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <motion.a
            href="/projects"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168,85,247,0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex px-10 py-4 rounded-full font-semibold text-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 text-white">
              Ver Todos los Proyectos
              <motion.svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </span>
          </motion.a>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent" />
      </div>
    </section>
  );
}
