'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';
import { RegistrationPanel } from './RegistrationPanel';
import { useTranslation } from '@/hooks/useTranslation';

// Letras del título principal
const TINCADIA_LETTERS = ['T', 'I', 'N', 'C', 'A', 'D', 'I', 'A'];

export function Hero() {
  const t = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showTincadia, setShowTincadia] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [registrationPanelOpen, setRegistrationPanelOpen] = useState(false);
  const [email, setEmail] = useState('');

  // Radio del círculo de letras (responsive)
  const [circleRadius, setCircleRadius] = useState(100);

  // Ángulo global para la órbita de las letras
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Pasos de animación: qué letras resaltar y qué palabra mostrar
  const CONCEPT_STEPS = useMemo(() => [
    {
      highlights: [0], // T
      label: t('hero.concepts.technology'),
    },
    {
      highlights: [1, 2, 3], // INC
      label: t('hero.concepts.inclusion'),
    },
    {
      highlights: [4], // A
      label: t('hero.concepts.accessibility'),
    },
    {
      highlights: [5], // D
      label: t('hero.concepts.disability'),
    },
    {
      highlights: [6, 7], // IA (segunda I y segunda A)
      label: t('hero.concepts.ai'),
    },
  ], [t]);

  // Asegurar que el video se reproduce en loop
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, []);

  // Ajustar el radio en base al tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 1024) {
        // MÓVIL Y TABLET (hasta 921px)
        setCircleRadius(100);
      } else {
        // DESKTOP
        setCircleRadius(220);
      }
    };

    handleResize(); // calcular al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animación de la órbita de las letras usando requestAnimationFrame para máxima fluidez
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    const degreesPerSecond = 360 / 30; // 30 segundos por vuelta completa

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        setOrbitAngle((prev) => {
          const increment = (degreesPerSecond * frameInterval) / 1000;
          return (prev + increment) % 360;
        });
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Animación inicial: mostrar TINCADIA, video, texto y arrancar ciclo de conceptos
  useEffect(() => {
    const showTincadiaTimer = setTimeout(() => {
      setShowTincadia(true);
    }, 150);

    const showVideoTimer = setTimeout(() => {
      setShowVideo(true);
    }, 150);

    const showWordAndCycleTimer = setTimeout(() => {
      setShowWord(true);
      // Iniciar ciclo fluido de conceptos con transición suave
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % CONCEPT_STEPS.length);
      }, 1750);

      return () => clearInterval(interval);
    }, 750);

    const showDescTimer = setTimeout(() => {
      setShowDescription(true);
    }, 1500);

    // IMPORTANTE: cleanup
    return () => {
      clearTimeout(showTincadiaTimer);
      clearTimeout(showVideoTimer);
      clearTimeout(showWordAndCycleTimer);
      clearTimeout(showDescTimer);
    };
  }, []);

  const currentConcept = CONCEPT_STEPS[currentStep];

  return (
    <section
      className="relative bg-transparent pt-0 pb-4 lg:pt-20 lg:pb-6 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Contenedor principal */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

        <div className="grid lg:grid-cols-2 gap-2 lg:gap-24 items-center">
          {/* Columna de texto */}
          <div className="text-center lg:text-left z-10 order-2 lg:order-1">

            <h1
              id="hero-heading"
              className="flex flex-col items-center text-center gap-2 lg:block lg:text-left"
            >
              {/* TINCADIA en grande, negro, con letras resaltadas en verde */}
              <span
                className={`block font-extrabold tracking-tight ${showTincadia ? 'animate-reveal' : 'opacity-0'
                  }
              text-5xl sm:text-6xl lg:text-7xl`}
                style={{ animationDelay: '0s' }}
              >
                {TINCADIA_LETTERS.map((letter, index) => {
                  const isHighlighted = currentConcept.highlights.includes(index);
                  return (
                    <span
                      key={index}
                      className={`inline-block transition-all ease-in-out ${isHighlighted
                        ? 'text-[#83A98A] scale-110'
                        : 'text-gray-900 scale-100'
                        }`}
                      style={{
                        transitionProperty: 'color, transform',
                        transitionDuration: '350ms',
                      }}
                    >
                      {letter}
                    </span>
                  );
                })}
              </span>

              {/* Palabra / concepto en verde, más pequeño */}
              <span
                className={`block font-semibold text-[#83A98A] text-xl sm:text-2xl lg:text-3xl transition-all ease-in-out ${showWord ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                style={{ transitionDuration: '250ms' }}
                key={currentStep}
              >
                {currentConcept.label}
              </span>
            </h1>

            <p
              className={`mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto lg:mx-0 transition-all duration-1000 ${showDescription
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
              dangerouslySetInnerHTML={{ __html: t('hero.description') }}
            />

            {/* Input + Botón fusionado */}
            <div
              className={`mt-10 flex flex-col sm:flex-row gap-0 justify-center lg:justify-start transition-all duration-1000 delay-300 ${showDescription
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('hero.emailPlaceholder')}
                className="flex-1 px-4 py-3.5 text-base bg-white border border-gray-300 rounded-l-lg sm:rounded-r-none rounded-r-lg sm:border-r-0 focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                aria-label={t('hero.emailLabel')}
              />
              <button
                onClick={() => setRegistrationPanelOpen(true)}
                className="rounded-r-lg sm:rounded-l-none rounded-l-lg sm:rounded-r-lg bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors whitespace-nowrap"
                aria-label={t('hero.startButtonLabel')}
              >
                {t('hero.startButton')}
              </button>
            </div>
          </div>

          {/* Columna de video / círculo */}
          <div
            className={`relative lg:h-[500px] flex items-center justify-center transition-all duration-1000 overflow-visible order-1 lg:order-2 ${showVideo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <div className="relative w-[300px] h-[300px] lg:w-[750px] lg:h-[750px] flex items-center justify-center overflow-visible">
              {/* Círculo del video */}
              <div className="relative w-[160px] h-[160px] lg:w-[450px] lg:h-[450px] z-0">
                <div
                  className="absolute inset-0 bg-[#83A98A]/20 rounded-full blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#83A98A] shadow-2xl ring-8 ring-white">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover scale-100"
                    style={{ objectPosition: 'center center' }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Video de presentación de Tincadia"
                  >
                    <source
                      src="/media/videos/1.mp4"
                      type="video/mp4"
                    />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>

              {/* Letras orbitando alrededor del círculo */}
              <div className="absolute inset-0 z-10 overflow-visible">
                {['T', 'E', 'C', 'N', 'O', 'L', 'O', 'G', 'I', 'A'].map(
                  (letter, index) => {
                    const totalLetters = 10;
                    const baseAngle = (index * 360) / totalLetters - 90;
                    const totalAngle = baseAngle + orbitAngle;
                    const radius = circleRadius;
                    const animationDelay = (index * 20) / totalLetters;

                    return (
                      <span
                        key={index}
                        className="absolute text-xl sm:text-3xl lg:text-4xl font-bold text-black transition-transform duration-75 ease-linear"
                        style={{
                          left: '50%',
                          top: '50%',
                          width: '1em',
                          height: '1em',
                          marginLeft: '-0.5em',
                          marginTop: '-0.5em',
                          transform: `rotate(${totalAngle}deg) translateX(${radius}px) rotate(${-totalAngle}deg)`,
                          transformOrigin: 'center center',
                          animationDelay: `${-animationDelay}s`,
                          willChange: 'transform',
                        }}
                      >
                        {letter}
                      </span>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Logos */}
      <div className="mt-16 lg:mt-20 py-12 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            En nosotros{' '}
            <span className="text-[#83A98A] relative inline-block">
              confían
              <span
                className="absolute bottom-0 left-0 w-full h-1 bg-[#83A98A]/30"
                aria-hidden="true"
              />
            </span>
          </h2>
        </div>

        <div className="relative overflow-hidden w-full">
          <div
            className="absolute left-0 top-0 bottom-0 w-24 md:w-32 lg:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 md:w-32 lg:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden">
            <div className="flex items-center animate-scroll-smooth py-4 gap-12 md:gap-16">
              {[...Array(6)].map((_, setIndex) => (
                <div
                  key={setIndex}
                  className="flex items-center gap-8 md:gap-10 flex-shrink-0"
                >
                  <div className="relative h-6 w-20 md:h-8 md:w-24 lg:h-10 lg:w-28 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                    <Image
                      src="/media/images/logo_almia.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="relative h-10 w-28 md:h-12 md:w-32 lg:h-14 lg:w-36 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                    <Image
                      src="/media/images/logo_daste.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="relative h-10 w-28 md:h-12 md:w-32 lg:h-14 lg:w-36 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                    <Image
                      src="/media/images/logo_educatics.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-6">
          <p className="text-center text-sm text-gray-500 italic">
            Pasa el cursor sobre los logos para verlos a color
          </p>
        </div>
      </div>

      {/* Registration Panel */}
      <RegistrationPanel
        isOpen={registrationPanelOpen}
        onClose={() => setRegistrationPanelOpen(false)}
        initialEmail={email}
      />
    </section>
  );
}
