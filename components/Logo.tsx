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
      <motion.div
        layoutId={layoutId}
        className="relative w-14 h-14"
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
          style={{ mixBlendMode: "lighten" }}
          priority
        />
      </motion.div>

      <h1 className="text-xl font-bold tracking-tight">
        <motion.span
          className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-300 bg-clip-text text-transparent"
          initial={animate ? "hidden" : false}
          animate={animate ? "visible" : false}
          aria-label={titleText}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.24,
                    duration: 0.3,
                  },
                },
              }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.span>
        {showCursor && (
          <motion.span
            className="inline-block w-[3px] h-6 ml-1 bg-gradient-to-b from-violet-400 to-purple-400 align-middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: letters.length * 0.24 + 0.8,
            }}
          />
        )}
      </h1>
    </Link>
  );
}
