'use client';

import { X, CheckSquare, Filter, Database, Download, FileSpreadsheet } from 'lucide-react';

export type DownloadScope = 'selected' | 'filtered' | 'all';

interface DownloadModalProps {
    selectedCount: number;
    filteredCount: number;
    totalCount: number;
    onDownload: (scope: DownloadScope) => void;
    onClose: () => void;
}

export function DownloadModal({
    selectedCount,
    filteredCount,
    totalCount,
    onDownload,
    onClose,
}: DownloadModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
                            <Download size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Descargar Datos</h3>
                            <p className="text-xs text-slate-400">Archivo Excel con todos los datos</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                    <p className="text-sm text-slate-400 mb-4">
                        ¿Qué perfiles deseas descargar?
                    </p>

                    {/* Option: Selected */}
                    {selectedCount > 0 && (
                        <button
                            onClick={() => onDownload('selected')}
                            className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-violet-600/10 border border-violet-500/20 hover:bg-violet-600/20 hover:border-violet-500/40 transition-all text-left"
                        >
                            <div className="p-2.5 rounded-lg bg-violet-500/20 text-violet-400 group-hover:bg-violet-500/30 transition-colors">
                                <CheckSquare size={20} />
                            </div>
                            <div className="flex-1">
                                <span className="block text-sm font-medium text-white">Solo seleccionados</span>
                                <span className="block text-xs text-slate-400 mt-0.5">
                                    {selectedCount} {selectedCount === 1 ? 'perfil seleccionado' : 'perfiles seleccionados'}
                                </span>
                            </div>
                            <span className="text-xl font-bold text-violet-400">{selectedCount}</span>
                        </button>
                    )}

                    {/* Option: Filtered */}
                    {filteredCount !== totalCount && (
                        <button
                            onClick={() => onDownload('filtered')}
                            className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-500/40 transition-all text-left"
                        >
                            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                                <Filter size={20} />
                            </div>
                            <div className="flex-1">
                                <span className="block text-sm font-medium text-white">Filtrados actuales</span>
                                <span className="block text-xs text-slate-400 mt-0.5">
                                    Resultados del filtro y búsqueda actual
                                </span>
                            </div>
                            <span className="text-xl font-bold text-blue-400">{filteredCount}</span>
                        </button>
                    )}

                    {/* Option: All */}
                    <button
                        onClick={() => onDownload('all')}
                        className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 hover:border-emerald-500/40 transition-all text-left"
                    >
                        <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                            <Database size={20} />
                        </div>
                        <div className="flex-1">
                            <span className="block text-sm font-medium text-white">Absolutamente todos</span>
                            <span className="block text-xs text-slate-400 mt-0.5">
                                Todos los perfiles de la base de datos
                            </span>
                        </div>
                        <span className="text-xl font-bold text-emerald-400">{totalCount}</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FileSpreadsheet size={12} />
                        Incluye enlaces a documentos adjuntos cuando existan
                    </div>
                </div>
            </div>
        </div>
    );
}
