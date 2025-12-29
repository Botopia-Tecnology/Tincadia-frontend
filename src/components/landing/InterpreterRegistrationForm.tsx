'use client';

import { useState, useEffect, useMemo } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formsService } from '@/services/forms.service';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface InterpreterFormData {
  nombreCompleto: string;
  documentoIdentidad: string;
  ciudadResidencia: string;
  telefonoWhatsapp: string;
  correoElectronico: string;
  esInterpreteCertificado: 'si' | 'no' | '';
  nivelAcademico: string;
  nivelAcademicoDetalle: string;
  nivelExperiencia: string;
  areasEspecialidad: string[];
  disponibilidadHoraria: string[];
  tipoServicio: string[];
  hojaVida: File | null;
  certificaciones: File | null;
  redesSocialesPortafolio: string;
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

  const [otraAreaEspecialidad, setOtraAreaEspecialidad] = useState('');
  const [otroTipoServicio, setOtroTipoServicio] = useState('');
  const [formId, setFormId] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Fetch form ID on mount
  useEffect(() => {
    const fetchFormId = async () => {
      try {
        const form = await formsService.findFormByType('interpreter_registration');
        setFormId(form.id);
      } catch (error) {
        console.error('Error fetching form definition:', error);
      }
    };
    fetchFormId();
  }, []);

  const validationSchema = Yup.object({
    nombreCompleto: Yup.string().required(t('forms.common.required') as string),
    documentoIdentidad: Yup.string().required(t('forms.common.required') as string),
    ciudadResidencia: Yup.string().required(t('forms.common.required') as string),
    telefonoWhatsapp: Yup.string().required(t('forms.common.required') as string),
    correoElectronico: Yup.string().email('Email inválido').required(t('forms.common.required') as string),
    esInterpreteCertificado: Yup.string().required(t('forms.common.required') as string),
    nivelAcademico: Yup.string().required(t('forms.common.required') as string),
    nivelExperiencia: Yup.string().required(t('forms.common.required') as string),
    areasEspecialidad: Yup.array().min(1, t('forms.common.required') as string),
    disponibilidadHoraria: Yup.array().min(1, t('forms.common.required') as string),
    tipoServicio: Yup.array().min(1, t('forms.common.required') as string),
    hojaVida: Yup.mixed().required(t('forms.common.required') as string),
    autorizaInclusion: Yup.string().required(t('forms.common.required') as string),
  });

  const formik = useFormik<InterpreterFormData>({
    initialValues: {
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
      hojaVida: null,
      certificaciones: null,
      redesSocialesPortafolio: '',
      autorizaInclusion: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!formId) {
        alert(t('forms.common.errorFormNotLoaded'));
        return;
      }
      setSubmitStatus('idle');

      try {
        const submissionData = {
          ...values,
          hojaVida: values.hojaVida ? { name: values.hojaVida.name, size: values.hojaVida.size, type: values.hojaVida.type } : null,
          certificaciones: values.certificaciones ? { name: values.certificaciones.name, size: values.certificaciones.size, type: values.certificaciones.type } : null,
          // Append custom strings if selected
          areasEspecialidad: values.areasEspecialidad.map(a => a === areasEspecialidad[areasEspecialidad.length - 1] ? `${a} - ${otraAreaEspecialidad}` : a),
          tipoServicio: values.tipoServicio.map(t => t === tiposServicio[tiposServicio.length - 1] ? `${t} - ${otroTipoServicio}` : t),
        };

        const response = await formsService.submitForm(formId, submissionData);

        console.log('Formulario enviado:', response);
        setSubmitStatus('success');

        if (response.action === 'redirect_to_register') {
          alert(t('forms.common.pleaseRegister'));
        } else {
          alert(t('forms.common.submitSuccess'));
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitStatus('error');
        alert(t('forms.common.submitError'));
      }
    },
  });

  const handleCheckboxChange = (name: keyof InterpreterFormData, value: string) => {
    const currentArray = (formik.values[name] as string[]) || [];
    if (currentArray.includes(value)) {
      formik.setFieldValue(name, currentArray.filter((item) => item !== value));
    } else {
      formik.setFieldValue(name, [...currentArray, value]);
    }
  };

  const handleFileChange = (name: 'hojaVida' | 'certificaciones', file: File | null) => {
    formik.setFieldValue(name, file);
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

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* 1. Nombre completo */}
        <div>
          <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
            1. {t('forms.interpreter.fields.fullName')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nombreCompleto}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.nombreCompleto && formik.errors.nombreCompleto ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.nombreCompleto && formik.errors.nombreCompleto && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.nombreCompleto}</p>
          )}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.documentoIdentidad}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.documentoIdentidad && formik.errors.documentoIdentidad ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.documentoIdentidad && formik.errors.documentoIdentidad && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.documentoIdentidad}</p>
          )}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.ciudadResidencia}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.ciudadResidencia && formik.errors.ciudadResidencia ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.ciudadResidencia && formik.errors.ciudadResidencia && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.ciudadResidencia}</p>
          )}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.telefonoWhatsapp}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.telefonoWhatsapp && formik.errors.telefonoWhatsapp ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.telefonoWhatsapp && formik.errors.telefonoWhatsapp && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.telefonoWhatsapp}</p>
          )}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.correoElectronico}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.correoElectronico && formik.errors.correoElectronico ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.correoElectronico && formik.errors.correoElectronico && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.correoElectronico}</p>
          )}
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
                checked={formik.values.esInterpreteCertificado === 'si'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
              />
              <span className="text-gray-700">{t('forms.common.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="esInterpreteCertificado"
                value="no"
                checked={formik.values.esInterpreteCertificado === 'no'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
              />
              <span className="text-gray-700">{t('forms.common.no')}</span>
            </label>
          </div>
          {formik.touched.esInterpreteCertificado && formik.errors.esInterpreteCertificado && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.esInterpreteCertificado}</p>
          )}
        </div>

        {/* 7. Nivel académico */}
        <div>
          <label htmlFor="nivelAcademico" className="block text-sm font-semibold text-gray-700 mb-2">
            7. {t('forms.interpreter.fields.academicLevel')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="nivelAcademico"
            name="nivelAcademico"
            value={formik.values.nivelAcademico}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.nivelAcademico && formik.errors.nivelAcademico ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {nivelesAcademicos.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
          {formik.touched.nivelAcademico && formik.errors.nivelAcademico && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.nivelAcademico}</p>
          )}
          {(formik.values.nivelAcademico.includes('indique') ||
            formik.values.nivelAcademico.includes('indique nivel') ||
            formik.values.nivelAcademico.includes('indique carrera')) && (
              <input
                type="text"
                name="nivelAcademicoDetalle"
                value={formik.values.nivelAcademicoDetalle}
                onChange={formik.handleChange}
                placeholder={t('forms.interpreter.fields.academicDetail')}
                className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
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
            value={formik.values.nivelExperiencia}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.nivelExperiencia && formik.errors.nivelExperiencia ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {nivelesExperiencia.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
          {formik.touched.nivelExperiencia && formik.errors.nivelExperiencia && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.nivelExperiencia}</p>
          )}
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
                  checked={formik.values.areasEspecialidad.includes(area)}
                  onChange={() => handleCheckboxChange('areasEspecialidad', area)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{area}</span>
              </label>
            ))}
          </div>
          {formik.touched.areasEspecialidad && formik.errors.areasEspecialidad && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.areasEspecialidad}</p>
          )}
          {formik.values.areasEspecialidad.includes(areasEspecialidad[areasEspecialidad.length - 1]) && (
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
                  checked={formik.values.disponibilidadHoraria.includes(disponibilidad)}
                  onChange={() => handleCheckboxChange('disponibilidadHoraria', disponibilidad)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{disponibilidad}</span>
              </label>
            ))}
          </div>
          {formik.touched.disponibilidadHoraria && formik.errors.disponibilidadHoraria && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.disponibilidadHoraria}</p>
          )}
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
                  checked={formik.values.tipoServicio.includes(tipo)}
                  onChange={() => handleCheckboxChange('tipoServicio', tipo)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{tipo}</span>
              </label>
            ))}
          </div>
          {formik.touched.tipoServicio && formik.errors.tipoServicio && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.tipoServicio}</p>
          )}
          {formik.values.tipoServicio.includes(tiposServicio[tiposServicio.length - 1]) && (
            <input
              type="text"
              value={otroTipoServicio}
              onChange={(e) => setOtroTipoServicio(e.target.value)}
              placeholder={t('forms.interpreter.fields.specifyOtherService')}
              className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
            />
          )}
        </div>

        {/* 12. Hoja de vida (PDF) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            12. {t('forms.interpreter.fields.uploadCV')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('hojaVida', e.target.files?.[0] || null)}
              className="hidden"
              id="hojaVida"
            />
            <label
              htmlFor="hojaVida"
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg hover:border-[#83A98A] cursor-pointer transition-all group ${formik.touched.hojaVida && formik.errors.hojaVida ? 'border-red-500' : 'border-gray-300'}`}
            >
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#83A98A]" />
              <span className="text-sm text-gray-600 group-hover:text-[#83A98A]">
                {formik.values.hojaVida ? formik.values.hojaVida.name : t('forms.interpreter.fields.selectFilePDF')}
              </span>
            </label>
            {formik.touched.hojaVida && formik.errors.hojaVida && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.hojaVida}</p>
            )}
          </div>
        </div>

        {/* 13. Certificaciones (opcional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            13. {t('forms.interpreter.fields.certifications')}
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
                {formik.values.certificaciones
                  ? formik.values.certificaciones.name
                  : t('forms.interpreter.fields.selectFileCert')}
              </span>
            </label>
          </div>
        </div>

        {/* 14. Redes sociales o portafolio */}
        <div>
          <label htmlFor="redesSocialesPortafolio" className="block text-sm font-semibold text-gray-700 mb-2">
            14. {t('forms.interpreter.fields.socialMedia')}
          </label>
          <input
            id="redesSocialesPortafolio"
            name="redesSocialesPortafolio"
            type="url"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.redesSocialesPortafolio}
            placeholder={t('forms.interpreter.fields.socialPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent"
          />
        </div>

        {/* 15. Autorización */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            15. {t('forms.interpreter.fields.authorization')}{' '}
            <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaInclusion"
                value="si"
                checked={formik.values.autorizaInclusion === 'si'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
              />
              <span className="text-gray-700">{t('forms.common.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaInclusion"
                value="no"
                checked={formik.values.autorizaInclusion === 'no'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
              />
              <span className="text-gray-700">{t('forms.common.no')}</span>
            </label>
          </div>
          {formik.touched.autorizaInclusion && formik.errors.autorizaInclusion && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.autorizaInclusion}</p>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          className="w-full bg-[#83A98A] text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300 shadow-lg hover:shadow-xl mt-8 disabled:opacity-50"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? t('forms.common.sending') : t('registration.interpreterForm.submitForm')}
        </button>
      </form>
    </div>
  );
}

