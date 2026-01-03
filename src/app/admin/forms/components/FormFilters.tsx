import { FileText } from 'lucide-react';
import { FormSubmission } from '../types';
import { formTypeIcons, formTypeLabels } from '../constants';

interface FormFiltersProps {
    submissions: FormSubmission[];
    filterType: string;
    onFilterChange: (type: string) => void;
}

export function FormFilters({ submissions, filterType, onFilterChange }: FormFiltersProps) {
    const formTypes = [...new Set(submissions.map(s => s.form?.type).filter(Boolean))];

    return (
        <div className="flex gap-2 flex-wrap">
            <button
                onClick={() => onFilterChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
            >
                Todos ({submissions.length})
            </button>
            {formTypes.map((type) => {
                const count = submissions.filter(s => s.form?.type === type).length;
                const Icon = formTypeIcons[type] || FileText;
                const label = formTypeLabels[type] || type;
                return (
                    <button
                        key={type}
                        onClick={() => onFilterChange(type)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <Icon size={16} />
                        {label} ({count})
                    </button>
                );
            })}
        </div>
    );
}

