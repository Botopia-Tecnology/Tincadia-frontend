import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SignLanguageTooltip } from "@/components/landing/SignLanguageTooltip";
import { I18nProvider } from "@/contexts/I18nContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tincadia - Tecnología Inclusiva para un Mundo sin Barreras",
  description: "Creando puentes de comunicación para un mundo más inclusivo. Soluciones tecnológicas accesibles, inteligencia artificial y herramientas de comunicación que conectan a personas sordas, oyentes y organizaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider defaultLocale="es">
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
          <SignLanguageTooltip />
        </I18nProvider>
      </body>
    </html>
  );
}
