import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const ranges = [
    { id: '-24h', name: 'Últimas 24 horas' },
    { id: '-7d', name: 'Últimos 7 días' },
    { id: '-14d', name: 'Últimos 14 días' },
    { id: '-30d', name: 'Últimos 30 días' },
    { id: '-90d', name: 'Últimos 90 días' },
];

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
    return (
        <div className="relative w-56">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar size={16} className="text-slate-400" />
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full appearance-none rounded-xl bg-slate-900 border border-slate-700 py-2.5 pl-10 pr-8 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-slate-800 transition-colors sm:text-sm cursor-pointer"
            >
                {ranges.map((range) => (
                    <option key={range.id} value={range.id} className="bg-slate-800 text-white">
                        {range.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
