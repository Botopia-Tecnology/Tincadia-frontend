'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, UploadCloud, Check, Lock, Unlock, Plus } from 'lucide-react';
import { contentService } from '@/services/content.service';

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
const [accessScope, setAccessScope] = useState<'course' | 'module' | 'lesson'>('course');
const [isPaid, setIsPaid] = useState(false);
const [previewLimit, setPreviewLimit] = useState<number>(3);

    // Category creation state
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const loadCategories = useCallback(async () => {
        try {
            const data = await contentService.getCategories();
            setCategories(data);
            // Auto-select first if available and none selected
            if (data.length > 0 && !categoryId) {
                setCategoryId(data[0].id);
            }
        } catch {
        }
    }, [categoryId]);

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen, loadCategories]);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const newCat = await contentService.createCategory(newCategoryName);
            await loadCategories();
            setCategoryId(newCat.id); // Auto select new category
            setIsCreatingCategory(false);
            setNewCategoryName('');
        } catch {
        }
    };

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) {
            alert('Selecciona una categoría para el curso.');
            return;
        }
        setIsLoading(true);
        try {
            // 1. Create Course
            const newCourse = await contentService.createCourse({
                title,
                description,
                categoryId,
                isPublished: false,
                thumbnailUrl: '', // Will be updated after upload
                accessScope,
                isPaid: accessScope === 'course' ? isPaid : false,
                previewLimit,
            });

            // 2. Upload Thumbnail if exists
            if (thumbnailFile && newCourse.id) {
                await contentService.uploadThumbnail(newCourse.id, thumbnailFile);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to create course. Ensure category is selected.');
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="sticky top-0 bg-slate-900 z-10 flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Create New Course</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Course Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Advanced Medical Interpreting"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 h-24"
                            placeholder="Course summary..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Categoría</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {categories.map(cat => {
                                const isSelected = categoryId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategoryId(cat.id)}
                                        title={cat.name}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${isSelected
                                            ? 'bg-blue-600/20 border-blue-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                                            }`}
                                    >
                                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                                            {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
                                        </span>
                                        <span className="truncate">{cat.name}</span>
                                    </button>
                                );
                            })}

                            {!isCreatingCategory && (
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingCategory(true)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-dashed border-slate-600 text-slate-400 text-sm hover:border-slate-400 hover:text-white transition-all"
                                >
                                    <Plus size={15} />
                                    Nueva
                                </button>
                            )}
                        </div>

                        {categories.length === 0 && !isCreatingCategory && (
                            <p className="text-xs text-slate-500 mt-2">No hay categorías. Crea una nueva para continuar.</p>
                        )}

                        {isCreatingCategory && (
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    autoFocus
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nombre de la nueva categoría"
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    className="px-4 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white text-sm font-medium"
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingCategory(false)}
                                    className="px-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-white text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Modo de acceso</label>
                            <select
                                value={accessScope}
                                onChange={(e) => setAccessScope(e.target.value as 'course' | 'module' | 'lesson')}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="course" className="bg-slate-800 text-white">Curso completo (un pago)</option>
                                <option value="module" className="bg-slate-800 text-white">Por módulos</option>
                                <option value="lesson" className="bg-slate-800 text-white">Por lecciones/videos</option>
                            </select>
                        </div>

                        {accessScope === 'course' && (
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Tipo de curso</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsPaid(false)}
                                        aria-pressed={!isPaid}
                                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${!isPaid
                                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                                            }`}
                                    >
                                        {!isPaid ? <Check size={15} strokeWidth={3} /> : <Unlock size={15} />}
                                        Libre
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPaid(true)}
                                        aria-pressed={isPaid}
                                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${isPaid
                                            ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                                            }`}
                                    >
                                        {isPaid ? <Check size={15} strokeWidth={3} /> : <Lock size={15} />}
                                        De pago
                                    </button>
                                </div>

                                {isPaid ? (
                                    <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <label className="block text-xs text-slate-500 mb-1">Videos gratuitos de muestra</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={10}
                                            value={previewLimit}
                                            onChange={(e) => setPreviewLimit(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                                            placeholder="0"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1">Recomendado: 3-4.</p>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-slate-400 mt-1 italic">
                                        Todo el contenido será gratuito.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="border border-slate-700 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <UploadCloud size={32} className="mb-2" />
                        <span className="text-sm">
                            {thumbnailFile ? thumbnailFile.name : 'Upload Thumbnail (Click or Drag)'}
                        </span>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="animate-spin" size={18} />}
                            Create Course
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
