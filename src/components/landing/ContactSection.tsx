'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Linkedin, Facebook, Instagram, Twitter, Youtube, Link as LinkIcon, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { formsService } from '@/services/forms.service';
import { contentService } from '@/services/content.service';

interface ContactFormData {
    name: string;
    phone: string;
    email: string;
    message: string;
}

interface SocialLink {
    id: string;
    network: string;
    url: string;
}

export function ContactSection() {
    const t = useTranslation();
    const [formId, setFormId] = useState<string | null>(null);
    const [formIdError, setFormIdError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [dragActive, setDragActive] = useState(false);

    // Contact Config State
    const [contactEmail, setContactEmail] = useState('Contacto@tincadia.com');
    const [contactPhone, setContactPhone] = useState('123456789');
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

    // Fetch form ID and config on mount
    const fetchData = async () => {
        // Fetch Form ID
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

        // Fetch Contact Config
        try {
            const [email, phone, social] = await Promise.all([
                contentService.getLandingConfig('contact_email'),
                contentService.getLandingConfig('contact_phone'),
                contentService.getLandingConfig('social_links')
            ]);

            if (email) setContactEmail(email);
            if (phone) setContactPhone(phone);
            if (social) {
                try {
                    const parsed = JSON.parse(social);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setSocialLinks(parsed);
                    } else {
                        setSocialLinks([]);
                    }
                } catch (e) {
                    setSocialLinks([]);
                }
            } else {
                setSocialLinks([]);
            }
        } catch (error) {
            console.error('Error fetching contact config:', error);
            setSocialLinks([]);
        }
    };

    useEffect(() => {
        fetchData();
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

    const getSocialIcon = (network: string) => {
        switch (network) {
            case 'Facebook': return <Facebook className="w-5 h-5" />;
            case 'Instagram': return <Instagram className="w-5 h-5" />;
            case 'LinkedIn': return <Linkedin className="w-5 h-5" />;
            case 'Twitter': return <Twitter className="w-5 h-5" />;
            case 'Youtube': return <Youtube className="w-5 h-5" />;
            case 'TikTok': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
            );
            case 'WhatsApp': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
            );
            case 'Discord': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.209.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.029c.243.466.518.909.818 1.329a.05.05 0 0 0 .056.019 13.263 13.263 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                </svg>
            );
            case 'Telegram': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.537.298-.51.528.024.195.297.291.606.376.136.037.29.074.453.111.97.221 1.334.256 1.602.13.093-.044.47-.593.899-1.303.461-.758.913-1.464.93-1.452.016.012-.007.037-.024.062-.239.356-1.107 1.636-1.127 1.666-.024.035-.11.23.116.425.263.228 1.154.91 1.633 1.25.39.278.673.472.936.428.163-.028.325-.262.518-1.353.14-1.109.288-2.316.357-2.914.072-.622.062-.835-.152-.942-.235-.117-.676-.037-1.63.364Z" />
                </svg>
            );
            case 'Twitch': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                    <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0H3.857zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142v6.286z" />
                    <path d="M11.857 3.143h-1.143V6.57h1.143V3.143zm-3.143 0H7.571V6.57h1.143V3.143z" />
                </svg>
            );
            case 'Pinterest': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.436 0-3.868 1.824-3.868 3.714 0 .733.282 1.517.632 1.943.072.087.082.164.06.297-.06.257-.194.79-.22.9-.034.145-.115.176-.265.106-1.97-.919-2.189-3.39-2.189-5.118 0-4.167 3.033-8 8.766-8 4.604 0 8.182 3.282 8.182 7.669 0 4.542-2.864 8.026-6.84 8.026-1.336 0-2.592-.693-3.024-1.51l-.824 3.136c-.296 1.137-.872 2.56-1.296 3.411A8.004 8.004 0 0 0 8 16a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                </svg>
            );
            case 'Github': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
            );
            default: return <LinkIcon className="w-5 h-5" />;
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
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {t('contactSection.email')}
                                </h3>
                                <p className="text-lg text-black font-medium">{contactEmail}</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> {t('contactSection.phone')}
                                </h3>
                                <p className="text-lg text-black font-medium">{contactPhone}</p>
                            </div>

                            {/* Social Icons */}
                            <div className="col-span-1 sm:col-span-2 pt-4">
                                <div className="flex gap-4 flex-wrap">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.id || link.network}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-[#83A98A] text-white flex items-center justify-center hover:bg-[#6D8F75] transition-colors"
                                            title={link.network}
                                        >
                                            {getSocialIcon(link.network)}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


        </section>
    );
}
