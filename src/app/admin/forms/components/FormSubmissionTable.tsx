import { Eye, FileText } from 'lucide-react';
import { FormSubmission } from '../types';
import { formTypeIcons, formTypeLabels } from '../constants';
import { formatDate } from '../utils';

interface FormSubmissionTableProps {
    submissions: FormSubmission[];
    onViewDetails: (submission: FormSubmission) => void;
}

export function FormSubmissionTable({ submissions, onViewDetails }: FormSubmissionTableProps) {
    if (submissions.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-800">
                    <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Tipo</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Nombre</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Email</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Teléfono</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Fecha</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {submissions.map((submission) => {
                        const Icon = formTypeIcons[submission.form?.type] || FileText;
                        const typeLabel = formTypeLabels[submission.form?.type] || submission.form?.type || 'N/A';
                        return (
                            <tr key={submission.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-slate-700 rounded-lg">
                                            <Icon size={16} className="text-blue-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm">
                                            {typeLabel}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-300">
                                    {(submission.fullName as string) || (submission.data?.nombreCompleto as string) || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm">
                                    {(submission.email as string) || (submission.data?.correoElectronico as string) || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm">
                                    {(submission.phone as string) || (submission.data?.telefono as string) || (submission.data?.telefonoWhatsapp as string) || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm">
                                    {formatDate(submission.createdAt)}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onViewDetails(submission)}
                                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-600 rounded-lg transition-colors"
                                        title="Ver detalles"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

