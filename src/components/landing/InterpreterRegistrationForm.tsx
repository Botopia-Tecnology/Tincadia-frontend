'use client';

import { useState, useEffect, useMemo } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formsService } from '@/services/forms.service';
import { authService } from '@/services/auth.service';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';

interface FileData {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

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
  hojaVida: File | FileData | null;
  certificaciones: File | FileData | null;
  redesSocialesPortafolio: string;
  autorizaInclusion: 'si' | 'no' | '';
}

interface InterpreterRegistrationFormProps {
  initialData?: any;
  submissionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function InterpreterRegistrationForm({
  initialData,
  submissionId,
  onSuccess,
  onCancel
}: InterpreterRegistrationFormProps = {}) {
  const t = useTranslation();
  const isEditing = !!submissionId;

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

  const handleDocumentBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    formik.handleBlur(e);
    const docNumber = e.target.value;

    // Solo validar si tiene una longitud mínima razonable (ej. 5)
    if (docNumber && docNumber.length > 4) {
      try {
        const { exists } = await authService.checkDocumentExists(docNumber);
        if (!exists) {
          formik.setFieldError('documentoIdentidad', 'Este documento no se encuentra registrado. Debes registrarte como usuario primero.');
        }
      } catch (error) {
        console.error('Error validating document:', error);
      }
    }
  };

  // ... rest of state ...
  const [formIdError, setFormIdError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string | null }>({});

  // Fetch form ID on mount
  const fetchFormId = async () => {
    try {
      setFormIdError(null);
      const form = await formsService.findFormByType('interpreter_registration');
      setFormId(form.id);
    } catch (error: any) {
      console.error('Error fetching form definition:', error);
      const status = error?.status || error?.statusCode;
      if (status === 404) {
        setFormIdError('El formulario de registro de intérprete no está configurado. Por favor, contacta al administrador.');
      } else {
        setFormIdError('No se pudo cargar la configuración del formulario. Por favor, recarga la página.');
      }
    }
  };

  useEffect(() => {
    fetchFormId();
  }, []);

  // Initialize "Other" fields from initialData if necessary
  useEffect(() => {
    if (initialData) {
      // Check if areasEspecialidad has custom values
      if (initialData.areasEspecialidad && Array.isArray(initialData.areasEspecialidad)) {
        const lastOption = areasEspecialidad[areasEspecialidad.length - 1];
        const customArea = initialData.areasEspecialidad.find((a: string) => a.startsWith(lastOption + ' - '));
        if (customArea) {
          setOtraAreaEspecialidad(customArea.split(' - ')[1]);
        }
      }

      // Check if tipoServicio has custom values
      if (initialData.tipoServicio && Array.isArray(initialData.tipoServicio)) {
        const lastOption = tiposServicio[tiposServicio.length - 1];
        const customService = initialData.tipoServicio.find((t: string) => t.startsWith(lastOption + ' - '));
        if (customService) {
          setOtroTipoServicio(customService.split(' - ')[1]);
        }
      }
    }
  }, [initialData, areasEspecialidad, tiposServicio]);


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
      nombreCompleto: initialData?.nombreCompleto || '',
      documentoIdentidad: initialData?.documentoIdentidad || '',
      ciudadResidencia: initialData?.ciudadResidencia || '',
      telefonoWhatsapp: initialData?.telefonoWhatsapp || '',
      correoElectronico: initialData?.correoElectronico || '',
      esInterpreteCertificado: initialData?.esInterpreteCertificado || '',
      nivelAcademico: initialData?.nivelAcademico || '',
      nivelAcademicoDetalle: initialData?.nivelAcademicoDetalle || '',
      nivelExperiencia: initialData?.nivelExperiencia || '',
      areasEspecialidad: initialData?.areasEspecialidad?.map((a: string) => a.split(' - ')[0]) || [],
      disponibilidadHoraria: initialData?.disponibilidadHoraria || [],
      tipoServicio: initialData?.tipoServicio?.map((t: string) => t.split(' - ')[0]) || [],
      hojaVida: initialData?.hojaVida || null,
      certificaciones: initialData?.certificaciones || null,
      redesSocialesPortafolio: initialData?.redesSocialesPortafolio || '',
      autorizaInclusion: initialData?.autorizaInclusion || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      // Try to fetch formId if not available (only for new submissions)
      let currentFormId = formId;
      if (!isEditing && !currentFormId) {
        try {
          const form = await formsService.findFormByType('interpreter_registration');
          currentFormId = form.id;
          setFormId(currentFormId);
          setFormIdError(null);
        } catch (error: any) {
          console.error('Error fetching form definition:', error);
          setFormIdError('No se pudo cargar la configuración del formulario.');
          setSubmitStatus('error');
          return;
        }
      }

      setSubmitStatus('idle');

