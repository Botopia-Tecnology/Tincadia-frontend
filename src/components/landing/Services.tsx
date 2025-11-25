'use client';

import Link from 'next/link';
import { GraduationCap, Languages, PenTool } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo } from 'react';

export function Services() {
  const t = useTranslation();
  
  const services = useMemo(() => [
    {
      id: 'clases-lengua-senas',
      icon: GraduationCap,
      badge: t('services.signLanguage.badge'),
      title: t('services.signLanguage.title'),
      subtitle: t('services.signLanguage.subtitle'),
      description: t('services.signLanguage.description'),
      primaryAction: { text: t('services.signLanguage.primaryAction'), href: '#agendar' },
      secondaryAction: { text: t('services.signLanguage.secondaryAction'), href: '#info-clases' },
      bgColor: 'bg-orange-100',
    },
    {
      id: 'traductor-senas',
      icon: Languages,
      badge: t('services.translator.badge'),
      title: t('services.translator.title'),
      subtitle: t('services.translator.subtitle'),
      description: t('services.translator.description'),
      primaryAction: { text: t('services.translator.primaryAction'), href: '#probar-traductor' },
      secondaryAction: { text: t('services.translator.secondaryAction'), href: '#demo' },
      bgColor: 'bg-teal-100',
    },
    {
      id: 'asistente-redaccion',
      icon: PenTool,
      badge: t('services.writingAssistant.badge'),
      title: t('services.writingAssistant.title'),
      subtitle: t('services.writingAssistant.subtitle'),
      description: t('services.writingAssistant.description'),
      primaryAction: { text: t('services.writingAssistant.primaryAction'), href: '#usar-asistente' },
      secondaryAction: { text: t('services.writingAssistant.secondaryAction'), href: '#como-funciona' },
      bgColor: 'bg-amber-100',
    },
  ], [t]);
  return (
    <section
      className="py-12 lg:py-16 bg-transparent"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            {t('services.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Grid de tarjetas de servicios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;

            return (
              <article
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Imagen / Ilustración placeholder */}
                <div className={`${service.bgColor} h-48 flex items-center justify-center relative`}>
                  {/* Badge superior */}
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-sm">
                    <span className="text-sm font-medium text-gray-700">
                      {service.badge}
                    </span>
                  </div>

                  {/* Icono placeholder - Reemplazar con imagen */}
                  <IconComponent
                    className="w-24 h-24 text-gray-400"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  {/* Menú de opciones (tres puntos) */}
                  <button
                    className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors"
                    aria-label={`Más opciones para ${service.title}`}
                  >
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm font-medium text-gray-600 mb-3">
                    {service.subtitle}
                  </p>

                  <p className="text-gray-600 mb-6 flex-1">
                    {service.description}
                  </p>

                  {/* Botones de acción */}
                  <div className="flex gap-3 mt-auto">
                    <Link
                      href={service.secondaryAction.href}
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors text-center"
                      aria-label={`${service.secondaryAction.text} - ${service.title}`}
                    >
                      {service.secondaryAction.text}
                    </Link>

                    <Link
                      href={service.primaryAction.href}
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#83A98A] rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors text-center"
                      aria-label={`${service.primaryAction.text} - ${service.title}`}
                    >
                      {service.primaryAction.text}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

