"use client";

import { useRef, useState, memo, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "Nebula Dashboard",
    category: "Web Application",
    year: "2025",
    description: "Real-time analytics platform with immersive data visualization",
    tags: ["React", "Three.js", "D3.js"],
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    accent: "#6366f1",
  },
  {
    id: 2,
    title: "Ethereal Commerce",
    category: "E-Commerce",
    year: "2025",
    description: "Luxury shopping experience with spatial commerce features",
    tags: ["Next.js", "Stripe", "Sanity"],
    gradient: "from-emerald-600 via-cyan-600 to-blue-600",
    accent: "#10b981",
  },
  {
    id: 3,
    title: "Sonic Motion",
    category: "Creative Portfolio",
    year: "2024",
    description: "Audio-reactive 3D portfolio pushing creative boundaries",
    tags: ["WebGL", "Tone.js", "GSAP"],
    gradient: "from-orange-600 via-red-600 to-pink-600",
    accent: "#f97316",
  },
  {
    id: 4,
    title: "Quantum Social",
    category: "Social Platform",
    year: "2024",
    description: "Next-gen social network with AI-powered interactions",
    tags: ["GraphQL", "TensorFlow", "Redis"],
    gradient: "from-violet-600 via-fuchsia-600 to-purple-600",
    accent: "#8b5cf6",
  },
  {
    id: 5,
    title: "Prism Studio",
    category: "Creative Tool",
    year: "2024",
    description: "Browser-based design suite with real-time collaboration",
    tags: ["Canvas API", "WebRTC", "Supabase"],
    gradient: "from-rose-600 via-pink-600 to-fuchsia-600",
    accent: "#f43f5e",
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
              <span className="text-xs text-zinc-500">View</span>
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
          Selected Work
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
          Featured
        </span>
        <br />
        <motion.span
          className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ x: -50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Projects
        </motion.span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8 text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed"
      >
        A curated collection of digital experiences where innovation meets exceptional design.
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
  const opacityVal = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

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

function ProgressIndicator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const scaleY = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <motion.div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <span className="text-[10px] tracking-[0.2em] text-zinc-600 font-medium rotate-90 origin-center">
        SCROLL
      </span>
      <div className="relative w-px h-24 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          style={{ scaleY, transformOrigin: "top" }}
        />
      </div>
    </motion.div>
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
      <ProgressIndicator scrollYProgress={scrollYProgress} />

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
              View All Projects
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
