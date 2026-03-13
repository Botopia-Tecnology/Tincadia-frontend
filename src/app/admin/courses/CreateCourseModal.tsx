'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, UploadCloud } from 'lucide-react';
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

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        try {
            const data = await contentService.getCategories();
            setCategories(data);
            // Auto-select first if available and none selected
            if (data.length > 0 && !categoryId) {
                setCategoryId(data[0].id);
            }
        } catch (error) {
            console.error('Failed to load categories');
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const newCat = await contentService.createCategory(newCategoryName);
            await loadCategories();
            setCategoryId(newCat.id); // Auto select new category
            setIsCreatingCategory(false);
            setNewCategoryName('');
        } catch (error) {
            alert('Failed to create category');
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
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
                        <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                        {!isCreatingCategory ? (
                            <div className="flex gap-2">
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingCategory(true)}
                                    className="px-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-white"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    autoFocus
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                                    placeholder="New Category Name"
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    className="px-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingCategory(false)}
                                    className="px-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Modo de acceso</label>
                            <select
                                value={accessScope}
                                onChange={(e) => setAccessScope(e.target.value as 'course' | 'module' | 'lesson')}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="course">Curso completo (un pago)</option>
                                <option value="module">Por módulos</option>
                                <option value="lesson">Por lecciones/videos</option>
                            </select>
                        </div>

                        {accessScope === 'course' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Curso de pago</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsPaid(!isPaid)}
                                        className={`flex-1 px-3 py-2 rounded-lg border text-white ${isPaid
                                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                                            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                                            }`}
                                    >
                                        {isPaid ? 'De pago' : 'Libre'}
                                    </button>
                                    <div className="flex flex-col">
                                        <label className="text-xs text-slate-400">Videos gratis</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={10}
                                            value={previewLimit}
                                            onChange={(e) => setPreviewLimit(Number(e.target.value))}
                                            className="w-24 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Recomendado: 3-4 videos libres.</p>
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
        </div>
    );
}
