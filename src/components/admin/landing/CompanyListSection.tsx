'use client';

import { useState, useEffect } from 'react';
import { Plus, Handshake, Loader2, Save } from 'lucide-react';
import { LandingConfigItem, CompanyInfo } from '@/app/admin/landing/types';
import { CloudinaryUploadWidget } from '@/components/common/CloudinaryUploadWidget';

export function CompanyListSection({ items, onSave, saving }: {
    items: LandingConfigItem[];
    onSave: (item: LandingConfigItem) => void;
    saving: string | null;
}) {
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
            updated = companies.map(c =>
                c.id === editingId ? { ...newItem, id: editingId } : c
            );
        } else {
            const company: CompanyInfo = {
                ...newItem,
                id: crypto.randomUUID()
            };
            updated = [...companies, company];
        }

        setCompanies(updated);
        handleSaveList(updated);

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
