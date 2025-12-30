'use client';

import { Bell, Send, Clock, Trash2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { notificationsService, AppNotification } from '@/services/notifications.service';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('News');
    const [isPush, setIsPush] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationsService.getAllNotifications();
            // Sort by priority or date if needed
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!title || !message) return;
        try {
            setSending(true);
            await notificationsService.createNotification({
                title,
                message,
                type: type.toLowerCase(), // 'news', 'update', 'promotion'
                priority: isPush ? 10 : 0,
                sendPush: isPush,
            });

            // Reset form
            setTitle('');
            setMessage('');
            setIsPush(false);
            fetchNotifications(); // Refresh list
        } catch (error) {
            alert('Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await notificationsService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Notification Form */}
            <div className="lg:col-span-1 space-y-6">
                <h2 className="text-2xl font-bold text-white">Send Notification</h2>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. New Feature!"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 h-24"
                            placeholder="Your message here..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                        >
                            <option value="News">General News</option>
                            <option value="Update">System Update</option>
                            <option value="Promotion">Promotion</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="push"
                            checked={isPush}
                            onChange={(e) => setIsPush(e.target.checked)}
                            className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="push" className="text-slate-300 text-sm">Send as Push Notification</label>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        {sending ? 'Sending...' : 'Send Now'}
                    </button>
                </div>
            </div>

            {/* History List */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-white">History</h2>
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="animate-spin text-slate-500" />
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-700">
                            {notifications.map((notif) => (
                                <li key={notif.id} className="p-4 hover:bg-slate-750 transition-colors flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${notif.type === 'promotion' ? 'bg-purple-900/50 text-purple-400' :
                                        notif.type === 'update' ? 'bg-orange-900/50 text-orange-400' :
                                            'bg-blue-900/50 text-blue-400'
                                        }`}>
                                        <Bell size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-bold">{notif.title}</h4>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                {/* Format date real */}
                                                {notif.createdAt && new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-1">{notif.message}</p>
                                        <div className="mt-2 flex gap-2">
                                            <span className="px-2 py-0.5 bg-slate-900 rounded text-xs text-slate-300 border border-slate-700">
                                                {notif.type}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(notif.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            ))}
                            {notifications.length === 0 && (
                                <li className="p-8 text-center text-slate-500">No notifications found.</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
