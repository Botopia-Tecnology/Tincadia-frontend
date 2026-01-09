import { USER_ENDPOINTS, AUTH_ENDPOINTS, buildUrl } from '@/config/api.config';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    lastActive: string;
    createdAt: string;
}

export const usersService = {
    /**
     * Get all users (Admin)
     */
    getAllUsers: async (currentUserId: string): Promise<User[]> => {
        try {
            // Note: Endpoint expects /auth/users/:userId to exclude current user
            const response = await fetch(`${buildUrl(USER_ENDPOINTS.LIST)}/${currentUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Auth header
                    'Authorization': `Bearer ${localStorage.getItem('tincadia_token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            return data.users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    promoteToInterpreter: async (email: string): Promise<void> => {
        try {
            const response = await fetch(buildUrl(AUTH_ENDPOINTS.PROMOTE_INTERPRETER), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tincadia_token')}`
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to promote user');
            }
        } catch (error) {
            console.error('Error promoting user:', error);
            throw error;
        }
    },
};
