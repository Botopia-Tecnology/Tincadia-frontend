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
    const isCourseView = pathname?.includes('/cursos/') && pathname?.split('/').length >= 3;

    // Admin routes get minimal layout
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // Course landing/player get clean layout (they have their own headers)
    if (isCourseView) {
        return (
            <>
                <GlobalBackgrounds />
                <main>{children}</main>
                <GlobalPanels />
            </>
        );
    }

    // Regular routes get full landing layout
    return (
        <>
            <Navbar isBannerVisible={false} />
            <GlobalBackgrounds />
            <main className="transition-[padding] duration-300 pt-20">
                {children}
            </main>
            <AccessibilityButton />
            <Footer />
            <SignLanguageTooltip />
            <GlobalPanels />
        </>
    );
}
