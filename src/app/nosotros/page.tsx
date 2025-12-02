'use client';

import { ImpactSection } from '@/components/landing/ImpactSection';
import { GridBackground } from '@/components/ui/GridBackground';

export default function NosotrosPage() {
    return (
        <main className="min-h-screen relative">
            <GridBackground className="fixed inset-0 -z-10" />
            <div className="pt-20">
                <ImpactSection />
            </div>
        </main>
    );
}
