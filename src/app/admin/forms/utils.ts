import { FormSubmission } from './types';
import { formTypeLabels } from './constants';

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

