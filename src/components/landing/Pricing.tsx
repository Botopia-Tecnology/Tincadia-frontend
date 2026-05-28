"use client";

import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';
import { CreditCardForm } from '@/components/landing/CreditCardForm';
import { WompiResult } from '@/hooks/useWompiWidget';

// Custom Hooks & Components
import { usePricingPlans } from './pricing/usePricingPlans';
import { useCheckout } from './pricing/useCheckout';
import { PricingCard } from './pricing/PricingCard';
import { PricingSkeleton } from './pricing/PricingSkeleton';
import { PaymentMethodSelector } from './pricing/PaymentMethodSelector';
import { UserType, BillingCycle } from './pricing/types';

export function Pricing() {
    const t = useTranslation();
    const { isAuthenticated, user } = useAuth();
    const { openLoginPanel } = useUI();

    const [userType, setUserType] = useState<UserType>('personal');
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('mensual');

    // Hook para carga de planes
    const { plans, isLoading, error: loadingError } = usePricingPlans();

    // Hook para lógica de pago
    const {
        processingPlan,
        error: checkoutError,
        showCardForm,
        currentPaymentData,
        paymentStep,
        cardType,
        setPaymentStep,
        setCardType,
        handlePlanClick,
        handleDirectPaymentSuccess,
        handleDirectPaymentError,
        processPaymentResult,
        closePaymentModal
    } = useCheckout(billingCycle, isAuthenticated, openLoginPanel, user);

    const currentPlans = plans[userType];
    const displayError = loadingError || checkoutError;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Modal de Pago (Wompi Directo) */}
            {showCardForm && currentPaymentData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    {/* Step 1: Method Selector */}
                    {paymentStep === 'selector' && (
                        <PaymentMethodSelector
                            onClose={closePaymentModal}
                            onSelectCredit={() => {
                                setCardType('credit');
                                setPaymentStep('form');
                            }}
                            onSelectDebit={() => {
                                setCardType('debit');
                                setPaymentStep('form');
                            }}
                        />
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
                                onSuccess={(data) => handleDirectPaymentSuccess(data as unknown as WompiResult)}
                                onError={handleDirectPaymentError}
                                onCancel={() => setPaymentStep('selector')}
                                processPaymentResult={processPaymentResult as unknown as React.ComponentProps<typeof CreditCardForm>['processPaymentResult']}
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
                {displayError && (
                    <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                        <p className="text-red-400 text-sm">{displayError}</p>
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
                            <div key={i} className="w-full max-w-sm"><PricingSkeleton /></div>
                        ))}
                    </div>
                ) : currentPlans.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No hay planes disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {currentPlans.map((plan) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                billingCycle={billingCycle}
                                isProcessing={processingPlan === plan.id}
                                onSelect={handlePlanClick}
                            />
                        ))}
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
