'use client';

export function JobSeekerPersonalInfo({ formik, handleDocumentBlur, t }: any) {
    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
                    1. {t('forms.jobSeeker.fields.fullName')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nombreCompleto}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none ${formik.touched.nombreCompleto && formik.errors.nombreCompleto ? 'border-red-500' : 'border-gray-300'}`}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="documentoIdentidad" className="block text-sm font-semibold text-gray-700 mb-2">
                        2. {t('forms.jobSeeker.fields.documentId')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <input
                        id="documentoIdentidad"
                        name="documentoIdentidad"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={handleDocumentBlur}
                        value={formik.values.documentoIdentidad}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none ${formik.touched.documentoIdentidad && formik.errors.documentoIdentidad ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </div>
                <div>
                    <label htmlFor="ciudadResidencia" className="block text-sm font-semibold text-gray-700 mb-2">
                        5. {t('forms.jobSeeker.fields.city')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <input
                        id="ciudadResidencia"
                        name="ciudadResidencia"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ciudadResidencia}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none ${formik.touched.ciudadResidencia && formik.errors.ciudadResidencia ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="telefonoWhatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                        6. {t('forms.jobSeeker.fields.phone')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <input
                        id="telefonoWhatsapp"
                        name="telefonoWhatsapp"
                        type="tel"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.telefonoWhatsapp}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="correoElectronico" className="block text-sm font-semibold text-gray-700 mb-2">
                        7. {t('forms.jobSeeker.fields.email')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <input
                        id="correoElectronico"
                        name="correoElectronico"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.correoElectronico}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
