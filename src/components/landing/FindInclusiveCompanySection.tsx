'use client';

import { JobSeekerRegistrationForm } from './JobSeekerRegistrationForm';
import { useTranslation } from '@/hooks/useTranslation';

export function FindInclusiveCompanySection() {
  const t = useTranslation();
  return (
    <section
      id="empresas-inclusivas"
      className="py-16 lg:py-20 bg-transparent min-h-screen"
      aria-labelledby="job-seeker-heading"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2
            id="job-seeker-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            {t('findInclusiveCompany.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('findInclusiveCompany.subtitle')}
          </p>
        </div>

        {/* Formulario */}
        <JobSeekerRegistrationForm />
      </div>
    </section>
  );
}

