'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

interface LoginPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSignUpClick?: () => void;
}

export function LoginPanel({ isOpen, onClose, onSignUpClick }: LoginPanelProps) {
    const t = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSocialLogin = (provider: 'facebook' | 'google' | 'microsoft' | 'apple') => {
        console.log(`Login con ${provider}`);
        // Aquí iría la lógica de autenticación social
    };

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login con email:', { email, password });
        // Aquí iría la lógica de login con email
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:bg-black/30 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label={t('login.closeLabel')}
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-6 pb-6">
                        <div className="space-y-8">
                            {/* Title */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {t('login.title')}
                                </h2>
                                <p className="text-gray-600">{t('login.subtitle')}</p>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleEmailLogin} className="space-y-6">
                                {/* Email Input */}
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

                                {/* Password Input */}
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

                                {/* Forgot Password */}
                                <div className="text-right">
                                    <Link
                                        href="#forgot-password"
                                        className="text-sm text-[#83A98A] hover:underline"
                                    >
                                        {t('login.forgotPassword')}
                                    </Link>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2"
                                >
                                    {t('login.loginButton')}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </form>

                            {/* Social Login Options */}
                            <div className="pt-6">
                                <p className="text-sm text-gray-500 text-center mb-4">{t('login.orContinueWith')}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleSocialLogin('google')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        title={t('login.google')}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span className="text-sm">Google</span>
                                    </button>

                                    <button
                                        onClick={() => handleSocialLogin('apple')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                        title={t('login.apple')}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                        </svg>
                                        <span className="text-sm">Apple</span>
                                    </button>

                                    <button
                                        onClick={() => handleSocialLogin('microsoft')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors col-span-2"
                                        title={t('login.microsoft')}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                                            <path fill="#F25022" d="M0 0h11v11H0z" />
                                            <path fill="#00A4EF" d="M12 0h11v11H12z" />
                                            <path fill="#7FBA00" d="M0 12h11v11H0z" />
                                            <path fill="#FFB900" d="M12 12h11v11H12z" />
                                        </svg>
                                        <span className="text-sm">Microsoft</span>
                                    </button>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600">
                                    {t('login.noAccount')}{' '}
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onSignUpClick?.();
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
