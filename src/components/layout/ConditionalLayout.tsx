'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { SignLanguageTooltip } from '@/components/landing/SignLanguageTooltip';
import { AccessibilityButton } from '@/components/landing/AccessibilityButton';
import { GlobalBackgrounds } from '@/components/layout/GlobalBackgrounds';
import { GlobalPanels } from '@/components/layout/GlobalPanels';

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    // Admin routes get minimal layout (admin has its own layout)
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // Regular routes get full landing layout
    return (
        <>
            <Navbar />
            <GlobalBackgrounds />
            <main className="pt-20">
                {children}
            </main>
            <AccessibilityButton />
            <Footer />
            <SignLanguageTooltip />
            <GlobalPanels />
        </>
    );
}
