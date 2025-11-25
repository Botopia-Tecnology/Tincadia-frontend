'use client';

import { useState, useEffect } from 'react';
import { X, Facebook, Chrome } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

interface RegistrationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export function RegistrationPanel({ isOpen, onClose, initialEmail = '' }: RegistrationPanelProps) {
  const t = useTranslation();
  // Si hay un email inicial, mostrar directamente el formulario completo
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    aceptaPoliticas: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialEmail) {
        setEmail(initialEmail);
        setShowEmailForm(false); // Mostrar primero la pantalla inicial con el email prellenado
      } else {
        setEmail('');
        setShowEmailForm(false);
      }
    }
  }, [isOpen, initialEmail]);

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

  const handleSocialLogin = (provider: 'facebook' | 'google' | 'microsoft') => {
    console.log(`Login con ${provider}`);
    // Aquí iría la lógica de autenticación social
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert(t('registration.panel.passwordMismatch'));
      return;
    }

    // Validar que acepte las políticas
    if (!formData.aceptaPoliticas) {
      alert(t('registration.panel.acceptPolicies') + ' ' + t('registration.panel.policiesLink'));
      return;
    }

    console.log('Registro con email:', {
      email,
      ...formData,
    });
    // Aquí iría la lógica de registro con email
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
        className={`fixed top-0 right-0 h-full w-full lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
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
                      onClick={() => handleSocialLogin('facebook')}
                      className="flex-1 flex items-center justify-center px-3 py-3 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166FE5] transition-colors"
                      title={t('registration.panel.facebook')}
                    >
                      <Facebook className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleSocialLogin('google')}
                      className="flex-1 flex items-center justify-center px-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      title={t('registration.panel.google')}
                    >
                      <Chrome className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleSocialLogin('microsoft')}
                      className="flex-1 flex items-center justify-center px-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      title={t('registration.panel.microsoft')}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
                        <path fill="#F25022" d="M0 0h11v11H0z"/>
                        <path fill="#00A4EF" d="M12 0h11v11H12z"/>
                        <path fill="#7FBA00" d="M0 12h11v11H0z"/>
                        <path fill="#FFB900" d="M12 12h11v11H12z"/>
                      </svg>
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
                    <option value="cc">Cédula de Ciudadanía</option>
                    <option value="ce">Cédula de Extranjería</option>
                    <option value="pasaporte">Pasaporte</option>
                    <option value="ti">Tarjeta de Identidad</option>
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
                    className={`w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 border-0 border-b pb-2 focus:outline-none transition-colors ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
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
                  className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  {t('registration.panel.createAccountButton')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors text-center"
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

