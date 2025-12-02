'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAccessibility, TextColor } from '@/hooks/useAccessibility';

// Define the shape of the context based on the hook's return type
type AccessibilityContextType = ReturnType<typeof useAccessibility>;

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const accessibility = useAccessibility();

    return (
        <AccessibilityContext.Provider value={accessibility}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibilityContext() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
    }
    return context;
}
