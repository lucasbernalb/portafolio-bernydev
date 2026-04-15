"use client";

import { ReactNode } from "react";
import LoaderProvider from "./LoaderProvider";

export default function BodyWrapper({ children }: { children: ReactNode }) {
  return <LoaderProvider>{children}</LoaderProvider>;
}
