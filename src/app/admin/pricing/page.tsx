'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, Trash2, Check, X, Save } from 'lucide-react';

interface PricingPlan {
    id: string;
    name: string;
    type: string;
    price_monthly: string;
    price_annual: string;
    description: string;
    includes: string[];
    excludes: string[];
    is_active: boolean;
    order: number;
}

export default function PricingAdminPage() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

    // Fetch plans
    const fetchPlans = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/content/pricing/plans?activeOnly=false');
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (error) {
            console.error(error);
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
            const res = await fetch(`http://localhost:3001/api/content/pricing/plans/${editingPlan.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPlan),
            });

            if (res.ok) {
                setEditingPlan(null);
                fetchPlans();
            }
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const updateField = (field: keyof PricingPlan, value: any) => {
        if (editingPlan) {
            setEditingPlan({ ...editingPlan, [field]: value });
        }
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
            setEditingPlan({ ...editingPlan, [field]: [...editingPlan[field], 'Nueva característica'] });
        }
    };

    const removeArrayItem = (field: 'includes' | 'excludes', index: number) => {
        if (editingPlan) {
            const newArray = [...editingPlan[field]];
            newArray.splice(index, 1);
            setEditingPlan({ ...editingPlan, [field]: newArray });
        }
    };

    if (loading) return <div className="p-8 text-white">Cargando planes...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Gestión de Planes de Precios</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.id} className="bg-slate-900 border-slate-800 p-6 relative">
                        {editingPlan?.id === plan.id ? (
                            // Edit Mode
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400">Nombre</label>
                                    <input
                                        value={editingPlan.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400">Precio Mensual</label>
                                        <input
                                            value={editingPlan.price_monthly}
                                            onChange={(e) => updateField('price_monthly', e.target.value)}
                                            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400">Precio Anual</label>
                                        <input
                                            value={editingPlan.price_annual || ''}
                                            onChange={(e) => updateField('price_annual', e.target.value)}
                                            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Descripción</label>
                                    <textarea
                                        value={editingPlan.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700 text-sm"
                                        rows={3}
                                    />
                                </div>

                                {/* Features */}
                                <div>
                                    <label className="text-xs text-gray-400 font-bold">Incluye:</label>
                                    <div className="space-y-2 mt-1">
                                        {editingPlan.includes.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    value={item}
                                                    onChange={(e) => updateArrayField('includes', idx, e.target.value)}
                                                    className="flex-1 bg-slate-800 text-white p-1 text-xs rounded border border-slate-700"
                                                />
                                                <button onClick={() => removeArrayItem('includes', idx)} className="text-red-400">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => addArrayItem('includes')} className="text-xs text-blue-400 flex items-center gap-1">
                                            <Plus size={12} /> Agregar
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-800">
                                    <Button variant="ghost" className='text-gray-300' onClick={() => setEditingPlan(null)}>Cancelar</Button>
                                    <Button className='bg-green-600 hover:bg-green-700' onClick={handleSave}>
                                        <Save size={16} className="mr-2" /> Guardar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${plan.type === 'personal' ? 'bg-blue-900 text-blue-200' : 'bg-purple-900 text-purple-200'}`}>
                                            {plan.type}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingPlan(plan)}>
                                        <Edit2 size={18} className="text-blue-400" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Mensual:</span>
                                        <span className="text-white font-mono">{plan.price_monthly}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Anual:</span>
                                        <span className="text-white font-mono">{plan.price_annual || '-'}</span>
                                    </div>

                                    <p className="text-sm text-gray-300 line-clamp-2" title={plan.description}>
                                        {plan.description}
                                    </p>

                                    <div className="pt-4 border-t border-slate-800">
                                        <p className="text-xs text-gray-500 mb-2">{plan.includes.length} características incluidas</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
