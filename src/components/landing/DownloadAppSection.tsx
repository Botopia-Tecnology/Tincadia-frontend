'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export function DownloadAppSection() {
    const t = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // Default to false for SSR

    useEffect(() => {
        const checkMobile = () => {
            // 1024px is a common breakpoint for lg.
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (!sectionRef.current || isMobile) return; // Disable scroll hijack on mobile

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
    }, [animationProgress, isMobile]);

    useEffect(() => {
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // Reset al scroll up
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current || isMobile) return;
            const rect = sectionRef.current.getBoundingClientRect();
            if (rect.top > window.innerHeight * 0.5) {
                setAnimationProgress(0);
                setIsLocked(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    const showState2 = animationProgress > 0.6;
    const fadeProgress = animationProgress > 0.4 ? (animationProgress - 0.4) / 0.6 : 0;

    // Mobile styles overrides
    // Mobile styles overrides
    const block1Style: React.CSSProperties = isMobile ? {
        opacity: 1,
        transform: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    } : {
        opacity: 1 - fadeProgress,
        transform: `translateY(${fadeProgress * -20}px)`,
        pointerEvents: showState2 ? 'none' : 'auto',
        display: showState2 ? 'none' : 'grid',
    };

    const block2Style: React.CSSProperties = isMobile ? {
        opacity: 1,
        transform: 'none',
        visibility: 'visible',
        marginTop: '3rem'
    } : {
        opacity: animationProgress > 0.4 ? (animationProgress - 0.4) / 0.6 : 0,
        transform: `translateY(${30 - (animationProgress * 30)}px) scale(${0.95 + animationProgress * 0.05})`,
        pointerEvents: (animationProgress > 0.5 ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
        visibility: (animationProgress > 0.3 ? 'visible' : 'hidden'),
    };

    return (
        <section
            ref={sectionRef}
            id="download"
            className="py-12 lg:py-24 bg-white relative overflow-hidden z-30" // Reduced py for mobile
            aria-labelledby="download-heading"
        >
            {/* Efecto tech - Hide on mobile if simpler look desired, otherwise keep */}
            {(!isMobile && animationProgress > 0.3 && animationProgress < 0.8) && (
                <div className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500"
                    style={{ opacity: Math.min(0.2, (animationProgress - 0.3) * 0.5) }}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(131, 169, 138, 0.3) 2px, rgba(131, 169, 138, 0.3) 4px)` }} />
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10"> {/* Reduced px for mobile */}
                {/* Content Wrapper for Mobile stacking */}
                <div className={isMobile ? "flex flex-col space-y-12" : ""}>

                    {/* Estado 1: Download 1 */}
                    <div
                        className={`${isMobile ? 'flex flex-col w-full px-2 items-center' : 'grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px]'} transition-all duration-500 ease-out`}
                        style={block1Style}
                    >
                        <div className={`text-center lg:text-left w-full ${isMobile ? 'max-w-[360px] mx-auto' : ''}`}>
                            <h2 id="download-heading" className={`font-bold text-gray-900 mb-4 lg:mb-6 tracking-tight ${isMobile ? 'text-2xl break-words hyphens-auto w-full px-2' : 'text-4xl sm:text-5xl lg:text-6xl'}`}>
                                {t('download.title')}
                            </h2>
                            <p className={`text-gray-600 mb-6 lg:mb-8 mx-auto lg:mx-0 leading-relaxed ${isMobile ? 'text-base w-full px-2 break-words' : 'text-lg lg:text-xl max-w-2xl'}`}>
                                {t('download.description')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a href="#" className="inline-flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 hover:border-[#83A98A] hover:bg-gray-50 transition-all justify-center sm:justify-start"> {/* Adjusted padding/centering */}
                                    <div className="relative w-6 h-6 flex-shrink-0">
                                        <Image src="/media/images/footer/appstore.png" alt="App Store" fill className="object-contain" unoptimized />
                                    </div>
                                    <div className="flex flex-col leading-tight text-left">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-500">{t('download.downloadOnThe')}</span>
                                        <span className="text-sm sm:text-base font-semibold text-gray-900">{t('download.appStore')}</span>
                                    </div>
                                </a>
                                <a href="#" className="inline-flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 hover:border-[#83A98A] hover:bg-gray-50 transition-all justify-center sm:justify-start">
                                    <div className="relative w-6 h-6 flex-shrink-0">
                                        <Image src="/media/images/footer/playstore.png" alt="Google Play" fill className="object-contain" unoptimized />
                                    </div>
                                    <div className="flex flex-col leading-tight text-left">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-500">{t('download.getItOn')}</span>
                                        <span className="text-sm sm:text-base font-semibold text-gray-900">{t('download.googlePlay')}</span>
                                    </div>
                                </a>
                            </div>
                            <p className="mt-6 text-sm text-gray-500 max-w-md mx-auto lg:mx-0">{t('download.comingSoon')}</p>
                        </div>

                        {/* Mobile: Image below text. Desktop: Right column */}
                        <div className={`relative flex items-center ${isMobile ? 'justify-center w-full' : 'justify-end'}`}>
                            <div className={`relative w-full max-w-[300px] h-[300px] sm:max-w-[450px] sm:h-[400px] lg:w-[650px] lg:h-[520px] ${isMobile ? 'mx-auto' : ''}`}>
                                <Image src="/media/images/download_1.png" alt="TINCADIA App" fill className="object-contain lg:object-right" unoptimized priority /> {/* Center obj on mobile */}
                            </div>
                        </div>
                    </div>

                    {/* Estado 2: Download 2 - Stacked on Mobile */}
                    <div
                        className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${isMobile ? 'min-h-0' : 'min-h-[500px]'}`}
                        style={block2Style}
                    >
                        <div className="flex flex-row gap-4 lg:gap-8 mb-0">
                            <div className="relative">
                                {/* Effects */}
                                {!isMobile && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[120%] h-12 rounded-full blur-2xl"
                                    style={{ background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0))', boxShadow: '0 0 60px 25px rgba(59, 130, 246, 0.5)' }} />}

                                <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-44 lg:h-44 rounded-xl overflow-hidden shadow-xl bg-white p-2 z-10">
                                    <Image src="/media/images/qr-code.png" alt={t('download.scanToDownload')} fill className="object-contain" unoptimized />
                                </div>
                            </div>
                            <div className="relative">
                                {!isMobile && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[120%] h-12 rounded-full blur-2xl"
                                    style={{ background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0))', boxShadow: '0 0 60px 25px rgba(59, 130, 246, 0.5)' }} />}

                                <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-44 lg:h-44 rounded-xl overflow-hidden shadow-xl bg-white p-2 z-10">
                                    <Image src="/media/images/qr-code-appstore.png" alt={t('download.scanToDownload')} fill className="object-contain" unoptimized />
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full max-w-[90vw] h-[200px] sm:h-[250px] lg:h-[350px] -mt-2">
                            <Image src="/media/images/download_2.png" alt="TINCADIA App Features" fill className="object-contain" unoptimized />
                        </div>
                    </div>

                </div>
            </div>

            {/* Indicador de progreso - Only for Desktop */}
            {(!isMobile && isLocked && animationProgress < 1) && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    <div className={`w-2 h-2 rounded-full transition-all ${animationProgress > 0.33 ? 'bg-[#83A98A]' : 'bg-gray-300'}`} />
                    <div className={`w-2 h-2 rounded-full transition-all ${animationProgress > 0.66 ? 'bg-[#83A98A]' : 'bg-gray-300'}`} />
                    <div className={`w-2 h-2 rounded-full transition-all ${animationProgress >= 1 ? 'bg-[#83A98A]' : 'bg-gray-300'}`} />
                </div>
            )}
        </section>
    );
}
