'use client';

import { InterpreterRegistrationForm } from './InterpreterRegistrationForm';
import { useTranslation } from '@/hooks/useTranslation';

export function BecomeInterpreterSection() {
  const t = useTranslation();
  return (
    <section
      id="ser-interprete"
      className="py-16 lg:py-20 bg-transparent min-h-screen"
      aria-labelledby="interpreter-heading"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2
            id="interpreter-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            {t('becomeInterpreter.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('becomeInterpreter.subtitle')}
          </p>
        </div>

        {/* Formulario */}
        <InterpreterRegistrationForm />
      </div>
    </section>
  );
}

