'use client';

import Link from 'next/link';
import {
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Link as LinkIcon,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { contentService } from '@/services/content.service';
import { useState, useEffect } from 'react';

import { SocialIcon } from '@/components/common/SocialIcon';

interface SocialLink {
  id: string;
  network: string;
  url: string;
}

export function Footer() {
  const t = useTranslation();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const social = await contentService.getLandingConfig('social_links');
        if (social?.value) {
          try {
            const parsed = JSON.parse(social.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSocialLinks(parsed);
              return;
            }
          } catch (e) {
            console.error('Error parsing social links:', e);
          }
        }

        setSocialLinks([]);

      } catch (error) {
        console.error('Error fetching social links:', error);
        setSocialLinks([]);
      }
    };

    fetchSocialLinks();
  }, []);

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
              {socialLinks.map((link) => (
                <a
                  key={link.id || link.network}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#83A98A] transition-colors"
                  aria-label={link.network}
                  title={link.network}
                >
                  <SocialIcon network={link.network} className="w-6 h-6" />
                </a>
              ))}
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
