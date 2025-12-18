'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formsService } from '@/services/forms.service';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface JobSeekerFormData {
  nombreCompleto: string;
  documentoIdentidad: string;
  tipoDiscapacidad: string;
  usaLSC: string;
  ciudadResidencia: string;
  telefonoWhatsapp: string;
  correoElectronico: string;
  nivelEducativo: string;
  areaLaboralInteres: string[];
  experienciaLaboral: string;
  habilidadesTecnicas: string;
  habilidadesBlandas: string;
  certificacionesCursos: string;
  hojaVida: File | null;
  recibirCapacitacion: 'si' | 'no' | '';
  autorizaTratamientoDatos: 'si' | 'no' | '';
}

export function JobSeekerRegistrationForm() {
  const t = useTranslation();

  const getArray = (key: string): string[] => {
    const value = t(key);
    return Array.isArray(value) ? value : [];
  };

  const tiposDiscapacidad = useMemo(() => getArray('forms.jobSeeker.disabilityTypes'), [t]);
  const nivelesLSC = useMemo(() => getArray('forms.jobSeeker.lscLevels'), [t]);
  const nivelesEducativos = useMemo(() => getArray('forms.jobSeeker.educationLevels'), [t]);
  const areasLaborales = useMemo(() => getArray('forms.jobSeeker.workAreas'), [t]);

  const [otraAreaLaboral, setOtraAreaLaboral] = useState('');
  const [formId, setFormId] = useState<string | null>(null);

  // Fetch form ID on mount
  useEffect(() => {
    const fetchFormId = async () => {
      try {
        const form = await formsService.findFormByType('job_seeker_registration');
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
    tipoDiscapacidad: Yup.string().required(t('forms.common.required') as string),
    usaLSC: Yup.string().required(t('forms.common.required') as string),
    ciudadResidencia: Yup.string().required(t('forms.common.required') as string),
    telefonoWhatsapp: Yup.string().required(t('forms.common.required') as string),
    correoElectronico: Yup.string().email('Email inválido').required(t('forms.common.required') as string),
    nivelEducativo: Yup.string().required(t('forms.common.required') as string),
    areaLaboralInteres: Yup.array().min(1, t('forms.common.required') as string),
    experienciaLaboral: Yup.string().required(t('forms.common.required') as string),
    habilidadesTecnicas: Yup.string().required(t('forms.common.required') as string),
    habilidadesBlandas: Yup.string().required(t('forms.common.required') as string),
    hojaVida: Yup.mixed().required(t('forms.common.required') as string),
    recibirCapacitacion: Yup.string().required(t('forms.common.required') as string),
    autorizaTratamientoDatos: Yup.string().required(t('forms.common.required') as string),
  });

  const formik = useFormik<JobSeekerFormData>({
    initialValues: {
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
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!formId) {
        alert(t('forms.common.errorFormNotLoaded'));
        return;
      }

      try {
        const submissionData = {
          ...values,
          hojaVida: values.hojaVida ? { name: values.hojaVida.name, size: values.hojaVida.size, type: values.hojaVida.type } : null,
          // Append custom string if selected
          areaLaboralInteres: values.areaLaboralInteres.map(a => a === areasLaborales[areasLaborales.length - 1] ? `${a} - ${otraAreaLaboral}` : a),
        };

        const response = await formsService.submitForm(formId, submissionData);

        console.log('Formulario enviado:', response);

        if (response.action === 'redirect_to_register') {
          alert(t('forms.common.pleaseRegister'));
        } else {
          alert(t('forms.common.submitSuccess'));
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert(t('forms.common.submitError'));
      }
    },
  });

  const handleCheckboxChange = (value: string) => {
    const currentArray = formik.values.areaLaboralInteres;
    if (currentArray.includes(value)) {
      formik.setFieldValue('areaLaboralInteres', currentArray.filter((item) => item !== value));
    } else {
      formik.setFieldValue('areaLaboralInteres', [...currentArray, value]);
    }
  };

  const handleFileChange = (file: File | null) => {
    formik.setFieldValue('hojaVida', file);
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

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* 1. Nombre completo */}
        <div>
          <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
            1. {t('forms.jobSeeker.fields.fullName')} <span className="text-red-500">{t('forms.common.required')}</span>
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
            2. {t('forms.jobSeeker.fields.documentId')} <span className="text-red-500">{t('forms.common.required')}</span>
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

        {/* 3. Tipo de discapacidad */}
        <div>
          <label htmlFor="tipoDiscapacidad" className="block text-sm font-semibold text-gray-700 mb-2">
            3. {t('forms.jobSeeker.fields.disabilityType')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="tipoDiscapacidad"
            name="tipoDiscapacidad"
            value={formik.values.tipoDiscapacidad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.tipoDiscapacidad && formik.errors.tipoDiscapacidad ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {tiposDiscapacidad.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {formik.touched.tipoDiscapacidad && formik.errors.tipoDiscapacidad && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.tipoDiscapacidad}</p>
          )}
        </div>

        {/* 4. ¿Usas Lengua de Señas Colombiana (LSC)? */}
        <div>
          <label htmlFor="usaLSC" className="block text-sm font-semibold text-gray-700 mb-2">
            4. {t('forms.jobSeeker.fields.usesLSC')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="usaLSC"
            name="usaLSC"
            value={formik.values.usaLSC}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.usaLSC && formik.errors.usaLSC ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {nivelesLSC.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
          {formik.touched.usaLSC && formik.errors.usaLSC && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.usaLSC}</p>
          )}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.ciudadResidencia}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.ciudadResidencia && formik.errors.ciudadResidencia ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.ciudadResidencia && formik.errors.ciudadResidencia && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.ciudadResidencia}</p>
          )}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.telefonoWhatsapp}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.telefonoWhatsapp && formik.errors.telefonoWhatsapp ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.telefonoWhatsapp && formik.errors.telefonoWhatsapp && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.telefonoWhatsapp}</p>
          )}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.correoElectronico}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.correoElectronico && formik.errors.correoElectronico ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.correoElectronico && formik.errors.correoElectronico && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.correoElectronico}</p>
          )}
        </div>

        {/* 8. Nivel educativo */}
        <div>
          <label htmlFor="nivelEducativo" className="block text-sm font-semibold text-gray-700 mb-2">
            8. {t('forms.jobSeeker.fields.educationLevel')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <select
            id="nivelEducativo"
            name="nivelEducativo"
            value={formik.values.nivelEducativo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.nivelEducativo && formik.errors.nivelEducativo ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">{t('forms.common.selectOption')}</option>
            {nivelesEducativos.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
          {formik.touched.nivelEducativo && formik.errors.nivelEducativo && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.nivelEducativo}</p>
          )}
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
                  checked={formik.values.areaLaboralInteres.includes(area)}
                  onChange={() => handleCheckboxChange(area)}
                  className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A] rounded"
                />
                <span className="text-gray-700">{area}</span>
              </label>
            ))}
          </div>
          {formik.touched.areaLaboralInteres && formik.errors.areaLaboralInteres && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.areaLaboralInteres}</p>
          )}
          {formik.values.areaLaboralInteres.includes(areasLaborales[areasLaborales.length - 1]) && (
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
            value={formik.values.experienciaLaboral}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent resize-vertical ${formik.touched.experienciaLaboral && formik.errors.experienciaLaboral ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t('forms.jobSeeker.fields.describeExperience')}
          />
          {formik.touched.experienciaLaboral && formik.errors.experienciaLaboral && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.experienciaLaboral}</p>
          )}
        </div>

        {/* 11. Habilidades técnicas */}
        <div>
          <label htmlFor="habilidadesTecnicas" className="block text-sm font-semibold text-gray-700 mb-2">
            11. {t('forms.jobSeeker.fields.technicalSkills')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <textarea
            id="habilidadesTecnicas"
            name="habilidadesTecnicas"
            value={formik.values.habilidadesTecnicas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent resize-vertical ${formik.touched.habilidadesTecnicas && formik.errors.habilidadesTecnicas ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t('forms.jobSeeker.fields.describeTechnical')}
          />
          {formik.touched.habilidadesTecnicas && formik.errors.habilidadesTecnicas && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.habilidadesTecnicas}</p>
          )}
        </div>

        {/* 12. Habilidades blandas */}
        <div>
          <label htmlFor="habilidadesBlandas" className="block text-sm font-semibold text-gray-700 mb-2">
            12. {t('forms.jobSeeker.fields.softSkills')} <span className="text-red-500">{t('forms.common.required')}</span>
          </label>
          <textarea
            id="habilidadesBlandas"
            name="habilidadesBlandas"
            value={formik.values.habilidadesBlandas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent resize-vertical ${formik.touched.habilidadesBlandas && formik.errors.habilidadesBlandas ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t('forms.jobSeeker.fields.describeSoft')}
          />
          {formik.touched.habilidadesBlandas && formik.errors.habilidadesBlandas && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.habilidadesBlandas}</p>
          )}
        </div>

        {/* 13. Certificaciones, cursos o talleres */}
        <div>
          <label htmlFor="certificacionesCursos" className="block text-sm font-semibold text-gray-700 mb-2">
            13. {t('forms.jobSeeker.fields.certifications')}
          </label>
          <textarea
            id="certificacionesCursos"
            name="certificacionesCursos"
            value={formik.values.certificacionesCursos}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            />
            <label
              htmlFor="hojaVida"
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg hover:border-[#83A98A] cursor-pointer transition-all group ${formik.touched.hojaVida && formik.errors.hojaVida ? 'border-red-500' : 'border-gray-300'}`}
            >
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#83A98A]" />
              <span className="text-sm text-gray-600 group-hover:text-[#83A98A]">
                {formik.values.hojaVida ? formik.values.hojaVida.name : t('forms.jobSeeker.fields.selectFile')}
              </span>
            </label>
            {formik.touched.hojaVida && formik.errors.hojaVida && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.hojaVida}</p>
            )}
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
                checked={formik.values.recibirCapacitacion === 'si'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
              />
              <span className="text-gray-700">{t('forms.common.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recibirCapacitacion"
                value="no"
                checked={formik.values.recibirCapacitacion === 'no'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
              />
              <span className="text-gray-700">{t('forms.common.no')}</span>
            </label>
          </div>
          {formik.touched.recibirCapacitacion && formik.errors.recibirCapacitacion && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.recibirCapacitacion}</p>
          )}
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
                checked={formik.values.autorizaTratamientoDatos === 'si'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
              />
              <span className="text-gray-700">{t('forms.common.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autorizaTratamientoDatos"
                value="no"
                checked={formik.values.autorizaTratamientoDatos === 'no'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-[#83A98A] focus:ring-[#83A98A]"
              />
              <span className="text-gray-700">{t('forms.common.no')}</span>
            </label>
          </div>
          {formik.touched.autorizaTratamientoDatos && formik.errors.autorizaTratamientoDatos && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.autorizaTratamientoDatos}</p>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          className="w-full bg-[#83A98A] text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300 shadow-lg hover:shadow-xl mt-8 disabled:opacity-50"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? t('forms.common.sending') : t('registration.jobSeeker.submitForm')}
        </button>
      </form>
    </div>
  );
}

