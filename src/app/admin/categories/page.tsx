'use client';

import { useState, useEffect } from 'react';
import { contentService } from '@/services/content.service';
import { Loader2, Plus, Trash2, Edit2, X, FolderKanban } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await contentService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await contentService.createCategory(newCategoryName);
            setNewCategoryName('');
            setIsCreating(false);
            loadCategories();
        } catch (error) {
            alert('Failed to create category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? Courses in this category will not be deleted but will lose their category association.')) return;
        try {
            await contentService.deleteCategory(id);
            loadCategories();
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Categories</h1>
                    <p className="text-slate-400">Manage course categories</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                    <Plus size={20} />
                    New Category
                </button>
            </div>

            {/* Create Modal (Inline for simplicity) */}
            {isCreating && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Create Category</h3>
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <input
                            type="text"
                            autoFocus
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Save</button>
                        <button type="button" onClick={() => setIsCreating(false)} className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600">Cancel</button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                </div>
            ) : (
                <div className="grid gap-4">
                    {categories.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                            <FolderKanban className="mx-auto text-slate-500 mb-4" size={48} />
                            <h3 className="text-xl font-medium text-white mb-2">No categories found</h3>
                            <button onClick={() => setIsCreating(true)} className="text-indigo-400 hover:text-indigo-300">Create your first category</button>
                        </div>
                    ) : (
                        categories.map((cat) => (
                            <div key={cat.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-between group hover:border-slate-600 transition-colors">
                                <span className="font-medium text-white">{cat.name}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        title="Delete Category"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
