'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Phone, Mail, Linkedin, Facebook, Instagram, Twitter, Youtube, Upload } from 'lucide-react';
import { useState } from 'react';

export function ContactSection() {
    const t = useTranslation();
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Handle file upload here
        }
    };

    return (
        <section id="contacto" className="min-h-screen bg-transparent relative overflow-hidden flex flex-col">
            <div className="flex-grow container mx-auto px-6 lg:px-12 pt-8 pb-12 lg:pt-12 lg:pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column: Form (Span 5) */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <form className="space-y-8 mt-8 lg:mt-24">
                            <div className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t('contactSection.form.name')}
                                        className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder={t('contactSection.form.phone')}
                                        className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder={t('contactSection.form.email')}
                                        className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        rows={3}
                                        placeholder={t('contactSection.form.message')}
                                        className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 resize-none text-lg transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="px-12 py-4 bg-[#83A98A] text-white font-medium rounded-full hover:bg-[#6D8F75] transition-colors shadow-lg"
                            >
                                {t('contactSection.form.submit')}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Text & Info (Span 7) */}
                    <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-between">
                        <div>
                            <h2 className="text-5xl lg:text-7xl font-light text-black mb-8 leading-tight">
                                {t('contactSection.title')}
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl mb-12">
                                {t('contactSection.description')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                            {/* Contact Details */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    {t('contactSection.email')}
                                </h3>
                                <p className="text-lg text-black font-medium">email@example.com</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    {t('contactSection.phone')}
                                </h3>
                                <p className="text-lg text-black font-medium">123456789</p>
                            </div>

                            {/* Social Icons */}
                            <div className="col-span-1 sm:col-span-2 pt-4">
                                <div className="flex gap-4">
                                    <a href="https://www.facebook.com/isramirez10?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.instagram.com/tincadia?igsh=cnM1Y3hjYnZjbzZj" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.linkedin.com/company/tincadia/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a href="https://x.com/tincadiaapp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


        </section>
    );
}
