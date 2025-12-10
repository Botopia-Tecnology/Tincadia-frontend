'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export function DownloadAppSection() {
    const t = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Bloquear cuando el TOP de la sección está cerca del top de la pantalla
        const shouldLock = rect.top <= windowHeight * 0.3 && rect.top >= -200 && animationProgress < 1;

        if (shouldLock) {
            e.preventDefault();
            e.stopPropagation();
            setIsLocked(true);

            if (e.deltaY > 0) {
                // Scroll down - velocidad más rápida
                setAnimationProgress(prev => Math.min(1, prev + 0.06));
            } else if (e.deltaY < 0 && animationProgress > 0) {
                // Scroll up - retroceder
                setAnimationProgress(prev => {
                    const newVal = Math.max(0, prev - 0.06);
                    if (newVal <= 0) setIsLocked(false);
                    return newVal;
                });
            }
        } else if (animationProgress >= 1) {
            setIsLocked(false);
        }
    }, [animationProgress]);

    useEffect(() => {
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // Reset al scroll up
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            if (rect.top > window.innerHeight * 0.5) {
                setAnimationProgress(0);
                setIsLocked(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showState2 = animationProgress > 0.6;
    const fadeProgress = animationProgress > 0.4 ? (animationProgress - 0.4) / 0.6 : 0;

    return (
        <section
            ref={sectionRef}
            id="download"
            className="py-16 lg:py-24 bg-white relative overflow-hidden z-30"
            aria-labelledby="download-heading"
        >
            {/* Efecto tech */}
            {animationProgress > 0.3 && animationProgress < 0.8 && (
                <div className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500"
                    style={{ opacity: Math.min(0.2, (animationProgress - 0.3) * 0.5) }}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(131, 169, 138, 0.3) 2px, rgba(131, 169, 138, 0.3) 4px)` }} />
                </div>
            )}

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                {/* Estado 1: Download 1 */}
                <div
                    className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] transition-all duration-500 ease-out"
                    style={{
                        opacity: 1 - fadeProgress,
                        transform: `translateY(${fadeProgress * -20}px)`,
                        pointerEvents: showState2 ? 'none' : 'auto',
                        display: showState2 ? 'none' : 'grid',
                    }}
                >
                    <div className="text-center lg:text-left">
                        <h2 id="download-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            {t('download.title')}
                        </h2>
                        <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {t('download.description')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a href="#" className="inline-flex items-center gap-3 rounded-lg border border-gray-300 px-5 py-3.5 hover:border-[#83A98A] hover:bg-gray-50 transition-all">
                                <div className="relative w-7 h-7 flex-shrink-0">
                                    <Image src="/media/images/footer/appstore.png" alt="App Store" fill className="object-contain" unoptimized />
                                </div>
                                <div className="flex flex-col leading-tight text-left">
                                    <span className="text-[10px] uppercase tracking-wide text-gray-500">{t('download.downloadOnThe')}</span>
                                    <span className="text-base font-semibold text-gray-900">{t('download.appStore')}</span>
                                </div>
                            </a>
                            <a href="#" className="inline-flex items-center gap-3 rounded-lg border border-gray-300 px-5 py-3.5 hover:border-[#83A98A] hover:bg-gray-50 transition-all">
                                <div className="relative w-7 h-7 flex-shrink-0">
                                    <Image src="/media/images/footer/playstore.png" alt="Google Play" fill className="object-contain" unoptimized />
                                </div>
                                <div className="flex flex-col leading-tight text-left">
                                    <span className="text-[10px] uppercase tracking-wide text-gray-500">{t('download.getItOn')}</span>
                                    <span className="text-base font-semibold text-gray-900">{t('download.googlePlay')}</span>
                                </div>
                            </a>
                        </div>
                        <p className="mt-6 text-sm text-gray-500 max-w-md mx-auto lg:mx-0">{t('download.comingSoon')}</p>
                    </div>

                    <div className="relative flex items-center justify-end">
                        <div className="relative w-[450px] h-[400px] lg:w-[650px] lg:h-[520px]">
                            <Image src="/media/images/download_1.png" alt="TINCADIA App" fill className="object-contain object-right" unoptimized priority />
                        </div>
                    </div>
                </div>

                {/* Estado 2: Download 2 - aparece progresivamente */}
                <div
                    className="flex flex-col items-center justify-center min-h-[500px] transition-all duration-700 ease-out"
                    style={{
                        // Opacidad progresiva: empieza a aparecer al 40%, llega al 100% al final
                        opacity: animationProgress > 0.4 ? (animationProgress - 0.4) / 0.6 : 0,
                        transform: `translateY(${30 - (animationProgress * 30)}px) scale(${0.95 + animationProgress * 0.05})`,
                        pointerEvents: animationProgress > 0.5 ? 'auto' : 'none',
                        visibility: animationProgress > 0.3 ? 'visible' : 'hidden',
                    }}
                >
                    <div className="flex flex-row gap-4 lg:gap-8 mb-0">
                        <div className="relative">
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[120%] h-12 rounded-full blur-2xl"
                                style={{ background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0))', boxShadow: '0 0 60px 25px rgba(59, 130, 246, 0.5)' }} />
                            <div className="relative w-32 h-32 lg:w-44 lg:h-44 rounded-xl overflow-hidden shadow-xl bg-white p-2 z-10">
                                <Image src="/media/images/qr-code.png" alt={t('download.scanToDownload')} fill className="object-contain" unoptimized />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[120%] h-12 rounded-full blur-2xl"
                                style={{ background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0))', boxShadow: '0 0 60px 25px rgba(59, 130, 246, 0.5)' }} />
                            <div className="relative w-32 h-32 lg:w-44 lg:h-44 rounded-xl overflow-hidden shadow-xl bg-white p-2 z-10">
                                <Image src="/media/images/qr-code-appstore.png" alt={t('download.scanToDownload')} fill className="object-contain" unoptimized />
                            </div>
                        </div>
                    </div>

                    <div className="relative w-[90vw] max-w-[900px] h-[250px] lg:h-[350px] -mt-2">
                        <Image src="/media/images/download_2.png" alt="TINCADIA App Features" fill className="object-contain" unoptimized />
                    </div>
                </div>
            </div>

            {/* Indicador de progreso */}
            {isLocked && animationProgress < 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    <div className={`w-2 h-2 rounded-full transition-all ${animationProgress > 0.33 ? 'bg-[#83A98A]' : 'bg-gray-300'}`} />
                    <div className={`w-2 h-2 rounded-full transition-all ${animationProgress > 0.66 ? 'bg-[#83A98A]' : 'bg-gray-300'}`} />
                    <div className={`w-2 h-2 rounded-full transition-all ${animationProgress >= 1 ? 'bg-[#83A98A]' : 'bg-gray-300'}`} />
                </div>
            )}
        </section>
    );
}
