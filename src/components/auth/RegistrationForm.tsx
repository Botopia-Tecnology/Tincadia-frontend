'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { DOCUMENT_TYPES, type DocumentTypeId } from '@/types/auth.types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface RegistrationFormData {
    nombre: string;
    apellido: string;
    tipoDocumento: string | DocumentTypeId;
    numeroDocumento: string;
    telefono: string;
    password: string;
    confirmPassword: string;
    aceptaPoliticas: boolean;
}

interface RegistrationFormProps {
    email: string;
    onEmailChange: (email: string) => void;
    onSubmit: (data: RegistrationFormData) => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
}

export function RegistrationForm({
    email,
    onEmailChange,
    onSubmit,
    onBack,
    isLoading,
    error,
}: RegistrationFormProps) {
    const t = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validationSchema = Yup.object({
        nombre: Yup.string().required(t('forms.common.required') as string),
        apellido: Yup.string().required(t('forms.common.required') as string),
        tipoDocumento: Yup.string().required(t('forms.common.required') as string),
        numeroDocumento: Yup.string().required(t('forms.common.required') as string),
        telefono: Yup.string().required(t('forms.common.required') as string),
        password: Yup.string().min(6, 'Mínimo 6 caracteres').required(t('forms.common.required') as string),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], t('registration.panel.passwordMismatch') as string)
            .required(t('forms.common.required') as string),
        aceptaPoliticas: Yup.boolean().oneOf([true], t('registration.panel.acceptPolicies') as string),
    });

    const formik = useFormik<RegistrationFormData>({
        initialValues: {
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            numeroDocumento: '',
            telefono: '',
            password: '',
            confirmPassword: '',
            aceptaPoliticas: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('registration.panel.createAccount')}
                </h2>
            </div>

            <div>
                <input
                    type="text"
                    name="nombre"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nombre}
                    className={`w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b focus:outline-none focus:border-gray-900 transition-colors pb-2 ${formik.touched.nombre && formik.errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={t('registration.panel.fullName')}
                />
                {formik.touched.nombre && formik.errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.nombre}</p>
                )}
            </div>

            <div>
                <input
                    type="text"
                    name="apellido"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.apellido}
                    className={`w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b focus:outline-none focus:border-gray-900 transition-colors pb-2 ${formik.touched.apellido && formik.errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={t('registration.panel.lastName')}
                />
                {formik.touched.apellido && formik.errors.apellido && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.apellido}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <select
                        name="tipoDocumento"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.tipoDocumento}
                        className={`bg-transparent text-lg text-gray-900 border-0 border-b focus:outline-none focus:border-gray-900 transition-colors pb-2 ${formik.touched.tipoDocumento && formik.errors.tipoDocumento ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">{t('registration.panel.documentType')}</option>
                        {DOCUMENT_TYPES.map((docType) => (
                            <option key={docType.id} value={docType.id}>
                                {docType.name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.tipoDocumento && formik.errors.tipoDocumento && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.tipoDocumento}</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <input
                        type="text"
                        name="numeroDocumento"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.numeroDocumento}
                        className={`bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b focus:outline-none focus:border-gray-900 transition-colors pb-2 ${formik.touched.numeroDocumento && formik.errors.numeroDocumento ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={t('registration.panel.documentNumber')}
                    />
                    {formik.touched.numeroDocumento && formik.errors.numeroDocumento && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.numeroDocumento}</p>
                    )}
                </div>
            </div>

            <div>
                <input
                    type="tel"
                    name="telefono"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.telefono}
                    className={`w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b focus:outline-none focus:border-gray-900 transition-colors pb-2 ${formik.touched.telefono && formik.errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={t('registration.panel.phone')}
                />
                {formik.touched.telefono && formik.errors.telefono && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.telefono}</p>
                )}
            </div>

            <div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.email')}
                    required
                />
            </div>

            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b focus:outline-none focus:border-gray-900 transition-colors pb-2 pr-10 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={t('registration.panel.password')}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 pb-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                )}
            </div>

            <div className="relative">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className={`w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b pb-2 pr-10 focus:outline-none transition-colors ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-900'}`}
                    placeholder={t('registration.panel.confirmPassword')}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 pb-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.confirmPassword}</p>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col items-start gap-1 pt-2">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="aceptaPoliticas"
                        name="aceptaPoliticas"
                        checked={formik.values.aceptaPoliticas}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 w-4 h-4 text-[#83A98A] border-gray-300 rounded focus:ring-[#83A98A] cursor-pointer"
                    />
                    <label htmlFor="aceptaPoliticas" className="text-sm text-gray-700 cursor-pointer">
                        {t('registration.panel.acceptPolicies')}{' '}
                        <Link href="#politicas" className="text-[#83A98A] hover:underline">
                            {t('registration.panel.policiesLink')}
                        </Link>{' '}
                        {t('registration.panel.andDataUsage')}{' '}
                        <Link href="#datos" className="text-[#83A98A] hover:underline">
                            {t('registration.panel.dataUsageLink')}
                        </Link>
                    </label>
                </div>
                {formik.touched.aceptaPoliticas && formik.errors.aceptaPoliticas && (
                    <p className="text-red-500 text-sm pl-7">{formik.errors.aceptaPoliticas}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading || formik.isSubmitting}
                className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading || formik.isSubmitting ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('common.loading')}
                    </>
                ) : (
                    <>
                        {t('registration.panel.createAccountButton')}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </>
                )}
            </button>

            <button
                type="button"
                onClick={onBack}
                disabled={isLoading || formik.isSubmitting}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors text-center disabled:opacity-50"
            >
                ← {t('common.back')}
            </button>
        </form>
    );
}
export type { RegistrationFormData };
