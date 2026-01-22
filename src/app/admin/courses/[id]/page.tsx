'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { contentService, Course } from '@/services/content.service';
import { ArrowLeft, Plus, Video, Trash2, UploadCloud, ChevronDown, PlayCircle, Loader2, Edit2, Save, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Types for local state (extending Course type if needed)
interface Lesson {
    id: string;
    title: string;
    videoUrl?: string;
    durationSeconds?: number;
    order: number;
    isPaid?: boolean;
    isFreePreview?: boolean;
}

interface Module {
    id: string;
    title: string;
    description?: string;
    lessons: Lesson[];
    order: number;
    isPaid?: boolean;
}

export default function CourseDetailsPage() {
    const params = useParams();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Access control state
    const [accessScope, setAccessScope] = useState<'course' | 'module' | 'lesson'>('course');
    const [courseIsPaid, setCourseIsPaid] = useState(false);
    const [previewLimit, setPreviewLimit] = useState<number>(3);
    const [savingAccess, setSavingAccess] = useState(false);

    // --- Edit Course Info State ---
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [editDescription, setEditDescription] = useState('');
    const [editPrice, setEditPrice] = useState<number>(0);
    const [savingInfo, setSavingInfo] = useState(false);

    // Module Creation State
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [creatingModule, setCreatingModule] = useState(false);
    const [newModulePaid, setNewModulePaid] = useState(false);

    // Lesson Creation State
    const [showLessonModal, setShowLessonModal] = useState<string | null>(null); // moduleId if open
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [creatingLesson, setCreatingLesson] = useState(false);
    const [newLessonPaid, setNewLessonPaid] = useState(false);
    const [newLessonPreview, setNewLessonPreview] = useState(false);

    // Video Upload State
    const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null);

    const fetchCourse = useCallback(async () => {
        try {
            setLoading(true);
            const data = await contentService.getCourseById(courseId);
            setCourse(data);
            syncAccessState(data);
        } catch {
            setError('Failed to load course details');
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId, fetchCourse]);

    const syncAccessState = (data: Course) => {
        setAccessScope((data.accessScope as 'course' | 'module' | 'lesson' | undefined) || 'course');
        setCourseIsPaid(!!data.isPaid);
        setPreviewLimit(typeof data.previewLimit === 'number' ? data.previewLimit : 3);
        // Sync edit fields
        setEditDescription(data.description || '');
        setEditPrice(data.priceInCents ? data.priceInCents / 100 : 0);
    };

    const handleStartEditing = () => {
        if (course) {
            setEditDescription(course.description || '');
            setEditPrice(course.priceInCents ? course.priceInCents / 100 : 0);
            setIsEditingInfo(true);
        }
    };

    const handleSaveInfo = async () => {
        if (!course) return;
        try {
            setSavingInfo(true);
            const updated = await contentService.updateCourse(courseId, {
                description: editDescription,
                priceInCents: Math.round(editPrice * 100),
            });
            setCourse(updated);
            setIsEditingInfo(false);
        } catch {
            alert('No se pudo actualizar la información del curso');
        } finally {
            setSavingInfo(false);
        }
    };

    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newModuleTitle.trim()) return;

        try {
            setCreatingModule(true);
            await contentService.createModule(courseId, { title: newModuleTitle, isPaid: newModulePaid });
            setNewModuleTitle('');
            setNewModulePaid(false);
            setShowModuleModal(false);
            fetchCourse(); // Refresh to show new module
        } catch {
            alert('Failed to create module');
        } finally {
            setCreatingModule(false);
        }
    };

    const handleCreateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLessonTitle.trim() || !showLessonModal) return;

        try {
            setCreatingLesson(true);
            await contentService.createLesson(showLessonModal, { title: newLessonTitle, isPaid: newLessonPaid, isFreePreview: newLessonPreview });
            setNewLessonTitle('');
            setNewLessonPaid(false);
            setNewLessonPreview(false);
            setShowLessonModal(null);
            fetchCourse(); // Refresh
        } catch {
            alert('Failed to create lesson');
        } finally {
            setCreatingLesson(false);
        }
    };

    const handleVideoUpload = async (lessonId: string, file: File) => {
        try {
            setUploadingLessonId(lessonId);
            await contentService.uploadLessonVideo(lessonId, file);
            fetchCourse();
        } catch {
            alert('Failed to upload video');
        } finally {
            setUploadingLessonId(null);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm('Are you sure you want to delete this module? All lessons within it will be deleted.')) return;
        try {
            await contentService.deleteModule(moduleId);
            fetchCourse();
        } catch {
            alert('Failed to delete module');
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('Are you sure you want to delete this lesson?')) return;
        try {
            await contentService.deleteLesson(lessonId);
            fetchCourse();
        } catch {
            alert('Failed to delete lesson');
        }
    };

    const handleRemoveVideo = async (lessonId: string) => {
        if (!confirm('Are you sure you want to remove the video from this lesson?')) return;
        try {
            await contentService.removeLessonVideo(lessonId);
            fetchCourse();
        } catch {
            alert('Failed to remove video');
        }
    };

    const handleTogglePublish = async () => {
        if (!course) return;
        try {
            setLoading(true); // show loading state briefly
            const updatedCourse = await contentService.updateCourse(courseId, {
                isPublished: !course.isPublished
            });
            setCourse(updatedCourse);
        } catch {
            alert('Failed to update course status');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAccessSettings = async () => {
        try {
            setSavingAccess(true);
            const updated = await contentService.updateCourse(courseId, {
                accessScope,
                isPaid: accessScope === 'course' ? courseIsPaid : false,
                previewLimit: previewLimit ?? null,
            });
            setCourse(updated);
            syncAccessState(updated);
        } catch {
            alert('No se pudo actualizar el acceso del curso');
        } finally {
            setSavingAccess(false);
        }
    };

    const handleModuleAccess = async (moduleId: string, isPaid: boolean) => {
        if (accessScope !== 'module') return;
        try {
            await contentService.updateModule(moduleId, { isPaid });
            fetchCourse();
        } catch {
            alert('No se pudo actualizar el acceso del módulo');
        }
    };

    const handleLessonAccess = async (lessonId: string, isPaid: boolean) => {
        if (accessScope !== 'lesson') return;
        try {
            await contentService.updateLesson(lessonId, { isPaid });
            fetchCourse();
        } catch {
            alert('No se pudo actualizar el acceso de la lección');
        }
    };

    const handleLessonPreview = async (lessonId: string, isFreePreview: boolean) => {
        try {
            await contentService.updateLesson(lessonId, { isFreePreview });
            fetchCourse();
        } catch {
            alert('No se pudo marcar la lección como previa gratuita');
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;
    if (error || !course) return <div className="text-center p-12 text-red-400">{error || 'Course not found'}</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{course.title}</h1>
                        <p className="text-slate-400 text-sm">Manage course content and curriculum</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleTogglePublish}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors border ${course.isPublished
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                    >
                        {course.isPublished ? 'Published' : 'Draft'}
                    </button>
                    {/* Potential Edit button here */}
                </div>
            </div>

            {/* Course Overview Card - Editable */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">Información del curso</h3>
                    {!isEditingInfo ? (
                        <button
                            onClick={handleStartEditing}
                            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            <Edit2 size={16} /> Editar
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditingInfo(false)}
                                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={16} /> Cancelar
                            </button>
                            <button
                                onClick={handleSaveInfo}
                                disabled={savingInfo}
                                className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors disabled:opacity-60"
                            >
                                {savingInfo ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Guardar
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-6">
                    <div className="w-48 h-28 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {course.thumbnailUrl ? (
                            <Image src={course.thumbnailUrl} alt="Thumbnail" fill className="object-cover" sizes="192px" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-600"><Video size={32} /></div>
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        {isEditingInfo ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Descripción</label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 h-20 text-sm"
                                        placeholder="Describe el contenido del curso..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Precio (COP)</label>
                                    <div className="relative w-48">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                        <input
                                            type="number"
                                            min={0}
                                            step={1000}
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(Number(e.target.value))}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                                            placeholder="50000"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Deja en 0 si es un curso gratuito.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Descripción</span>
                                    <p className="text-slate-300 text-sm mt-1">{course.description || 'Sin descripción.'}</p>
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Precio</span>
                                        <p className="text-white font-semibold mt-1">
                                            {course.priceInCents && course.priceInCents > 0
                                                ? `$${(course.priceInCents / 100).toLocaleString('es-CO')} COP`
                                                : 'Gratis'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Módulos</span>
                                        <p className="text-white font-semibold mt-1">{course.modules?.length || 0}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Estado</span>
                                        <p className={`font-semibold mt-1 ${course.isPublished ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                            {course.isPublished ? 'Publicado' : 'Borrador'}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Access control */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Acceso y pagos</h3>
                        <p className="text-sm text-slate-400">Define si el curso es libre, por módulo o por lección.</p>
                    </div>
                    <button
                        onClick={handleSaveAccessSettings}
                        disabled={savingAccess}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {savingAccess && <Loader2 className="animate-spin" size={16} />}
                        Guardar
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Modo de control</label>
                        <select
                            value={accessScope}
                            onChange={(e) => setAccessScope(e.target.value as 'course' | 'module' | 'lesson')}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="course">Curso completo (un solo pago)</option>
                            <option value="module">Por módulos</option>
                            <option value="lesson">Por lecciones/videos</option>
                        </select>
                    </div>

                    {accessScope === 'course' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Modalidad</label>
                                <button
                                    type="button"
                                    onClick={() => setCourseIsPaid(!courseIsPaid)}
                                    className={`w-full px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${courseIsPaid
                                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                                        : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                                        }`}
                                >
                                    {courseIsPaid ? 'De Pago (Premium)' : 'Gratuito (Libre)'}
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Videos gratis de prueba</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    value={previewLimit ?? 0}
                                    onChange={(e) => setPreviewLimit(Number(e.target.value))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Ej: 3"
                                />
                                <p className="text-xs text-slate-500">Recomendado: 3-4 videos libres.</p>
                            </div>
                        </>
                    )}

                    {accessScope !== 'course' && (
                        <div className="md:col-span-2 bg-slate-900/40 border border-slate-700 rounded-lg p-3 text-sm text-slate-300">
                            {accessScope === 'module'
                                ? 'Marca qué módulos serán de pago. Los no marcados quedan libres.'
                                : 'Marca qué lecciones serán de pago y cuáles serán previews gratuitas.'}
                        </div>
                    )}
                </div>
            </div>

            {/* Curriculum Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Curriculum</h2>
                    <button
                        onClick={() => setShowModuleModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> Add Module
                    </button>
                </div>

                <div className="space-y-4">
                    {course.modules?.map((module: Module) => (
                        <div key={module.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="p-4 bg-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-700 rounded-lg text-slate-300">
                                        <ChevronDown size={20} />
                                    </div>
                                    <h3 className="font-semibold text-white">{module.title}</h3>
                                    <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded ml-2">{module.lessons?.length || 0} Lessons</span>
                                    {accessScope === 'module' && (
                                        <span className={`text-xs px-2 py-1 rounded ${module.isPaid ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/40'}`}>
                                            {module.isPaid ? 'Módulo de pago' : 'Libre'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {accessScope === 'module' && (
                                        <button
                                            onClick={() => handleModuleAccess(module.id, !module.isPaid)}
                                            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-900 hover:bg-slate-800 transition-colors"
                                        >
                                            {module.isPaid ? 'Marcar libre' : 'Marcar de pago'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowLessonModal(module.id)}
                                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Lesson
                                    </button>
                                    <button
                                        onClick={() => handleDeleteModule(module.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                        title="Delete Module"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Lessons List */}
                            <div className="divide-y divide-slate-700/50">
                                {module.lessons?.map((lesson) => (
                                    <div key={lesson.id} className="p-4 pl-14 hover:bg-slate-700/20 transition-colors flex justify-between items-center group">
                                        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                                            <div className={`p-2 rounded-full flex-shrink-0 ${lesson.videoUrl ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-500'}`}>
                                                <PlayCircle size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-medium text-slate-200 truncate">{lesson.title}</h4>
                                                {lesson.videoUrl && (
                                                    <span className="text-xs text-emerald-500 flex items-center gap-1 mt-0.5">
                                                        Video Uploaded
                                                    </span>
                                                )}
                                                {accessScope === 'lesson' && (
                                                    <div className="flex gap-2 mt-1">
                                                        <span className={`text-[11px] px-2 py-0.5 rounded ${lesson.isPaid ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/40' : 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/40'}`}>
                                                            {lesson.isPaid ? 'De pago' : 'Libre'}
                                                        </span>
                                                        {lesson.isFreePreview && (
                                                            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-200 border border-sky-500/40">
                                                                Preview gratis
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {accessScope === 'lesson' && (
                                                <>
                                                    <button
                                                        onClick={() => handleLessonAccess(lesson.id, !lesson.isPaid)}
                                                        className="text-xs font-medium w-28 py-1.5 rounded-lg border border-slate-600 bg-slate-900 hover:bg-slate-800 transition-colors text-center"
                                                    >
                                                        {lesson.isPaid ? 'Marcar libre' : 'Marcar de pago'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleLessonPreview(lesson.id, !lesson.isFreePreview)}
                                                        className="text-xs font-medium w-28 py-1.5 rounded-lg border border-slate-600 bg-slate-900 hover:bg-slate-800 transition-colors text-center"
                                                    >
                                                        {lesson.isFreePreview ? 'Quitar preview' : 'Preview gratis'}
                                                    </button>
                                                </>
                                            )}
                                            <div className="relative w-32">
                                                <input
                                                    type="file"
                                                    id={`upload-${lesson.id}`}
                                                    className="hidden"
                                                    accept="video/*"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) handleVideoUpload(lesson.id, e.target.files[0]);
                                                        e.target.value = ''; // Reset input to allow re-upload
                                                    }}
                                                    disabled={uploadingLessonId === lesson.id}
                                                />
                                                <label
                                                    htmlFor={`upload-${lesson.id}`}
                                                    className={`cursor-pointer flex items-center justify-center gap-2 w-full py-1.5 rounded-lg border text-xs font-medium transition-all ${lesson.videoUrl
                                                        ? 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'
                                                        : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                                                        }`}
                                                >
                                                    {uploadingLessonId === lesson.id ? (
                                                        <>
                                                            <Loader2 size={14} className="animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UploadCloud size={14} />
                                                            {lesson.videoUrl ? 'Replace' : 'Upload Video'}
                                                        </>
                                                    )}
                                                </label>
                                            </div>

                                            <div className="flex items-center w-16 justify-end gap-1">
                                                {lesson.videoUrl && (
                                                    <button
                                                        onClick={() => handleRemoveVideo(lesson.id)}
                                                        className="p-1.5 text-slate-500 hover:text-yellow-400 transition-colors"
                                                        title="Remove Video"
                                                    >
                                                        <Video size={14} className="line-through" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteLesson(lesson.id)}
                                                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Lesson"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                                {(!module.lessons || module.lessons.length === 0) && (
                                    <div className="p-4 text-center text-sm text-slate-500 italic">
                                        No lessons yet. Click ‘Add Lesson’ to start.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {(!course.modules || course.modules.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
                            <p className="text-slate-400 mb-2">No modules yet</p>
                            <p className="text-sm text-slate-500">Modules organize your lessons into sections.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Module Modal */}
            {
                showModuleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-4">Add New Module</h3>
                            <form onSubmit={handleCreateModule}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Module Title (e.g. Introduction)"
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white mb-4 focus:ring-2 focus:ring-indigo-500 border"
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                />
                                {accessScope === 'module' && (
                                    <label className="flex items-center gap-2 text-sm text-slate-300 mb-4">
                                        <input
                                            type="checkbox"
                                            checked={newModulePaid}
                                            onChange={(e) => setNewModulePaid(e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        Marcar este módulo como de pago
                                    </label>
                                )}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModuleModal(false)}
                                        className="px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creatingModule}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2"
                                    >
                                        {creatingModule && <Loader2 size={16} className="animate-spin" />}
                                        Create Module
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Add Lesson Modal */}
            {
                showLessonModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-4">Add New Lesson</h3>
                            <form onSubmit={handleCreateLesson}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Lesson Title (e.g. What is Interpreting?)"
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white mb-4 focus:ring-2 focus:ring-indigo-500 border"
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                />
                                {accessScope === 'lesson' && (
                                    <div className="space-y-2 mb-4">
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={newLessonPaid}
                                                onChange={(e) => setNewLessonPaid(e.target.checked)}
                                                className="h-4 w-4"
                                            />
                                            Lección de pago
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={newLessonPreview}
                                                onChange={(e) => setNewLessonPreview(e.target.checked)}
                                                className="h-4 w-4"
                                            />
                                            Disponible como preview gratuita
                                        </label>
                                    </div>
                                )}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowLessonModal(null)}
                                        className="px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creatingLesson}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2"
                                    >
                                        {creatingLesson && <Loader2 size={16} className="animate-spin" />}
                                        Create Lesson
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
