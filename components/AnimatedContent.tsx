"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLoader } from "./LoaderProvider";
import { useTranslation } from "@/contexts/LanguageContext";

interface AnimatedContentProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedContent({ children, className = "" }: AnimatedContentProps) {
  const { isReady } = useLoader();
  const { lang } = useTranslation();

  return (
    <motion.main
      key={lang}
      initial={isReady ? { opacity: 0, y: 8 } : false}
      animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.main>
  );
}
