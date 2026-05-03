'use client';

import { Crown, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { paymentsService } from '@/services/payments.service';

interface SubscriptionCardProps {
    subscription: any;
    user: any;
    onUpdate: () => void;
}

export function SubscriptionCard({ subscription, user, onUpdate }: SubscriptionCardProps) {
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
            day: 'numeric'
        });
    };

    const handleCancel = async () => {
        if (confirm('¿Estás seguro de que deseas cancelar tu suscripción? Seguirás teniendo acceso hasta el final del periodo actual.')) {
            try {
                await paymentsService.cancelSubscription(subscription.id);
                onUpdate();
            } catch (e) {
                console.error('Error canceling subscription:', e);
                alert('No se pudo cancelar la suscripción. Intenta nuevamente.');
            }
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Crown className="w-6 h-6 text-[#83A98A]" />
                Mi Suscripción
            </h2>

            {subscription ? (
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Crown className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">Plan {subscription.plan?.name || 'Premium'}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                                            <CheckCircle2 className="w-3 h-3" /> {subscription.status.toUpperCase()}
                                        </span>
                                        {subscription.cancelAtPeriodEnd && (
                                            <span className="text-xs text-yellow-400 font-medium bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
                                                Se cancela al final del periodo
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Próximo Cobro</p>
                                    <p className="text-xl font-mono text-white">
                                        {formatCurrency(subscription.amountCents)}
                                    </p>
                                    {!subscription.cancelAtPeriodEnd && (
                                        subscription.managedExternally ? (
                                            <div className="text-right mt-2">
                                                <p className="text-[10px] text-yellow-500 leading-tight">
                                                    Suscripción gestionada desde <br/>App Store / Play Store
                                                </p>
                                                <p className="text-[9px] text-gray-500 mt-1">
                                                    Cancela desde los ajustes de tu celular
                                                </p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleCancel}
                                                className="text-xs text-red-400 hover:text-red-300 underline mt-1 block w-full text-right"
                                            >
                                                Cancelar renovación
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" /> Periodo Actual
                                    </p>
                                    <p className="text-sm font-medium text-white">
                                        {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                                    </p>
                                </div>

                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-[#83A98A]" /> Días Restantes
                                    </p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-bold text-white">
                                            {Math.max(0, Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                                        </span>
                                        <span className="text-sm text-gray-400 mb-1">días</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                        <Crown className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No tienes una suscripción activa</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">Accede a funcionalidades exclusivas suscribiéndote a uno de nuestros planes.</p>
                    {/* 
                    <button
                        onClick={() => router.push('/pricing')}
                        className="px-6 py-2.5 bg-[#83A98A] text-white font-medium rounded-lg hover:bg-[#6e9175] transition-colors shadow-lg shadow-[#83A98A]/20"
                    >
                        Ver Planes Disponibles
                    </button>
                    */}
                </div>
            )}
        </div>
    );
}
