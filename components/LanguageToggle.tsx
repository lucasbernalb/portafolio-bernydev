"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang, t } = useTranslation();

  const toggle = useCallback(() => {
    setLang(lang === "es" ? "en" : "es");
  }, [lang, setLang]);

  const isEn = lang === "en";

  return (
    <button
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      aria-label={isEn ? t("toggle.toEs") : t("toggle.toEn")}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full
        bg-zinc-800/60 border border-zinc-700/40
        hover:border-violet-500/40 transition-colors duration-300
        cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60
        text-sm select-none"
      role="switch"
      aria-checked={isEn}
    >
      {/* ES */}
      <span
        className={`relative z-10 text-xs leading-none transition-colors duration-300 ${
          isEn ? "text-zinc-500" : "text-white"
        }`}
      >
        🇪🇸
      </span>

      {/* Indicador deslizante */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`absolute inset-0 rounded-full ${
          isEn ? "bg-violet-600/30" : "bg-violet-600/30"
        }`}
        style={{
          // El indicador se mueve de izquierda a derecha
          left: isEn ? "50%" : "0%",
          right: isEn ? "0%" : "50%",
        }}
      />

      {/* EN */}
      <span
        className={`relative z-10 text-xs leading-none transition-colors duration-300 ${
          isEn ? "text-white" : "text-zinc-500"
        }`}
      >
        🇺🇸
      </span>
    </button>
  );
}
