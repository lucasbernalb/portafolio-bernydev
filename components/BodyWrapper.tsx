"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Dynamic import for FloatingSnake (client-only, no SSR)
const FloatingSnake = dynamic(
  () => import("@/components/FloatingSnake"),
  { ssr: false, loading: () => null }
);

export default function BodyWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <FloatingSnake />
      {children}
    </>
  );
}