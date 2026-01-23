'use client';

import { useState, useEffect } from 'react';
import { BarChart3, ExternalLink, TrendingUp, Users, Clock, Activity, Globe, Monitor, Link as LinkIcon, FileText } from 'lucide-react';
import { AdminAnalyticsChart } from '@/components/admin/AdminAnalyticsChart';
import { AdminStatCard } from '@/components/admin/AdminStatCard';

const POSTHOG_HOST = 'https://us.posthog.com';
const POSTHOG_PROJECT_ID = '275150';

interface DashboardStats {
    pageviews: { total: number; chart: any[] };
    uniques: { total: number };
    sessionStats: {
        avgDuration: number;
        bounceRate: number;
        count?: number;
    };
    topPages: Array<{ path: string; visitors: number; views: number }>;
    topSources: Array<{ source: string; visitors: number; views: number }>;
    devices: Array<{ name: string; visitors: number; views: number }>;
    geo: Array<{ country: string; count: number }>;
    debug?: any;
}

import { DateRangeSelector } from '@/components/admin/DateRangeSelector';

export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('-7d');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/analytics?from=${dateRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                    if (data.pageviews?.chart) {
                        setAnalyticsData(data.pageviews.chart.map((item: any) => ({
                            labels: item.label,
                            data: item.value
                        })));
                    }
                }
            } catch (error) {
                console.error('Failed to load analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [dateRange]);

    const formatDuration = (seconds?: number) => {
        if (seconds === undefined || seconds === null) return '0m 0s';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Business Intelligence</h1>
                        <p className="text-slate-400 text-sm">Visión completa del rendimiento del negocio</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <DateRangeSelector value={dateRange} onChange={setDateRange} />

                    <a
                        href={`${POSTHOG_HOST}/project/${POSTHOG_PROJECT_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">PostHog Avanzado</span>
                        <span className="sm:hidden">PostHog</span>
                    </a>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <AdminStatCard
                    title="Visitantes (Usuarios)"
                    value={stats?.uniques?.total?.toLocaleString() || '0'}
                    icon={Users}
                    color="text-blue-400 bg-blue-400/10 border-blue-400/20"
                    loading={loading}
                    trend="Únicos"
                    trendUp={true}
                />
                <AdminStatCard
                    title="Vistas de Página"
                    value={stats?.pageviews?.total?.toLocaleString() || '0'}
                    icon={FileText}
                    color="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                    loading={loading}
                    trend="Total"
                    trendUp={true}
                />
                <AdminStatCard
                    title="Sesiones Totales"
                    value={stats?.sessionStats?.count?.toLocaleString() || '0'}
                    icon={Activity}
                    color="text-indigo-400 bg-indigo-400/10 border-indigo-400/20"
                    loading={loading}
                    trend="Interacciones"
                    trendUp={true}
                />
                <AdminStatCard
                    title="Duración Sesión"
                    value={formatDuration(stats?.sessionStats?.avgDuration)}
                    icon={Clock}
                    color="text-purple-400 bg-purple-400/10 border-purple-400/20"
                    loading={loading}
                    trend="Promedio"
                    trendUp={true}
                />
                <AdminStatCard
                    title="Tasa de Rebote"
                    value={`${(stats?.sessionStats?.bounceRate || 0).toFixed(1)}%`}
                    icon={TrendingUp}
                    color="text-orange-400 bg-orange-400/10 border-orange-400/20"
                    loading={loading}
                    trend="Retención"
                    trendUp={(stats?.sessionStats?.bounceRate || 0) < 50} // Good if low
                />
            </div>

            {/* Main Traffic Chart */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-slate-400" />
                    Tendencia de Tráfico
                </h3>
                <AdminAnalyticsChart data={analyticsData} loading={loading} />
            </div>

            {/* Detailed Breakdowns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Top Pages Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-blue-400" /> Páginas Más Visitadas
                    </h3>
                    <div className="flex-1 overflow-auto max-h-[400px] custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 border-b border-slate-800">
                                    <th className="py-3 px-4 font-medium uppercase tracking-wider">Ruta (Path)</th>
                                    <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">Visitantes</th>
                                    <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">Vistas</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-b border-slate-800/50 animate-pulse">
                                            <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-48"></div></td>
                                            <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-12 ml-auto"></div></td>
                                            <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-12 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : stats?.topPages?.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-slate-400">No hay datos disponibles.</td>
                                    </tr>
                                ) : (
                                    stats?.topPages?.map((page, i) => (
                                        <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="text-indigo-400 font-mono text-xs">{page.path}</div>
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium text-white">
                                                {(page.visitors || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium text-emerald-400">
                                                {(page.views || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Sources */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <LinkIcon size={18} className="text-emerald-400" /> Canales de Tráfico
                    </h3>
                    <div className="flex-1 overflow-auto max-h-[300px] custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 border-b border-slate-800">
                                    <th className="py-3 px-2 font-medium uppercase tracking-wider">Fuente</th>
                                    <th className="py-3 px-2 font-medium uppercase tracking-wider text-right">Visitas</th>
                                    <th className="py-3 px-2 font-medium uppercase tracking-wider text-right">Vistas</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? <tr className="animate-pulse"><td colSpan={3} className="h-20 bg-slate-800/50"></td></tr> :
                                    stats?.topSources?.length === 0 ? <tr><td colSpan={3} className="p-4 text-slate-400 text-center">Sin datos.</td></tr> :
                                        stats?.topSources?.map((src, i) => (
                                            <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
                                                <td className="py-3 px-2 text-slate-300 truncate max-w-[150px]">{src.source}</td>
                                                <td className="py-3 px-2 text-right text-white font-medium">{(src.visitors || 0).toLocaleString()}</td>
                                                <td className="py-3 px-2 text-right text-emerald-400 font-medium">{(src.views || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Geo Distribution (Kept as list/bar for visualization) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-purple-400" /> Ubicación Geográfica
                    </h3>
                    <div className="flex-1 overflow-auto max-h-[300px] custom-scrollbar space-y-3">
                        {loading ? <div className="animate-pulse h-20 bg-slate-800/50 rounded-lg"></div> :
                            stats?.geo?.length === 0 ? <p className="text-slate-400 text-sm">No hay datos geográficos disponibles.</p> :
                                stats?.geo?.map((g, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30 border border-slate-800 hover:bg-slate-800/50 transition">
                                        <span className="text-sm text-slate-300">{g.country}</span>
                                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                                            <div className="absolute top-0 left-0 h-full bg-purple-500" style={{ width: `${Math.min((g.count / (stats?.uniques?.total || 1)) * 100, 100)}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 w-8 text-right">{g.count}</span>
                                    </div>
                                ))}
                    </div>
                </div>

                {/* Device Breakdown (Table) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Monitor size={18} className="text-orange-400" /> Dispositivos
                    </h3>
                    <div className="flex-1 overflow-auto max-h-[300px] custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 border-b border-slate-800">
                                    <th className="py-3 px-4 font-medium uppercase tracking-wider">Tipo de Dispositivo</th>
                                    <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">Visitantes</th>
                                    <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">Vistas de Página</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? <tr className="animate-pulse"><td colSpan={3} className="h-20 bg-slate-800/50"></td></tr> :
                                    stats?.devices?.length === 0 ? <tr><td colSpan={3} className="p-4 text-slate-400 text-center">Sin datos.</td></tr> :
                                        stats?.devices?.map((d, i) => (
                                            <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
                                                <td className="py-3 px-4 text-slate-300 flex items-center gap-2">
                                                    {d.name === 'Desktop' ? <Monitor size={16} /> : <div className="w-4 h-4 rounded-sm bg-slate-700" />}
                                                    {d.name}
                                                </td>
                                                <td className="py-3 px-4 text-right text-white font-medium">{(d.visitors || 0).toLocaleString()}</td>
                                                <td className="py-3 px-4 text-right text-emerald-400 font-medium">{(d.views || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            {/* Info Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-1">Integración Activa</h4>
                    <p className="text-sm text-slate-400">
                        Los datos se están extrayendo directamente de la API de PostHog.
                        Para análisis más profundos como embudos, grabaciones de sesión o mapas de calor,
                        utiliza el botón "PostHog Avanzado".
                    </p>
                </div>
            </div>
            {/* Debug Info (Only visible if issues occur) */}
            {stats?.debug && (stats.debug.pageviews !== 'OK' || stats.debug.uniques !== 'OK') && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h4 className="font-semibold text-rose-400 mb-2 flex items-center gap-2">
                        <span>⚠️ Errores de Conexión</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            Project: {stats.debug.projectId || 'N/A'}
                        </span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                        <div className={`p-3 rounded border ${stats.debug.pageviews === 'OK' ? 'border-green-900 bg-green-900/10 text-green-400' : 'border-rose-900 bg-rose-900/10 text-rose-400'}`}>
                            <strong>Pageviews:</strong> {stats.debug.pageviews}
                        </div>
                        <div className={`p-3 rounded border ${stats.debug.uniques === 'OK' ? 'border-green-900 bg-green-900/10 text-green-400' : 'border-rose-900 bg-rose-900/10 text-rose-400'}`}>
                            <strong>Uniques:</strong> {stats.debug.uniques}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
