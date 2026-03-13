'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { LandingConfigItem } from '@/app/admin/landing/types';
import { CloudinaryUploadWidget } from '@/components/common/CloudinaryUploadWidget';

interface ConfigSectionProps {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    saving: string | null;
}

export function ConfigSection({ items, onSave, saving }: ConfigSectionProps) {
    const [localItems, setLocalItems] = useState(items);

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleChange = (key: string, newValue: string) => {
        setLocalItems(prev => prev.map(item =>
            item.key === key ? { ...item, value: newValue } : item
        ));
    };

    if (items.length === 0) {
        return <p className="text-slate-500 text-center py-12">No hay elementos en esta sección.</p>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {localItems.map((item) => {
                const isImage = item.value.match(/\.(jpeg|jpg|gif|png|webp)$/i) || 
                              item.key.includes('map') || 
                              item.key.includes('bg') || 
                              item.key.includes('qr') || 
                              item.key.includes('logo');
                const isVideo = item.value.match(/\.(mp4|webm|mov|avi)$/i) || item.key.includes('video');

                return (
                    <div key={item.key} className="bg-slate-800/40 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-white">{item.description || item.key}</h3>
                                <p className="text-xs text-slate-500 font-mono mt-1">{item.key}</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            {(isImage || isVideo) && (
                                <CloudinaryUploadWidget
                                    onUpload={(url) => handleChange(item.key, url)}
                                    currentImage={localItems.find(i => i.key === item.key)?.value}
                                    folder={isVideo ? "tincadia/landing/videos" : "tincadia/landing/config"}
                                    buttonText={isVideo ? "Subir Video" : "Cambiar Imagen"}
                                    resourceType={isVideo ? 'video' : 'image'}
                                />
                            )}

                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 font-medium ml-1">Valor / URL</label>
                                <input
                                    type="text"
                                    value={localItems.find(i => i.key === item.key)?.value || ''}
                                    onChange={(e) => handleChange(item.key, e.target.value)}
                                    className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => onSave({ ...item, value: localItems.find(i => i.key === item.key)?.value || item.value })}
                                disabled={saving === item.key}
                                className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2
                                    ${saving === item.key ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600/80 hover:bg-blue-600 shadow-lg shadow-blue-900/20'}`}
                            >
                                {saving === item.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                {saving === item.key ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
