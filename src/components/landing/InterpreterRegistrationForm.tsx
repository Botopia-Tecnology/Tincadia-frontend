'use client';

import { useState, useMemo } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface InterpreterFormData {
  // Información básica
  nombreCompleto: string;
  documentoIdentidad: string;
  ciudadResidencia: string;
  telefonoWhatsapp: string;
  correoElectronico: string;
  
  // Certificación y educación
  esInterpreteCertificado: 'si' | 'no' | '';
  nivelAcademico: string;
  nivelAcademicoDetalle: string;
  
  // Experiencia
  nivelExperiencia: string;
  areasEspecialidad: string[];
  
  // Servicios
  disponibilidadHoraria: string[];
  tipoServicio: string[];
  
  // Tarifas y documentos
  tarifasPorHora: string;
  hojaVida: File | null;
  certificaciones: File | null;
  redesSocialesPortafolio: string;
  
  // Autorización
  autorizaInclusion: 'si' | 'no' | '';
}


export function InterpreterRegistrationForm() {
  const t = useTranslation();
  
    const getArray = (key: string): string[] => {
    const value = t(key);
    return Array.isArray(value) ? value : [];
  };
  
  const nivelesAcademicos = useMemo(() => getArray('forms.interpreter.academicLevels'), [t]);
  const nivelesExperiencia = useMemo(() => getArray('forms.interpreter.experienceLevels'), [t]);
  const areasEspecialidad = useMemo(() => getArray('forms.interpreter.specialtyAreas'), [t]);
  const disponibilidadesHorarias = useMemo(() => getArray('forms.interpreter.availability'), [t]);
  const tiposServicio = useMemo(() => getArray('forms.interpreter.serviceTypes'), [t]);
  
  const [formData, setFormData] = useState<InterpreterFormData>({
    nombreCompleto: '',
    documentoIdentidad: '',
    ciudadResidencia: '',
    telefonoWhatsapp: '',
    correoElectronico: '',
    esInterpreteCertificado: '',
    nivelAcademico: '',
    nivelAcademicoDetalle: '',
    nivelExperiencia: '',
    areasEspecialidad: [],
    disponibilidadHoraria: [],
    tipoServicio: [],
    tarifasPorHora: '',
    hojaVida: null,
    certificaciones: null,
    redesSocialesPortafolio: '',
    autorizaInclusion: '',
  });

  const [otraAreaEspecialidad, setOtraAreaEspecialidad] = useState('');
  const [otroTipoServicio, setOtroTipoServicio] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof InterpreterFormData, value: string) => {
    setFormData((prev) => {
      const currentArray = (prev[name] as string[]) || [];
      if (currentArray.includes(value)) {
        return { ...prev, [name]: currentArray.filter((item) => item !== value) };
      }
      return { ...prev, [name]: [...currentArray, value] };
    });
  };

  const handleFileChange = (name: 'hojaVida' | 'certificaciones', file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
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
          {t('registration.interpreterForm.formTitle')}
        </h2>
        <p className="text-gray-600">
          {t('registration.interpreterForm.formDescription')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Nombre completo */}
        <div>
          <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
            1. {t('forms.interpreter.fields.fullName')} <span className="text-red-500">{t('forms.common.required')}</span>
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
            2. {t('forms.interpreter.fields.documentId')} <span className="text-red-500">{t('forms.common.required')}</span>
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

        {/* 3. Ciudad de residencia */}
        <div>
          <label htmlFor="ciudadResidencia" className="block text-sm font-semibold text-gray-700 mb-2">
            3. {t('forms.interpreter.fields.city')} <span className="text-red-500">{t('forms.common.required')}</span>
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

        {/* 4. Teléfono / WhatsApp */}
        <div>
          <label htmlFor="telefonoWhatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
            4. {t('forms.interpreter.fields.phone')} <span className="text-red-500">{t('forms.common.required')}</span>
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

        {/* 5. Correo electrónico */}
        <div>
          <label htmlFor="correoElectronico" className="block text-sm font-semibold text-gray-700 mb-2">
            5. {t('forms.interpreter.fields.email')} <span className="text-red-500">{t('forms.common.required')}</span>
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

        {/* 6. ¿Eres intérprete certificado? */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            6. {t('forms.interpreter.fields.isCertified')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="esInterpreteCertificado"
                value="si"
                checked={formData.esInterpreteCertificado === 'si'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">{t('forms.common.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="esInterpreteCertificado"
                value="no"
                checked={formData.esInterpreteCertificado === 'no'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">{t('forms.common.no')}</span>
            </label>
          </div>
        </div>

        {/* 7. Nivel académico */}
        <div>
          <label htmlFor="nivelAcademico" className="block text-sm font-semibold text-gray-700 mb-2">
            7. {t('forms.interpreter.fields.academicLevel')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="nivelAcademico"
            name="nivelAcademico"
            value={formData.nivelAcademico}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {nivelesAcademicos.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
          {(formData.nivelAcademico.includes('indique') ||
            formData.nivelAcademico.includes('indique nivel') ||
            formData.nivelAcademico.includes('indique carrera')) && (
            <input
              type="text"
              name="nivelAcademicoDetalle"
              value={formData.nivelAcademicoDetalle}
              onChange={handleInputChange}
              placeholder={t('forms.interpreter.fields.academicDetail')}
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
              required
            />
          )}
        </div>

        {/* 8. Nivel de experiencia */}
        <div>
          <label htmlFor="nivelExperiencia" className="block text-sm font-semibold text-gray-700 mb-2">
            8. {t('forms.interpreter.fields.experienceLevel')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="nivelExperiencia"
            name="nivelExperiencia"
            value={formData.nivelExperiencia}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {nivelesExperiencia.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        {/* 9. Áreas de especialidad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            9. {t('forms.interpreter.fields.specialtyAreas')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="space-y-2">
            {areasEspecialidad.map((area) => (
              <label key={area} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.areasEspecialidad.includes(area)}
                  onChange={() => handleCheckboxChange('areasEspecialidad', area)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{area}</span>
              </label>
            ))}
          </div>
          {formData.areasEspecialidad.includes(areasEspecialidad[areasEspecialidad.length - 1]) && (
            <input
              type="text"
              value={otraAreaEspecialidad}
              onChange={(e) => setOtraAreaEspecialidad(e.target.value)}
              placeholder={t('forms.interpreter.fields.specifyOtherArea')}
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            />
          )}
        </div>

        {/* 10. Disponibilidad horaria */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            10. {t('forms.interpreter.fields.availability')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="space-y-2">
            {disponibilidadesHorarias.map((disponibilidad) => (
              <label key={disponibilidad} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.disponibilidadHoraria.includes(disponibilidad)}
                  onChange={() => handleCheckboxChange('disponibilidadHoraria', disponibilidad)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{disponibilidad}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 11. Tipo de servicio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            11. {t('forms.interpreter.fields.serviceType')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="space-y-2">
            {tiposServicio.map((tipo) => (
              <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.tipoServicio.includes(tipo)}
                  onChange={() => handleCheckboxChange('tipoServicio', tipo)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{tipo}</span>
              </label>
            ))}
          </div>
          {formData.tipoServicio.includes(tiposServicio[tiposServicio.length - 1]) && (
            <input
              type="text"
              value={otroTipoServicio}
              onChange={(e) => setOtroTipoServicio(e.target.value)}
              placeholder={t('forms.interpreter.fields.specifyOtherService')}
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            />
          )}
        </div>

        {/* 12. Tarifas por hora */}
        <div>
          <label htmlFor="tarifasPorHora" className="block text-sm font-semibold text-gray-700 mb-2">
            12. {t('forms.interpreter.fields.hourlyRates')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <input
            id="tarifasPorHora"
            name="tarifasPorHora"
            type="text"
            value={formData.tarifasPorHora}
            onChange={handleInputChange}
            placeholder={t('forms.interpreter.fields.ratesPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            required
          />
        </div>

        {/* 13. Hoja de vida (PDF) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            13. {t('forms.interpreter.fields.uploadCV')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('hojaVida', e.target.files?.[0] || null)}
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
                {formData.hojaVida ? formData.hojaVida.name : t('forms.interpreter.fields.selectFilePDF')}
              </span>
            </label>
          </div>
        </div>

        {/* 14. Certificaciones (opcional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            14. {t('forms.interpreter.fields.certifications')}
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('certificaciones', e.target.files?.[0] || null)}
              className="hidden"
              id="certificaciones"
            />
            <label
              htmlFor="certificaciones"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#83A98A] cursor-pointer transition-all group"
            >
              <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#83A98A]" />
              <span className="text-sm text-gray-600 group-hover:text-[#83A98A]">
                {formData.certificaciones
                  ? formData.certificaciones.name
                  : t('forms.interpreter.fields.selectFileCert')}
              </span>
            </label>
          </div>
        </div>

        {/* 15. Redes sociales o portafolio */}
        <div>
          <label htmlFor="redesSocialesPortafolio" className="block text-sm font-semibold text-gray-700 mb-2">
            15. {t('forms.interpreter.fields.socialMedia')}
          </label>
          <input
            id="redesSocialesPortafolio"
            name="redesSocialesPortafolio"
            type="url"
            value={formData.redesSocialesPortafolio}
            onChange={handleInputChange}
            placeholder={t('forms.interpreter.fields.socialPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
          />
        </div>

        {/* 16. Autorización */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            16. {t('forms.interpreter.fields.authorization')}{' '}
            <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaInclusion"
                value="si"
                checked={formData.autorizaInclusion === 'si'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
                required
              />
              <span className="text-gray-700">{t('forms.common.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaInclusion"
                value="no"
                checked={formData.autorizaInclusion === 'no'}
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
          {t('registration.interpreterForm.submitForm')}
        </button>
      </form>
    </div>
  );
}

