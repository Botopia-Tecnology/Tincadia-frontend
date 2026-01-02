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
        <div className="p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-8">
                Gestión de Comunicaciones
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Notification Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Send size={20} className="text-blue-400" />
                            Nueva Comunicación
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    placeholder="Ej: Nueva Funcionalidad!"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Mensaje</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 h-32 resize-none transition-all outline-none"
                                    placeholder="Escribe el contenido de la comunicación..."
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-400">Tipo de Comunicación</label>
                                    <button
                                        onClick={() => setShowManageModal(true)}
                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <Settings size={12} /> Gestionar Tipos
                                    </button>
                                </div>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-3 text-slate-500" size={16} />
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 pl-10 text-white appearance-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    >
                                        <option value="">📰 General (Por defecto)</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                <div className="flex items-start gap-3">
                                    <div className="pt-0.5">
                                        <input
                                            type="checkbox"
                                            id="push"
                                            checked={isPush}
                                            onChange={(e) => setIsPush(e.target.checked)}
                                            className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="push" className="cursor-pointer">
                                        <span className="block text-slate-200 font-medium text-sm">Enviar notificación Push</span>
                                        <span className="block text-slate-500 text-xs mt-0.5">
                                            Se enviará una alerta a todos los dispositivos móviles registrados.
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={sending || !title || !message}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                            >
                                {sending ? <Loader2 className="animate-spin" size={18} /> : <Megaphone size={18} />}
                                {sending ? 'Enviando...' : 'Publicar Comunicación'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Clock size={20} className="text-slate-400" />
                                Historial de Comunicaciones
                            </h2>
                            <span className="text-xs font-medium px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full">
                                {notifications.length} Total
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[600px]">
                            {loading ? (
                                <div className="p-12 flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                    <p className="text-slate-500 text-sm">Cargando historial...</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-700/50">
                                    {notifications.map((notif) => {
                                        // Find category info safely
                                        const cat = notif.category; // Now populated by API
                                        const catLabel = cat?.label || notif.type;
                                        const catColor = cat?.color || '#3b82f6';

                                        return (
                                            <li key={notif.id} className="p-5 hover:bg-slate-700/30 transition-colors group">
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className="p-3 rounded-xl shadow-lg"
                                                        style={{
                                                            backgroundColor: `${catColor}20`, // 20% opacity
                                                            color: catColor,
                                                            border: `1px solid ${catColor}40`
                                                        }}
                                                    >
                                                        <Bell size={24} strokeWidth={1.5} />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="text-white font-semibold text-lg truncate pr-4">{notif.title}</h4>
                                                            <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                                                                {notif.createdAt && new Date(notif.createdAt).toLocaleDateString('es-ES', {
                                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>

                                                        <p className="text-slate-400 text-sm leading-relaxed mb-3">{notif.message}</p>

                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className="px-2.5 py-0.5 rounded text-xs font-medium border"
                                                                style={{
                                                                    backgroundColor: `${catColor}20`,
                                                                    borderColor: `${catColor}40`,
                                                                    color: catColor
                                                                }}
                                                            >
                                                                {catLabel}
                                                            </span>

                                                            {notif.priority > 0 && (
                                                                <span className="flex items-center gap-1 text-xs text-green-400 font-medium bg-green-900/20 px-2 py-0.5 rounded border border-green-900/30">
                                                                    <Send size={10} /> Push Enviado
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDelete(notif.id)}
                                                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Eliminar comunicación"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                    {notifications.length === 0 && (
                                        <li className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                                            <Info size={40} strokeWidth={1.5} className="text-slate-600 mb-2" />
                                            <p className="font-medium text-slate-400">No hay comunicaciones registradas</p>
                                            <p className="text-sm">Envía tu primera notificación usando el formulario.</p>
                                        </li>
                                    )}
                                </ul>
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
