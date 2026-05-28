import { PaymentPlan } from '@/services/payments.service';

export type UserType = 'personal' | 'empresa';
export type BillingCycle = 'mensual' | 'anual';

export interface Plan {
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

export interface WidgetPaymentData {
    publicKey: string;
    reference: string;
    amountInCents: number;
    currency: string;
    signatureIntegrity: string;
    customerData?: { email?: string };
    [key: string]: unknown;
}
