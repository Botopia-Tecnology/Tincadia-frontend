'use client';

import { useEffect, useState, useMemo } from 'react';
import { contentService, Course } from '@/services/content.service';
import { Loader2, BookOpen, Search, PlayCircle, Grid, Layers } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await contentService.getAllCourses();
                // Filter only published courses
                setCourses(data.filter(c => c.isPublished));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Get unique categories from courses
    const categories = useMemo(() => {
        const cats = new Map<string, string>();
        courses.forEach(c => {
            if (c.category) {
                cats.set(c.category.id, c.category.name);
            } else {
                cats.set('uncategorized', 'Sin Categoría');
            }
        });
        return Array.from(cats.entries()).map(([id, name]) => ({ id, name }));
    }, [courses]);

    // Filter and Group Courses
    const groupedCourses = useMemo(() => {
        let filtered = courses;

        // Apply Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(lowerTerm) ||
                c.description?.toLowerCase().includes(lowerTerm)
            );
        }

        // Apply Category Filter
        if (selectedCategory) {
            filtered = filtered.filter(c =>
                (selectedCategory === 'uncategorized' && !c.category) ||
                c.category?.id === selectedCategory
            );
        }

        // Group by Category
        const groups: { [key: string]: { name: string; courses: Course[] } } = {};

        filtered.forEach(course => {
            const catId = course.category?.id || 'uncategorized';
            const catName = course.category?.name || 'Sin Categoría';

            if (!groups[catId]) {
                groups[catId] = { name: catName, courses: [] };
            }
            groups[catId].courses.push(course);
        });

        return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
    }, [courses, searchTerm, selectedCategory]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900">Catálogo de Cursos</h1>
                        <p className="text-slate-500">Domina nuevas habilidades con nuestros cursos estructurados.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar cursos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-4 w-full sm:w-64 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm border ${selectedCategory === null
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm border ${selectedCategory === cat.id
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Content Groups */}
                <div className="space-y-16">
                    {groupedCourses.length > 0 ? (
                        groupedCourses.map((group) => (
                            <section key={group.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
                                    <Layers className="text-indigo-600" size={20} />
                                    <h2 className="text-xl font-bold text-slate-800">{group.name}</h2>
                                    <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded ml-2 font-medium">
                                        {group.courses.length}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {group.courses.map(course => (
                                        <Link href={`/cursos/${course.id}`} key={course.id} className="group block h-full">
                                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 h-full flex flex-col">
                                                {/* Thumbnail */}
                                                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                                    {course.thumbnailUrl ? (
                                                        <img
                                                            src={course.thumbnailUrl}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                                                <Grid size={24} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Play Overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px]">
                                                        <div className="bg-white/90 backdrop-blur-md rounded-full p-3 text-indigo-600 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                                            <PlayCircle size={32} className="fill-current" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                                                        {course.title}
                                                    </h3>
                                                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-50">
                                                        <span className="flex items-center gap-1.5 font-medium">
                                                            <BookOpen size={14} className="text-indigo-500/70" />
                                                            {course.modules?.length || 0} Módulos
                                                        </span>
                                                        {/* Optional: Add duration if available */}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No se encontraron cursos que coincidan con tu búsqueda.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                                className="mt-4 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
