'use client';

import { BarChart3, ExternalLink } from 'lucide-react';

// PostHog Dashboard Configuration
const POSTHOG_HOST = 'https://us.posthog.com';
const POSTHOG_PROJECT_ID = '19024';

export default function AnalyticsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                </div>
                <a
                    href={`${POSTHOG_HOST}/project/${POSTHOG_PROJECT_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                    <ExternalLink className="w-4 h-4" />
                    Abrir PostHog
                </a>
            </div>

            {/* Embedded PostHog Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <iframe
                    width="100%"
                    height="700"
                    frameBorder="0"
                    allowFullScreen
                    src="https://us.posthog.com/embedded/13bB7iiqlEmt_qWwDHUcoj-1FP-IEg"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    className="w-full"
                />
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-1">💡 PostHog está activo</h4>
                <p className="text-sm text-blue-700">
                    Tu sitio web y app móvil están enviando datos a PostHog. Los pageviews, eventos y conversiones
                    se están registrando automáticamente.
                </p>
            </div>
        </div>
    );
}
