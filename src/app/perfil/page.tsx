'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, userService } from '@/services/user.service';
import { formsService } from '@/services/forms.service';
import { Payment, paymentsService } from '@/services/payments.service';
import { InterpreterRegistrationForm } from '@/components/landing/InterpreterRegistrationForm';
import { JobSeekerRegistrationForm } from '@/components/landing/JobSeekerRegistrationForm';
import {
    User as UserIcon,
    CreditCard,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    Mail,
    Phone,
    FileText,
    LogOut,
    Crown
} from 'lucide-react';

type Tab = 'profile' | 'transactions' | 'subscription' | 'applications';

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    APPROVED: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Aprobado' },
    DECLINED: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Rechazado' },
    PENDING: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pendiente' },
    ERROR: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Error' },
    VOIDED: { icon: <XCircle className="w-4 h-4" />, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Anulado' },
};

function formatCurrency(cents: number, currency: string = 'COP'): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(cents / 100);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function ProfilePage() {
    const router = useRouter();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [user, setUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [subscription, setSubscription] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingApplication, setEditingApplication] = useState<any | null>(null);

    const loadData = async () => {
        try {
            // 1. Get User
            const userData = await userService.getMe();
            console.log('User Profile Data:', userData);
            setUser(userData);

            // 2. Get Transactions, Subscription and Applications (if user exists)
            if (userData?.id) {
                const [txData, subData, appsData] = await Promise.all([
                    paymentsService.getUserTransactions(userData.id),
                    paymentsService.getActiveSubscription(userData.id).catch(() => null),
                    formsService.getMyApplications(
                        userData.id,
                        userData.email,
                        userData.documentNumber
                    ).catch(() => [])
                ]);
                setTransactions(txData.items || []);
                // Check if subData is an array and take first, or object
                const activeSub = Array.isArray(subData) ? subData[0] : subData;
                setSubscription(activeSub);
                setApplications(appsData || []);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            // Optional: redirect to login if unauthorized
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#83A98A] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            {/* Edit Modal Overlay */}
            {editingApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-4xl max-h-full overflow-y-auto rounded-2xl relative">
                        {editingApplication.form?.type === 'interpreter_registration' ? (
                            <InterpreterRegistrationForm
                                initialData={editingApplication.data}
                                submissionId={editingApplication.id}
                                onSuccess={() => {
                                    setEditingApplication(null);
                                    loadData();
                                }}
                                onCancel={() => setEditingApplication(null)}
                            />
                        ) : editingApplication.form?.type === 'job_seeker_registration' ? (
                            <JobSeekerRegistrationForm
                                initialData={editingApplication.data}
                                submissionId={editingApplication.id}
                                onSuccess={() => {
                                    setEditingApplication(null);
                                    loadData();
                                }}
                                onCancel={() => setEditingApplication(null)}
                            />
                        ) : (
                            <div className="bg-white p-8 rounded-xl text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Edición no disponible</h3>
                                <p className="text-gray-600 mb-6">
                                    Por el momento solo se puede editar el formulario de registro de intérprete o aspirante.
                                    Para otros formularios, por favor contacta a soporte.
                                </p>
                                <button
                                    onClick={() => setEditingApplication(null)}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-lg"
                                >
                                    Cerrar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-12">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Mi Cuenta</h1>
                        <p className="text-gray-400 mt-1">Administra tu perfil, suscripción y aplicaciones</p>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Tabs */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <nav className="space-y-2 bg-gray-800 p-4 rounded-xl border border-gray-700">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                                    ? 'bg-[#83A98A] text-white font-medium'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                <UserIcon className="w-5 h-5" />
                                Perfil Personal
                            </button>
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'applications'
                                    ? 'bg-[#83A98A] text-white font-medium'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                <FileText className="w-5 h-5" />
                                Mis Solicitudes
                            </button>
                            <button
                                onClick={() => setActiveTab('subscription')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'subscription'
                                    ? 'bg-[#83A98A] text-white font-medium'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                <Crown className="w-5 h-5" />
                                Mi Suscripción
                            </button>
                            <button
                                onClick={() => setActiveTab('transactions')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'transactions'
                                    ? 'bg-[#83A98A] text-white font-medium'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                Historial de Pagos
                            </button>

                            <div className="pt-4 mt-4 border-t border-gray-700">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <UserIcon className="w-6 h-6 text-[#83A98A]" />
                                    Información Personal
                                </h2>

                                <div className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                                                Nombre
                                            </label>
                                            <div className="bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-700 text-gray-200">
                                                {user?.firstName}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                                                Apellido
                                            </label>
                                            <div className="bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-700 text-gray-200">
                                                {user?.lastName}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2 flex items-center gap-2">
                                            <Mail className="w-3 h-3" /> Email
                                        </label>
                                        <div className="bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-700 text-gray-200 flex items-center justify-between">
                                            {user?.email}
                                            {user?.emailVerified && (
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Verificado
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2 flex items-center gap-2">
                                                <Phone className="w-3 h-3" /> Teléfono
                                            </label>
                                            <div className="bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-700 text-gray-200">
                                                {user?.phone || 'No registrado'}
                                            </div>
                                        </div>
                                        {user?.documentNumber && (
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2 flex items-center gap-2">
                                                    <FileText className="w-3 h-3" /> Documento
                                                </label>
                                                <div className="bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-700 text-gray-200">
                                                    {user?.documentType} {user?.documentNumber}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-[#83A98A]" />
                                    Mis Solicitudes
                                </h2>

                                {applications.length > 0 ? (
                                    <div className="grid gap-4">
                                        {applications.map((app) => (
                                            <div key={app.id} className="bg-gray-900/50 rounded-xl border border-gray-700 p-6 hover:border-[#83A98A]/50 transition-colors">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="font-bold text-white text-lg">
                                                                {app.form?.title || 'Solicitud de Registro'}
                                                            </span>
                                                            <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-medium">
                                                                Enviado
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-400 flex items-center gap-2 mb-4">
                                                            <Calendar className="w-4 h-4" />
                                                            Fecha de solicitud: {formatDate(app.createdAt)}
                                                        </p>

                                                        {app.data.hojaVida && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded-lg inline-block border border-gray-700">
                                                                <FileText className="w-4 h-4 text-[#83A98A]" />
                                                                {app.data.hojaVida.name || 'Hoja de Vida'}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                                        <p className="font-mono text-xs text-gray-500">ID: {app.id.substring(0, 8)}</p>
                                                        <button
                                                            onClick={() => setEditingApplication(app)}
                                                            className="w-full bg-[#83A98A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e9175] transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            Editar Solicitud
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                                            <FileText className="w-8 h-8 text-gray-500" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-300 mb-2">No tienes solicitudes activas</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">
                                            Una vez que envíes una solicitud, aparecerá aquí para que puedas hacer seguimiento.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'subscription' && (
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
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm('¿Estás seguro de que deseas cancelar tu suscripción? Seguirás teniendo acceso hasta el final del periodo actual.')) {
                                                                        try {
                                                                            await paymentsService.cancelSubscription(subscription.id);
                                                                            // Reload subscription data
                                                                            const sub = await paymentsService.getActiveSubscription(user!.id);
                                                                            setSubscription(sub);
                                                                        } catch (e) {
                                                                            console.error('Error canceling subscription:', e);
                                                                            alert('No se pudo cancelar la suscripción. Intenta nuevamente.');
                                                                        }
                                                                    }
                                                                }}
                                                                className="text-xs text-red-400 hover:text-red-300 underline mt-1 block w-full text-right"
                                                            >
                                                                Cancelar renovación
                                                            </button>
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
                                        <button
                                            onClick={() => router.push('/pricing')}
                                            className="px-6 py-2.5 bg-[#83A98A] text-white font-medium rounded-lg hover:bg-[#6e9175] transition-colors shadow-lg shadow-[#83A98A]/20"
                                        >
                                            Ver Planes Disponibles
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'transactions' && (
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
                                        <button
                                            onClick={() => router.push('/pricing')}
                                            className="mt-6 px-6 py-2 bg-[#83A98A] text-white rounded-lg hover:bg-[#6e9175] transition-colors"
                                        >
                                            Ver Planes
                                        </button>
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
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

