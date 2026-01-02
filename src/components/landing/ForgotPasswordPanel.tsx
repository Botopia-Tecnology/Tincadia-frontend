'use client';

import { useState } from 'react';
import { X, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { GridBackground } from '@/components/ui/GridBackground';
import { authService } from '@/services/auth.service';
import { useUI } from '@/contexts/UIContext';

interface ForgotPasswordPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ForgotPasswordPanel({ isOpen, onClose }: ForgotPasswordPanelProps) {
    const { t } = useTranslation();
    const { openLoginPanel } = useUI();

    // States
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleBackToLogin = () => {
        onClose();
        openLoginPanel();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authService.forgotPassword({ email });
            setSuccess(true);
        } catch (err) {
            console.error(err);
            // Default error message if the service call fails
            setError('Error al enviar el correo. Por favor verifica que el email sea correcto.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:bg-black/30 transition-opacity"
                    onClick={handleClose}
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
                            onClick={handleBackToLogin}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600 font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver</span>
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex-1 px-6 pb-6 pt-10">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Recuperar Contraseña
                                </h2>
                                <p className="text-gray-600">
                                    Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                                </p>
                            </div>

                            {!success ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2 pl-9"
                                                placeholder="tu@email.com"
                                                required
                                            />
                                            <Mail className="absolute left-0 bottom-2.5 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading || !email}
                                        className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Enviando...</span>
                                            </>
                                        ) : (
                                            <span>Enviar Instrucciones</span>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <Mail className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-900">¡Correo Enviado!</h3>
                                    <p className="text-green-700">
                                        Hemos enviado las instrucciones a <strong>{email}</strong>.
                                        Revisa tu bandeja de entrada (y spam) para continuar.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
