'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUI } from '@/contexts/UIContext';
import { contentService, type LandingConfigItem } from '@/services/content.service';
import { Ear, EarOff, Brain, Subtitles } from 'lucide-react';

// Letras del título principal (Ya no se usan en órbita, pero se mantienen si se necesitan en otro lado)
const TINCADIA_LETTERS = ['T', 'I', 'N', 'C', 'A', 'D', 'I', 'A'];

interface HeroProps {
  disableAnimations?: boolean;
}

export function Hero({ disableAnimations = false }: HeroProps) {
  const t = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoUrl, setVideoUrl] = useState<string>('https://res.cloudinary.com/dzi2p0pqa/video/upload/v1768965559/c7q4e37io3ahtjscooxx.mp4');
  const [alliances, setAlliances] = useState<LandingConfigItem[]>([]);

  // Fetch content from DB
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const configs = await contentService.getLandingConfigs();

        // Find video
        const videoConfig = configs.find(c => c.key === 'hero_video_url');
        if (videoConfig?.value) {
          setVideoUrl(videoConfig.value);
        }

        // Find alliances/logos
        const allianceConfigs = configs.filter(c =>
          c.key.startsWith('logo_') || c.key.startsWith('alliance_')
        );
        setAlliances(allianceConfigs);

      } catch (error) {
        console.error('Error fetching landing content:', error);
      }
    };
    fetchContent();
  }, []);


  const [currentStep, setCurrentStep] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showTincadia, setShowTincadia] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [email, setEmail] = useState('');

  const { setIsRegistrationPanelOpen, setRegistrationEmail: setGlobalEmail } = useUI();

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
    if (disableAnimations) return;

    let animationFrameId: number;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    const degreesPerSecond = 360 / 15; // 15 segundos por vuelta completa (el doble de rápido)

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
  }, [disableAnimations]);


  // Animación inicial: mostrar TINCADIA, video, texto y arrancar ciclo de conceptos
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const showTincadiaTimer = setTimeout(() => {
      setShowTincadia(true);
    }, 150);

    const showVideoTimer = setTimeout(() => {
      setShowVideo(true);
    }, 150);

    const showWordAndCycleTimer = setTimeout(() => {
      setShowWord(true);

      if (disableAnimations) return;

      // Iniciar ciclo fluido de conceptos con transición suave
      intervalId = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % CONCEPT_STEPS.length);
      }, 1750);
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
      if (intervalId) clearInterval(intervalId);
    };
  }, [disableAnimations, CONCEPT_STEPS.length]);

  const currentConcept = CONCEPT_STEPS[currentStep];

  return (
    <section
      className="relative bg-transparent pt-0 pb-4 lg:pt-20 lg:pb-6 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
        backgroundSize: `4rem 4rem`,
        opacity: 0.6
      }} />

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
                onClick={() => {
                  setGlobalEmail(email);
                  setIsRegistrationPanelOpen(true);
                }}
                className="rounded-r-lg sm:rounded-l-none rounded-l-lg sm:rounded-r-lg bg-[#83A98A] px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(131,169,138,0.39)] hover:shadow-[0_6px_20px_rgba(131,169,138,0.23)] hover:bg-[#5A7A62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all whitespace-nowrap"
                aria-label={t('hero.startButtonLabel')}
              >
                {t('hero.startButton')}
              </button>
            </div>
          </div>

          {/* Columna de video / círculo */}
          {/* Columna de video / personaje con órbita */}
          <div
            className={`relative lg:h-[600px] flex items-center justify-center transition-all duration-1000 overflow-visible order-1 lg:order-2 ${showVideo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center overflow-visible">
              
              {/* Elliptical Orbits SVG (Fondo) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                 <svg width="100%" height="100%" viewBox="-400 -200 800 400" className="opacity-50">
                    <ellipse cx="0" cy="0" rx="260" ry="90" stroke="#83A98A" strokeWidth="2" fill="none" transform="rotate(-15)" />
                    <ellipse cx="0" cy="0" rx="210" ry="70" stroke="#83A98A" strokeWidth="1" fill="none" transform="rotate(10)" />
                    <ellipse cx="0" cy="0" rx="240" ry="110" stroke="#83A98A" strokeWidth="1" fill="none" strokeDasharray="6,6" transform="rotate(-5)" />
                 </svg>
              </div>

              {/* El personaje (Video con soft-mask para fundir los bordes rectangulares) */}
              <div className="relative w-[320px] h-[320px] lg:w-[500px] lg:h-[500px] z-10 flex items-center justify-center">
                {/* Glow brillante detrás del personaje */}
                <div className="absolute inset-0 bg-white/60 rounded-full blur-3xl" aria-hidden="true" />

                <div 
                  className="relative w-full h-full"
                  style={{
                    WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 75%)',
                    maskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 75%)'
                  }}
                >
                  <video
                    key={videoUrl}
                    ref={videoRef}
                    className="w-full h-full object-cover scale-[1.10]"
                    style={{ objectPosition: 'center center' }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Personaje de Tincadia"
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* Orbiting Badges (Íconos de Accesibilidad) */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  { Icon: Ear, offset: 0 },
                  { Icon: EarOff, offset: 90 },
                  { Icon: Brain, offset: 180 },
                  { Icon: Subtitles, offset: 270 }
                ].map((item, index) => {
                   // Calcular la posición en la elipse (más cerradas)
                   const angleInRads = ((orbitAngle + item.offset) % 360) * (Math.PI / 180);
                   const rx = circleRadius * 1.15; // Radio X más estrecho
                   const ry = circleRadius * 0.45; // Radio Y más estrecho
                   const x = Math.cos(angleInRads) * rx;
                   const y = Math.sin(angleInRads) * ry;
                   
                   // Inclinación de la órbita (-15 grados)
                   const tilt = -15 * (Math.PI / 180);
                   const tiltedX = x * Math.cos(tilt) - y * Math.sin(tilt);
                   const tiltedY = x * Math.sin(tilt) + y * Math.cos(tilt);
                   
                   // Si está en la mitad trasera de la órbita, va atrás del personaje (z-0), sino adelante (z-20)
                   const zIndex = tiltedY > 0 ? 20 : 0;
                   const scale = tiltedY > 0 ? 1 : 0.8; // Más pequeño cuando está lejos
                   const opacity = tiltedY > 0 ? 1 : 0.6; // Más difuso cuando está lejos
                   
                   return (
                     <div
                        key={index}
                        className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#83A98A] flex items-center justify-center border-[3px] border-white transition-transform duration-75 ease-linear shadow-[0_0_30px_rgba(131,169,138,0.8)]"
                        style={{
                           left: '50%',
                           top: '50%',
                           marginLeft: '-2rem',
                           marginTop: '-2rem',
                           transform: `translate(${tiltedX}px, ${tiltedY}px) scale(${scale})`,
                           opacity: opacity,
                           zIndex: zIndex
                        }}
                     >
                       <item.Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                     </div>
                   );
                })}
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
            <span className="text-[#5A7A62] relative inline-block">
              confían
              <span
                className="absolute bottom-0 left-0 w-full h-1 bg-[#5A7A62]/30"
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
            <div className="flex items-center animate-scroll py-4 gap-8 md:gap-10 w-max">
              {alliances.length > 0 ? (
                // Seamless Loop: Render the list multiple times (even number) to ensure the total width is large enough.
                // We repeat 12 times. The animation 'animate-scroll' moves -50% (shifting 6 sets).
                // As long as 6 sets are wider than the screen, the loop is invisible.
                Array(12).fill(alliances).flat().map((alliance, index) => (
                  <div
                    // Use index in key because we have duplicates
                    key={`${index}-${alliance.key}`}
                    className="relative h-6 w-20 md:h-8 md:w-24 lg:h-10 lg:w-28 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                    title={alliance.description || ''}
                  >
                    <Image
                      src={alliance.value}
                      alt={alliance.description || "Alianza"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                    />
                  </div>
                ))
              ) : (
                // Skeleton loading state or empty
                <div className="flex items-center justify-center w-full h-10">
                  <span className="text-gray-400 text-sm">Cargando alianzas...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-6">
          <p className="text-center text-sm text-gray-500 italic">
            Pasa el cursor sobre los logos para verlos a color
          </p>
        </div>
      </div>

      {/* Registration Panel removed from here as it is now global in page.tsx */}
    </section>
  );
}
