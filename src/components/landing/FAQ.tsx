'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: '¿Cómo garantiza Tincadia la calidad de los intérpretes?',
    answer: 'Todos nuestros intérpretes pasan por un riguroso proceso de verificación que incluye validación de certificaciones (ILSE, FESORD), pruebas prácticas de interpretación y evaluaciones continuas de calidad. Además, contamos con un sistema de calificaciones y retroalimentación de usuarios que nos permite mantener los más altos estándares de servicio.',
  },
  {
    id: 2,
    question: '¿Están seguros mis datos en la plataforma?',
    answer: 'La seguridad de tus datos es nuestra prioridad. Utilizamos encriptación de extremo a extremo, cumplimos con normativas de protección de datos (GDPR, LOPD), y realizamos auditorías de seguridad periódicas. Tus datos personales nunca son compartidos con terceros sin tu consentimiento explícito.',
  },
  {
    id: 3,
    question: '¿Qué coste tiene el servicio para personas sordas?',
    answer: 'Ofrecemos diferentes planes adaptados a cada necesidad. El Plan Básico es gratuito e incluye funcionalidades esenciales como transcripción de voz a texto y traducción automática. Los planes Profesional y Premium ofrecen características avanzadas con precios competitivos y opciones de pago flexibles.',
  },
  {
    id: 4,
    question: '¿Cómo se seleccionan las empresas en la bolsa de trabajo?',
    answer: 'Las empresas pasan por un proceso de validación que verifica su compromiso real con la inclusión. Evaluamos sus políticas de accesibilidad, cultura organizacional y experiencia previa con talento diverso. Solo empresas certificadas como inclusivas pueden publicar ofertas en nuestra plataforma.',
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section 
      className="py-16 lg:py-20 bg-gray-50"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-gray-600">
            ¿Tienes preguntas? Tenemos respuestas.
          </p>
        </div>

        {/* Acordeón de preguntas */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#83A98A] transition-colors hover:bg-gray-50"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="text-base lg:text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`
                      flex-shrink-0 w-5 h-5 text-[#83A98A] transition-transform duration-300
                      ${isOpen ? 'rotate-180' : 'rotate-0'}
                    `}
                    aria-hidden="true"
                  />
                </button>

                {/* Respuesta (expandible) */}
                <div
                  id={`faq-answer-${faq.id}`}
                  className={`
                    px-6 overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}
                  `}
                  aria-hidden={!isOpen}
                >
                  <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de contacto adicional */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            ¿No encuentras lo que buscas?
          </p>
          <a
            href="#contacto"
            className="inline-block px-6 py-3 bg-[#83A98A] text-white font-semibold rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300"
          >
            Contáctanos directamente
          </a>
        </div>
      </div>
    </section>
  );
}

