'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Mic, FileText, Video, PenTool } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { contentService } from '@/services/content.service';

interface LandingConfigItem {
  key: string;
  value: string;
  description?: string;
}

export function HowToStart() {
  const t = useTranslation();
  const [mediaConfigs, setMediaConfigs] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const configs = await contentService.getLandingConfigs();
        const mediaMap: Record<string, string> = {};
        // Iterate over the array since getLandingConfigs returns LandingConfigItem[]
        if (Array.isArray(configs)) {
          configs.forEach((item: any) => {
            if (item.key && item.key.startsWith('how_to_start_step_')) {
              mediaMap[item.key] = item.value;
            }
          });
        }
        setMediaConfigs(mediaMap);
      } catch (error) {
        console.error('Error fetching landing configs:', error);
      }
    };
    fetchConfigs();
  }, []);

  const features = useMemo(() => {
    const getSteps = (key: string): string[] => {
      const steps = t(key);
      return Array.isArray(steps) ? steps : [];
    };

    return [
      {
        id: 1,
        title: t('howToStart.features.voiceToText.title'),
        subtitle: t('howToStart.features.voiceToText.subtitle'),
        description: t('howToStart.features.voiceToText.description'),
        icon: Mic,
        videoLabel: t('howToStart.features.voiceToText.title'),
        steps: getSteps('howToStart.features.voiceToText.steps'),
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        id: 2,
        title: t('howToStart.features.translation.title'),
        subtitle: t('howToStart.features.translation.subtitle'),
        description: t('howToStart.features.translation.description'),
        icon: FileText,
        videoLabel: t('howToStart.features.translation.title'),
        steps: getSteps('howToStart.features.translation.steps'),
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
      },
      {
        id: 3,
        title: t('howToStart.features.interpretation.title'),
        subtitle: t('howToStart.features.interpretation.subtitle'),
        description: t('howToStart.features.interpretation.description'),
        icon: Video,
        videoLabel: t('howToStart.features.interpretation.title'),
        steps: getSteps('howToStart.features.interpretation.steps'),
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        id: 4,
        title: t('howToStart.features.writingAssistant.title'),
        subtitle: t('howToStart.features.writingAssistant.subtitle'),
        description: t('howToStart.features.writingAssistant.description'),
        icon: PenTool,
        videoLabel: t('howToStart.features.writingAssistant.title'),
        steps: getSteps('howToStart.features.writingAssistant.steps'),
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
      },
    ];
  }, [t]);
  const [activeTab, setActiveTab] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTab, setDisplayTab] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isManualChange, setIsManualChange] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (newTab: number) => {
    if (newTab === activeTab) return;

    setIsManualChange(true);
    setIsTransitioning(true);
    setProgress(0); // Reiniciar progreso inmediatamente

    // Después de la animación de salida, cambiar el contenido
    setTimeout(() => {
      setDisplayTab(newTab);
      setActiveTab(newTab);
      setIsTransitioning(false);

      // Permitir que el scroll vuelva a controlar después de un tiempo
      setTimeout(() => {
        setIsManualChange(false);
      }, 1000);
    }, 300);
  };

  // Scroll parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;

      // Obtener posición de la sección
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calcular cuando la sección entra en viewport
      // Empezamos cuando el top de la sección está en el viewport
      const sectionTop = scrollY + rect.top;
      const sectionBottom = sectionTop + rect.height;

      // Calcular el rango de scroll efectivo (desde que entra hasta que sale)
      const scrollStart = sectionTop - windowHeight * 0.5; // Empezar cuando está a mitad de pantalla
      const scrollEnd = sectionBottom - windowHeight * 0.5;
      const scrollRange = scrollEnd - scrollStart;

      if (scrollRange <= 0) return;

      // Calcular el progreso del scroll dentro de la sección
      const currentScroll = scrollY - scrollStart;
      const scrollProgress = Math.max(0, Math.min(1, currentScroll / scrollRange));

      // Dividir el progreso entre las features
      // Cada feature ocupa 1/n del scroll total
      const featureProgress = scrollProgress * features.length;
      const currentFeatureIndex = Math.min(
        Math.floor(featureProgress),
        features.length - 1
      );
      const featureLocalProgress = (featureProgress - currentFeatureIndex) * 100;

      const newActiveTab = currentFeatureIndex + 1;
      const newProgress = Math.max(0, Math.min(100, featureLocalProgress));

      // Solo actualizar si cambió el tab y no es un cambio manual
      if (newActiveTab !== activeTab && !isManualChange) {
        setIsTransitioning(true);
        setTimeout(() => {
          setDisplayTab(newActiveTab);
          setActiveTab(newActiveTab);
          setIsTransitioning(false);
        }, 300);
      }

      // Actualizar progreso dinámicamente solo si no es un cambio manual
      if (!isManualChange) {
        setProgress(newProgress);
      } else {
        // Si es cambio manual, mantener el progreso en 0
        setProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Llamar una vez para inicializar

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeTab, features.length, isManualChange]);

  return (
    <section
      ref={sectionRef}
      id="how-to-start"
      className="py-12 lg:py-16 bg-transparent"
      aria-labelledby="how-to-start-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2
            id="how-to-start-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            {t('howToStart.title')}{' '}
            <span className="text-[#83A98A]">{t('howToStart.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('howToStart.subtitle')}
          </p>
        </div>

        {/* Timeline de pestañas (Desktop) - Sticky */}
        <div className="hidden lg:block mb-8 lg:sticky lg:top-[68px] lg:z-20 lg:bg-white/90 lg:backdrop-blur-sm lg:py-3 lg:pb-4">
          <div className="relative">
            {/* Línea de conexión horizontal */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" aria-hidden="true" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#83A98A] to-[#6D8F75] transition-all duration-500 -translate-y-1/2"
              style={{ width: `${((activeTab - 1) / (features.length - 1)) * 100}%` }}
              aria-hidden="true"
            />

            {/* Pestañas tipo slides */}
            <div className="relative flex justify-between items-center gap-4">
              {features.map((feature) => {
                const FeatureIcon = feature.icon;
                const isActive = activeTab === feature.id;
                const isPassed = feature.id < activeTab;

                return (
                  <button
                    key={feature.id}
                    onClick={() => handleTabChange(feature.id)}
                    className="flex-1 flex flex-col items-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-xl p-4"
                    aria-label={`Ver ${feature.title}`}
                    aria-pressed={isActive}
                  >
                    {/* Cuadrado/Rectángulo tipo slide */}
                    <div
                      className={`
                        relative w-full max-w-[100px] h-20 rounded-xl flex flex-col items-center justify-center transition-all duration-300 mb-2
                        ${isActive || isPassed
                          ? 'bg-gradient-to-br from-[#83A98A] to-[#6D8F75] shadow-xl scale-[1.02]'
                          : 'bg-white border-2 border-gray-300 group-hover:border-[#83A98A] group-hover:shadow-md'}
                      `}
                    >
                      <FeatureIcon
                        className={`transition-colors duration-300 mb-1 ${isActive || isPassed ? 'text-white' : 'text-gray-400 group-hover:text-[#83A98A]'
                          }`}
                        size={24}
                        strokeWidth={2}
                      />

                      {/* Número del paso */}
                      <span
                        className={`
                          text-xs font-bold transition-colors duration-300
                          ${isActive || isPassed ? 'text-white/80' : 'text-gray-400'}
                        `}
                      >
                        {feature.id}
                      </span>

                      {/* Barra de progreso dentro del cuadrado (solo activa) */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 overflow-hidden rounded-b-xl">
                          <div
                            className="h-full bg-white transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Etiqueta */}
                    <span
                      className={`
                        text-xs font-semibold text-center transition-colors duration-300
                        ${isActive ? 'text-[#83A98A]' : 'text-gray-600 group-hover:text-gray-900'}
                      `}
                    >
                      {feature.title.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pestañas móviles */}
        <div className="lg:hidden mb-8 flex gap-2 overflow-x-auto pb-2">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            const isActive = activeTab === feature.id;

            return (
              <button
                key={feature.id}
                onClick={() => handleTabChange(feature.id)}
                className={`
                  flex-shrink-0 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-[#83A98A] to-[#6D8F75] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
                aria-label={`Ver ${feature.title}`}
                aria-pressed={isActive}
              >
                <FeatureIcon className="inline-block mr-2" size={18} />
                {feature.id}
              </button>
            );
          })}
        </div>

        {/* Contenido con scroll parallax */}
        <div
          ref={contentRef}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Video placeholder - Sticky (solo desktop) */}
          <div
            className="hidden lg:block lg:sticky lg:top-[220px] relative rounded-2xl overflow-hidden shadow-2xl h-[550px] flex items-center justify-center transition-all duration-500 bg-gray-100"
          >
            {features.map((feature) => {
              const FeatureIcon = feature.icon;
              const isActive = displayTab === feature.id;
              const mediaUrl = mediaConfigs[`how_to_start_step_${feature.id}`];
              const isVideo = mediaUrl && mediaUrl.match(/\.(mp4|webm|mov|avi)$/i);

              return (
                <div
                  key={feature.id}
                  className={`absolute inset-0 rounded-2xl ${feature.bgColor} flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                  {mediaUrl ? (
                    isVideo ? (
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FeatureIcon size={80} className="text-gray-300" strokeWidth={1.5} />
                      </div>
                      <div className="relative z-10 text-center p-8">
                        <div className="inline-block px-6 py-3 bg-white rounded-full shadow-lg">
                          <span className="text-2xl font-bold bg-gradient-to-r from-[#83A98A] to-[#6D8F75] bg-clip-text text-transparent">
                            {feature.videoLabel}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Card de contenido mobile */}
          <div className="lg:hidden mb-8">
            {features.map((feature) => {
              const FeatureIcon = feature.icon;
              const isActive = displayTab === feature.id;

              if (!isActive) return null;

              return (
                <div
                  key={feature.id}
                  className={`rounded-2xl ${feature.bgColor} p-8 shadow-xl transition-all duration-500`}
                >
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-4">
                      <FeatureIcon size={40} className="text-gray-600" strokeWidth={2} />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#83A98A] to-[#6D8F75] bg-clip-text text-transparent">
                      {feature.videoLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Información */}
          <div className="space-y-0">
            {features.map((feature) => {
              const isActive = displayTab === feature.id;
              const FeatureIcon = feature.icon;

              return (
                <div
                  key={feature.id}
                  className={`
                    transition-all duration-500
                    ${isActive ? 'block' : 'hidden lg:block'}
                    ${isActive ? 'lg:opacity-100' : 'lg:opacity-30'}
                    lg:min-h-[80vh] flex flex-col justify-center py-12
                  `}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-xl text-[#5A7A62] font-semibold mb-4">
                        {feature.subtitle}
                      </p>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Pasos */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">
                        ¿Cómo usarlo?
                      </h4>
                      <ol className="space-y-3">
                        {feature.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#83A98A] to-[#6D8F75] text-white font-bold flex items-center justify-center text-sm">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700 pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

