import { api } from '@/lib/api-client';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    documentType?: string;
    documentNumber?: string;
    avatarUrl?: string;
    authProvider?: string;
    emailVerified?: boolean;
}

class UserService {
    private baseUrl = '/auth';

    /**
     * Obtiene el perfil del usuario autenticado actual
     */
    async getMe(): Promise<User> {
        // La información del usuario viene dentro de la propiedad 'user' en la respuesta del endpoint verify-token (que es lo que usa getMe)
        const response = await api.get<{ user: User }>(`${this.baseUrl}/me`);
        return response.user;
    }

    /**
     * Actualiza el perfil del usuario
     */
    async updateProfile(userId: string, data: Partial<User>): Promise<User> {
        return api.put(`${this.baseUrl}/profile/${userId}`, data);
    }
}

export const userService = new UserService();
