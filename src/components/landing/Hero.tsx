'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

// Iconos flotantes de lenguaje de señas (simulados con emojis/letras por ahora)
const floatingIcons = [
  { id: 1, char: '👋', top: '10%', left: '5%', delay: '0s' },
  { id: 2, char: '🤙', top: '20%', right: '10%', delay: '0.5s' },
  { id: 3, char: '✌️', top: '50%', left: '2%', delay: '1s' },
  { id: 4, char: '👌', top: '70%', right: '5%', delay: '1.5s' },
  { id: 5, char: '🤟', top: '85%', left: '8%', delay: '2s' },
  { id: 6, char: '✋', top: '40%', right: '15%', delay: '2.5s' },
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Asegurar que el video se reproduce en loop
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <section 
      className="relative bg-gray-50 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Contenido del lado izquierdo */}
          <div className="text-center lg:text-left z-10">
            <h1 
              id="hero-heading"
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            >
              Tecnología que rompe{' '}
              <span className="text-[#83A98A]">barreras</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto lg:mx-0">
              En Tincadia creamos soluciones inclusivas que conectan a personas 
              sordas, oyentes y organizaciones. Desarrollamos tecnología accesible, 
              inteligencia artificial y herramientas de comunicación que hacen posible 
              un mundo donde todos pueden participar sin límites.
            </p>

            {/* Botones de acción */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="#nosotros"
                className="rounded-lg bg-[#83A98A] px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors"
                aria-label="Conocer más sobre Tincadia"
              >
                Conocer más
              </Link>
              
              <Link
                href="#contacto"
                className="rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors"
                aria-label="Contactar a Tincadia"
              >
                Contactar
              </Link>
            </div>
          </div>

          {/* Contenedor del video/imagen del lado derecho */}
          <div className="relative lg:h-[500px] flex items-center justify-center">
            {/* Iconos flotantes decorativos */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {floatingIcons.map((icon) => (
                <div
                  key={icon.id}
                  className="absolute text-2xl opacity-40 animate-float"
                  style={{
                    top: icon.top,
                    left: icon.left,
                    right: icon.right,
                    animationDelay: icon.delay,
                  }}
                >
                  {icon.char}
                </div>
              ))}
            </div>

              {/* Video circular - Opción 1: Video HTML5 */}
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px]">
              {/* Fondo decorativo */}
              <div className="absolute inset-0 bg-[#83A98A]/20 rounded-full blur-3xl" aria-hidden="true" />
              
              {/* Video circular */}
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#83A98A]/30 shadow-2xl ring-4 ring-white">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="Video de presentación de Tincadia"
                >
                  <source src="/media/videos/hero-animation.mp4" type="video/mp4" />
                  {/* Fallback para navegadores sin soporte de video */}
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección "En nosotros confían" */}
      <div className="mt-20 lg:mt-32 py-12 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Título estilizado */}
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 tracking-tight">
            En nosotros{' '}
            <span className="text-[#83A98A] relative inline-block">
              confían
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#83A98A]/30" aria-hidden="true" />
            </span>
          </h2>
          
          {/* Carrusel infinito de logos */}
          <div className="relative overflow-hidden">
            <div className="flex items-center animate-scroll">
              {/* Primera iteración de logos */}
              <div className="flex items-center justify-around min-w-full gap-16 px-8">
                <div className="relative h-16 w-40 md:h-20 md:w-48 lg:h-24 lg:w-56 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                  <Image
                    src="/media/images/logo_almia.png"
                    alt="Logo Almia - Cliente de Tincadia"
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="relative h-16 w-40 md:h-20 md:w-48 lg:h-24 lg:w-56 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                  <Image
                    src="/media/images/logo_daste.png"
                    alt="Logo Daste - Cliente de Tincadia"
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="relative h-16 w-40 md:h-20 md:w-48 lg:h-24 lg:w-56 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                  <Image
                    src="/media/images/logo_educatics.png"
                    alt="Logo Educatics - Cliente de Tincadia"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Segunda iteración de logos (para efecto infinito) */}
              <div className="flex items-center justify-around min-w-full gap-16 px-8">
                <div className="relative h-16 w-40 md:h-20 md:w-48 lg:h-24 lg:w-56 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                  <Image
                    src="/media/images/logo_almia.png"
                    alt="Logo Almia"
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="relative h-16 w-40 md:h-20 md:w-48 lg:h-24 lg:w-56 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                  <Image
                    src="/media/images/logo_daste.png"
                    alt="Logo Daste"
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="relative h-16 w-40 md:h-20 md:w-48 lg:h-24 lg:w-56 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                  <Image
                    src="/media/images/logo_educatics.png"
                    alt="Logo Educatics"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Indicador visual sutil */}
          <p className="text-center text-sm text-gray-500 mt-8 italic">
            Pasa el cursor sobre los logos para verlos a color
          </p>
        </div>
      </div>
    </section>
  );
}

