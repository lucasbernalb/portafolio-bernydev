"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <Image
          src="/bernydev/bernydevhero.png"
          alt=""
          fill
          className="object-cover opacity-[0.08] blur-[3px] scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/95 to-[#0A0A0F]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-[#0A0A0F]/80" />
      </div>

      {/* Background Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[1]">
        <div className="relative w-[700px] h-[700px] opacity-[0.025]">
          <Image
            src="/bernydev/logosinfondo.png"
            alt=""
            fill
            className="object-contain blur-[8px]"
            priority
          />
        </div>
      </div>

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[140px] z-[2]" />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-purple-600/8 rounded-full blur-[120px] z-[2]" />

      {/* Text Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
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
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-zinc-400"
            >
              Desarrollador Full Stack creando experiencias web modernas con lo{" "}
              <span className="text-violet-400">último en tecnología</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={() => {
                  const projectsSection = document.getElementById("projects");
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 font-medium text-sm hover:bg-violet-600/30 transition-all cursor-pointer"
              >
                Ver más
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
            </motion.div>
          </div>

          {/* Spacer — FloatingSnake lives here visually */}
          <div className="flex-1 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
