'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { WompiWidgetConfig } from '@/services/payments.service';

declare global {
    interface Window {
        WidgetCheckout: new (config: Record<string, unknown>) => { open: (cb: (res: WompiResult) => void) => void };
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
    onError?: (error: unknown) => void;
    onClose?: () => void;
}

export function useWompiWidget(options: UseWompiWidgetOptions = {}) {
    const [isReady, setIsReady] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!document.querySelector('script[src="https://checkout.wompi.co/widget.js"]');
        }
        return false;
    });
    const checkoutRef = useRef<{ open: (cb: (res: WompiResult) => void) => void } | null>(null);

    // Cargar el script de Wompi
    useEffect(() => {
        if (typeof window === 'undefined' || isReady) return;

        // Si ya está listo desde el estado inicial, no hacemos nada
        if (isReady) return;

        const existingScript = document.querySelector('script[src="https://checkout.wompi.co/widget.js"]');
        
        if (existingScript) {
            // Ya existe pero el estado no lo reflejaba (edge case)
            if (window.WidgetCheckout) {
                setTimeout(() => setIsReady(true), 0);
            } else {
                const handleLoad = () => setIsReady(true);
                existingScript.addEventListener('load', handleLoad);
                return () => {
                    existingScript.removeEventListener('load', handleLoad);
                };
            }
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.wompi.co/widget.js';
        script.async = true;
        script.onload = () => {
            setIsReady(true);
        };
        script.onerror = () => {
            console.error('Failed to load Wompi widget script');
            options.onError?.({ message: 'Failed to load payment widget' });
        };

        document.head.appendChild(script);

        return () => {
            // No removemos el script para evitar problemas de recarga
        };
    }, [options, isReady]);

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
            const checkoutConfig: Record<string, unknown> = {
                currency: config.currency,
                amountInCents: config.amountInCents,
                reference: config.reference,
                publicKey: config.publicKey,
                signature: { integrity: config.signatureIntegrity },
            };

            // Redirect URL for when payment completes
            if (config.redirectUrl) {
                checkoutConfig.redirectUrl = config.redirectUrl;
            }

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
        isReady,
    };
}
