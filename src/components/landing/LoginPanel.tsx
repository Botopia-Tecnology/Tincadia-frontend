'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { type CredentialResponse } from '@react-oauth/google';
import { useTranslation } from '@/hooks/useTranslation';
import { GridBackground } from '@/components/ui/GridBackground';
import { useAuth } from '@/contexts/AuthContext';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

interface LoginPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSignUpClick?: (email?: string) => void;
}

export function LoginPanel({ isOpen, onClose, onSignUpClick }: LoginPanelProps) {
    const t = useTranslation();
    const { login, loginWithOAuth, isLoading, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const [oauthLoading, setOauthLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            setLocalError('No se recibió el token de Google');
            return;
        }

        setLocalError(null);
        clearError();
        setOauthLoading(true);

        try {
            await loginWithOAuth('google', credentialResponse.credential);
            onClose();
        } catch (err) {
            setLocalError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google');
        } finally {
            setOauthLoading(false);
        }
    };

    const handleGoogleError = () => {
        setLocalError('Error al conectar con Google. Intenta de nuevo.');
    };

    const handleOtherSocialLogin = () => {
        setLocalError('OAuth con este proveedor aún no está disponible.');
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        clearError();

        try {
            await login({ email, password });
            onClose();
        } catch (err) {
            setLocalError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        }
    };

    const displayError = localError || error;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:bg-black/30 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } overflow-hidden`}
            >
                <GridBackground className="absolute inset-0 -z-10" />
                <div className="h-full flex flex-col overflow-y-auto relative z-10">
                    <div className="flex items-center justify-between p-6">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label={t('login.closeLabel')}
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex-1 px-6 pb-6">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {t('login.title')}
                                </h2>
                                <p className="text-gray-600">{t('login.subtitle')}</p>
                            </div>

                            <form onSubmit={handleEmailLogin} className="space-y-6">
                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                                        placeholder={t('login.emailPlaceholder')}
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                                        placeholder={t('login.passwordPlaceholder')}
                                        required
                                    />
                                </div>

                                <div className="text-right">
                                    <Link href="#forgot-password" className="text-sm text-[#83A98A] hover:underline">
                                        {t('login.forgotPassword')}
                                    </Link>
                                </div>

                                {displayError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{displayError}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Iniciando sesión...</span>
                                        </>
                                    ) : (
                                        <>
                                            {t('login.loginButton')}
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="pt-6">
                                <p className="text-sm text-gray-500 text-center mb-4">{t('login.orContinueWith')}</p>
                                <SocialLoginButtons
                                    onGoogleSuccess={handleGoogleSuccess}
                                    onGoogleError={handleGoogleError}
                                    onAppleClick={handleOtherSocialLogin}
                                    onMicrosoftClick={handleOtherSocialLogin}
                                    disabled={oauthLoading}
                                    googleText="continue_with"
                                />
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600">
                                    {t('login.noAccount')}{' '}
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onSignUpClick?.(email);
                                        }}
                                        className="text-[#83A98A] hover:underline font-semibold"
                                    >
                                        {t('login.signUp')}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
