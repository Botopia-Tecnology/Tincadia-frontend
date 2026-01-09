import { useState } from 'react';
import { FormSubmission } from '../types';
import { formTypeLabels } from '../constants';
import { formatDate } from '../utils';
import { OrganizedDataRenderer } from './OrganizedDataRenderer';
import { CheckCircle, AlertTriangle, UserCheck, XCircle } from 'lucide-react';
import { usersService } from '@/services/users.service';
import { FORMS_ENDPOINTS, buildUrl } from '@/config/api.config';

interface FormSubmissionModalProps {
    submission: FormSubmission;
    onClose: () => void;
    onDeleted?: () => void;
}

export function FormSubmissionModal({ submission, onClose, onDeleted }: FormSubmissionModalProps) {
    const [isPromoting, setIsPromoting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [promoteError, setPromoteError] = useState<string | null>(null);
    const [rejectError, setRejectError] = useState<string | null>(null);
    const [promoteSuccess, setPromoteSuccess] = useState(false);
    const [rejectSuccess, setRejectSuccess] = useState(false);

    const isInterpreterForm = submission.form?.type === 'interpreter_registration';

    const handlePromote = async () => {
        const email = submission.email || submission.data?.correoElectronico;
        if (!email) {
            setPromoteError('No se encontró un email válido en el formulario para realizar la aprobación.');
            return;
        }

        if (!confirm(`¿Estás seguro de aprobar a ${submission.data?.nombreCompleto || email} como Intérprete? Esto actualizará su rol de usuario.`)) return;

        setIsPromoting(true);
        setPromoteError(null);
        try {
            await usersService.promoteToInterpreter(email);
            setPromoteSuccess(true);
        } catch (err: any) {
            setPromoteError(err.message || 'Error al promover usuario');
        } finally {
            setIsPromoting(false);
        }
    };

    const handleReject = async () => {
        if (!confirm(`¿Estás seguro de rechazar esta solicitud? Se eliminará el registro del formulario.`)) return;

        setIsRejecting(true);
        setRejectError(null);
        try {
            const response = await fetch(`${buildUrl(FORMS_ENDPOINTS.DELETE_SUBMISSION)}/${submission.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tincadia_token')}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al eliminar la solicitud');
            }

            setRejectSuccess(true);
            if (onDeleted) {
                setTimeout(() => {
                    onDeleted();
                    onClose();
                }, 1500);
            }
        } catch (err: any) {
            setRejectError(err.message || 'Error al rechazar solicitud');
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 shrink-0">
                    <h2 className="text-lg font-semibold text-white">
                        {submission.form?.title || 'Detalles del Formulario'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto grow">
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-slate-400 text-sm">Tipo:</span>
                                <span className="ml-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                                    {formTypeLabels[submission.form?.type] || submission.form?.type}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm">Fecha:</span>
                                <span className="ml-2 text-white">{formatDate(submission.createdAt)}</span>
                            </div>
                        </div>

                        {/* Quick info */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-lg">
                            <div>
                                <span className="text-xs text-slate-500 uppercase">Nombre</span>
                                <p className="text-white font-medium">{submission.fullName || submission.data?.nombreCompleto || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase">Email</span>
                                <p className="text-white font-medium">{submission.email || submission.data?.correoElectronico || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase">Teléfono</span>
                                <p className="text-white font-medium">{submission.phone || submission.data?.telefono || submission.data?.telefonoWhatsapp || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase">Documento</span>
                                <p className="text-white font-medium">{submission.documentNumber || submission.data?.documentoIdentidad || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Actions for Interpreter */}
                        {isInterpreterForm && (
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                    <UserCheck size={16} />
                                    Gestión de Solicitud
                                </h3>

                                {promoteSuccess ? (
                                    <div className="bg-green-900/30 text-green-400 p-3 rounded-lg flex items-center gap-2">
                                        <CheckCircle size={18} />
                                        <span>Solicitud aprobada. El usuario ahora es Intérprete.</span>
                                    </div>
                                ) : rejectSuccess ? (
                                    <div className="bg-red-900/30 text-red-400 p-3 rounded-lg flex items-center gap-2">
                                        <XCircle size={18} />
                                        <span>Solicitud rechazada y eliminada.</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-sm text-slate-400">
                                            Revisa la hoja de vida adjunta antes de aprobar. Al aprobar, el usuario con el email
                                            <span className="text-white font-mono mx-1">{submission.data?.correoElectronico || 'N/A'}</span>
                                            obtendrá el rol de <strong>Intérprete</strong>.
                                        </p>

                                        {promoteError && (
                                            <div className="bg-red-900/30 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                                                <AlertTriangle size={16} />
                                                <span>{promoteError}</span>
                                            </div>
                                        )}

                                        {rejectError && (
                                            <div className="bg-red-900/30 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                                                <AlertTriangle size={16} />
                                                <span>{rejectError}</span>
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleReject}
                                                disabled={isRejecting || isPromoting}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                {isRejecting ? (
                                                    <span className="animate-spin">⌛</span>
                                                ) : (
                                                    <XCircle size={16} />
                                                )}
                                                {isRejecting ? 'Rechazando...' : 'Rechazar'}
                                            </button>

                                            <button
                                                onClick={handlePromote}
                                                disabled={isPromoting || isRejecting}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                {isPromoting ? (
                                                    <span className="animate-spin">⌛</span>
                                                ) : (
                                                    <CheckCircle size={16} />
                                                )}
                                                {isPromoting ? 'Procesando...' : 'Aprobar'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Organized data by categories */}
                        <div className="border-t border-slate-700 pt-4">
                            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wide">
                                Información Completa
                            </h3>
                            {(() => {
                                // Filter out fields already shown in Quick info to avoid duplicates
                                const data = submission.data || {};
                                const fieldsToExclude = [
                                    'nombreCompleto',
                                    'correoElectronico',
                                    'telefono',
                                    'telefonoWhatsapp',
                                    'documentoIdentidad',
                                ];
                                const filteredData = Object.fromEntries(
                                    Object.entries(data).filter(([key]) => !fieldsToExclude.includes(key))
                                );
                                return <OrganizedDataRenderer data={filteredData} />;
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

