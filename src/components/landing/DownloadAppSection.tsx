'use client';

import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export function DownloadAppSection() {
  const t = useTranslation();

  return (
    <section
      id="download"
      className="py-16 lg:py-24 bg-white relative overflow-visible"
      aria-labelledby="download-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
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
          <div className="relative min-h-[400px] lg:min-h-[500px] flex flex-col items-end justify-center">
            {/* Imagen decorativa de fondo */}
            <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-[60%] w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] pointer-events-none z-0">
              <Image
                src="/media/images/mobile.png"
                alt=""
                fill
                className="object-contain"
                unoptimized
                aria-hidden="true"
              />
            </div>

            {/* Contenedor de los QR Codes - Horizontal, debajo de los celulares */}
            <div className="relative z-10 flex flex-row gap-4 mt-[350px] lg:mt-[420px] mr-8 lg:mr-16">
              {/* QR Code Google Play */}
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden shadow-lg bg-white p-1">
                <Image
                  src="/media/images/qr-code.png"
                  alt={t('download.scanToDownload')}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              {/* QR Code App Store */}
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden shadow-lg bg-white p-1">
                <Image
                  src="/media/images/qr-code-appstore.png"
                  alt={t('download.scanToDownload')}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

