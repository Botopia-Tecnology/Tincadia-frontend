'use client';

import { useState, useEffect } from 'react';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPanel } from '@/components/landing/LoginPanel';
import { RegistrationPanel } from '@/components/landing/RegistrationPanel';
import { CompleteProfileModal } from '@/components/landing/CompleteProfileModal';

export function GlobalPanels() {
    const {
        isRegistrationPanelOpen,
        setIsRegistrationPanelOpen,
        registrationEmail,
        setRegistrationEmail,
        isLoginPanelOpen,
        setIsLoginPanelOpen
    } = useUI();

    const { isAuthenticated, profileComplete } = useAuth();
    const [showCompleteProfile, setShowCompleteProfile] = useState(false);

    // Show complete profile modal after OAuth login if profile is incomplete
    useEffect(() => {
        if (isAuthenticated && !profileComplete) {
            // Small delay to let login panel close first
            const timer = setTimeout(() => {
                setShowCompleteProfile(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setShowCompleteProfile(false);
        }
    }, [isAuthenticated, profileComplete]);

    return (
        <>
            <LoginPanel
                isOpen={isLoginPanelOpen}
                onClose={() => setIsLoginPanelOpen(false)}
                onSignUpClick={(email) => {
                    setIsLoginPanelOpen(false);
                    if (email) setRegistrationEmail(email);
                    setIsRegistrationPanelOpen(true);
                }}
            />

            <RegistrationPanel
                isOpen={isRegistrationPanelOpen}
                onClose={() => setIsRegistrationPanelOpen(false)}
                initialEmail={registrationEmail}
            />

            <CompleteProfileModal
                isOpen={showCompleteProfile}
                onClose={() => setShowCompleteProfile(false)}
            />
        </>
    );
}
