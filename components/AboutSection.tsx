"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import Image from "next/image";

const capabilities = [
  {
    title: "Full Stack Development",
    description: "Building end-to-end solutions with modern frameworks, clean architecture, and scalable systems.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "AI Integration",
    description: "Leveraging machine learning and AI APIs to create intelligent, adaptive digital experiences.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Performance Optimization",
    description: "Creating lightning-fast applications with optimized code, efficient rendering, and minimal load times.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Creative Direction",
    description: "Combining technical expertise with design sensibility to deliver polished, premium results.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

const skills = [
  { name: "Frontend Engineering", level: "Expert", description: "React, Next.js, animations, UI systems" },
  { name: "Backend & APIs", level: "Advanced", description: "Node.js, databases, scalable architecture" },
  { name: "AI Integration", level: "Advanced", description: "LLMs, automation, AI-powered features" },
  { name: "3D & Interactive", level: "Intermediate", description: "Three.js, WebGL, immersive experiences" },
  { name: "Performance", level: "Advanced", description: "Optimization, rendering, UX speed" },
  { name: "Creative Direction", level: "Advanced", description: "Design thinking, branding, visual identity" },
];

const techStack = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Languages" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "AI/ML" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Three.js", category: "3D/Graphics" },
  { name: "PostgreSQL", category: "Database" },
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
        What I Do
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
          <div className="w-full h-full rounded-3xl bg-[#0A0A0F] overflow-hidden">
            <div className="relative w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 flex items-center justify-center">
              <span className="text-8xl font-bold bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-500 bg-clip-text text-transparent">
                BD
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-violet-600/25 via-transparent to-fuchsia-600/15" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(168,85,247,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(244,63,94,0.1),transparent_50%)]" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2"
      >
        <div className="px-5 py-2.5 rounded-full bg-zinc-900/90 backdrop-blur border border-zinc-800">
          <span className="text-xs font-medium text-zinc-400">Available for work</span>
        </div>
      </motion.div>
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
        Designing and building
      </span>
      <br />
      <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
        high-impact digital experiences
      </span>
      <br />
      <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
        powered by AI.
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

function TechBadge({ name, index }: { name: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.4,
        delay: 0.5 + index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        borderColor: "rgba(168, 85, 247, 0.3)",
      }}
      className="px-4 py-2 rounded-full text-sm font-medium text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm transition-all duration-200 cursor-default"
    >
      {name}
    </motion.span>
  );
}

function TechStack() {
  return (
    <div className="flex flex-wrap gap-3">
      {techStack.map((tech, index) => (
        <TechBadge key={tech.name} name={tech.name} index={index} />
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
          I don&apos;t just build applications — I craft experiences that stand out.
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-200px" });

  return (
    <section
      id="about"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
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

      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-fuchsia-600/5 rounded-full blur-[120px]" />

      <div ref={containerRef} className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20 items-start">
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <AvatarContainer />
          </div>

          <div className="lg:col-span-3 max-w-xl">
            <div className="space-y-16">
              <div className="space-y-6">
                <SectionLabel />
                <Headline />
              </div>

              <div className="space-y-6">
                <SectionTitle title="What I Do" />
                <CapabilityGrid />
              </div>

              <div className="space-y-6">
                <SectionTitle title="Expertise" />
                <SkillsGrid />
              </div>

              <div className="space-y-6">
                <SectionTitle title="Technologies" />
                <TechStack />
              </div>

              <ClosingPhrase />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
