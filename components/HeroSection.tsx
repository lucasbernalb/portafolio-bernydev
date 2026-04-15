"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const mainTitle = "BERNY";
const subTitle = "DEV";
const subtitleText = "Full Stack Developer & AI. ";
const subtitleHighlight = "Desarrollo rápido. Diseño inteligente. Tu idea cobra vida.";
const glitchChars = "!@#$%&*%§<>?/|\\";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    setTimeout(() => setTitleVisible(true), 300);
  }, []);

  const subtitleLetters = subtitleText.split("");

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
              className="text-6xl md:text-8xl font-black leading-[0.9] relative"
            >
              {/* BERNY con Glitch Mejorado */}
              <motion.span
                className="bg-gradient-to-b from-white to-violet-200 bg-clip-text text-transparent relative inline-block"
                initial={{ opacity: 0 }}
                animate={titleVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {mainTitle}
              </motion.span>

              {/* Capa Glitch Cyan con Skew */}
              <motion.span
                className="absolute left-0 top-0 bg-gradient-to-b from-cyan-300 to-cyan-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 0, skewX: 0 }}
                animate={titleVisible ? {
                  opacity: [0, 0.9, 0, 0.5, 0, 0.7, 0],
                  x: [0, -4, 2, -2, 0],
                  skewX: [0, -5, 3, -2, 0],
                  transition: {
                    duration: 0.6,
                    times: [0, 0.2, 0.4, 0.6, 1],
                    repeat: Infinity,
                    repeatDelay: 5,
                  }
                } : {}}
                aria-hidden="true"
              >
                {mainTitle}
              </motion.span>

              {/* Capa Glitch Magenta con Skew */}
              <motion.span
                className="absolute left-0 top-0 bg-gradient-to-b from-pink-300 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 0, skewX: 0 }}
                animate={titleVisible ? {
                  opacity: [0, 0.8, 0, 0.4, 0, 0.6, 0],
                  x: [0, 4, -2, 2, 0],
                  skewX: [0, 5, -3, 2, 0],
                  transition: {
                    duration: 0.6,
                    times: [0, 0.2, 0.4, 0.6, 1],
                    repeat: Infinity,
                    repeatDelay: 5,
                    delay: 0.03,
                  }
                } : {}}
                aria-hidden="true"
              >
                {mainTitle}
              </motion.span>

              {/* Caracteres Random Glitch */}
              <motion.span
                className="absolute left-0 top-0 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={titleVisible ? {
                  opacity: [0, 0, 0.4, 0],
                  transition: {
                    duration: 0.15,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }
                } : {}}
                aria-hidden="true"
              >
                {mainTitle.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    animate={titleVisible ? {
                      opacity: [0, 1, 0],
                      y: [0, -2, 0],
                    } : {}}
                    transition={{
                      duration: 0.1,
                      repeat: Infinity,
                      repeatDelay: 5 + i * 0.02,
                    }}
                  >
                    {glitchChars[i % glitchChars.length]}
                  </motion.span>
                ))}
              </motion.span>

              <br />

              {/* DEV con Glitch Mejorado */}
              <motion.span
                className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent relative inline-block"
                initial={{ opacity: 0 }}
                animate={titleVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {subTitle}
              </motion.span>

              {/* Capa Glitch Cyan para DEV */}
              <motion.span
                className="absolute left-0 top-[1em] bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 0, skewX: 0 }}
                animate={titleVisible ? {
                  opacity: [0, 0.9, 0, 0.5, 0, 0.7, 0],
                  x: [0, -4, 2, -2, 0],
                  skewX: [0, -5, 3, -2, 0],
                  transition: {
                    duration: 0.6,
                    times: [0, 0.2, 0.4, 0.6, 1],
                    repeat: Infinity,
                    repeatDelay: 5,
                    delay: 0.2,
                  }
                } : {}}
                aria-hidden="true"
              >
                {subTitle}
              </motion.span>

              {/* Capa Glitch Magenta para DEV */}
              <motion.span
                className="absolute left-0 top-[1em] bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 0, skewX: 0 }}
                animate={titleVisible ? {
                  opacity: [0, 0.8, 0, 0.4, 0, 0.6, 0],
                  x: [0, 4, -2, 2, 0],
                  skewX: [0, 5, -3, 2, 0],
                  transition: {
                    duration: 0.6,
                    times: [0, 0.2, 0.4, 0.6, 1],
                    repeat: Infinity,
                    repeatDelay: 5,
                    delay: 0.23,
                  }
                } : {}}
                aria-hidden="true"
              >
                {subTitle}
              </motion.span>

              {/* Caracteres Random para DEV */}
              <motion.span
                className="absolute left-0 top-[1em] bg-gradient-to-r from-violet-200 to-purple-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={titleVisible ? {
                  opacity: [0, 0, 0.4, 0],
                  transition: {
                    duration: 0.15,
                    repeat: Infinity,
                    repeatDelay: 5,
                    delay: 0.1,
                  }
                } : {}}
                aria-hidden="true"
              >
                {subTitle.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    animate={titleVisible ? {
                      opacity: [0, 1, 0],
                      y: [0, -2, 0],
                    } : {}}
                    transition={{
                      duration: 0.1,
                      repeat: Infinity,
                      repeatDelay: 5.1 + i * 0.02,
                    }}
                  >
                    {glitchChars[i % glitchChars.length]}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-zinc-400 overflow-hidden"
            >
              {subtitleLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={titleVisible ? { opacity: 1 } : {}}
                  transition={{
                    delay: (mainTitle.length + subTitle.length + 5 + index) * 0.033,
                    duration: 0.01,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
              <motion.span
                className="text-violet-400"
                initial={{ opacity: 0 }}
                animate={titleVisible ? { opacity: 1 } : {}}
                transition={{
                  delay: (mainTitle.length + subTitle.length + 5 + subtitleText.length) * 0.033,
                  duration: 0.3,
                }}
              >
                {subtitleHighlight}
              </motion.span>
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

          {/* Spacer */}
          <div className="flex-1 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
