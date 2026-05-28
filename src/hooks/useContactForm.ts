'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { formsService } from '@/services/forms.service';
import { contentService } from '@/services/content.service';

export interface SocialLink {
    network: string;
    url: string;
    icon?: string;
    id?: string;
}

export function useContactForm() {
    const [formId, setFormId] = useState<string | null>(null);
    const [formIdError, setFormIdError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [contactInfo, setContactInfo] = useState({
        email: 'Contacto@tincadia.com',
        phone: '123456789',
        socialLinks: [] as SocialLink[]
    });

    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            try {
                const form = await formsService.findFormByType('contact');
                if (active) {
                    setFormId(form.id);
                }
            } catch (error) {
                if (active) {
                    const status = error && typeof error === 'object' && 'status' in error ? (error as { status: number }).status : undefined;
                    setFormIdError(
                        status === 404
                            ? 'El formulario de contacto no está configurado.'
                            : 'No se pudo cargar la configuración del formulario.'
                    );
                }
            }

            try {
                const [emailRes, phoneRes, socialRes] = await Promise.all([
                    contentService.getLandingConfig('contact_email'),
                    contentService.getLandingConfig('contact_phone'),
                    contentService.getLandingConfig('social_links')
                ]);

                if (active) {
                    setContactInfo({
                        email: emailRes?.value || 'Contacto@tincadia.com',
                        phone: phoneRes?.value || '123456789',
                        socialLinks: socialRes?.value ? JSON.parse(socialRes.value) : []
                    });
                }
            } catch (error) {
                console.error('Error fetching contact info:', error);
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            email: '',
            message: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre es requerido'),
            phone: Yup.string().required('El teléfono es requerido'),
            email: Yup.string().email('Email inválido').required('El email es requerido'),
            message: Yup.string().required('El mensaje es requerido'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setSubmitStatus('idle');
            try {
                let currentFormId = formId;
                if (!currentFormId) {
                    const form = await formsService.findFormByType('contact');
                    currentFormId = form.id;
                    setFormId(currentFormId);
                }

                await formsService.submitForm(currentFormId, {
                    nombreCompleto: values.name,
                    telefono: values.phone,
                    correoElectronico: values.email,
                    mensaje: values.message,
                });

                setSubmitStatus('success');
                resetForm();
            } catch {
                setSubmitStatus('error');
            }
        },
    });

    return {
        formik,
        formIdError,
        submitStatus,
        contactInfo,
        setSubmitStatus
    };
}
