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
    updateUserRole: async (userId: string, role: string): Promise<void> => {
        try {
            // Note: Endpoint is /auth/users/:userId/role defined in api-gateway AuthController
            // We can construct it relative to the LIST endpoint or just hardcode the path structure if config is limiting
            const baseUrl = buildUrl(USER_ENDPOINTS.LIST).replace(/\/users$/, ''); // Remove /users suffix if present, or just use auth base
            // actually LIST is likely /auth/users
            // our new endpoint is /auth/users/:userId/role
            // so if LIST is /auth/users, we can append /:userId/role

            const response = await fetch(`${buildUrl(USER_ENDPOINTS.LIST)}/${userId}/role`, {
                method: 'POST', // Changed to POST to match Controller
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tincadia_token')}`
                },
                body: JSON.stringify({ role })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update user role');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    },
};
