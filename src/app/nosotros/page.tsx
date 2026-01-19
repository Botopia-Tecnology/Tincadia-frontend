'use client';

import { ImpactSection } from '@/components/landing/ImpactSection';
import { GridBackground } from '@/components/ui/GridBackground';
import { AboutContent } from '@/components/landing/AboutContent';

export default function NosotrosPage() {
    return (
        <main className="min-h-screen relative pt-24">
            <GridBackground className="fixed inset-0 -z-10" />
            <div>
                <AboutContent />
                <ImpactSection />
            </div>
        </main>
    );
}
