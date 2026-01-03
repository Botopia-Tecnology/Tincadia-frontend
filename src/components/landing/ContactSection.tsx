'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { formsService } from '@/services/forms.service';

interface ContactFormData {
    name: string;
    phone: string;
    email: string;
    message: string;
}

export function ContactSection() {
    const t = useTranslation();
    const [formId, setFormId] = useState<string | null>(null);
    const [formIdError, setFormIdError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [dragActive, setDragActive] = useState(false);

    // Fetch form ID on mount
    const fetchFormId = async () => {
        try {
            setFormIdError(null);
            const form = await formsService.findFormByType('contact');
            setFormId(form.id);
        } catch (error: any) {
            console.error('Error fetching form definition:', error);
            const status = error?.status || error?.statusCode;
            if (status === 404) {
                setFormIdError('El formulario de contacto no está configurado. Por favor, contacta al administrador.');
            } else {
                setFormIdError('No se pudo cargar la configuración del formulario. Por favor, recarga la página.');
            }
        }
    };

    useEffect(() => {
        fetchFormId();
    }, []);

    const validationSchema = Yup.object({
        name: Yup.string().required('El nombre es requerido'),
        phone: Yup.string().required('El teléfono es requerido'),
        email: Yup.string().email('Email inválido').required('El email es requerido'),
        message: Yup.string().required('El mensaje es requerido'),
    });

    const formik = useFormik<ContactFormData>({
        initialValues: {
            name: '',
            phone: '',
            email: '',
            message: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            // Try to fetch formId if not available
            let currentFormId = formId;
            if (!currentFormId) {
                try {
                    const form = await formsService.findFormByType('contact');
                    currentFormId = form.id;
                    setFormId(currentFormId);
                    setFormIdError(null);
                } catch (error: any) {
                    console.error('Error fetching form definition:', error);
                    const status = error?.status || error?.statusCode;
                    if (status === 404) {
                        setFormIdError('El formulario de contacto no está configurado. Por favor, contacta al administrador.');
                    } else {
                        setFormIdError('No se pudo cargar la configuración del formulario. Por favor, recarga la página.');
                    }
                    setSubmitStatus('error');
                    return;
                }
            }

            setSubmitStatus('idle');

            try {
                const submissionData = {
                    nombreCompleto: values.name,
                    telefono: values.phone,
                    correoElectronico: values.email,
                    mensaje: values.message,
                };

                const response = await formsService.submitForm(currentFormId, submissionData);

                console.log('✅ Formulario de contacto enviado exitosamente:', response);
                setSubmitStatus('success');

                // Reset form
                resetForm();
            } catch (error) {
                console.error('Error submitting contact form:', error);
                setSubmitStatus('error');
            }
        },
    });

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Handle file upload here
        }
    };

    return (
        <section id="contacto" className="min-h-screen bg-transparent relative overflow-hidden flex flex-col">
            <div className="flex-grow container mx-auto px-6 lg:px-12 pt-8 pb-12 lg:pt-12 lg:pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column: Form (Span 5) */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <form onSubmit={formik.handleSubmit} className="space-y-8 mt-8 lg:mt-24">
                            <div className="space-y-6">
                                <div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder={t('contactSection.form.name')}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name}
                                        className={`w-full px-0 py-3 bg-transparent border-b focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder={t('contactSection.form.phone')}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.phone}
                                        className={`w-full px-0 py-3 bg-transparent border-b focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formik.touched.phone && formik.errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder={t('contactSection.form.email')}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                        className={`w-full px-0 py-3 bg-transparent border-b focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={3}
                                        placeholder={t('contactSection.form.message')}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.message}
                                        className={`w-full px-0 py-3 bg-transparent border-b focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 resize-none text-lg transition-colors ${formik.touched.message && formik.errors.message ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formik.touched.message && formik.errors.message && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Success message */}
                            {submitStatus === 'success' && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                    <p className="text-sm">¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.</p>
                                </div>
                            )}

                            {/* Error message if formId not loaded */}
                            {formIdError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="text-sm">{formIdError}</p>
                                </div>
                            )}

                            {/* Error message on submit */}
                            {submitStatus === 'error' && !formIdError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="text-sm">Error al enviar el mensaje. Por favor, intenta de nuevo.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={formik.isSubmitting || !!formIdError}
                                className="px-12 py-4 bg-[#83A98A] text-white font-medium rounded-full hover:bg-[#6D8F75] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formik.isSubmitting ? 'Enviando...' : t('contactSection.form.submit')}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Text & Info (Span 7) */}
                    <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-between">
                        <div>
                            <h2 className="text-5xl lg:text-7xl font-light text-black mb-8 leading-tight">
                                {t('contactSection.title')}
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl mb-12">
                                {t('contactSection.description')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                            {/* Contact Details */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    {t('contactSection.email')}
                                </h3>
                                <p className="text-lg text-black font-medium">email@example.com</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    {t('contactSection.phone')}
                                </h3>
                                <p className="text-lg text-black font-medium">123456789</p>
                            </div>

                            {/* Social Icons */}
                            <div className="col-span-1 sm:col-span-2 pt-4">
                                <div className="flex gap-4">
                                    <a href="https://www.facebook.com/isramirez10?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.instagram.com/tincadia?igsh=cnM1Y3hjYnZjbzZj" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.linkedin.com/company/tincadia/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a href="https://x.com/tincadiaapp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


        </section>
    );
}
