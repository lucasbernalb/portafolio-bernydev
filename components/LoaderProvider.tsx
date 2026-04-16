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
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  // Lazy init para evitar hydration mismatch - solo checkea window en cliente
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");

  // Suscribirse a cambios de prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    // Si ya prefiere reduced motion al cargar, saltamos el loader
    if (mediaQuery.matches) {
      setIsLoading(false);
      setIsReady(true);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleLoaderComplete = () => {
    setIsLoading(false);
    setTimeout(() => setIsReady(true), 100);
  };

  // Valor del contexto
  const contextValue: LoaderContextType = {
    isLoading: mounted && isLoading,
    isReady: mounted && isReady,
  };

  return (
    <LoaderContext.Provider value={contextValue}>
      {/* Loader animado */}
      {mounted && isLoading && (
        <PageLoader onComplete={handleLoaderComplete} />
      )}

      {/* Contenido principal */}
      {children}
    </LoaderContext.Provider>
  );
}
