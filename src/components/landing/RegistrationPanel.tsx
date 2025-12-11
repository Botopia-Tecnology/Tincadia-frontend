'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { type CredentialResponse } from '@react-oauth/google';
import { useTranslation } from '@/hooks/useTranslation';
import { GridBackground } from '@/components/ui/GridBackground';
import { useAuth } from '@/contexts/AuthContext';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { RegistrationForm, type RegistrationFormData } from '@/components/auth/RegistrationForm';

interface RegistrationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export function RegistrationPanel({ isOpen, onClose, initialEmail = '' }: RegistrationPanelProps) {
  const t = useTranslation();
  const { register, loginWithOAuth, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setShowEmailForm(false);
      clearError();
      setFormError(null);
    }
  }, [isOpen, initialEmail, clearError]);

  const handleClose = () => {
    setEmail('');
    setShowEmailForm(false);
    setFormError(null);
    onClose();
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setFormError('No se recibió el token de Google');
      return;
    }

    setFormError(null);
    clearError();
    setOauthLoading(true);

    try {
      await loginWithOAuth('google', credentialResponse.credential);
      handleClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al registrarse con Google');
    } finally {
      setOauthLoading(false);
    }
  };

  const handleGoogleError = () => {
    setFormError('Error al conectar con Google. Intenta de nuevo.');
  };

  const handleOtherSocialLogin = () => {
    setFormError('OAuth con este proveedor aún no está disponible.');
  };

  const handleFormSubmit = async (formData: RegistrationFormData) => {
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
      handleClose();
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:bg-black/30 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-hidden`}
      >
        <GridBackground className="absolute inset-0 -z-10" />
        <div className="h-full flex flex-col overflow-y-auto relative z-10">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={t('registration.panel.closeLabel')}
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 px-6 pb-6">
            {!showEmailForm ? (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  {t('registration.panel.title')}
                </h2>

                <div className="space-y-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors pb-2"
                    placeholder={t('registration.panel.emailPlaceholder')}
                  />

                  <button
                    onClick={() => email && setShowEmailForm(true)}
                    disabled={!email}
                    className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {t('registration.panel.continueButton')}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {formError}
                  </div>
                )}

                <div className="pt-6">
                  <p className="text-sm text-gray-500 text-center mb-4">
                    {t('registration.panel.orContinueWith')}
                  </p>
                  <SocialLoginButtons
                    onGoogleSuccess={handleGoogleSuccess}
                    onGoogleError={handleGoogleError}
                    onAppleClick={handleOtherSocialLogin}
                    onMicrosoftClick={handleOtherSocialLogin}
                    disabled={oauthLoading}
                    googleText="signup_with"
                  />
                </div>

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
              </div>
            ) : (
              <RegistrationForm
                email={email}
                onEmailChange={setEmail}
                onSubmit={handleFormSubmit}
                onBack={() => setShowEmailForm(false)}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
