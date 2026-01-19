'use client';

import Link from 'next/link';
import { GraduationCap, Languages, PenTool } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api-client';
import { ServiceCard } from './ServiceCard';

export function Services() {
  // Force rebuild
  const t = useTranslation();
  const [config, setConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await api.get<any[]>('/content/landing-config');
        const configMap = data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});
        setConfig(configMap);
      } catch (error) {
        console.error('Failed to fetch landing config:', error);
      }
    };
    fetchConfig();
  }, []);

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
      backgroundImage: config['service_1_bg'] || '',
      hoverImage: config['service_1_hover'] || '',
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
      backgroundImage: config['service_2_bg'] || '',
      hoverImage: config['service_2_hover'] || '',
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
      backgroundImage: config['service_3_bg'] || '',
      hoverImage: config['service_3_hover'] || '',
    },
  ], [t, config]);

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              subtitle={service.subtitle}
              description={service.description}
              backgroundImage={service.backgroundImage}
              hoverImage={service.hoverImage}
              primaryAction={service.primaryAction}
              secondaryAction={service.secondaryAction}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

