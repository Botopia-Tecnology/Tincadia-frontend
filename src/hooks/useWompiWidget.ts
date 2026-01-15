'use client';

import { useEffect, useCallback, useRef } from 'react';
import { WompiWidgetConfig } from '@/services/payments.service';

declare global {
    interface Window {
        WidgetCheckout: any;
    }
}

export interface WompiResult {
    transaction: {
        id: string;
        status: string;
        reference: string;
        amount_in_cents: number;
        currency: string;
        payment_method_type: string;
        customer_email: string;
    };
}

interface UseWompiWidgetOptions {
    onSuccess?: (result: WompiResult) => void;
    onError?: (error: any) => void;
    onClose?: () => void;
}

export function useWompiWidget(options: UseWompiWidgetOptions = {}) {
    const scriptLoaded = useRef(false);
    const checkoutRef = useRef<any>(null);

    // Cargar el script de Wompi
    useEffect(() => {
        if (typeof window === 'undefined' || scriptLoaded.current) return;

        const existingScript = document.querySelector('script[src="https://checkout.wompi.co/widget.js"]');

        if (existingScript) {
            scriptLoaded.current = true;
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.wompi.co/widget.js';
        script.async = true;
        script.onload = () => {
            scriptLoaded.current = true;
        };
        script.onerror = () => {
            console.error('Failed to load Wompi widget script');
            options.onError?.({ message: 'Failed to load payment widget' });
        };

        document.head.appendChild(script);

        return () => {
            // No removemos el script para evitar problemas de recarga
        };
    }, [options]);

    // Abrir el widget de Wompi
    const openWidget = useCallback((config: WompiWidgetConfig) => {
        console.log('🔓 Opening Wompi widget...');
        console.log('🌐 Window.WidgetCheckout:', typeof window !== 'undefined' ? !!window.WidgetCheckout : 'SSR');

        if (typeof window === 'undefined' || !window.WidgetCheckout) {
            console.error('❌ Wompi widget not loaded');
            options.onError?.({ message: 'Payment widget not ready' });
            return;
        }

        try {
            console.log('📦 Widget config received:', config);
            // Crear configuración del checkout
            const checkoutConfig: any = {
                currency: config.currency,
                amountInCents: config.amountInCents,
                reference: config.reference,
                publicKey: config.publicKey,
                signature: { integrity: config.signatureIntegrity },
                // Force card-only payments for recurring subscriptions
                paymentMethods: ['CARD'],
            };

            // Don't use redirectUrl - we handle result via callback
            // if (config.redirectUrl) {
            //     checkoutConfig.redirectUrl = config.redirectUrl;
            // }

            if (config.expirationTime) {
                checkoutConfig.expirationTime = config.expirationTime;
            }

            if (config.customerData) {
                checkoutConfig.customerData = {
                    email: config.customerData.email,
                    fullName: config.customerData.fullName,
                    phoneNumber: config.customerData.phoneNumber,
                    phoneNumberPrefix: config.customerData.phoneNumberPrefix || '+57',
                    legalId: config.customerData.legalId,
                    legalIdType: config.customerData.legalIdType,
                };
            }

            // Crear instancia del checkout
            checkoutRef.current = new window.WidgetCheckout(checkoutConfig);

            // Abrir el widget
            checkoutRef.current.open((result: WompiResult) => {
                if (result.transaction) {
                    const { status } = result.transaction;

                    if (status === 'APPROVED') {
                        options.onSuccess?.(result);
                    } else if (status === 'DECLINED' || status === 'ERROR' || status === 'VOIDED') {
                        options.onError?.(result);
                    }
                }

                options.onClose?.();
            });
        } catch (error) {
            console.error('Error opening Wompi widget:', error);
            options.onError?.(error);
        }
    }, [options]);

    return {
        openWidget,
        isReady: scriptLoaded.current,
    };
}
