'use client';

import { FormikProps } from 'formik';
import { JobSeekerFormData } from '@/hooks/useJobSeekerForm';

interface DisabilityInfoProps {
    formik: FormikProps<JobSeekerFormData>;
    options: Record<string, string[]>;
    t: (key: string) => string;
}

export function DisabilityInfo({ formik, options, t }: DisabilityInfoProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div>
                <label htmlFor="tipoDiscapacidad" className="block text-sm font-semibold text-gray-700 mb-2">
                    3. {t('forms.jobSeeker.fields.disabilityType')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <select
                    id="tipoDiscapacidad"
                    name="tipoDiscapacidad"
                    value={(formik.values.tipoDiscapacidad as string) || ''}
                    onChange={formik.handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                >
                    <option value="">{t('forms.common.selectOption')}</option>
                    {options.disabilityTypes.map((tipo: string) => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="usaLSC" className="block text-sm font-semibold text-gray-700 mb-2">
                    4. {t('forms.jobSeeker.fields.usesLSC')} <span className="text-red-500">{t('forms.common.required')}</span>
                </label>
                <select
                    id="usaLSC"
                    name="usaLSC"
                    value={(formik.values.usaLSC as string) || ''}
                    onChange={formik.handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] outline-none"
                >
                    <option value="">{t('forms.common.selectOption')}</option>
                    {options.lscLevels.map((nivel: string) => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
