"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import PageLoader from "./PageLoader";

interface LoaderContextType {
  isLoading: boolean;
  isReady: boolean;
}

const LoaderContext = createContext<LoaderContextType>({
  isLoading: true,
  isReady: false,
});

export const useLoader = () => useContext(LoaderContext);

interface LoaderProviderProps {
  children: ReactNode;
}

export default function LoaderProvider({ children }: LoaderProviderProps) {
  // Lazy initializers — leen valores al momento de la primera ejecución,
  // sin setState en effects (evita el error react-hooks/set-state-in-effect)
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [isLoading, setIsLoading] = useState(!prefersReducedMotion);
  const [isReady, setIsReady] = useState(prefersReducedMotion);
  const [mounted, setMounted] = useState(false);

  // Solo marca mounted — no modifica isLoading/isReady aquí
  useEffect(() => {
    setMounted(true);
  }, []);

  // Suscribirse a cambios de prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsLoading(false);
        setIsReady(true);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleLoaderComplete = () => {
    setIsLoading(false);
    setTimeout(() => setIsReady(true), 100);
  };

  const contextValue: LoaderContextType = {
    isLoading: mounted && isLoading,
    isReady: mounted && isReady,
  };

  return (
    <LoaderContext.Provider value={contextValue}>
      {mounted && isLoading && (
        <PageLoader onComplete={handleLoaderComplete} />
      )}
      {children}
    </LoaderContext.Provider>
  );
}
