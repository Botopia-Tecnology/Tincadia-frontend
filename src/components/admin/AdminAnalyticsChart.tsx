'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminAnalyticsChartProps {
    data: any[];
    loading?: boolean;
}

export function AdminAnalyticsChart({ data, loading }: AdminAnalyticsChartProps) {
    // Mock data if empty or loading to show skeleton/placeholder
    const chartData = data && data.length > 0 ? data : [
        { labels: 'Mon', value: 0 },
        { labels: 'Tue', value: 0 },
        { labels: 'Wed', value: 0 },
        { labels: 'Thu', value: 0 },
        { labels: 'Fri', value: 0 },
        { labels: 'Sat', value: 0 },
        { labels: 'Sun', value: 0 },
    ];

    if (loading) {
        return (
            <div className="w-full h-[300px] bg-slate-900 border border-slate-800 rounded-2xl animate-pulse flex items-center justify-center">
                <span className="text-slate-700 font-medium">Cargando métricas...</span>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Actividad de Usuarios</h3>
                <p className="text-slate-500 text-sm">Visitas únicas en los últimos 7 días</p>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#83A98A" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#83A98A" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="labels" // Posthog usually returns 'labels' or 'days'
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                borderColor: '#1e293b',
                                color: '#f8fafc',
                                borderRadius: '8px'
                            }}
                            itemStyle={{ color: '#83A98A' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="data" // Posthog trend data
                            stroke="#83A98A"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
