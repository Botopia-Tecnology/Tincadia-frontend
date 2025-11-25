'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, Building2, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from './MobileMenu';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export function Navbar() {
  const t = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  
  const navigation = useMemo(() => [
    { name: t('navbar.about'), href: '#nosotros' },
    { name: t('navbar.services'), href: '#servicios', hasDropdown: true },
    { name: t('navbar.courses'), href: '#cursos' },
    { name: t('navbar.pricing'), href: '/pricing' },
    { name: t('navbar.contact'), href: '#contacto' },
  ], [t]);

  const servicesDropdownItems = useMemo(() => [
    {
      name: t('navbar.findInclusiveCompany'),
      description: t('navbar.findInclusiveCompanyDesc'),
      href: '/empresas-inclusivas',
      icon: Building2,
      iconColor: 'bg-blue-100 text-blue-600',
    },
    {
      name: t('navbar.becomeInterpreter'),
      description: t('navbar.becomeInterpreterDesc'),
      href: '/ser-interprete',
      icon: MessageSquare,
      iconColor: 'bg-purple-100 text-purple-600',
    },
  ], [t]);

  // Bloquear scroll cuando el menú está abierto
  useScrollLock(mobileMenuOpen);

  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setServicesDropdownOpen(false);
      }
    };

    if (servicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [servicesDropdownOpen]);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-200 min-h-[64px] flex items-center">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between w-full p-2 lg:px-8"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Logo priority />
          </div>

          {/* Botón hamburguesa */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#83A98A] transition-colors"
              onClick={handleMenuToggle}
              aria-label={mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">
                {mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
              </span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Navegación desktop */}
          <div className="hidden lg:flex lg:gap-x-4 xl:gap-x-6 lg:flex-1 lg:justify-center lg:items-center">
            {navigation.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.name}
                    ref={servicesDropdownRef}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      className="text-sm xl:text-base font-semibold text-gray-900 hover:text-[#83A98A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md px-2 xl:px-3 py-2 flex items-center gap-1 whitespace-nowrap"
                      aria-expanded={servicesDropdownOpen}
                      aria-haspopup="true"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-transform ${
                          servicesDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 mb-2">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            {t('navbar.findJob')}
                          </h3>
                        </div>
                        <div className="space-y-1">
                          {servicesDropdownItems.map((service, index) => {
                            const IconComponent = service.icon;
                            return (
                              <Link
                                key={index}
                                href={service.href}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                                onClick={() => setServicesDropdownOpen(false)}
                              >
                                <div
                                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${service.iconColor} transition-transform group-hover:scale-110`}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[#83A98A] transition-colors">
                                    {service.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {service.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm xl:text-base font-semibold text-gray-900 hover:text-[#83A98A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md px-2 xl:px-3 py-2 whitespace-nowrap"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* CTA desktop */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3 xl:gap-4">
            <LanguageSelector />
            <Link
              href="#cursos"
              className="rounded-lg bg-[#83A98A] px-3 xl:px-4 py-1.5 text-xs xl:text-sm font-semibold text-white shadow-sm hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors whitespace-nowrap"
            >
              {t('navbar.learnMore')}
            </Link>
          </div>
        </nav>
      </header>

      {/* Menú móvil */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={handleMenuClose}
        navigation={navigation}
      />
    </>
  );
}
