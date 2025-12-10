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
    ForgotPasswordDto,
    ForgotPasswordResponse,
    ResetPasswordDto,
    ResetPasswordResponse,
    VerifyEmailDto,
    VerifyEmailResponse,
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

        // Store tokens
        tokenStorage.setTokens(response.tokens);

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

        // Store tokens
        tokenStorage.setTokens(response.tokens);

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
     * Get the current authenticated user
     * 
     * @returns Current user data
     * @throws ApiClientError if not authenticated
     */
    async getCurrentUser(): Promise<User> {
        return api.get<User>(AUTH_ENDPOINTS.ME);
    },

    /**
     * Request a password reset email
     * 
     * @param data - Email to send reset link to
     */
    async forgotPassword(data: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
        return api.post<ForgotPasswordResponse>(
            AUTH_ENDPOINTS.FORGOT_PASSWORD,
            data,
            { skipAuth: true }
        );
    },

    /**
     * Reset password with token
     * 
     * @param data - Reset token and new password
     */
    async resetPassword(data: ResetPasswordDto): Promise<ResetPasswordResponse> {
        return api.post<ResetPasswordResponse>(
            AUTH_ENDPOINTS.RESET_PASSWORD,
            data,
            { skipAuth: true }
        );
    },

    /**
     * Verify email with token
     * 
     * @param data - Verification token
     */
    async verifyEmail(data: VerifyEmailDto): Promise<VerifyEmailResponse> {
        return api.post<VerifyEmailResponse>(
            AUTH_ENDPOINTS.VERIFY_EMAIL,
            data,
            { skipAuth: true }
        );
    },

    /**
     * Resend verification email
     */
    async resendVerification(): Promise<{ message: string }> {
        return api.post<{ message: string }>(AUTH_ENDPOINTS.RESEND_VERIFICATION);
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
