'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contentService, Course } from '@/services/content.service';
import { Loader2, ChevronDown, ChevronRight, PlayCircle, Lock, CheckCircle, Menu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CoursePlayerPage() {
    const params = useParams();
    const courseId = params.id as string;

    // State
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState<any | null>(null);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const data = await contentService.getCourseById(courseId);
            setCourse(data);

            // Auto-select first lesson if available and expand first module
            if (data.modules && data.modules.length > 0) {
                setExpandedModules([data.modules[0].id]);
                if (data.modules[0].lessons && data.modules[0].lessons.length > 0) {
                    setActiveLesson(data.modules[0].lessons[0]);
                }
            }
        } catch (error) {
            console.error('Failed to load course', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    if (loading) return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-[#83A98A]" size={48} />
        </div>
    );

    if (!course) return (
        <div className="p-10 text-center">Course not found</div>
    );

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="h-16 border-b border-gray-200 flex items-center px-4 bg-white z-10 shadow-sm flex-shrink-0">
                <Link href="/cursos" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">
                    {course.title}
                </h1>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {Math.floor(Math.random() * 100)}% Completado
                    </span>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Video Player) */}
                <main className="flex-1 bg-black flex flex-col relative overflow-y-auto">
                    {activeLesson ? (
                        <div className="flex-1 flex flex-col">
                            {/* Video Container */}
                            <div className="w-full bg-black aspect-video max-h-[70vh] flex items-center justify-center relative">
                                {activeLesson.videoUrl ? (
                                    <video
                                        src={activeLesson.videoUrl}
                                        controls
                                        className="w-full h-full"
                                        poster={course.thumbnailUrl} // Fallback poster
                                        autoPlay={false}
                                    />
                                ) : (
                                    <div className="text-center p-8 bg-zinc-900 rounded-lg max-w-md">
                                        <Lock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                                        <p className="text-zinc-400">Este video no está disponible o requiere acceso premium.</p>
                                    </div>
                                )}
                            </div>

                            {/* Lesson Info */}
                            <div className="p-6 md:p-8 bg-white flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeLesson.title}</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {activeLesson.description || 'Sin descripción adicional para esta lección.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-white p-8 text-center bg-zinc-900">
                            <PlayCircle size={64} className="text-[#83A98A] mb-4 opacity-50" />
                            <h2 className="text-xl font-medium">Selecciona una lección para comenzar</h2>
                        </div>
                    )}
                </main>

                {/* Sidebar (Curriculum) */}
                <aside className="w-80 md:w-96 border-l border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0 hidden md:block">
                    <div className="p-4 border-b border-gray-200 sticky top-0 bg-gray-50 z-10">
                        <h3 className="font-bold text-gray-900">Contenido del Curso</h3>
                    </div>

                    <div className="space-y-1 p-2">
                        {course.modules?.map((module: any) => (
                            <div key={module.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className="font-semibold text-sm text-gray-800 line-clamp-1">{module.title}</span>
                                    {expandedModules.includes(module.id) ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                </button>

                                {expandedModules.includes(module.id) && (
                                    <div className="border-t border-gray-100 bg-gray-50">
                                        {module.lessons?.map((lesson: any) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => setActiveLesson(lesson)}
                                                className={`w-full flex items-center gap-3 p-3 text-left transition-all border-l-4 ${activeLesson?.id === lesson.id
                                                        ? 'bg-[#83A98A]/10 border-[#83A98A]'
                                                        : 'border-transparent hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${activeLesson?.id === lesson.id ? 'text-[#83A98A]' : 'text-gray-400'
                                                    }`}>
                                                    {lesson.videoUrl ? <PlayCircle size={16} /> : <Lock size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium truncate ${activeLesson?.id === lesson.id ? 'text-[#83A98A]' : 'text-gray-700'
                                                        }`}>
                                                        {lesson.title}
                                                    </p>
                                                    <span className="text-xs text-gray-400">{lesson.durationSeconds ? `${Math.round(lesson.durationSeconds / 60)} min` : 'Video'}</span>
                                                </div>
                                            </button>
                                        ))}
                                        {(!module.lessons || module.lessons.length === 0) && (
                                            <div className="p-3 text-xs text-gray-400 italic text-center">Sin lecciones</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
