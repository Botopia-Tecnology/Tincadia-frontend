'use client';

import { useState } from 'react';
import { FileText, RefreshCw, Download } from 'lucide-react';
import { FormSubmission } from './types';
import { useFormSubmissions } from './hooks/useFormSubmissions';
import { exportToCSV } from './utils';
import { FormFilters } from './components/FormFilters';
import { FormSubmissionTable } from './components/FormSubmissionTable';
import { FormSubmissionModal } from './components/FormSubmissionModal';

export default function FormsPage() {
    const { submissions, loading, error, refetch } = useFormSubmissions();
    const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
    const [filterType, setFilterType] = useState<string>('all');

    const filteredSubmissions = filterType === 'all'
        ? submissions
        : submissions.filter(s => s.form?.type === filterType);

    const handleExport = () => {
        exportToCSV(filteredSubmissions);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bolsa de Trabajo</h1>
                    <p className="text-slate-400 mt-1">
                        Respuestas de Empresas Inclusivas y Solicitudes de Intérpretes
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        disabled={filteredSubmissions.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
                    >
                        <Download size={18} />
                        Exportar CSV
                    </button>
                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Filters */}
            <FormFilters
                submissions={submissions}
                filterType={filterType}
                onFilterChange={setFilterType}
            />

            {/* Error State */}
            {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw size={32} className="animate-spin text-blue-500" />
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredSubmissions.length === 0 && (
                <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
                    <FileText size={48} className="mx-auto text-slate-500 mb-4" />
                    <h3 className="text-lg font-medium text-slate-300">No hay respuestas</h3>
                    <p className="text-slate-500 mt-1">
                        Aún no se han recibido formularios de la bolsa de trabajo
                    </p>
                </div>
            )}

            {/* Submissions Table */}
            {!loading && filteredSubmissions.length > 0 && (
                <FormSubmissionTable
                    submissions={filteredSubmissions}
                    onViewDetails={setSelectedSubmission}
                />
            )}

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
