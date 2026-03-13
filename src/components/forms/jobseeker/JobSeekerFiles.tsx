'use client';

import { FileText, Upload } from 'lucide-react';

export function JobSeekerFiles({ formik, handleFileChange, fileError, t }: any) {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    13. {t('forms.jobSeeker.fields.certifications')}
                    <span className="block text-xs font-normal text-gray-500 mt-1">(PDF, Máximo 50MB)</span>
                </label>
                <div className="relative">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange('certificacionesCursos', e.target.files?.[0] || null)}
                        className="hidden"
                        id="certificacionesCursos"
                    />
                    <label
                        htmlFor="certificacionesCursos"
                        className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#83A98A] hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                        <Upload className={`w-8 h-8 ${formik.values.certificacionesCursos ? 'text-[#83A98A]' : 'text-gray-400 group-hover:text-[#83A98A]'}`} />
                        <span className="text-sm font-medium text-gray-600">
                            {formik.values.certificacionesCursos ? formik.values.certificacionesCursos.name : t('forms.jobSeeker.fields.selectFile')}
                        </span>
                    </label>
                </div>
                {fileError && <p className="text-red-500 text-xs mt-2">{fileError}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    14. {t('forms.jobSeeker.fields.uploadCV')} <span className="text-red-500">{t('forms.common.required')}</span>
                    <span className="block text-xs font-normal text-gray-500 mt-1">(PDF, Máximo 50MB)</span>
                </label>
                <div className="relative">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange('hojaVida', e.target.files?.[0] || null)}
                        className="hidden"
                        id="hojaVida"
                    />
                    <label
                        htmlFor="hojaVida"
                        className={`flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed rounded-xl hover:bg-gray-50 transition-all cursor-pointer group ${formik.touched.hojaVida && formik.errors.hojaVida ? 'border-red-400 bg-red-50/30' : 'border-gray-200 hover:border-[#83A98A]'}`}
                    >
                        <FileText className={`w-8 h-8 ${formik.values.hojaVida ? 'text-[#83A98A]' : 'text-gray-400 group-hover:text-[#83A98A]'}`} />
                        <span className="text-sm font-medium text-gray-600">
                            {formik.values.hojaVida ? formik.values.hojaVida.name : t('forms.jobSeeker.fields.selectFile')}
                        </span>
                    </label>
                </div>
                {formik.touched.hojaVida && formik.errors.hojaVida && <p className="text-red-500 text-xs mt-2">{formik.errors.hojaVida}</p>}
            </div>
        </div>
    );
}
