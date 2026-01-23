'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const t = useTranslation();
  return (
    <footer className="bg-white/30 backdrop-blur-sm border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col items-center justify-center">



          {/* Social Media Section */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
              {t('footer.followUs')}
            </h3>

            <div className="flex flex-wrap justify-center gap-6">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/tincadia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label={t('footer.linkedin')}
              >
                <Linkedin className="w-6 h-6" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/tincadia?igsh=cnM1Y3hjYnZjbzZj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label={t('footer.instagram')}
              >
                <Instagram className="w-6 h-6" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/isramirez10?mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label={t('footer.facebook')}
              >
                <Facebook className="w-6 h-6" />
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/tincadiaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label={t('footer.twitter')}
              >
                <Twitter className="w-6 h-6" />
              </a>

              {/* WhatsApp Canal */}
              <a
                href="https://www.whatsapp.com/channel/0029VbAmXrWHVvTVFnnCh82Q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label={t('footer.whatsapp')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="w-6 h-6"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@tincadiaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label={t('footer.youtube')}
              >
                <Youtube className="w-6 h-6" />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@tincadiaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="w-6 h-6"
                  viewBox="0 0 16 16"
                >
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-10 flex gap-6 text-sm text-gray-500">
            <Link href="/terminos" className="hover:text-[#83A98A] transition-colors hover:underline">
              Términos y Condiciones
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/privacidad" className="hover:text-[#83A98A] transition-colors hover:underline">
              Política de Privacidad
            </Link>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 w-full">
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              {t('footer.copyright').replace('Powered By Botopia Technology S.A.S', '')}{' '}
              <a
                href="https://www.botopia.tech/es"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#83A98A] transition-colors"
                aria-label="Botopia Technology"
              >
                {t('footer.poweredBy').includes('footer.') ? 'Powered By Botopia Technology S.A.S' : t('footer.poweredBy')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
