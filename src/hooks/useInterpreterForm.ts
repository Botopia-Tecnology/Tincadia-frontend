'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from '@/hooks/useTranslation';
import { formsService } from '@/services/forms.service';
import { authService } from '@/services/auth.service';

export interface FileData {
    name: string;
    url: string;
    size?: number;
    type?: string;
}

export interface InterpreterFormData {
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

interface UseInterpreterFormProps {
    initialData?: any;
    submissionId?: string;
    onSuccess?: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function useInterpreterForm({ initialData, submissionId, onSuccess }: UseInterpreterFormProps = {}) {
    const t = useTranslation();
    const isEditing = !!submissionId;

    const [otraAreaEspecialidad, setOtraAreaEspecialidad] = useState('');
    const [otroTipoServicio, setOtroTipoServicio] = useState('');
    const [formId, setFormId] = useState<string | null>(null);
    const [formIdError, setFormIdError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [fileErrors, setFileErrors] = useState<{ [key: string]: string | null }>({});

    const getArray = useCallback((key: string): string[] => {
        const value = t(key);
        return Array.isArray(value) ? value : [];
    }, [t]);

    const options = useMemo(() => ({
        academicLevels: getArray('forms.interpreter.academicLevels'),
        experienceLevels: getArray('forms.interpreter.experienceLevels'),
        specialtyAreas: getArray('forms.interpreter.specialtyAreas'),
        availability: getArray('forms.interpreter.availability'),
        serviceTypes: getArray('forms.interpreter.serviceTypes'),
    }), [getArray]);

    const fetchFormId = useCallback(async () => {
        try {
            const form = await formsService.findFormByType('interpreter_registration');
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

    // Initialize "Other" fields
    useEffect(() => {
        if (initialData) {
            if (initialData.areasEspecialidad?.length) {
                const lastOption = options.specialtyAreas[options.specialtyAreas.length - 1];
                const customArea = initialData.areasEspecialidad.find((a: string) => a.startsWith(lastOption + ' - '));
                if (customArea) setOtraAreaEspecialidad(customArea.split(' - ')[1]);
            }
            if (initialData.tipoServicio?.length) {
                const lastOption = options.serviceTypes[options.serviceTypes.length - 1];
                const customService = initialData.tipoServicio.find((t: string) => t.startsWith(lastOption + ' - '));
                if (customService) setOtroTipoServicio(customService.split(' - ')[1]);
            }
        }
    }, [initialData, options.specialtyAreas, options.serviceTypes]);

    const validationSchema = useMemo(() => Yup.object({
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
    }), [t]);

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
            let currentFormId = formId;
            if (!isEditing && !currentFormId) {
                try {
                    const form = await formsService.findFormByType('interpreter_registration');
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
                let certificacionesData = values.certificaciones;

                if (values.hojaVida instanceof File) {
                    const res = await formsService.uploadFile(values.hojaVida);
                    hojaVidaData = { url: res.url, name: values.hojaVida.name, size: values.hojaVida.size, type: values.hojaVida.type };
                }

                if (values.certificaciones instanceof File) {
                    const res = await formsService.uploadFile(values.certificaciones);
                    certificacionesData = { url: res.url, name: values.certificaciones.name, size: values.certificaciones.size, type: values.certificaciones.type };
                }

                const submissionData = {
                    ...values,
                    hojaVida: hojaVidaData,
                    certificaciones: certificacionesData,
                    areasEspecialidad: values.areasEspecialidad.map(a => a === options.specialtyAreas[options.specialtyAreas.length - 1] && otraAreaEspecialidad ? `${a} - ${otraAreaEspecialidad}` : a),
                    tipoServicio: values.tipoServicio.map(t => t === options.serviceTypes[options.serviceTypes.length - 1] && otroTipoServicio ? `${t} - ${otroTipoServicio}` : t),
                };

                if (isEditing && submissionId) {
                    await formsService.updateSubmission(submissionId, { data: submissionData });
                    if (onSuccess) onSuccess();
                } else {
                    const response = await formsService.submitForm(currentFormId!, submissionData);
                    if (response.userStatus === 'registered') {
                        alert('Este documento ya se encuentra registrado. Por favor inicie sesión.');
                        window.location.href = '/login';
                        return;
                    }
                }

                setSubmitStatus('success');
                if (!isEditing) {
                    setTimeout(() => setSubmitStatus('idle'), 5000);
                    resetForm();
                    setOtraAreaEspecialidad('');
                    setOtroTipoServicio('');
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
                if (!exists) formik.setFieldError('documentoIdentidad', 'Este documento no se encuentra registrado. Debes registrarte primero.');
            } catch (error) { console.error(error); }
        }
    };

    const handleCheckboxChange = (name: keyof InterpreterFormData, value: string) => {
        const currentArray = (formik.values[name] as string[]) || [];
        formik.setFieldValue(name, currentArray.includes(value) ? currentArray.filter(i => i !== value) : [...currentArray, value]);
    };

    const handleFileChange = (name: 'hojaVida' | 'certificaciones', file: File | null) => {
        setFileErrors(prev => ({ ...prev, [name]: null }));
        if (file && file.size > MAX_FILE_SIZE) {
            setFileErrors(prev => ({ ...prev, [name]: `El archivo pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB. Máximo 50MB.` }));
            return;
        }
        formik.setFieldValue(name, file);
    };

    return {
        formik,
        options,
        otraAreaEspecialidad,
        setOtraAreaEspecialidad,
        otroTipoServicio,
        setOtroTipoServicio,
        formIdError,
        submitStatus,
        setSubmitStatus,
        fileErrors,
        handleDocumentBlur,
        handleCheckboxChange,
        handleFileChange,
        t
    };
}
