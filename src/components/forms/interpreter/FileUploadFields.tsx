'use client';

import { FileText, Upload, Link as LinkIcon } from 'lucide-react';

export function FileUploadFields({ formik, handleFileChange, fileErrors, t }: any) {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
                {/* CV Upload */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        12. {t('forms.interpreter.fields.uploadCV')} <span className="text-red-500">{t('forms.common.required')}</span>
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
                                {formik.values.hojaVida ? formik.values.hojaVida.name : t('forms.interpreter.fields.selectFile')}
                            </span>
                        </label>
                    </div>
                    {formik.touched.hojaVida && formik.errors.hojaVida && <p className="text-red-500 text-xs mt-2">{formik.errors.hojaVida}</p>}
                    {fileErrors.hojaVida && <p className="text-red-500 text-xs mt-2">{fileErrors.hojaVida}</p>}
                </div>

                {/* Certifications Upload */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        13. {t('forms.interpreter.fields.certifications')}
                        <span className="block text-xs font-normal text-gray-500 mt-1">(PDF/JPG/PNG, Máximo 50MB)</span>
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('certificaciones', e.target.files?.[0] || null)}
                            className="hidden"
                            id="certificaciones"
                        />
                        <label
                            htmlFor="certificaciones"
                            className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#83A98A] hover:bg-gray-50 transition-all cursor-pointer group"
                        >
                            <Upload className={`w-8 h-8 ${formik.values.certificaciones ? 'text-[#83A98A]' : 'text-gray-400 group-hover:text-[#83A98A]'}`} />
                            <span className="text-sm font-medium text-gray-600">
                                {formik.values.certificaciones ? formik.values.certificaciones.name : t('forms.interpreter.fields.selectFile')}
                            </span>
                        </label>
                    </div>
                </div>
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
