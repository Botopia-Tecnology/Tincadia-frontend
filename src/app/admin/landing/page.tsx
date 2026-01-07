'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { LandingConfigItem } from './types';

export default function LandingConfigPage() {
    const { user } = useAuth();
    const [configs, setConfigs] = useState<LandingConfigItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    // Fetch configs
    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const data = await api.get<LandingConfigItem[]>('/content/landing-config');
                setConfigs(data);
            } catch (error) {
                console.error('Error fetching landing config:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchConfigs();
        }
    }, [user]);

    const handleSave = async (item: LandingConfigItem) => {
        setSaving(item.key);
        try {
            await api.put('/content/landing-config', {
                key: item.key,
                value: item.value,
                description: item.description
            });
            console.log('Saved successfully');
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSaving(null);
        }
    };

    const handleChange = (key: string, newValue: string) => {
        setConfigs(prev => prev.map(item =>
            item.key === key ? { ...item, value: newValue } : item
        ));
    };

    if (loading) return <div className="p-8">Cargando configuración...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Configuración Landing Page & Multimedia</h1>

            <div className="grid gap-6">
                {configs.map((item) => (
                    <div key={item.key} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.key}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <button
                                onClick={() => handleSave(item)}
                                disabled={saving === item.key}
                                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors
                                    ${saving === item.key
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {saving === item.key ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor / URL
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => handleChange(item.key, e.target.value)}
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>

                            {/* Preview logic */}
                            {item.value.startsWith('http') && (
                                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">Vista Previa:</p>
                                    {item.value.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                        <img src={item.value} alt="Preview" className="h-32 object-contain" />
                                    ) : item.value.match(/\.(mp4|webm)$/i) ? (
                                        <video src={item.value} className="h-32" controls />
                                    ) : (
                                        <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                            Abrir enlace: {item.value}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
