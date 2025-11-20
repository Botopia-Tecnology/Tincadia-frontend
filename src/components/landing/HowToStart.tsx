'use client';

import { useState, useEffect } from 'react';
import { Mic, FileText, Video, PenTool } from 'lucide-react';

const features = [
  {
    id: 1,
    title: 'Transcripción de voz a texto',
    subtitle: 'Convierte conversaciones en tiempo real',
    description: 'Captura cualquier conversación y conviértela automáticamente en texto. Participa activamente en clases, reuniones o conversaciones cotidianas sin perder detalle.',
    icon: Mic,
    videoLabel: 'Explicación 1',
    steps: [
      'Activa el micrófono en la aplicación',
      'La IA comienza a transcribir automáticamente',
      'Lee el texto en tiempo real en tu pantalla',
      'Guarda y comparte las transcripciones'
    ],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    title: 'Traducción automática',
    subtitle: 'Accede a contenidos en cualquier formato',
    description: 'Traduce noticias, videos, películas y documentos automáticamente. Accede a subtítulos CC y contenido accesible en múltiples plataformas.',
    icon: FileText,
    videoLabel: 'Explicación 2',
    steps: [
      'Sube o selecciona el contenido a traducir',
      'Elige el formato de salida (texto o subtítulos)',
      'La IA procesa y traduce el contenido',
      'Disfruta del contenido totalmente accesible'
    ],
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 3,
    title: 'Interpretación en LSC',
    subtitle: 'Conéctate con intérpretes profesionales',
    description: 'Accede a intérpretes de Lengua de Señas Colombiana por videollamada o escanea códigos QR en empresas, hospitales y universidades.',
    icon: Video,
    videoLabel: 'Explicación 3',
    steps: [
      'Escanea el código QR o abre la videollamada',
      'Conecta con un intérprete disponible',
      'Comunícate en tiempo real en LSC',
      'Finaliza la sesión y califica el servicio'
    ],
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 4,
    title: 'Asistente de escritura IA',
    subtitle: 'Mejora tu comunicación escrita',
    description: 'Escribe con confianza usando nuestro asistente inteligente que corrige gramática, tono y estilo para cualquier contexto: redes sociales, trabajo o estudios.',
    icon: PenTool,
    videoLabel: 'Explicación 4',
    steps: [
      'Escribe tu mensaje o documento',
      'El asistente sugiere mejoras en tiempo real',
      'Acepta o ajusta las sugerencias',
      'Publica o envía tu texto perfeccionado'
    ],
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export function HowToStart() {
  const [activeTab, setActiveTab] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTab, setDisplayTab] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const activeFeature = features.find(f => f.id === displayTab) || features[0];
  const Icon = activeFeature.icon;

  const handleTabChange = (newTab: number) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Después de la animación de salida, cambiar el contenido
    setTimeout(() => {
      setDisplayTab(newTab);
      setActiveTab(newTab);
      setProgress(0); // Reiniciar progreso aquí
      setIsTransitioning(false);
    }, 300);
  };

  // Auto-play con barra de progreso
  useEffect(() => {
    if (isPaused) return;

    // Incrementar progreso suavemente
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + (100 / 60); // 6 segundos = 60 frames a 10fps
      });
    }, 100);

    // Cambiar de pestaña cuando llega a 100%
    const tabChangeTimeout = setTimeout(() => {
      const nextTab = activeTab === features.length ? 1 : activeTab + 1;
      setIsTransitioning(true);
      
      setTimeout(() => {
        setDisplayTab(nextTab);
        setActiveTab(nextTab);
        setProgress(0);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(tabChangeTimeout);
    };
  }, [activeTab, isPaused]);

  return (
    <section 
      id="how-to-start"
      className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="how-to-start-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 
            id="how-to-start-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Cómo funciona{' '}
            <span className="text-[#83A98A]">TINCADIA</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explora nuestras funcionalidades principales y descubre cómo cada herramienta 
            facilita la comunicación inclusiva.
          </p>
        </div>

        {/* Timeline de pestañas (Desktop) */}
        <div className="hidden lg:block mb-12">
          <div className="relative">
            {/* Línea de conexión horizontal */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" aria-hidden="true" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#83A98A] to-[#6D8F75] transition-all duration-500 -translate-y-1/2"
              style={{ width: `${((activeTab - 1) / 3) * 100}%` }}
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
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="flex-1 flex flex-col items-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-xl p-4"
                    aria-label={`Ver ${feature.title}`}
                    aria-pressed={isActive}
                  >
                    {/* Cuadrado/Rectángulo tipo slide */}
                    <div
                      className={`
                        relative w-full max-w-[140px] h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 mb-3
                        ${isActive || isPassed 
                          ? 'bg-gradient-to-br from-[#83A98A] to-[#6D8F75] shadow-xl scale-105' 
                          : 'bg-white border-2 border-gray-300 group-hover:border-[#83A98A] group-hover:shadow-md'}
                      `}
                    >
                      <FeatureIcon
                        className={`transition-colors duration-300 mb-2 ${
                          isActive || isPassed ? 'text-white' : 'text-gray-400 group-hover:text-[#83A98A]'
                        }`}
                        size={32}
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
                      {isActive && !isPaused && (
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
                        text-sm font-semibold text-center transition-colors duration-300
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

        {/* Contenido de la pestaña activa */}
        <div 
          className={`grid lg:grid-cols-2 gap-12 items-center ${
            isTransitioning ? 'animate-slide-out-up' : 'animate-slide-in-up'
          }`}
          key={`content-${displayTab}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Video placeholder */}
          <div 
            className={`relative rounded-2xl overflow-hidden shadow-2xl ${activeFeature.bgColor} aspect-video flex items-center justify-center transition-all duration-500`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon size={80} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <div className="relative z-10 text-center p-8">
              <div className="inline-block px-6 py-3 bg-white rounded-full shadow-lg">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#83A98A] to-[#6D8F75] bg-clip-text text-transparent">
                  {activeFeature.videoLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {activeFeature.title}
              </h3>
              <p className="text-xl text-[#83A98A] font-semibold mb-4">
                {activeFeature.subtitle}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {activeFeature.description}
              </p>
            </div>

            {/* Pasos */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                ¿Cómo usarlo?
              </h4>
              <ol className="space-y-3">
                {activeFeature.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#83A98A] to-[#6D8F75] text-white font-bold flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

