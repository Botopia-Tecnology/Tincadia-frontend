'use client';

import { DollarSign, TrendingUp, CreditCard, Download, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { financeService, Payment } from '@/services/finance.service';

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await financeService.getAllPayments();
            setTransactions(data.items);

            // Calculate pseudo metrics for now
            const revenue = data.items.reduce((acc, curr) =>
                curr.status === 'success' ? acc + Number(curr.amount) : acc, 0
            );
            setTotalRevenue(revenue);
        } catch (error) {
            console.error('Failed to fetch payments', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-400 text-sm">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-white">
                                ${totalRevenue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    {/* Placeholder for real growth metric */}
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                        <TrendingUp size={14} className="text-emerald-400" /> --% this month
                    </p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-400 text-sm">Active Subscriptions</p>
                            <h3 className="text-2xl font-bold text-white">-</h3>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <CreditCard size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                </div>
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {transactions.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center text-slate-500">No transactions found.</td></tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-400 text-xs font-mono">{tx.id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 text-white">{tx.plan}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-white font-mono">${Number(tx.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${tx.status === 'success' ? 'bg-emerald-900/50 text-emerald-400' :
                                                tx.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                                                    'bg-red-900/50 text-red-400'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
