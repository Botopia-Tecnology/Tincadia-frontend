'use client';

import { Bell, Send, Clock, Trash2, Loader2, Megaphone, Info, Tag, Settings, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { notificationsService, AppNotification, NotificationCategory } from '@/services/notifications.service';
import ManageCategoriesModal from './ManageCategoriesModal';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [categories, setCategories] = useState<NotificationCategory[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [type, setType] = useState('news'); // Fallback type
    const [isPush, setIsPush] = useState(false);
    const [sending, setSending] = useState(false);

    // Modal State
    const [showManageModal, setShowManageModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [notifsData, catsData] = await Promise.all([
                notificationsService.getAllNotifications(),
                notificationsService.getCategories()
            ]);
            setNotifications(notifsData);
            setCategories(catsData);

            // Set default category if available
            if (catsData.length > 0 && !selectedCategoryId) {
                setSelectedCategoryId(catsData[0].id);
            }
        } catch (error) {
            console.error('Error al cargar datos', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshCategories = async () => {
        const cats = await notificationsService.getCategories();
        setCategories(cats);
    };

    const handleSend = async () => {
        if (!title || !message) return;
        try {
            setSending(true);
            // Find selected category to get fallback type name
            const selectedCat = categories.find(c => c.id === selectedCategoryId);

            await notificationsService.createNotification({
                title,
                message,
                categoryId: selectedCategoryId,
                type: 'news', // Strict Type for DB Constraint
                priority: isPush ? 10 : 0,
                sendPush: isPush,
            });

            // Reset form
            setTitle('');
            setMessage('');
            setIsPush(false);
            fetchData(); // Refresh list
        } catch (error) {
            alert('Error al enviar la notificación');
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta notificación?')) return;
        try {
            await notificationsService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Centro de Comunicaciones
                </h1>
                <p className="text-slate-400 text-lg">Gestiona y envía notificaciones a todos tus usuarios.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create Notification Form - Takes up 4 columns */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                        {/* Decorative gradient blob */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-1000"></div>

                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/20">
                                <Send size={22} />
                            </div>
                            Nueva Comunicación
                        </h2>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Título del Mensaje</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                                    placeholder="Ej: ¡Nueva Actualización Disponible!"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Contenido</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 h-32 resize-none transition-all outline-none"
                                    placeholder="Escribe aquí tu mensaje..."
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-medium text-slate-300">Categoría</label>
                                    <button
                                        onClick={() => setShowManageModal(true)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium hover:underline transition-all"
                                    >
                                        <Settings size={12} /> Gestionar
                                    </button>
                                </div>
                                <div className="relative group/select">
                                    <Tag className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within/select:text-indigo-400 transition-colors" size={18} />
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3.5 pl-11 text-white appearance-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none cursor-pointer"
                                    >
                                        <option value="">📰 General (Por defecto)</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-500">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-900/10 rounded-xl border border-indigo-500/20 hover:bg-indigo-900/20 transition-colors cursor-pointer" onClick={() => setIsPush(!isPush)}>
                                <div className="flex items-start gap-4">
                                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPush ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 bg-transparent'}`}>
                                        {isPush && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-white font-medium text-sm">Notificación Push</span>
                                        <span className="block text-indigo-200/60 text-xs mt-1 leading-relaxed">
                                            Envía una alerta instantánea a los dispositivos móviles de todos los usuarios.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={sending || !title || !message}
                                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98] mt-4"
                            >
                                {sending ? <Loader2 className="animate-spin" size={20} /> : <Megaphone size={20} />}
                                {sending ? 'Enviando...' : 'Publicar Ahora'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* History List - Takes up 8 columns */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[700px] overflow-hidden relative">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md sticky top-0 z-20">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Clock size={18} className="text-indigo-400" />
                                Historial Reciente
                            </h2>
                            <span className="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-white/5">
                                {notifications.length} Mensajes
                            </span>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                                    <p className="text-sm font-medium">Sincronizando historial...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.map((notif) => {
                                        const cat = notif.category;
                                        const catLabel = cat?.label || notif.type;
                                        const catColor = cat?.color || '#6366f1'; // Default Indigo

                                        return (
                                            <div
                                                key={notif.id}
                                                className="group relative bg-slate-950/40 hover:bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
                                            >
                                                <div className="flex items-start gap-5">
                                                    {/* Category Icon Box */}
                                                    <div
                                                        className="p-3.5 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-105 duration-300 shadow-inner"
                                                        style={{
                                                            backgroundColor: `${catColor}15`, // 15% opacity bg
                                                            color: catColor
                                                        }}
                                                    >
                                                        <Bell size={24} strokeWidth={2} />
                                                    </div>

                                                    <div className="flex-1 min-w-0 pt-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="text-white font-bold text-lg truncate pr-8 group-hover:text-indigo-200 transition-colors">
                                                                {notif.title}
                                                            </h4>
                                                            <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap bg-slate-950 px-2.5 py-1 rounded-lg border border-white/5">
                                                                {notif.createdAt && new Date(notif.createdAt).toLocaleDateString('es-ES', {
                                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>

                                                        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-slate-300 transition-colors">
                                                            {notif.message}
                                                        </p>

                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border mb-0.5 inline-block"
                                                                style={{
                                                                    borderColor: `${catColor}30`,
                                                                    color: catColor,
                                                                    backgroundColor: `${catColor}10`
                                                                }}
                                                            >
                                                                {catLabel}
                                                            </span>

                                                            {notif.priority > 0 && (
                                                                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                                                                    <Send size={10} /> Push Enviado
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDelete(notif.id)}
                                                        className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {notifications.length === 0 && (
                                        <div className="py-20 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                                <Info size={32} className="text-slate-600" />
                                            </div>
                                            <h3 className="text-white font-medium text-lg">Sin comunicaciones</h3>
                                            <p className="text-slate-500 text-sm max-w-xs mt-2">
                                                No has enviado ninguna comunicación todavía. ¡Crea la primera ahora!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ManageCategoriesModal
                isOpen={showManageModal}
                onClose={() => setShowManageModal(false)}
                onUpdate={refreshCategories}
            />
        </div>
    );
}
