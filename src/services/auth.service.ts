/**
 * Authentication Service
 * 
 * Service layer for authentication operations.
 * Uses the API client to communicate with the auth microservice.
 */

import { api, tokenStorage, ApiClientError } from '@/lib/api-client';
import { AUTH_ENDPOINTS } from '@/config/api.config';
import type {
    User,
    LoginDto,
    LoginResponse,
    RegisterDto,
    RegisterResponse,
    ResetPasswordDto,
    ResetPasswordResponse,
    OAuthProvider,
    OAuthLoginResponse,
    UpdateProfileDto,
    UpdateProfileResponse,
} from '@/types/auth.types';

// ===========================================
// Authentication Service
// ===========================================

export const authService = {
    /**
     * Login with email and password
     * 
     * @param credentials - Login credentials
     * @returns User data and auth tokens
     * 
     * @example
     * const { user, tokens } = await authService.login({
     *   email: 'user@example.com',
     *   password: 'password123',
     * });
     */
    async login(credentials: LoginDto): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>(
            AUTH_ENDPOINTS.LOGIN,
            credentials,
            { skipAuth: true }
        );

        // Store token (backend returns 'token' not 'tokens')
        tokenStorage.setTokens({ accessToken: response.token });

        return response;
    },

    /**
     * Register a new user
     * 
     * @param userData - Registration data
     * @returns Created user and auth tokens
     */
    async register(userData: RegisterDto): Promise<RegisterResponse> {
        const response = await api.post<RegisterResponse>(
            AUTH_ENDPOINTS.REGISTER,
            userData,
            { skipAuth: true }
        );

        // Store token (backend returns 'token' not 'tokens')
        tokenStorage.setTokens({ accessToken: response.token });

        return response;
    },

    /**
     * Login with OAuth provider (Google, Apple, Microsoft, etc.)
     * 
     * @param provider - OAuth provider name
     * @param idToken - ID token from OAuth provider (Google/Apple)
     * @param accessToken - Optional access token
     * @returns User data and auth token
     * 
     * @example
     * // After getting idToken from Google Sign-In
     * const { user, token } = await authService.loginWithOAuth('google', idToken);
     */
    async loginWithOAuth(provider: OAuthProvider, idToken: string, accessToken?: string): Promise<OAuthLoginResponse> {
        const response = await api.post<OAuthLoginResponse>(
            AUTH_ENDPOINTS.OAUTH_LOGIN,
            // Send idToken as both fields - accessToken can use idToken as fallback
            // This ensures compatibility with backend DTO that requires accessToken
            { provider, idToken, accessToken: accessToken || idToken },
            { skipAuth: true }
        );

        // Store token
        tokenStorage.setTokens({ accessToken: response.token });

        return response;
    },

    /**
     * Logout the current user
     * Invalidates tokens on the server and clears local storage
     */
    async logout(): Promise<void> {
        try {
            await api.post(AUTH_ENDPOINTS.LOGOUT);
        } catch (error) {
            // Even if the server request fails, we should clear local tokens
            console.warn('Logout request failed:', error);
        } finally {
            tokenStorage.clearTokens();
        }
    },

    /**
     * Update user profile
     * Used for OAuth users to complete their profile with missing fields
     * 
     * @param userId - The user's ID
     * @param profileData - Profile fields to update
     * @returns Updated profile data
     */
    async updateProfile(userId: string, profileData: UpdateProfileDto): Promise<UpdateProfileResponse> {
        const response = await api.put<UpdateProfileResponse>(
            `${AUTH_ENDPOINTS.UPDATE_PROFILE}/${userId}`,
            profileData
        );
        return response;
    },

    /**
     * Verify the current token and get user info
     * Uses POST /auth/verify-token to validate the token
     * 
     * @returns Token verification result with user ID
     */
    async verifyToken(): Promise<{ valid: boolean; userId?: string }> {
        return api.post<{ valid: boolean; userId?: string }>(AUTH_ENDPOINTS.VERIFY_TOKEN);
    },

    /**
     * Get user profile by ID
     * Uses GET /auth/profile/:id
     * 
     * @param userId - User ID to fetch profile for
     * @returns User profile data
     */
    async getProfile(userId: string): Promise<User> {
        return api.get<User>(`${AUTH_ENDPOINTS.PROFILE}/${userId}`);
    },

    /**
     * Get the current authenticated user
     * Uses GET /auth/me with the Authorization header
     * 
     * @returns Current user data
     * @throws ApiClientError if not authenticated
     */
    async getCurrentUser(): Promise<User> {
        const response = await api.get<{ user: User }>(AUTH_ENDPOINTS.ME);
        return response.user;
    },

    /**
     * Reset password
     * 
     * @param data - Reset password data
     */
    async resetPassword(data: ResetPasswordDto): Promise<ResetPasswordResponse> {
        return api.post<ResetPasswordResponse>(
            AUTH_ENDPOINTS.RESET_PASSWORD,
            data,
            { skipAuth: true }
        );
    },

    /**
     * Check if user is currently authenticated (has valid tokens)
     */
    isAuthenticated(): boolean {
        return tokenStorage.hasTokens();
    },
};

export default authService;

// ===========================================
// Error Helpers
// ===========================================

/**
 * Check if an error is an auth-related error
 */
export function isAuthError(error: unknown): error is ApiClientError {
    return error instanceof ApiClientError && error.statusCode === 401;
}

/**
 * Check if an error is a validation error
 */
export function isValidationError(error: unknown): error is ApiClientError {
    return error instanceof ApiClientError && error.statusCode === 400;
}

/**
 * Get validation error messages for a specific field
 */
export function getFieldErrors(error: ApiClientError, field: string): string[] {
    return error.details?.[field] || [];
}
