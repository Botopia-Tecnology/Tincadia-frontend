'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface StatusCardProps {
    type: 'success' | 'error';
    icon: ReactNode;
    title: string;
    message: string;
    buttonText: string;
    buttonHref: string;
}

export function StatusCard({
    type,
    icon,
    title,
    message,
    buttonText,
    buttonHref,
}: StatusCardProps) {
    const bgGradient = type === 'success'
        ? 'from-gray-50 via-white to-tincadia-green-light/20'
        : 'from-gray-50 via-white to-red-50';

    const decorativeColor = type === 'success'
        ? 'bg-tincadia-green/20'
        : 'bg-red-100';

    const iconBgColor = type === 'success'
        ? 'bg-gradient-to-br from-tincadia-green to-tincadia-green-dark'
        : 'bg-gradient-to-br from-red-500 to-orange-500';

    const buttonClasses = type === 'success'
        ? 'bg-gradient-to-r from-tincadia-green to-tincadia-green-dark hover:shadow-lg hover:shadow-tincadia-green/25 hover:scale-[1.02]'
        : 'bg-gray-600 hover:bg-gray-700';

    return (
        <div className={`fixed inset-0 z-50 bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4`}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute -top-40 -right-40 w-80 h-80 ${decorativeColor} rounded-full blur-3xl`} />
                {type === 'success' && (
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-tincadia-green-light/30 rounded-full blur-3xl" />
                )}
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
                    <div className="text-center">
                        {/* Icon */}
                        <div className={`mx-auto w-20 h-20 ${iconBgColor} rounded-2xl flex items-center justify-center mb-6 shadow-lg text-white`}>
                            {icon}
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-3">
                            {title}
                        </h1>
                        <p className="text-gray-600 mb-8">
                            {message}
                        </p>

                        <Link
                            href={buttonHref}
                            className={`inline-flex items-center justify-center w-full py-4 px-6 text-white font-semibold rounded-xl transition-all duration-300 ${buttonClasses}`}
                        >
                            {buttonText}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
