'use client';

import { useState, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface JobSeekerFormData {
  // Información básica
  nombreCompleto: string;
  documentoIdentidad: string;
  tipoDiscapacidad: string;
  usaLSC: string;
  ciudadResidencia: string;
  telefonoWhatsapp: string;
  correoElectronico: string;
  
  // Educación
  nivelEducativo: string;
  
  // Áreas de interés
  areaLaboralInteres: string[];
  
  // Experiencia y habilidades
  experienciaLaboral: string;
  habilidadesTecnicas: string;
  habilidadesBlandas: string;
  certificacionesCursos: string;
  
  // Documentos
  hojaVida: File | null;
  
  // Opciones
  recibirCapacitacion: 'si' | 'no' | '';
  autorizaTratamientoDatos: 'si' | 'no' | '';
}


export function JobSeekerRegistrationForm() {
  const t = useTranslation();
  
  const tiposDiscapacidad = useMemo(() => t('forms.jobSeeker.disabilityTypes') as string[], [t]);
  const nivelesLSC = useMemo(() => t('forms.jobSeeker.lscLevels') as string[], [t]);
  const nivelesEducativos = useMemo(() => t('forms.jobSeeker.educationLevels') as string[], [t]);
  const areasLaborales = useMemo(() => t('forms.jobSeeker.workAreas') as string[], [t]);
  
  const [formData, setFormData] = useState<JobSeekerFormData>({
    nombreCompleto: '',
    documentoIdentidad: '',
    tipoDiscapacidad: '',
    usaLSC: '',
    ciudadResidencia: '',
    telefonoWhatsapp: '',
    correoElectronico: '',
    nivelEducativo: '',
    areaLaboralInteres: [],
    experienciaLaboral: '',
    habilidadesTecnicas: '',
    habilidadesBlandas: '',
    certificacionesCursos: '',
    hojaVida: null,
    recibirCapacitacion: '',
    autorizaTratamientoDatos: '',
  });

  const [otraAreaLaboral, setOtraAreaLaboral] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => {
      const currentArray = prev.areaLaboralInteres;
      if (currentArray.includes(value)) {
        return { ...prev, areaLaboralInteres: currentArray.filter((item) => item !== value) };
      }
      return { ...prev, areaLaboralInteres: [...currentArray, value] };
    });
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, hojaVida: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    // Aquí iría la lógica para enviar a la API
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
          {t('registration.jobSeeker.formTitle')}
        </h2>
        <p className="text-gray-600">
          {t('registration.jobSeeker.formDescription')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Nombre completo */}
        <div>
          <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
            1. {t('forms.jobSeeker.fields.fullName')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            value={formData.nombreCompleto}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 2. Documento de identidad */}
        <div>
          <label htmlFor="documentoIdentidad" className="block text-sm font-semibold text-gray-700 mb-2">
            2. {t('forms.jobSeeker.fields.documentId')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <input
            id="documentoIdentidad"
            name="documentoIdentidad"
            type="text"
            value={formData.documentoIdentidad}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 3. Tipo de discapacidad */}
        <div>
          <label htmlFor="tipoDiscapacidad" className="block text-sm font-semibold text-gray-700 mb-2">
            3. {t('forms.jobSeeker.fields.disabilityType')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="tipoDiscapacidad"
            name="tipoDiscapacidad"
            value={formData.tipoDiscapacidad}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {tiposDiscapacidad.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* 4. ¿Usas Lengua de Señas Colombiana (LSC)? */}
        <div>
          <label htmlFor="usaLSC" className="block text-sm font-semibold text-gray-700 mb-2">
            4. {t('forms.jobSeeker.fields.usesLSC')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="usaLSC"
            name="usaLSC"
            value={formData.usaLSC}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {nivelesLSC.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Ciudad de residencia */}
        <div>
          <label htmlFor="ciudadResidencia" className="block text-sm font-semibold text-gray-700 mb-2">
            5. {t('forms.jobSeeker.fields.city')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <input
            id="ciudadResidencia"
            name="ciudadResidencia"
            type="text"
            value={formData.ciudadResidencia}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 6. Teléfono / WhatsApp */}
        <div>
          <label htmlFor="telefonoWhatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
            6. {t('forms.jobSeeker.fields.phone')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <input
            id="telefonoWhatsapp"
            name="telefonoWhatsapp"
            type="tel"
            value={formData.telefonoWhatsapp}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 7. Correo electrónico */}
        <div>
          <label htmlFor="correoElectronico" className="block text-sm font-semibold text-gray-700 mb-2">
            7. {t('forms.jobSeeker.fields.email')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <input
            id="correoElectronico"
            name="correoElectronico"
            type="email"
            value={formData.correoElectronico}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 8. Nivel educativo */}
        <div>
          <label htmlFor="nivelEducativo" className="block text-sm font-semibold text-gray-700 mb-2">
            8. {t('forms.jobSeeker.fields.educationLevel')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="nivelEducativo"
            name="nivelEducativo"
            value={formData.nivelEducativo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {nivelesEducativos.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        {/* 9. Área laboral de interés */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            9. {t('forms.jobSeeker.fields.workArea')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="space-y-2">
            {areasLaborales.map((area) => (
              <label key={area} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.areaLaboralInteres.includes(area)}
                  onChange={() => handleCheckboxChange(area)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{area}</span>
              </label>
            ))}
          </div>
          {formData.areaLaboralInteres.includes(areasLaborales[areasLaborales.length - 1]) && (
            <input
              type="text"
              value={otraAreaLaboral}
              onChange={(e) => setOtraAreaLaboral(e.target.value)}
              placeholder={t('forms.jobSeeker.fields.specifyOther')}
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            />
          )}
        </div>

        {/* 10. Experiencia laboral */}
        <div>
          <label htmlFor="experienciaLaboral" className="block text-sm font-semibold text-gray-700 mb-2">
            10. {t('forms.jobSeeker.fields.workExperience')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <textarea
            id="experienciaLaboral"
            name="experienciaLaboral"
            value={formData.experienciaLaboral}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent resize-vertical"
            placeholder={t('forms.jobSeeker.fields.describeExperience')}
            required
          />
        </div>

        {/* 11. Habilidades técnicas */}
        <div>
          <label htmlFor="habilidadesTecnicas" className="block text-sm font-semibold text-gray-700 mb-2">
            11. {t('forms.jobSeeker.fields.technicalSkills')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <textarea
            id="habilidadesTecnicas"
            name="habilidadesTecnicas"
            value={formData.habilidadesTecnicas}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent resize-vertical"
            placeholder={t('forms.jobSeeker.fields.describeTechnical')}
            required
          />
        </div>

        {/* 12. Habilidades blandas */}
        <div>
          <label htmlFor="habilidadesBlandas" className="block text-sm font-semibold text-gray-700 mb-2">
            12. {t('forms.jobSeeker.fields.softSkills')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <textarea
            id="habilidadesBlandas"
            name="habilidadesBlandas"
            value={formData.habilidadesBlandas}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent resize-vertical"
            placeholder={t('forms.jobSeeker.fields.describeSoft')}
            required
          />
        </div>

        {/* 13. Certificaciones, cursos o talleres */}
        <div>
          <label htmlFor="certificacionesCursos" className="block text-sm font-semibold text-gray-700 mb-2">
            13. {t('forms.jobSeeker.fields.certifications')}
          </label>
          <textarea
            id="certificacionesCursos"
            name="certificacionesCursos"
            value={formData.certificacionesCursos}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent resize-vertical"
            placeholder={t('forms.jobSeeker.fields.listCertifications')}
          />
        </div>

        {/* 14. Adjuntar hoja de vida (PDF) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            14. {t('forms.jobSeeker.fields.uploadCV')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
              id="hojaVida"
              required
            />
            <label
              htmlFor="hojaVida"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#83A98A] cursor-pointer transition-all group"
            >
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#83A98A]" />
              <span className="text-sm text-gray-600 group-hover:text-[#83A98A]">
                {formData.hojaVida ? formData.hojaVida.name : t('forms.jobSeeker.fields.selectFile')}
              </span>
            </label>
          </div>
        </div>

        {/* 15. ¿Te gustaría recibir capacitación gratuita de TINCADIA? */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            15. {t('forms.jobSeeker.fields.training')}{' '}
            <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recibirCapacitacion"
                value="si"
                checked={formData.recibirCapacitacion === 'si'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">{t('forms.common.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recibirCapacitacion"
                value="no"
                checked={formData.recibirCapacitacion === 'no'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">{t('forms.common.no')}</span>
            </label>
          </div>
        </div>

        {/* 16. Autorizo tratamiento de datos personales */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            16. {t('forms.jobSeeker.fields.dataAuthorization')}{' '}
            <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaTratamientoDatos"
                value="si"
                checked={formData.autorizaTratamientoDatos === 'si'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">{t('forms.common.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaTratamientoDatos"
                value="no"
                checked={formData.autorizaTratamientoDatos === 'no'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">{t('forms.common.no')}</span>
            </label>
          </div>
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          className="w-full bg-[#83A98A] text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300 shadow-lg hover:shadow-xl mt-8"
        >
          {t('registration.jobSeeker.submitForm')}
        </button>
      </form>
    </div>
  );
}

