'use client';

import { FileText, Upload, Link as LinkIcon, X } from 'lucide-react';

export function FileUploadFields({ formik, handleFileChange, fileErrors, t }: any) {
    const renderFileUpload = (field: string, labelKey: string, isRequired: boolean = false, accept: string = ".pdf") => {
        const file = formik.values[field];
        const hasFile = !!file;
        const fileName = file?.name || (typeof file === 'string' ? file.split('/').pop() : '');

        return (
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(labelKey)} {isRequired && <span className="text-red-500">{t('forms.common.required')}</span>}
                    <span className="block text-xs font-normal text-gray-500 mt-1">({accept === ".pdf" ? "PDF" : "PDF/JPG/PNG"}, Máximo 50MB)</span>
                </label>
                <div className="relative group">
                    <input
                        type="file"
                        accept={accept}
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
                                    {field === 'hojaVida' ? t('forms.interpreter.fields.selectFilePDF') : t('forms.interpreter.fields.selectFileCert')}
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
                {(formik.touched[field] && formik.errors[field]) || fileErrors[field] ? (
                    <p className="text-red-500 text-xs mt-2">{((formik.touched[field] && formik.errors[field]) || fileErrors[field]) as string}</p>
                ) : null}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                {renderFileUpload('hojaVida', 'forms.interpreter.fields.uploadCV', true, '.pdf')}
                {renderFileUpload('certificaciones', 'forms.interpreter.fields.certifications', false, '.pdf,.jpg,.jpeg,.png')}
            </div>

            {/* Social / Portfolio */}
            <div>
                <label htmlFor="redesSocialesPortafolio" className="block text-sm font-semibold text-gray-700 mb-2">
                    14. {t('forms.interpreter.fields.socialMedia')}
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="redesSocialesPortafolio"
                        name="redesSocialesPortafolio"
                        type="url"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.redesSocialesPortafolio}
                        placeholder={t('forms.interpreter.fields.socialPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
