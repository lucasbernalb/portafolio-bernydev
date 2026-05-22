"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NavigationLoader from "./NavigationLoader";

/**
 * Shows a lightweight loader only when navigating between Home ("/") and Projects ("/projects").
 * It does NOT replace the fancy initial loader handled by LoaderProvider/PageLoader.
 */
export default function RouteTransitionLoader() {
  const router = useRouter();            // <-- API correcta para app router
  const pathname = usePathname();        // <-- nos da la ruta actual
  const [show, setShow] = useState(false);
  const [prevPath, setPrevPath] = useState<string | null>(null);

  // Cuando el pathname cambie, decidimos si debemos mostrar el loader
  useEffect(() => {
    // En la primera renderización establecemos el path actual
    if (prevPath === null) {
      setPrevPath(pathname);
      return;
    }

    const isRelevantTransition =
      (prevPath === "/" && pathname === "/projects") ||
      (prevPath === "/projects" && pathname === "/");

    if (isRelevantTransition) {
      setShow(true);
      // Mostramos el loader un poco más de tiempo para que sea perceptible
      const t = setTimeout(() => {
        setShow(false);
        setPrevPath(pathname);
      }, 800);
      return () => clearTimeout(t);
    }

    // Si no es una transición relevante, simplemente actualizamos prevPath
    setPrevPath(pathname);
  }, [pathname, prevPath]);

  if (!show) return null;
  return <NavigationLoader />;
}
