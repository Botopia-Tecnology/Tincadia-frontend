import { FileText } from 'lucide-react';

interface FormFieldRendererProps {
    fieldKey: string;
    value: any;
}

export function FormFieldRenderer({ fieldKey, value }: FormFieldRendererProps) {
    if (value === null || value === undefined) {
        return <span className="text-slate-500 italic">No especificado</span>;
    }

    // Handle arrays
    if (Array.isArray(value)) {
        return (
            <div className="flex flex-wrap gap-2">
                {value.map((item, index) => (
                    <span
                        key={index}
                        className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-sm"
                    >
                        {String(item)}
                    </span>
                ))}
            </div>
        );
    }

    // Handle objects (like hojaVida, certificaciones)
    if (typeof value === 'object') {
        // Check if it's a file object (has name, size, type properties)
        if (value.name || value.size || value.type) {
            const fileName = value.name || 'Archivo sin nombre';
            const fileSize = value.size ? `${(value.size / 1024).toFixed(2)} KB` : '';
            const fileType = value.type || 'Tipo desconocido';
            
            return (
                <div className="space-y-2">
                    {value.url ? (
                        <a
                            href={value.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 underline transition-colors"
                        >
                            <FileText size={16} />
                            <span>{fileName}</span>
                            <span className="text-xs text-slate-500">({fileSize})</span>
                        </a>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-300">
                            <FileText size={16} className="text-slate-500" />
                            <span>{fileName}</span>
                            {fileSize && <span className="text-xs text-slate-500">({fileSize})</span>}
                        </div>
                    )}
                    {!value.url && fileType && (
                        <div className="text-xs text-slate-500">
                            Tipo: {fileType}
                        </div>
                    )}
                </div>
            );
        }
        // For other objects, show as formatted JSON
        return (
            <pre className="text-xs bg-slate-800 p-2 rounded overflow-x-auto">
                {JSON.stringify(value, null, 2)}
            </pre>
        );
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
        return (
            <span className={`px-2 py-1 rounded text-sm ${value ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}>
                {value ? 'Sí' : 'No'}
            </span>
        );
    }

    // Handle string values with special formatting
    const stringValue = String(value);
    if (stringValue.toLowerCase() === 'si' || stringValue.toLowerCase() === 'sí') {
        return (
            <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-sm">
                Sí
            </span>
        );
    }
    if (stringValue.toLowerCase() === 'no') {
        return (
            <span className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-sm">
                No
            </span>
        );
    }

    return <span>{stringValue}</span>;
}

