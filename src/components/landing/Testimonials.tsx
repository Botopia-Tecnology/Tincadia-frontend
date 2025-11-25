'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export function Testimonials() {
  const t = useTranslation();
  
  const testimonials = useMemo(() => {
    const testimonialsData = t('testimonials.testimonials') as Array<{ name: string; role: string; company: string; text: string }>;
    return testimonialsData.map((testimonial, index) => ({
      id: index + 1,
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      rating: 5,
      text: testimonial.text,
      avatar: `/media/images/avatar-${index + 1}.jpg`,
    }));
  }, [t]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getCardStyle = (index: number) => {
    const total = testimonials.length;
    let position = (index - currentIndex + total) % total;

    // Ajustar para mostrar: prev, current, next
    if (position > total / 2) {
      position = position - total;
    }

    if (position === 0) {
      // Tarjeta central (activa)
      return {
        transform: 'translateX(0%) scale(1)',
        opacity: 1,
        zIndex: 30,
        filter: 'blur(0px)',
      };
    } else if (position === 1) {
      // Tarjeta derecha
      return {
        transform: 'translateX(60%) scale(0.85)',
        opacity: 0.5,
        zIndex: 20,
        filter: 'blur(2px)',
      };
    } else if (position === -1) {
      // Tarjeta izquierda
      return {
        transform: 'translateX(-60%) scale(0.85)',
        opacity: 0.5,
        zIndex: 20,
        filter: 'blur(2px)',
      };
    } else {
      // Tarjetas ocultas
      return {
        transform: position > 0 ? 'translateX(100%) scale(0.7)' : 'translateX(-100%) scale(0.7)',
        opacity: 0,
        zIndex: 10,
        filter: 'blur(4px)',
      };
    }
  };

  return (
    <section
      className="py-12 lg:py-16 bg-transparent relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            {t('testimonials.title')}{' '}
            <span className="text-[#83A98A]">{t('testimonials.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Carrusel de tarjetas */}
        <div className="relative h-[500px] lg:h-[450px] flex items-center justify-center">
          {/* Contenedor de tarjetas */}
          <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
            {testimonials.map((testimonial, index) => {
              const style = getCardStyle(index);

              return (
                <div
                  key={testimonial.id}
                  className="absolute w-full max-w-md transition-all duration-700 ease-out"
                  style={style}
                >
                  <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Contenido del testimonio */}
                    <div className="p-8 pb-6">
                      {/* Estrellas */}
                      <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} de 5 estrellas`}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-[#83A98A] text-[#83A98A]"
                            aria-hidden="true"
                          />
                        ))}
                        <span className="ml-2 text-sm font-bold text-gray-900">
                          {testimonial.rating}/5
                        </span>
                      </div>

                      {/* Texto del testimonio */}
                      <blockquote className="text-gray-700 text-base leading-relaxed mb-6">
                        "{testimonial.text}"
                      </blockquote>
                    </div>

                    {/* Footer con avatar y datos */}
                    <div className="bg-gradient-to-r from-[#83A98A] to-[#6D8F75] px-8 py-6 flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                        <div className="w-full h-full bg-white/30 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-white/90 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* Botones de navegación */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 lg:left-4 z-40 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors group"
            aria-label={t('testimonials.previous')}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-[#83A98A] transition-colors" strokeWidth={2.5} />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 lg:right-4 z-40 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-colors group"
            aria-label={t('testimonials.next')}
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-[#83A98A] transition-colors" strokeWidth={2.5} />
          </button>
        </div>

        {/* Indicadores de posición */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentIndex
                  ? 'w-8 bg-[#83A98A]'
                  : 'bg-gray-300 hover:bg-gray-400'}
              `}
              aria-label={`${t('testimonials.goTo')} ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

