'use client';

import { useState, useEffect } from 'react';
import { PlayCircle, Loader2, Save } from 'lucide-react';
import { LandingConfigItem } from '@/app/admin/landing/types';
import { CloudinaryUploadWidget } from '@/components/common/CloudinaryUploadWidget';

export function HowToStartSection({ items, onSave, saving }: {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    saving: string | null;
}) {
    const steps = [1, 2, 3, 4];
    const ensureItems = steps.map(step => {
        const key = `how_to_start_step_${step}`;
        const existing = items.find(i => i.key === key);
        return existing || {
            key,
            value: '',
            description: `Paso ${step}`,
            updatedAt: new Date().toISOString()
        } as LandingConfigItem;
    });

    const [localItems, setLocalItems] = useState(ensureItems);

    useEffect(() => {
        const merged = steps.map(step => {
            const key = `how_to_start_step_${step}`;
            const existingInProps = items.find(i => i.key === key);
            return existingInProps || {
                key,
                value: '',
                description: `Paso ${step}`,
                updatedAt: new Date().toISOString()
            } as LandingConfigItem;
        });
        setLocalItems(merged);
    }, [items]);

    const handleChange = (key: string, newValue: string) => {
        setLocalItems(prev => prev.map(item =>
            item.key === key ? { ...item, value: newValue } : item
        ));
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 mb-6">
                <div>
                    <h3 className="text-blue-200 font-semibold flex items-center gap-2">
                        <PlayCircle className="w-5 h-5" /> Configuración "Cómo Empezar"
                    </h3>
                    <p className="text-sm text-blue-300/60 mt-1">
                        Sube una imagen o video para cada uno de los 4 pasos. El sistema detectará automáticamente si es video o imagen por la extensión.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {localItems.map((item, index) => {
                    const isVideo = item.value.match(/\.(mp4|webm|mov|avi)$/i);

                    return (
                        <div key={item.key} className="bg-slate-800/40 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600/20 px-3 py-1 rounded-bl-xl text-blue-300 text-xs font-bold border-l border-b border-blue-500/20">
                                Paso {index + 1}
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-white">Visual para {item.description}</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-1">{item.key}</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="aspect-video bg-slate-900/50 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center relative group/preview">
                                    {item.value ? (
                                        isVideo ? (
                                            <video src={item.value} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <img src={item.value} alt={item.description} className="w-full h-full object-cover" />
                                        )
                                    ) : (
                                        <div className="text-slate-600 flex flex-col items-center">
                                            <PlayCircle className="w-8 h-8 opacity-50 mb-2" />
                                            <span className="text-xs">Sin contenido</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <CloudinaryUploadWidget
                                        onUpload={(url) => handleChange(item.key, url)}
                                        folder="tincadia/landing/how_to_start"
                                        buttonText="Subir Imagen"
                                        resourceType="image"
                                    />
                                    <CloudinaryUploadWidget
                                        onUpload={(url) => handleChange(item.key, url)}
                                        folder="tincadia/landing/how_to_start"
                                        buttonText="Subir Video"
                                        resourceType="video"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 font-medium ml-1">URL del Recurso</label>
                                    <input
                                        type="text"
                                        value={localItems.find(i => i.key === item.key)?.value || ''}
                                        onChange={(e) => handleChange(item.key, e.target.value)}
                                        placeholder="https://..."
                                        className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2 gap-2">
                                <button
                                    onClick={() => handleChange(item.key, '')}
                                    className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
                                    title="Quitar contenido"
                                >
                                    Quitar
                                </button>
                                <button
                                    onClick={() => onSave({ ...item, value: localItems.find(i => i.key === item.key)?.value || item.value })}
                                    disabled={saving === item.key}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2
                                            ${saving === item.key ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600/80 hover:bg-blue-600 shadow-lg shadow-blue-900/20'}`}
                                >
                                    {saving === item.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    {saving === item.key ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
