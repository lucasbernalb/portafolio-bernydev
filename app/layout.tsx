import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BodyWrapper from "@/components/BodyWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berny Dev | Desarrollador Full Stack & IA",
  description: "Portfolio de Berny Dev. Desarrollador Full Stack especializado en Next.js, React, TypeScript e Inteligencia Artificial. Disponible para proyectos.",
  keywords: ["desarrollador full stack", "next.js", "react", "typescript", "inteligencia artificial", "uruguay", "desarrollo web", "freelance"],
  authors: [{ name: "Berny Dev" }],
  creator: "Berny Dev",
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "https://bernydev.vercel.app",
    title: "Berny Dev | Desarrollador Full Stack & IA",
    description: "Desarrollador Full Stack creando experiencias web modernas potenciadas por IA.",
    siteName: "Berny Dev",
    images: [{ url: "/bernydev/bernydevhero.png", width: 1200, height: 630, alt: "Berny Dev Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berny Dev | Desarrollador Full Stack & IA",
    description: "Desarrollador Full Stack creando experiencias web modernas potenciadas por IA.",
    images: ["/bernydev/bernydevhero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/bernydev/logosinfondo.png",
    apple: "/bernydev/logosinfondo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-[#0A0A0F] text-white overflow-x-hidden`}>
        <BodyWrapper>{children}</BodyWrapper>
      </body>
    </html>
  );
}