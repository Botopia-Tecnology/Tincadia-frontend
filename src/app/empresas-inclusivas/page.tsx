import type { Metadata } from 'next';
import { FindInclusiveCompanySection } from '@/components/landing/FindInclusiveCompanySection';
import { TechBackground } from '@/components/landing/TechBackground';
import { AccessibilityButton } from '@/components/landing/AccessibilityButton';

export const metadata: Metadata = {
  title: 'Encuentra una Empresa Inclusiva - Tincadia',
  description: 'Crea tu perfil y accede a oportunidades laborales en empresas comprometidas con la inclusión y la diversidad.',
};

export default function FindInclusiveCompanyPage() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Global Background with Tincadia Colors */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 0% 20%, rgba(131,169,138,0.2), transparent),
            radial-gradient(circle 500px at 100% 0%, rgba(109,143,117,0.25), transparent)
          `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          backgroundColor: "white",
        }}
      />

      {/* Interactive Particles */}
      <TechBackground />

      {/* Page Content */}
      <div className="relative z-10">
        <FindInclusiveCompanySection />
      </div>

      {/* Accessibility Button */}
      <AccessibilityButton />
    </div>
  );
}

