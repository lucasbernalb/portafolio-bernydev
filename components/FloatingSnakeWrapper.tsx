"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr: false (client-only)
const FloatingSnake = dynamic(
  () => import("@/components/FloatingSnake"),
  { ssr: false }
);

export default function FloatingSnakeWrapper() {
  return <FloatingSnake />;
}