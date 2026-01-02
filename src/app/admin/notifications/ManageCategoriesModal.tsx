'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Tag } from 'lucide-react';
import { notificationsService, NotificationCategory } from '@/services/notifications.service';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void; // Trigger refresh in parent
}

export default function ManageCategoriesModal({ isOpen, onClose, onUpdate }: Props) {
    const [categories, setCategories] = useState<NotificationCategory[]>([]);
    const [loading, setLoading] = useState(false);

    // New Category Form
    const [label, setLabel] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await notificationsService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories', error);
        } finally {
            setLoading(false);
        }
    };

    const generateRandomColor = () => {
        const colors = [
            '#3b82f6', // blue
            '#ef4444', // red
            '#10b981', // green
            '#f59e0b', // yellow
            '#8b5cf6', // purple
            '#ec4899', // pink
            '#06b6d4', // cyan
            '#f97316'  // orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleCreate = async () => {
        if (!label) return;
        try {
            setCreating(true);

            // Auto-generate ID from label
            // "Nueva Oferta" -> "nueva_oferta_" + random suffix to prevent collisions
            const generatedName = label.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.random().toString(36).substr(2, 4);
            const generatedColor = generateRandomColor();

            await notificationsService.createCategory({
                name: generatedName,
                label,
                color: generatedColor,
                icon: 'Tag'
            });
            setLabel('');
            fetchCategories();
            onUpdate();
        } catch (error) {
            alert('Error al crear categoría');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este tipo de comunicación?')) return;
        try {
            await notificationsService.deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            onUpdate();
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Tag size={18} className="text-blue-400" />
                        Gestionar Tipos
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Add Form */}
                    <div className="space-y-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crear Nuevo Tipo</h4>
                        <div className="flex gap-2">
                            <input
                                placeholder="Nombre de la categoría (ej: Urgente)"
                                value={label}
                                onChange={e => setLabel(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <button
                                onClick={handleCreate}
                                disabled={creating || !label}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                                <span className="hidden sm:inline">Agregar</span>
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {loading && <div className="text-center p-4"><Loader2 className="animate-spin text-blue-500 mx-auto" /></div>}

                        {!loading && categories.length === 0 && (
                            <p className="text-center text-slate-500 text-sm py-4">No hay tipos personalizados.</p>
                        )}

                        {!loading && categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                                    <div>
                                        <p className="text-sm font-medium text-white">{cat.label}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Could add valid color picker later if needed */}
                                    <button onClick={() => handleDelete(cat.id)} className="text-slate-500 hover:text-red-400 p-1">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
