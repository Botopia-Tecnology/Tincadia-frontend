'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, X, Save, Users, Building2, Trash2, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { pricingService, PricingPlan } from '@/services/content.service';

const PLAN_TYPES = {
    personal: [
        { value: 'personal_free', label: 'Gratis / Básico' },
        { value: 'personal_premium', label: 'Premium Estándar' },
        { value: 'personal_corporate', label: 'Corporativo / Avanzado' },
    ],
    empresa: [
        { value: 'empresa_free', label: 'Gratis' },
        { value: 'empresa_business', label: 'Business' },
        { value: 'empresa_corporate', label: 'Enterprise' },
    ],
};

export default function PricingAdminPage() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'empresa'>('personal');

    // Create new empty plan
    const createNewPlan = (): PricingPlan => ({
        id: '',
        name: 'Nuevo Plan',
        type: activeTab,
        plan_type: '',
        price_monthly: '0',
        price_annual: '',
        price_monthly_cents: 0,
        price_annual_cents: 0,
        description: '',
        button_text: 'Suscribirme',
        includes: [],
        excludes: [],
        is_active: true,
        is_free: false,
        billing_interval_months: 1,
        order: plans.filter(p => p.type === activeTab).length + 1,
    });

    const fetchPlans = async () => {
        try {
            const data = await pricingService.getAll(false);
            setPlans(data);
        } catch (error) {
            console.error('Error al cargar planes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSave = async () => {
        if (!editingPlan) return;

        try {
            if (isCreating || !editingPlan.id) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _id, ...planWithoutId } = editingPlan;
                await pricingService.create(planWithoutId as Omit<PricingPlan, 'id'>);
                setIsCreating(false);
            } else {
                await pricingService.update(editingPlan.id, editingPlan);
            }
            setEditingPlan(null);
            fetchPlans();
        } catch (error) {
            console.error('Failed to save', error);
            alert(`Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    const handleStartCreate = () => {
        setIsCreating(true);
        setEditingPlan(createNewPlan());
    };

    const handleCancelEdit = () => {
        setEditingPlan(null);
        setIsCreating(false);
    };

    const handleDelete = async (plan: PricingPlan) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar el plan "${plan.name}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await pricingService.delete(plan.id);
            fetchPlans();
        } catch (error) {
            console.error('Failed to delete', error);
            alert(`Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    const priceToCents = (price: string): number => {
        const cleaned = price.replace(/[^\d.,]/g, '');
        const normalized = cleaned.replace(/\./g, '').replace(',', '.');
        const amount = parseFloat(normalized) || 0;
        return Math.round(amount * 100);
    };

    const updateField = (field: keyof PricingPlan, value: string | number | boolean) => {
        if (!editingPlan) return;

        const updates: Partial<PricingPlan> = { [field]: value };

        if (field === 'price_monthly' && typeof value === 'string') {
            updates.price_monthly_cents = priceToCents(value);
        }
        if (field === 'price_annual' && typeof value === 'string') {
            updates.price_annual_cents = priceToCents(value);
        }

        setEditingPlan({ ...editingPlan, ...updates });
    };

    const updateArrayField = (field: 'includes' | 'excludes', index: number, value: string) => {
        if (editingPlan) {
            const newArray = [...editingPlan[field]];
            newArray[index] = value;
            setEditingPlan({ ...editingPlan, [field]: newArray });
        }
    };

    const addArrayItem = (field: 'includes' | 'excludes') => {
        if (editingPlan) {
            setEditingPlan({ ...editingPlan, [field]: [...editingPlan[field], ''] });
        }
    };

    const removeArrayItem = (field: 'includes' | 'excludes', index: number) => {
        if (editingPlan) {
            const newArray = [...editingPlan[field]];
            newArray.splice(index, 1);
            setEditingPlan({ ...editingPlan, [field]: newArray });
        }
    };

    const filteredPlans = plans
        .filter(p => p.type === activeTab)
        .sort((a, b) => {
            const aIsCorp = a.plan_type?.includes('corporate') || a.name?.toLowerCase().includes('personalizad');
            const bIsCorp = b.plan_type?.includes('corporate') || b.name?.toLowerCase().includes('personalizad');
            if (aIsCorp && !bIsCorp) return 1;
            if (!aIsCorp && bIsCorp) return -1;
            if (a.is_free && !b.is_free) return -1;
            if (!a.is_free && b.is_free) return 1;
            return (a.price_monthly_cents || 0) - (b.price_monthly_cents || 0);
        });

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-950">
            <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
                        Planes y Precios
                    </h1>
                    <p className="text-slate-400 text-lg">Configura la oferta comercial para usuarios y empresas.</p>
                </div>

                <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 shadow-lg backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'personal'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Users size={18} />
                        Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('empresa')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'empresa'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Building2 size={18} />
                        Empresa
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Create New Plan Card (Moved to start of list if creating) */}
                {isCreating && editingPlan && (
                    <div className="relative group col-span-1 lg:col-span-1 animate-in fade-in zoom-in duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                        <Card className="bg-slate-900/80 backdrop-blur-xl border-emerald-500/50 border shadow-2xl p-6 relative h-full flex flex-col">
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                                Nuevo Plan
                            </div>
                            <EditingForm
                                plan={editingPlan}
                                updateField={updateField}
                                updateArrayField={updateArrayField}
                                addArrayItem={addArrayItem}
                                removeArrayItem={removeArrayItem}
                                onSave={handleSave}
                                onCancel={handleCancelEdit}
                            />
                        </Card>
                    </div>
                )}

                {filteredPlans.map((plan) => (
                    <div key={plan.id} className="relative group h-full">
                        {editingPlan?.id === plan.id ? (
                            // Edit Mode Card
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl" />
                                <Card className="bg-slate-900/90 backdrop-blur-xl border-blue-500/50 border shadow-2xl p-6 relative h-full flex flex-col z-10">
                                    <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                                        Editando
                                    </div>
                                    <EditingForm
                                        plan={editingPlan}
                                        updateField={updateField}
                                        updateArrayField={updateArrayField}
                                        addArrayItem={addArrayItem}
                                        removeArrayItem={removeArrayItem}
                                        onSave={handleSave}
                                        onCancel={handleCancelEdit}
                                    />
                                </Card>
                            </>
                        ) : (
                            // View Mode Card
                            <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all p-8 h-full flex flex-col group/card">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            {plan.is_free && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/20">
                                                    GRATIS
                                                </span>
                                            )}
                                            {!plan.is_active && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-bold border border-slate-500/20">
                                                    INACTIVO
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white group-hover/card:text-blue-400 transition-colors">
                                            {plan.name}
                                        </h3>
                                        <div className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">
                                            {PLAN_TYPES[plan.type]?.find(t => t.value === plan.plan_type)?.label || plan.plan_type}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingPlan(plan)}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-colors text-slate-400"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan)}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors text-slate-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6 space-y-1">
                                    {plan.is_free ? (
                                        <div className="text-4xl font-bold text-white">$0</div>
                                    ) : (
                                        <>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold text-white">{plan.price_monthly}</span>
                                                <span className="text-slate-500 text-sm font-medium">/mes</span>
                                            </div>
                                            {plan.price_annual && (
                                                <div className="text-sm text-slate-500 font-medium">
                                                    {plan.price_annual} /año
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow border-t border-white/5 pt-4">
                                    {plan.description}
                                </p>

                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    {plan.includes?.slice(0, 3).map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                            <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                                            <span className="line-clamp-1">{item}</span>
                                        </div>
                                    ))}
                                    {(plan.includes?.length || 0) > 3 && (
                                        <div className="text-xs text-slate-500 pl-6">
                                            + {plan.includes.length - 3} beneficios más
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                ))}

                {/* Add New Button (Last Item) */}
                {!isCreating && (
                    <button
                        onClick={handleStartCreate}
                        className="group relative h-full min-h-[400px] flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 bg-slate-900/20 hover:bg-emerald-500/5 transition-all duration-300"
                    >
                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                            <Plus size={32} className="text-slate-500 group-hover:text-emerald-400" />
                        </div>
                        <span className="font-bold text-slate-500 group-hover:text-emerald-400 transition-colors">
                            Crear Nuevo Plan
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}

// Subcomponent for the toggle/edit form to keep the main component cleaner
function EditingForm({ plan, updateField, updateArrayField, addArrayItem, removeArrayItem, onSave, onCancel }: any) {
    return (
        <div className="flex flex-col h-full space-y-5">
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 block">Nombre del Plan</label>
                    <input
                        value={plan.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="w-full bg-slate-950/50 text-white p-2.5 rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 font-bold"
                        placeholder="Ej. Plan Pro"
                    />
                </div>
                <div className="col-span-2">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 block">Tipo de Sistema</label>
                    <select
                        value={plan.plan_type || ''}
                        onChange={(e) => updateField('plan_type', e.target.value)}
                        className="w-full bg-slate-950/50 text-slate-300 p-2.5 rounded-xl border border-white/10 focus:border-blue-500/50 outline-none"
                    >
                        <option value="">Seleccionar...</option>
                        {PLAN_TYPES[plan.type as keyof typeof PLAN_TYPES]?.map((pt: any) => (
                            <option key={pt.value} value={pt.value}>{pt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${plan.is_free ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 bg-transparent'}`}>
                        {plan.is_free && <Check size={12} className="text-white" />}
                    </div>
                    <input
                        type="checkbox"
                        checked={plan.is_free}
                        onChange={(e) => updateField('is_free', e.target.checked)}
                        className="hidden"
                    />
                    <span className="font-medium">Gratuito</span>
                </label>
                <div className="w-px h-6 bg-white/10"></div>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${plan.is_active ? 'bg-blue-500 border-blue-500' : 'border-slate-500 bg-transparent'}`}>
                        {plan.is_active && <Check size={12} className="text-white" />}
                    </div>
                    <input
                        type="checkbox"
                        checked={plan.is_active}
                        onChange={(e) => updateField('is_active', e.target.checked)}
                        className="hidden"
                    />
                    <span className="font-medium">Activo</span>
                </label>
            </div>

            {!plan.is_free && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 block">Ciclo de Cobro</label>
                        <select
                            value={plan.billing_interval_months || 1}
                            onChange={(e) => updateField('billing_interval_months', parseInt(e.target.value))}
                            className="w-full bg-slate-950/50 text-slate-300 p-2 rounded-lg border border-white/10 text-sm"
                        >
                            <option value={1}>Mensual (1 mes)</option>
                            <option value={12}>Anual (12 meses)</option>
                            <option value={3}>Trimestral</option>
                            <option value={6}>Semestral</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 block">Mensual ($)</label>
                            <input
                                value={plan.price_monthly || ''}
                                onChange={(e) => updateField('price_monthly', e.target.value)}
                                className="w-full bg-slate-950/50 text-white p-2 rounded-lg border border-white/10 font-mono text-sm"
                                placeholder="29900"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 block">Anual ($)</label>
                            <input
                                value={plan.price_annual || ''}
                                onChange={(e) => updateField('price_annual', e.target.value)}
                                className="w-full bg-slate-950/50 text-white p-2 rounded-lg border border-white/10 font-mono text-sm"
                                placeholder="299000"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 block">Descripción</label>
                <textarea
                    value={plan.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full bg-slate-950/50 text-slate-300 p-2.5 rounded-xl border border-white/10 text-sm min-h-[60px] resize-none focus:border-blue-500/50 outline-none"
                    rows={2}
                />
            </div>

            {/* Features Editor */}
            <div className="flex-grow space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1">
                            <Check size={10} /> Incluye
                        </label>
                        <button onClick={() => addArrayItem('includes')} className="p-1 rounded bg-white/5 hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                            <Plus size={12} />
                        </button>
                    </div>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                        {plan.includes?.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    value={item}
                                    onChange={(e) => updateArrayField('includes', idx, e.target.value)}
                                    className="flex-1 bg-slate-950/50 text-slate-300 px-2 py-1.5 rounded-lg border border-white/5 text-xs focus:border-emerald-500/30 outline-none"
                                    placeholder="Característica..."
                                />
                                <button onClick={() => removeArrayItem('includes', idx)} className="text-slate-600 hover:text-red-400 px-1">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {(!plan.includes?.length) && <p className="text-xs text-slate-600 italic px-1">Sin elementos</p>}
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase text-red-400 font-bold tracking-wider flex items-center gap-1">
                            <X size={10} /> No Incluye
                        </label>
                        <button onClick={() => addArrayItem('excludes')} className="p-1 rounded bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors">
                            <Plus size={12} />
                        </button>
                    </div>
                    <div className="space-y-1.5 max-h-[80px] overflow-y-auto pr-1">
                        {plan.excludes?.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    value={item}
                                    onChange={(e) => updateArrayField('excludes', idx, e.target.value)}
                                    className="flex-1 bg-slate-950/50 text-slate-300 px-2 py-1.5 rounded-lg border border-white/5 text-xs focus:border-red-500/30 outline-none"
                                    placeholder="Exclusión..."
                                />
                                <button onClick={() => removeArrayItem('excludes', idx)} className="text-slate-600 hover:text-red-400 px-1">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {(!plan.excludes?.length) && <p className="text-xs text-slate-600 italic px-1">Sin elementos</p>}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4 mt-auto border-t border-white/10">
                <Button
                    variant="ghost"
                    className="flex-1 text-slate-400 hover:text-white hover:bg-white/5"
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
                <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-blue-900/20"
                    onClick={onSave}
                >
                    <Save size={16} className="mr-2" /> Guardar
                </Button>
            </div>
        </div>
    );
}
