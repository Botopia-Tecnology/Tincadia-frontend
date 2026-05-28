"use client";

import { useState, useEffect } from 'react';
import { pricingService, PricingPlan as ApiPricingPlan } from '@/services/content.service';
import { PaymentPlan } from '@/services/payments.service';
import { Plan, UserType } from './types';

export function usePricingPlans() {
    const [plans, setPlans] = useState<Record<UserType, Plan[]>>({ personal: [], empresa: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPlans = async () => {
            try {
                const data = await pricingService.getAll(true);

                if (!isMounted) return;
                if (!Array.isArray(data)) throw new Error('Formato de datos inválido');

                const apiPlans: Record<UserType, Plan[]> = { personal: [], empresa: [] };

                data.forEach((p: ApiPricingPlan) => {
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

                const sortPlans = (a: Plan, b: Plan) => {
                    const aIsCorp = a.planType?.includes('corporate') || a.name?.toLowerCase().includes('personalizad');
                    const bIsCorp = b.planType?.includes('corporate') || b.name?.toLowerCase().includes('personalizad');
                    if (aIsCorp && !bIsCorp) return 1;
                    if (!aIsCorp && bIsCorp) return -1;
                    
                    if (a.isFree && !b.isFree) return -1;
                    if (!a.isFree && b.isFree) return 1;
                    
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

    return { plans, isLoading, error };
}
