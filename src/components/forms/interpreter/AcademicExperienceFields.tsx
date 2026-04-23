'use client';

export function AcademicExperienceFields({ 
    formik, 
    options, 
    otraAreaEspecialidad, 
    setOtraAreaEspecialidad, 
    handleCheckboxChange, 
    otroTipoServicio, 
    setOtroTipoServicio, 
    t 
}: any) {
    return (
        <div className="space-y-8">
            {/* 6. ¿Eres intérprete certificado? */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                    6. {t('forms.interpreter.fields.isCertified')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <div className="flex gap-8">
                    {['si', 'no'].map((val) => (
                        <label key={val} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="esInterpreteCertificado"
                                    value={val}
                                    checked={formik.values.esInterpreteCertificado === val}
                                    onChange={formik.handleChange}
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#83A98A] transition-all"
                                />
                                <div className="absolute w-2.5 h-2.5 bg-[#83A98A] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                            </div>
                            <span className="text-gray-700 font-medium">{t(`forms.common.${val === 'si' ? 'yes' : 'no'}`)}</span>
                        </label>
                    ))}
                </div>
                {formik.touched.esInterpreteCertificado && formik.errors.esInterpreteCertificado && (
                    <p className="text-red-500 text-sm mt-2">{formik.errors.esInterpreteCertificado}</p>
                )}
            </div>

            {/* 7 & 8. Academic & Experience */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nivelAcademico" className="block text-sm font-semibold text-gray-700 mb-2">
                        7. {t('forms.interpreter.fields.academicLevel')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <select
                        id="nivelAcademico"
                        name="nivelAcademico"
                        value={formik.values.nivelAcademico}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none transition-all"
                    >
                        <option value="">{t('forms.common.selectOption')}</option>
                        {options.academicLevels.map((nivel: string) => (
                            <option key={nivel} value={nivel}>{nivel}</option>
                        ))}
                    </select>
                    {(formik.values.nivelAcademico.toLowerCase().includes('indique')) && (
                        <input
                            type="text"
                            name="nivelAcademicoDetalle"
                            value={formik.values.nivelAcademicoDetalle}
                            onChange={formik.handleChange}
                            placeholder={t('forms.interpreter.fields.academicDetail')}
                            className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                        />
                    )}
                </div>

                <div>
                    <label htmlFor="nivelExperiencia" className="block text-sm font-semibold text-gray-700 mb-2">
                        8. {t('forms.interpreter.fields.experienceLevel')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <select
                        id="nivelExperiencia"
                        name="nivelExperiencia"
                        value={formik.values.nivelExperiencia}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                    >
                        <option value="">{t('forms.common.selectOption')}</option>
                        {options.experienceLevels.map((nivel: string) => (
                            <option key={nivel} value={nivel}>{nivel}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 9. Specialty Areas */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    9. {t('forms.interpreter.fields.specialtyAreas')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                    {options.specialtyAreas.map((area: string) => (
                        <label key={area} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={formik.values.areasEspecialidad.includes(area)}
                                onChange={() => handleCheckboxChange('areasEspecialidad', area)}
                                className="w-4 h-4 text-[#83A98A] rounded focus:ring-[#83A98A]"
                            />
                            <span className="text-sm text-gray-700">{area}</span>
                        </label>
                    ))}
                </div>
                {formik.values.areasEspecialidad.includes(options.specialtyAreas[options.specialtyAreas.length - 1]) && (
                    <input
                        type="text"
                        value={otraAreaEspecialidad}
                        onChange={(e) => setOtraAreaEspecialidad(e.target.value)}
                        placeholder={t('forms.interpreter.fields.specifyOtherArea')}
                        className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                    />
                )}
            </div>

            {/* 10. Availability */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    10. {t('forms.interpreter.fields.availability')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                    {options.availability.map((disp: string) => (
                        <label key={disp} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={formik.values.disponibilidadHoraria.includes(disp)}
                                onChange={() => handleCheckboxChange('disponibilidadHoraria', disp)}
                                className="w-4 h-4 text-[#83A98A] rounded"
                            />
                            <span className="text-sm text-gray-700">{disp}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 11. Service Type */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    11. {t('forms.interpreter.fields.serviceType')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                    {options.serviceTypes.map((tipo: string) => (
                        <label key={tipo} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={formik.values.tipoServicio.includes(tipo)}
                                onChange={() => handleCheckboxChange('tipoServicio', tipo)}
                                className="w-4 h-4 text-[#83A98A] rounded"
                            />
                            <span className="text-sm text-gray-700">{tipo}</span>
                        </label>
                    ))}
                </div>
                {formik.values.tipoServicio.includes(options.serviceTypes[options.serviceTypes.length - 1]) && (
                    <input
                        type="text"
                        value={otroTipoServicio}
                        onChange={(e) => setOtroTipoServicio(e.target.value)}
                        placeholder={t('forms.interpreter.fields.specifyOtherService')}
                        className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                    />
                )}
            </div>
        </div>
    );
}
