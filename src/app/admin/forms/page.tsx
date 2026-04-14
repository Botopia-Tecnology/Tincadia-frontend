'use client';

import { useState, useCallback } from 'react';
import { FileText, RefreshCw, Download, Search, Filter, Trash2, Eye, ChevronLeft, ChevronRight, AlertCircle, Calendar, Mail, Phone, User, X } from 'lucide-react';
import { FormSubmission } from './types';
import { useFormSubmissions } from './hooks/useFormSubmissions';
import { exportToCSV, exportToExcel, formatDate } from './utils';
import { FormSubmissionModal } from './components/FormSubmissionModal';
import { DownloadModal, DownloadScope } from './components/DownloadModal';
import { formTypeIcons, formTypeLabels } from './constants';

export default function FormsPage() {
    const { submissions, loading, error, refetch, deleteSubmission } = useFormSubmissions();

    // UI state
    const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [downloadStatus, setDownloadStatus] = useState<{ step: string; message: string; isError: boolean } | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDownloadModal, setShowDownloadModal] = useState(false);

    // Selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const itemsPerPage = 10;

    // ── Derived sets ────────────────────────────────────────────────────────────
    const filteredSubmissions = submissions.filter(s => {
        const matchesType = filterType === 'all' || s.form?.type === filterType;
        if (!matchesType) return false;
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const fullName = (s.fullName || s.data?.nombreCompleto || '').toLowerCase();
        const email = (s.email || s.data?.correoElectronico || '').toLowerCase();
        const doc = (s.documentNumber || s.data?.documentoIdentidad || '').toLowerCase();
        return fullName.includes(term) || email.includes(term) || doc.includes(term);
    });

    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const paginatedSubmissions = filteredSubmissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ── Selection helpers ────────────────────────────────────────────────────────
    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const allVisibleSelected =
        paginatedSubmissions.length > 0 &&
        paginatedSubmissions.every(s => selectedIds.has(s.id));

    const someVisibleSelected = paginatedSubmissions.some(s => selectedIds.has(s.id));

    const toggleAllVisible = useCallback(() => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (allVisibleSelected) {
                // Deselect all visible
                paginatedSubmissions.forEach(s => next.delete(s.id));
            } else {
                // Select all visible
                paginatedSubmissions.forEach(s => next.add(s.id));
            }
            return next;
        });
    }, [paginatedSubmissions, allVisibleSelected]);

    const clearSelection = () => setSelectedIds(new Set());

    const selectedCount = selectedIds.size;
    const selectedSubmissions = submissions.filter(s => selectedIds.has(s.id));

    // ── Pagination ───────────────────────────────────────────────────────────────
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // ── Download ─────────────────────────────────────────────────────────────────
    const handleExport = () => exportToCSV(filteredSubmissions);

    const handleDownloadAll = () => {
        if (submissions.length === 0) return;
        setShowDownloadModal(true);
    };

    const handleDownloadConfirm = (scope: DownloadScope) => {
        setShowDownloadModal(false);

        let targets: FormSubmission[] = [];
        if (scope === 'selected') targets = selectedSubmissions;
        else if (scope === 'filtered') targets = filteredSubmissions;
        else targets = submissions; // 'all' — todo el dataset sin filtros

        if (targets.length === 0) return;

        setIsDownloading(true);
        setDownloadStatus({ step: '📊 Generando Excel...', message: '', isError: false });

        try {
            const filename = `tincadia_${targets.length}_solicitudes_${new Date().toISOString().split('T')[0]}.xlsx`;
            exportToExcel(targets, filename);
            setDownloadStatus({ step: '✅ Excel descargado', message: '', isError: false });
        } catch {
            setDownloadStatus({ step: '❌ Error al generar Excel', message: '', isError: true });
        }

        setTimeout(() => {
            setDownloadStatus(null);
            setIsDownloading(false);
        }, 3000);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta respuesta? Esta acción no se puede deshacer.')) return;
        try {
            await deleteSubmission(id);
            // Limpiar de la selección si estaba seleccionado
            setSelectedIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        } catch {
            alert('Error al eliminar la respuesta');
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

                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-3">
                        {/* Download All */}
                        <button
                            onClick={handleDownloadAll}
                            disabled={submissions.length === 0 || isDownloading}
                            className="relative flex items-center gap-2 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/20 hover:border-violet-500/50 rounded-lg transition-all font-medium disabled:opacity-50"
                        >
                            {isDownloading ? (
                                <RefreshCw size={18} className="animate-spin" />
                            ) : (
                                <Download size={18} />
                            )}
                            Descargar
                            {selectedCount > 0 && (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white text-xs font-bold">
                                    {selectedCount}
                                </span>
                            )}
                        </button>

                        {/* CSV Export */}
                        <button
                            onClick={handleExport}
                            disabled={filteredSubmissions.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={18} />
                            CSV
                        </button>

                        {/* Refresh */}
                        <button
                            onClick={refetch}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 rounded-lg transition-all font-medium"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            Actualizar
                        </button>
                    </div>

                    {/* Download progress */}
                    {downloadStatus && (
                        <p className={`text-xs font-medium animate-pulse ${downloadStatus.isError ? 'text-red-400' : 'text-violet-300'}`}>
                            {downloadStatus.step}
                        </p>
                    )}
                </div>
            </header>

            {/* Selection banner */}
            {selectedCount > 0 && (
                <div className="mb-4 flex items-center justify-between gap-4 px-4 py-3 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                    <span className="text-sm text-violet-300 font-medium">
                        {selectedCount} {selectedCount === 1 ? 'perfil seleccionado' : 'perfiles seleccionados'}
                    </span>
                    <button
                        onClick={clearSelection}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={14} />
                        Limpiar selección
                    </button>
                </div>
            )}

            {/* Filters & Search */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5 text-slate-400">
                        <Filter size={16} />
                        <span className="text-sm font-medium">Filtrar:</span>
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

                <div className="relative flex-1 max-w-md w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo o documento..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Table */}
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
                                        {/* Checkbox header */}
                                        <th className="pl-6 pr-3 py-4 w-10">
                                            <button
                                                onClick={toggleAllVisible}
                                                title={allVisibleSelected ? 'Deseleccionar todos' : 'Seleccionar todos visibles'}
                                                className="flex items-center justify-center w-5 h-5 rounded border border-slate-600 hover:border-violet-500 transition-colors"
                                                style={{
                                                    backgroundColor: allVisibleSelected
                                                        ? 'rgb(139 92 246)'
                                                        : someVisibleSelected
                                                            ? 'rgba(139,92,246,0.3)'
                                                            : 'transparent',
                                                    borderColor: someVisibleSelected || allVisibleSelected
                                                        ? 'rgb(139 92 246)'
                                                        : undefined,
                                                }}
                                            >
                                                {(allVisibleSelected || someVisibleSelected) && (
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        {allVisibleSelected
                                                            ? <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            : <path d="M2 5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                        }
                                                    </svg>
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Solicitante</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contacto</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedSubmissions.map(submission => {
                                        const Icon = formTypeIcons[submission.form?.type] || FileText;
                                        const typeLabel = formTypeLabels[submission.form?.type] || submission.form?.type || 'N/A';
                                        const isSelected = selectedIds.has(submission.id);

                                        return (
                                            <tr
                                                key={submission.id}
                                                className={`group transition-colors cursor-pointer ${isSelected
                                                    ? 'bg-violet-600/10 hover:bg-violet-600/15'
                                                    : 'hover:bg-white/5'
                                                    }`}
                                                onClick={() => toggleSelection(submission.id)}
                                            >
                                                {/* Checkbox cell */}
                                                <td className="pl-6 pr-3 py-4" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => toggleSelection(submission.id)}
                                                        className="flex items-center justify-center w-5 h-5 rounded border transition-colors"
                                                        style={{
                                                            backgroundColor: isSelected ? 'rgb(139 92 246)' : 'transparent',
                                                            borderColor: isSelected ? 'rgb(139 92 246)' : 'rgb(71 85 105)',
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2.5 rounded-lg transition-colors ${isSelected
                                                            ? 'bg-violet-500/20 text-violet-300'
                                                            : 'bg-slate-800 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300'
                                                            }`}>
                                                            <Icon size={18} />
                                                        </div>
                                                        <span className="font-medium text-slate-200">{typeLabel}</span>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User size={14} className="text-slate-500" />
                                                        <span className="font-medium text-white">{submission.fullName || submission.data?.nombreCompleto || 'Sin nombre'}</span>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
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

                                                <td className="px-4 py-4 text-sm text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-600" />
                                                        {formatDate(submission.createdAt)}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-right" onClick={e => e.stopPropagation()}>
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

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-slate-900/40">
                            <span className="text-sm text-slate-500">
                                Mostrando <span className="text-white font-medium">{paginatedSubmissions.length}</span> de <span className="text-white font-medium">{filteredSubmissions.length}</span> resultados
                                {selectedCount > 0 && (
                                    <span className="ml-2 text-violet-400 font-medium">· {selectedCount} seleccionados</span>
                                )}
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

            {/* Download Modal */}
            {showDownloadModal && (
                <DownloadModal
                    selectedCount={selectedCount}
                    filteredCount={filteredSubmissions.length}
                    totalCount={submissions.length}
                    onDownload={handleDownloadConfirm}
                    onClose={() => setShowDownloadModal(false)}
                />
            )}
        </div>
    );
}
