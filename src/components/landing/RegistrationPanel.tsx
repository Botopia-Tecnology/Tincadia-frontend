'use client';

import { useState } from 'react';
import { X, Facebook, Chrome } from 'lucide-react';
import Link from 'next/link';

interface RegistrationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export function RegistrationPanel({ isOpen, onClose, initialEmail = '' }: RegistrationPanelProps) {
  const [email, setEmail] = useState(initialEmail);
  const [showEmailForm, setShowEmailForm] = useState(true); // Mostrar formulario completo por defecto
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
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar que acepte las políticas
    if (!formData.aceptaPoliticas) {
      alert('Debes aceptar las políticas de Tincadia');
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
          onClick={onClose}
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
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar panel de registro"
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
                    Únete a TINCADIA y descubre nuestras soluciones
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
                      placeholder="Escribe tu correo electrónico"
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
                    Continuar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Social Login Options */}
                <div className="pt-6">
                  <p className="text-sm text-gray-500 text-center mb-4">o continúa con</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSocialLogin('facebook')}
                      className="flex-1 flex items-center justify-center px-3 py-3 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166FE5] transition-colors"
                      title="Continuar con Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleSocialLogin('google')}
                      className="flex-1 flex items-center justify-center px-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      title="Continuar con Google"
                    >
                      <Chrome className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleSocialLogin('microsoft')}
                      className="flex-1 flex items-center justify-center px-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      title="Continuar con Microsoft"
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
                    Crea tu cuenta
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
                    placeholder="Nombre"
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
                    placeholder="Apellido"
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
                    <option value="">Tipo</option>
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
                    placeholder="Número"
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
                    placeholder="Teléfono"
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
                    placeholder="Correo electrónico"
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
                    placeholder="Contraseña"
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
                    placeholder="Confirmar contraseña"
                    required
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">Las contraseñas no coinciden</p>
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
                    Acepto las{' '}
                    <Link href="#politicas" className="text-[#83A98A] hover:underline">
                      políticas de Tincadia
                    </Link>{' '}
                    y el{' '}
                    <Link href="#datos" className="text-[#83A98A] hover:underline">
                      uso de datos personales
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  Crear cuenta
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors text-center"
                >
                  ← Volver
                </button>
              </form>
            )}

            {/* Terms - Solo mostrar si no está en el formulario completo */}
            {!showEmailForm && (
              <p className="mt-8 text-xs text-gray-500 text-center">
                Al continuar, aceptas nuestros{' '}
                <Link href="#terminos" className="text-[#83A98A] hover:underline">
                  Términos de servicio
                </Link>{' '}
                y{' '}
                <Link href="#privacidad" className="text-[#83A98A] hover:underline">
                  Política de privacidad
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

