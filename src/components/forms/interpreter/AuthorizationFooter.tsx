'use client';

import { X, Loader2 } from 'lucide-react';
import { FormikProps } from 'formik';
import { InterpreterFormData } from '@/hooks/useInterpreterForm';

interface AuthorizationFooterProps {
    formik: FormikProps<InterpreterFormData>;
    submitStatus: string;
    errorMessage?: string | null;
    formIdError: string | null;
    isEditing: boolean;
    t: (key: string) => string;
}

export function AuthorizationFooter({ formik, submitStatus, errorMessage, formIdError, isEditing, t }: AuthorizationFooterProps) {
    return (
        <div className="space-y-8 pt-6 border-t border-gray-100">
            {/* 15. Autorización */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                    15. {t('forms.interpreter.fields.authorization')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <div className="flex gap-8">
                    {['si', 'no'].map((val) => (
                        <label key={val} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="autorizaInclusion"
                                value={val}
                                checked={formik.values.autorizaInclusion === val}
                                onChange={formik.handleChange}
                                className="w-5 h-5 text-[#83A98A] focus:ring-[#83A98A]"
                            />
                            <span className="text-gray-700 font-medium">{t(`forms.common.${val === 'si' ? 'yes' : 'no'}`)}</span>
                        </label>
                    ))}
                </div>
                {formik.touched.autorizaInclusion && formik.errors.autorizaInclusion && (
                    <p className="text-red-500 text-sm mt-2">{formik.errors.autorizaInclusion}</p>
                )}
            </div>

            {/* Error Messages */}
            {formIdError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {formIdError}
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 animate-in shake duration-500">
                    <div className="p-2 bg-red-100 rounded-full h-fit">
                        <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h3 className="text-sm font-bold text-red-900">Error al enviar</h3>
                        <p className="text-sm text-red-700">
                            {errorMessage || 'Debes registrarte o iniciar sesión primero para poder enviar tu solicitud.'}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-3">
                            <a
                                href="/registro"
                                className="text-xs font-semibold bg-[#83A98A] text-white px-4 py-2 rounded-lg hover:bg-[#6D8F75] transition-colors inline-flex items-center"
                            >
                                Registrarme ahora
                            </a>
                            <a
                                href="/login"
                                className="text-xs font-semibold bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
                            >
                                Iniciar sesión
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Button */}
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
                    isEditing ? 'Actualizar Solicitud' : t('registration.interpreterForm.submitForm')
                )}
            </button>
        </div>
    );
}
