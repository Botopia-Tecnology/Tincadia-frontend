'use client';

import { JobSeekerRegistrationForm } from './JobSeekerRegistrationForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect, useState } from 'react';

export function FindInclusiveCompanySection() {
  const t = useTranslation();
  return (
    <section
      id="empresas-inclusivas"
      className="py-16 lg:py-20 bg-transparent min-h-screen"
      aria-labelledby="job-seeker-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
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

        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <JobSeekerRegistrationForm />
          </div>

          {/* Right Column: Opportunities / Companies */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-gray-900/5 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#83A98A]">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </span>
                Conoce tus posibilidades
              </h3>

              <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                <CompaniesList />
              </div>
            </div>
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

  if (loading) return <div className="text-center py-8 text-gray-500">Cargando oportunidades...</div>;

  if (companies.length === 0) return (
    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
      <p className="text-gray-500">Pronto publicaremos empresas aliadas aquí.</p>
    </div>
  );

  return (
    <>
      {companies.map((company: any, idx) => (
        <div key={idx} className="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            <div className="h-16 w-16 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100">
              {company.imageUrl ? (
                <img src={company.imageUrl} alt={company.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-2xl font-bold text-gray-300">{company.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{company.name}</h4>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{company.description}</p>
              {company.link && (
                <a href={company.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A7A62] mt-3 hover:text-[#3d5242] transition-colors">
                  Ver más
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
