import { FormSubmission } from '../types';
import { formTypeLabels } from '../constants';
import { formatDate } from '../utils';
import { OrganizedDataRenderer } from './OrganizedDataRenderer';

interface FormSubmissionModalProps {
    submission: FormSubmission;
    onClose: () => void;
}

export function FormSubmissionModal({ submission, onClose }: FormSubmissionModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
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
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
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

