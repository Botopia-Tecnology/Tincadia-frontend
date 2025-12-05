'use client';

import { Hero } from '@/components/landing/Hero';
import { Services } from '@/components/landing/Services';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { HowToStart } from '@/components/landing/HowToStart';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { RegionalMap } from '@/components/landing/RegionalMap';
import { DownloadAppSection } from '@/components/landing/DownloadAppSection';
import { useAccessibilityContext } from '@/contexts/AccessibilityContext';

export default function Home() {
  const { state } = useAccessibilityContext();
  const { disableAnimations } = state;

  return (
    <div className="min-h-screen w-full relative">
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
    </div>
  );
}

