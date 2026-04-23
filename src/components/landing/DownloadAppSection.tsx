'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { contentService } from '@/services/content.service';
import { ScrollAnimation } from './ScrollAnimation';

const PHONE_IMAGE = 'https://res.cloudinary.com/do1mvhvms/image/upload/v1767786403/mobile_rwiwnz.png';

export function DownloadAppSection() {
    const t = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [qrCodes, setQrCodes] = useState({
        generic: 'https://res.cloudinary.com/do1mvhvms/image/upload/v1767786403/qr-code_bzuhho.png',
        appstore: 'https://res.cloudinary.com/do1mvhvms/image/upload/v1767786403/qr-code-appstore_tmz5qk.png'
    });

    useEffect(() => {
        const fetchQrCodes = async () => {
            try {
                const configs = await contentService.getLandingConfigs();
                const generic = configs.find(c => c.key === 'qr_code_generic')?.value;
                const appstore = configs.find(c => c.key === 'qr_code_appstore')?.value;

                setQrCodes(prev => ({
                    generic: generic || prev.generic,
                    appstore: appstore || prev.appstore
                }));
            } catch (error) {
                console.error('Error fetching QR codes:', error);
            }
        };
        fetchQrCodes();
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ─── Mobile: Static images from the animation sequence ───
    if (isMobile) {
        return (
            <section
                id="download"
                className="py-16 bg-white relative overflow-hidden z-30"
                aria-labelledby="download-heading-mobile"
            >
                <div className="relative z-10 mx-auto max-w-lg px-6">
                    <div className="text-center mb-10">
                        <h2
                            id="download-heading-mobile"
                            className="text-3xl font-bold text-gray-900 mb-4 tracking-tight"
                        >
                            {t('download.title')}
                        </h2>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {t('download.description')}
                        </p>
                    </div>

                    {/* QR Codes at the top for easy access */}
                    <div className="flex justify-center gap-6 mb-10">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md bg-white p-2 border border-gray-100">
                            <Image src={qrCodes.generic} alt="QR Generic" fill className="object-contain" unoptimized />
                        </div>
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md bg-white p-2 border border-gray-100">
                            <Image src={qrCodes.appstore} alt="QR AppStore" fill className="object-contain" unoptimized />
                        </div>
                    </div>

                    {/* Start State Image (Frame 1) */}
                    <div className="relative w-full aspect-video mb-12">
                        <Image
                            src="/frames/frame_0001.jpg"
                            alt="TINCADIA App Start"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>

                    {/* Store buttons */}
                    <div className="flex flex-col gap-4 mb-12">
                        <a href="#" className="inline-flex items-center gap-4 rounded-xl border border-gray-200 px-5 py-4 hover:border-[#83A98A] hover:bg-gray-50 transition-all justify-center shadow-sm">
                            <div className="relative w-7 h-7 flex-shrink-0">
                                <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1767786854/appstore_vqf0e9.jpg" alt="App Store" fill className="object-contain" unoptimized />
                            </div>
                            <div className="flex flex-col leading-tight text-left">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{t('download.downloadOnThe')}</span>
                                <span className="text-base font-bold text-gray-900">{t('download.appStore')}</span>
                            </div>
                        </a>
                        <a href="#" className="inline-flex items-center gap-4 rounded-xl border border-gray-200 px-5 py-4 hover:border-[#83A98A] hover:bg-gray-50 transition-all justify-center shadow-sm">
                            <div className="relative w-7 h-7 flex-shrink-0">
                                <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1767786855/playstore_x0twtw.jpg" alt="Google Play" fill className="object-contain" unoptimized />
                            </div>
                            <div className="flex flex-col leading-tight text-left">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{t('download.getItOn')}</span>
                                <span className="text-base font-bold text-gray-900">{t('download.googlePlay')}</span>
                            </div>
                        </a>
                    </div>

                    {/* Final State Image (Frame 140) */}
                    <div className="text-center mb-6">
                        <p className="text-lg font-bold text-gray-900 mb-6">{t('download.scanToDownload')}</p>
                        <div className="relative w-full aspect-video">
                            <Image
                                src="/frames/frame_0140.jpg"
                                alt="TINCADIA App QR"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    </div>

                    <p className="mt-8 text-sm text-gray-400 text-center italic">{t('download.comingSoon')}</p>
                </div>
            </section>
        );
    }

    // Unified Scroll-controlled animation for large screens
    return (
        <section
            id="download"
            aria-labelledby="download-heading"
            className="relative z-30 bg-white"
        >
            <ScrollAnimation>
                {(progress) => {
                    // Text fades out gradually during image growth (synced with 0-50% scale phase)
                    const initialOpacity = progress <= 0.05
                        ? 1
                        : progress >= 0.30
                            ? 0
                            : 1 - ((progress - 0.05) / 0.25);

                    const qrOpacity = progress <= 0.75
                        ? 0
                        : progress >= 0.95
                            ? 1
                            : (progress - 0.75) / 0.20;

                    return (
                        <>
                            {/* ─── Phase 1: Initial content ─── */}
                            <div
                                className="absolute inset-0 flex flex-col lg:flex-row items-start lg:items-center pointer-events-none"
                                style={{
                                    opacity: initialOpacity,
                                    visibility: initialOpacity > 0 ? 'visible' : 'hidden',
                                }}
                            >
                                <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full flex flex-col lg:flex-row items-start lg:items-center gap-12 pointer-events-auto">
                                    <div className="max-w-xl text-center lg:text-left mt-6 lg:mt-0">
                                        <h2
                                            id="download-heading"
                                            className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight"
                                        >
                                            {t('download.title')}
                                        </h2>
                                        <p className="text-base lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                            {t('download.description')}
                                        </p>

                                        {/* Store buttons */}
                                        <div className="flex flex-row gap-4 mb-6">
                                            <a href="#" className="inline-flex items-center gap-3 rounded-lg border border-gray-300 px-5 py-3 hover:border-[#83A98A] hover:bg-gray-50 transition-all">
                                                <div className="relative w-6 h-6 flex-shrink-0">
                                                    <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1767786854/appstore_vqf0e9.jpg" alt="App Store" fill className="object-contain" unoptimized />
                                                </div>
                                                <div className="flex flex-col leading-tight text-left">
                                                    <span className="text-[10px] uppercase tracking-wide text-gray-500">{t('download.downloadOnThe')}</span>
                                                    <span className="text-base font-semibold text-gray-900">{t('download.appStore')}</span>
                                                </div>
                                            </a>
                                            <a href="#" className="inline-flex items-center gap-3 rounded-lg border border-gray-300 px-5 py-3 hover:border-[#83A98A] hover:bg-gray-50 transition-all">
                                                <div className="relative w-6 h-6 flex-shrink-0">
                                                    <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1767786855/playstore_x0twtw.jpg" alt="Google Play" fill className="object-contain" unoptimized />
                                                </div>
                                                <div className="flex flex-col leading-tight text-left">
                                                    <span className="text-[10px] uppercase tracking-wide text-gray-500">{t('download.getItOn')}</span>
                                                    <span className="text-base font-semibold text-gray-900">{t('download.googlePlay')}</span>
                                                </div>
                                            </a>
                                        </div>

                                        <p className="text-sm text-gray-500 max-w-md">{t('download.comingSoon')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ─── Phase 3: QR codes floating ABOVE the phone ─── */}
                            <div
                                className="absolute inset-0 flex flex-col items-center justify-start pt-[15vh] pointer-events-none"
                                style={{
                                    opacity: qrOpacity,
                                    visibility: qrOpacity > 0 ? 'visible' : 'hidden',
                                }}
                            >
                                <div
                                    className="flex flex-row gap-8 pointer-events-auto"
                                    style={{
                                        transform: `translateY(${(1 - qrOpacity) * 40}px)`,
                                    }}
                                >
                                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-sm p-3 ring-1 ring-gray-200/50 hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src={qrCodes.generic}
                                            alt={t('download.scanToDownload')}
                                            fill
                                            className="object-contain p-2"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-sm p-3 ring-1 ring-gray-200/50 hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src={qrCodes.appstore}
                                            alt={t('download.scanToDownload')}
                                            fill
                                            className="object-contain p-2"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                                <p
                                    className="text-lg font-semibold text-white mt-6 pointer-events-auto"
                                    style={{
                                        transform: `translateY(${(1 - qrOpacity) * 40}px)`,
                                        textShadow: '0 1px 4px rgba(0,0,0,0.7), 0 0 12px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {t('download.scanToDownload')}
                                </p>
                            </div>
                        </>
                    );
                }}
            </ScrollAnimation>
        </section>
    );
}
