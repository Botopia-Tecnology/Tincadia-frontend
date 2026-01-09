'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PrivacyPage() {
    const t = useTranslation();
    const purposesItems = t('privacy.sections.purposes.items') as unknown as string[];
    const rightsItems = t('privacy.sections.rights.items') as unknown as string[];

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('privacy.title')}</h1>
                    <p className="text-gray-500">{t('privacy.lastUpdated')} {new Date().toLocaleDateString('es-ES')}</p>
                </header>

                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-8">
                    <p><strong>{t('privacy.header.responsible')}</strong> {t('privacy.header.responsibleName')}</p>
                    <p><strong>{t('privacy.header.contact')}</strong> <a href="mailto:Contacto@tincadia.com" className="text-blue-600 hover:underline">Contacto@tincadia.com</a></p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.sections.purposes.title')}</h2>
                    <p>{t('privacy.sections.purposes.intro')}</p>
                    <ul className="list-disc pl-5 space-y-2">
                        {Array.isArray(purposesItems) && purposesItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 font-bold">{t('privacy.sections.purposes.prohibition.title')}</p>
                        <p className="text-red-600">{t('privacy.sections.purposes.prohibition.content')}</p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.sections.rights.title')}</h2>
                    <p>{t('privacy.sections.rights.intro')}</p>
                    <ul className="list-disc pl-5 space-y-2">
                        {Array.isArray(rightsItems) && rightsItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.sections.security.title')}</h2>
                    <p>{t('privacy.sections.security.content')}</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.sections.retention.title')}</h2>
                    <p>{t('privacy.sections.retention.content')}</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.sections.modifications.title')}</h2>
                    <p>{t('privacy.sections.modifications.content')}</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.contact.title')}</h2>
                    <p>{t('privacy.contact.text')} <a href="mailto:Contacto@tincadia.com" className="text-blue-600 hover:underline">Contacto@tincadia.com</a></p>
                </section>
            </div>
        </div>
    );
}
