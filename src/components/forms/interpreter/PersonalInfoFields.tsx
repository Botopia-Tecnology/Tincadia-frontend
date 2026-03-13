'use client';

export function PersonalInfoFields({ formik, handleDocumentBlur, t }: any) {
    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
                    1. {t('forms.interpreter.fields.fullName')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nombreCompleto}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.nombreCompleto && formik.errors.nombreCompleto ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formik.touched.nombreCompleto && formik.errors.nombreCompleto && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.nombreCompleto}</p>
                )}
            </div>

            <div>
                <label htmlFor="documentoIdentidad" className="block text-sm font-semibold text-gray-700 mb-2">
                    2. {t('forms.interpreter.fields.documentId')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <input
                    id="documentoIdentidad"
                    name="documentoIdentidad"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={handleDocumentBlur}
                    value={formik.values.documentoIdentidad}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.documentoIdentidad && formik.errors.documentoIdentidad ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formik.touched.documentoIdentidad && formik.errors.documentoIdentidad && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.documentoIdentidad}</p>
                )}
            </div>

            <div>
                <label htmlFor="ciudadResidencia" className="block text-sm font-semibold text-gray-700 mb-2">
                    3. {t('forms.interpreter.fields.city')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <input
                    id="ciudadResidencia"
                    name="ciudadResidencia"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ciudadResidencia}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.ciudadResidencia && formik.errors.ciudadResidencia ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formik.touched.ciudadResidencia && formik.errors.ciudadResidencia && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.ciudadResidencia}</p>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="telefonoWhatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                        4. {t('forms.interpreter.fields.phone')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <input
                        id="telefonoWhatsapp"
                        name="telefonoWhatsapp"
                        type="tel"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.telefonoWhatsapp}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.telefonoWhatsapp && formik.errors.telefonoWhatsapp ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formik.touched.telefonoWhatsapp && formik.errors.telefonoWhatsapp && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.telefonoWhatsapp}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="correoElectronico" className="block text-sm font-semibold text-gray-700 mb-2">
                        5. {t('forms.interpreter.fields.email')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <input
                        id="correoElectronico"
                        name="correoElectronico"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.correoElectronico}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:border-transparent ${formik.touched.correoElectronico && formik.errors.correoElectronico ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formik.touched.correoElectronico && formik.errors.correoElectronico && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.correoElectronico}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
