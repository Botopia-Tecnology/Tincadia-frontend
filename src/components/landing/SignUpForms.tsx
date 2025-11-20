'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export function SignUpForms() {
  const [interpreterForm, setInterpreterForm] = useState({
    name: '',
    email: '',
    certifications: '',
  });

  const [jobSeekerForm, setJobSeekerForm] = useState({
    name: '',
    email: '',
    cv: null as File | null,
  });

  const handleInterpreterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Intérprete:', interpreterForm);
    // Aquí iría la lógica para enviar a la API
  };

  const handleJobSeekerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscador de empleo:', jobSeekerForm);
    // Aquí iría la lógica para enviar a la API
  };

  return (
    <section 
      className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="signup-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Grid de dos formularios */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Formulario 1: Conviértete en Intérprete */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <h2 
              id="signup-heading"
              className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3"
            >
              Conviértete en Intérprete
            </h2>
            <p className="text-gray-600 mb-8">
              Únete a nuestra red de profesionales certificados y marca la diferencia.
            </p>

            <form onSubmit={handleInterpreterSubmit} className="space-y-6">
              {/* Nombre Completo */}
              <div>
                <label 
                  htmlFor="interpreter-name" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nombre Completo
                </label>
                <input
                  id="interpreter-name"
                  type="text"
                  value={interpreterForm.name}
                  onChange={(e) => setInterpreterForm({ ...interpreterForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                  placeholder="Ingresa tu nombre completo"
                  required
                  aria-required="true"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label 
                  htmlFor="interpreter-email" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Correo Electrónico
                </label>
                <input
                  id="interpreter-email"
                  type="email"
                  value={interpreterForm.email}
                  onChange={(e) => setInterpreterForm({ ...interpreterForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                  placeholder="correo@ejemplo.com"
                  required
                  aria-required="true"
                />
              </div>

              {/* Certificaciones */}
              <div>
                <label 
                  htmlFor="certifications" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Certificaciones (ej. ILSE, FESORD)
                </label>
                <input
                  id="certifications"
                  type="text"
                  value={interpreterForm.certifications}
                  onChange={(e) => setInterpreterForm({ ...interpreterForm, certifications: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                  placeholder="Ej: ILSE Nivel 3, FESORD"
                  required
                  aria-required="true"
                />
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                className="w-full bg-[#83A98A] text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Postular Ahora
              </button>
            </form>
          </div>

          {/* Formulario 2: Encuentra tu Próxima Oportunidad */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Encuentra tu Próxima Oportunidad
            </h2>
            <p className="text-gray-600 mb-8">
              Crea un perfil y deja que empleadores inclusivos te encuentren.
            </p>

            <form onSubmit={handleJobSeekerSubmit} className="space-y-6">
              {/* Nombre Completo */}
              <div>
                <label 
                  htmlFor="jobseeker-name" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nombre Completo
                </label>
                <input
                  id="jobseeker-name"
                  type="text"
                  value={jobSeekerForm.name}
                  onChange={(e) => setJobSeekerForm({ ...jobSeekerForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                  placeholder="Ingresa tu nombre completo"
                  required
                  aria-required="true"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label 
                  htmlFor="jobseeker-email" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Correo Electrónico
                </label>
                <input
                  id="jobseeker-email"
                  type="email"
                  value={jobSeekerForm.email}
                  onChange={(e) => setJobSeekerForm({ ...jobSeekerForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                  placeholder="correo@ejemplo.com"
                  required
                  aria-required="true"
                />
              </div>

              {/* Subir CV */}
              <div>
                <label 
                  htmlFor="cv-upload" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Subir CV (opcional)
                </label>
                <div className="relative">
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setJobSeekerForm({ ...jobSeekerForm, cv: file });
                    }}
                    className="hidden"
                    aria-label="Subir archivo de CV"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#83A98A] cursor-pointer transition-all group"
                  >
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#83A98A] transition-colors" />
                    <span className="text-sm text-gray-600 group-hover:text-[#83A98A] transition-colors">
                      {jobSeekerForm.cv 
                        ? jobSeekerForm.cv.name 
                        : 'Elegir archivo'}
                    </span>
                  </label>
                  {jobSeekerForm.cv && (
                    <p className="mt-2 text-xs text-gray-500">
                      Archivo seleccionado: {jobSeekerForm.cv.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                className="w-full bg-[#83A98A] text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Crear Perfil
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

