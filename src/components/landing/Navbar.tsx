'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from './MobileMenu';
import { useScrollLock } from '@/hooks/useScrollLock';

const navigation = [
  { name: 'Nosotros', href: '#nosotros' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Cursos', href: '#cursos' },
  { name: 'Contáctanos', href: '#contacto' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bloquear scroll cuando el menú está abierto
  useScrollLock(mobileMenuOpen);

  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
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
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">
                {mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              </span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Navegación desktop */}
          <div className="hidden lg:flex lg:gap-x-8 lg:flex-1 lg:justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-semibold text-gray-900 hover:text-[#83A98A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md px-3 py-2"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA desktop */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="#cursos"
              className="rounded-lg bg-[#83A98A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors"
            >
              Aprende más
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
