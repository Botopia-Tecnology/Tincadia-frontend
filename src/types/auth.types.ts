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
    documentNumber?: string;
    phone?: string;
    avatarUrl?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
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
