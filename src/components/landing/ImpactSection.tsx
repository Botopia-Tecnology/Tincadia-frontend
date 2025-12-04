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

    // ODS Colors restored
    const odsItems = [
        { id: '4', label: t('impact.ods.items.education'), icon: BookOpen, color: 'text-[#C5192D]', bg: 'bg-[#C5192D]/10', border: 'border-[#C5192D]/20', ring: 'ring-[#C5192D]/20' },
        { id: '8', label: t('impact.ods.items.work'), icon: Briefcase, color: 'text-[#A21942]', bg: 'bg-[#A21942]/10', border: 'border-[#A21942]/20', ring: 'ring-[#A21942]/20' },
        { id: '10', label: t('impact.ods.items.inequality'), icon: Scale, color: 'text-[#DD1367]', bg: 'bg-[#DD1367]/10', border: 'border-[#DD1367]/20', ring: 'ring-[#DD1367]/20' },
        { id: '16', label: t('impact.ods.items.peace'), icon: Globe, color: 'text-[#00689D]', bg: 'bg-[#00689D]/10', border: 'border-[#00689D]/20', ring: 'ring-[#00689D]/20' },
        { id: '17', label: t('impact.ods.items.alliances'), icon: Handshake, color: 'text-[#19486A]', bg: 'bg-[#19486A]/10', border: 'border-[#19486A]/20', ring: 'ring-[#19486A]/20' },
    ];

    // Icons for the cards (cycling through them for variety)
    const cardIcons = [Target, Zap, Network, ArrowRight];

    return (
        <section id="nosotros" className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden bg-transparent">

            {/* Background Pattern Removed - Handled by Page */}

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

                {/* Header */}
                <ScrollReveal>
                    <div className="text-center mb-16 lg:mb-20 px-4">
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

                {/* Main Content Grid */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

                    {/* Left Column: Interactive Tabs & Cards */}
                    <div className="w-full lg:w-1/2 space-y-10">
                        {/* Tabs Navigation */}
                        <ScrollReveal delay={200}>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 w-full">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                                                ? 'bg-white text-[#83A98A] shadow-md ring-1 ring-[#83A98A]/20 scale-105'
                                                : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#83A98A]' : 'text-gray-400'}`} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </ScrollReveal>

                        {/* Cards Grid */}
                        <ScrollReveal delay={300}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {(t(`impact.${activeTab}.items`) as unknown as string[]).map((item, index) => {
                                    const CardIcon = cardIcons[index % cardIcons.length];
                                    return (
                                        <div
                                            key={index}
                                            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#83A98A]/10 transition-colors duration-300">
                                                <CardIcon className="w-5 h-5 text-gray-400 group-hover:text-[#83A98A] transition-colors duration-300" />
                                            </div>
                                            <p className="text-gray-700 font-medium leading-relaxed">
                                                {item}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollReveal>

                        {/* Business Impact Highlight */}
                        <ScrollReveal delay={400}>
                            <div className="mt-8 p-6 rounded-2xl bg-[#83A98A]/5 border border-[#83A98A]/10 flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-[#83A98A] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#83A98A]/20">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-900 mb-1">
                                        Impacto Empresarial Real
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Transformamos el cumplimiento normativo en una ventaja competitiva.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: ODS Network Visualization */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center lg:h-[600px]">
                        <ScrollReveal delay={500} className="w-full">
                            <div className="relative w-full aspect-square max-w-[500px] mx-auto" ref={containerRef}>

                                {/* Connecting Lines - Static & Clean */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                    <defs>
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="2" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>
                                    {odsItems.map((ods, i) => {
                                        // Calculate positions for a cleaner layout (semi-circle or distributed)
                                        // Let's stick to the radial layout but with cleaner lines
                                        const angle = (i * (360 / odsItems.length)) - 90;
                                        const radius = 180; // Distance from center
                                        const center = 250; // SVG center (500/2)

                                        // Control points for curved lines (Bezier)
                                        const x = center + radius * Math.cos((angle * Math.PI) / 180);
                                        const y = center + radius * Math.sin((angle * Math.PI) / 180);

                                        // Midpoint for curve
                                        const midX = center + (radius * 0.5) * Math.cos((angle * Math.PI) / 180);
                                        const midY = center + (radius * 0.5) * Math.sin((angle * Math.PI) / 180);

                                        return (
                                            <g key={i}>
                                                {/* Dashed Connector */}
                                                <path
                                                    d={`M${center},${center} Q${midX},${midY} ${x},${y}`}
                                                    fill="none"
                                                    stroke={ods.color.replace('text-[', '').replace(']', '')}
                                                    strokeWidth="1.5"
                                                    strokeDasharray="6 6"
                                                    className="opacity-30"
                                                />
                                                {/* Animated Pulse on Line */}
                                                <circle r="3" fill={ods.color.replace('text-[', '').replace(']', '')} className="opacity-60">
                                                    <animateMotion
                                                        dur={`${4 + i}s`}
                                                        repeatCount="indefinite"
                                                        path={`M${center},${center} Q${midX},${midY} ${x},${y}`}
                                                        keyPoints="0;1"
                                                        keyTimes="0;1"
                                                    />
                                                </circle>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Central Hub */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <div className="relative w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center z-20 group cursor-default border border-gray-100">
                                        <div className="absolute inset-0 rounded-3xl bg-gray-50/50 -z-10 transform rotate-6 scale-95 transition-transform group-hover:rotate-12" />
                                        <div className="absolute inset-0 rounded-3xl bg-gray-50/50 -z-10 transform -rotate-6 scale-95 transition-transform group-hover:-rotate-12" />

                                        <div className="flex flex-col items-center">
                                            <span className="font-bold text-3xl text-gray-900 tracking-tighter">TN</span>
                                            <span className="text-[10px] font-bold text-gray-400 tracking-widest mt-1">NETWORK</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ODS Nodes */}
                                {odsItems.map((ods, i) => {
                                    const angle = (i * (360 / odsItems.length)) - 90;
                                    const radius = 180;

                                    return (
                                        <div
                                            key={ods.id}
                                            className={`absolute w-20 h-20 -ml-10 -mt-10 rounded-2xl bg-white shadow-lg border-2 ${ods.border} flex flex-col items-center justify-center gap-1 group hover:scale-110 transition-all duration-300 cursor-pointer z-30`}
                                            style={{
                                                left: `calc(50% + ${radius * Math.cos((angle * Math.PI) / 180)}px)`,
                                                top: `calc(50% + ${radius * Math.sin((angle * Math.PI) / 180)}px)`,
                                            }}
                                        >
                                            <ods.icon className={`w-8 h-8 ${ods.color} transition-transform duration-300 group-hover:scale-110`} />
                                            <span className={`text-xs font-bold ${ods.color}`}>ODS {ods.id}</span>

                                            {/* Hover Card */}
                                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 p-4 rounded-xl shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-40">
                                                <div className={`w-8 h-1 rounded mb-2 ${ods.bg.replace('/10', '')}`} />
                                                <div className="text-sm font-bold text-gray-900 leading-tight">{ods.label}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
