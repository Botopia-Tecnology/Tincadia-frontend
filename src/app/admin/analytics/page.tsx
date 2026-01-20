'use client';

import { BarChart3, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

// PostHog Dashboard Configuration
const POSTHOG_HOST = 'https://us.posthog.com';
const POSTHOG_PROJECT_ID = '19024';

export default function AnalyticsPage() {
    const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/admin/dashboard-config');
                const data = await res.json();
                setDashboardUrl(data.url);
            } catch (error) {
                console.error('Failed to load dashboard config', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-[400px] text-gray-500">
                        Cargando panel...
                    </div>
                ) : dashboardUrl ? (
                    <iframe
                        width="100%"
                        height="700"
                        frameBorder="0"
                        allowFullScreen
                        src={dashboardUrl}
                        sandbox="allow-scripts allow-same-origin allow-popups"
                        className="w-full"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 p-8 text-center bg-gray-50">
                        <BarChart3 className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Panel no configurado</h3>
                        <p className="max-w-md mx-auto mb-4">
                            No se ha encontrado la URL del dashboard.
                        </p>
                        <div className="p-3 bg-yellow-100 text-yellow-800 text-sm rounded text-left">
                            Configure <code>POSTHOG_SHARED_DASHBOARD_URL</code> en el archivo <code>.env</code>
                        </div>
                    </div>
                )}
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
