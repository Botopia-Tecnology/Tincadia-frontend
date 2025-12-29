'use client';

interface PasswordStrengthIndicatorProps {
    password: string;
}

// Color palette using Tincadia green for good/strong passwords
const STRENGTH_COLORS = ['#ef4444', '#f97316', '#eab308', '#83A98A', '#6D8F75'];
const STRENGTH_LABELS = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Muy fuerte'];

export function getPasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    const strength = getPasswordStrength(password);

    if (password.length === 0) {
        return null;
    }

    return (
        <div className="mt-3">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: level <= strength
                                ? STRENGTH_COLORS[strength - 1]
                                : '#e5e7eb'
                        }}
                    />
                ))}
            </div>
            <p
                className="text-xs"
                style={{ color: STRENGTH_COLORS[strength - 1] || '#9ca3af' }}
            >
                {strength > 0 ? STRENGTH_LABELS[strength - 1] : 'Ingresa una contraseña'}
            </p>
        </div>
    );
}
