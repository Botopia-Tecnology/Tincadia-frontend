'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Building2, Users, Heart, BookOpen, Briefcase, Scale, Globe, Handshake, Network, Zap, Target, ArrowRight } from 'lucide-react';

// Componente interno para animaciones de scroll (Scroll Reveal)
function ScrollReveal({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1) transform ${isVisible ? 'opacity-100 translate-y-0 filter blur-0' : 'opacity-0 translate-y-12 filter blur-sm'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export function ImpactSection() {
    const t = useTranslation();
    const [activeTab, setActiveTab] = useState<'companies' | 'deafPeople' | 'society'>('companies');
    const containerRef = useRef<HTMLDivElement>(null);

    const tabs = [
        { id: 'companies', label: t('impact.tabs.companies'), icon: Building2 },
        { id: 'deafPeople', label: t('impact.tabs.deafPeople'), icon: Users },
        { id: 'society', label: t('impact.tabs.society'), icon: Heart },
    ] as const;

    const odsItems = [
        { id: '4', label: t('impact.ods.items.education'), icon: BookOpen, color: 'text-[#83A98A]', bg: 'bg-[#83A98A]/10', border: 'border-[#83A98A]/20' },
        { id: '8', label: t('impact.ods.items.work'), icon: Briefcase, color: 'text-[#83A98A]', bg: 'bg-[#83A98A]/10', border: 'border-[#83A98A]/20' },
        { id: '10', label: t('impact.ods.items.inequality'), icon: Scale, color: 'text-[#83A98A]', bg: 'bg-[#83A98A]/10', border: 'border-[#83A98A]/20' },
        { id: '16', label: t('impact.ods.items.peace'), icon: Globe, color: 'text-[#83A98A]', bg: 'bg-[#83A98A]/10', border: 'border-[#83A98A]/20' },
        { id: '17', label: t('impact.ods.items.alliances'), icon: Handshake, color: 'text-[#83A98A]', bg: 'bg-[#83A98A]/10', border: 'border-[#83A98A]/20' },
    ];

    return (
        <section id="nosotros" className="relative py-12 lg:py-16 overflow-hidden bg-white">

            {/* Fondo sutil con patrón suave */}
            <div className="absolute inset-0 -z-20">
                <div className="absolute inset-0 bg-gray-50" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb08_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

                {/* Header */}
                <ScrollReveal>
                    <div className="text-center mb-12 lg:mb-16 px-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#83A98A]/10 border border-[#83A98A]/20 text-[#83A98A] text-sm font-medium mb-6">
                            <Network className="w-4 h-4" />
                            <span>Impacto Social & Tecnología</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6 py-2 leading-tight">
                            {t('impact.title')}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {t('impact.subtitle')}
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Interactive Tabs */}
                    <div className="space-y-8">
                        {/* Tabs Navigation */}
                        <ScrollReveal delay={200}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-2xl border border-gray-200 w-full">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive
                                                    ? 'bg-[#83A98A] text-white shadow-lg shadow-[#83A98A]/20'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={300}>
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group min-h-[300px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#83A98A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 space-y-6">
                                    {(t(`impact.${activeTab}.items`) as unknown as string[]).map((item, index) => (
                                        <div key={index} className="flex gap-4 items-start group/item">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#83A98A]/10 border border-[#83A98A]/20 flex items-center justify-center mt-0.5 group-hover/item:bg-[#83A98A] group-hover/item:text-white transition-colors duration-300">
                                                <ArrowRight className="w-3 h-3 text-[#83A98A] group-hover/item:text-white" />
                                            </div>
                                            <p className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-300">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Business Impact - Redesigned */}
                        <ScrollReveal delay={400}>
                            <div className="relative overflow-hidden rounded-2xl border border-[#83A98A]/30 bg-gradient-to-br from-[#83A98A]/5 to-white p-1">
                                <div className="relative bg-white rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                    <div className="relative">
                                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#83A98A] to-[#6D8F75] flex items-center justify-center shadow-lg shadow-[#83A98A]/20">
                                            <Zap className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center sm:justify-start gap-2">
                                            Impacto Empresarial Real
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#83A98A]/10 text-[#83A98A] border border-[#83A98A]/20 uppercase tracking-wider">
                                                ROI
                                            </span>
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Transformamos el cumplimiento normativo en una ventaja competitiva, mejorando la reputación y el clima laboral de tu organización.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: ODS Network Visualization */}
                    <ScrollReveal delay={500} className="h-full flex items-center">
                        <div className="relative w-full" ref={containerRef}>
                            {/* Central Hub */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="relative w-24 h-24 bg-white rounded-full border-2 border-[#83A98A] shadow-[0_0_30px_rgba(131,169,138,0.2)] flex items-center justify-center z-20 group cursor-default">
                                    <div className="absolute inset-0 rounded-full border border-[#83A98A]/30 animate-ping opacity-20" />
                                    <span className="font-bold text-2xl text-[#83A98A] tracking-tighter">TN</span>

                                    {/* Tooltip */}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-[#83A98A] font-mono bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                                        TINCADIA NETWORK
                                    </div>
                                </div>
                            </div>

                            {/* Orbiting ODS Nodes */}
                            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                                {/* Connecting Lines (SVG) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                    <defs>
                                        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#83A98A" stopOpacity="0" />
                                            <stop offset="50%" stopColor="#83A98A" stopOpacity="0.5" />
                                            <stop offset="100%" stopColor="#83A98A" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {odsItems.map((_, i) => {
                                        const angle = (i * (360 / odsItems.length)) - 90;
                                        const radius = 160; // Distance from center
                                        const center = 250; // SVG center (500/2)
                                        const x = center + radius * Math.cos((angle * Math.PI) / 180);
                                        const y = center + radius * Math.sin((angle * Math.PI) / 180);

                                        return (
                                            <g key={i}>
                                                {/* Static Line */}
                                                <line
                                                    x1={center} y1={center}
                                                    x2={x} y2={y}
                                                    stroke="#e5e7eb"
                                                    strokeWidth="1"
                                                    strokeDasharray="4 4"
                                                />
                                                {/* Animated Beam */}
                                                <circle r="2" fill="#83A98A">
                                                    <animateMotion
                                                        dur={`${3 + i}s`}
                                                        repeatCount="indefinite"
                                                        path={`M${center},${center} L${x},${y}`}
                                                    />
                                                </circle>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Nodes */}
                                {odsItems.map((ods, i) => {
                                    const angle = (i * (360 / odsItems.length)) - 90;
                                    const radius = 160; // Match SVG radius
                                    const x = 50 + (radius / 500) * 100 * Math.cos((angle * Math.PI) / 180) * 2; // Approximate % position
                                    const y = 50 + (radius / 500) * 100 * Math.sin((angle * Math.PI) / 180) * 2;

                                    const Icon = ods.icon;

                                    return (
                                        <div
                                            key={ods.id}
                                            className={`absolute w-16 h-16 -ml-8 -mt-8 rounded-2xl ${ods.bg} ${ods.border} border backdrop-blur-sm flex items-center justify-center group hover:scale-110 transition-transform duration-300 cursor-pointer z-10`}
                                            style={{
                                                left: `calc(50% + ${radius * Math.cos((angle * Math.PI) / 180)}px)`,
                                                top: `calc(50% + ${radius * Math.sin((angle * Math.PI) / 180)}px)`,
                                            }}
                                        >
                                            <Icon className={`w-7 h-7 ${ods.color}`} />

                                            {/* Hover Card */}
                                            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-200 p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 translate-y-2 group-hover:translate-y-0">
                                                <div className="text-xs font-bold text-gray-500 mb-1">ODS {ods.id}</div>
                                                <div className="text-sm font-semibold text-gray-900">{ods.label}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
