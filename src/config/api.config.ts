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
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
    /** POST - OAuth login */
    OAUTH_LOGIN: '/auth/oauth/login',
    /** POST - Logout and invalidate tokens */
    LOGOUT: '/auth/logout',
    /** GET - Get current authenticated user */
    ME: '/auth/me',
    /** GET - Get profile by ID */
    PROFILE: '/auth/profile', // Append /:id when using
    /** PUT - Update profile */
    UPDATE_PROFILE: '/auth/profile', // Append /:userId when using
    /** POST - Verify token */
    VERIFY_TOKEN: '/auth/verify-token',
    /** POST - Reset password */
    RESET_PASSWORD: '/auth/reset-password',
} as const;

/**
 * Forms endpoints (forms-ms)
 */
export const FORMS_ENDPOINTS = {
    /** GET - Find form by type */
    FIND_BY_TYPE: '/forms/type', // Append /:type when using
    /** POST - Submit form */
    SUBMIT: '/forms/submit',
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
