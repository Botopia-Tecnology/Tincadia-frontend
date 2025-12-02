'use client';

import { Hero } from '@/components/landing/Hero';
import { Services } from '@/components/landing/Services';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { HowToStart } from '@/components/landing/HowToStart';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { TechBackground } from '@/components/landing/TechBackground';
import { RegionalMap } from '@/components/landing/RegionalMap';
import { DownloadAppSection } from '@/components/landing/DownloadAppSection';
import { LoginPanel } from '@/components/landing/LoginPanel';
import { RegistrationPanel } from '@/components/landing/RegistrationPanel';
import { GridBackground } from '@/components/ui/GridBackground';
import { useUI } from '@/contexts/UIContext';
import { useAccessibilityContext } from '@/contexts/AccessibilityContext';

export default function Home() {
  const {
    isRegistrationPanelOpen,
    setIsRegistrationPanelOpen,
    registrationEmail,
    setRegistrationEmail,
    isLoginPanelOpen,
    setIsLoginPanelOpen
  } = useUI();

  const { state } = useAccessibilityContext();
  const { disableAnimations } = state;

  return (
    <div className="min-h-screen w-full relative">
      {/* Global Background with Tincadia Colors */}
      <GridBackground className="fixed inset-0 -z-20" />

      {/* Interactive Particles */}
      <TechBackground disableAnimations={disableAnimations} />

      {/* Page Content */}
      <div className="relative z-10">
        <Hero disableAnimations={disableAnimations} />
        <RegionalMap />
        <HowToStart />
        <HowItWorks />
        <Services />
        <DownloadAppSection />
        <Testimonials />
        <FAQ />

      </div>

      {/* Login Panel */}
      <LoginPanel
        isOpen={isLoginPanelOpen}
        onClose={() => setIsLoginPanelOpen(false)}
        onSignUpClick={(email) => {
          setIsLoginPanelOpen(false);
          if (email) setRegistrationEmail(email);
          setIsRegistrationPanelOpen(true);
        }}
      />

      {/* Registration Panel */}
      <RegistrationPanel
        isOpen={isRegistrationPanelOpen}
        onClose={() => setIsRegistrationPanelOpen(false)}
        initialEmail={registrationEmail}
      />
    </div>
  );
}

