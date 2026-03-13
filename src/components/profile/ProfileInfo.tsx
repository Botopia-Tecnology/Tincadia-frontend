'use client';

import { User as UserIcon, Mail, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { User } from '@/services/user.service';

export function ProfileInfo({ user }: { user: User | null }) {
    return (
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
    );
}
