"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const titleText = "BERNY DEV";
const letters = titleText.split("");

interface LogoProps {
  className?: string;
  imageClassName?: string;
  layoutId?: string;
  showCursor?: boolean;
  animate?: boolean;
}

export default function Logo({
  className = "",
  imageClassName = "",
  layoutId,
  showCursor = false,
  animate = true,
}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Logo image — isolated from text */}
      <motion.div
        layoutId={layoutId}
        className="relative w-14 h-14 flex-shrink-0"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
      >
        <Image
          src="/bernydev/logosinfondo.png"
          alt="BERNY DEV Logo"
          fill
          className={`object-contain ${imageClassName}`}
          priority
        />
      </motion.div>

      {/* Text — separate from image */}
      <div className="relative">
        <h1 className="text-xl font-bold tracking-tight text-violet-400">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              initial={animate ? { opacity: 0, y: 10 } : {}}
              animate={animate ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: index * 0.24,
                duration: 0.3,
              }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </h1>
        {showCursor && (
          <motion.span
            className="inline-block w-[3px] h-6 ml-1 bg-violet-400 align-middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: letters.length * 0.24 + 0.8,
            }}
          />
        )}
      </div>
    </Link>
  );
}
