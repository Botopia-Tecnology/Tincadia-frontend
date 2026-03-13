'use client';

import { X, CheckCircle2, Briefcase } from 'lucide-react';
import { useJobSeekerForm } from '@/hooks/useJobSeekerForm';

// Sub-components
import { JobSeekerPersonalInfo } from '../forms/jobseeker/JobSeekerPersonalInfo';
import { DisabilityInfo } from '../forms/jobseeker/DisabilityInfo';
import { EducationWorkInfo } from '../forms/jobseeker/EducationWorkInfo';
import { JobSeekerFiles } from '../forms/jobseeker/JobSeekerFiles';
import { JobSeekerFooter } from '../forms/jobseeker/JobSeekerFooter';

interface JobSeekerRegistrationFormProps {
    initialData?: any;
    submissionId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function JobSeekerRegistrationForm({
    initialData,
    submissionId,
    onSuccess,
    onCancel
}: JobSeekerRegistrationFormProps = {}) {
    const isEditing = !!submissionId;
    const {
        formik,
        options,
        otraAreaLaboral,
        setOtraAreaLaboral,
        formIdError,
        submitStatus,
        setSubmitStatus,
        fileError,
        handleDocumentBlur,
        handleCheckboxChange,
        handleFileChange,
        t
    } = useJobSeekerForm({ initialData, submissionId, onSuccess });

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden border border-slate-100">
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-all z-10"
                >
                    <X className="w-6 h-6" />
                </button>
            )}

            <header className="mb-12 relative">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                        <Briefcase className="w-8 h-8 text-[#83A98A]" />
                    </div>
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                            {isEditing ? 'Editar Solicitud' : t('registration.jobSeeker.formTitle')}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {isEditing ? 'Actualiza tu perfil laboral' : t('registration.jobSeeker.formDescription')}
                        </p>
                    </div>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-[#83A98A] to-transparent rounded-full" />
            </header>

            {submitStatus === 'success' ? (
                <div className="bg-green-50/50 border border-green-100 rounded-3xl p-12 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">
                        ¡{isEditing ? 'Actualización Exitosa' : 'Solicitud Enviada'}!
                    </h3>
                    <p className="text-slate-600 text-lg max-w-md mx-auto mb-8">
                        {isEditing 
                            ? 'Tu información laboral ha sido actualizada correctamente.' 
                            : 'Tu perfil ha sido registrado. Muy pronto nos pondremos en contacto contigo.'}
                    </p>
                    <button
                        onClick={isEditing ? onSuccess : () => setSubmitStatus('idle')}
                        className="px-8 py-3 bg-[#83A98A] text-white font-bold rounded-xl hover:bg-[#6e9175] transition-all shadow-lg"
                    >
                        {isEditing ? 'Volver al Perfil' : 'Enviar otra solicitud'}
                    </button>
                </div>
            ) : (
                <form onSubmit={formik.handleSubmit} className="space-y-12">
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#83A98A]/10 text-[#83A98A] flex items-center justify-center text-xs font-bold">1</span>
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#83A98A]">Datos Personales</h3>
                        </div>
                        <JobSeekerPersonalInfo formik={formik} handleDocumentBlur={handleDocumentBlur} t={t} />
                        <DisabilityInfo formik={formik} options={options} t={t} />
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#83A98A]/10 text-[#83A98A] flex items-center justify-center text-xs font-bold">2</span>
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#83A98A]">Educación y Experiencia</h3>
                        </div>
                        <EducationWorkInfo 
                            formik={formik} 
                            options={options} 
                            otraAreaLaboral={otraAreaLaboral}
                            setOtraAreaLaboral={setOtraAreaLaboral}
                            handleCheckboxChange={handleCheckboxChange}
                            t={t} 
                        />
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#83A98A]/10 text-[#83A98A] flex items-center justify-center text-xs font-bold">3</span>
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#83A98A]">Documentos Adjuntos</h3>
                        </div>
                        <JobSeekerFiles formik={formik} handleFileChange={handleFileChange} fileError={fileError} t={t} />
                    </section>

                    <JobSeekerFooter 
                        formik={formik} 
                        submitStatus={submitStatus} 
                        formIdError={formIdError} 
                        isEditing={isEditing} 
                        t={t} 
                    />
                </form>
            )}
        </div>
    );
}
