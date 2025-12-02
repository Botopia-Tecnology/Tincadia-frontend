'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UIContextType {
    isRegistrationPanelOpen: boolean;
    setIsRegistrationPanelOpen: (isOpen: boolean) => void;
    registrationEmail: string;
    setRegistrationEmail: (email: string) => void;
    isLoginPanelOpen: boolean;
    setIsLoginPanelOpen: (isOpen: boolean) => void;
    openLoginPanel: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] = useState(false);
    const [registrationEmail, setRegistrationEmail] = useState('');
    const [isLoginPanelOpen, setIsLoginPanelOpen] = useState(false);

    const openLoginPanel = () => setIsLoginPanelOpen(true);

    // Expose login panel function globally for Navbar (legacy support if needed, but context is better)
    useEffect(() => {
        (window as any).openLoginPanel = openLoginPanel;
        return () => {
            delete (window as any).openLoginPanel;
        };
    }, []);

    return (
        <UIContext.Provider value={{
            isRegistrationPanelOpen,
            setIsRegistrationPanelOpen,
            registrationEmail,
            setRegistrationEmail,
            isLoginPanelOpen,
            setIsLoginPanelOpen,
            openLoginPanel
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
