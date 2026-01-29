'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { LandingConfigItem, Testimonial, FAQ } from './types';
import { Plus, Trash2, Star, Save, Handshake, QrCode, Wrench, Map, MessageSquareQuote, HelpCircle, MoreHorizontal, Loader2, Mail, Link as LinkIcon, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { CloudinaryUploadWidget } from '@/components/common/CloudinaryUploadWidget';

// Define which keys belong to which section
const EXCLUDED_KEYS = ['appstore_icon', 'playstore_icon', 'download_image_1', 'download_image_2'];
const ALLIANCE_KEYS = ['logo_almia', 'logo_daste', 'logo_educatics', 'logo_parquete'];
const QR_KEYS = ['qr_code_appstore', 'qr_code_generic'];
const SERVICE_KEYS = ['service_1_bg', 'service_2_bg', 'service_3_bg'];
const MAP_KEYS = ['world_map_dark', 'world_map_light'];

// Tab definitions
const TABS = [
    { id: 'alianzas', label: 'Alianzas', icon: Handshake },
    { id: 'qrs', label: "QR's", icon: QrCode },
    { id: 'servicios', label: 'Servicios', icon: Wrench },
    { id: 'mapas', label: 'Mapas', icon: Map },
    { id: 'testimonios', label: 'Casos de Éxito', icon: MessageSquareQuote },
    { id: 'inclusive_companies', label: 'Empresas Inclusivas', icon: Handshake },
    { id: 'contact_social', label: 'Contacto y Redes', icon: Mail },
    { id: 'faqs', label: 'FAQ', icon: HelpCircle },
    { id: 'otros', label: 'Otros', icon: MoreHorizontal },
];

function categorizeConfigs(configs: LandingConfigItem[]) {
    const filtered = configs.filter(c => !EXCLUDED_KEYS.includes(c.key) && !c.key.includes('_hover'));
    return {
        alianzas: filtered.filter(c => c.key.startsWith('logo_') || c.key.startsWith('alliance_')),
        qrs: filtered.filter(c => QR_KEYS.includes(c.key)),
        servicios: filtered.filter(c => SERVICE_KEYS.includes(c.key)),
        mapas: filtered.filter(c => MAP_KEYS.includes(c.key)),
        inclusive: filtered.filter(c => c.key === 'inclusive_companies_list'),
        contact_social: filtered.filter(c => c.key === 'contact_email' || c.key === 'contact_phone' || c.key === 'social_links'),
        otros: filtered.filter(c =>
            !c.key.startsWith('logo_') &&
            !c.key.startsWith('alliance_') &&
            !QR_KEYS.includes(c.key) &&
            !SERVICE_KEYS.includes(c.key) &&
            !MAP_KEYS.includes(c.key) &&
            c.key !== 'inclusive_companies_list' &&
            c.key !== 'contact_email' &&
            c.key !== 'contact_phone' &&
            c.key !== 'social_links'
        ),
    };
}

// Config Section Component
function ConfigSection({ items, onSave, saving }: {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    saving: string | null;
}) {
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
                const isImage = item.value.match(/\.(jpeg|jpg|gif|png|webp)$/i) || item.key.includes('map') || item.key.includes('bg') || item.key.includes('qr') || item.key.includes('logo');
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
                )
            })}
        </div>
    );
}

