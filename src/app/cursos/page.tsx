'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
    const t = useTranslation();

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
            <div className="bg-[#83A98A]/10 p-6 rounded-full mb-8 animate-bounce">
                <Construction className="w-16 h-16 text-[#83A98A]" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {t('courses.comingSoonTitle')}
            </h1>

            <p className="text-lg text-gray-600 max-w-lg mb-10 leading-relaxed">
                {t('courses.comingSoonDescription')}
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#83A98A] text-white font-semibold rounded-full hover:bg-[#6D8F75] transition-all hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
                <ArrowLeft className="w-5 h-5" />
                {t('courses.backHome')}
            </Link>
        </main>
    );
}
