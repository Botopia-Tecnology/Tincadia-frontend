import { PAYMENTS_ENDPOINTS, buildUrl } from '@/config/api.config';

export interface Payment {
    id: string;
    userId: string;
    amountInCents: number;
    plan: string;
    status: string;
    providerId: string;
    createdAt: string;
    reference?: string;
    wompiTransactionId?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}

export interface Subscription {
    id: string;
    userId: string;
    status: string;
    currentPeriodEnd: string;
    plan?: { name: string };
    amountCents: number;
    cancelAtPeriodEnd?: boolean;
}

export const financeService = {
    /**
     * Get all payments (Admin)
     */
    getAllPayments: async (params?: { status?: string, plan?: string }): Promise<{ items: Payment[], total: number }> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
            // Note: Plan filtering might need backend support on payments endpoint too if not redundant with 'plan' field string checking

            const response = await fetch(`${buildUrl(PAYMENTS_ENDPOINTS.LIST)}?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch payments');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    },

    /**
     * Get all subscriptions (Admin)
     */
    getAllSubscriptions: async (params?: { status?: string }): Promise<{ items: Subscription[], total: number }> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.status && params.status !== 'all') queryParams.append('status', params.status);

            const response = await fetch(`${buildUrl(PAYMENTS_ENDPOINTS.LIST)}/subscriptions?${queryParams.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to fetch subscriptions');
            return await response.json();
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            return { items: [], total: 0 };
        }
    }
};
