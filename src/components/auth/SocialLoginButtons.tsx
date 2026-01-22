'use client';

import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

interface SocialLoginButtonsProps {
    onGoogleSuccess: (credentialResponse: CredentialResponse) => void;
    onGoogleError: () => void;
    onAppleClick: () => void;
    disabled?: boolean;
    googleText?: 'signin_with' | 'signup_with' | 'continue_with';
}

export function SocialLoginButtons({
    onGoogleSuccess,
    onGoogleError,
    onAppleClick,
    disabled = false,
    googleText = 'continue_with',
}: SocialLoginButtonsProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full">
            <div className="flex-1 flex justify-center w-full">
                <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={onGoogleError}
                    size="large"
                    shape="rectangular"
                    text={googleText}
                    locale="es"
                />
            </div>

            <div className="flex-1 flex justify-center w-full">
                <button
                    onClick={onAppleClick}
                    disabled={disabled}
                    className="flex items-center justify-center gap-2 w-full h-[40px] px-4 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    title="Apple"
                    style={{ maxWidth: '100%' }}
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <span className="text-sm font-roboto">Apple</span>
                </button>
            </div>
        </div>
    );
}
