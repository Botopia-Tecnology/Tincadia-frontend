'use client';
// Force TS update

import { Course } from '@/services/content.service';
import { ArrowLeft, CheckCircle, PlayCircle, Lock, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

interface CourseLandingViewProps {
    course: Course;
    onBuy: () => void;
    isAuthenticated: boolean;
}

export function CourseLandingView({ course, onBuy, isAuthenticated }: CourseLandingViewProps) {
    const formatPrice = (cents: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(cents / 100);
    };

    const modulesCount = course.modules?.length || 0;
    const lessonsCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/cursos" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
                        <ArrowLeft size={20} />
                        Volver al catálogo
                    </Link>
                    <div className="hidden md:block">
                        <span className="font-bold text-lg text-slate-900">{course.title}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
                <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">

                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Hero Info */}
                        <div>
                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full mb-4">
                                Curso Online
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                {course.description || "Domina nuevas habilidades con este curso completo y práctico. Diseñado para llevarte paso a paso hacia la maestría del tema."}
                            </p>

                            <div className="flex items-center gap-6 mt-8 text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={20} className="text-indigo-600" />
                                    {modulesCount} Módulos
                                </div>
                                <div className="flex items-center gap-2">
                                    <PlayCircle size={20} className="text-indigo-600" />
                                    {lessonsCount} Lecciones
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={20} className="text-indigo-600" />
                                    A tu propio ritmo
                                </div>
                            </div>
                        </div>

                        {/* What you'll learn (Static/Placeholder if no data) */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            <h3 className="text-2xl font-bold mb-6">Lo que aprenderás</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {(course.learningPoints && course.learningPoints.length > 0 ? course.learningPoints : [
                                    "Fundamentos sólidos y teoría aplicada",
                                    "Proyectos prácticos y casos de uso real",
                                    "Mejores prácticas de la industria",
                                    "Certificado de finalización"
                                ]).map((item, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <CheckCircle className="text-[#83A98A] flex-shrink-0 mt-1" size={18} />
                                        <span className="text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum Preview */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Contenido del curso</h3>
                            <div className="border border-slate-200 rounded-xl divide-y divide-slate-200">
                                {course.modules?.map((module: any) => (
                                    <div key={module.id} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-slate-900">{module.title}</h4>
                                            <span className="text-xs text-slate-500">{module.lessons?.length || 0} lecciones</span>
                                        </div>
                                        <div className="pl-4 border-l-2 border-slate-200 space-y-2 mt-3">
                                            {module.lessons?.slice(0, 3).map((lesson: any) => (
                                                <div key={lesson.id} className="flex items-center justify-between text-sm text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        {lesson.isFreePreview ? <PlayCircle size={14} className="text-indigo-600" /> : <Lock size={14} className="text-slate-400" />}
                                                        <span>{lesson.title}</span>
                                                    </div>
                                                    {lesson.isFreePreview && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Gratis</span>}
                                                </div>
                                            ))}
                                            {(module.lessons?.length || 0) > 3 && (
                                                <div className="text-xs text-slate-400 pl-6 pt-1">
                                                    + {module.lessons.length - 3} lecciones más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="relative">
                        <div className="sticky top-24 space-y-6">
                            {/* Card Image */}
                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                                {course.thumbnailUrl && (
                                    <div className="aspect-video relative bg-slate-100">
                                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                            <div className="bg-white/90 backdrop-blur rounded-full p-4 shadow-lg">
                                                <PlayCircle size={40} className="text-indigo-600 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="p-8">
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl font-extrabold text-[#83A98A]">
                                            {formatPrice(course.priceInCents || 0)}
                                        </span>
                                        <span className="text-slate-500 font-medium mb-1 line-through text-lg">
                                            {formatPrice((course.priceInCents || 0) * 1.5)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-500 mb-8 font-medium">Pago único, acceso de por vida</div>

                                    <button
                                        onClick={onBuy}
                                        className="w-full py-4 px-6 bg-[#83A98A] hover:bg-[#6D8F75] text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        {isAuthenticated ? 'Comprar ahora' : 'Inicia Sesión para Comprar'}
                                    </button>

                                    <div className="mt-6 space-y-3 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={16} className="text-[#83A98A]" />
                                            <span>Acceso inmediato</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={16} className="text-[#83A98A]" />
                                            <span>Garantía de satisfacción</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={16} className="text-[#83A98A]" />
                                            <span>Certificado incluido</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
