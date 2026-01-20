'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { LandingConfigItem, Testimonial, FAQ } from './types';
import { Plus, Trash2, Star, Save, Handshake, QrCode, Wrench, Map, MessageSquareQuote, HelpCircle, MoreHorizontal } from 'lucide-react';

// Define which keys belong to which section
const EXCLUDED_KEYS = ['appstore_icon', 'playstore_icon', 'download_image_1', 'download_image_2'];
const ALLIANCE_KEYS = ['logo_almia', 'logo_daste', 'logo_educatics', 'logo_parquete']; // Legacy, now alliances are dynamic
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
    { id: 'faqs', label: 'FAQ', icon: HelpCircle },
    { id: 'otros', label: 'Otros', icon: MoreHorizontal },
];

// Helper to categorize configs
function categorizeConfigs(configs: LandingConfigItem[]) {
    const filtered = configs.filter(c => !EXCLUDED_KEYS.includes(c.key) && !c.key.includes('_hover'));
    return {
        // Alliances: any key starting with 'logo_' or 'alliance_'
        alianzas: filtered.filter(c => c.key.startsWith('logo_') || c.key.startsWith('alliance_')),
        qrs: filtered.filter(c => QR_KEYS.includes(c.key)),
        servicios: filtered.filter(c => SERVICE_KEYS.includes(c.key)),
        mapas: filtered.filter(c => MAP_KEYS.includes(c.key)),
        otros: filtered.filter(c =>
            !c.key.startsWith('logo_') &&
            !c.key.startsWith('alliance_') &&
            !QR_KEYS.includes(c.key) &&
            !SERVICE_KEYS.includes(c.key) &&
            !MAP_KEYS.includes(c.key)
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
        return <p className="text-gray-500 text-center py-8">No hay elementos en esta sección.</p>;
    }

    return (
        <div className="grid gap-4">
            {localItems.map((item) => (
                <div key={item.key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-md font-semibold text-gray-900">{item.key}</h3>
                            <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <button
                            onClick={() => onSave({ ...item, value: localItems.find(i => i.key === item.key)?.value || item.value })}
                            disabled={saving === item.key}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors flex items-center gap-1
                                ${saving === item.key ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            <Save className="w-3 h-3" />
                            {saving === item.key ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                    <input
                        type="text"
                        value={localItems.find(i => i.key === item.key)?.value || ''}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border text-gray-900 bg-white"
                    />
                    {(localItems.find(i => i.key === item.key)?.value || '').match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                            <img src={localItems.find(i => i.key === item.key)?.value || ''} alt="Preview" className="h-20 object-contain" />
                        </div>
                    )}
                </div>
            ))}
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
        // Generate a unique key like alliance_nombre
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
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Nueva Alianza
                </button>
            </div>

            {showForm && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <h3 className="font-semibold mb-3 text-gray-900">Nueva Alianza</h3>
                    <div className="grid gap-3">
                        <input
                            type="text"
                            placeholder="Nombre de la alianza (ej: Microsoft)"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                        />
                        <input
                            type="text"
                            placeholder="URL del logo (ej: https://...)"
                            value={newItem.url}
                            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                        />
                        {newItem.url && newItem.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                            <div className="p-2 bg-white rounded border border-gray-200">
                                <img src={newItem.url} alt="Preview" className="h-16 object-contain" />
                            </div>
                        )}
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Crear Alianza
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {localItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay alianzas. Crea la primera.</p>
                ) : localItems.map((item) => (
                    <div key={item.key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-md font-semibold text-gray-900">{item.description || item.key}</h3>
                                <p className="text-xs text-gray-500">{item.key}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onSave({ ...item, value: localItems.find(i => i.key === item.key)?.value || item.value })}
                                    disabled={saving === item.key}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors flex items-center gap-1
                                        ${saving === item.key ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    <Save className="w-3 h-3" />
                                    {saving === item.key ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    onClick={() => handleDelete(item.key)}
                                    className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={localItems.find(i => i.key === item.key)?.value || ''}
                            onChange={(e) => handleChange(item.key, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border text-gray-900 bg-white"
                        />
                        {(localItems.find(i => i.key === item.key)?.value || '').match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                                <img src={localItems.find(i => i.key === item.key)?.value || ''} alt="Preview" className="h-20 object-contain" />
                            </div>
                        )}
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
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Nuevo Testimonio
                </button>
            </div>

            {showForm && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <h3 className="font-semibold mb-3">Nuevo Testimonio</h3>
                    <div className="grid gap-3">
                        <input
                            type="text"
                            placeholder="Nombre del autor"
                            value={newItem.authorName}
                            onChange={(e) => setNewItem({ ...newItem, authorName: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                        />
                        <input
                            type="text"
                            placeholder="Rol / Empresa"
                            value={newItem.authorRole}
                            onChange={(e) => setNewItem({ ...newItem, authorRole: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                        />
                        <textarea
                            placeholder="Testimonio"
                            value={newItem.quote}
                            onChange={(e) => setNewItem({ ...newItem, quote: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                            rows={3}
                        />
                        <div className="flex items-center gap-2">
                            <label className="text-sm">Rating:</label>
                            <select
                                value={newItem.rating}
                                onChange={(e) => setNewItem({ ...newItem, rating: Number(e.target.value) })}
                                className="rounded-md border-gray-300 shadow-sm text-sm p-1 border text-gray-900 bg-white"
                            >
                                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Crear Testimonio
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay testimonios. Crea el primero.</p>
                ) : items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-1">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(item)}
                                    disabled={saving === item.id}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors flex items-center gap-1
                                        ${saving === item.id ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    <Save className="w-3 h-3" /> Guardar
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <input
                                type="text"
                                value={item.authorName}
                                onChange={(e) => handleChange(item.id, 'authorName', e.target.value)}
                                placeholder="Nombre"
                                className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                            />
                            <input
                                type="text"
                                value={item.authorRole}
                                onChange={(e) => handleChange(item.id, 'authorRole', e.target.value)}
                                placeholder="Rol"
                                className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                            />
                            <textarea
                                value={item.quote}
                                onChange={(e) => handleChange(item.id, 'quote', e.target.value)}
                                placeholder="Testimonio"
                                className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                                rows={2}
                            />
                            <select
                                value={item.rating}
                                onChange={(e) => handleChange(item.id, 'rating', Number(e.target.value))}
                                className="w-32 rounded-md border-gray-300 shadow-sm text-sm p-1 border text-gray-900 bg-white"
                            >
                                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} estrellas</option>)}
                            </select>
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
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Nueva Pregunta
                </button>
            </div>

            {showForm && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <h3 className="font-semibold mb-3">Nueva Pregunta</h3>
                    <div className="grid gap-3">
                        <input
                            type="text"
                            placeholder="Pregunta"
                            value={newItem.question}
                            onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                        />
                        <textarea
                            placeholder="Respuesta"
                            value={newItem.answer}
                            onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                            rows={3}
                        />
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Crear Pregunta
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay preguntas frecuentes. Crea la primera.</p>
                ) : items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-end gap-2 mb-3">
                            <button
                                onClick={() => handleSave(item)}
                                disabled={saving === item.id}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors flex items-center gap-1
                                    ${saving === item.id ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                <Save className="w-3 h-3" /> Guardar
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="grid gap-2">
                            <input
                                type="text"
                                value={item.question}
                                onChange={(e) => handleChange(item.id, 'question', e.target.value)}
                                placeholder="Pregunta"
                                className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border font-medium text-gray-900 bg-white"
                            />
                            <textarea
                                value={item.answer}
                                onChange={(e) => handleChange(item.id, 'answer', e.target.value)}
                                placeholder="Respuesta"
                                className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border text-gray-900 bg-white"
                                rows={3}
                            />
                        </div>
                    </div>
                ))}
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
            await fetchData(); // Refresh data after save
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
            await fetchData(); // Refresh data after create
        } catch (error) {
            console.error('Error creating:', error);
        }
    };

    const handleDeleteConfig = async (key: string) => {
        try {
            await api.delete(`/content/landing-config/${key}`);
            await fetchData(); // Refresh data after delete
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (loading) return <div className="p-8">Cargando configuración...</div>;

    const categorized = categorizeConfigs(configs);

    // Filter tabs that have no items (always show alianzas, testimonios, faqs)
    const visibleTabs = TABS.filter(tab => {
        if (tab.id === 'alianzas') return true; // Always show
        if (tab.id === 'testimonios') return true;
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
            case 'faqs':
                return <FAQSection faqs={faqs} onUpdate={fetchData} />;
            case 'otros':
                return <ConfigSection items={categorized.otros} onSave={handleSave} saving={saving} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Configuración Landing Page</h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex flex-wrap gap-1 -mb-px">
                    {visibleTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                    ${isActive
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {renderTabContent()}
            </div>
        </div>
    );
}
