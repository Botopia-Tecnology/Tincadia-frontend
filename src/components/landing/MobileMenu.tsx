'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, Building2, MessageSquare, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: Array<{ name: string; href: string; hasDropdown?: boolean }>;
}

const servicesDropdownItems = [
  {
    name: 'Encontrar una empresa inclusiva',
    description: 'Conecta con empresas comprometidas con la inclusión',
    href: '/empresas-inclusivas',
    icon: Building2,
    iconColor: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Convertirte en un intérprete',
    description: 'Únete a nuestra red de intérpretes profesionales',
    href: '/ser-interprete',
    icon: MessageSquare,
    iconColor: 'bg-purple-100 text-purple-600',
  },
];

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const t = useTranslation();
  const { openLoginPanel } = useUI();
  const { user, isAuthenticated, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Manejar foco cuando se abre el menú
  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Enfocar el primer elemento interactivo
      const firstFocusable = menuRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-[60] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación móvil"
    >
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel blanco tipo cortina */}
      <div className="absolute inset-x-0 top-0 h-full bg-white flex flex-col shadow-xl">
        {/* Header (logo + language + X) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Logo onClick={onClose} />
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#83A98A] transition-colors"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <span className="sr-only">Cerrar menú</span>
              <X className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Links del menú */}
        <nav className="flex-1 overflow-y-auto" aria-label="Navegación móvil">
          <div className="px-6 py-8 space-y-6">

            {/* User Profile Section (Top) */}
            {isAuthenticated && user && (
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Hola,</p>
                  <p className="text-lg font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                {user.role === 'Admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800 px-6 py-3 text-center text-lg font-semibold text-white shadow-md hover:bg-slate-700 transition-all"
                    onClick={onClose}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Panel Control
                  </Link>
                )}

                <Link
                  href="/perfil"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-white border-2 border-[#83A98A] px-6 py-3 text-center text-lg font-semibold text-[#83A98A] hover:bg-gray-50 transition-all"
                  onClick={onClose}
                >
                  <User className="w-5 h-5" />
                  Mi Perfil
                </Link>
              </div>
            )}

            {navigation.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.name}
                    className="border-b border-dotted border-gray-200 last:border-0 pb-4"
                  >
                    <button
                      type="button"
                      onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                      className="w-full flex items-center justify-center text-2xl font-bold text-gray-900 hover:text-[#83A98A] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#83A98A] rounded-lg"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-6 h-6 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {servicesDropdownOpen && (
                      <div className="mt-4 space-y-3 pl-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Encuentra trabajo
                        </h3>
                        {servicesDropdownItems.map((service, index) => {
                          const IconComponent = service.icon;
                          return (
                            <Link
                              key={index}
                              href={service.href}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                              onClick={onClose}
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
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={item.name}
                  className="border-b border-dotted border-gray-200 last:border-0 pb-4"
                >
                  <Link
                    href={item.href}
                    className="block text-2xl font-bold text-gray-900 hover:text-[#83A98A] text-center transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#83A98A] rounded-lg"
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                </div>
              );
            })}

            {/* Bottom Actions: Login or Logout */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              {isAuthenticated && user ? (
                <button
                  onClick={async () => {
                    await logout();
                    onClose();
                    window.location.href = '/';
                  }}
                  className="flex items-center justify-center gap-2 w-full text-red-600 font-medium hover:bg-red-50 p-3 rounded-lg transition-colors bg-red-50/50"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              ) : (
                <button
                  onClick={() => {
                    openLoginPanel();
                    onClose();
                  }}
                  className="block w-full rounded-xl bg-[#83A98A] px-6 py-4 text-center text-lg font-semibold text-white shadow-lg hover:bg-[#6D8F75] transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A]"
                >
                  {t('login.loginButton')}
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="py-4 text-center text-gray-400 text-sm border-t border-gray-100">
          &copy; 2025 Tincadia
        </div>
      </div>
    </div>
  );
}

