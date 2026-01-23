'use client';

import { JobSeekerRegistrationForm } from './JobSeekerRegistrationForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect, useState } from 'react';

// ... imports ...
import { MapPin, CheckCircle2, Factory, ArrowRight } from 'lucide-react'; // Add icons if needed, or use svg

export function FindInclusiveCompanySection() {
  const t = useTranslation();
  return (
    <section
      id="empresas-inclusivas"
      className="py-16 lg:py-24 bg-transparent min-h-screen"
      aria-labelledby="job-seeker-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            id="job-seeker-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            {t('findInclusiveCompany.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('findInclusiveCompany.subtitle')}
          </p>
        </div>

        {/* Content Container - Vertical Layout now */}
        <div className="flex flex-col gap-20">

          {/* Form Section - Centered */}
          <div className="w-full max-w-3xl mx-auto">
            <JobSeekerRegistrationForm />
          </div>

          {/* How it works (Optional placeholder if needed, skipping based on user req focus on companies) */}

          {/* Companies Section */}
          <div className="space-y-12">
            <div className="text-center">
              <span className="inline-block h-1 w-20 bg-[#34B7F1] rounded-full mb-6"></span>
              <h3 className="text-3xl font-bold text-gray-900">
                Empresas que <span className="text-gray-900">Apoyan la Inclusión</span>
              </h3>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                *TINCADIA no realiza procesos de selección directa. Facilitamos la conexión entre talento diverso y empresas comprometidas con la inclusión.
              </p>
            </div>

            <CompaniesList />
          </div>

        </div>

      </div>
    </section>
  );
}

function CompaniesList() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Dynamic import to avoid build issues if mocked
        const configs = await import('@/services/content.service').then(m => m.contentService.getLandingConfigs());
        const listConfig = configs.find(c => c.key === 'inclusive_companies_list');
        if (listConfig?.value) {
          setCompanies(JSON.parse(listConfig.value));
        }
      } catch (error) {
        console.error('Error loading companies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) return <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div>;

  if (companies.length === 0) return (
    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
      <p className="text-gray-500">Pronto publicaremos empresas aliadas aquí.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {companies.map((company: any, idx) => (
        <div key={idx} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50">

          {/* Header Badge */}
          <div className="bg-[#2B547E] py-2 px-4 text-center">
            <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
              Empresa Inclusiva
            </span>
          </div>

          <div className="p-6 flex flex-col h-full">
            {/* Logo */}
            <div className="h-20 w-full flex items-center justify-center mb-4">
              {company.imageUrl ? (
                <img src={company.imageUrl} alt={company.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-300">{company.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Name */}
            <h4 className="text-xl font-bold text-gray-900 text-center mb-6">{company.name}</h4>

            {/* Tags/Features Area */}
            <div className="space-y-2 mb-6 bg-gray-50/50 rounded-xl p-3">
              {company.tags && company.tags.length > 0 ? (
                company.tags.map((tag: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="bg-teal-100 text-teal-700 p-0.5 rounded-full"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    <span>{tag}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="bg-teal-100 text-teal-700 p-0.5 rounded-full"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    <span>Inclusión laboral</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="bg-teal-100 text-teal-700 p-0.5 rounded-full"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    <span>Diversidad y accesibilidad</span>
                  </div>
                </>
              )}
            </div>

            {/* Content Spacer */}
            <div className="flex-1"></div>

            {/* Industry + Description */}
            <div className="mb-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span className="text-xs font-medium">{company.industry || 'Tecnología & Servicios'}</span>
              </div>
            </div>

            {/* Button */}
            {company.link ? (
              <a
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 px-4 bg-[#6D8F75] hover:bg-[#5A7A62] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-green-900/10 hover:shadow-green-900/20"
              >
                Ver más
              </a>
            ) : (
              <button disabled className="block w-full text-center py-3 px-4 bg-gray-200 text-gray-400 text-sm font-bold rounded-xl cursor-not-allowed">
                Ver más
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
