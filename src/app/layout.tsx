import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SignLanguageTooltip } from "@/components/landing/SignLanguageTooltip";
import { I18nProvider } from "@/contexts/I18nContext";
import { UIProvider } from "@/contexts/UIContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AccessibilityButton } from "@/components/landing/AccessibilityButton";
import { GlobalBackgrounds } from "@/components/layout/GlobalBackgrounds";

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
      <head>
        {/* Preconnect to external resources for better performance */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://media.giphy.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider defaultLocale="es">
          <UIProvider>
            <AccessibilityProvider>
              <Navbar />
              <GlobalBackgrounds />
              <main className="pt-20">
                {children}
              </main>
              <AccessibilityButton />
              <Footer />
              <SignLanguageTooltip />
            </AccessibilityProvider>
          </UIProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
