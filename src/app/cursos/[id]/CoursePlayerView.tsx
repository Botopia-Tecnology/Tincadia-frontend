'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/services/content.service';
import { ChevronDown, ChevronRight, PlayCircle, Lock, Menu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CoursePlayerViewProps {
    course: Course;
}

export function CoursePlayerView({ course }: CoursePlayerViewProps) {
    const router = useRouter();
    const [activeLesson, setActiveLesson] = useState<any | null>(null);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        // Auto-select first accessible lesson
        const firstAccessible = findFirstAccessibleLesson(course);
        if (firstAccessible) {
            setExpandedModules([firstAccessible.moduleId]);
            setActiveLesson(firstAccessible.lesson);
        } else if (course.modules && course.modules.length > 0) {
            setExpandedModules([course.modules[0].id]);
        }
    }, [course]);

    const findFirstAccessibleLesson = (c: Course) => {
        for (const mod of c.modules || []) {
            for (const les of mod.lessons || []) {
                if (les.videoUrl) { // Simple check since we are in "Player View" implies access
                    return { lesson: les, moduleId: mod.id };
                }
            }
        }
        return null;
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="h-16 border-b border-gray-200 flex items-center px-4 bg-white z-10 shadow-sm flex-shrink-0 justify-between">
                <div className="flex items-center">
                    <Link href="/cursos" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {course.title}
                    </h1>
                </div>

                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                >
                    <Menu size={20} />
                </button>
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
                                        poster={course.thumbnailUrl}
                                        autoPlay={false}
                                    />
                                ) : (
                                    <div className="text-center p-8 bg-zinc-900 rounded-lg max-w-md">
                                        <Lock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                                        <p className="text-zinc-400">Este video no está disponible.</p>
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
                <aside className={`
                    w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0 
                    fixed inset-y-0 right-0 z-20 transition-transform duration-300 transform
                    ${showSidebar ? 'translate-x-0' : 'translate-x-full'}
                    md:relative md:translate-x-0 md:block
                `}>
                    <div className="p-4 border-b border-gray-200 sticky top-0 bg-gray-50 z-10 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Contenido</h3>
                        <button onClick={() => setShowSidebar(false)} className="md:hidden">
                            <ChevronRight />
                        </button>
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
                                                onClick={() => {
                                                    setActiveLesson(lesson);
                                                    if (window.innerWidth < 768) setShowSidebar(false);
                                                }}
                                                className={`w-full flex items-center gap-3 p-3 text-left transition-all border-l-4 ${activeLesson?.id === lesson.id
                                                    ? 'bg-[#83A98A]/10 border-[#83A98A]'
                                                    : 'border-transparent hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${activeLesson?.id === lesson.id ? 'text-[#83A98A]' : 'text-gray-400'
                                                    }`}>
                                                    <PlayCircle size={16} />
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
