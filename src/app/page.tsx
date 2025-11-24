'use client';

import { useState, createContext, useContext } from 'react';
import { Hero } from '@/components/landing/Hero';
import { Services } from '@/components/landing/Services';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { HowToStart } from '@/components/landing/HowToStart';
import { Testimonials } from '@/components/landing/Testimonials';
import { SignUpForms } from '@/components/landing/SignUpForms';
import { FAQ } from '@/components/landing/FAQ';
import { TechBackground } from '@/components/landing/TechBackground';
import { AccessibilityButton } from '@/components/landing/AccessibilityButton';
import { RegionalMap } from '@/components/landing/RegionalMap';

// Contexto para compartir el estado del panel de registro
const RegistrationPanelContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const useRegistrationPanel = () => useContext(RegistrationPanelContext);

export default function Home() {
  const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] = useState(false);

  return (
    <div className="min-h-screen w-full relative">
      {/* Global Background with Tincadia Colors */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,231,235,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.2) 1px, transparent 1px),
            radial-gradient(circle 500px at 0% 20%, rgba(131,169,138,0.08), transparent),
            radial-gradient(circle 500px at 100% 0%, rgba(109,143,117,0.1), transparent)
          `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          backgroundColor: "white",
        }}
      />

      {/* Interactive Particles */}
      <TechBackground />

      {/* Page Content */}
      <RegistrationPanelContext.Provider value={{ isOpen: isRegistrationPanelOpen, setIsOpen: setIsRegistrationPanelOpen }}>
        <div className="relative z-10">
          <Hero />
          <RegionalMap />
          <HowToStart />
          <HowItWorks />
          <Services />
          <Testimonials />
          <SignUpForms />
          <FAQ />
        </div>

        {/* Accessibility Button */}
        <AccessibilityButton isRegistrationPanelOpen={isRegistrationPanelOpen} />
      </RegistrationPanelContext.Provider>
    </div>
  );
}
