/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints and settings.
 * All URLs are configurable via environment variables.
 * 
 * To configure for your environment:
 * 1. Copy .env.example to .env.local
 * 2. Update NEXT_PUBLIC_API_URL with your API Gateway URL
 */

// ===========================================
// Base Configuration
// ===========================================

/**
 * Base URL for the API Gateway
 * @example "http://localhost:3000" for local development
 * @example "https://api.tincadia.com" for production
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Request timeout in milliseconds
 */
export const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;

/**
 * Storage prefix for auth tokens
 */
export const AUTH_STORAGE_PREFIX = process.env.NEXT_PUBLIC_AUTH_STORAGE_PREFIX || 'tincadia_';

// ===========================================
// API Endpoints
// ===========================================

/**
 * Authentication endpoints (auth-ms)
 */
export const AUTH_ENDPOINTS = {
    /** POST - Login with email and password */
    LOGIN: '/auth/login',
    /** POST - Register new user */
    REGISTER: '/auth/register',
    /** POST - Logout and invalidate tokens */
    LOGOUT: '/auth/logout',
    /** POST - Refresh access token */
    REFRESH_TOKEN: '/auth/refresh',
    /** POST - Request password reset email */
    FORGOT_PASSWORD: '/auth/forgot-password',
    /** POST - Reset password with token */
    RESET_PASSWORD: '/auth/reset-password',
    /** GET - Get current authenticated user */
    ME: '/auth/me',
    /** POST - Verify email with token */
    VERIFY_EMAIL: '/auth/verify-email',
    /** POST - Resend verification email */
    RESEND_VERIFICATION: '/auth/resend-verification',
} as const;

/**
 * User profile endpoints (users-ms)
 * Note: Add these when you implement the users microservice
 */
export const USER_ENDPOINTS = {
    /** GET - Get user profile */
    PROFILE: '/users/profile',
    /** PATCH - Update user profile */
    UPDATE_PROFILE: '/users/profile',
    /** POST - Upload profile picture */
    UPLOAD_AVATAR: '/users/profile/avatar',
} as const;

/**
 * Build full URL for an endpoint
 * @param endpoint - The endpoint path (e.g., AUTH_ENDPOINTS.LOGIN)
 * @returns Full URL (e.g., "http://localhost:3000/auth/login")
 */
export const buildUrl = (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
};

// ===========================================
// Configuration Object (for easy importing)
// ===========================================

export const apiConfig = {
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT,
    storagePrefix: AUTH_STORAGE_PREFIX,
    endpoints: {
        auth: AUTH_ENDPOINTS,
        users: USER_ENDPOINTS,
    },
    buildUrl,
} as const;

export default apiConfig;
