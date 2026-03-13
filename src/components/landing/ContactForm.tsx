'use client';

import { useTranslation } from '@/hooks/useTranslation';

export function ContactForm({ formik, submitStatus, formIdError }: any) {
    const t = useTranslation();
    
    return (
        <form onSubmit={formik.handleSubmit} className="space-y-8 mt-8 lg:mt-24 w-full">
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
                        className={`w-full px-0 py-3 bg-transparent border-b focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors outline-none ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full px-0 py-3 bg-transparent border-b focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors outline-none ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full px-0 py-3 bg-transparent border-b focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 text-lg transition-colors outline-none ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full px-0 py-3 bg-transparent border-b focus:border-[#83A98A] focus:ring-0 placeholder-gray-400 resize-none text-lg transition-colors outline-none ${formik.touched.message && formik.errors.message ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formik.touched.message && formik.errors.message && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.message}</p>
                    )}
                </div>
            </div>

            {submitStatus === 'success' && (
                <div className="bg-green-50/50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm animate-in fade-in duration-300">
                    ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
                </div>
            )}

            {formIdError && (
                <div className="bg-red-50/50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {formIdError}
                </div>
            )}

            <button
                type="submit"
                disabled={formik.isSubmitting || !!formIdError}
                className="px-12 py-4 bg-[#83A98A] text-white font-bold rounded-full hover:bg-[#6D8F75] transition-all shadow-lg hover:shadow-[#83A98A]/20 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
            >
                {formik.isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : t('contactSection.form.submit')}
            </button>
        </form>
    );
}
