"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Dynamic import with ssr: false for client-only components
const FloatingSnake = dynamic(
  () => import("@/components/FloatingSnake"),
  { ssr: false, loading: () => null }
);

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <FloatingSnake />
      {children}
    </>
  );
}