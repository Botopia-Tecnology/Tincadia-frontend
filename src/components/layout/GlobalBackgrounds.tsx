'use client';

import { TechBackground } from '@/components/landing/TechBackground';
import { GridBackground } from '@/components/ui/GridBackground';
import { useAccessibilityContext } from '@/contexts/AccessibilityContext';

export function GlobalBackgrounds() {
    const { state } = useAccessibilityContext();
    const { disableAnimations } = state;

    return (
        <>
            {/* Global Background with Tincadia Colors */}
            <GridBackground className="fixed inset-0 -z-20" />

            {/* Interactive Particles */}
            <TechBackground disableAnimations={disableAnimations} />
        </>
    );
}
