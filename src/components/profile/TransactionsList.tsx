'use client';

import { CreditCard, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Payment } from '@/services/payments.service';

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    APPROVED: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Aprobado' },
    DECLINED: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Rechazado' },
    PENDING: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pendiente' },
    ERROR: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Error' },
    VOIDED: { icon: <XCircle className="w-4 h-4" />, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Anulado' },
};

export function TransactionsList({ transactions }: { transactions: Payment[] }) {
    const router = useRouter();

    const formatCurrency = (cents: number, currency: string = 'COP'): string => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(cents / 100);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#83A98A]" />
                Historial de Transacciones
            </h2>

            {transactions.length === 0 ? (
                <div className="text-center py-12 rounded-lg bg-gray-900/30 border border-gray-700 border-dashed">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-1">Sin transacciones</h3>
                    <p className="text-gray-500">Aún no has realizado ningún pago.</p>
                    {/* 
                    <button
                        onClick={() => router.push('/pricing')}
                        className="mt-6 px-6 py-2 bg-[#83A98A] text-white rounded-lg hover:bg-[#6e9175] transition-colors"
                    >
                        Ver Planes
                    </button>
                    */}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-900 text-gray-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Referencia</th>
                                    <th className="px-6 py-4">Monto</th>
                                    <th className="px-6 py-4">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700 bg-gray-800/50">
                                {transactions.map((tx) => {
                                    const status = STATUS_CONFIG[tx.status] || STATUS_CONFIG.PENDING;

                                    return (
                                        <tr key={tx.id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    {formatDate(tx.createdAt || new Date().toISOString())}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-300 select-all">
                                                {tx.reference}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {formatCurrency(tx.amountInCents, tx.currency)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bg}`}>
                                                    {status.icon}
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
