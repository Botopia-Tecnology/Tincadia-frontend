'use client';

import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export function DownloadAppSection() {
  const t = useTranslation();

  return (
    <section
      id="download"
      className="py-16 lg:py-24 bg-white relative overflow-hidden"
      aria-labelledby="download-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Columna izquierda: Texto y botones */}
          <div className="text-center lg:text-left">
            <h2
              id="download-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            >
              {t('download.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('download.description')}
            </p>

            {/* Botones de descarga */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* App Store */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg border border-gray-300 px-5 py-3.5 hover:border-[#83A98A] hover:bg-gray-50 transition-all group"
                aria-label={t('download.appStoreLabel')}
              >
                <div className="relative w-7 h-7 flex-shrink-0">
                  <Image
                    src="/media/images/footer/appstore.png"
                    alt="App Store"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">
                    {t('download.downloadOnThe')}
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {t('download.appStore')}
                  </span>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg border border-gray-300 px-5 py-3.5 hover:border-[#83A98A] hover:bg-gray-50 transition-all group"
                aria-label={t('download.googlePlayLabel')}
              >
                <div className="relative w-7 h-7 flex-shrink-0">
                  <Image
                    src="/media/images/footer/playstore.png"
                    alt="Google Play"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">
                    {t('download.getItOn')}
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {t('download.googlePlay')}
                  </span>
                </div>
              </a>
            </div>

            {/* Mensaje de próximamente */}
            <p className="mt-6 text-sm text-gray-500 max-w-md mx-auto lg:mx-0">
              {t('download.comingSoon')}
            </p>
          </div>

          {/* Columna derecha: QR Code */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 bg-white p-6 rounded-2xl shadow-2xl">
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                {/* Placeholder para QR Code - reemplazar con imagen real */}
                <div className="text-center p-4">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-gray-400 text-sm">QR Code</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t('download.scanToDownload')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

