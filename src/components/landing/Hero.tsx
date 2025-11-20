'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';



// Palabras que rotan
const rotatingWords = [
  'barreras',
  'exclusión',
  'fronteras',
  'distancias',
  'límites',
  'obstáculos',
  'silencios',
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showStaticText, setShowStaticText] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Asegurar que el video se reproduce en loop
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, []);

  // Animación inicial y rotación de palabras
  useEffect(() => {
    // Mostrar "Tecnología que rompe" primero
    const showStaticTimer = setTimeout(() => {
      setShowStaticText(true);
    }, 300);

    // Mostrar video al mismo tiempo que el texto
    const showVideoTimer = setTimeout(() => {
      setShowVideo(true);
    }, 300);

    // Mostrar primera palabra después
    const showWordTimer = setTimeout(() => {
      setShowWord(true);
    }, 1000);

    // Mostrar descripción después de la primera palabra
    const showDescTimer = setTimeout(() => {
      setShowDescription(true);
    }, 2000);

    // Iniciar rotación de palabras
    const rotationInterval = setInterval(() => {
      setIsAnimating(true);
      setShowWord(false);

      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
        setShowWord(true);
      }, 600); // Tiempo para el wipe out
    }, 3000); // Cambiar cada 3 segundos

    return () => {
      clearTimeout(showStaticTimer);
      clearTimeout(showVideoTimer);
      clearTimeout(showWordTimer);
      clearTimeout(showDescTimer);
      clearInterval(rotationInterval);
    };
  }, []);

  return (
    <section 
      className="relative bg-gray-50 pt-24 pb-4 lg:pt-32 lg:pb-6 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="text-center lg:text-left z-10">
            <h1 
              id="hero-heading"
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]"
            >
              <span 
                className={`inline-block ${showStaticText ? 'animate-reveal' : 'opacity-0'}`}
                style={{ animationDelay: '0s' }}
              >
                Tecnología que rompe{' '}
              </span>
              <br className="sm:hidden" />
              <span 
                className={`inline-block text-[#83A98A] ${
                  showWord && !isAnimating 
                    ? 'animate-reveal' 
                    : isAnimating 
                    ? 'animate-wipe-out' 
                    : 'opacity-0'
                }`}
                key={currentWordIndex}
              >
                {rotatingWords[currentWordIndex]}
              </span>
            </h1>
            
            <p 
              className={`mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto lg:mx-0 transition-all duration-1000 ${
                showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              En Tincadia creamos soluciones inclusivas que conectan a personas 
              sordas, oyentes y organizaciones. Desarrollamos tecnología accesible, 
              inteligencia artificial y herramientas de comunicación que hacen posible 
              un mundo donde todos pueden participar sin límites.
            </p>

            
            <div 
              className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-300 ${
                showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
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
          <div className={`relative lg:h-[500px] flex items-center justify-center transition-all duration-1000 overflow-visible ${
            showVideo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Contenedor con letras rotativas - más grande para no cortar letras */}
            <div className="relative w-[600px] h-[600px] sm:w-[700px] sm:h-[700px] lg:w-[750px] lg:h-[750px] flex items-center justify-center overflow-visible">
              
              {/* Video circular - Opción 1: Video HTML5 */}
              <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] z-0">
                
                <div className="absolute inset-0 bg-[#83A98A]/20 rounded-full blur-3xl" aria-hidden="true" />
                
                
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#83A98A] shadow-2xl ring-4 ring-white">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover scale-113"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Video de presentación de Tincadia"
                  >
                    <source src="/media/videos/hero-animation.mp4" type="video/mp4" />
                    
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>

              {/* Letras rotativas alrededor del círculo */}
              <div className="absolute inset-0 z-10 overflow-visible" style={{ transformOrigin: '50% 50%' }}>
                {['T', 'E', 'C', 'N', 'O', 'L', 'O', 'G', 'I', 'A'].map((letter, index) => {
                  const totalLetters = 10;
                  // Distribuir las letras uniformemente en 360 grados
                  const initialAngle = (index * 360) / totalLetters - 90; // -90 para empezar desde arriba
                  const radius = 220; // Radio en píxeles
                  const animationDelay = (index * 20) / totalLetters; // Delay para que cada letra comience en su posición
                  
                  return (
                    <span
                      key={index}
                      className="absolute text-2xl sm:text-3xl lg:text-4xl font-bold text-black animate-letter-circle"
                      style={{
                        left: '50%',
                        top: '50%',
                        width: '1em',
                        height: '1em',
                        marginLeft: '-0.5em',
                        marginTop: '-0.5em',
                        transform: `rotate(${initialAngle}deg) translateX(${radius}px) rotate(${-initialAngle}deg)`,
                        transformOrigin: 'center center',
                        animationDelay: `${-animationDelay}s`,
                      } as React.CSSProperties}
                    >
                      {letter}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección "En nosotros confían" */}
      <div className="mt-16 lg:mt-20 py-12 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            En nosotros{' '}
            <span className="text-[#83A98A] relative inline-block">
              confían
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#83A98A]/30" aria-hidden="true" />
            </span>
          </h2>
        </div>
        
        {/* Carrusel infinito de logos - Full width con fade en los bordes */}
        <div className="relative overflow-hidden w-full">
          {/* Gradient fade izquierdo */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 lg:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" aria-hidden="true" />
          
          {/* Gradient fade derecho */}
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 lg:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" aria-hidden="true" />
          
          <div className="relative overflow-hidden">
            <div className="flex items-center animate-scroll-smooth py-4 gap-12 md:gap-16">
              {/* Repetimos los logos múltiples veces para loop sin costuras */}
              {[...Array(6)].map((_, setIndex) => (
                <div key={setIndex} className="flex items-center gap-8 md:gap-10 flex-shrink-0">
                  <div className="relative h-6 w-20 md:h-8 md:w-24 lg:h-10 lg:w-28 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                    <Image
                      src="/media/images/logo_almia.png"
                      alt={setIndex === 0 ? "Logo Almia - Cliente de Tincadia" : ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="relative h-10 w-28 md:h-12 md:w-32 lg:h-14 lg:w-36 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                    <Image
                      src="/media/images/logo_daste.png"
                      alt={setIndex === 0 ? "Logo Daste - Cliente de Tincadia" : ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="relative h-10 w-28 md:h-12 md:w-32 lg:h-14 lg:w-36 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                    <Image
                      src="/media/images/logo_educatics.png"
                      alt={setIndex === 0 ? "Logo Educatics - Cliente de Tincadia" : ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Indicador visual sutil */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-6">
          <p className="text-center text-sm text-gray-500 italic">
            Pasa el cursor sobre los logos para verlos a color
          </p>
        </div>
      </div>
    </section>
  );
}

