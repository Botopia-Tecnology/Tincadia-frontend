import type { Metadata } from 'next';
import { BecomeInterpreterSection } from '@/components/landing/BecomeInterpreterSection';
import { TechBackground } from '@/components/landing/TechBackground';
import { AccessibilityButton } from '@/components/landing/AccessibilityButton';

export const metadata: Metadata = {
  title: 'Conviértete en Intérprete - Tincadia',
  description: 'Únete a nuestra red de intérpretes profesionales certificados y marca la diferencia en la vida de las personas sordas e hipoacúsicas.',
};

export default function BecomeInterpreterPage() {
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
      <div className="relative z-10">
        <BecomeInterpreterSection />
      </div>

      {/* Accessibility Button */}
      <AccessibilityButton />
    </div>
  );
}

