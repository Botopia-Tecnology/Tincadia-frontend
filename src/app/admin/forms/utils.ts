import * as XLSX from 'xlsx';
import { FormSubmission } from './types';
import { formTypeLabels, fieldLabels } from './constants';
import { buildUrl, FORMS_ENDPOINTS } from '@/config/api.config';

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const exportToCSV = (submissions: FormSubmission[]): void => {
    if (submissions.length === 0) return;

    const headers = ['Fecha', 'Tipo', 'Nombre', 'Email', 'Teléfono', 'Documento'];
    const rows = submissions.map(s => [
        formatDate(s.createdAt),
        formTypeLabels[s.form?.type] || s.form?.type || 'N/A',
        s.fullName || s.data?.nombreCompleto || 'N/A',
        s.email || s.data?.correoElectronico || 'N/A',
        s.phone || s.data?.telefono || s.data?.telefonoWhatsapp || 'N/A',
        s.documentNumber || s.data?.documentoIdentidad || 'N/A',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `formularios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};

/**
 * Extraer la URL pública de un campo que puede ser string u objeto con .url
 */
function extractUrl(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.url) return value.url;
    return '';
}

/**
 * Convertir un valor de campo a texto legible para la celda
 */
function fieldToText(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
        // Objetos con "url" son documentos — devolver la URL
        if (value.url) return value.url;
        // Objetos con "name" y "value" (opciones de selección)
        if (value.name) return value.name;
        return JSON.stringify(value);
    }
    return String(value);
}

/**
 * Exportar una lista de submissions a un archivo .xlsx
 * Incluye todos los campos del formulario y links a documentos como hipervínculos
 */
export const exportToExcel = (submissions: FormSubmission[], filename?: string): void => {
    if (submissions.length === 0) return;

    // Recopilar todas las claves únicas de los campos de data
    const allDataKeys = new Set<string>();
    // Campos base que siempre van primero
    const baseKeys = ['Fecha', 'Tipo de Formulario', 'Nombre Completo', 'Correo', 'Teléfono', 'N° Documento'];
    // Campos de documentos que van al final
    const docKeys = ['hojaVida', 'certificaciones', 'certificacionesCursos'];

    submissions.forEach(s => {
        Object.keys(s.data || {}).forEach(k => {
            if (!docKeys.includes(k)) allDataKeys.add(k);
        });
    });

    // Construir orden de columnas: base → campos formulario → documentos
    const dataKeysOrdered = Array.from(allDataKeys).filter(k => !baseKeys.includes(k));
    const docKeysPresent = docKeys.filter(k =>
        submissions.some(s => s.data?.[k])
    );

    const ws = XLSX.utils.aoa_to_sheet([]);

    // Fila de cabeceras
    const headerRow = [
        ...baseKeys,
        ...dataKeysOrdered.map(k => fieldLabels[k] || k),
        ...docKeysPresent.map(k => fieldLabels[k] || k),
    ];
    XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A1' });

    // Filas de datos
    submissions.forEach((s, rowIdx) => {
        const baseValues = [
            formatDate(s.createdAt),
            formTypeLabels[s.form?.type] || s.form?.type || 'N/A',
            s.fullName || s.data?.nombreCompleto || 'N/A',
            s.email || s.data?.correoElectronico || 'N/A',
            s.phone || s.data?.telefono || s.data?.telefonoWhatsapp || 'N/A',
            s.documentNumber || s.data?.documentoIdentidad || 'N/A',
        ];

        const dataValues = dataKeysOrdered.map(key => fieldToText(s.data?.[key]));

        // Para documentos: agregar hipervínculo si hay URL
        const row: any[] = [...baseValues, ...dataValues];
        const excelRow = rowIdx + 2; // +2 porque fila 1 es el header

        XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${excelRow}` });

        // Columnas de documentos con hipervínculos
        docKeysPresent.forEach((docKey, docColIdx) => {
            const colIdx = baseKeys.length + dataKeysOrdered.length + docColIdx;
            const url = extractUrl(s.data?.[docKey]);
            const colLetter = XLSX.utils.encode_col(colIdx);
            const cellRef = `${colLetter}${excelRow}`;

            if (url) {
                ws[cellRef] = {
                    t: 's',
                    v: 'Ver Documento',
                    l: { Target: url, Tooltip: 'Abrir documento en Cloudinary' },
                };
            } else {
                ws[cellRef] = { t: 's', v: 'Sin documento' };
            }
        });
    });

    // Ajustar ancho de columnas automáticamente
    const maxCols = headerRow.length;
    ws['!cols'] = Array.from({ length: maxCols }, (_, i) => {
        const colLetter = XLSX.utils.encode_col(i);
        let maxWidth = headerRow[i]?.length || 10;
        submissions.forEach((_, rowIdx) => {
            const cellRef = `${colLetter}${rowIdx + 2}`;
            const cell = ws[cellRef];
            if (cell && cell.v) {
                const len = String(cell.v).length;
                if (len > maxWidth) maxWidth = len;
            }
        });
        return { wch: Math.min(maxWidth + 4, 60) };
    });

    // Definir rango
    ws['!ref'] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: submissions.length, c: headerRow.length - 1 },
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Formularios');
    XLSX.writeFile(wb, filename || `tincadia_formularios_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Descarga completa: Excel con todos los datos + ZIP de Cloudinary con los PDFs
 * Ambas descargas se disparan en paralelo con un solo click
 */
export const downloadCompletePackage = async (
    submissions: FormSubmission[],
    token: string | null,
    onProgress?: (step: 'excel' | 'zip' | 'done' | 'error', message?: string) => void
): Promise<void> => {
    if (submissions.length === 0) return;

    // 1. Generar Excel inmediatamente (sincrónico, browser-side)
    onProgress?.('excel', 'Generando Excel...');
    const filename = `tincadia_${submissions.length}_solicitudes_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(submissions, filename);

    // 2. Pedir ZIP al backend y abrir la URL de Cloudinary
    const emails = submissions
        .map(s => s.email || s.data?.correoElectronico)
        .filter((e): e is string => !!e);

    if (emails.length === 0) {
        onProgress?.('done', 'Excel descargado. No había emails para el ZIP.');
        return;
    }

    try {
        onProgress?.('zip', 'Generando ZIP de documentos...');
        const response = await fetch(buildUrl(FORMS_ENDPOINTS.DOWNLOAD_BATCH), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emails }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Error al generar el ZIP');
        }

        const data = await response.json();
        if (data.url) {
            window.open(data.url, '_blank');
        }
        onProgress?.('done');
    } catch (err: any) {
        onProgress?.('error', err.message || 'Error al generar el ZIP de documentos');
    }
};
