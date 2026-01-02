'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Modular components
import { LockIcon, CheckCircleIcon, WarningIcon, SpinnerIcon } from '@/components/auth/Icons';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrengthIndicator, getPasswordStrength } from '@/components/auth/PasswordStrengthIndicator';
import { StatusCard } from '@/components/auth/StatusCard';

// =============================================================================
// Constants
// =============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// =============================================================================
// Main Component
// =============================================================================

function ResetPasswordContent() {
    const searchParams = useSearchParams();

    // Form state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Screen state
    const [isSuccess, setIsSuccess] = useState(false);
    const [tokenError, setTokenError] = useState(false);

    // URL params from Supabase
    // URL params from Supabase (query params)
    const queryAccessToken = searchParams.get('access_token');
    const queryErrorDescription = searchParams.get('error_description');
    const type = searchParams.get('type');

    // State for the token (can come from query or hash)
    const [accessToken, setAccessToken] = useState<string | null>(queryAccessToken);

    // Validate token on mount and check hash
    useEffect(() => {
        // 1. Check for errors in query params
        if (queryErrorDescription) {
            setTokenError(true);
            setError(decodeURIComponent(queryErrorDescription));
            return;
        }

        // 2. Check hash for token if not in query params
        const checkHash = () => {
            if (typeof window !== 'undefined' && window.location.hash) {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const hashToken = hashParams.get('access_token');
                const hashError = hashParams.get('error_description');

                if (hashError) {
                    setTokenError(true);
                    setError(decodeURIComponent(hashError));
                    return true; // handled
                }

                if (hashToken) {
                    setAccessToken(hashToken);
                    return true; // found token
                }
            }
            return false;
        };

        const foundInHash = checkHash();

        // 3. Validation fallback logic
        // If we didn't find a token in hash AND we don't have one from query...
        if (!foundInHash && !queryAccessToken) {
            // Only show error if we are sure we needed one (e.g. type=recovery implies we expect a token)
            // Or if we just want to be strict that this page requires a token.
            // However, Supabase sometimes redirects without 'type' in hash mode.
            // Let's assume if no token is found at all, it's invalid.
            setTokenError(true);
            setError('El enlace de recuperación no es válido o está incompleto.');
        } else {
            // If we found a token (either query or hash), clear any previous token error
            setTokenError(false);
        }

    }, [queryAccessToken, queryErrorDescription, type]);

    // Form validation
    const passwordStrength = getPasswordStrength(password);
    const passwordsMatch = password === confirmPassword;
    const canSubmit = password && confirmPassword && passwordsMatch && passwordStrength >= 2;

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!passwordsMatch) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (passwordStrength < 2) {
            setError('Por favor, usa una contraseña más segura');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/update-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar la contraseña');
            }

            setIsSuccess(true);
        } catch (err: any) {
            console.error('Error updating password:', err);
            setError(err.message || 'Ocurrió un error al actualizar la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================================================
    // Render: Success Screen
    // ==========================================================================
    if (isSuccess) {
        return (
            <StatusCard
                type="success"
                icon={<CheckCircleIcon />}
                title="¡Contraseña Actualizada!"
                message="Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña."
                buttonText="Ir al inicio"
                buttonHref="/"
            />
        );
    }

    // ==========================================================================
    // Render: Token Error Screen
    // ==========================================================================
    if (tokenError) {
        return (
            <StatusCard
                type="error"
                icon={<WarningIcon />}
                title="Enlace Inválido"
                message={error || 'El enlace de recuperación no es válido o ha expirado. Por favor, solicita uno nuevo.'}
                buttonText="Volver al inicio"
                buttonHref="/"
            />
        );
    }

    // ==========================================================================
    // Render: Main Form
    // ==========================================================================
    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 via-white to-tincadia-green-light/20 flex items-center justify-center p-4 overflow-y-auto">
            {/* Decorative background */}
            <BackgroundDecorations />

            <div className="relative w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-tincadia-green">Tincadia</h1>
                    <p className="text-gray-500 mt-2">Comunicación sin barreras</p>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-tincadia-green/10 border border-tincadia-green/30 rounded-2xl flex items-center justify-center mb-4">
                            <div className="text-tincadia-green">
                                <LockIcon />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nueva Contraseña</h2>
                        <p className="text-gray-500 text-sm">Crea una contraseña segura para tu cuenta</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Password field */}
                        <div>
                            <PasswordInput
                                label="Nueva contraseña"
                                value={password}
                                onChange={(val) => {
                                    setPassword(val);
                                    setError(null);
                                }}
                                disabled={isLoading}
                            />
                            <PasswordStrengthIndicator password={password} />
                        </div>

                        {/* Confirm password field */}
                        <div>
                            <PasswordInput
                                label="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(val) => {
                                    setConfirmPassword(val);
                                    setError(null);
                                }}
                                disabled={isLoading}
                                error={!!confirmPassword && !passwordsMatch}
                                success={!!confirmPassword && passwordsMatch}
                            />
                            {confirmPassword && !passwordsMatch && (
                                <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
                            )}
                            {confirmPassword && passwordsMatch && (
                                <p className="text-tincadia-green text-xs mt-1">✓ Las contraseñas coinciden</p>
                            )}
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-600 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Submit button */}
                        <SubmitButton isLoading={isLoading} disabled={!canSubmit} />
                    </form>

                    {/* Footer link */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-gray-500 hover:text-tincadia-green transition-colors text-sm">
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>

                {/* Security note */}
                <p className="text-center text-gray-400 text-xs mt-6">
                    🔒 Tu conexión está protegida con encriptación de extremo a extremo
                </p>
            </div>
        </div>
    );
}

// =============================================================================
// Sub-components
// =============================================================================

function BackgroundDecorations() {
    return (
        <>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-tincadia-green/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-tincadia-green-light/25 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-tincadia-green/5 rounded-full blur-3xl" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(131,169,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(131,169,138,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </>
    );
}

function SubmitButton({ isLoading, disabled }: { isLoading: boolean; disabled: boolean }) {
    return (
        <button
            type="submit"
            disabled={isLoading || disabled}
            className="w-full py-4 px-6 bg-gradient-to-r from-tincadia-green to-tincadia-green-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-tincadia-green/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <SpinnerIcon />
                    <span>Actualizando...</span>
                </div>
            ) : (
                <>
                    <span className="relative z-10">Actualizar Contraseña</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-tincadia-green-dark to-tincadia-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
            )}
        </button>
    );
}

// =============================================================================
// Page Export
// =============================================================================

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ResetPasswordContent />
        </Suspense>
    );
}

function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 via-white to-tincadia-green-light/20 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-tincadia-green border-t-transparent rounded-full" />
        </div>
    );
}
