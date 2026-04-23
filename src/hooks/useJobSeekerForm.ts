'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from '@/hooks/useTranslation';
import { formsService } from '@/services/forms.service';
import { authService } from '@/services/auth.service';

export interface JobSeekerFormData {
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
    certificacionesCursos: any | null;
    certificacionDiscapacidad: any | null;
    hojaVida: any | null;
    recibirCapacitacion: 'si' | 'no' | '';
    autorizaTratamientoDatos: 'si' | 'no' | '';
}

interface UseJobSeekerFormProps {
    initialData?: any;
    submissionId?: string;
    onSuccess?: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function useJobSeekerForm({ initialData, submissionId, onSuccess }: UseJobSeekerFormProps = {}) {
    const t = useTranslation();
    const isEditing = !!submissionId;

    const [otraAreaLaboral, setOtraAreaLaboral] = useState('');
    const [formId, setFormId] = useState<string | null>(null);
    const [formIdError, setFormIdError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [fileError, setFileError] = useState<string | null>(null);

    const getArray = useCallback((key: string): string[] => {
        const value = t(key);
        return Array.isArray(value) ? value : [];
    }, [t]);

    const options = useMemo(() => ({
        disabilityTypes: getArray('forms.jobSeeker.disabilityTypes'),
        lscLevels: getArray('forms.jobSeeker.lscLevels'),
        educationLevels: getArray('forms.jobSeeker.educationLevels'),
        workAreas: getArray('forms.jobSeeker.workAreas'),
    }), [getArray]);

    const fetchFormId = useCallback(async () => {
        try {
            const form = await formsService.findFormByType('job_seeker_registration');
            setFormId(form.id);
        } catch (error: any) {
            setFormIdError(error?.status === 404 
                ? 'El formulario no está configurado.' 
                : 'No se pudo cargar la configuración.');
        }
    }, []);

    useEffect(() => {
        fetchFormId();
    }, [fetchFormId]);

    useEffect(() => {
        if (initialData?.areaLaboralInteres?.length) {
            const lastOption = options.workAreas[options.workAreas.length - 1];
            const customArea = initialData.areaLaboralInteres.find((a: string) => a.startsWith(lastOption + ' - '));
            if (customArea) setOtraAreaLaboral(customArea.split(' - ')[1]);
        }
    }, [initialData, options.workAreas]);

    const validationSchema = useMemo(() => Yup.object({
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
    }), [t]);

    const formik = useFormik<JobSeekerFormData>({
        initialValues: {
            nombreCompleto: initialData?.nombreCompleto || '',
            documentoIdentidad: initialData?.documentoIdentidad || '',
            tipoDiscapacidad: initialData?.tipoDiscapacidad || '',
            usaLSC: initialData?.usaLSC || '',
            ciudadResidencia: initialData?.ciudadResidencia || '',
            telefonoWhatsapp: initialData?.telefonoWhatsapp || '',
            correoElectronico: initialData?.correoElectronico || '',
            nivelEducativo: initialData?.nivelEducativo || '',
            areaLaboralInteres: initialData?.areaLaboralInteres?.map((a: string) => a.split(' - ')[0]) || [],
            experienciaLaboral: initialData?.experienciaLaboral || '',
            habilidadesTecnicas: initialData?.habilidadesTecnicas || '',
            habilidadesBlandas: initialData?.habilidadesBlandas || '',
            certificacionesCursos: initialData?.certificacionesCursos || null,
            certificacionDiscapacidad: initialData?.certificacionDiscapacidad || null,
            hojaVida: initialData?.hojaVida || null,
            recibirCapacitacion: initialData?.recibirCapacitacion || '',
            autorizaTratamientoDatos: initialData?.autorizaTratamientoDatos || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            let currentFormId = formId;
            if (!isEditing && !currentFormId) {
                try {
                    const form = await formsService.findFormByType('job_seeker_registration');
                    currentFormId = form.id;
                    setFormId(currentFormId);
                } catch (error) {
                    setSubmitStatus('error');
                    return;
                }
            }

            setSubmitStatus('idle');

            try {
                let hojaVidaData = values.hojaVida;
                let certificacionesData = values.certificacionesCursos;
                let certificacionDiscapacidadData = values.certificacionDiscapacidad;

                if (values.hojaVida instanceof File) {
                    const res = await formsService.uploadFile(values.hojaVida);
                    hojaVidaData = { url: res.url, name: values.hojaVida.name, size: values.hojaVida.size, type: values.hojaVida.type };
                }

                if (values.certificacionesCursos instanceof File) {
                    const res = await formsService.uploadFile(values.certificacionesCursos);
                    certificacionesData = { url: res.url, name: values.certificacionesCursos.name, size: values.certificacionesCursos.size, type: values.certificacionesCursos.type };
                }

                if (values.certificacionDiscapacidad instanceof File) {
                    const res = await formsService.uploadFile(values.certificacionDiscapacidad);
                    certificacionDiscapacidadData = { url: res.url, name: values.certificacionDiscapacidad.name, size: values.certificacionDiscapacidad.size, type: values.certificacionDiscapacidad.type };
                }

                const submissionData = {
                    ...values,
                    hojaVida: hojaVidaData,
                    certificacionesCursos: certificacionesData,
                    certificacionDiscapacidad: certificacionDiscapacidadData,
                    areaLaboralInteres: values.areaLaboralInteres.map(a => a === options.workAreas[options.workAreas.length - 1] && otraAreaLaboral ? `${a} - ${otraAreaLaboral}` : a),
                };

                if (isEditing && submissionId) {
                    await formsService.updateSubmission(submissionId, { data: submissionData });
                    if (onSuccess) onSuccess();
                } else {
                    const response = await formsService.submitForm(currentFormId!, submissionData);
                    if (response.userStatus === 'registered') {
                        alert(t('forms.jobSeeker.messages.alreadyRegistered') || 'Usuario ya registrado.');
                        window.location.href = '/login';
                        return;
                    }
                }

                setSubmitStatus('success');
                if (!isEditing) {
                    setTimeout(() => setSubmitStatus('idle'), 5000);
                    resetForm();
                    setOtraAreaLaboral('');
                }
            } catch (error) {
                setSubmitStatus('error');
            }
        },
    });

    const handleDocumentBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        formik.handleBlur(e);
        const docNumber = e.target.value;
        if (docNumber?.length > 4) {
            try {
                const { exists } = await authService.checkDocumentExists(docNumber);
                if (!exists) formik.setFieldError('documentoIdentidad', 'Este documento no se encuentra registrado.');
            } catch (error) { console.error(error); }
        }
    };

    const handleCheckboxChange = (value: string) => {
        const currentArray = formik.values.areaLaboralInteres;
        formik.setFieldValue('areaLaboralInteres', currentArray.includes(value) ? currentArray.filter(i => i !== value) : [...currentArray, value]);
    };

    const handleFileChange = (field: 'hojaVida' | 'certificacionesCursos' | 'certificacionDiscapacidad', file: File | null) => {
        setFileError(null);
        if (file && file.size > MAX_FILE_SIZE) {
            setFileError(`El archivo pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB. Máximo 50MB.`);
            return;
        }
        formik.setFieldValue(field, file);
    };

    return {
        formik,
        options,
        otraAreaLaboral,
        setOtraAreaLaboral,
        formIdError,
        submitStatus,
        setSubmitStatus,
        fileError,
        handleDocumentBlur,
        handleCheckboxChange,
        handleFileChange,
        t
    };
}
