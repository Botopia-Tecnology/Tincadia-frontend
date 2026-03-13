'use client';

import { useLandingConfig } from '@/hooks/useLandingConfig';
import { TABS } from './constants';
import { Loader2, Settings } from 'lucide-react';

// Sub-components
import { ConfigSection } from '@/components/admin/landing/ConfigSection';
import { SocialLinksSection } from '@/components/admin/landing/SocialLinksSection';
import { HowToStartSection } from '@/components/admin/landing/HowToStartSection';
import { AllianceSection } from '@/components/admin/landing/AllianceSection';
import { TestimonialsSection } from '@/components/admin/landing/TestimonialsSection';
import { FAQSection } from '@/components/admin/landing/FAQSection';
import { CompanyListSection } from '@/components/admin/landing/CompanyListSection';

export default function LandingConfigPage() {
    const {
        loading,
        saving,
        activeTab,
        setActiveTab,
        handleSaveConfig,
        handleDeleteAlliance,
        handleCreateAlliance,
        categorizeConfigs,
        testimonials,
        faqs,
        refresh
    } = useLandingConfig();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Cargando configuración...</p>
            </div>
        );
    }

    const configs = categorizeConfigs();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
                        <Settings className="w-8 h-8 text-blue-500" />
                        Configuración Landing Page
                    </h1>
                    <p className="text-slate-400 mt-1">Administra el contenido dinámico de la página de inicio.</p>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <nav className="sticky top-8 space-y-1.5 bg-slate-800/20 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${isActive 
                                            ? 'bg-blue-600 font-bold text-white shadow-lg shadow-blue-900/20' 
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="text-sm">{tab.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50" />}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'alianzas' && (
                            <AllianceSection 
                                items={configs.alianzas} 
                                onSave={handleSaveConfig} 
                                onDelete={handleDeleteAlliance} 
                                onCreate={handleCreateAlliance} 
                                saving={saving} 
                            />
                        )}
                        {activeTab === 'how_to_start' && <HowToStartSection items={configs.how_to_start} onSave={handleSaveConfig} saving={saving} />}
                        {activeTab === 'qrs' && <ConfigSection items={configs.qrs} onSave={handleSaveConfig} saving={saving} />}
                        {activeTab === 'servicios' && <ConfigSection items={configs.servicios} onSave={handleSaveConfig} saving={saving} />}
                        {activeTab === 'mapas' && <ConfigSection items={configs.mapas} onSave={handleSaveConfig} saving={saving} />}
                        {activeTab === 'testimonios' && <TestimonialsSection testimonials={testimonials} onUpdate={refresh} />}
                        {activeTab === 'inclusive_companies' && <CompanyListSection items={configs.inclusive} onSave={handleSaveConfig} saving={saving} />}
                        {activeTab === 'contact_social' && (
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-6">Información de Contacto</h3>
                                    <ConfigSection 
                                        items={configs.contact_social.filter(c => c.key !== 'social_links')} 
                                        onSave={handleSaveConfig} 
                                        saving={saving} 
                                    />
                                </div>
                                <SocialLinksSection 
                                    item={configs.contact_social.find(c => c.key === 'social_links') || { key: 'social_links', value: '[]', description: 'Redes Sociales', updatedAt: '' }} 
                                    onSave={handleSaveConfig} 
                                    saving={saving} 
                                />
                            </div>
                        )}
                        {activeTab === 'faqs' && <FAQSection faqs={faqs} onUpdate={refresh} />}
                        {activeTab === 'otros' && <ConfigSection items={configs.otros} onSave={handleSaveConfig} saving={saving} />}
                    </div>
                </main>
            </div>
        </div>
    );
}
