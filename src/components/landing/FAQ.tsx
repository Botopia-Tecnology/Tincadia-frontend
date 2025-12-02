'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function FAQ() {
  const t = useTranslation();
  const [openId, setOpenId] = useState<number | null>(null);

  const faqs = useMemo(() => {
    const questions = t('faq.questions');
    // Verificar que sea un array
    if (Array.isArray(questions)) {
      return questions as Array<{ question: string; answer: string }>;
    }
    return [];
  }, [t]);

  const toggleQuestion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      className="py-16 lg:py-20 bg-transparent"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            {t('faq.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Acordeón de preguntas */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === index + 1;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(index + 1)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#83A98A] transition-colors hover:bg-gray-50"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index + 1}`}
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
                  id={`faq-answer-${index + 1}`}
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
            {t('faq.notFound')}
          </p>
          <a
            href="contacto"
            className="inline-block px-6 py-3 bg-[#83A98A] text-white font-semibold rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300"
          >
            {t('faq.contactButton')}
          </a>
        </div>
      </div>
    </section>
  );
}

