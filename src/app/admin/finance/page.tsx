'use client';

import { DollarSign, TrendingUp, CreditCard, Download, Loader2, Calendar, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { financeService, Payment, Subscription } from '@/services/finance.service';

const STATUS_COLORS: Record<string, string> = {
    APPROVED: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    DECLINED: 'bg-red-500/10 text-red-500 border border-red-500/20',
    ERROR: 'bg-red-500/10 text-red-500 border border-red-500/20',
    VOIDED: 'bg-gray-500/10 text-gray-500 border border-gray-500/20',
    active: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    past_due: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    canceled: 'bg-gray-500/10 text-gray-500 border border-gray-500/20',
};

export default function FinancePage() {
    const [activeView, setActiveView] = useState<'transactions' | 'subscriptions'>('transactions');
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [activeSubscriptionsCount, setActiveSubscriptionsCount] = useState(0);

    // Filters
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, [activeView, statusFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeView === 'transactions') {
                const data = await financeService.getAllPayments({ status: statusFilter });
                setTransactions(data.items || []);

                // Calculate pseudo revenue
                const revenue = (data.items || []).reduce((acc, curr) =>
                    curr.status === 'APPROVED' ? acc + Number(curr.amountInCents || 0) : acc, 0
                );
                setTotalRevenue(revenue / 100);
            } else {
                const data = await financeService.getAllSubscriptions({ status: statusFilter });
                setSubscriptions(data.items || []);
                // Update active count
                const active = (data.items || []).filter(s => s.status === 'active').length;
                setActiveSubscriptionsCount(active);
            }
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        if (isNaN(amount)) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'COP' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Finanzas & Suscripciones</h2>
                    <p className="text-gray-400 text-sm mt-1">Monitorea los ingresos y suscripciones activas</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700">
                        <Download size={18} />
                        Exportar
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Ingresos Totales (Vista Actual)</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {formatCurrency(totalRevenue)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <TrendingUp size={14} className="text-emerald-400" />
                        <span>Calculado de transacciones aprobadas</span>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Suscripciones Activas</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {activeView === 'subscriptions' ? activeSubscriptionsCount : '-'}
                            </h3>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                            <CreditCard size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-400">Usuarios con plan vigente</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between gap-4">
                    {/* View Switcher */}
                    <div className="flex bg-gray-900 rounded-lg p-1 w-fit">
                        <button
                            onClick={() => setActiveView('transactions')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'transactions'
                                ? 'bg-gray-700 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Transacciones
                        </button>
                        <button
                            onClick={() => setActiveView('subscriptions')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'subscriptions'
                                ? 'bg-gray-700 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Suscripciones
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                            >
                                <option value="all">Todos los estados</option>
                                <option value={activeView === 'transactions' ? 'APPROVED' : 'active'}>
                                    {activeView === 'transactions' ? 'Aprobado' : 'Activo'}
                                </option>
                                <option value={activeView === 'transactions' ? 'PENDING' : 'past_due'}>
                                    {activeView === 'transactions' ? 'Pendiente' : 'Vencido'}
                                </option>
                                <option value={activeView === 'transactions' ? 'DECLINED' : 'canceled'}>
                                    {activeView === 'transactions' ? 'Rechazado' : 'Cancelado'}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Referencia / Wompi ID</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Fecha / Periodo</th>
                                    <th className="px-6 py-4">Monto</th>
                                    <th className="px-6 py-4">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {activeView === 'transactions' ? (
                                    transactions.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">No se encontraron transacciones.</td></tr>
                                    ) : (
                                        transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-300 text-xs font-mono">{tx.reference?.substring(0, 15)}...</div>
                                                    {tx.wompiTransactionId && (
                                                        <div className="text-emerald-500/80 text-[10px] font-mono mt-0.5" title="Wompi ID">
                                                            {tx.wompiTransactionId}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-medium text-sm">{tx.customerName || 'N/A'}</div>
                                                    <div className="text-gray-500 text-xs">{tx.customerEmail}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300 text-sm font-medium">{tx.plan?.replace(/_/g, ' ')}</td>
                                                <td className="px-6 py-4 text-gray-400 text-sm">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-white font-mono text-sm">
                                                    {formatCurrency((tx.amountInCents || 0) / 100)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[tx.status] || 'bg-gray-500/10 text-gray-400'}`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    subscriptions.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">No se encontraron suscripciones.</td></tr>
                                    ) : (
                                        subscriptions.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 text-gray-400 text-xs font-mono">{sub.id.substring(0, 8)}...</td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    <div className="font-mono text-xs">{sub.userId.substring(0, 8)}...</div>
                                                </td>
                                                <td className="px-6 py-4 text-white font-medium">
                                                    {sub.plan?.name || 'Premium'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 text-sm">
                                                    Vence: {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-white font-mono text-sm">
                                                    {formatCurrency((sub.amountCents || 0) / 100)}
                                                    <span className="text-gray-500 text-xs ml-1">/mes</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${STATUS_COLORS[sub.status] || 'bg-gray-500/10 text-gray-400'}`}>
                                                        {sub.status}
                                                    </span>
                                                    {sub.cancelAtPeriodEnd && (
                                                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                            Cancela al final
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
