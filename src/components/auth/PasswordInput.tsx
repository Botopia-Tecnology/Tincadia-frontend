'use client';

import { useState } from 'react';
import { EyeIcon } from './Icons';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    success?: boolean;
    className?: string;
}

export function PasswordInput({
    value,
    onChange,
    label,
    placeholder = "••••••••",
    disabled = false,
    error = false,
    success = false,
    className = "",
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const getBorderClasses = () => {
        if (error) return 'border-red-400 focus:border-red-400 focus:ring-red-200';
        if (success) return 'border-tincadia-green focus:border-tincadia-green focus:ring-tincadia-green/20';
        return 'border-gray-200 focus:border-tincadia-green focus:ring-tincadia-green/20 focus:bg-white';
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative group">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-4 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 transition-all duration-300 pr-12 ${getBorderClasses()}`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-tincadia-green transition-colors"
                    tabIndex={-1}
                >
                    <EyeIcon open={showPassword} />
                </button>
            </div>
        </div>
    );
}
