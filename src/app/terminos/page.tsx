'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function TermsPage() {
    const t = useTranslation();
    const definitionsItems = t('terms.sections.definitions.items') as unknown as any[];
    const aiItems = t('terms.sections.ai.items') as unknown as string[];
    const responsibilitiesItems = t('terms.sections.responsibilities.items') as unknown as string[];
    const licenseItems = t('terms.sections.license.items') as unknown as string[];

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('terms.title')}</h1>
                    <p className="text-gray-500">{t('terms.lastUpdated')} {new Date().toLocaleDateString('es-ES')}</p>
                </header>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                    <p className="font-bold">{t('terms.alert.title')}</p>
                    <p>{t('terms.alert.content')}</p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('terms.sections.object.title')}</h2>
                    <p>{t('terms.sections.object.content')}</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('terms.sections.definitions.title')}</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        {Array.isArray(definitionsItems) && definitionsItems.map((item, index) => (
                            <li key={index}><strong>{item.term}</strong> {item.definition}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('terms.sections.ai.title')}</h2>
                    <p>{t('terms.sections.ai.intro')}</p>
                    <ul className="list-disc pl-5 space-y-2">
                        {Array.isArray(aiItems) && aiItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('terms.sections.responsibilities.title')}</h2>
                    <p>{t('terms.sections.responsibilities.intro')}</p>
                    <ul className="list-disc pl-5 space-y-2">
                        {Array.isArray(responsibilitiesItems) && responsibilitiesItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('terms.sections.license.title')}</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        {Array.isArray(licenseItems) && licenseItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('terms.sections.intellectualProperty.title')}</h2>
                    <p>{t('terms.sections.intellectualProperty.content')}</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('terms.sections.legislation.title')}</h2>
                    <p>{t('terms.sections.legislation.content')}</p>
                </section>

                <section className="space-y-4 pt-8 border-t border-gray-200">
                    <p>{t('terms.note')}</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('terms.contact.title')}</h2>
                    <p>{t('terms.contact.text')} <a href="mailto:Contacto@tincadia.com" className="text-blue-600 hover:underline">Contacto@tincadia.com</a></p>
                </section>
            </div>
        </div>
    );
}
