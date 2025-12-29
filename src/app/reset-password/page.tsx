'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// SVG Icons
const LockIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        )}
    </svg>
);

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [tokenError, setTokenError] = useState(false);

    // Get tokens from URL (Supabase sends access_token and refresh_token in hash or query)
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    const errorDescription = searchParams.get('error_description');

    useEffect(() => {
        // Check if there's an error from Supabase
        if (errorDescription) {
            setTokenError(true);
            setError(decodeURIComponent(errorDescription));
            return;
        }

        // Check if we have the necessary tokens for password recovery
        if (type === 'recovery' && !accessToken) {
            setTokenError(true);
            setError('El enlace de recuperación no es válido o ha expirado.');
        }
    }, [accessToken, type, errorDescription]);

    // Password strength check
    const getPasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);
    const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Muy fuerte'];
    const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validations
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (passwordStrength < 2) {
            setError('Por favor, usa una contraseña más segura');
            return;
        }

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

            const response = await fetch(`${apiUrl}/auth/update-password`, {
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

    // Success screen
    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-tincadia-green/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative w-full max-w-md">
                    {/* Success Card */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-tincadia-green to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-tincadia-green/25">
                                <CheckIcon />
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-3">
                                ¡Contraseña Actualizada!
                            </h1>
                            <p className="text-slate-400 mb-8">
                                Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
                            </p>

                            <Link
                                href="/"
                                className="inline-flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-tincadia-green to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-tincadia-green/25 transition-all duration-300 hover:scale-[1.02]"
                            >
                                Ir al inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Token error screen
    if (tokenError) {
        return (
            <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative w-full max-w-md">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/25">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-3">
                                Enlace Inválido
                            </h1>
                            <p className="text-slate-400 mb-8">
                                {error || 'El enlace de recuperación no es válido o ha expirado. Por favor, solicita uno nuevo.'}
                            </p>

                            <Link
                                href="/"
                                className="inline-flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-slate-600 to-slate-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            >
                                Volver al inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main form
    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-y-auto">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-tincadia-green/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-tincadia-green/5 rounded-full blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-tincadia-green via-emerald-400 to-tincadia-green-light bg-clip-text text-transparent">
                        Tincadia
                    </h1>
                    <p className="text-slate-400 mt-2">Comunicación sin barreras</p>
                </div>

                {/* Main Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-tincadia-green/20 to-emerald-500/20 border border-tincadia-green/30 rounded-2xl flex items-center justify-center mb-4">
                            <div className="text-tincadia-green">
                                <LockIcon />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Nueva Contraseña
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Crea una contraseña segura para tu cuenta
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Nueva contraseña
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-tincadia-green/50 focus:ring-2 focus:ring-tincadia-green/20 transition-all duration-300 pr-12"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>

                            {/* Password strength indicator */}
                            {password.length > 0 && (
                                <div className="mt-3">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: level <= passwordStrength
                                                        ? strengthColors[passwordStrength - 1]
                                                        : 'rgba(255,255,255,0.1)'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs" style={{ color: strengthColors[passwordStrength - 1] || '#94a3b8' }}>
                                        {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Ingresa una contraseña'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm password field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirmar contraseña
                            </label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError(null);
                                    }}
                                    className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:ring-2 transition-all duration-300 pr-12 ${confirmPassword && password !== confirmPassword
                                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                                        : confirmPassword && password === confirmPassword
                                            ? 'border-green-500/50 focus:border-green-500/50 focus:ring-green-500/20'
                                            : 'border-white/10 focus:border-tincadia-green/50 focus:ring-tincadia-green/20'
                                        }`}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <EyeIcon open={showConfirmPassword} />
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">Las contraseñas no coinciden</p>
                            )}
                            {confirmPassword && password === confirmPassword && (
                                <p className="text-green-400 text-xs mt-1">✓ Las contraseñas coinciden</p>
                            )}
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading || !password || !confirmPassword}
                            className="w-full py-4 px-6 bg-gradient-to-r from-tincadia-green to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-tincadia-green/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Actualizando...</span>
                                </div>
                            ) : (
                                <>
                                    <span className="relative z-10">Actualizar Contraseña</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-tincadia-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-slate-400 hover:text-tincadia-green transition-colors text-sm"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>

                {/* Security note */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    🔒 Tu conexión está protegida con encriptación de extremo a extremo
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-tincadia-green border-t-transparent rounded-full" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
