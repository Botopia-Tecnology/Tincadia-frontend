'use client';

/**
 * Google OAuth Provider
 * 
 * Wraps the app with Google OAuth context.
 * Uses the Google Client ID from environment variables.
 * 
 * Configuration:
 * 1. Get your Google Client ID from Google Cloud Console
 * 2. Add to .env.local: NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
 */

import { GoogleOAuthProvider } from '@react-oauth/google';
import { type ReactNode } from 'react';

interface GoogleAuthProviderProps {
    children: ReactNode;
}

/**
 * Google OAuth Client ID
 * Set this in your .env.local file
 */
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
    // If no client ID is configured, just render children without the provider
    if (!GOOGLE_CLIENT_ID) {
        console.warn('Google Client ID not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local');
        return <>{children}</>;
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    );
}

export default GoogleAuthProvider;
