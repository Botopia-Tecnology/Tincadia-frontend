'use client';

import { useState, useMemo } from 'react';
import { UserPlus, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function HowItWorks() {
  const t = useTranslation();
  
  const steps = useMemo(() => {
    const stepsData = t('howItWorks.steps') as Array<{ title: string; description: string }>;
    return [
      {
        id: 1,
        title: stepsData[0].title,
        description: stepsData[0].description,
        icon: UserPlus,
        color: 'from-[#83A98A] to-[#6D8F75]',
        bgColor: 'bg-[#83A98A]/10',
        hoverBgColor: 'hover:bg-[#83A98A]/20',
      },
      {
        id: 2,
        title: stepsData[1].title,
        description: stepsData[1].description,
        icon: ShieldCheck,
        color: 'from-[#83A98A] to-[#6D8F75]',
        bgColor: 'bg-[#83A98A]/10',
        hoverBgColor: 'hover:bg-[#83A98A]/20',
      },
      {
        id: 3,
        title: stepsData[2].title,
        description: stepsData[2].description,
        icon: Zap,
        color: 'from-[#83A98A] to-[#6D8F75]',
        bgColor: 'bg-[#83A98A]/10',
        hoverBgColor: 'hover:bg-[#83A98A]/20',
      },
    ];
  }, [t]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const getProgressWidth = () => {
    if (hoveredStep !== null) {
      return `${(hoveredStep / 3) * 100}%`;
    }
    if (activeStep !== null) {
      return `${(activeStep / 3) * 100}%`;
    }
    return '0%';
  };

  return (
    <section
      id="how-it-works"
      className="py-12 lg:py-16 bg-transparent relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Decoración de fondo */}
      {/* Decoración de fondo eliminada para usar fondo global */}

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Encabezado */}
        <div className="text-center mb-16 lg:mb-20">
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            {t('howItWorks.title')}{' '}
            <span className="text-[#83A98A]">{t('howItWorks.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Timeline con los pasos */}
        <div className="max-w-5xl mx-auto">
          {/* Línea de progreso (desktop) */}
          <div className="hidden lg:block relative mb-16">
            {/* Línea de fondo (gris) */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full" aria-hidden="true" />

            {/* Línea de progreso (verde) */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#83A98A] to-[#6D8F75] -translate-y-1/2 rounded-full transition-all duration-700 ease-out shadow-lg shadow-[#83A98A]/30"
              style={{ width: getProgressWidth() }}
              aria-hidden="true"
            />

            {/* Círculos de los pasos */}
            <div className="relative flex justify-between items-center">
              {steps.map((step) => {
                const Icon = step.icon;
                const isHovered = hoveredStep === step.id;
                const isActive = activeStep === step.id;
                const isPassed = hoveredStep !== null && step.id <= hoveredStep;

                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center"
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                    onClick={() => setActiveStep(step.id === activeStep ? null : step.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Paso ${step.id}: ${step.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveStep(step.id === activeStep ? null : step.id);
                      }
                    }}
                  >
                    {/* Círculo animado */}
                    <div
                      className={`
                        rounded-full bg-white shadow-lg transition-all duration-500 ease-out cursor-pointer
                        ${isHovered || isActive ? 'scale-125 shadow-2xl shadow-[#83A98A]/40' : 'scale-100'}
                        ${isPassed || isHovered || isActive ? 'ring-4 ring-[#83A98A]' : 'ring-2 ring-gray-300'}
                      `}
                      style={{
                        width: isHovered || isActive ? '80px' : '64px',
                        height: isHovered || isActive ? '80px' : '64px',
                      }}
                    >
                      <div
                        className={`
                          w-full h-full rounded-full flex items-center justify-center transition-all duration-500
                          ${isPassed || isHovered || isActive ? 'bg-gradient-to-br from-[#83A98A] to-[#6D8F75]' : 'bg-gray-100'}
                        `}
                      >
                        <Icon
                          className={`
                            transition-all duration-500
                            ${isPassed || isHovered || isActive ? 'text-white' : 'text-gray-400'}
                          `}
                          size={isHovered || isActive ? 40 : 32}
                          strokeWidth={2}
                        />
                      </div>
                    </div>

                    {/* Número del paso */}
                    <div
                      className={`
                        absolute -top-8 font-bold transition-all duration-300
                        ${isHovered || isActive ? 'opacity-0 scale-50' : 'opacity-100 scale-100 text-gray-400'}
                      `}
                      style={{ fontSize: '1.25rem' }}
                    >
                      {step.id}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tarjetas de información */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              const isHovered = hoveredStep === step.id;
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`
                    relative p-6 rounded-2xl transition-all duration-500 cursor-pointer
                    ${isHovered || isActive ? 'bg-gradient-to-br from-[#83A98A]/10 to-[#6D8F75]/10 shadow-xl scale-105' : 'bg-gray-50 shadow-md hover:shadow-lg'}
                  `}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onClick={() => setActiveStep(step.id === activeStep ? null : step.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isHovered || isActive}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveStep(step.id === activeStep ? null : step.id);
                    }
                  }}
                >
                  {/* Círculo en móvil */}
                  <div className="lg:hidden flex items-center gap-4 mb-4">
                    <div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                        ${isHovered || isActive ? 'bg-gradient-to-br from-[#83A98A] to-[#6D8F75] scale-110' : 'bg-gray-200'}
                      `}
                    >
                      <Icon
                        className={`transition-colors duration-300 ${isHovered || isActive ? 'text-white' : 'text-gray-600'}`}
                        size={32}
                        strokeWidth={2}
                      />
                    </div>
                    <div
                      className={`
                        text-3xl font-bold transition-colors duration-300
                        ${isHovered || isActive ? 'text-[#83A98A]' : 'text-gray-300'}
                      `}
                    >
                      {step.id}
                    </div>
                  </div>

                  {/* Contenido */}
                  <h3
                    className={`
                      text-xl lg:text-2xl font-bold mb-3 transition-all duration-300
                      ${isHovered || isActive ? 'text-[#83A98A]' : 'text-gray-900'}
                    `}
                  >
                    {step.title}
                  </h3>

                  <p
                    className={`
                      text-gray-600 transition-all duration-500 overflow-hidden
                      ${isHovered || isActive ? 'max-h-32 opacity-100 text-gray-700' : 'max-h-20 opacity-80'}
                    `}
                    style={{
                      fontSize: isHovered || isActive ? '1rem' : '0.95rem',
                    }}
                  >
                    {step.description}
                  </p>

                  {/* Indicador de interactividad */}
                  <div
                    className={`
                      absolute bottom-4 right-4 transition-all duration-300
                      ${isHovered || isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                    `}
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#83A98A] animate-pulse" />
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

