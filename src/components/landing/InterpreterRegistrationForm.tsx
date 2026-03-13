'use client';

import { X, CheckCircle2 } from 'lucide-react';
import { useInterpreterForm } from '@/hooks/useInterpreterForm';

// Sub-components
import { PersonalInfoFields } from '../forms/interpreter/PersonalInfoFields';
import { AcademicExperienceFields } from '../forms/interpreter/AcademicExperienceFields';
import { FileUploadFields } from '../forms/interpreter/FileUploadFields';
import { AuthorizationFooter } from '../forms/interpreter/AuthorizationFooter';

interface InterpreterRegistrationFormProps {
    initialData?: any;
    submissionId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function InterpreterRegistrationForm({
    initialData,
    submissionId,
    onSuccess,
    onCancel
}: InterpreterRegistrationFormProps = {}) {
    const isEditing = !!submissionId;
    const {
        formik,
        options,
        otraAreaEspecialidad,
        setOtraAreaEspecialidad,
        otroTipoServicio,
        setOtroTipoServicio,
        formIdError,
        submitStatus,
        setSubmitStatus,
        fileErrors,
        handleDocumentBlur,
        handleCheckboxChange,
        handleFileChange,
        t
    } = useInterpreterForm({ initialData, submissionId, onSuccess });

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden border border-gray-100">
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all z-10"
                >
                    <X className="w-6 h-6" />
                </button>
            )}

            <div className="mb-10 relative">
                <div className="absolute -left-12 top-0 w-1 bg-[#83A98A] h-full rounded-full hidden lg:block" />
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    {isEditing ? 'Editar Solicitud' : t('registration.interpreterForm.formTitle')}
                </h2>
                <p className="text-lg text-gray-500 font-medium">
                    {isEditing ? 'Actualiza tu perfil profesional' : t('registration.interpreterForm.formDescription')}
                </p>
            </div>

            {submitStatus === 'success' ? (
                <div className="bg-green-50/50 border border-green-100 rounded-3xl p-12 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        ¡{isEditing ? 'Actualización Exitosa' : 'Solicitud Enviada'}!
                    </h3>
                    <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                        {isEditing 
                            ? 'Tu información ha sido actualizada correctamente en nuestro sistema.' 
                            : 'Hemos recibido tu información. Nuestro equipo la revisará y te contactará pronto.'}
                    </p>
                    <button
                        onClick={isEditing ? onSuccess : () => setSubmitStatus('idle')}
                        className="px-8 py-3 bg-[#83A98A] text-white font-bold rounded-xl hover:bg-[#6e9175] transition-all shadow-lg shadow-[#83A98A]/20"
                    >
                        {isEditing ? 'Volver al Perfil' : 'Enviar otra solicitud'}
                    </button>
                </div>
            ) : (
                <form onSubmit={formik.handleSubmit} className="space-y-12">
                    <section className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#83A98A] flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-[#83A98A]/20" />
                            Información Básica
                        </h3>
                        <PersonalInfoFields formik={formik} handleDocumentBlur={handleDocumentBlur} t={t} />
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#83A98A] flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-[#83A98A]/20" />
                            Perfil Profesional
                        </h3>
                        <AcademicExperienceFields 
                            formik={formik} 
                            options={options} 
                            otraAreaEspecialidad={otraAreaEspecialidad}
                            setOtraAreaEspecialidad={setOtraAreaEspecialidad}
                            handleCheckboxChange={handleCheckboxChange}
                            otroTipoServicio={otroTipoServicio}
                            setOtroTipoServicio={setOtroTipoServicio}
                            t={t} 
                        />
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#83A98A] flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-[#83A98A]/20" />
                            Documentación y Enlaces
                        </h3>
                        <FileUploadFields 
                            formik={formik} 
                            handleFileChange={handleFileChange} 
                            fileErrors={fileErrors} 
                            t={t} 
                        />
                    </section>

                    <AuthorizationFooter 
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
