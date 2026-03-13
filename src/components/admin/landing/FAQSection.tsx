'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
import { FAQ } from '@/app/admin/landing/types';
import { api } from '@/lib/api-client';

export function FAQSection({ faqs, onUpdate }: {
    faqs: FAQ[];
    onUpdate: () => void;
}) {
    const [items, setItems] = useState<FAQ[]>(faqs);
    const [saving, setSaving] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ question: '', answer: '' });

    useEffect(() => {
        setItems(faqs);
    }, [faqs]);

    const handleSave = async (item: FAQ) => {
        setSaving(item.id);
        try {
            await api.put(`/content/faqs/${item.id}`, {
                question: item.question,
                answer: item.answer,
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
            await api.post('/content/faqs', newItem);
            setNewItem({ question: '', answer: '' });
            setShowForm(false);
            onUpdate();
        } catch (error) {
            console.error('Error creating:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;
        try {
            await api.delete(`/content/faqs/${id}`);
            onUpdate();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleChange = (id: string, field: keyof FAQ, value: string) => {
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
                    <Plus className="w-4 h-4" /> Nueva Pregunta
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4 text-white text-lg">Nueva Pregunta Frecuente</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Pregunta"
                            value={newItem.question}
                            onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
                            className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                        <textarea
                            placeholder="Respuesta"
                            value={newItem.answer}
                            onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
                            className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            rows={3}
                        />
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleCreate}
                                className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                            >
                                Crear Pregunta
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {items.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-white/5 border-dashed">
                        No hay preguntas frecuentes. Crea la primera.
                    </div>
                ) : items.map((item) => (
                    <div key={item.id} className="bg-slate-800/40 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group hover:bg-slate-800/60">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 mr-4">
                                <input
                                    type="text"
                                    value={item.question}
                                    onChange={(e) => handleChange(item.id, 'question', e.target.value)}
                                    placeholder="Pregunta"
                                    className="w-full bg-transparent text-white font-medium border-none focus:ring-0 p-0 text-lg placeholder:text-slate-600 mb-2"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(item)}
                                    disabled={saving === item.id}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2
                                        ${saving === item.id ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600/80 hover:bg-blue-600 shadow-lg shadow-blue-900/20'}`}
                                >
                                    {saving === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    {saving === item.id ? '...' : 'Guardar'}
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={item.answer}
                            onChange={(e) => handleChange(item.id, 'answer', e.target.value)}
                            placeholder="Respuesta"
                            className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-slate-300 text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            rows={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
