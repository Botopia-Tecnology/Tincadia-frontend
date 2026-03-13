'use client';

import { X, Loader2 } from 'lucide-react';

export function JobSeekerFooter({ formik, submitStatus, formIdError, isEditing, t }: any) {
    return (
        <div className="space-y-8 pt-6 border-t border-gray-100">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                        15. {t('forms.jobSeeker.fields.training')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <div className="flex gap-6">
                        {['si', 'no'].map((val) => (
                            <label key={val} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="recibirCapacitacion"
                                    value={val}
                                    checked={formik.values.recibirCapacitacion === val}
                                    onChange={formik.handleChange}
                                    className="w-5 h-5 text-[#83A98A] focus:ring-[#83A98A]"
                                />
                                <span className="text-gray-700 font-medium">{t(`forms.common.${val}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                        16. {t('forms.jobSeeker.fields.dataAuthorization')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <div className="flex gap-6">
                        {['si', 'no'].map((val) => (
                            <label key={val} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="autorizaTratamientoDatos"
                                    value={val}
                                    checked={formik.values.autorizaTratamientoDatos === val}
                                    onChange={formik.handleChange}
                                    className="w-5 h-5 text-[#83A98A] focus:ring-[#83A98A]"
                                />
                                <span className="text-gray-700 font-medium">{t(`forms.common.${val}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {formIdError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                    {formIdError}
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 animate-in shake duration-500">
                    <X className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold text-red-900">Error al enviar</h3>
                        <p className="text-sm text-red-700 mt-1">Hubo un problema procesando tu solicitud. Por favor intenta de nuevo.</p>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={formik.isSubmitting || !!formIdError}
                className="w-full bg-[#83A98A] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#6D8F75] transition-all shadow-lg hover:shadow-[#83A98A]/20 disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {formik.isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>{isEditing ? 'Actualizando...' : t('forms.common.sending')}</span>
                    </>
                ) : (
                    isEditing ? 'Actualizar Solicitud' : t('registration.jobSeeker.submitForm')
                )}
            </button>
        </div>
    );
}
