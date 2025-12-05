'use client';

import { useUI } from '@/contexts/UIContext';
import { LoginPanel } from '@/components/landing/LoginPanel';
import { RegistrationPanel } from '@/components/landing/RegistrationPanel';

export function GlobalPanels() {
    const {
        isRegistrationPanelOpen,
        setIsRegistrationPanelOpen,
        registrationEmail,
        setRegistrationEmail,
        isLoginPanelOpen,
        setIsLoginPanelOpen
    } = useUI();

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
        </>
    );
}
