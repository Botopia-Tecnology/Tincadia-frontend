'use client';

import { Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { SocialIcon } from '@/components/common/SocialIcon';

export function ContactInfo({ email, phone, socialLinks }: any) {
    const t = useTranslation();
    
    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <h2 className="text-5xl lg:text-7xl font-light text-black mb-8 leading-tight tracking-tight">
                    {t('contactSection.title')}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl mb-12">
                    {t('contactSection.description')}
                </p>
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
                            {socialLinks.map((link: any) => (
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
