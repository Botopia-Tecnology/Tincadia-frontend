'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, ChevronDown, Building2, MessageSquare, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from './MobileMenu';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const router = useRouter();
  const t = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { openLoginPanel } = useUI();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navigation = useMemo(() => [
    { name: t('navbar.about'), href: '/nosotros' },
    { name: t('navbar.services'), href: '#servicios', hasDropdown: true },
    { name: t('navbar.courses'), href: '/cursos' },
    { name: t('navbar.pricing'), href: '/pricing' },
    { name: t('navbar.contact'), href: '/contacto' },
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
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    if (servicesDropdownOpen || userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [servicesDropdownOpen, userDropdownOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 200); // 200ms delay
  };

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
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      className="text-sm xl:text-base font-semibold text-gray-900 hover:text-[#83A98A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md px-2 xl:px-3 py-2 flex items-center gap-1 whitespace-nowrap"
                      aria-expanded={servicesDropdownOpen}
                      aria-haspopup="true"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''
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
                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-300 group hover:translate-x-2"
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
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4 xl:gap-5">
            <LanguageSelector />
            {isLoading ? (
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-full" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Admin Panel Button */}
                {user.role === 'Admin' && (
                  <Link
                    href="/admin"
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Panel Control</span>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-3 pl-4 pr-2 py-1 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-100 dark:to-gray-200 border border-gray-200/80 dark:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A]"
                  >
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-800 group-hover:text-[#83A98A] transition-colors">
                      Hola, <span className="font-semibold">{user.firstName}</span>
                    </span>
                    {/* Avatar with initials */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#83A98A] to-[#6D8F75] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <span className="text-xs font-bold text-white uppercase">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-xs text-gray-500 font-medium">Cuenta</p>
                        <p className="text-sm font-semibold truncate text-gray-900">{user.email}</p>
                      </div>
                      <Link
                        href="/perfil"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#83A98A] transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Perfil
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={openLoginPanel}
                className="rounded-full bg-gradient-to-r from-[#83A98A] to-[#6D8F75] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-200 whitespace-nowrap"
              >
                {t('login.loginButton')}
              </button>
            )}
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
