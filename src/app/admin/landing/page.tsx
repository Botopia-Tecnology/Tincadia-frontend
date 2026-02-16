'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { LandingConfigItem, Testimonial, FAQ } from './types';
import { Plus, Trash2, Star, Save, Handshake, QrCode, Wrench, Map, MessageSquareQuote, HelpCircle, MoreHorizontal, Loader2, Mail, Link as LinkIcon, Facebook, Instagram, Linkedin, Twitter, Youtube, PlayCircle } from 'lucide-react';
import { CloudinaryUploadWidget } from '@/components/common/CloudinaryUploadWidget';

// Define which keys belong to which section
const EXCLUDED_KEYS = ['appstore_icon', 'playstore_icon', 'download_image_1', 'download_image_2'];
const ALLIANCE_KEYS = ['logo_almia', 'logo_daste', 'logo_educatics', 'logo_parquete'];
const QR_KEYS = ['qr_code_appstore', 'qr_code_generic'];
const SERVICE_KEYS = ['service_1_bg', 'service_2_bg', 'service_3_bg'];
const MAP_KEYS = ['world_map_dark', 'world_map_light'];
const HOW_TO_START_KEYS = ['how_to_start_step_1', 'how_to_start_step_2', 'how_to_start_step_3', 'how_to_start_step_4'];

// Tab definitions
const TABS = [
    { id: 'alianzas', label: 'Alianzas', icon: Handshake },
    { id: 'how_to_start', label: 'Cómo Empezar', icon: PlayCircle },
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
        how_to_start: filtered.filter(c => HOW_TO_START_KEYS.includes(c.key)),
        qrs: filtered.filter(c => QR_KEYS.includes(c.key)),
        servicios: filtered.filter(c => SERVICE_KEYS.includes(c.key)),
        mapas: filtered.filter(c => MAP_KEYS.includes(c.key)),
        inclusive: filtered.filter(c => c.key === 'inclusive_companies_list'),
        contact_social: filtered.filter(c => c.key === 'contact_email' || c.key === 'contact_phone' || c.key === 'social_links'),
        otros: filtered.filter(c =>
            !c.key.startsWith('logo_') &&
            !c.key.startsWith('alliance_') &&
            !HOW_TO_START_KEYS.includes(c.key) &&
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

// How To Start Section
function HowToStartSection({ items, onSave, saving }: {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    saving: string | null;
}) {
    // Ensure we have all 4 steps, if not create placeholders
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
        // Only update from props if we have new data matching our keys
        // or if we need to reset. This logic merges props into our ensured list.
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
                                {/* Preview Area */}
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
                            {editingId ? 'Actualizar' : 'Guardar Empresa'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {companies.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-white/5 border-dashed">
                        No hay empresas inclusivas añadidas.
                    </div>
                ) : companies.map((company) => (
                    <div key={company.id} className="bg-slate-800/40 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group hover:bg-slate-800/60">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-lg bg-white/10 flex-shrink-0 overflow-hidden">
                                {company.imageUrl ? (
                                    <img src={company.imageUrl} alt={company.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <Handshake className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white text-lg">{company.name}</h4>
                                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{company.description}</p>
                            </div>
                        </div>

                        {company.industry && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {company.industry}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2 border-t border-white/5 mt-auto">
                            <button
                                onClick={() => handleEdit(company)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(company.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Main Page Component
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
            setLoading(true);
            const [configsData, testimonialsData, faqsData] = await Promise.all([
                api.get('/content/landing-config') as Promise<LandingConfigItem[]>,
                api.get('/content/testimonials') as Promise<Testimonial[]>,
                api.get('/content/faqs') as Promise<FAQ[]>,
            ]);
            setConfigs(configsData);
            setTestimonials(testimonialsData);
            setFaqs(faqsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveConfig = async (item: LandingConfigItem) => {
        setSaving(item.key);
        try {
            await api.put('/content/landing-config', {
                key: item.key,
                value: item.value,
                description: item.description
            });
            await fetchData(); // Refresh to ensure sync
        } catch (error) {
            console.error('Error saving config:', error);
        } finally {
            setSaving(null);
        }
    };

    const handleCreateConfig = async (key: string, value: string, description: string) => {
        // We reuse the update endpoint since our backend logic creates if not exists for config keys
        // or we might need a create endpoint. Let's assume update works as upsert or we call update.
        try {
            await api.put('/content/landing-config', { key, value, description });
            await fetchData();
        } catch (error) {
            console.error('Error creating config:', error);
        }
    };

    const handleDeleteConfig = async (key: string) => {
        try {
            await api.delete(`/content/landing-config/${key}`);
            await fetchData();
        } catch (error) {
            console.error('Error deleting config:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const categorized = categorizeConfigs(configs);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Configuración de Landing Page
                </h1>
                <p className="text-slate-400 mt-2">
                    Gestiona el contenido visible en la página principal.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white'}
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-6 md:p-8 min-h-[500px]">
                {activeTab === 'alianzas' && (
                    <AllianceSection
                        items={categorized.alianzas}
                        onSave={handleSaveConfig}
                        onDelete={handleDeleteConfig}
                        onCreate={handleCreateConfig}
                        saving={saving}
                    />
                )}
                {activeTab === 'how_to_start' && (
                    <HowToStartSection
                        items={categorized.how_to_start}
                        onSave={handleSaveConfig}
                        saving={saving}
                    />
                )}
                {activeTab === 'qrs' && (
                    <ConfigSection items={categorized.qrs} onSave={handleSaveConfig} saving={saving} />
                )}
                {activeTab === 'servicios' && (
                    <ConfigSection items={categorized.servicios} onSave={handleSaveConfig} saving={saving} />
                )}
                {activeTab === 'mapas' && (
                    <ConfigSection items={categorized.mapas} onSave={handleSaveConfig} saving={saving} />
                )}
                {activeTab === 'testimonios' && (
                    <TestimonialsSection testimonials={testimonials} onUpdate={fetchData} />
                )}
                {activeTab === 'faqs' && (
                    <FAQSection faqs={faqs} onUpdate={fetchData} />
                )}
                {activeTab === 'inclusive_companies' && (
                    <CompanyListSection items={[...categorized.inclusive, ...categorized.otros].filter(i => i.key === 'inclusive_companies_list')} onSave={handleSaveConfig} saving={saving} />
                )}
                {activeTab === 'contact_social' && (
                    <ConfigSection items={categorized.contact_social} onSave={handleSaveConfig} saving={saving} />
                )}
                {activeTab === 'otros' && (
                    <ConfigSection items={categorized.otros} onSave={handleSaveConfig} saving={saving} />
                )}
            </div>
        </div>
    );
}

