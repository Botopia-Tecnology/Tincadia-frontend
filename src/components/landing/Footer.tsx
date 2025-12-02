'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Youtube,

} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const t = useTranslation();
  return (
    <footer className="bg-white/30 backdrop-blur-sm border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Columna 1: Logo + Descarga app */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-20 h-12">
                <Image
                  src="/media/images/main_logo.png"
                  alt="Logo TINCADIA"
                  fill
                  className="object-contain"
                />
              </div>

            </Link>

            <p className="text-sm text-gray-600">
              {t('footer.description')}
            </p>

            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                {t('footer.downloadFree')}
              </p>
              <div className="space-y-3">
                {/* Google Play */}
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-left hover:border-[#83A98A] hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-[24px] h-[24px] flex-shrink-0">
                    <Image
                      src="/media/images/footer/playstore.png"
                      alt="Google Play"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wide text-gray-500">
                      {t('footer.getItOn')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {t('footer.googlePlay')}
                    </span>
                  </div>
                </button>

                {/* App Store */}
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-left hover:border-[#83A98A] hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-[24px] h-[24px] flex-shrink-0">
                    <Image
                      src="/media/images/footer/appstore.png"
                      alt="App Store"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wide text-gray-500">
                      {t('footer.downloadOnThe')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {t('footer.appStore')}
                    </span>
                  </div>
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                {t('footer.comingSoon')}
              </p>
            </div>
          </div>

          {/* Columna 2: Servicio / TINCADIA / Para negocios */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t('footer.service')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="font-semibold text-gray-900">{t('footer.tincadia')}</li>
              <li>
                {t('footer.tincadiaDesc')}
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                {t('footer.forBusiness')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('footer.forBusinessDesc')}
              </p>
            </div>
          </div>

          {/* Columna 3: Contacto + Sitio web */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t('footer.contact')}
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">{t('footer.email')}</p>
                  <a
                    href="mailto:contacto@tincadia.com"
                    className="hover:text-[#83A98A] transition-colors"
                  >
                    contacto@tincadia.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">{t('footer.website')}</p>
                  <p className="text-gray-700">www.tincadia.com</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {t('footer.comingSoon')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 4: Síguenos en redes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t('footer.followUs')}
            </h3>

            <div className="space-y-4 text-sm text-gray-600">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/tincadia/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#83A98A] transition-colors"
              >
                <Linkedin className="w-5 h-5 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">{t('footer.linkedin')}</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/tincadia?igsh=cnM1Y3hjYnZjbzZj"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#83A98A] transition-colors"
              >
                <Instagram className="w-5 h-5 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">{t('footer.instagram')}</p>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/isramirez10?mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#83A98A] transition-colors"
              >
                <Facebook className="w-5 h-5 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">{t('footer.facebook')}</p>
                </div>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/tincadiaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#83A98A] transition-colors"
              >
                <Twitter className="w-5 h-5 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">{t('footer.twitter')}</p>
                </div>
              </a>

              {/* WhatsApp Canal */}
              <a
                href="https://www.whatsapp.com/channel/0029VbAmXrWHVvTVFnnCh82Q"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#83A98A] transition-colors"
              >
                <MessageCircle className="w-5 h-5 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {t('footer.whatsapp')}
                  </p>
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@tincadiaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#83A98A] transition-colors"
              >
                <Youtube className="w-5 h-5 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">{t('footer.youtube')}</p>
                </div>
              </a>

              {/* TikTok 
              <a
                href="https://www.tiktok.com/@tincadiaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#83A98A] transition-colors"
              >
                <Tiktok className="w-5 h-5 mt-0.5 text-[#83A98A]" />
                <div>
                  <p className="font-semibold text-gray-900">TikTok</p>
                  <p className="text-xs">
                    Contenido educativo, motivacional y tecnológico sobre
                    inclusión.
                  </p>
                </div>
               
              </a>
               */}
            </div>
          </div>

        </div>


        {/* Línea divisoria y footer inferior */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
