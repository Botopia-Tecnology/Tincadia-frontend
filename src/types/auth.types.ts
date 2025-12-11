/**
 * Authentication Types
 * 
 * DTOs and interfaces for authentication operations.
 * These types should match your auth-ms microservice DTOs.
 */

// ===========================================
// Document Types (from document_types table)
// ===========================================

/**
 * Document type IDs matching the document_types table
 * 1 = CC (Cédula de Ciudadanía)
 * 2 = TI (Tarjeta de Identidad)
 * 3 = CE (Cédula de Extranjería)
 * 4 = Pasaporte
 */
export type DocumentTypeId = 1 | 2 | 3 | 4;

export interface DocumentType {
    id: DocumentTypeId;
    name: string;
}

/**
 * Document types available for registration
 */
export const DOCUMENT_TYPES: DocumentType[] = [
    { id: 1, name: 'CC' },
    { id: 2, name: 'TI' },
    { id: 3, name: 'CE' },
    { id: 4, name: 'Pasaporte' },
];

// ===========================================
// User Types
// ===========================================

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    documentTypeId?: number;
    documentType?: string; // Document type name from backend
    documentNumber?: string;
    phone?: string;
    avatarUrl?: string;
    authProvider?: string;
    emailVerified: boolean;
    isProfileComplete?: boolean; // Backend provides this directly
    createdAt?: string;
    updatedAt?: string;
}

// ===========================================
// Authentication Tokens
// ===========================================

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string; // Optional - backend may not provide
    expiresIn?: number; // Optional - seconds until access token expires
}

// ===========================================
// Login
// ===========================================

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    session?: unknown;
    isProfileComplete?: boolean; // At response level, not in user
}

// ===========================================
// Register
// ===========================================

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    documentTypeId?: number;
    documentNumber?: string;
    phone?: string;
}

export interface RegisterResponse {
    user: User;
    token: string;
    session?: unknown;
    isProfileComplete?: boolean;
}

// ===========================================
// OAuth Authentication
// ===========================================

export type OAuthProvider = 'google' | 'apple' | 'microsoft' | 'facebook';

export interface OAuthLoginDto {
    provider: OAuthProvider;
    idToken: string;        // ID Token from OAuth provider (required for Google/Apple)
    accessToken?: string;   // Access Token (optional)
}

// OAuth uses the same response format as regular login
export type OAuthLoginResponse = LoginResponse;

// ===========================================
// Profile Update (for OAuth users to complete profile)
// ===========================================

export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    documentTypeId?: number;
    documentNumber?: string;
    phone?: string;
}

export interface UpdateProfileResponse {
    message: string;
    profile: User;
}

/**
 * Check if a user profile has all required fields filled
 * Uses backend's isProfileComplete if available, otherwise checks fields
 */
export function isProfileComplete(user: User | null): boolean {
    if (!user) return false;

    // Prefer backend's isProfileComplete flag if available
    if (typeof user.isProfileComplete === 'boolean') {
        return user.isProfileComplete;
    }

    // Fallback: check if required fields are filled
    return !!(
        (user.documentTypeId || user.documentType) &&
        user.documentNumber &&
        user.phone
    );
}

// ===========================================
// Password Recovery
// ===========================================

export interface ForgotPasswordDto {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordDto {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
}

// ===========================================
// Email Verification
// ===========================================

export interface VerifyEmailDto {
    token: string;
}

export interface VerifyEmailResponse {
    message: string;
    user: User;
}

// ===========================================
// Token Refresh
// ===========================================

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    tokens: AuthTokens;
}

// ===========================================
// Auth State
// ===========================================

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
    user: User | null;
    status: AuthStatus;
    error: string | null;
}
