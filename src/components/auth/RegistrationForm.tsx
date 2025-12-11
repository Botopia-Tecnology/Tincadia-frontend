'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { DOCUMENT_TYPES, type DocumentTypeId } from '@/types/auth.types';

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

    const [formData, setFormData] = useState<RegistrationFormData>({
        nombre: '',
        apellido: '',
        tipoDocumento: '',
        numeroDocumento: '',
        telefono: '',
        password: '',
        confirmPassword: '',
        aceptaPoliticas: false,
    });
    const [formError, setFormError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (name === 'tipoDocumento') {
            setFormData((prev) => ({ ...prev, [name]: value ? Number(value) as DocumentTypeId : '' }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (formData.password !== formData.confirmPassword) {
            setFormError(t('registration.panel.passwordMismatch') as string);
            return;
        }

        if (!formData.aceptaPoliticas) {
            setFormError(`${t('registration.panel.acceptPolicies')} ${t('registration.panel.policiesLink')}`);
            return;
        }

        await onSubmit(formData);
    };

    const displayError = formError || error;
    const passwordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('registration.panel.createAccount')}
                </h2>
            </div>

            <div>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.fullName')}
                    required
                />
            </div>

            <div>
                <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.lastName')}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                    className="bg-transparent text-lg text-gray-900 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    required
                >
                    <option value="">{t('registration.panel.documentType')}</option>
                    {DOCUMENT_TYPES.map((docType) => (
                        <option key={docType.id} value={docType.id}>
                            {docType.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleInputChange}
                    className="bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.documentNumber')}
                    required
                />
            </div>

            <div>
                <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.phone')}
                    required
                />
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

            <div>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.password')}
                    required
                />
            </div>

            <div>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b pb-2 focus:outline-none transition-colors ${passwordMismatch ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-900'
                        }`}
                    placeholder={t('registration.panel.confirmPassword')}
                    required
                />
                {passwordMismatch && (
                    <p className="text-sm text-red-500 mt-1">{t('registration.panel.passwordMismatch')}</p>
                )}
            </div>

            {displayError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {displayError}
                </div>
            )}

            <div className="flex items-start gap-3 pt-2">
                <input
                    type="checkbox"
                    id="aceptaPoliticas"
                    name="aceptaPoliticas"
                    checked={formData.aceptaPoliticas}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[#83A98A] border-gray-300 rounded focus:ring-[#83A98A] cursor-pointer"
                    required
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

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
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
                disabled={isLoading}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors text-center disabled:opacity-50"
            >
                ← {t('common.back')}
            </button>
        </form>
    );
}

export type { RegistrationFormData };
