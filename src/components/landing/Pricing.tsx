'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Users, CreditCard, Crown, Check, X, Loader2, Shield, ChevronRight, Lock, Info, PiggyBank, Gift, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { DOCUMENT_TYPES } from '@/types/auth.types';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';
import { paymentsService, PaymentPlan, InitiatePaymentResponse } from '@/services/payments.service';
import { pricingService, PricingPlan as ApiPricingPlan } from '@/services/content.service';
import { useWompiWidget } from '@/hooks/useWompiWidget';
import { CreditCardForm } from '@/components/landing/CreditCardForm';

type UserType = 'personal' | 'empresa';
type BillingCycle = 'mensual' | 'anual';

interface Plan {
    id: string;
    name: string;
    price: string;
    priceAnnual?: string;
    priceInCents: number;
    description: string;
    buttonText: string;
    includes: string[];
    excludes: string[];
    planType?: PaymentPlan;
    isFree?: boolean;
    trialDays?: number;
}

// Iconos por tipo de plan (memoizado)
const PLAN_ICONS: Record<string, React.ReactNode> = {
    free: <Users className="w-4 h-4" />,
    premium: <CreditCard className="w-4 h-4" />,
    corporate: <Crown className="w-4 h-4" />,
};

function getPlanIcon(name: string): React.ReactNode {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('free') || lowerName.includes('gratis')) return PLAN_ICONS.free;
    if (lowerName.includes('premium') || lowerName.includes('negocios')) return PLAN_ICONS.premium;
    return PLAN_ICONS.corporate;
}

