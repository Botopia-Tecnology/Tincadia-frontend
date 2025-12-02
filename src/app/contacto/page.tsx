import { ContactSection } from '@/components/landing/ContactSection';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { GridBackground } from '@/components/ui/GridBackground';

export default function ContactPage() {
    return (
        <main className="min-h-screen relative">
            <GridBackground className="fixed inset-0 -z-10" />
            <div className="pt-20"> {/* Add padding top to account for fixed navbar */}
                <ContactSection />
            </div>
        </main>
    );
}
