'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, BookOpen, FileText, TrendingUp, RefreshCw, Activity, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usersService } from '@/services/users.service';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminAnalyticsChart } from '@/components/admin/AdminAnalyticsChart';

interface DashboardStats {
    totalUsers: number;
    totalSubmissions: number;
    totalCourses: number;
    pageviews: number;
    uniques: number;
    recentUsers: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
    }>;
}

export default function AdminDashboard() {
    const { user: currentUser } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        if (!currentUser?.id) return;

        setLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            // 1. Fetch Basic Stats (Parallel)
            const [usersRes, coursesRes] = await Promise.allSettled([
                usersService.getAllUsers(currentUser.id),
                fetch(`${apiUrl}/content/courses`)
            ]);

            // Process Users
            let users: any[] = [];
            if (usersRes.status === 'fulfilled') {
                users = usersRes.value;
            }

            // Process Courses
            let coursesCount = 0;
            if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
                const courses = await coursesRes.value.json();
                coursesCount = Array.isArray(courses) ? courses.length : 0;
            }

            // Sort Users by Date (Newest first)
            const sortedUsers = [...users].sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            // 2. Fetch Advanced Analytics (PostHog via Proxy)
            let pageviews = 0;
            let uniques = 0;
            try {
                const analyticsRes = await fetch('/api/admin/analytics');
                if (analyticsRes.ok) {
                    const data = await analyticsRes.json();

                    pageviews = data.pageviews?.total || 0;
                    uniques = data.uniques?.total || 0;

                    // Process PostHog response to match Recharts format if chart data exists
                    if (data.pageviews?.chart) {
                        setAnalyticsData(data.pageviews.chart.map((item: any) => ({
                            labels: item.label,
                            data: item.value
                        })));
                    }
                }
            } catch (authErr) {
                console.warn('Analytics fetch failed:', authErr);
            }

            setStats({
                totalUsers: users.length,
                totalSubmissions: 0, // Placeholder
                totalCourses: coursesCount,
                pageviews,
                uniques,
                recentUsers: sortedUsers.slice(0, 5).map((u: any) => ({
                    id: u.id,
                    firstName: u.firstName || 'N/A',
                    lastName: u.lastName || '',
                    email: u.email || 'N/A',
                    createdAt: u.createdAt,
                })),
            });

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.id) {
            fetchDashboardData();
        }
    }, [currentUser?.id]);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-8 p-2">
            {/* Header with Glassmorphism */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/50">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Panel Principal</h2>
                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Sistema operativo y monitoreando en tiempo real
                    </p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span>Actualizar Datos</span>
                </button>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-300 flex items-center gap-3">
                    <div className="p-2 bg-rose-500/20 rounded-lg">
                        <Activity size={18} />
                    </div>
                    {error}
                </div>
            )}

            {/* Stats Grid - Modern Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard
                    title="Total Usuarios"
                    value={stats?.totalUsers?.toLocaleString() || '0'}
                    icon={Users}
                    color="text-blue-400 bg-blue-400/10 border-blue-400/20"
                    loading={loading}
                    trend="+12%"
                    trendUp={true}
                />
                <AdminStatCard
                    title="Usuarios Únicos (7d)"
                    value={stats?.uniques?.toLocaleString() || '0'}
                    icon={Users}
                    color="text-indigo-400 bg-indigo-400/10 border-indigo-400/20"
                    loading={loading}
                    trend="Activos"
                    trendUp={true}
                />
                <AdminStatCard
                    title="Cursos Activos"
                    value={stats?.totalCourses?.toLocaleString() || '0'}
                    icon={BookOpen}
                    color="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                    loading={loading}
                    trend="Publicados"
                    trendUp={true}
                />
                <AdminStatCard
                    title="Vistas de Página (7d)"
                    value={stats?.pageviews?.toLocaleString() || '0'}
                    icon={TrendingUp}
                    color="text-orange-400 bg-orange-400/10 border-orange-400/20"
                    loading={loading}
                    trend="Total"
                    trendUp={true}
                />
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Analytics Chart (Takes up 2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminAnalyticsChart data={analyticsData} loading={loading} />

                    {/* Quick Actions Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/users" className="block">
                            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition cursor-pointer group h-full">
                                <div className="flex justify-between mb-2">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Users size={20} /></div>
                                    <ArrowUpRight className="text-slate-600 group-hover:text-white transition" />
                                </div>
                                <h4 className="text-white font-medium">Gestionar Usuarios</h4>
                                <p className="text-slate-500 text-sm">Ver detalles y permisos</p>
                            </div>
                        </Link>

                        <Link href="/admin/courses" className="block">
                            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition cursor-pointer group h-full">
                                <div className="flex justify-between mb-2">
                                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><BookOpen size={20} /></div>
                                    <ArrowUpRight className="text-slate-600 group-hover:text-white transition" />
                                </div>
                                <h4 className="text-white font-medium">Gestionar Cursos</h4>
                                <p className="text-slate-500 text-sm">Editar contenido</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Users List (Side Panel) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Usuarios Recientes</h3>
                        <Link href="/admin/users">
                            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium tracking-wide uppercase">Ver Todos</button>
                        </Link>
                    </div>

                    <div className="p-4 space-y-3 overflow-auto max-h-[500px] custom-scrollbar">
                        {loading ? (
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-800/20 animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-slate-800" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-24 bg-slate-800 rounded" />
                                        <div className="h-3 w-32 bg-slate-800 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : stats?.recentUsers && stats.recentUsers.length > 0 ? (
                            stats.recentUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group cursor-default"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-2 ring-slate-800 group-hover:ring-slate-700 transition-all">
                                        {user.firstName?.charAt(0) || '?'}{user.lastName?.charAt(0) || ''}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-200 font-medium truncate text-sm">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-slate-500 text-xs truncate">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-600 text-[10px] font-medium bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-center p-4">
                                <Users size={32} className="mb-2 opacity-20" />
                                <p className="text-sm">No hay usuarios nuevos recientemente</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/50">
                        <button className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors border border-dashed border-slate-700 hover:border-slate-500 rounded-lg">
                            Descargar Reporte CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add simple CSS for custom scrollbar if not present
const style = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent; 
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155; 
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #475569; 
  }
`;
