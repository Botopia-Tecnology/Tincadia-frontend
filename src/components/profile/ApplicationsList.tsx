'use client';

import { FileText, Calendar } from 'lucide-react';

interface ApplicationsListProps {
    applications: any[];
    onEdit: (app: any) => void;
}

export function ApplicationsList({ applications, onEdit }: ApplicationsListProps) {
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
                                        onClick={() => onEdit(app)}
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
    );
}
