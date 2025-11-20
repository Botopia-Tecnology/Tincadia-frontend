'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navigation = [
  { name: 'Nosotros', href: '#nosotros' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Cursos', href: '#cursos' },
  { name: 'Contáctanos', href: '#contacto' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cerrar menú con tecla Escape (accesibilidad)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link 
            href="/" 
            className="-m-1.5 p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md"
            aria-label="Tincadia - Inicio"
          >
            <span className="sr-only">Tincadia</span>
            <div className="flex items-center gap-2">
              <div className="relative w-40 h-40 -my-20" aria-hidden="true">
              <Image
                    src="/media/images/main_logo.png"
                    alt="Logo Tincadia"
                    fill
                    className="object-contain"
                  />
              </div>
            </div>
          </Link>
        </div>

        {/* Botón menú móvil */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#83A98A]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className="sr-only">
              {mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            </span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Navegación desktop */}
        <div className="hidden lg:flex lg:gap-x-8 lg:flex-1 lg:justify-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base font-semibold text-gray-900 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md px-3 py-2 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Botón CTA desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="#cursos"
            className="rounded-lg bg-[#83A98A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors"
          >
            Aprende más
          </Link>
        </div>
      </nav>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div className="fixed inset-0 z-50 bg-black/20" aria-hidden="true" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="-m-1.5 p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md"
                aria-label="Tincadia - Inicio"
              >
                <span className="sr-only">Tincadia</span>
                <div className="flex items-center gap-2">
                  <div className="relative w-16 h-16" aria-hidden="true" />
                  <Image
                        src="/media/images/main_logo.png"
                        alt="Logo Tincadia"
                        fill
                        className="object-contain"
                      />
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#83A98A]"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <span className="sr-only">Cerrar menú</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tincadia-green"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="#cursos"
                    className="block w-full rounded-lg bg-[#83A98A] px-6 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Aprende más
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}