'use client';

import { useState } from 'react';
import { X, Loader2, UploadCloud } from 'lucide-react';
import { contentService } from '@/services/content.service';

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // TODO: Handle thumbnail upload (Cloudinary)
            await contentService.createCourse({
                title,
                description,
                categoryId,
                isPublished: false,
                thumbnailUrl: '', // Placeholder
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert('Failed to create course');
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
                        {/* This should ideally be a select dropdown from fetched categories */}
                        <input
                            type="text"
                            required
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. basic, intermediate, advanced"
                        />
                    </div>

                    <div className="border border-slate-700 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <UploadCloud size={32} className="mb-2" />
                        <span className="text-sm">Upload Thumbnail (Coming Soon)</span>
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
