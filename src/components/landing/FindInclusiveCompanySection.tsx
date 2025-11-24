'use client';

import { JobSeekerRegistrationForm } from './JobSeekerRegistrationForm';

export function FindInclusiveCompanySection() {
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
            Encuentra una Empresa Inclusiva
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Crea tu perfil y accede a oportunidades laborales en empresas comprometidas con la
            inclusión y la diversidad.
          </p>
        </div>

        {/* Formulario */}
        <JobSeekerRegistrationForm />
      </div>
    </section>
  );
}

