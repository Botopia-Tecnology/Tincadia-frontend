'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { GridBackground } from '@/components/ui/GridBackground';
import { useAuth } from '@/contexts/AuthContext';
import { DOCUMENT_TYPES, type DocumentTypeId } from '@/types/auth.types';

interface RegistrationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export function RegistrationPanel({ isOpen, onClose, initialEmail = '' }: RegistrationPanelProps) {
  const t = useTranslation();
  const { register, isLoading, error, clearError } = useAuth();

  // Si hay un email inicial, mostrar directamente el formulario completo
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: '' as string | DocumentTypeId,
    numeroDocumento: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    aceptaPoliticas: false,
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialEmail) {
        setEmail(initialEmail);
        setShowEmailForm(false); // Mostrar primero la pantalla inicial con el email prellenado
      } else {
        setEmail('');
        setShowEmailForm(false);
      }
      // Clear any previous errors
      clearError();
      setFormError(null);
    }
  }, [isOpen, initialEmail, clearError]);

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      tipoDocumento: '',
      numeroDocumento: '',
      telefono: '',
      password: '',
      confirmPassword: '',
      aceptaPoliticas: false,
    });
    setFormError(null);
    if (!initialEmail) {
      setShowEmailForm(false);
      setEmail('');
    }
  };

  // Manejar el cierre del panel
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSocialLogin = (provider: 'facebook' | 'google' | 'microsoft' | 'apple') => {
    console.log(`Login con ${provider}`);
    // Aquí iría la lógica de autenticación social
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'tipoDocumento') {
      // Convertir a número para documentTypeId
      setFormData((prev) => ({ ...prev, [name]: value ? Number(value) as DocumentTypeId : '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setFormError(t('registration.panel.passwordMismatch') as string);
      return;
    }

    // Validar que acepte las políticas
    if (!formData.aceptaPoliticas) {
      setFormError(`${t('registration.panel.acceptPolicies')} ${t('registration.panel.policiesLink')}`);
      return;
    }

    try {
      await register({
        email,
        password: formData.password,
        firstName: formData.nombre,
        lastName: formData.apellido,
        documentTypeId: formData.tipoDocumento ? Number(formData.tipoDocumento) : undefined,
        documentNumber: formData.numeroDocumento || undefined,
        phone: formData.telefono || undefined,
      });

      // Si el registro es exitoso, cerrar el panel
      handleClose();
    } catch (err) {
      // El error ya está manejado por el AuthContext
      console.error('Registration error:', err);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:bg-black/30 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-hidden`}
      >
        <GridBackground className="absolute inset-0 -z-10" />
        <div className="h-full flex flex-col overflow-y-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={t('registration.panel.closeLabel')}
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 pb-6">
            {!showEmailForm ? (
              <div className="space-y-8">
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    {t('registration.panel.title')}
                  </h2>
                </div>

                {/* Email Input */}
                <div className="space-y-6">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                      placeholder={t('registration.panel.emailPlaceholder')}
                    />
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      if (email) {
                        setShowEmailForm(true);
                      }
                    }}
                    disabled={!email}
                    className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {t('registration.panel.continueButton')}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Social Login Options */}
                <div className="pt-6">
                  <p className="text-sm text-gray-500 text-center mb-4">{t('registration.panel.orContinueWith')}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSocialLogin('google')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      title={t('registration.panel.google')}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="text-sm">Google</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin('apple')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      title={t('registration.panel.apple')}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <span className="text-sm">Apple</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin('microsoft')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      title={t('registration.panel.microsoft')}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                        <path fill="#F25022" d="M0 0h11v11H0z" />
                        <path fill="#00A4EF" d="M12 0h11v11H12z" />
                        <path fill="#7FBA00" d="M0 12h11v11H0z" />
                        <path fill="#FFB900" d="M12 12h11v11H12z" />
                      </svg>
                      <span className="text-sm">Microsoft</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('registration.panel.createAccount')}
                  </h2>
                </div>

                {/* Nombre */}
                <div>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.fullName')}
                    required
                  />
                </div>

                {/* Apellido */}
                <div>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.lastName')}
                    required
                  />
                </div>

                {/* Tipo de documento y número */}
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                    className="bg-transparent text-lg text-gray-900 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    required
                  >
                    <option value="">{t('registration.panel.documentType')}</option>
                    {DOCUMENT_TYPES.map((docType) => (
                      <option key={docType.id} value={docType.id}>
                        {docType.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleInputChange}
                    className="bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.documentNumber')}
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.phone')}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.email')}
                    required
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.password')}
                    required
                  />
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b pb-2 focus:outline-none transition-colors ${formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-300 focus:border-gray-900'
                      }`}
                    placeholder={t('registration.panel.confirmPassword')}
                    required
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{t('registration.panel.passwordMismatch')}</p>
                  )}
                </div>

                {/* Error Message */}
                {(formError || error) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {formError || error}
                  </div>
                )}

                {/* Checkbox de políticas */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="aceptaPoliticas"
                    name="aceptaPoliticas"
                    checked={formData.aceptaPoliticas}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[#83A98A] border-gray-300 rounded focus:ring-[#83A98A] cursor-pointer"
                    required
                  />
                  <label htmlFor="aceptaPoliticas" className="text-sm text-gray-700 cursor-pointer">
                    {t('registration.panel.acceptPolicies')}{' '}
                    <Link href="#politicas" className="text-[#83A98A] hover:underline">
                      {t('registration.panel.policiesLink')}
                    </Link>{' '}
                    {t('registration.panel.andDataUsage')}{' '}
                    <Link href="#datos" className="text-[#83A98A] hover:underline">
                      {t('registration.panel.dataUsageLink')}
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      {t('registration.panel.createAccountButton')}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  disabled={isLoading}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors text-center disabled:opacity-50"
                >
                  ← {t('common.back')}
                </button>
              </form>
            )}

            {/* Terms - Solo mostrar si no está en el formulario completo */}
            {!showEmailForm && (
              <p className="mt-8 text-xs text-gray-500 text-center">
                {t('registration.panel.terms')}{' '}
                <Link href="#terminos" className="text-[#83A98A] hover:underline">
                  {t('registration.panel.termsLink')}
                </Link>{' '}
                {t('registration.panel.and')}{' '}
                <Link href="#privacidad" className="text-[#83A98A] hover:underline">
                  {t('registration.panel.privacyLink')}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

