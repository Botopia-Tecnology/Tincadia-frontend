'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contentService, Course } from '@/services/content.service';
import { ArrowLeft, Plus, Video, Trash2, Edit2, UploadCloud, ChevronDown, ChevronRight, PlayCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Types for local state (extending Course type if needed)
interface Lesson {
    id: string;
    title: string;
    videoUrl?: string;
    durationSeconds?: number;
    order: number;
}

interface Module {
    id: string;
    title: string;
    description?: string;
    lessons: Lesson[];
    order: number;
}

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Module Creation State
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [creatingModule, setCreatingModule] = useState(false);

    // Lesson Creation State
    const [showLessonModal, setShowLessonModal] = useState<string | null>(null); // moduleId if open
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [creatingLesson, setCreatingLesson] = useState(false);

    // Video Upload State
    const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null);

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
        } catch (err) {
            setError('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newModuleTitle.trim()) return;

        try {
            setCreatingModule(true);
            await contentService.createModule(courseId, { title: newModuleTitle });
            setNewModuleTitle('');
            setShowModuleModal(false);
            fetchCourse(); // Refresh to show new module
        } catch (error) {
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
            await contentService.createLesson(showLessonModal, { title: newLessonTitle });
            setNewLessonTitle('');
            setShowLessonModal(null);
            fetchCourse(); // Refresh
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            alert('Failed to delete module');
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('Are you sure you want to delete this lesson?')) return;
        try {
            await contentService.deleteLesson(lessonId);
            fetchCourse();
        } catch (error) {
            alert('Failed to delete lesson');
        }
    };

    const handleRemoveVideo = async (lessonId: string) => {
        if (!confirm('Are you sure you want to remove the video from this lesson?')) return;
        try {
            await contentService.removeLessonVideo(lessonId);
            fetchCourse();
        } catch (error) {
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
        } catch (error) {
            alert('Failed to update course status');
        } finally {
            setLoading(false);
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

            {/* Course Overview Card */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex gap-6">
                <div className="w-48 h-28 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {course.thumbnailUrl ? (
                        <img src={course.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-600"><Video size={32} /></div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">About this course</h3>
                    <p className="text-slate-400 text-sm mb-4">{course.description || 'No description provided.'}</p>
                    <div className="flex gap-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        <span>{course.modules?.length || 0} Modules</span>
                        <span>{course.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
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
                                </div>
                                <div className="flex items-center gap-3">
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
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${lesson.videoUrl ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-500'}`}>
                                                <PlayCircle size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-200">{lesson.title}</h4>
                                                {lesson.videoUrl && (
                                                    <span className="text-xs text-emerald-500 flex items-center gap-1 mt-0.5">
                                                        Video Uploaded
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="relative">
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
                                                    className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${lesson.videoUrl
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
                                                            {lesson.videoUrl ? 'Replace Video' : 'Upload Video'}
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
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

                                ))}
                                {(!module.lessons || module.lessons.length === 0) && (
                                    <div className="p-4 text-center text-sm text-slate-500 italic">
                                        No lessons yet. Click "Add Lesson" to start.
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
