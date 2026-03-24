"use client";

import { useMemo, useCallback } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const sections = [
  { id: "hero", label: "Home", position: 0.1 },
  { id: "about", label: "About", position: 0.35 },
  { id: "projects", label: "Work", position: 0.65 },
  { id: "contact", label: "Contact", position: 0.9 },
];

function TopProgressBar() {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
      style={{ scaleX }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500" />
      <div 
        className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500"
        style={{ filter: "blur(8px)" }}
      />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-2 bg-gradient-to-r from-transparent to-violet-400/50" 
           style={{ filter: "blur(6px)" }} />
    </motion.div>
  );
}

function SectionNode({ 
  id, 
  label, 
  position, 
  isLeft,
  scrollYProgress 
}: { 
  id: string; 
  label: string; 
  position: number; 
  isLeft: boolean;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const isActive = useTransform(
    scrollYProgress,
    [position - 0.12, position + 0.08],
    [0, 1]
  );
  
  const isLabelVisible = useTransform(isActive, [0.5, 1], [0, 1]);
  
  const scale = useSpring(isActive, { stiffness: 100, damping: 15 });
  const opacity = useSpring(isActive, { stiffness: 80, damping: 20 });

  const handleClick = useCallback(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, [id]);

  const nodeY = position * 400;

  return (
    <div 
      className="absolute pointer-events-auto cursor-pointer"
      style={{ 
        top: `calc(50% - 200px + ${nodeY}px)`,
        [isLeft ? "right" : "left"]: "-32px",
      }}
      onClick={handleClick}
    >
      <motion.div
        className="relative flex items-center gap-3"
        style={{ flexDirection: isLeft ? "row-reverse" : "row" }}
      >
        <motion.div
          className="relative w-3 h-3"
          style={{ scale, opacity }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500"
            style={{ 
              boxShadow: useTransform(
                isActive, 
                [0, 1], 
                ["0 0 0px rgba(168, 85, 247, 0)", "0 0 16px rgba(168, 85, 247, 0.8)"]
              )
            }}
          />
          <motion.div
            className="absolute inset-[3px] rounded-full bg-white"
            style={{ opacity: useTransform(isActive, [0, 1], [0, 1]) }}
          />
          
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500"
            style={{ 
              scale: useTransform(isActive, [0, 1], [1, 1.5]),
              opacity: useTransform(isActive, [0, 0.5, 1], [0, 0.6, 0])
            }}
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>

        <motion.span
          className="text-[9px] tracking-[0.2em] font-medium whitespace-nowrap"
          style={{ 
            opacity: isLabelVisible,
            x: isLabelVisible.get() > 0 ? (isLeft ? 8 : -8) : 0,
            color: useTransform(isActive, [0, 1], ["#52525b", "#a855f7"])
          }}
        >
          {label}
        </motion.span>
      </motion.div>
    </div>
  );
}

function ZigZagProgressLine() {
  const { scrollYProgress } = useScroll();
  
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  const pathLength = useTransform(springProgress, [0, 1], [0, 1]);

  const svgHeight = 400;
  const zigZagPoints = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const segments = 8;
    const width = 20;
    
    for (let i = 0; i <= segments; i++) {
      const y = (i / segments) * svgHeight;
      const x = i % 2 === 0 ? 0 : width;
      points.push({ x, y });
    }
    return points;
  }, []);

  const pathData = useMemo(() => {
    if (zigZagPoints.length === 0) return "";
    
    let d = `M ${zigZagPoints[0].x} ${zigZagPoints[0].y}`;
    for (let i = 1; i < zigZagPoints.length; i++) {
      d += ` L ${zigZagPoints[i].x} ${zigZagPoints[i].y}`;
    }
    return d;
  }, [zigZagPoints]);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[60] hidden lg:block">
      <div className="relative h-[400px] w-[20px]">
        <svg
          width="20"
          height={svgHeight}
          viewBox={`0 0 20 ${svgHeight}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="zigzag-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
            </linearGradient>
            <filter id="zigzag-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <path
            d={pathData}
            fill="none"
            stroke="url(#zigzag-gradient)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.25"
          />
          
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#zigzag-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#zigzag-glow)"
            style={{ pathLength }}
          />
        </svg>

        <motion.div
          className="absolute left-0 w-2 h-2 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500"
          style={{
            top: 0,
            left: "50%",
            x: "-50%",
            scale: pathLength,
            opacity: pathLength,
            boxShadow: "0 0 12px rgba(168, 85, 247, 0.6)",
          }}
        />
      </div>

      {sections.map((section, index) => (
        <SectionNode
          key={section.id}
          id={section.id}
          label={section.label}
          position={section.position}
          isLeft={index % 2 === 0}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

export default function ScrollProgress() {
  return (
    <>
      <TopProgressBar />
      <ZigZagProgressLine />
    </>
  );
}
