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

                {/* Account Deletion Request */}
                <div id="eliminar-cuenta" className="mt-20 pt-12 border-t border-gray-200 w-full max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Solicitar eliminación de cuenta</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Si deseas eliminar tu cuenta y todos los datos asociados, envíanos una solicitud
                        con el correo electrónico registrado en tu cuenta. Procesaremos tu solicitud en
                        un plazo máximo de 30 días hábiles.
                    </p>
                    <a
                        href="mailto:Contacto@tincadia.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta&body=Solicito%20la%20eliminaci%C3%B3n%20de%20mi%20cuenta%20asociada%20al%20correo%3A%20%5Bescribe%20tu%20correo%20aqu%C3%AD%5D"
                        className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Solicitar eliminación de cuenta
                    </a>
                    <p className="text-xs text-gray-400 mt-4">
                        Al solicitar la eliminación, se borrarán permanentemente tus datos personales,
                        historial de conversaciones y archivos asociados a tu cuenta.
                    </p>
                </div>
            </div>
        </section>
    );
}
