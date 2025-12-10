/**
 * Authentication Types
 * 
 * DTOs and interfaces for authentication operations.
 * These types should match your auth-ms microservice DTOs.
 */

// ===========================================
// User Types
// ===========================================

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    documentType?: string;
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
    refreshToken: string;
    expiresIn: number; // seconds until access token expires
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
    tokens: AuthTokens;
}

// ===========================================
// Register
// ===========================================

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    documentType?: string;
    documentNumber?: string;
    phone?: string;
}

export interface RegisterResponse {
    user: User;
    tokens: AuthTokens;
    message: string;
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
