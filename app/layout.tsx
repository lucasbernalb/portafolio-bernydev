import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BodyWrapper from "@/components/BodyWrapper";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import AIAssistant from "@/components/AIAssistant";
import SceneBackground from "@/components/SceneBackground";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BOAI | Webs, agentes y automatizaciones",
  description: "BOAI diseña y construye webs, agentes de IA y automatizaciones para negocios que quieren operar mejor.",
  keywords: ["desarrollo web", "agentes de IA", "automatización de procesos", "consultoría tecnológica", "inteligencia artificial", "Uruguay"],
  authors: [{ name: "BOAI" }],
  creator: "BOAI",
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "https://bernydev.vercel.app",
    title: "BOAI | Webs, agentes y automatizaciones",
    description: "Webs, agentes y automatizaciones para negocios que quieren operar mejor.",
    siteName: "BOAI",
    images: [{ url: "/bernydev/bernydevhero.png", width: 1200, height: 630, alt: "BOAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BOAI | Webs, agentes y automatizaciones",
    description: "Webs, agentes y automatizaciones para negocios que quieren operar mejor.",
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
        <SceneBackground />
        <LanguageProvider>
          <BodyWrapper>{children}</BodyWrapper>
        <RouteTransitionLoader />
        <AIAssistant />
        </LanguageProvider>
      </body>
    </html>
  );
}
