'use client';

import { useState } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { type CredentialResponse } from '@react-oauth/google';
import { appleAuthHelpers } from 'react-apple-signin-auth';
import { useTranslation } from '@/hooks/useTranslation';
import { GridBackground } from '@/components/ui/GridBackground';
import { useAuth } from '@/contexts/AuthContext';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

interface LoginPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSignUpClick?: (email?: string) => void;
    onForgotPasswordClick?: () => void;
}

export function LoginPanel({ isOpen, onClose, onSignUpClick, onForgotPasswordClick }: LoginPanelProps) {
    const t = useTranslation();
    const { login, loginWithOAuth, isLoading, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const handleAppleLogin = async () => {
        setLocalError(null);
        clearError();
        setOauthLoading(true);

        try {
            const response = await appleAuthHelpers.signIn({
                authOptions: {
                    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
                    scope: 'email name',
                    redirectURI: process.env.NEXT_PUBLIC_APP_URL || '',
                    usePopup: true,
                },
                onError: (error: any) => {
                    console.error('Apple Sign In Error:', error);
                    throw new Error(error.error || 'Error en inicio de sesión con Apple');
                },
            });

            if (response && response.authorization && response.authorization.id_token) {
                await loginWithOAuth('apple', response.authorization.id_token);
                onClose();
            } else {
                throw new Error('No se recibió el token de Apple');
            }
        } catch (err) {
            console.error(err);
            setLocalError(err instanceof Error ? err.message : 'Error al iniciar sesión con Apple');
        } finally {
            setOauthLoading(false);
        }
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

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2 pr-10"
                                        placeholder={t('login.passwordPlaceholder')}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-0 pb-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => onForgotPasswordClick?.()}
                                        className="text-sm text-[#83A98A] hover:underline"
                                    >
                                        {t('login.forgotPassword')}
                                    </button>
                                </div>

                                {displayError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{displayError}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#111827] text-white font-semibold py-4 px-6 rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    onAppleClick={handleAppleLogin}
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
