'use client';

import { Plus, Folder, Video, BookOpen, MoreHorizontal, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { contentService, Course } from '@/services/content.service';

import CreateCourseModal from './CreateCourseModal';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await contentService.getAllCourses();
            setCourses(data);
        } catch (err) {
            setError('Failed to load courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button onClick={fetchCourses} className="text-indigo-400 hover:text-indigo-300 underline">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <CreateCourseModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchCourses}
            />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Content Library</h2>
                    <p className="text-slate-400">Manage courses, modules, and video lessons.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-slate-700">
                        Manage Categories
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} />
                        New Course
                    </button>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700 border-dashed">
                    <p className="text-slate-400 mb-4">No courses setup yet.</p>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Create your first course</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden group hover:border-slate-600 transition-all">
                            <div className="h-40 bg-slate-900 relative flex items-center justify-center">
                                {course.thumbnailUrl ? (
                                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <Video size={48} className="text-slate-700 group-hover:text-slate-600 transition-colors" />
                                )}
                                <div className="absolute top-3 right-3">
                                    <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${course.isPublished ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-black'
                                        }`}>
                                        {course.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                {/* Category would need to be populated on backend or fetched separately, handling loading state simply for now */}
                                <div className="text-xs font-medium text-indigo-400 mb-1">Category {course.categoryId}</div>
                                <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                                <div className="flex items-center gap-4 text-slate-400 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Folder size={14} /> {course.modules?.length || 0} Modules
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BookOpen size={14} /> - Lessons
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
