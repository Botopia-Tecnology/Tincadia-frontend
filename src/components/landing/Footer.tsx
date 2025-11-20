'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Send, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el email
    console.log('Email enviado:', email);
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Logo y tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/media/images/main_logo.png"
                  alt="Logo Tincadia"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">Tincadia</span>
            </Link>
            <p className="text-sm text-gray-600 mt-4">
              Creando puentes de comunicación para un mundo más inclusivo.
            </p>
          </div>

          {/* PRODUCTO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              PRODUCTO
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#beneficios"
                  className="text-sm text-gray-600 hover:text-[#83A98A] transition-colors"
                >
                  Beneficios
                </Link>
              </li>
              <li>
                <Link
                  href="#como-funciona"
                  className="text-sm text-gray-600 hover:text-[#83A98A] transition-colors"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonios"
                  className="text-sm text-gray-600 hover:text-[#83A98A] transition-colors"
                >
                  Testimonios
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPAÑÍA */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              COMPAÑÍA
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#nosotros"
                  className="text-sm text-gray-600 hover:text-[#83A98A] transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="#empleo"
                  className="text-sm text-gray-600 hover:text-[#83A98A] transition-colors"
                >
                  Empleo
                </Link>
              </li>
              <li>
                <Link
                  href="#contacto"
                  className="text-sm text-gray-600 hover:text-[#83A98A] transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* MANTENTE CONECTADO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              MANTENTE CONECTADO
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Recibe las últimas noticias y actualizaciones.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="email" className="sr-only">
                  Introduce tu email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Introduce tu email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#83A98A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#6D8F75] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Línea divisoria y footer inferior */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              © 2025 Tincadia. Todos los derechos reservados.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/tincadia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label="Síguenos en Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/tincadia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label="Síguenos en LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/tincadia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#83A98A] transition-colors"
                aria-label="Síguenos en Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

