/**
 * API Client
 * 
 * HTTP client with interceptors for authentication, error handling,
 * and automatic token refresh.
 */

import { apiConfig, API_BASE_URL, API_TIMEOUT, AUTH_STORAGE_PREFIX } from '@/config/api.config';
import type { ApiResponse, ApiError } from '@/types/api.types';
import type { AuthTokens } from '@/types/auth.types';

// ===========================================
// Types
// ===========================================

export interface RequestConfig extends RequestInit {
    timeout?: number;
    skipAuth?: boolean;
}

export class ApiClientError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code: string,
        public details?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'ApiClientError';
    }
}

// ===========================================
// Token Management
// ===========================================

const STORAGE_KEYS = {
    ACCESS_TOKEN: `${AUTH_STORAGE_PREFIX}access_token`,
    REFRESH_TOKEN: `${AUTH_STORAGE_PREFIX}refresh_token`,
} as const;

export const tokenStorage = {
    getAccessToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    getRefreshToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    setTokens: (tokens: AuthTokens): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    },

    clearTokens: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    hasTokens: (): boolean => {
        return !!tokenStorage.getAccessToken();
    },
};

// ===========================================
// Token Refresh Logic
// ===========================================

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}${apiConfig.endpoints.auth.REFRESH_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            tokenStorage.clearTokens();
            return null;
        }

        const data = await response.json();
        const tokens: AuthTokens = data.tokens || data;
        tokenStorage.setTokens(tokens);
        return tokens.accessToken;
    } catch {
        tokenStorage.clearTokens();
        return null;
    }
};

// ===========================================
// API Client
// ===========================================

/**
 * Make an HTTP request to the API
 * 
 * @param endpoint - API endpoint (e.g., '/auth/login')
 * @param config - Request configuration
 * @returns Promise with the response data
 * 
 * @example
 * // Simple GET request
 * const user = await apiClient<User>('/auth/me');
 * 
 * @example
 * // POST request with body
 * const response = await apiClient<LoginResponse>('/auth/login', {
 *   method: 'POST',
 *   body: JSON.stringify({ email, password }),
 * });
 */
export async function apiClient<T>(
    endpoint: string,
    config: RequestConfig = {}
): Promise<T> {
    const { timeout = API_TIMEOUT, skipAuth = false, ...fetchConfig } = config;

    // Build headers
    const headers = new Headers(fetchConfig.headers);

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Add authorization header if not skipped
    if (!skipAuth) {
        const accessToken = tokenStorage.getAccessToken();
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...fetchConfig,
            headers,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401 && !skipAuth) {
            if (!isRefreshing) {
                isRefreshing = true;
                const newToken = await refreshAccessToken();
                isRefreshing = false;

                if (newToken) {
                    onTokenRefreshed(newToken);
                    // Retry original request with new token
                    headers.set('Authorization', `Bearer ${newToken}`);
                    const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                        ...fetchConfig,
                        headers,
                    });

                    if (!retryResponse.ok) {
                        const errorData = await retryResponse.json().catch(() => ({}));
                        throw new ApiClientError(
                            errorData.message || 'Request failed',
                            retryResponse.status,
                            errorData.code || 'UNKNOWN_ERROR',
                            errorData.details
                        );
                    }

                    return retryResponse.json() as Promise<T>;
                } else {
                    // Refresh failed, clear tokens and throw
                    throw new ApiClientError(
                        'Session expired. Please login again.',
                        401,
                        'SESSION_EXPIRED'
                    );
                }
            } else {
                // Wait for token refresh
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh(async (newToken) => {
                        try {
                            headers.set('Authorization', `Bearer ${newToken}`);
                            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                                ...fetchConfig,
                                headers,
                            });
                            resolve(retryResponse.json() as Promise<T>);
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            }
        }

        // Handle other errors
        if (!response.ok) {
            const errorData: ApiError = await response.json().catch(() => ({
                message: 'An error occurred',
                code: 'UNKNOWN_ERROR',
            }));

            throw new ApiClientError(
                errorData.message,
                response.status,
                errorData.code,
                errorData.details
            );
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204) {
            return {} as T;
        }

        return response.json() as Promise<T>;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof ApiClientError) {
            throw error;
        }

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new ApiClientError('Request timeout', 408, 'TIMEOUT');
            }
            throw new ApiClientError(error.message, 500, 'NETWORK_ERROR');
        }

        throw new ApiClientError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
    }
}

// ===========================================
// Convenience Methods
// ===========================================

export const api = {
    get: <T>(endpoint: string, config?: RequestConfig) =>
        apiClient<T>(endpoint, { ...config, method: 'GET' }),

    post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
        apiClient<T>(endpoint, {
            ...config,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
        apiClient<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
        apiClient<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T>(endpoint: string, config?: RequestConfig) =>
        apiClient<T>(endpoint, { ...config, method: 'DELETE' }),
};

export default api;
