'use client';

export function EducationWorkInfo({ formik, options, otraAreaLaboral, setOtraAreaLaboral, handleCheckboxChange, t }: any) {
    return (
        <div className="space-y-8">
            <div>
                <label htmlFor="nivelEducativo" className="block text-sm font-semibold text-gray-700 mb-2">
                    8. {t('forms.jobSeeker.fields.educationLevel')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <select
                    id="nivelEducativo"
                    name="nivelEducativo"
                    value={formik.values.nivelEducativo}
                    onChange={formik.handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none transition-all"
                >
                    <option value="">{t('forms.common.selectOption')}</option>
                    {options.educationLevels.map((nivel: string) => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    9. {t('forms.jobSeeker.fields.workArea')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                    {options.workAreas.map((area: string) => (
                        <label key={area} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={formik.values.areaLaboralInteres.includes(area)}
                                onChange={() => handleCheckboxChange(area)}
                                className="w-4 h-4 text-[#83A98A] rounded"
                            />
                            <span className="text-sm text-gray-700">{area}</span>
                        </label>
                    ))}
                </div>
                {formik.values.areaLaboralInteres.includes(options.workAreas[options.workAreas.length - 1]) && (
                    <input
                        type="text"
                        value={otraAreaLaboral}
                        onChange={(e) => setOtraAreaLaboral(e.target.value)}
                        placeholder={t('forms.jobSeeker.fields.specifyOther')}
                        className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                    />
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <label htmlFor="experienciaLaboral" className="block text-sm font-semibold text-gray-700 mb-2">
                        10. {t('forms.jobSeeker.fields.workExperience')} <span className="text-red-500">{t('forms.common.required')}</span>
                    </label>
                    <textarea
                        id="experienciaLaboral"
                        name="experienciaLaboral"
                        value={formik.values.experienciaLaboral}
                        onChange={formik.handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none resize-none"
                        placeholder={t('forms.jobSeeker.fields.describeExperience')}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="habilidadesTecnicas" className="block text-sm font-semibold text-gray-700 mb-2">
                            11. {t('forms.jobSeeker.fields.technicalSkills')} <span className="text-red-500">{t('forms.common.required')}</span>
                        </label>
                        <textarea
                            id="habilidadesTecnicas"
                            name="habilidadesTecnicas"
                            value={formik.values.habilidadesTecnicas}
                            onChange={formik.handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none resize-none"
                            placeholder={t('forms.jobSeeker.fields.describeTechnical')}
                        />
                    </div>
                    <div>
                        <label htmlFor="habilidadesBlandas" className="block text-sm font-semibold text-gray-700 mb-2">
                            12. {t('forms.jobSeeker.fields.softSkills')} <span className="text-red-500">{t('forms.common.required')}</span>
                        </label>
                        <textarea
                            id="habilidadesBlandas"
                            name="habilidadesBlandas"
                            value={formik.values.habilidadesBlandas}
                            onChange={formik.handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none resize-none"
                            placeholder={t('forms.jobSeeker.fields.describeSoft')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
