'use client';

import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { InterpreterRegistrationForm } from '@/components/landing/InterpreterRegistrationForm';
import { JobSeekerRegistrationForm } from '@/components/landing/JobSeekerRegistrationForm';
import {
    User as UserIcon,
    CreditCard,
    Loader2,
    FileText,
    LogOut,
    Crown
} from 'lucide-react';

// Sub-components
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ApplicationsList } from '@/components/profile/ApplicationsList';
import { SubscriptionCard } from '@/components/profile/SubscriptionCard';
import { TransactionsList } from '@/components/profile/TransactionsList';

export default function ProfilePage() {
    const router = useRouter();
    const {
        user,
        transactions,
        subscription,
        applications,
        loading,
        activeTab,
        setActiveTab,
        editingApplication,
        setEditingApplication,
        handleLogout,
        refresh
    } = useUserProfile();

    const onLogout = async () => {
        await handleLogout();
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
                                    refresh();
                                }}
                                onCancel={() => setEditingApplication(null)}
                            />
                        ) : editingApplication.form?.type === 'job_seeker_registration' ? (
                            <JobSeekerRegistrationForm
                                initialData={editingApplication.data}
                                submissionId={editingApplication.id}
                                onSuccess={() => {
                                    setEditingApplication(null);
                                    refresh();
                                }}
                                onCancel={() => setEditingApplication(null)}
                            />
                        ) : (
                            <div className="bg-white p-8 rounded-xl text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Edición no disponible</h3>
                                <p className="text-gray-600 mb-6">
                                    Por el momento solo se puede editar el formulario de registro de intérprete o aspirante.
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
                        <p className="text-gray-400 mt-1">Administra tu perfil y aplicaciones</p>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Tabs */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <nav className="space-y-2 bg-gray-800 p-4 rounded-xl border border-gray-700">
                            {[
                                { id: 'profile', label: 'Perfil Personal', icon: UserIcon },
                                { id: 'applications', label: 'Mis Solicitudes', icon: FileText },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                            ? 'bg-[#83A98A] text-white font-medium'
                                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}

                            <div className="pt-4 mt-4 border-t border-gray-700">
                                <button
                                    onClick={onLogout}
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
                        {activeTab === 'profile' && <ProfileInfo user={user} />}
                        {activeTab === 'applications' && <ApplicationsList applications={applications} onEdit={setEditingApplication} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
