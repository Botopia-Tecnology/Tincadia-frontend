'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Users, CreditCard, Crown, Check, X, Loader2, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { paymentsService, PaymentPlan, InitiatePaymentResponse } from '@/services/payments.service';
import { pricingService, PricingPlan as ApiPricingPlan } from '@/services/content.service';

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
    const [userType, setUserType] = useState<UserType>('personal');
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('mensual');
    const [plans, setPlans] = useState<Record<UserType, Plan[]>>({ personal: [], empresa: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Manejar click en plan - SEGURIDAD: El precio viene del backend, no del frontend
    const handlePlanClick = useCallback(async (plan: Plan) => {
        // Plan gratuito - redirigir a inicio
        if (plan.isFree) {
            router.push('/');
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
            });

            if (!response.widgetConfig?.signatureIntegrity) {
                throw new Error('Respuesta de pago inválida');
            }

            const { widgetConfig: config } = response;

            // URL de redirección (Wompi no acepta localhost)
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const redirectBase = isLocalhost ? 'https://www.tincadia.com' : window.location.origin;

            // Construir URL de checkout con todos los parámetros de seguridad
            const checkoutParams = new URLSearchParams({
                'public-key': config.publicKey,
                'currency': config.currency,
                'amount-in-cents': String(config.amountInCents),
                'reference': config.reference,
            });

            // La firma de integridad es CRÍTICA - sin ella, el pago podría ser manipulado
            const checkoutUrl = `https://checkout.wompi.co/p/?${checkoutParams.toString()}&signature:integrity=${config.signatureIntegrity}&redirect-url=${encodeURIComponent(`${redirectBase}/pagos/respuesta`)}`;

            window.location.href = checkoutUrl;
        } catch (err) {
            console.error('Error initiating payment:', err);
            setError('Error al iniciar el pago. Intenta de nuevo.');
            setProcessingPlan(null);
        }
    }, [billingCycle, router]);

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
                                    className="w-full max-w-sm bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-[#83A98A] transition-all hover:shadow-2xl hover:shadow-[#83A98A]/20"
                                >
                                    {/* Header del plan */}
                                    <div className="mb-6">
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
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-300 text-sm">{plan.description}</p>
                                    </div>

                                    {/* Botón CTA */}
                                    <button
                                        onClick={() => handlePlanClick(plan)}
                                        disabled={isProcessing}
                                        className={`flex items-center justify-center gap-2 w-full rounded-lg px-6 py-3 font-semibold transition-colors mb-8 ${isProcessing
                                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                            : plan.isFree
                                                ? 'bg-white text-gray-900 hover:bg-gray-100'
                                                : 'bg-[#83A98A] text-white hover:bg-[#6B8E71]'
                                            }`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                {getPlanIcon(plan.name)}
                                                {plan.buttonText}
                                            </>
                                        )}
                                    </button>

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
