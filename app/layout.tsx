import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BERNY DEV — Full Stack Developer building with AI",
  description: "Full Stack Developer crafting modern web experiences powered by AI. Building the future, one line of code at a time.",
  icons: {
    icon: "/bernydev/logoconfondo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-[#0A0A0F] text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
