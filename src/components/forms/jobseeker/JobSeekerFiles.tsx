'use client';

import { FileText, Upload, X } from 'lucide-react';

export function JobSeekerFiles({ formik, handleFileChange, fileError, t }: any) {
    const renderFileUpload = (field: string, labelKey: string, isRequired: boolean = false) => {
        const file = formik.values[field];
        const hasFile = !!file;
        const fileName = file?.name || (typeof file === 'string' ? file.split('/').pop() : '');

        return (
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(labelKey)} {isRequired && <span className="text-red-500">{t('forms.common.required')}</span>}
                    <span className="block text-xs font-normal text-gray-500 mt-1">(PDF, Máximo 50MB)</span>
                </label>
                <div className="relative group">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                        className="hidden"
                        id={field}
                    />
                    <label
                        htmlFor={field}
                        className={`flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer bg-white ${
                            hasFile 
                                ? 'border-[#83A98A] bg-[#83A98A]/5' 
                                : (formik.touched[field] && formik.errors[field] ? 'border-red-400 bg-red-50/30' : 'border-gray-200 hover:border-[#83A98A] hover:bg-gray-50')
                        }`}
                    >
                        {hasFile ? (
                            <div className="flex flex-col items-center gap-2">
                                <FileText className="w-8 h-8 text-[#83A98A]" />
                                <span className="text-sm font-medium text-[#2D4A33] text-center line-clamp-1 max-w-[200px]">
                                    {fileName}
                                </span>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#83A98A]" />
                                <span className="text-sm font-medium text-gray-600">
                                    {t('forms.jobSeeker.fields.selectFile')}
                                </span>
                            </>
                        )}
                    </label>

                    {hasFile && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                formik.setFieldValue(field, null);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm z-10"
                            title="Eliminar archivo"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {formik.touched[field] && formik.errors[field] && (
                    <p className="text-red-500 text-xs mt-2">{formik.errors[field] as string}</p>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-1 gap-8">
                {renderFileUpload('certificacionesCursos', 'forms.jobSeeker.fields.certifications')}
                {renderFileUpload('hojaVida', 'forms.jobSeeker.fields.uploadCV', true)}
                {renderFileUpload('certificacionDiscapacidad', 'forms.jobSeeker.fields.disabilityCert')}
            </div>
            {fileError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-500 text-sm text-center font-medium">{fileError}</p>
                </div>
            )}
        </div>
    );
}
