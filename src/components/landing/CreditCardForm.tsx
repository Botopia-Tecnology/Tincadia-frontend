import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreditCardFormProps {
    publicKey: string;
    reference: string;
    email: string;
    amountInCents: number;
    currency: string;
    planName?: string;
    period?: 'mensual' | 'anual';
    onSuccess: (data: any) => void;
    onError: (error: string) => void;
    onCancel: () => void;
    processPaymentResult: (token: string, acceptanceToken: string, installments: number) => Promise<any>;
    cardType?: 'credit' | 'debit';
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
    publicKey,
    reference,
    email,
    amountInCents,
    currency,
    planName = 'Plan Premium',
    period = 'mensual',
    onSuccess,
    onError,
    onCancel,
    processPaymentResult,
    cardType = 'credit'
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        number: '',
        cvc: '',
        expMonth: '',
        expYear: '',
        cardHolder: '',
        docType: 'CC',
        docNumber: '',
        installments: 1
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount / 100);
    };

    const [cardBrand, setCardBrand] = useState<{ name: string; logo: string } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'number') {
            // Remove non-digits
            const clean = value.replace(/\D/g, '');
            // Detect Brand
            if (clean.startsWith('4')) setCardBrand({ name: 'Visa', logo: 'https://res.cloudinary.com/do1mvhvms/image/upload/v1768520243/VISA-Logo_zhllqu.png' });
            else if (/^5[1-5]/.test(clean)) setCardBrand({ name: 'Mastercard', logo: 'https://res.cloudinary.com/do1mvhvms/image/upload/v1768520242/mastercard-logo_kecgyl.png' });
            else if (/^3[47]/.test(clean)) setCardBrand({ name: 'Amex', logo: 'https://res.cloudinary.com/do1mvhvms/image/upload/v1768520242/american-logo_muhxps.png' });
            else setCardBrand(null);

            // Format with spaces (groups of 4)
            formattedValue = clean.match(/.{1,4}/g)?.join(' ') || clean;
            formattedValue = formattedValue.slice(0, 19);
        }
        else if (name === 'cvc') formattedValue = value.replace(/\D/g, '').slice(0, 4);
        else if (name === 'expMonth') {
            let val = value.replace(/\D/g, '').slice(0, 2);
            if (parseInt(val) > 12) val = '12'; // Prevent > 12
            formattedValue = val;
        }
        else if (name === 'expYear') formattedValue = value.replace(/\D/g, '').slice(0, 2);
        else if (name === 'cardHolder') formattedValue = value.toUpperCase();

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const isTest = publicKey.includes('_test_') || publicKey.includes('pub_test');
            const baseUrl = isTest ? 'https://sandbox.wompi.co/v1' : 'https://production.wompi.co/v1';
            const cleanNumber = formData.number.replace(/\D/g, '');

            // 1. Get Acceptance Token
            const acceptanceResponse = await fetch(`${baseUrl}/merchants/${publicKey}`);
            const acceptanceData = await acceptanceResponse.json();

            if (!acceptanceData?.data?.presigned_acceptance?.acceptance_token) {
                throw new Error('No se pudo iniciar la sesión de pago.');
            }
            const acceptanceToken = acceptanceData.data.presigned_acceptance.acceptance_token;

            // 2. Tokenize Card
            const tokenResponse = await fetch(`${baseUrl}/tokens/cards`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${publicKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: cleanNumber, // Send clean number
                    cvc: formData.cvc,
                    exp_month: formData.expMonth,
                    exp_year: formData.expYear,
                    card_holder: formData.cardHolder
                })
            });

            const tokenData = await tokenResponse.json();
            if (tokenResponse.status !== 200 && tokenResponse.status !== 201) {
                throw new Error(tokenData.error?.reason || 'Datos de tarjeta inválidos.');
            }

            // 3. Process Charge
            // 3. Process Charge
            const result = await processPaymentResult(tokenData.data.id, acceptanceToken, Number(formData.installments || 1));
            onSuccess(result);
        } catch (err: any) {
            console.error('Payment Error:', err);
            setError(err.message || 'Error procesando el pago');
        } finally {
            setLoading(false);
        }
    };

    // Mercado Libre style classes
    const inputClasses = "w-full transition-all duration-200 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-base h-11";
    const labelClasses = "block text-xs font-normal text-gray-500 mb-1.5 ml-0.5";

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row font-sans">

            {/* Left Column: Form */}
            <div className="flex-1 p-8 md:p-10 order-2 md:order-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Completa los datos de tu tarjeta</h2>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="number" className={labelClasses}>Número de tarjeta</label>
                        <div className="relative">
                            <input
                                id="number"
                                name="number"
                                placeholder="0000 0000 0000 0000"
                                value={formData.number}
                                onChange={handleInputChange}
                                className={`${inputClasses} pl-3 border-blue-500 ring-4 ring-blue-500/10 tracking-widest`} // Added tracking-widest
                                maxLength={19}
                                required
                                autoFocus
                            />
                            <div className="absolute right-3 top-2.5 flex items-center pointer-events-none transition-all duration-300">
                                {cardBrand ? (
                                    <img src={cardBrand.logo} alt={cardBrand.name} className="h-6 w-auto object-contain" />
                                ) : (
                                    <CreditCard className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="cardHolder" className={labelClasses}>Nombre del titular</label>
                        <input
                            id="cardHolder"
                            name="cardHolder"
                            placeholder="Ej.: MARÍA LÓPEZ"
                            value={formData.cardHolder}
                            onChange={handleInputChange}
                            required
                            className={inputClasses}
                        />
                        <p className="text-[10px] text-gray-400 mt-1 ml-0.5">Como aparece en la tarjeta.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className={labelClasses}>Vencimiento</label>
                            <div className="flex gap-2">
                                <select
                                    name="expMonth"
                                    value={formData.expMonth}
                                    onChange={handleInputChange}
                                    className={`${inputClasses} px-2 bg-white appearance-none cursor-pointer text-center`}
                                    required
                                >
                                    <option value="" disabled>Mes</option>
                                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <span className="text-gray-300 text-xl font-light self-center">/</span>
                                <select
                                    name="expYear"
                                    value={formData.expYear}
                                    onChange={handleInputChange}
                                    className={`${inputClasses} px-2 bg-white appearance-none cursor-pointer text-center`}
                                    required
                                >
                                    <option value="" disabled>Año</option>
                                    {Array.from({ length: 15 }, (_, i) => {
                                        const year = new Date().getFullYear() + i;
                                        return year.toString().slice(-2);
                                    }).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-1/2">
                            <label htmlFor="cvc" className={labelClasses}>Código de seguridad</label>
                            <div className="relative">
                                <input
                                    id="cvc"
                                    name="cvc"
                                    placeholder="Ej.: 123"
                                    value={formData.cvc}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    maxLength={4}
                                    type="password"
                                    required
                                />
                                <div className="absolute right-3 top-3.5 text-blue-500 cursor-help" title="3 dígitos al reverso">
                                    <span className="border border-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Faux Document Field to match density */}
                    <div>
                        <label className={labelClasses}>Documento del titular</label>
                        <div className="flex gap-2">
                            <select
                                name="docType"
                                value={formData.docType}
                                onChange={handleInputChange}
                                className="w-20 border border-gray-300 rounded-lg px-2 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 h-11"
                            >
                                <option value="CC">CC</option>
                                <option value="CE">CE</option>
                                <option value="NIT">NIT</option>
                            </select>
                            <input
                                name="docNumber"
                                placeholder="Ej.: 12345678"
                                value={formData.docNumber}
                                onChange={handleInputChange}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Installments Selector - Only if Credit Card AND brand is detected */}
                    {cardType === 'credit' && cardBrand && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label htmlFor="installments" className={labelClasses}>Cuotas</label>
                            <select
                                id="installments"
                                name="installments"
                                value={formData.installments}
                                onChange={handleInputChange}
                                className={inputClasses}
                            >
                                {Array.from({ length: 36 }, (_, i) => i + 1).map(i => (
                                    <option key={i} value={i}>{i} {i === 1 ? 'cuota' : 'cuotas'}</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1 ml-0.5">Selecciona el número de cuotas para tu tarjeta de crédito.</p>
                        </div>
                    )}

                    <div className="pt-8 flex justify-end gap-3 items-center">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-md text-[#3483FA] font-medium text-sm hover:bg-[#3483FA]/5 transition-colors"
                        >
                            Volver
                        </button>
                        <Button
                            type="submit"
                            className="bg-[#3483FA] hover:bg-[#2968c8] text-white px-8 py-2.5 h-auto text-base font-semibold rounded-md shadow-none disabled:opacity-70 transition-colors"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando
                                </>
                            ) : 'Continuar'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Right Column: Summary */}
            <div className="w-full md:w-80 bg-gray-50 p-8 border-l border-gray-100 order-1 md:order-2">
                <div className="sticky top-0">
                    <div className="flex items-center gap-2 mb-8">
                        {/* Brand Badge */}
                        <div className="bg-[#2D3277] text-white text-xs font-bold px-2 py-1 rounded">Tincadia</div>
                        <span className="font-semibold text-gray-700">{planName}</span>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-6">Detalle de tu suscripción</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-start pt-4 border-t border-gray-200">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{planName}</p>
                                <p className="text-xs text-gray-500 capitalize">{period}</p>
                            </div>
                            <p className="text-base font-medium text-gray-900">{formatCurrency(amountInCents)}</p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold text-gray-900">Total a pagar</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(amountInCents)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
                        <Lock className="w-3 h-3" />
                        <p className="text-[10px]">Sitio seguro</p>
                    </div>
                </div>
            </div>

        </div>
    );
};
