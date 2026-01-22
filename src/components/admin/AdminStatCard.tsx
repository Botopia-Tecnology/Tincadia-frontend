import { LucideIcon } from 'lucide-react';
import React from 'react';

interface AdminStatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string; // e.g. "+12%" or "-5%"
    trendUp?: boolean; // true for green, false for red
    loading?: boolean;
    color?: string; // Optional accent color class
}

export function AdminStatCard({ title, value, icon: Icon, trend, trendUp, loading, color }: AdminStatCardProps) {
    return (
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 group hover:border-slate-700 transition-all duration-300">
            {/* Background Gradient Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-tincadia-green/10 rounded-full blur-3xl group-hover:bg-tincadia-green/20 transition-all" />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1 tracking-wide">{title}</h3>

                    {loading ? (
                        <div className="h-8 w-24 bg-slate-800 animate-pulse rounded mt-1" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
                            {trend && (
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendUp
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                    {trend}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 ${color ? color : 'text-tincadia-green'}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}
