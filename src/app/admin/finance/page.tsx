'use client';

import { DollarSign, TrendingUp, CreditCard, Download, Loader2, Calendar, Filter, Search, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { financeService, Payment, Subscription } from '@/services/finance.service';

const STATUS_COLORS: Record<string, string> = {
    APPROVED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    PENDING: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    DECLINED: 'bg-red-500/10 text-red-400 border border-red-500/20',
    ERROR: 'bg-red-500/10 text-red-400 border border-red-500/20',
    VOIDED: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    past_due: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    canceled: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
};

export default function FinancePage() {
    const [activeView, setActiveView] = useState<'transactions' | 'subscriptions'>('transactions');
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [activeSubscriptionsCount, setActiveSubscriptionsCount] = useState(0);

    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal
    const [selectedTransaction, setSelectedTransaction] = useState<Payment | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load ALL data initially to ensure KPIs are correct and client-side filtering works
            const [txData, subData] = await Promise.all([
                financeService.getAllPayments(),
                financeService.getAllSubscriptions()
            ]);

            const txItems = txData.items || [];
            const subItems = subData.items || [];

            setTransactions(txItems);
            setSubscriptions(subItems);

            // Calculate Metrics
            const revenue = txItems.reduce((acc, curr) =>
                curr.status === 'APPROVED' ? acc + Number(curr.amountInCents || 0) : acc, 0
            );
            setTotalRevenue(revenue / 100);

            const activeSubs = subItems.filter(s => s.status === 'active').length;
            setActiveSubscriptionsCount(activeSubs);

        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const getFilteredData = () => {
        const sourceData = activeView === 'transactions' ? transactions : subscriptions;

        return sourceData.filter(item => {
            // Status Filter
            if (statusFilter !== 'all' && item.status !== statusFilter) return false;

            // Plan Filter
            // @ts-ignore
            const itemName = ((typeof item.plan === 'string' ? item.plan : item.plan?.name) || '').toLowerCase();
            // @ts-ignore
            if (planFilter !== 'all' && !itemName.includes(planFilter.toLowerCase())) return false;

            // Search Term
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                // @ts-ignore
                const searchString = `${item.id} ${item.userId} ${item.reference || ''} ${item.customerEmail || ''}`.toLowerCase();
                if (!searchString.includes(term)) return false;
            }

            return true;
        });
    };

    const filteredItems = getFilteredData();
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatCurrency = (amount: number) => {
        if (isNaN(amount)) return '$0.00';
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Extract Unique Plans for Filter
    const uniquePlans = Array.from(new Set([
        ...transactions.map(t => t.plan),
        ...subscriptions.map(s => s.plan?.name)
    ].filter(Boolean)));

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        Finanzas & Suscripciones
                    </h1>
                    <p className="text-slate-400 text-lg">Control total de ingresos y membresías activas.</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-lg">
                    <Download size={18} />
                    Exportar Informe
                </button>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <p className="text-slate-400 font-medium mb-1">Ingresos Totales (Histórico)</p>
                            <h3 className="text-4xl font-bold text-white tracking-tight">
                                {formatCurrency(totalRevenue)}
                            </h3>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20 shadow-inner">
                            <DollarSign size={28} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-400/80 font-medium relative z-10">
                        <TrendingUp size={16} />
                        <span>Calculado de {transactions.filter(t => t.status === 'APPROVED').length} transacciones exitosas</span>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <p className="text-slate-400 font-medium mb-1">Suscripciones Activas</p>
                            <h3 className="text-4xl font-bold text-white tracking-tight">
                                {activeSubscriptionsCount}
                            </h3>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/20 shadow-inner">
                            <CreditCard size={28} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-400/80 font-medium relative z-10">
                        <CreditCard size={16} />
                        <span>Usuarios con acceso vigente actualmente</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">

                {/* Controls Bar */}
                <div className="p-6 border-b border-white/5 flex flex-col xl:flex-row justify-between gap-6 bg-white/5">
                    {/* View Switcher */}
                    <div className="flex bg-slate-950/50 rounded-xl p-1.5 w-fit border border-white/5">
                        <button
                            onClick={() => { setActiveView('transactions'); setCurrentPage(1); }}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === 'transactions'
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Transacciones
                        </button>
                        <button
                            onClick={() => { setActiveView('subscriptions'); setCurrentPage(1); }}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === 'subscriptions'
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Suscripciones
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 flex-1 justify-end">
                        {/* Search */}
                        <div className="relative min-w-[240px]">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar reference, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>

                        {/* Plan Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                            <select
                                value={planFilter}
                                onChange={(e) => setPlanFilter(e.target.value)}
                                className="bg-slate-950/50 border border-white/10 text-slate-300 text-sm rounded-xl pl-10 pr-8 py-2.5 focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none cursor-pointer hover:bg-slate-900/80 transition-all"
                            >
                                <option value="all">Todos los planes</option>
                                {uniquePlans.map((plan: any) => (
                                    <option key={plan} value={plan}>{plan.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <div className={`absolute top-3.5 left-3 w-2 h-2 rounded-full ${statusFilter === 'all' ? 'bg-slate-500' : 'bg-emerald-500'}`}></div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-slate-950/50 border border-white/10 text-slate-300 text-sm rounded-xl pl-8 pr-8 py-2.5 focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none cursor-pointer hover:bg-slate-900/80 transition-all capitalize"
                            >
                                <option value="all">Todos ({filteredItems.length})</option>
                                {Object.keys(STATUS_COLORS).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="h-full flex flex-col justify-center items-center p-20 gap-4">
                            <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
                            <p className="text-slate-500">Cargando datos financieros...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-950/30 text-slate-400 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-8 py-5">
                                        {activeView === 'transactions' ? 'Referencia / Wompi ID' : 'ID Suscripción / Usuario'}
                                    </th>
                                    <th className="px-6 py-5">Cliente</th>
                                    <th className="px-6 py-5">Plan Adquirido</th>
                                    <th className="px-6 py-5">
                                        {activeView === 'transactions' ? 'Fecha Transacción' : 'Vencimiento'}
                                    </th>
                                    <th className="px-6 py-5 text-right">Monto</th>
                                    <th className="px-6 py-5 text-center">Estado</th>
                                    {activeView === 'transactions' && <th className="px-6 py-5 text-center">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginatedItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Search size={40} className="text-slate-700" />
                                                <p className="text-slate-400 font-medium">No se encontraron resultados</p>
                                                <p className="text-sm text-slate-500">Intenta ajustar los filtros de búsqueda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedItems.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                            {/* ID Column */}
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-slate-200 font-mono text-xs tracking-wide">
                                                        {activeView === 'transactions'
                                                            ? (item.reference || 'N/A').substring(0, 20) + '...'
                                                            : item.id.substring(0, 12) + '...'
                                                        }
                                                    </span>
                                                    {activeView === 'transactions' && item.wompiTransactionId && (
                                                        <span className="text-xs text-emerald-500/60 font-mono flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                                                            {item.wompiTransactionId}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Customer Column */}
                                            <td className="px-6 py-5">
                                                {activeView === 'transactions' ? (
                                                    <div>
                                                        <div className="text-white font-medium text-sm">{item.customerName || 'Cliente Desconocido'}</div>
                                                        <div className="text-slate-500 text-xs">{item.customerEmail}</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-slate-400 font-mono text-xs bg-slate-900/50 px-2 py-1 rounded w-fit border border-white/5">
                                                        User: {item.userId.substring(0, 8)}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Plan Column */}
                                            <td className="px-6 py-5">
                                                <span className="text-slate-300 text-sm font-medium px-2.5 py-1 rounded bg-white/5 border border-white/5">
                                                    {(item.plan || item.plan?.name || 'Standard').replace(/_/g, ' ')}
                                                </span>
                                            </td>

                                            {/* Date Column */}
                                            <td className="px-6 py-5 text-slate-400 text-sm">
                                                {activeView === 'transactions'
                                                    ? formatDate(item.createdAt)
                                                    : formatDate(item.currentPeriodEnd)
                                                }
                                            </td>

                                            {/* Amount Column */}
                                            <td className="px-6 py-5 text-right font-mono text-slate-200">
                                                {formatCurrency((item.amountInCents || item.amountCents || 0) / 100)}
                                            </td>

                                            {/* Status Column */}
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[item.status] || 'bg-slate-500/10 text-slate-400'}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions Column (Transactions Only) */}
                                            {activeView === 'transactions' && (
                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        onClick={() => setSelectedTransaction(item)}
                                                        className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-950/30">
                    <span className="text-sm text-slate-500">
                        Mostrando <span className="text-white font-medium">{paginatedItems.length}</span> de <span className="text-white font-medium">{filteredItems.length}</span> resultados
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Logic for simplified sliding window could go here, for now simple first 5
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                }
                                if (pageNum > totalPages) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                                            : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-white">Detalle de Transacción</h3>
                                <p className="text-slate-400 text-sm mt-0.5 font-mono">{selectedTransaction.reference}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Monto</span>
                                    <p className="text-2xl font-mono text-white mt-1">
                                        {formatCurrency((selectedTransaction.amountInCents || 0) / 100)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Estado</span>
                                    <div className="mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[selectedTransaction.status]}`}>
                                            {selectedTransaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <DetailRow label="Fecha" value={formatDate(selectedTransaction.createdAt)} />
                                <DetailRow label="Wompi ID" value={selectedTransaction.wompiTransactionId || 'N/A'} isMono />
                                <DetailRow label="Plan Adquirido" value={selectedTransaction.plan} />
                                <div className="h-px bg-white/5 my-2"></div>
                                <h4 className="text-sm font-bold text-slate-300">Información del Cliente</h4>
                                <DetailRow label="Nombre" value={selectedTransaction.customerName || 'N/A'} />
                                <DetailRow label="Email" value={selectedTransaction.customerEmail || 'N/A'} />
                                <DetailRow label="Teléfono" value={selectedTransaction.customerPhone || 'N/A'} />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-slate-950/30 flex justify-end">
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="px-5 py-2 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value, isMono = false }: { label: string, value: string | undefined, isMono?: boolean }) {
    return (
        <div className="flex justify-between items-center group">
            <span className="text-slate-500 text-sm font-medium">{label}</span>
            <span className={`text-slate-200 text-sm ${isMono ? 'font-mono' : ''} select-all`}>
                {value}
            </span>
        </div>
    );
}
