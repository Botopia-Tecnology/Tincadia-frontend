"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWompiWidget, WompiResult } from '@/hooks/useWompiWidget';
import { paymentsService, InitiatePaymentResponse } from '@/services/payments.service';
import { Plan, WidgetPaymentData, BillingCycle } from './types';
import { DOCUMENT_TYPES } from '@/types/auth.types';

export function useCheckout(
    billingCycle: BillingCycle,
    isAuthenticated: boolean,
    openLoginPanel: () => void,
    user: { id?: string; email?: string; phone?: string; firstName?: string; lastName?: string; documentNumber?: string; documentTypeId?: number; documentType?: string } | null | undefined
) {
    const router = useRouter();
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showCardForm, setShowCardForm] = useState(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<WidgetPaymentData | null>(null);
    const [paymentStep, setPaymentStep] = useState<'selector' | 'form'>('selector');
    const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');

    useWompiWidget({
        onSuccess: (rawResult: WompiResult) => {
            const result = rawResult as unknown as WompiResult & { 
                error?: { type?: string, reason?: string }, 
                data?: { id?: string, status?: string, status_message?: string }, 
                id?: string, 
                status?: string, 
                status_message?: string 
            };
            if (result.error) {
                setError(`Error del sistema: ${result.error.type || 'Desconocido'} - ${result.error.reason || JSON.stringify(result.error)}`);
                setProcessingPlan(null);
                return;
            }

            if (!result.data?.id && !result.id) {
                setError('Error invalido: No se recibió ID de transacción.');
                setProcessingPlan(null);
                return;
            }

            setProcessingPlan(null);
            const txId = result.data?.id || result.id || 'approved';
            const status = (result.data?.status === 'APPROVED' || result.status === 'APPROVED') ? 'success' : 'failed';
            const reason = result.data?.status_message || result.status_message || 'Desconocido';

            router.push(`/pagos/respuesta?id=${txId}&status=${status}&reason=${encodeURIComponent(reason)}`);
        },
        onError: () => {
            setError('Error en el pago. Intenta de nuevo.');
            setProcessingPlan(null);
        },
        onClose: () => {
            setProcessingPlan(null);
        }
    });

    const handlePlanClick = useCallback(async (plan: Plan) => {
        if (
            plan.name?.toLowerCase().includes('enterprise') ||
            (typeof plan.price === 'string' && plan.price.toLowerCase().includes('personalizado'))
        ) {
            router.push('/contacto');
            return;
        }

        if (plan.isFree) {
            router.push('/');
            return;
        }

        if (!isAuthenticated) {
            openLoginPanel();
            return;
        }

        if (!plan.planType || !plan.id) {
            setError('Plan no configurado correctamente');
            return;
        }

        setProcessingPlan(plan.id);
        setError(null);

        try {
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
            setPaymentStep('selector');
            setShowCardForm(true);
        } catch {
            setError('Error al iniciar el pago. Intenta de nuevo.');
            setProcessingPlan(null);
        }
    }, [billingCycle, router, isAuthenticated, openLoginPanel, user]);

    const handleDirectPaymentSuccess = (result: WompiResult) => {
        setShowCardForm(false);
        setProcessingPlan(null);
        setCurrentPaymentData(null);

        const txId = (result as unknown as { data?: { id?: string; status?: string } }).data?.id || 'approved';
        const wompiStatus = (result as unknown as { data?: { id?: string; status?: string } }).data?.status || 'PENDING';

        let status = 'pending';
        if (wompiStatus === 'APPROVED') status = 'success';
        else if (wompiStatus === 'DECLINED') status = 'failed';
        else if (wompiStatus === 'PENDING') status = 'pending';

        router.push(`/pagos/respuesta?id=${txId}&status=${status}`);
    };

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
    };

    const closePaymentModal = () => {
        setShowCardForm(false);
        setProcessingPlan(null);
        setCurrentPaymentData(null);
    };

    return {
        processingPlan,
        error,
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
    };
}
