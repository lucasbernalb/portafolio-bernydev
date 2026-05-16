"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import es from "@/i18n/es.json";
import en from "@/i18n/en.json";

type Language = "es" | "en";
type Translations = Record<string, unknown>;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = { es, en };

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // fallback: devuelve la key
    }
  }
  return typeof current === "string" ? current : path;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "es",
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("es");
  const [mounted, setMounted] = useState(false);

  // Hydration-safe: leer localStorage solo en el cliente
  useEffect(() => {
    const stored = localStorage.getItem("bernydev-lang");
    if (stored === "en" || stored === "es") {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  // Actualizar el atributo lang del html al cambiar idioma
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("bernydev-lang", newLang);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[lang], key);
    },
    [lang]
  );

  // Evitar flash de contenido no traducido en SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
