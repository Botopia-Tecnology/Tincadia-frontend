'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, AlertCircle, ArrowLeft, Home, Loader2 } from 'lucide-react';
import { paymentsService } from '@/services/payments.service';

type PaymentStatus = 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR' | 'VOIDED' | 'loading';

interface TransactionDetails {
    id: string;
    reference: string;
    status: string;
    amount_in_cents: number;
    currency: string;
    payment_method_type: string;
    customer_email?: string;
    finalized_at?: string;
}

const STATUS_CONFIG: Record<string, {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    bgColor: string;
}> = {
    APPROVED: {
        icon: <CheckCircle2 className="w-20 h-20" />,
        title: '¡Pago Exitoso!',
        description: 'Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación en breve.',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    DECLINED: {
        icon: <XCircle className="w-20 h-20" />,
        title: 'Pago Rechazado',
        description: 'Tu pago no pudo ser procesado. Por favor, verifica los datos e intenta nuevamente.',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
    },
    PENDING: {
        icon: <Clock className="w-20 h-20" />,
        title: 'Pago Pendiente',
        description: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
    },
    ERROR: {
        icon: <AlertCircle className="w-20 h-20" />,
        title: 'Error en el Pago',
        description: 'Ocurrió un error al procesar tu pago. Por favor, intenta nuevamente.',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
    },
    VOIDED: {
        icon: <XCircle className="w-20 h-20" />,
        title: 'Pago Anulado',
        description: 'Este pago ha sido anulado.',
        color: 'text-gray-500',
        bgColor: 'bg-gray-500/10',
    },
    loading: {
        icon: <Loader2 className="w-20 h-20 animate-spin" />,
        title: 'Verificando pago...',
        description: 'Por favor espera mientras verificamos el estado de tu transacción.',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
};

function formatCurrency(cents: number, currency: string = 'COP'): string {
    const amount = cents / 100;
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('es-CO', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}

// Componente interno que usa useSearchParams
function PaymentResponseContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<PaymentStatus>('loading');
    const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    const transactionId = searchParams.get('id');
    const statusParam = searchParams.get('status');
    const reasonParam = searchParams.get('reason');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!transactionId || transactionId === 'approved' || transactionId === 'failed') {
                // If it's a placeholder ID, use the status param directly
                if (statusParam === 'success') setStatus('APPROVED');
                else if (statusParam === 'failed') {
                    setStatus('DECLINED');
                    if (reasonParam) setError(`Razón: ${decodeURIComponent(reasonParam)}`);
                }
                else {
                    setStatus('ERROR');
                    setError('No se encontró el ID de la transacción');
                }
                return;
            }

            try {
                // Verificar el estado con Wompi a través de nuestro backend
                const data = await paymentsService.verifyPayment(transactionId);

                setTransaction(data);
                setStatus(data.status as PaymentStatus);
            } catch (err) {
                // Si falla la verificación, usar el status del parámetro si existe
                if (statusParam === 'success') {
                    setStatus('APPROVED');
                    // No logueamos error porque tenemos fallback
                } else if (statusParam === 'failed') {
                    setStatus('DECLINED');
                    // No logueamos error porque tenemos fallback
                } else {
                    console.error('Error verifying payment:', err);
                    setStatus('ERROR');
                    setError('No se pudo verificar el estado del pago');
                }
            }
        };

        verifyPayment();
    }, [transactionId, statusParam]);

    const config = STATUS_CONFIG[status] || STATUS_CONFIG.ERROR;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Card principal */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                {/* Icono y estado */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${config.bgColor} ${config.color} mb-6`}>
                        {config.icon}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {config.title}
                    </h1>
                    <p className="text-gray-400">
                        {config.description}
                    </p>
                </div>

                {/* Detalles de la transacción */}
                {transaction && status !== 'loading' && (
                    <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Detalles de la Transacción
                        </h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-gray-400">ID de Transacción:</dt>
                                <dd className="text-white font-mono text-sm">{transaction.id}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Referencia:</dt>
                                <dd className="text-white font-mono text-sm">{transaction.reference}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Monto:</dt>
                                <dd className="text-white font-semibold">
                                    {formatCurrency(transaction.amount_in_cents, transaction.currency)}
                                </dd>
                            </div>
                            {transaction.payment_method_type && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">Método de pago:</dt>
                                    <dd className="text-white">{transaction.payment_method_type}</dd>
                                </div>
                            )}
                            {transaction.customer_email && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">Email:</dt>
                                    <dd className="text-white">{transaction.customer_email}</dd>
                                </div>
                            )}
                            {transaction.finalized_at && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">Fecha:</dt>
                                    <dd className="text-white">{formatDate(transaction.finalized_at)}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {status === 'APPROVED' ? (
                        <>
                            <Link
                                href="/perfil"
                                className="flex-1 flex items-center justify-center gap-2 bg-[#83A98A] text-white rounded-lg px-6 py-3 font-semibold hover:bg-[#6B8E71] transition-colors"
                            >
                                Ir a Mi Perfil
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white rounded-lg px-6 py-3 font-semibold hover:bg-gray-600 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Volver al Inicio
                            </Link>
                        </>
                    ) : status === 'DECLINED' || status === 'ERROR' ? (
                        <>
                            <Link
                                href="/pricing"
                                className="flex-1 flex items-center justify-center gap-2 bg-[#83A98A] text-white rounded-lg px-6 py-3 font-semibold hover:bg-[#6B8E71] transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Intentar de Nuevo
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white rounded-lg px-6 py-3 font-semibold hover:bg-gray-600 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Volver al Inicio
                            </Link>
                        </>
                    ) : status === 'PENDING' ? (
                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white rounded-lg px-6 py-3 font-semibold hover:bg-gray-600 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Volver al Inicio
                        </Link>
                    ) : null}
                </div>
            </div>

            {/* Información de contacto */}
            <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                    ¿Tienes algún problema con tu pago?{' '}
                    <Link href="/contacto" className="text-[#83A98A] hover:underline">
                        Contáctanos
                    </Link>
                </p>
            </div>
        </div>
    );
}

// Loading fallback
function LoadingFallback() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-500/10 text-blue-500 mb-6">
                        <Loader2 className="w-20 h-20 animate-spin" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Cargando...
                    </h1>
                    <p className="text-gray-400">
                        Por favor espera mientras cargamos la información.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Componente principal con Suspense
export default function PaymentResponsePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<LoadingFallback />}>
                <PaymentResponseContent />
            </Suspense>
        </div>
    );
}