export function Pricing() {
    const t = useTranslation();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const { openLoginPanel } = useUI();
    const [userType, setUserType] = useState<UserType>('personal');
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('mensual');
    const [plans, setPlans] = useState<Record<UserType, Plan[]>>({ personal: [], empresa: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [showCardForm, setShowCardForm] = useState(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<any>(null);
    const [paymentStep, setPaymentStep] = useState<'selector' | 'form'>('selector');
    const [cardType, setCardType] = useState<'credit' | 'debit'>('credit'); // New state for card type

    // Use Wompi Widget hook for card-only payments
    const { openWidget } = useWompiWidget({
        onSuccess: (result: any) => {
            console.log('✅ Payment successful:', result);
            console.log('💰 Amount Charged:', currentPaymentData?.amountInCents);
            if (result.error) {
                console.error('❌ Wompi API Error:', result.error);
                setError(`Error del sistema: ${result.error.type || 'Desconocido'} - ${result.error.reason || JSON.stringify(result.error)}`);
                setProcessingPlan(null);
                return;
            }

            if (!result.data?.id && !result.id) {
                console.error('❌ Invalid Response:', result);
                setError('Error invalido: No se recibió ID de transacción.');
                setProcessingPlan(null);
                return;
            }

            if (result.data?.status === 'DECLINED') {
                console.error('❌ Decline Reason:', result.data?.status_message);
            }
            setProcessingPlan(null);

            const txId = result.data?.id || result.id || 'approved';
            const status = (result.data?.status === 'APPROVED' || result.status === 'APPROVED') ? 'success' : 'failed';
            const reason = result.data?.status_message || result.status_message || 'Desconocido';

            router.push(`/pagos/respuesta?id=${txId}&status=${status}&reason=${encodeURIComponent(reason)}`);
        },
        onError: (err) => {
            console.error('❌ Payment error:', err);
            setError('Error en el pago. Intenta de nuevo.');
            setProcessingPlan(null);
        },
        onClose: () => {
            setProcessingPlan(null);
        }
    });

    // Manejar click en plan - SEGURIDAD: El precio viene del backend, no del frontend
    const handlePlanClick = useCallback(async (plan: Plan) => {
        // Redirigir a contacto si es Enterprise o precio personalizado
        if (
            plan.name?.toLowerCase().includes('enterprise') ||
            (typeof plan.price === 'string' && plan.price.toLowerCase().includes('personalizado'))
        ) {
            router.push('/contacto');
            return;
        }

        // Plan gratuito - redirigir a inicio
        if (plan.isFree) {
            router.push('/');
            return;
        }

        // Check Authentication - User must be logged in to purchase
        if (!isAuthenticated) {
            openLoginPanel();
            return;
        }

        // Validación: plan debe tener tipo definido
        if (!plan.planType || !plan.id) {
            setError('Plan no configurado correctamente');
            return;
        }

        setProcessingPlan(plan.id);
        setError(null);

        try {
            /*
             * SEGURIDAD: Solo enviamos el ID del plan y el ciclo de facturación.
             * El backend determina el precio real basado en estos datos.
             * La firma de integridad (signature:integrity) asegura que nadie
             * pueda manipular el monto en la URL del checkout.
             */
            const response: InitiatePaymentResponse = await paymentsService.initiatePayment({
                planId: plan.id,
                planType: plan.planType,
                billingCycle,
                redirectUrl: `${window.location.origin}/pagos/respuesta`,
                userId: user?.id,
                customerEmail: user?.email,
                customerName: user ? `${user.firstName} ${user.lastName}`.trim() : undefined,
                customerPhone: user?.phone,
                customerLegalId: user?.documentNumber,
                customerLegalIdType: user?.documentTypeId
                    ? DOCUMENT_TYPES.find(d => d.id === user.documentTypeId)?.name || user.documentType
                    : user?.documentType,
            });

            if (!response.widgetConfig?.signatureIntegrity) {
                throw new Error('Respuesta de pago inválida');
            }

            setCurrentPaymentData({
                ...response.widgetConfig,
                reference: response.reference,
            });
            setPaymentStep('selector'); // Always start at selector
            setShowCardForm(true);
        } catch (err) {
            console.error('Error initiating payment:', err);
            setError('Error al iniciar el pago. Intenta de nuevo.');
            setProcessingPlan(null);
        }
    }, [billingCycle, router, openWidget]);

    const handleDirectPaymentSuccess = (result: any) => {
        setShowCardForm(false);
        setProcessingPlan(null);
        setCurrentPaymentData(null);

        const txId = result.data?.id || 'approved';
        // Use the actual status from Wompi (APPROVED, DECLINED, PENDING)
        const wompiStatus = result.data?.status || 'PENDING';

        let status = 'pending';
        if (wompiStatus === 'APPROVED') status = 'success';
        else if (wompiStatus === 'DECLINED') status = 'failed';
        else if (wompiStatus === 'PENDING') status = 'pending';

        router.push(`/pagos/respuesta?id=${txId}&status=${status}`);
    };

    // Callback used by CreditCardForm
    const processPaymentResult = async (token: string, acceptanceToken: string, installments: number = 1) => {
        if (!currentPaymentData) throw new Error('No payment data');
        return paymentsService.processCardPayment({
            reference: currentPaymentData.reference,
            cardToken: token,
            acceptanceToken,
            email: currentPaymentData.customerData?.email || 'test@example.com',
            installments
        });
    };

    const handleDirectPaymentError = (errorMsg: string) => {
        setError(errorMsg);
        // No cerramos el modal inmediatamente para dejar ver el error
    };

    // Cargar planes del backend
    useEffect(() => {
        let isMounted = true;

        const fetchPlans = async () => {
            try {
                const data = await pricingService.getAll(true); // true = solo planes activos

                if (!isMounted) return;
                if (!Array.isArray(data)) throw new Error('Formato de datos inválido');

                const apiPlans: Record<UserType, Plan[]> = { personal: [], empresa: [] };

                data.forEach((p: ApiPricingPlan) => {
                    // Validar datos mínimos requeridos
                    if (!p.id || !p.name || !p.type) return;

                    const mapped: Plan = {
                        id: p.id,
                        name: p.name,
                        price: p.price_monthly || 'Gratis',
                        priceAnnual: p.price_annual,
                        priceInCents: p.price_monthly_cents || 0,
                        description: p.description || '',
                        buttonText: p.button_text || 'Empezar',
                        includes: Array.isArray(p.includes) ? p.includes : [],
                        excludes: Array.isArray(p.excludes) ? p.excludes : [],
                        planType: p.plan_type as PaymentPlan,
                        isFree: p.is_free || p.price_monthly === 'Gratis',
                        trialDays: p.trial_period_days || 0,
                    };

                    if (p.type === 'personal') apiPlans.personal.push(mapped);
                    else if (p.type === 'empresa') apiPlans.empresa.push(mapped);
                });

                // Sort each category: free first, then by price, corporate/personalized last
                const sortPlans = (a: Plan, b: Plan) => {
                    // Corporate/personalized plans always last
                    const aIsCorp = a.planType?.includes('corporate') || a.name?.toLowerCase().includes('personalizad');
                    const bIsCorp = b.planType?.includes('corporate') || b.name?.toLowerCase().includes('personalizad');
                    if (aIsCorp && !bIsCorp) return 1;
                    if (!aIsCorp && bIsCorp) return -1;
                    // Free plans first
                    if (a.isFree && !b.isFree) return -1;
                    if (!a.isFree && b.isFree) return 1;
                    // Then by price ascending
                    return a.priceInCents - b.priceInCents;
                };
                apiPlans.personal.sort(sortPlans);
                apiPlans.empresa.sort(sortPlans);

                setPlans(apiPlans);
            } catch (err) {
                if (isMounted) {
                    console.error('Error loading plans:', err);
                    setError('No se pudieron cargar los planes');
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchPlans();
        return () => { isMounted = false; };
    }, []);

    // Planes actuales según tipo de usuario seleccionado
    const currentPlans = plans[userType];

    // Componente Skeleton para carga
    function PlanSkeleton() {
        return (
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-12 bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-700 rounded w-full mb-6" />
                <div className="h-12 bg-gray-700 rounded w-full mb-8" />
                <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-700 rounded w-5/6" />
                    <div className="h-4 bg-gray-700 rounded w-4/6" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Custom Credit Card Form Modal */}
            {showCardForm && currentPaymentData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">

                    {/* Step 1: Method Selector (Netflix Style) */}
                    {paymentStep === 'selector' && (
                        <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 font-sans">
                            <button
                                onClick={() => {
                                    setShowCardForm(false);
                                    setProcessingPlan(null);
                                    setCurrentPaymentData(null);
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                {(() => {
                                    const selectedPlan = [...plans.personal, ...plans.empresa].find(p => p.id === processingPlan);
                                    const hasTrial = selectedPlan?.trialDays && selectedPlan.trialDays > 0;
                                    return (
                                        <>
                                            <div className={`inline-flex p-3 rounded-full mb-4 ring-1 ${hasTrial
                                                ? 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                                                : 'bg-red-50 text-red-500 ring-red-100'
                                                }`}>
                                                {hasTrial ? <Gift className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {hasTrial ? '¡Prueba gratis!' : 'Añade un método de pago'}
                                            </h3>
                                            {hasTrial && (
                                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                                                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span className="text-sm font-semibold text-emerald-700">
                                                        {selectedPlan.trialDays} días de prueba gratuita
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-500 mt-3 max-w-xs mx-auto leading-relaxed">
                                                {hasTrial
                                                    ? `No se realizará ningún cobro hoy. Tu prueba gratuita de ${selectedPlan!.trialDays} días comenzará de inmediato. Solo se cobrará al finalizar el periodo de prueba.`
                                                    : 'Configura tu tarjeta para asegurar la activación inmediata y la renovación automática de tu plan Premium.'
                                                }
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="space-y-4">
                                {/* Credit Card Option */}
                                <button
                                    onClick={() => {
                                        setCardType('credit');
                                        setPaymentStep('form');
                                    }}
                                    className="w-full border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-[#83A98A] hover:bg-gray-50/50 transition-all group active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:text-[#83A98A]">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-semibold text-gray-900 group-hover:text-[#83A98A]">Tarjeta de Crédito</span>
                                            <div className="flex gap-2 mt-1.5 opacity-80">
                                                <img src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520243/VISA-Logo_zhllqu.png" alt="Visa" className="h-5 w-auto object-contain" />
                                                <img src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520242/mastercard-logo_kecgyl.png" alt="Mastercard" className="h-5 w-auto object-contain" />
                                                <img src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520242/american-logo_muhxps.png" alt="Amex" className="h-5 w-auto object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-[#83A98A] w-5 h-5" />
                                </button>

                                {/* Debit Card Option */}
                                <button
                                    onClick={() => {
                                        setCardType('debit');
                                        setPaymentStep('form');
                                    }}
                                    className="w-full border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-[#83A98A] hover:bg-gray-50/50 transition-all group active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:text-[#83A98A]">
                                            <PiggyBank className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-semibold text-gray-900 group-hover:text-[#83A98A]">Tarjeta Débito / Ahorros</span>
                                            <div className="flex gap-2 mt-1.5 opacity-80">
                                                <img src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520243/VISA-Logo_zhllqu.png" alt="Visa" className="h-5 w-auto object-contain" />
                                                <img src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520242/mastercard-logo_kecgyl.png" alt="Mastercard" className="h-5 w-auto object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-[#83A98A] w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-8 text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-[11px] text-gray-500 flex items-start justify-center gap-2 text-left">
                                    <Info className="w-3 h-3 flex-shrink-0 mt-0.5 text-blue-500" />
                                    <span>
                                        Este es el <strong>único método de pago habilitado</strong> para suscripciones recurrentes.
                                        Tus datos son procesados de forma segura con cifrado bancario.
                                    </span>
                                </p>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Cifrado de extremo a extremo
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Payment Form */}
                    {paymentStep === 'form' && (
                        <div className="w-full max-w-4xl">
                            <CreditCardForm
                                publicKey={currentPaymentData.publicKey}
                                reference={currentPaymentData.reference}
                                email={currentPaymentData.customerData?.email || 'test@example.com'}
                                amountInCents={currentPaymentData.amountInCents}
                                currency={currentPaymentData.currency}
                                planName={
                                    [...plans.personal, ...plans.empresa].find(p => p.id === processingPlan)?.name || 'Suscripción Tincadia'
                                }
                                period={billingCycle}
                                onSuccess={handleDirectPaymentSuccess}
                                onError={handleDirectPaymentError}
                                onCancel={() => setPaymentStep('selector')}
                                processPaymentResult={processPaymentResult}
                                cardType={cardType}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                        {t('pricing.title')}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        {t('pricing.subtitle')}
                    </p>
                </header>

                {/* Error global */}
                {error && (
                    <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Selector de tipo de usuario */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-lg bg-gray-800 p-1 border border-gray-700">
                        {(['personal', 'empresa'] as const).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setUserType(type)}
                                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${userType === type
                                    ? 'bg-[#83A98A] text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {t(`pricing.${type}`)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggle de facturación */}
                <div className="flex justify-center items-center gap-4 mb-12">
                    <span className={`text-sm font-medium ${billingCycle === 'mensual' ? 'text-white' : 'text-gray-400'}`}>
                        {t('pricing.mensual')}
                    </span>
                    <button
                        type="button"
                        onClick={() => setBillingCycle(prev => prev === 'mensual' ? 'anual' : 'mensual')}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:ring-offset-2 focus:ring-offset-gray-900"
                        role="switch"
                        aria-checked={billingCycle === 'anual'}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === 'anual' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <div className="relative flex items-center">
                        <span className={`text-sm font-medium min-w-[50px] ${billingCycle === 'anual' ? 'text-white' : 'text-gray-400'}`}>
                            {t('pricing.anual')}
                        </span>
                        {billingCycle === 'anual' && (
                            <span className="absolute left-full ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-[#83A98A] rounded whitespace-nowrap">
                                {t('pricing.save20')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Cards de planes */}
                {isLoading ? (
                    <div className="flex flex-wrap justify-center gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full max-w-sm"><PlanSkeleton /></div>
                        ))}
                    </div>
                ) : currentPlans.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No hay planes disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {currentPlans.map((plan) => {
                            const displayPrice = billingCycle === 'anual' && plan.priceAnnual ? plan.priceAnnual : plan.price;
                            const isProcessing = processingPlan === plan.id;

                            return (
                                <article
                                    key={plan.id}
                                    className={`w-full max-w-sm bg-gray-800 rounded-2xl p-8 border transition-all hover:shadow-2xl hover:shadow-[#83A98A]/20 relative ${plan.trialDays && plan.trialDays > 0
                                        ? 'border-emerald-500/50 hover:border-emerald-400'
                                        : 'border-gray-700 hover:border-[#83A98A]'
                                        }`}
                                >
                                    {/* Trial Badge */}
                                    {!!plan.trialDays && plan.trialDays > 0 && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 whitespace-nowrap">
                                                <Gift className="w-3.5 h-3.5" />
                                                {plan.trialDays} días gratis
                                            </div>
                                        </div>
                                    )}

                                    {/* Header del plan */}
                                    <div className={`mb-6 ${plan.trialDays && plan.trialDays > 0 ? 'mt-2' : ''}`}>
                                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                        <div className="mb-4">
                                            {plan.isFree ? (
                                                <p className="text-3xl font-bold text-white">{plan.price}</p>
                                            ) : (
                                                <div>
                                                    <span className="text-4xl font-bold text-white">
                                                        {displayPrice.includes('$') ? displayPrice : `$${displayPrice}`}
                                                    </span>
                                                    <span className="text-gray-400 ml-2">
                                                        {billingCycle === 'anual' ? t('pricing.perYear') : t('pricing.perMonth')}
                                                    </span>
                                                    {!!plan.trialDays && plan.trialDays > 0 && (
                                                        <p className="text-emerald-400 text-sm mt-1 font-medium">
                                                            Después de {plan.trialDays} días de prueba gratuita
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-300 text-sm">{plan.description}</p>
                                    </div>

                                    {/* Botones CTA - Single Button */}
                                    <div className="mt-8 mb-4">
                                        <button
                                            onClick={() => handlePlanClick(plan)}
                                            disabled={isProcessing}
                                            className={`w-full py-3.5 rounded-xl font-bold text-base shadow-lg transition-all ${isProcessing
                                                ? 'bg-gray-600 cursor-not-allowed opacity-70'
                                                : plan.isFree
                                                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                                                    : 'bg-[#83A98A] text-white hover:bg-[#6e9175] hover:scale-[1.01]'
                                                }`}
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    {plan.isFree ? <Users className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
                                                    {plan.buttonText}
                                                </div>
                                            )}
                                        </button>
                                        {!plan.isFree && (
                                            <p className="text-center text-[10px] text-gray-400 mt-2">
                                                {plan.trialDays && plan.trialDays > 0
                                                    ? `Sin cobro hasta que terminen tus ${plan.trialDays} días de prueba. Cancela cuando quieras.`
                                                    : 'Cancela cuando quieras. Pago seguro SSL.'
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* Incluye */}
                                    {plan.includes.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                                                {t('pricing.includes')}
                                            </h4>
                                            <ul className="space-y-3">
                                                {plan.includes.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <Check className="w-5 h-5 text-[#83A98A] flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-300 text-sm">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* No incluye */}
                                    {plan.excludes.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                                                {t('pricing.notIncludes')}
                                            </h4>
                                            <ul className="space-y-3">
                                                {plan.excludes.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-400 text-sm">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Texto de seguridad */}
                <footer className="mt-12 text-center">
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Pagos seguros procesados por Wompi. Todos los datos están encriptados.
                    </p>
                </footer>
            </div>
        </div>
    );
}
