'use client';

import { useState } from 'react';
import { Mail, Phone, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { SocialIcon } from '@/components/common/SocialIcon';

interface SocialLink {
    id?: string;
    network: string;
    url: string;
}

interface ContactInfoProps {
    email: string;
    phone: string;
    socialLinks?: SocialLink[];
}

export function ContactInfo({ email, phone, socialLinks }: ContactInfoProps) {
    const t = useTranslation();
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <h2 className="text-5xl lg:text-7xl font-light text-black mb-8 leading-tight tracking-tight">
                    {t('contactSection.title')}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl mb-6">
                    {t('contactSection.description')}
                </p>

                {/* Solicitud de eliminación de cuenta */}
                <div id="eliminar-cuenta" className="mb-12 max-w-xl">
                    <button
                        type="button"
                        onClick={() => setShowDeleteAccount(prev => !prev)}
                        aria-expanded={showDeleteAccount}
                        aria-controls="eliminar-cuenta-contenido"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        ¿Deseas eliminar tu cuenta?
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${showDeleteAccount ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <div
                        id="eliminar-cuenta-contenido"
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${showDeleteAccount ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                        <div className="overflow-hidden">
                            <div className="pt-4">
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    Si deseas eliminar tu cuenta y todos los datos asociados, envíanos una solicitud
                                    con el correo electrónico registrado en tu cuenta. Procesaremos tu solicitud en
                                    un plazo máximo de 30 días hábiles.
                                </p>
                                <a
                                    href="mailto:Contacto@tincadia.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta&body=Solicito%20la%20eliminaci%C3%B3n%20de%20mi%20cuenta%20asociada%20al%20correo%3A%20%5Bescribe%20tu%20correo%20aqu%C3%AD%5D"
                                    className="inline-block px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                    Solicitar eliminación de cuenta
                                </a>
                                <p className="text-xs text-gray-400 mt-3">
                                    Al solicitar la eliminación, se borrarán permanentemente tus datos personales,
                                    historial de conversaciones y archivos asociados a tu cuenta.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-3">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {t('contactSection.email')}
                    </h3>
                    <p className="text-xl text-black font-semibold hover:text-[#83A98A] transition-colors">
                        <a href={`mailto:${email}`}>{email}</a>
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {t('contactSection.phone')}
                    </h3>
                    <p className="text-xl text-black font-semibold hover:text-[#83A98A] transition-colors">
                        <a href={`tel:${phone}`}>{phone}</a>
                    </p>
                </div>

                {socialLinks && socialLinks.length > 0 && (
                    <div className="col-span-1 sm:col-span-2 pt-6">
                        <div className="flex gap-4 flex-wrap">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.id || link.network}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-2xl bg-slate-50 text-[#83A98A] flex items-center justify-center hover:bg-[#83A98A] hover:text-white transition-all shadow-sm hover:shadow-[#83A98A]/30 group"
                                    title={link.network}
                                >
                                    <SocialIcon network={link.network} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
