import { NOTIFICATION_ENDPOINTS, buildUrl } from '@/config/api.config';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    imageUrl?: string;
    priority: number;
    isActive: boolean;
    createdAt: string;
    expiresAt?: string;
}

export const notificationsService = {
    /**
     * Get all notifications (Admin)
     */
    getAllNotifications: async (): Promise<AppNotification[]> => {
        try {
            const response = await fetch(buildUrl(NOTIFICATION_ENDPOINTS.ADMIN_ALL), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Auth header if needed
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    /**
     * Create notification
     */
    createNotification: async (data: any): Promise<AppNotification> => {
        const response = await fetch(buildUrl(NOTIFICATION_ENDPOINTS.CREATE), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create notification');
        return response.json();
    },

    /**
     * Delete notification
     */
    deleteNotification: async (id: string): Promise<void> => {
        const response = await fetch(`${buildUrl(NOTIFICATION_ENDPOINTS.CREATE)}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete notification');
    }
};
