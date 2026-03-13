'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Loader2, Save } from 'lucide-react';
import { Testimonial } from '@/app/admin/landing/types';
import { api } from '@/lib/api-client';

export function TestimonialsSection({ testimonials, onUpdate }: {
    testimonials: Testimonial[];
    onUpdate: () => void;
}) {
    const [items, setItems] = useState<Testimonial[]>(testimonials);
    const [saving, setSaving] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ authorName: '', authorRole: '', quote: '', rating: 5 });

    useEffect(() => {
        setItems(testimonials);
    }, [testimonials]);

    const handleSave = async (item: Testimonial) => {
        setSaving(item.id);
        try {
            await api.put(`/content/testimonials/${item.id}`, {
                authorName: item.authorName,
                authorRole: item.authorRole,
                quote: item.quote,
                rating: item.rating,
            });
            onUpdate();
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSaving(null);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/content/testimonials', newItem);
            setNewItem({ authorName: '', authorRole: '', quote: '', rating: 5 });
            setShowForm(false);
            onUpdate();
        } catch (error) {
            console.error('Error creating:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este testimonio?')) return;
        try {
            await api.delete(`/content/testimonials/${id}`);
            onUpdate();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleChange = (id: string, field: keyof Testimonial, value: string | number) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" /> Nuevo Testimonio
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4 text-white text-lg">Nuevo Testimonio</h3>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nombre del autor"
                                value={newItem.authorName}
                                onChange={(e) => setNewItem({ ...newItem, authorName: e.target.value })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Rol / Empresa"
                                value={newItem.authorRole}
                                onChange={(e) => setNewItem({ ...newItem, authorRole: e.target.value })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <textarea
                            placeholder="Testimonio"
                            value={newItem.quote}
                            onChange={(e) => setNewItem({ ...newItem, quote: e.target.value })}
                            className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            rows={3}
                        />
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-slate-400">Rating:</label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setNewItem({ ...newItem, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star className={`w-6 h-6 ${star <= newItem.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleCreate}
                                className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                            >
                                Crear Testimonio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {items.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-white/5 border-dashed">
                        No hay testimonios. Crea el primero.
                    </div>
                ) : items.map((item) => (
                    <div key={item.id} className="bg-slate-800/40 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group hover:bg-slate-800/60">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
                                ))}
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 flex-1">
                            <textarea
                                value={item.quote}
                                onChange={(e) => handleChange(item.id, 'quote', e.target.value)}
                                placeholder="Testimonio"
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[100px]"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={item.authorName}
                                    onChange={(e) => handleChange(item.id, 'authorName', e.target.value)}
                                    placeholder="Nombre"
                                    className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-2 text-white text-xs font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                                <input
                                    type="text"
                                    value={item.authorRole}
                                    onChange={(e) => handleChange(item.id, 'authorRole', e.target.value)}
                                    placeholder="Rol"
                                    className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-2 text-slate-300 text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-slate-500">Rating:</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={item.rating}
                                    onChange={(e) => handleChange(item.id, 'rating', Number(e.target.value))}
                                    className="w-24 accent-yellow-400 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-xs text-yellow-400 font-bold">{item.rating}</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => handleSave(item)}
                                disabled={saving === item.id}
                                className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2
                                    ${saving === item.id ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600/80 hover:bg-blue-600 shadow-lg shadow-blue-900/20'}`}
                            >
                                {saving === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                {saving === item.id ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