      try {
        // Upload files first if present and NEW
        let hojaVidaData = values.hojaVida;
        let certificacionesData = values.certificaciones;

        if (values.hojaVida instanceof File) {
          try {
            console.log('📤 Uploading resume...');
            const uploadResult = await formsService.uploadFile(values.hojaVida);
            hojaVidaData = {
              url: uploadResult.url,
              name: values.hojaVida.name,
              size: values.hojaVida.size,
              type: values.hojaVida.type
            };
            console.log('✅ Resume uploaded:', hojaVidaData.url);
          } catch (uploadError) {
            console.error('Error uploading resume:', uploadError);
            setSubmitStatus('error');
            return;
          }
        }

        if (values.certificaciones instanceof File) {
          try {
            console.log('📤 Uploading certifications...');
            const uploadResult = await formsService.uploadFile(values.certificaciones);
            certificacionesData = {
              url: uploadResult.url,
              name: values.certificaciones.name,
              size: values.certificaciones.size,
              type: values.certificaciones.type
            };
            console.log('✅ Certifications uploaded:', certificacionesData.url);
          } catch (uploadError) {
            console.error('Error uploading certifications:', uploadError);
            setSubmitStatus('error');
            return;
          }
        }

        const submissionData = {
          ...values,
          hojaVida: hojaVidaData,
          certificaciones: certificacionesData,
          // Append custom strings if selected
          areasEspecialidad: values.areasEspecialidad.map(a => a === areasEspecialidad[areasEspecialidad.length - 1] && otraAreaEspecialidad ? `${a} - ${otraAreaEspecialidad}` : a),
          tipoServicio: values.tipoServicio.map(t => t === tiposServicio[tiposServicio.length - 1] && otroTipoServicio ? `${t} - ${otroTipoServicio}` : t),
        };

        if (isEditing && submissionId) {
          // Update existing submission
          await formsService.updateSubmission(submissionId, { data: submissionData });
          console.log('✅ Formulario actualizado exitosamente');
          if (onSuccess) onSuccess();
        } else {
          // Create new submission
          const response = await formsService.submitForm(currentFormId!, submissionData);
          console.log('✅ Formulario enviado exitosamente:', response);

          if (response.userStatus === 'registered') {
            alert('Este documento ya se encuentra registrado. Por favor inicie sesión.');
            window.location.href = '/login';
            return;
          }
        }

        setSubmitStatus('success');

        if (!isEditing) {
          // Hide success message after 5 seconds
          setTimeout(() => setSubmitStatus('idle'), 5000);
          // Reset form and state
          resetForm();
          setOtraAreaEspecialidad('');
          setOtroTipoServicio('');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitStatus('error');
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
    setFileErrors(prev => ({ ...prev, [name]: null }));

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileErrors(prev => ({
          ...prev,
          [name]: `El archivo pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB. El máximo permitido es 50MB.`
        }));
        return;
      }
    }
    formik.setFieldValue(name, file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 relative">
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
          {isEditing ? 'Editar Solicitud' : t('registration.interpreterForm.formTitle')}
        </h2>
        <p className="text-gray-600">
          {isEditing ? 'Actualiza tu información y hoja de vida.' : t('registration.interpreterForm.formDescription')}
        </p>
      </div>

      {
        submitStatus === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¡{isEditing ? 'Actualización Exitosa' : 'Solicitud Enviada'}!</h3>
            <p className="text-gray-600">
              {isEditing ? 'Tu solicitud ha sido actualizada correctamente.' : 'Hemos recibido tu información correctamente. Te contactaremos pronto.'}
            </p>
            {!isEditing ? (
              <button
                onClick={() => setSubmitStatus('idle')}
                className="mt-6 text-[#83A98A] font-semibold hover:underline"
              >
                Enviar otra solicitud
              </button>
            ) : (
              <button
                onClick={onSuccess}
                className="mt-6 px-6 py-2 bg-[#83A98A] text-white rounded-lg hover:bg-[#6e9175]"
              >
                Finalizar
              </button>
            )}
          </div>
        ) : (
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
                onBlur={handleDocumentBlur} // Use custom handler
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
                <span className="block text-xs font-normal text-gray-500 mt-1">(Formato PDF, Máximo 50MB)</span>
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
                    {formik.values.hojaVida ? formik.values.hojaVida.name : t('forms.interpreter.fields.selectFile')}
                  </span>
                </label>
                {formik.touched.hojaVida && formik.errors.hojaVida && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.hojaVida as string}</p>
                )}
                {fileErrors.hojaVida && <p className="text-red-500 text-sm mt-1">{fileErrors.hojaVida}</p>}
              </div>
            </div>

            {/* 13. Certificaciones (opcional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                13. {t('forms.interpreter.fields.certifications')}
                <span className="block text-xs font-normal text-gray-500 mt-1">(Formato PDF/JPG/PNG, Máximo 50MB)</span>
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
                      ? formik.values.certificaciones?.name
                      : t('forms.interpreter.fields.selectFile')}
                  </span>
                </label>
                {fileErrors.certificaciones && <p className="text-red-500 text-sm mt-1">{fileErrors.certificaciones}</p>}
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

            {/* Error message if formId not loaded */}
            {formIdError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
                <p className="text-sm">{formIdError}</p>
              </div>
            )}

            {/* Error Message Global */}
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-full shrink-0">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-900">No pudimos enviar tu solicitud</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Hubo un error técnico o de conexión. Por favor, verifica que tus archivos no superen los 50MB e inténtalo nuevamente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              className="w-full bg-[#83A98A] text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-[#6D8F75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] transition-all duration-300 shadow-lg hover:shadow-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              disabled={formik.isSubmitting || !!formIdError}
            >
              {formik.isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isEditing ? 'Actualizando...' : t('forms.common.sending')}</span>
                </>
              ) : (
                isEditing ? 'Actualizar Solicitud' : t('registration.interpreterForm.submitForm')
              )}
            </button>
          </form>
        )}
    </div >
  );
}
