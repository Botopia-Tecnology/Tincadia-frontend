'use client';

import { useState } from 'react';
import { X, Facebook, Chrome, Apple } from 'lucide-react';
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
                                        className="flex items-center justify-center px-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        title={t('login.google')}
                                    >
                                        <Chrome className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => handleSocialLogin('apple')}
                                        className="flex items-center justify-center px-3 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                        title={t('login.apple')}
                                    >
                                        <Apple className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => handleSocialLogin('microsoft')}
                                        className="flex items-center justify-center px-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors col-span-2"
                                        title={t('login.microsoft')}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
                                            <path fill="#F25022" d="M0 0h11v11H0z" />
                                            <path fill="#00A4EF" d="M12 0h11v11H12z" />
                                            <path fill="#7FBA00" d="M0 12h11v11H0z" />
                                            <path fill="#FFB900" d="M12 12h11v11H12z" />
                                        </svg>
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
