import { PAYMENTS_ENDPOINTS, buildUrl } from '@/config/api.config';

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    plan: string;
    status: string;
    providerId: string;
    createdAt: string;
}

export const financeService = {
    /**
     * Get all payments (Admin)
     */
    getAllPayments: async (): Promise<{ items: Payment[], total: number }> => {
        try {
            const response = await fetch(buildUrl(PAYMENTS_ENDPOINTS.LIST), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Auth header if needed
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
    }
};
