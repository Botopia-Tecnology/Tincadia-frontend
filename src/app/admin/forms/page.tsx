'use client';

import { useState } from 'react';
import { FileText, RefreshCw, Download, Search, Filter, Trash2, Eye, ChevronLeft, ChevronRight, AlertCircle, Calendar, Mail, Phone, User } from 'lucide-react';
import { FormSubmission } from './types';
import { useFormSubmissions } from './hooks/useFormSubmissions';
import { exportToCSV, formatDate } from './utils';
import { FormSubmissionModal } from './components/FormSubmissionModal';
import { formTypeIcons, formTypeLabels } from './constants';

export default function FormsPage() {
    const { submissions, loading, error, refetch, deleteSubmission } = useFormSubmissions();
    const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredSubmissions = filterType === 'all'
        ? submissions
        : submissions.filter(s => s.form?.type === filterType);

    // Pagination Logic
    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const paginatedSubmissions = filteredSubmissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleExport = () => {
        exportToCSV(filteredSubmissions);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta respuesta? Esta acción no se puede deshacer.')) return;

        try {
            await deleteSubmission(id);
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Error al eliminar la respuesta");
        }
    };

    const uniqueTypes = Array.from(new Set(submissions.map(s => s.form?.type).filter(Boolean)));

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
                        Bolsa de Trabajo
                    </h1>
                    <p className="text-slate-400 text-lg">Respuestas de Empresas Inclusivas y Solicitudes de Intérpretes</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        disabled={filteredSubmissions.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={18} />
                        Exportar CSV
                    </button>
                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 rounded-lg transition-all font-medium"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        Actualizar
                    </button>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="mb-8 flex flex-wrap items-center gap-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5 text-slate-400">
                    <Filter size={16} />
                    <span className="text-sm font-medium">Filtrar por tipo:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => { setFilterType('all'); setCurrentPage(1); }}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'all'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                    >
                        Todos ({submissions.length})
                    </button>
                    {uniqueTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => { setFilterType(type); setCurrentPage(1); }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filterType === type
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-900/40'
                                    : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                                }`}
                        >
                            {formTypeLabels[type] || type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Content */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="py-20 flex justify-center text-blue-500">
                        <RefreshCw size={40} className="animate-spin" />
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <FileText size={64} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium text-slate-300">No se encontraron respuestas</h3>
                        <p className="mt-2">Intenta ajustar los filtros o actualiza la lista.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5 text-left">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Solicitante</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contacto</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedSubmissions.map((submission) => {
                                        const Icon = formTypeIcons[submission.form?.type] || FileText;
                                        const typeLabel = formTypeLabels[submission.form?.type] || submission.form?.type || 'N/A';

                                        return (
                                            <tr key={submission.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 rounded-lg bg-slate-800 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                                                            <Icon size={18} />
                                                        </div>
                                                        <span className="font-medium text-slate-200">{typeLabel}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User size={14} className="text-slate-500" />
                                                        <span className="font-medium text-white">{submission.fullName || submission.data?.nombreCompleto || 'Sin nombre'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                                            <Mail size={12} />
                                                            {submission.email || submission.data?.correoElectronico || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                                            <Phone size={12} />
                                                            {submission.phone || submission.data?.telefono || submission.data?.telefonoWhatsapp || 'N/A'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-600" />
                                                        {formatDate(submission.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setSelectedSubmission(submission)}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                                            title="Ver detalles"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(submission.id)}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                            title="Eliminar respuesta"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-slate-900/40">
                            <span className="text-sm text-slate-500">
                                Mostrando <span className="text-white font-medium">{paginatedSubmissions.length}</span> de <span className="text-white font-medium">{filteredSubmissions.length}</span> resultados
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Logic to show pages around current page could be added here, 
                                    // keeping it simple for now or can assume total pages won't be huge yet.
                                    // For robustness let's just show 1..N if small, or current window.
                                    // Simplify: Just pages 1,2,3 for now or simple mapping if small count. 
                                    // Or use a simple range generator.
                                    let pageNum = i + 1;
                                    if (totalPages > 5 && currentPage > 3) {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    if (pageNum > totalPages) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSubmission && (
                <FormSubmissionModal
                    submission={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                />
            )}
        </div>
    );
}
