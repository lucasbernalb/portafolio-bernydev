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
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reducir movimiento si el usuario prefiere
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleLoaderComplete = () => {
    setIsLoading(false);
    // Pequeño delay para que la transición sea suave
    setTimeout(() => setIsReady(true), 100);
  };

  // Si prefiere movimiento reducido, saltamos el loader
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsLoading(false);
      setIsReady(true);
    }
  }, [prefersReducedMotion]);

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
