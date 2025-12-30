import { FormFieldRenderer } from './FormFieldRenderer';
import { fieldLabels, fieldCategories } from '../constants';

interface OrganizedDataRendererProps {
    data: Record<string, any>;
}

export function OrganizedDataRenderer({ data }: OrganizedDataRendererProps) {
    const categorizedFields: Record<string, Array<[string, any]>> = {};
    const uncategorizedFields: Array<[string, any]> = [];

    // Categorize fields
    Object.entries(data).forEach(([key, value]) => {
        let found = false;
        for (const [category, fields] of Object.entries(fieldCategories)) {
            if (fields.includes(key)) {
                if (!categorizedFields[category]) {
                    categorizedFields[category] = [];
                }
                categorizedFields[category].push([key, value]);
                found = true;
                break;
            }
        }
        if (!found) {
            uncategorizedFields.push([key, value]);
        }
    });

    return (
        <div className="space-y-4">
            {/* Render categorized fields */}
            {Object.entries(categorizedFields).map(([category, fields]) => (
                <div key={category} className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wide">
                        {category}
                    </h4>
                    <div className="space-y-3">
                        {fields.map(([key, value]) => (
                            <div key={key} className="border-l-2 border-blue-600/30 pl-3">
                                <span className="text-xs text-slate-500 uppercase block mb-1">
                                    {fieldLabels[key] || key}
                                </span>
                                <div className="text-slate-200 break-words">
                                    <FormFieldRenderer key={key} fieldKey={key} value={value} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Render uncategorized fields */}
            {uncategorizedFields.length > 0 && (
                <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
                        Otros Datos
                    </h4>
                    <div className="space-y-3">
                        {uncategorizedFields.map(([key, value]) => (
                            <div key={key} className="border-l-2 border-slate-700 pl-3">
                                <span className="text-xs text-slate-500 uppercase block mb-1">
                                    {fieldLabels[key] || key}
                                </span>
                                <div className="text-slate-200 break-words">
                                    <FormFieldRenderer key={key} fieldKey={key} value={value} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

