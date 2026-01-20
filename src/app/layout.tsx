import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/contexts/I18nContext";
import { UIProvider } from "@/contexts/UIContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleAuthProvider } from "@/contexts/GoogleAuthProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import ClarityAnalytics from "@/components/clarity/ClarityAnalytics";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { PostHogPageView } from "@/components/analytics/PostHogPageView";

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
        <PostHogProvider>
          <ClarityAnalytics />
          <PostHogPageView />
          <I18nProvider defaultLocale="es">
            <UIProvider>
              <GoogleAuthProvider>
                <AuthProvider>
                  <AccessibilityProvider>
                    <ConditionalLayout>
                      {children}
                    </ConditionalLayout>
                  </AccessibilityProvider>
                </AuthProvider>
              </GoogleAuthProvider>
            </UIProvider>
          </I18nProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
