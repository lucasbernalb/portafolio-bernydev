"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLoader } from "./LoaderProvider";

interface AnimatedContentProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedContent({ children, className = "" }: AnimatedContentProps) {
  const { isReady } = useLoader();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={className}
    >
      {children}
    </motion.main>
  );
}
