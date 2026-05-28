
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Target, Eye, Heart, Scale, Lightbulb, Shield, Users } from 'lucide-react';

export function AboutContent() {
    const t = useTranslation();

    // Helper to safely get array from translation
    const getValues = () => {
        // This assumes the translation returns the array of objects as defined in es.json
        // We might need to cast or access it differently depending on the i18n implementation
        // For now, let's try to map indices if it's not returning an array directly, 
        // but typically useTranslation with full objects works if supported.
        // If strict key-based, we might need a loop.
        // Let's assume we can get the raw object or iterate.
        // Since the previous code used `t('impact.tabs.companies')`, it seems key-based.
        // Let's rely on constructing the array manually 
        // BUT looking at ImpactSection line 112: (t(`impact.${activeTab}.items`) as unknown as string[])
        // It seems it can return arrays.

        const items = t('aboutUs.values.items') as unknown as Array<{ title: string; description: string }>;
        return Array.isArray(items) ? items : [];
    };

    const values = getValues();

    const icons = [Heart, Scale, Lightbulb, Shield, Users];

    return (
        <section className="relative pt-16 pb-20 px-6 lg:px-8 max-w-[90rem] mx-auto overflow-hidden">
            {/* Background geometric elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                {/* Dot grid pattern (top left) */}
                <div className="absolute top-10 left-10 w-64 h-64 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
                {/* Thin lines giving tech feel */}
                <svg className="absolute w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,150 Q400,400 1000,0" stroke="#83A98A" fill="none" strokeWidth="0.5" />
                    <path d="M-100,500 Q500,50 1400,600" stroke="#83A98A" fill="none" strokeWidth="0.5" />
                    <path d="M800,-100 Q900,500 1600,200" stroke="#94a3b8" fill="none" strokeWidth="0.5" />
                </svg>
            </div>

            {/* Section Title */}
            <div className="text-center mb-16 relative z-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-3">¿Quiénes Somos?</h1>
                <div className="w-16 h-1.5 bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] mx-auto rounded-full mb-6"></div>
                <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
                    Conoce nuestra misión, visión y los valores que nos guían
                </p>
            </div>

            {/* Mission & Vision Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-24 relative z-10 max-w-5xl mx-auto">
                {/* Mission */}
                <div className="bg-gradient-to-br from-[#E9E4FC] via-white to-[#E1F4EA] p-10 rounded-[2rem] border border-white/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                    <div className="mb-6 flex items-start">
                        <div className="relative">
                            <Target className="w-14 h-14 text-[#4F46E5]" strokeWidth={2} />
                            <div className="absolute top-1/2 -translate-y-1/2 left-10">
                                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 6 Q 10 -4, 20 6 T 40 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
                                    <path d="M0 12 Q 10 2, 20 12 T 40 12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
                                    <path d="M0 18 Q 10 8, 20 18 T 40 18" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.2"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-[2.5rem] font-bold text-[#0F172A] mb-6 leading-tight">{t('aboutUs.mission.title')}</h2>
                    <p className="text-gray-900 leading-relaxed text-[1.05rem] font-medium">
                        {t('aboutUs.mission.description')}
                    </p>
                </div>

                {/* Vision */}
                <div className="bg-gradient-to-br from-[#E1F4EA] via-white to-[#E9E4FC] p-10 rounded-[2rem] border border-white/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                    <div className="mb-6 flex items-start">
                        <div className="relative">
                            <Eye className="w-14 h-14 text-[#10B981]" strokeWidth={2} />
                            <div className="absolute top-1/2 -translate-y-1/2 left-12">
                                <svg width="35" height="24" viewBox="0 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 6 Q 10 -4, 20 6 T 35 6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
                                    <path d="M0 12 Q 10 2, 20 12 T 35 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
                                    <path d="M0 18 Q 10 8, 20 18 T 35 18" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.2"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-[2.5rem] font-bold text-[#0F172A] mb-6 leading-tight">{t('aboutUs.vision.title')}</h2>
                    <p className="text-gray-900 leading-relaxed text-[1.05rem] font-medium">
                        {t('aboutUs.vision.description')}
                    </p>
                </div>
            </div>

            {/* Values Section */}
            <div className="text-center mb-12 relative z-10 mt-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4">{t('aboutUs.values.title') || 'Nuestros Valores'}</h2>
                <p className="text-[1.1rem] text-gray-800 max-w-2xl mx-auto font-medium">
                    Los principios que guían nuestra misión de inclusión tecnológica.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10 max-w-[70rem] mx-auto">
                {values.map((value, index: number) => {
                    const Icon = icons[index % icons.length];
                    const colSpanClass = index < 2 ? "lg:col-span-3" : "lg:col-span-2";
                    
                    return (
                        <div key={index} className={`bg-white p-7 sm:p-9 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-[#10B981]/60 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col ${colSpanClass}`}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[#E1F4EA] flex items-center justify-center text-[#10B981] shrink-0">
                                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] leading-tight">
                                    {index + 1}. {(value.title || '').replace(/^\d+\.\s*/, '')}
                                </h3>
                            </div>
                            <p className="text-gray-800 text-[0.95rem] leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
