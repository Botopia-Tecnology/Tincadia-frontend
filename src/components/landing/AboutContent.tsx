
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

        const items = t('aboutUs.values.items') as unknown as any[];
        return Array.isArray(items) ? items : [];
    };

    const values = getValues();

    const icons = [Heart, Scale, Lightbulb, Shield, Users];

    return (
        <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">

            {/* Mission & Vision Grid */}
            <div className="grid md:grid-cols-2 gap-12 mb-24">
                {/* Mission */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target className="w-32 h-32 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{t('aboutUs.mission.title')}</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {t('aboutUs.mission.description')}
                    </p>
                </div>

                {/* Vision */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Eye className="w-32 h-32 text-[#83A98A]" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#83A98A]/10 flex items-center justify-center text-[#83A98A]">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{t('aboutUs.vision.title')}</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {t('aboutUs.vision.description')}
                    </p>
                </div>
            </div>

            {/* Values Section */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('aboutUs.values.title')}</h2>
                <div className="w-24 h-1 bg-[#83A98A] mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {values.map((value: any, index: number) => {
                    const Icon = icons[index % icons.length];
                    return (
                        <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 mb-6 group-hover:bg-[#83A98A]/10 group-hover:text-[#83A98A] transition-colors">
                                <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
