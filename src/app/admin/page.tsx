'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, TrendingUp, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usersService } from '@/services/users.service';

interface DashboardStats {
    totalUsers: number;
    totalSubmissions: number;
    totalCourses: number;
    recentUsers: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
    }>;
}

const StatCard = ({ title, value, icon: Icon, color, loading }: any) => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                {loading ? (
                    <div className="h-8 w-20 bg-slate-700 animate-pulse rounded" />
                ) : (
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                )}
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const { user: currentUser } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        if (!currentUser?.id) return;

        setLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            // Fetch users using the service (with proper auth)
            let users: any[] = [];
            try {
                users = await usersService.getAllUsers(currentUser.id);
            } catch (e) {
                console.warn('Could not fetch users:', e);
            }

            // Fetch form submissions
            const submissionsResponse = await fetch(`${apiUrl}/forms/submissions`);
            let submissions: any[] = [];
            if (submissionsResponse.ok) {
                submissions = await submissionsResponse.json();
            }

            // Fetch courses
            let courses: any[] = [];
            try {
                const coursesResponse = await fetch(`${apiUrl}/content/courses`);
                if (coursesResponse.ok) {
                    courses = await coursesResponse.json();
                }
            } catch (e) {
                console.warn('Could not fetch courses:', e);
            }

            setStats({
                totalUsers: users.length,
                totalSubmissions: Array.isArray(submissions) ? submissions.length : 0,
                totalCourses: Array.isArray(courses) ? courses.length : 0,
                recentUsers: users.slice(0, 5).map((u: any) => ({
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Resumen del Panel</h2>
                    <p className="text-slate-400 mt-2">Bienvenido al Panel de Control de Tincadia.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Actualizar
                </button>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Usuarios"
                    value={stats?.totalUsers?.toLocaleString() || '0'}
                    icon={Users}
                    color="bg-blue-500"
                    loading={loading}
                />
                <StatCard
                    title="Formularios Recibidos"
                    value={stats?.totalSubmissions?.toLocaleString() || '0'}
                    icon={FileText}
                    color="bg-indigo-500"
                    loading={loading}
                />
                <StatCard
                    title="Cursos"
                    value={stats?.totalCourses?.toLocaleString() || '0'}
                    icon={BookOpen}
                    color="bg-emerald-500"
                    loading={loading}
                />
                <StatCard
                    title="Métricas"
                    value="Próximamente"
                    icon={TrendingUp}
                    color="bg-orange-500"
                    loading={false}
                />
            </div>

            {/* Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Usuarios Recientes</h3>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-slate-700 animate-pulse rounded" />
                            ))}
                        </div>
                    ) : stats?.recentUsers && stats.recentUsers.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user.firstName?.charAt(0) || '?'}{user.lastName?.charAt(0) || ''}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-slate-400 text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-slate-500 text-xs">
                                        {formatDate(user.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                            No hay usuarios registrados
                        </div>
                    )}
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Resumen Rápido</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-900/50 rounded-lg">
                            <p className="text-slate-400 text-sm">Usuarios Registrados</p>
                            <p className="text-2xl font-bold text-white mt-1">
                                {loading ? '...' : stats?.totalUsers || 0}
                            </p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-lg">
                            <p className="text-slate-400 text-sm">Solicitudes de Bolsa de Trabajo</p>
                            <p className="text-2xl font-bold text-white mt-1">
                                {loading ? '...' : stats?.totalSubmissions || 0}
                            </p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-lg border-l-4 border-blue-500">
                            <p className="text-slate-400 text-sm">Próximas Funcionalidades</p>
                            <p className="text-white mt-1">
                                Estadísticas de cursos, ingresos y más métricas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
