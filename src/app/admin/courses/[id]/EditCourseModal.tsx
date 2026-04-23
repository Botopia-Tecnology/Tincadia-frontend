'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { contentService, Course } from '@/services/content.service';

interface EditCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedCourse: Course) => void;
    course: Course;
}

export default function EditCourseModal({ isOpen, onClose, onSuccess, course }: EditCourseModalProps) {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [categoryId, setCategoryId] = useState(course.categoryId);
    const [priceInCents, setPriceInCents] = useState(course.priceInCents || 0);
    const [priceLabel, setPriceLabel] = useState(course.priceLabel || 'Pago único, acceso de por vida');
    
    // Arrays for learning points and features
    const [learningPoints, setLearningPoints] = useState<string[]>(course.learningPoints || []);
    const [features, setFeatures] = useState<string[]>(course.features || []);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCategories();
            // Sync with course data in case it changed externally
            setTitle(course.title);
            setDescription(course.description);
            setCategoryId(course.categoryId);
            setPriceInCents(course.priceInCents || 0);
            setPriceLabel(course.priceLabel || 'Pago único, acceso de por vida');
            setLearningPoints(course.learningPoints || []);
            setFeatures(course.features || []);
        }
    }, [isOpen, course]);

    const loadCategories = async () => {
        try {
            const data = await contentService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories');
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedCourse = await contentService.updateCourse(course.id, {
                title,
                description,
                categoryId,
                priceInCents,
                priceLabel,
                learningPoints: learningPoints.filter(p => p.trim() !== ''),
                features: features.filter(f => f.trim() !== ''),
            });

            onSuccess(updatedCourse);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update course.');
        } finally {
            setIsLoading(false);
        }
    };

    const addLearningPoint = () => setLearningPoints([...learningPoints, '']);
    const updateLearningPoint = (index: number, value: string) => {
        const newPoints = [...learningPoints];
        newPoints[index] = value;
        setLearningPoints(newPoints);
    };
    const removeLearningPoint = (index: number) => {
        setLearningPoints(learningPoints.filter((_, i) => i !== index));
    };

    const addFeature = () => setFeatures([...features, '']);
    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };
    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="sticky top-0 bg-slate-900 z-10 flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Editar Información del Curso</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Título del Curso</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Categoría</label>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Descripción</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                                />
                            </div>
                        </div>

                        {/* Pricing Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Precio (en centavos)</label>
                                <input
                                    type="number"
                                    value={priceInCents}
                                    onChange={(e) => setPriceInCents(Number(e.target.value))}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Ej: 9900 para $99.00"
                                />
                                <p className="text-[10px] text-slate-500 mt-1">
                                    Precio actual: ${(priceInCents / 100).toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Etiqueta de Precio</label>
                                <input
                                    type="text"
                                    value={priceLabel}
                                    onChange={(e) => setPriceLabel(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Ej: Pago único, acceso de por vida"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-700" />

                    {/* Learning Points & Features */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-400">Lo que aprenderás</label>
                                <button type="button" onClick={addLearningPoint} className="text-xs text-indigo-400 flex items-center gap-1 hover:text-indigo-300">
                                    <Plus size={14} /> Añadir
                                </button>
                            </div>
                            <div className="space-y-2">
                                {learningPoints.map((point, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={point}
                                            onChange={(e) => updateLearningPoint(index, e.target.value)}
                                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white"
                                            placeholder="Punto de aprendizaje..."
                                        />
                                        <button type="button" onClick={() => removeLearningPoint(index)} className="text-slate-500 hover:text-red-400 p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {learningPoints.length === 0 && <p className="text-xs text-slate-600 italic">No hay puntos definidos (usará defaults).</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-400">Características / Beneficios</label>
                                <button type="button" onClick={addFeature} className="text-xs text-indigo-400 flex items-center gap-1 hover:text-indigo-300">
                                    <Plus size={14} /> Añadir
                                </button>
                            </div>
                            <div className="space-y-2">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white"
                                            placeholder="Ej: Certificado incluido"
                                        />
                                        <button type="button" onClick={() => removeFeature(index)} className="text-slate-500 hover:text-red-400 p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {features.length === 0 && <p className="text-xs text-slate-600 italic">No hay características definidas (usará defaults).</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="animate-spin" size={18} />}
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
