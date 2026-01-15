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
    /** POST - Request reset password email */
    RESET_PASSWORD: '/auth/reset-password',
    /** POST - Promote user to interpreter (Admin) */
    PROMOTE_INTERPRETER: '/auth/promote-interpreter',
} as const;

/**
 * Forms endpoints (forms-ms)
 */
export const FORMS_ENDPOINTS = {
    /** GET - Find form by type */
    FIND_BY_TYPE: '/forms/type', // Append /:type when using
    /** POST - Submit form */
    SUBMIT: '/forms/submit',
    /** GET - Get all submissions (Admin) */
    SUBMISSIONS: '/forms/submissions',
    /** DELETE - Delete a submission (Admin) */
    DELETE_SUBMISSION: '/forms/submissions', // Append /:id when using
} as const;

/**
 * Content endpoints (content-ms)
 */
export const CONTENT_ENDPOINTS = {
    /** GET - Get all courses */
    COURSES: '/content/courses',
    /** GET - Get course details */
    DETAILS: '/content/courses/:id',
    /** PUT - Update course */
    UPDATE: '/content/courses/:id',
    /** POST - Create course */
    CREATE: '/content/courses',
    /** DELETE - Delete course */
    DELETE: '/content/courses/:id',

    /** POST - Create module */
    CREATE_MODULE: '/content/courses/:courseId/modules',
    /** PUT - Update module */
    UPDATE_MODULE: '/content/modules/:id',
    /** DELETE - Delete module */
    DELETE_MODULE: '/content/modules/:id',

    /** POST - Create lesson */
    CREATE_LESSON: '/content/modules/:moduleId/lessons',
    /** PUT - Update lesson */
    UPDATE_LESSON: '/content/lessons/:id',
    /** DELETE - Delete lesson */
    DELETE_LESSON: '/content/lessons/:id',
    /** DELETE - Remove lesson video */
    REMOVE_VIDEO: '/content/lessons/:id/video',

    /** GET - Get all categories */
    CATEGORIES: '/content/categories',
    /** POST - Create category */
    CREATE_CATEGORY: '/content/categories',
    /** PUT - Update category */
    UPDATE_CATEGORY: '/content/categories/:id',
    /** DELETE - Delete category */
    DELETE_CATEGORY: '/content/categories/:id',
    /** POST - Upload course thumbnail */
    UPLOAD_THUMBNAIL: '/content/courses/:courseId/thumbnail',
    /** POST - Upload lesson video */
    UPLOAD_LESSON_VIDEO: '/content/lessons/:lessonId/video',

    // --- Pricing Plans ---
    /** GET - Get all pricing plans */
    PRICING_PLANS: '/content/pricing/plans',
    /** GET - Get pricing plan by ID */
    PRICING_PLAN_DETAILS: '/content/pricing/plans/:id',
    /** POST - Create pricing plan (Admin) */
    CREATE_PRICING_PLAN: '/content/pricing/plans',
    /** PUT - Update pricing plan (Admin) */
    UPDATE_PRICING_PLAN: '/content/pricing/plans/:id',
    /** DELETE - Delete pricing plan (Admin) */
    DELETE_PRICING_PLAN: '/content/pricing/plans/:id',
} as const;

/**
 * Notification endpoints (communication-ms)
 */
export const NOTIFICATION_ENDPOINTS = {
    /** GET - [Admin] Get all notifications */
    ADMIN_ALL: '/notifications/admin/all',
    /** POST - Create notification */
    CREATE: '/notifications',
    /** PUT - Update notification */
    UPDATE: '/notifications', // Append /:id
    /** DELETE - Delete notification */
    DELETE: '/notifications', // Append /:id
} as const;

/**
 * Payment endpoints (payments-ms)
 */
export const PAYMENTS_ENDPOINTS = {
    /** GET - Get all payments */
    LIST: '/payments',
    /** GET - Get payment details */
    DETAILS: '/payments', // Append /:id
} as const;

/**
 * User profile endpoints (users-ms)
 * Note: Add these when you implement the users microservice
 */
export const USER_ENDPOINTS = {
    /** GET - Get all users (Admin) */
    LIST: '/auth/users', // Append /:currentUserId to exclude self
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
 * @returns Full URL (e.g., "http://192.168.100.9:3001/api/auth/login")
 * 
 * Note: API_BASE_URL should already include the /api prefix.
 * Example: "http://localhost:3001/api" or "https://api.tincadia.com/api"
 */
export const buildUrl = (endpoint: string): string => {
    if (!API_BASE_URL) {
        console.warn('API_BASE_URL is not configured. Check NEXT_PUBLIC_API_URL environment variable.');
        return endpoint; // Fallback to relative URL
    }
    
    // Normalizar baseUrl: remover trailing slash si existe
    const baseUrl = API_BASE_URL.trim().replace(/\/$/, '');
    
    // Asegurar que el endpoint empiece con /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    return `${baseUrl}${normalizedEndpoint}`;
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
        content: CONTENT_ENDPOINTS,
        notifications: NOTIFICATION_ENDPOINTS,
        payments: PAYMENTS_ENDPOINTS,
    },
    buildUrl,
} as const;

export default apiConfig;