// Alliance Section with Add/Delete functionality
function AllianceSection({ items, onSave, onDelete, onCreate, saving }: {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    onDelete: (key: string) => void;
    onCreate: (key: string, value: string, description: string) => void;
    saving: string | null;
}) {
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

// Testimonials Section
function TestimonialsSection({ testimonials, onUpdate }: {
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

// FAQ Section
function FAQSection({ faqs, onUpdate }: {
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


// Inclusive Companies Section
interface CompanyInfo {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    link?: string;
    industry?: string;
    tags?: string[];
}

function CompanyListSection({ items, onSave, saving }: {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    saving: string | null;
}) {
    // We expect a SINGLE config item with key 'inclusive_companies_list'
    // containing the JSON array of companies.
    const configItem = items.find(i => i.key === 'inclusive_companies_list') || {
        key: 'inclusive_companies_list',
        value: '[]',
        description: 'Lista de Empresas Inclusivas',
        updatedAt: new Date().toISOString()
    };

    const [companies, setCompanies] = useState<CompanyInfo[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<CompanyInfo>({
        id: '',
        name: '',
        description: '',
        imageUrl: '',
        link: '',
        industry: '',
        tags: []
    });

    useEffect(() => {
        try {
            const parsed = JSON.parse(configItem.value || '[]');
            setCompanies(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
            setCompanies([]);
        }
    }, [configItem.value]);

    const handleSaveList = (updatedList: CompanyInfo[]) => {
        onSave({
            ...configItem,
            value: JSON.stringify(updatedList)
        });
    };

    const handleSaveCompany = () => {
        if (!newItem.name || !newItem.description) return;

        let updated: CompanyInfo[];

        if (editingId) {
            // Update existing
            updated = companies.map(c =>
                c.id === editingId ? { ...newItem, id: editingId } : c
            );
        } else {
            // Create new
            const company: CompanyInfo = {
                ...newItem,
                id: crypto.randomUUID()
            };
            updated = [...companies, company];
        }

        setCompanies(updated);
        handleSaveList(updated);

        // Reset
        setNewItem({ id: '', name: '', description: '', imageUrl: '', link: '', industry: '', tags: [] });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (company: CompanyInfo) => {
        setNewItem({
            ...company,
            id: company.id,
            industry: company.industry || '',
            tags: company.tags || []
        });
        setEditingId(company.id);
        setShowForm(true);
    };

    const handleCancel = () => {
        setNewItem({ id: '', name: '', description: '', imageUrl: '', link: '', industry: '', tags: [] });
        setEditingId(null);
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        if (!confirm('¿Eliminar empresa?')) return;
        const updated = companies.filter(c => c.id !== id);
        setCompanies(updated);
        handleSaveList(updated);
    };

    const handleImageUpload = (url: string) => {
        setNewItem(prev => ({ ...prev, imageUrl: url }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                <div>
                    <h3 className="text-blue-200 font-semibold flex items-center gap-2">
                        <Handshake className="w-5 h-5" /> Empresas Aliadas
                    </h3>
                    <p className="text-sm text-blue-300/60 mt-1">Gestiona las empresas que aparecen en "Conoce tus posibilidades"</p>
                </div>
                <button
                    onClick={() => {
                        handleCancel();
                        setShowForm(!showForm);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" /> Agregar Empresa
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4 text-white text-lg">
                        {editingId ? 'Editar Empresa' : 'Nueva Empresa'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nombre de la Empresa"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Enlace (opcional)"
                                value={newItem.link}
                                onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Industria (ej. Tecnología & Servicios)"
                                value={newItem.industry || ''}
                                onChange={(e) => setNewItem({ ...newItem, industry: e.target.value })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Etiquetas (separadas por coma)"
                                value={newItem.tags?.join(', ') || ''}
                                onChange={(e) => setNewItem({ ...newItem, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <textarea
                                placeholder="Descripción corta"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm text-slate-400 block mb-2">Logo / Imagen</label>
                            <CloudinaryUploadWidget
                                onUpload={handleImageUpload}
                                currentImage={newItem.imageUrl}
                                folder="tincadia/companies"
                                buttonText="Subir Logo"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5 mt-4 gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveCompany}
                            className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                        >
                            {editingId ? 'Guardar Cambios' : 'Crear Empresa'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {companies.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-white/5 border-dashed">
                        No hay empresas registradas.
                    </div>
                ) : companies.map((company) => (
                    <div key={company.id} className="bg-slate-800/40 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group hover:bg-slate-800/60 relative overflow-hidden">

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                            <button
                                onClick={() => handleEdit(company)}
                                className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                            >
                                <Wrench className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(company.id)}
                                className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-32 w-full bg-slate-900/50 rounded-lg relative overflow-hidden flex items-center justify-center p-4">
                            {company.imageUrl ? (
                                <img src={company.imageUrl} alt={company.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                                <Handshake className="w-12 h-12 text-slate-700" />
                            )}
                        </div>

                        <div>
                            <h4 className="font-bold text-white text-lg">{company.name}</h4>
                            <p className="text-sm text-slate-400 line-clamp-2 mt-1">{company.description}</p>
                            {company.link && (
                                <a href={company.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
                                    Visitar sitio web &rarr;
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Indicator */}
            <div className="flex justify-end">
                {saving === 'inclusive_companies_list' && (
                    <span className="text-blue-400 text-sm flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" /> Guardando cambios...
                    </span>
                )}
            </div>
        </div>
    );
}

// Contact & Social Section
interface SocialLink {
    id: string;
    network: string;
    url: string;
}

function ContactSocialSection({ items, onSave, saving }: {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    saving: string | null;
}) {
    // Separate config items
    // Separate config items
    const emailConfig = items.find(i => i.key === 'contact_email') || { key: 'contact_email', value: 'Contacto@tincadia.com', description: 'Correo de Contacto', updatedAt: new Date().toISOString() };
    const phoneConfig = items.find(i => i.key === 'contact_phone') || { key: 'contact_phone', value: '123456789', description: 'Teléfono de Contacto', updatedAt: new Date().toISOString() };
    const socialConfig = items.find(i => i.key === 'social_links') || { key: 'social_links', value: '[]', description: 'Redes Sociales', updatedAt: new Date().toISOString() };

    // State for simple inputs
    const [email, setEmail] = useState(emailConfig.value);
    const [phone, setPhone] = useState(phoneConfig.value);

    // State for social links
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [newLink, setNewLink] = useState<SocialLink>({ id: '', network: 'Facebook', url: '' });

    useEffect(() => {
        try {
            const parsed = JSON.parse(socialConfig.value || '[]');
            if (Array.isArray(parsed) && parsed.length > 0) {
                setSocialLinks(parsed);
            } else {
                // Fallback defaults if empty
                setSocialLinks([
                    { id: crypto.randomUUID(), network: 'LinkedIn', url: 'https://www.linkedin.com/company/tincadia/' },
                    { id: crypto.randomUUID(), network: 'Instagram', url: 'https://www.instagram.com/tincadia?igsh=cnM1Y3hjYnZjbzZj' },
                    { id: crypto.randomUUID(), network: 'Facebook', url: 'https://www.facebook.com/isramirez10?mibextid=ZbWKwL' },
                    { id: crypto.randomUUID(), network: 'Twitter', url: 'https://x.com/tincadiaapp' },
                    { id: crypto.randomUUID(), network: 'WhatsApp', url: 'https://www.whatsapp.com/channel/0029VbAmXrWHVvTVFnnCh82Q' },
                    { id: crypto.randomUUID(), network: 'Youtube', url: 'https://www.youtube.com/@tincadiaapp' },
                    { id: crypto.randomUUID(), network: 'TikTok', url: 'https://www.tiktok.com/@tincadiaapp' }
                ]);
            }
        } catch (e) {
            setSocialLinks([]);
        }
    }, [socialConfig.value]);

    useEffect(() => {
        setEmail(emailConfig.value || 'Contacto@tincadia.com');
    }, [emailConfig.value]);

    useEffect(() => {
        setPhone(phoneConfig.value || '123456789');
    }, [phoneConfig.value]);

    const handleSaveContact = (key: string, value: string, config: any) => {
        onSave({ ...config, value });
    };

    const handleSaveSocial = (updatedList: SocialLink[]) => {
        onSave({
            ...socialConfig,
            value: JSON.stringify(updatedList)
        });
    };

    const addSocialLink = () => {
        if (!newLink.url) return;
        const linkWithId = { ...newLink, id: crypto.randomUUID() };
        const updated = [...socialLinks, linkWithId];
        setSocialLinks(updated);
        handleSaveSocial(updated);
        setNewLink({ id: '', network: 'Facebook', url: '' });
    };

    const removeSocialLink = (id: string) => {
        const updated = socialLinks.filter(l => l.id !== id);
        setSocialLinks(updated);
        handleSaveSocial(updated);
    };

    const networks = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Youtube', 'TikTok', 'WhatsApp', 'Discord', 'Telegram', 'Twitch', 'Pinterest', 'Github'];

    const handleUpdateLink = (id: string, newUrl: string) => {
        setSocialLinks(prev => prev.map(link => link.id === id ? { ...link, url: newUrl } : link));
    };

    const getIcon = (network: string) => {
        switch (network) {
            case 'Facebook': return <Facebook className="w-4 h-4" />;
            case 'Instagram': return <Instagram className="w-4 h-4" />;
            case 'LinkedIn': return <Linkedin className="w-4 h-4" />;
            case 'Twitter': return <Twitter className="w-4 h-4" />;
            case 'Youtube': return <Youtube className="w-4 h-4" />;
            case 'TikTok': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
            );
            case 'WhatsApp': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
            );
            case 'Discord': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.209.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.029c.243.466.518.909.818 1.329a.05.05 0 0 0 .056.019 13.263 13.263 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                </svg>
            );
            case 'Telegram': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.537.298-.51.528.024.195.297.291.606.376.136.037.29.074.453.111.97.221 1.334.256 1.602.13.093-.044.47-.593.899-1.303.461-.758.913-1.464.93-1.452.016.012-.007.037-.024.062-.239.356-1.107 1.636-1.127 1.666-.024.035-.11.23.116.425.263.228 1.154.91 1.633 1.25.39.278.673.472.936.428.163-.028.325-.262.518-1.353.14-1.109.288-2.316.357-2.914.072-.622.062-.835-.152-.942-.235-.117-.676-.037-1.63.364Z" />
                </svg>
            );
            case 'Twitch': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
                    <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0H3.857zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142v6.286z" />
                    <path d="M11.857 3.143h-1.143V6.57h1.143V3.143zm-3.143 0H7.571V6.57h1.143V3.143z" />
                </svg>
            );
            case 'Pinterest': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.436 0-3.868 1.824-3.868 3.714 0 .733.282 1.517.632 1.943.072.087.082.164.06.297-.06.257-.194.79-.22.9-.034.145-.115.176-.265.106-1.97-.919-2.189-3.39-2.189-5.118 0-4.167 3.033-8 8.766-8 4.604 0 8.182 3.282 8.182 7.669 0 4.542-2.864 8.026-6.84 8.026-1.336 0-2.592-.693-3.024-1.51l-.824 3.136c-.296 1.137-.872 2.56-1.296 3.411A8.004 8.004 0 0 0 8 16a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                </svg>
            );
            case 'Github': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
            );
            default: return <LinkIcon className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-slate-800/40 p-6 rounded-xl border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" /> Información de Contacto
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Correo Electrónico</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <button
                                onClick={() => handleSaveContact('contact_email', email, emailConfig)}
                                disabled={saving === 'contact_email'}
                                className="px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Teléfono</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <button
                                onClick={() => handleSaveContact('contact_phone', phone, phoneConfig)}
                                disabled={saving === 'contact_phone'}
                                className="px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-800/40 p-6 rounded-xl border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-blue-400" /> Redes Sociales
                </h3>

                {/* Add New */}
                <div className="bg-slate-900/40 p-4 rounded-lg border border-white/5 mb-6">
                    <div className="grid md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-xs text-slate-500 block">Red Social</label>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-slate-800 rounded-lg border border-white/10 text-slate-400">
                                    {getIcon(newLink.network)}
                                </div>
                                <select
                                    value={newLink.network}
                                    onChange={(e) => setNewLink({ ...newLink, network: e.target.value })}
                                    className="w-full rounded-lg bg-slate-800 border border-white/10 p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {networks.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-7 space-y-2">
                            <label className="text-xs text-slate-500 block">URL Perfil</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                className="w-full rounded-lg bg-slate-800 border border-white/10 p-2.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={addSocialLink}
                                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors flex justify-center items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Agregar
                            </button>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {socialLinks.length === 0 ? (
                        <p className="text-center text-slate-500 py-4">No hay redes sociales configuradas.</p>
                    ) : (
                        socialLinks.map((link) => (
                            <div key={link.id} className="flex items-center gap-4 bg-slate-900/30 p-3 rounded-lg border border-white/5 group">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                    {getIcon(link.network)}
                                </div>
                                <div className="flex-1 min-w-0 grid md:grid-cols-12 gap-4 items-center">
                                    <p className="md:col-span-3 text-sm font-medium text-white">{link.network}</p>
                                    <div className="md:col-span-9 flex gap-2">
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => handleUpdateLink(link.id, e.target.value)}
                                            className="flex-1 rounded-lg bg-slate-900/50 border border-white/10 p-2 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <button
                                            onClick={() => handleSaveSocial(socialLinks)}
                                            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                                            title="Guardar cambios"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-blue-400 transition-colors bg-slate-800/50 rounded-lg">
                                            <LinkIcon className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => removeSocialLink(link.id)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {saving === 'social_links' && (
                    <div className="flex justify-end mt-2">
                        <span className="text-xs text-blue-400 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Guardando...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function LandingConfigPage() {
    const { user } = useAuth();
    const [configs, setConfigs] = useState<LandingConfigItem[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('alianzas');

    const fetchData = async () => {
        try {
            const [configData, testimonialData, faqData] = await Promise.all([
                api.get<LandingConfigItem[]>('/content/landing-config'),
                api.get<Testimonial[]>('/content/testimonials'),
                api.get<FAQ[]>('/content/faqs'),
            ]);
            setConfigs(configData);
            setTestimonials(testimonialData);
            setFaqs(faqData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
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
            await fetchData();
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSaving(null);
        }
    };

    const handleCreateConfig = async (key: string, value: string, description: string) => {
        try {
            await api.put('/content/landing-config', {
                key,
                value,
                description
            });
            await fetchData();
        } catch (error) {
            console.error('Error creating:', error);
        }
    };

    const handleDeleteConfig = async (key: string) => {
        try {
            await api.delete(`/content/landing-config/${key}`);
            await fetchData();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-blue-500">
            <Loader2 size={40} className="animate-spin" />
        </div>
    );

    const categorized = categorizeConfigs(configs);

    const visibleTabs = TABS.filter(tab => {
        if (tab.id === 'alianzas') return true;
        if (tab.id === 'testimonios') return true;
        if (tab.id === 'inclusive_companies') return true;
        if (tab.id === 'contact_social') return true;
        if (tab.id === 'faqs') return true;
        if (tab.id === 'otros') return categorized.otros.length > 0;
        return categorized[tab.id as keyof typeof categorized]?.length > 0;
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'alianzas':
                return <AllianceSection items={categorized.alianzas} onSave={handleSave} onDelete={handleDeleteConfig} onCreate={handleCreateConfig} saving={saving} />;
            case 'qrs':
                return <ConfigSection items={categorized.qrs} onSave={handleSave} saving={saving} />;
            case 'servicios':
                return <ConfigSection items={categorized.servicios} onSave={handleSave} saving={saving} />;
            case 'mapas':
                return <ConfigSection items={categorized.mapas} onSave={handleSave} saving={saving} />;
            case 'testimonios':
                return <TestimonialsSection testimonials={testimonials} onUpdate={fetchData} />;
            case 'inclusive_companies':
                return <CompanyListSection items={categorized.inclusive} onSave={handleSave} saving={saving} />;
            case 'contact_social':
                return <ContactSocialSection items={categorized.contact_social} onSave={handleSave} saving={saving} />;
            case 'faqs':
                return <FAQSection faqs={faqs} onUpdate={fetchData} />;
            case 'otros':
                return <ConfigSection items={categorized.otros} onSave={handleSave} saving={saving} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
                    Configuración Landing Page
                </h1>
                <p className="text-slate-400 text-lg">
                    Personaliza el contenido visible en la página de inicio
                </p>
            </header>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                {/* Tabs */}
                <div className="border-b border-white/10">
                    <nav className="flex flex-wrap p-2">
                        {visibleTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative
                                        ${isActive
                                            ? 'text-white'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 min-h-[400px]">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
