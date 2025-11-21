'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: Array<{ name: string; href: string }>;
}

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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
        {/* Header (logo + X) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Logo onClick={onClose} />
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

        {/* Links del menú */}
        <nav className="flex-1 overflow-y-auto" aria-label="Navegación móvil">
          <div className="px-6 py-8 space-y-6">
            {navigation.map((item) => (
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
            ))}

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="#cursos"
                className="block w-full rounded-xl bg-[#83A98A] px-6 py-4 text-center text-lg font-semibold text-white shadow-lg hover:bg-[#6D8F75] transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A]"
                onClick={onClose}
              >
                Aprende más
              </Link>
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

