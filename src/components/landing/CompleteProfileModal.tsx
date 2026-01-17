'use client';

/**
 * Complete Profile Modal
 * 
 * Shown to OAuth users who have incomplete profiles.
 * Collects required fields: document type, document number, and phone.
 */

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { DOCUMENT_TYPES, type DocumentTypeId } from '@/types/auth.types';
import { GridBackground } from '@/components/ui/GridBackground';

interface CompleteProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const COUNTRIES = [
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
];

export function CompleteProfileModal({ isOpen, onClose }: CompleteProfileModalProps) {
    const t = useTranslation();
    const { user, updateProfile, isLoading, error, clearError, profileComplete } = useAuth();

    const [formData, setFormData] = useState({
        documentTypeId: '' as string | DocumentTypeId,
        documentNumber: '',
        phone: '',
    });
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Don't render if profile is already complete
    if (profileComplete || !user) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'documentTypeId') {
            setFormData(prev => ({ ...prev, [name]: value ? Number(value) as DocumentTypeId : '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        clearError();

        // Validate required fields
        if (!formData.documentTypeId || !formData.documentNumber || !formData.phone) {
            setFormError('Por favor completa todos los campos requeridos');
            return;
        }

        setIsSubmitting(true);

        try {
            await updateProfile({
                documentTypeId: formData.documentTypeId as number,
                documentNumber: formData.documentNumber,
                phone: `${selectedCountry.dialCode}${formData.phone}`,
            });
            onClose();
        } catch (err) {
            if (err instanceof Error) {
                setFormError(err.message);
            } else {
                setFormError('Error al actualizar el perfil');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayError = formError || error;

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay - no close on click, modal is required */}
            <div
                className="fixed inset-0 bg-black/60 z-50 transition-opacity"
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                    <GridBackground className="absolute inset-0 -z-10" />

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Completa tu perfil
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Necesitamos algunos datos adicionales
                            </p>
                        </div>
                        {/* Optional close button - can be hidden if modal is required */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Welcome message with user name */}
                        <div className="bg-[#83A98A]/10 rounded-lg p-4">
                            <p className="text-sm text-gray-700">
                                ¡Hola <strong>{user.firstName}</strong>! Has iniciado sesión correctamente.
                                Para continuar, por favor completa la siguiente información.
                            </p>
                        </div>

                        {/* Document Type */}
                        <div>
                            <label htmlFor="documentTypeId" className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de documento *
                            </label>
                            <select
                                id="documentTypeId"
                                name="documentTypeId"
                                value={formData.documentTypeId}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                            >
                                <option value="">Seleccionar tipo...</option>
                                {DOCUMENT_TYPES.map((docType) => (
                                    <option key={docType.id} value={docType.id}>
                                        {docType.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Document Number */}
                        <div>
                            <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Número de documento *
                            </label>
                            <input
                                type="text"
                                id="documentNumber"
                                name="documentNumber"
                                value={formData.documentNumber}
                                onChange={handleInputChange}
                                required
                                placeholder="Ej: 1234567890"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono *
                            </label>
                            <div className="flex gap-2">
                                <select
                                    className="w-[120px] px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all bg-white"
                                    value={selectedCountry.code}
                                    onChange={(e) => {
                                        const country = COUNTRIES.find(c => c.code === e.target.value);
                                        if (country) setSelectedCountry(country);
                                    }}
                                >
                                    {COUNTRIES.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.flag} {country.dialCode}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="300 123 4567"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83A98A] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {displayError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{displayError}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full bg-[#83A98A] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#6D8F75] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    Completar perfil
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CompleteProfileModal;
