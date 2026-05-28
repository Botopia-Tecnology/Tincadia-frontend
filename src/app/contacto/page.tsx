import { ContactSection } from '@/components/landing/ContactSection';
import { GridBackground } from '@/components/ui/GridBackground';

export default function ContactPage() {
    return (
        <main className="min-h-screen relative">
            <GridBackground className="fixed inset-0 -z-10" />
            <div>
                <ContactSection />
            </div>
        </main>
    );
}
