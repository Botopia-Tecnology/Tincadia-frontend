'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, X, Save, Users, Building2, Trash2, Check } from 'lucide-react';
import { pricingService, PricingPlan } from '@/services/content.service';

const PLAN_TYPES = {
    personal: [
        { value: 'personal_free', label: 'Gratis' },
        { value: 'personal_premium', label: 'Premium' },
        { value: 'personal_corporate', label: 'Corporativo' },
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

    // Crear un nuevo plan vacío
    const createNewPlan = (): PricingPlan => ({
        id: '', // Se generará en el backend
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
        billing_interval_months: 1, // Default to monthly
        order: plans.filter(p => p.type === activeTab).length + 1,
    });

    const fetchPlans = async () => {
        try {
            const data = await pricingService.getAll(false); // false = incluir planes inactivos
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
                // Crear nuevo plan (excluir id vacío)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _id, ...planWithoutId } = editingPlan;
                await pricingService.create(planWithoutId as Omit<PricingPlan, 'id'>);
                setIsCreating(false);
            } else {
                // Actualizar plan existente
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

    // Convertir precio display a centavos (ej: "$29.900" -> 2990000, "29900" -> 2990000)
    const priceToCents = (price: string): number => {
        // Remover todo excepto números y puntos/comas
        const cleaned = price.replace(/[^\d.,]/g, '');
        // Reemplazar comas por puntos y remover puntos de miles
        const normalized = cleaned.replace(/\./g, '').replace(',', '.');
        // Parsear como número y multiplicar por 100 (centavos)
        const amount = parseFloat(normalized) || 0;
        return Math.round(amount * 100);
    };

    // Actualizar campo con cálculo automático de centavos
    const updateField = (field: keyof PricingPlan, value: string | number | boolean) => {
        if (!editingPlan) return;

        const updates: Partial<PricingPlan> = { [field]: value };

        // Si cambia el precio display, calcular automáticamente los centavos
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
            // Corporate/personalized plans always last
            const aIsCorp = a.plan_type?.includes('corporate') || a.name?.toLowerCase().includes('personalizad');
            const bIsCorp = b.plan_type?.includes('corporate') || b.name?.toLowerCase().includes('personalizad');
            if (aIsCorp && !bIsCorp) return 1;
            if (!aIsCorp && bIsCorp) return -1;
            // Free plans first
            if (a.is_free && !b.is_free) return -1;
            if (!a.is_free && b.is_free) return 1;
            // Then by price (ascending)
            return (a.price_monthly_cents || 0) - (b.price_monthly_cents || 0);
        });

    if (loading) return <div className="p-8 text-white">Cargando planes...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Gestión de Planes de Precios</h1>
            <p className="text-gray-400 mb-8">Administra los planes y precios de suscripción</p>

            {/* Tabs y botón de crear */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'personal'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        <Users size={18} />
                        Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('empresa')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'empresa'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        <Building2 size={18} />
                        Empresa
                    </button>
                </div>

                <Button
                    onClick={handleStartCreate}
                    disabled={isCreating}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Añadir Plan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card para crear nuevo plan */}
                {isCreating && editingPlan && (
                    <Card className="bg-slate-900 border-green-600 border-2 p-6 relative">
                        <div className="absolute -top-3 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            NUEVO PLAN
                        </div>
                        <div className="space-y-4 mt-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-400">Nombre</label>
                                    <input
                                        value={editingPlan.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Tipo de Plan</label>
                                    <select
                                        value={editingPlan.plan_type || ''}
                                        onChange={(e) => updateField('plan_type', e.target.value)}
                                        className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {PLAN_TYPES[editingPlan.type]?.map(pt => (
                                            <option key={pt.value} value={pt.value}>{pt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={editingPlan.is_free}
                                        onChange={(e) => updateField('is_free', e.target.checked)}
                                        className="rounded"
                                    />
                                    Plan Gratuito
                                </label>
                            </div>

                            {!editingPlan.is_free && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400">Precio Mensual</label>
                                        <input
                                            value={editingPlan.price_monthly || ''}
                                            onChange={(e) => updateField('price_monthly', e.target.value)}
                                            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                            placeholder="29900"
                                        />
                                        <p className="text-xs text-green-400 mt-1">
                                            {(editingPlan.price_monthly_cents || 0).toLocaleString()} centavos
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400">Precio Anual</label>
                                        <input
                                            value={editingPlan.price_annual || ''}
                                            onChange={(e) => updateField('price_annual', e.target.value)}
                                            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                            placeholder="287100"
                                        />
                                        <p className="text-xs text-green-400 mt-1">
                                            {(editingPlan.price_annual_cents || 0).toLocaleString()} centavos
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-gray-400">Descripción</label>
                                <textarea
                                    value={editingPlan.description || ''}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700 text-sm"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400">Texto del Botón</label>
                                <input
                                    value={editingPlan.button_text || ''}
                                    onChange={(e) => updateField('button_text', e.target.value)}
                                    className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                    placeholder="Suscribirme"
                                />
                            </div>

                            {/* Includes */}
                            <div>
                                <label className="text-xs text-gray-400 font-bold flex items-center gap-2">
                                    ✅ Incluye:
                                    <button onClick={() => addArrayItem('includes')} className="text-blue-400 hover:text-blue-300">
                                        <Plus size={14} />
                                    </button>
                                </label>
                                <div className="space-y-1 mt-1 max-h-32 overflow-y-auto">
                                    {editingPlan.includes?.map((item, idx) => (
                                        <div key={idx} className="flex gap-1">
                                            <input
                                                value={item}
                                                onChange={(e) => updateArrayField('includes', idx, e.target.value)}
                                                className="flex-1 bg-slate-800 text-white p-1 text-xs rounded border border-slate-700"
                                                placeholder="Nueva característica..."
                                            />
                                            <button onClick={() => removeArrayItem('includes', idx)} className="text-red-400 hover:text-red-300">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!editingPlan.includes || editingPlan.includes.length === 0) && (
                                        <p className="text-xs text-gray-500 italic">Sin características. Haz clic en + para agregar.</p>
                                    )}
                                </div>
                            </div>

                            {/* Excludes */}
                            <div>
                                <label className="text-xs text-gray-400 font-bold flex items-center gap-2">
                                    ❌ No Incluye:
                                    <button onClick={() => addArrayItem('excludes')} className="text-blue-400 hover:text-blue-300">
                                        <Plus size={14} />
                                    </button>
                                </label>
                                <div className="space-y-1 mt-1 max-h-32 overflow-y-auto">
                                    {editingPlan.excludes?.map((item, idx) => (
                                        <div key={idx} className="flex gap-1">
                                            <input
                                                value={item}
                                                onChange={(e) => updateArrayField('excludes', idx, e.target.value)}
                                                className="flex-1 bg-slate-800 text-white p-1 text-xs rounded border border-slate-700"
                                                placeholder="No incluye..."
                                            />
                                            <button onClick={() => removeArrayItem('excludes', idx)} className="text-red-400 hover:text-red-300">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!editingPlan.excludes || editingPlan.excludes.length === 0) && (
                                        <p className="text-xs text-gray-500 italic">Sin exclusiones. Haz clic en + para agregar.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-800">
                                <Button variant="ghost" className="text-gray-300" onClick={handleCancelEdit}>
                                    Cancelar
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
                                    <Save size={16} className="mr-2" /> Crear Plan
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
                {filteredPlans.map((plan) => (
                    <Card key={plan.id} className="bg-slate-900 border-slate-800 p-6 relative">
                        {editingPlan?.id === plan.id ? (
                            // Edit Mode
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400">Nombre</label>
                                        <input
                                            value={editingPlan.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400">Tipo de Plan</label>
                                        <select
                                            value={editingPlan.plan_type || ''}
                                            onChange={(e) => updateField('plan_type', e.target.value)}
                                            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {PLAN_TYPES[editingPlan.type]?.map(pt => (
                                                <option key={pt.value} value={pt.value}>{pt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={editingPlan.is_free}
                                            onChange={(e) => updateField('is_free', e.target.checked)}
                                            className="rounded"
                                        />
                                        Plan Gratuito
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={editingPlan.is_active}
                                            onChange={(e) => updateField('is_active', e.target.checked)}
                                            className="rounded"
                                        />
                                        Activo
                                    </label>
                                </div>

                                {!editingPlan.is_free && (
                                    <>
                                        <div>
                                            <label className="text-xs text-gray-400">Ciclo de Cobro</label>
                                            <select
                                                value={editingPlan.billing_interval_months || 1}
                                                onChange={(e) => updateField('billing_interval_months', parseInt(e.target.value))}
                                                className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                            >
                                                <option value={1}>Mensual (cada 1 mes)</option>
                                                <option value={2}>Bimestral (cada 2 meses)</option>
                                                <option value={3}>Trimestral (cada 3 meses)</option>
                                                <option value={6}>Semestral (cada 6 meses)</option>
                                                <option value={12}>Anual (cada 12 meses)</option>
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Define cada cuánto tiempo se cobra automáticamente
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-400">Precio Mensual</label>
                                                <input
                                                    value={editingPlan.price_monthly || ''}
                                                    onChange={(e) => updateField('price_monthly', e.target.value)}
                                                    className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                                    placeholder="29900"
                                                />
                                                <p className="text-xs text-green-400 mt-1">
                                                    {(editingPlan.price_monthly_cents || 0).toLocaleString()} centavos
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400">Precio Anual</label>
                                                <input
                                                    value={editingPlan.price_annual || ''}
                                                    onChange={(e) => updateField('price_annual', e.target.value)}
                                                    className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                                    placeholder="287100"
                                                />
                                                <p className="text-xs text-green-400 mt-1">
                                                    {(editingPlan.price_annual_cents || 0).toLocaleString()} centavos
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 bg-slate-800 p-2 rounded">
                                            💡 Escribe el precio sin símbolos (ej: 29900). Los centavos se calculan automáticamente.
                                        </p>
                                    </>
                                )}

                                <div>
                                    <label className="text-xs text-gray-400">Descripción</label>
                                    <textarea
                                        value={editingPlan.description || ''}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700 text-sm"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400">Texto del Botón</label>
                                    <input
                                        value={editingPlan.button_text || ''}
                                        onChange={(e) => updateField('button_text', e.target.value)}
                                        className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                        placeholder="Suscribirme"
                                    />
                                </div>

                                {/* Includes */}
                                <div>
                                    <label className="text-xs text-gray-400 font-bold flex items-center gap-2">
                                        ✅ Incluye:
                                        <button onClick={() => addArrayItem('includes')} className="text-blue-400 hover:text-blue-300">
                                            <Plus size={14} />
                                        </button>
                                    </label>
                                    <div className="space-y-1 mt-1">
                                        {editingPlan.includes?.map((item, idx) => (
                                            <div key={idx} className="flex gap-1">
                                                <input
                                                    value={item}
                                                    onChange={(e) => updateArrayField('includes', idx, e.target.value)}
                                                    className="flex-1 bg-slate-800 text-white p-1 text-xs rounded border border-slate-700"
                                                />
                                                <button onClick={() => removeArrayItem('includes', idx)} className="text-red-400 hover:text-red-300">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Excludes */}
                                <div>
                                    <label className="text-xs text-gray-400 font-bold flex items-center gap-2">
                                        ❌ No Incluye:
                                        <button onClick={() => addArrayItem('excludes')} className="text-blue-400 hover:text-blue-300">
                                            <Plus size={14} />
                                        </button>
                                    </label>
                                    <div className="space-y-1 mt-1">
                                        {editingPlan.excludes?.map((item, idx) => (
                                            <div key={idx} className="flex gap-1">
                                                <input
                                                    value={item}
                                                    onChange={(e) => updateArrayField('excludes', idx, e.target.value)}
                                                    className="flex-1 bg-slate-800 text-white p-1 text-xs rounded border border-slate-700"
                                                />
                                                <button onClick={() => removeArrayItem('excludes', idx)} className="text-red-400 hover:text-red-300">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-800">
                                    <Button variant="ghost" className="text-gray-300" onClick={handleCancelEdit}>
                                        Cancelar
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
                                        <Save size={16} className="mr-2" /> Guardar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                            {plan.is_free && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-green-900 text-green-200">GRATIS</span>
                                            )}
                                            {!plan.is_active && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-red-900 text-red-200">INACTIVO</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 font-mono">{plan.plan_type || 'Sin tipo'}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => setEditingPlan(plan)}>
                                            <Edit2 size={18} className="text-blue-400" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(plan)}>
                                            <Trash2 size={18} className="text-red-400 hover:text-red-300" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {!plan.is_free && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Mensual:</span>
                                                <span className="text-white font-bold">{plan.price_monthly}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Anual:</span>
                                                <span className="text-white">{plan.price_annual || '-'}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 bg-slate-800 p-2 rounded">
                                                Centavos: {(plan.price_monthly_cents || 0).toLocaleString()} / {(plan.price_annual_cents || 0).toLocaleString()}
                                            </div>
                                        </>
                                    )}

                                    <p className="text-sm text-gray-300">{plan.description}</p>

                                    <div className="pt-3 border-t border-slate-800 text-xs text-gray-500 flex items-center gap-3">
                                        <span className="flex items-center gap-1"><Check size={12} className="text-green-400" /> {plan.includes?.length || 0} incluidos</span>
                                        <span className="flex items-center gap-1"><X size={12} className="text-red-400" /> {plan.excludes?.length || 0} excluidos</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                ))}

                {filteredPlans.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No hay planes de tipo &quot;{activeTab}&quot; configurados.
                    </div>
                )}
            </div>
        </div>
    );
}
