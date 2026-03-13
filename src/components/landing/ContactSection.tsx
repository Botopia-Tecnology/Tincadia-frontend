'use client';

import { useContactForm } from '@/hooks/useContactForm';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';

export function ContactSection() {
    const {
        formik,
        formIdError,
        submitStatus,
        contactInfo
    } = useContactForm();

    return (
        <section id="contacto" className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center py-20 lg:py-32">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50/50 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50/50 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-5 order-2 lg:order-1 flex items-center">
                        <ContactForm 
                            formik={formik} 
                            submitStatus={submitStatus} 
                            formIdError={formIdError} 
                        />
                    </div>

                    {/* Right Column: Info */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <ContactInfo 
                            email={contactInfo.email} 
                            phone={contactInfo.phone} 
                            socialLinks={contactInfo.socialLinks} 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
