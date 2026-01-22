'use client';

import { Plus, Folder, Video, BookOpen, Loader2, FolderKanban, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { contentService, Course } from '@/services/content.service';
import Link from 'next/link';
import CreateCourseModal from './CreateCourseModal';

interface Category {
    id: string;
    name: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesData, categoriesData] = await Promise.all([
                contentService.getAllCourses(),
                contentService.getCategories()
            ]);
            setCourses(coursesData);
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to load content library. Please try again later.');
            console.error(err);
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
                <button onClick={fetchData} className="text-indigo-400 hover:text-indigo-300 underline">
                    Retry
                </button>
            </div>
        );
    }

    // Group courses by category
    const groupedCourses = courses.reduce((acc, course) => {
        const catId = course.categoryId || 'uncategorized';
        if (!acc[catId]) {
            acc[catId] = [];
        }
        acc[catId].push(course);
        return acc;
    }, {} as Record<string, Course[]>);

    // Get sorted category IDs (known categories first, then uncategorized)
    const sortedCategoryIds = Object.keys(groupedCourses).sort((a, b) => {
        if (a === 'uncategorized') return 1;
        if (b === 'uncategorized') return -1;
        // Find names for sorting
        const nameA = categories.find(c => c.id === a)?.name || '';
        const nameB = categories.find(c => c.id === b)?.name || '';
        return nameA.localeCompare(nameB);
    });

    return (
        <div className="space-y-12 pb-12">
            <CreateCourseModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchData}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Content Library</h2>
                    <p className="text-slate-400">Administra cursos, módulos y lecciones.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        <FolderKanban size={18} />
                        <span>Categorías</span>
                    </Link>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>Nuevo Curso</span>
                    </button>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
                    <div className="inline-flex p-4 rounded-full bg-slate-800 mb-4">
                        <BookOpen size={32} className="text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No tienes cursos creados</h3>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">Comienza creando tu primer curso para compartir conocimiento con tus usuarios.</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
                    >
                        Crear mi primer curso
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    {sortedCategoryIds.map((categoryId) => {
                        const categoryName = categories.find(c => c.id === categoryId)?.name || (categoryId === 'uncategorized' ? 'Sin Categoría' : 'Categoría Desconocida');
                        const categoryCourses = groupedCourses[categoryId];

                        return (
                            <div key={categoryId} className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                                    <div className={`p-1.5 rounded-lg ${categoryId === 'uncategorized' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                        <FolderKanban size={18} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white capitalize">{categoryName}</h3>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 ml-auto md:ml-0">
                                        {categoryCourses.length} {categoryCourses.length === 1 ? 'curso' : 'cursos'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {categoryCourses.map((course) => (
                                        <Link href={`/admin/courses/${course.id}`} key={course.id} className="block group">
                                            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer h-full flex flex-col relative">

                                                {/* Image Container */}
                                                <div className="h-44 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                                                    {course.thumbnailUrl ? (
                                                        <img
                                                            src={course.thumbnailUrl}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                                            <Video size={48} className="text-slate-700 group-hover:text-slate-600 transition-colors" />
                                                        </div>
                                                    )}

                                                    {/* Delete Button */}
                                                    <div className="absolute top-3 right-3 z-20">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (confirm('Delete this course?')) {
                                                                    contentService.deleteCourse(course.id).then(fetchData);
                                                                }
                                                            }}
                                                            className="p-2 bg-black/40 hover:bg-red-600/90 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
                                                            title="Delete Course"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="absolute top-3 left-3">
                                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${course.isPublished
                                                                ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20'
                                                                : 'bg-amber-500/90 text-black shadow-lg shadow-amber-500/20'
                                                            }`}>
                                                            {course.isPublished ? 'Publicado' : 'Borrador'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <div className="text-xs font-semibold text-indigo-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                                        <FolderKanban size={12} />
                                                        {categoryName}
                                                    </div>

                                                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
                                                        {course.title}
                                                    </h3>

                                                    <div className="mt-auto flex items-center justify-between text-slate-400 text-xs border-t border-slate-700/50 pt-4">
                                                        <span className="flex items-center gap-1.5 font-medium">
                                                            <Folder size={14} className="text-slate-500" />
                                                            {course.modules?.length || 0} Módulos
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-indigo-400 group-hover:translate-x-1 transition-transform">
                                                            Gestionar
                                                            <BookOpen size={14} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
