'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
import { LandingConfigItem } from '@/app/admin/landing/types';
import { CloudinaryUploadWidget } from '@/components/common/CloudinaryUploadWidget';

interface AllianceSectionProps {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    onDelete: (key: string) => void;
    onCreate: (key: string, value: string, description: string) => void;
    saving: string | null;
}

export function AllianceSection({ items, onSave, onDelete, onCreate, saving }: AllianceSectionProps) {
    const [localItems, setLocalItems] = useState(items);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', url: '' });

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleChange = (key: string, newValue: string) => {
        setLocalItems(prev => prev.map(item =>
            item.key === key ? { ...item, value: newValue } : item
        ));
    };

    const handleCreate = () => {
        if (!newItem.name || !newItem.url) return;
        const key = `alliance_${newItem.name.toLowerCase().replace(/\s+/g, '_')}`;
        onCreate(key, newItem.url, `Logo ${newItem.name}`);
        setNewItem({ name: '', url: '' });
        setShowForm(false);
    };

    const handleDelete = async (key: string) => {
        if (!confirm('¿Estás seguro de eliminar esta alianza?')) return;
        onDelete(key);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" /> Nueva Alianza
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4 text-white text-lg">Nueva Alianza</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nombre de la alianza"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="URL del logo"
                                    value={newItem.url}
                                    onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                                    className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                                <CloudinaryUploadWidget
                                    onUpload={(url) => setNewItem(prev => ({ ...prev, url }))}
                                    folder="tincadia/landing/alliances"
                                    currentImage={newItem.url}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleCreate}
                                className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                            >
                                Crear Alianza
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {localItems.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-white/5 border-dashed">
                        No hay alianzas configuradas.
                    </div>
                ) : localItems.map((item) => (
                    <div key={item.key} className="bg-slate-800/40 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group hover:bg-slate-800/60">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-white">{item.description || item.key}</h3>
                                <p className="text-xs text-slate-500 font-mono mt-1">{item.key}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(item.key)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 flex-1 flex flex-col">
                            <CloudinaryUploadWidget
                                onUpload={(url) => handleChange(item.key, url)}
                                currentImage={localItems.find(i => i.key === item.key)?.value}
                                folder="tincadia/landing/alliances"
                                buttonText="Cambiar Logo"
                            />

                            <input
                                type="text"
                                value={localItems.find(i => i.key === item.key)?.value || ''}
                                onChange={(e) => handleChange(item.key, e.target.value)}
                                className="mt-auto w-full text-xs rounded-lg bg-slate-900/50 border border-white/10 p-2 text-slate-400 font-mono focus:text-white focus:border-blue-500/50 outline-none transition-colors"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => onSave({ ...item, value: localItems.find(i => i.key === item.key)?.value || item.value })}
                                disabled={saving === item.key}
                                className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2
                                    ${saving === item.key ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600/80 hover:bg-blue-600'}`}
                            >
                                {saving === item.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                {saving === item.key ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
