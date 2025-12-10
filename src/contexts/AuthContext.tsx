'use client';

/**
 * Authentication Context
 * 
 * Provides global authentication state and actions.
 * Handles session persistence and auto-refresh.
 */

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import { authService, isAuthError } from '@/services/auth.service';
import { tokenStorage } from '@/lib/api-client';
import type {
    User,
    AuthStatus,
    LoginDto,
    RegisterDto,
} from '@/types/auth.types';

// ===========================================
// Types
// ===========================================

interface AuthContextValue {
    // State
    user: User | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginDto) => Promise<void>;
    register: (userData: RegisterDto) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

// ===========================================
// Context
// ===========================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ===========================================
// Provider
// ===========================================

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<AuthStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    // Derived state
    const isAuthenticated = status === 'authenticated';
    const isLoading = status === 'loading';

    /**
     * Fetch current user from API
     */
    const refreshUser = useCallback(async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setStatus('authenticated');
        } catch (err) {
            if (isAuthError(err)) {
                setUser(null);
                setStatus('unauthenticated');
                tokenStorage.clearTokens();
            }
        }
    }, []);

    /**
     * Initialize auth state on mount
     */
    useEffect(() => {
        const initAuth = async () => {
            if (!tokenStorage.hasTokens()) {
                setStatus('unauthenticated');
                return;
            }

            setStatus('loading');
            await refreshUser();
        };

        initAuth();
    }, [refreshUser]);

    /**
     * Login action
     */
    const login = useCallback(async (credentials: LoginDto) => {
        setStatus('loading');
        setError(null);

        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            setStatus('authenticated');
        } catch (err) {
            setStatus('unauthenticated');
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred during login');
            }
            throw err;
        }
    }, []);

    /**
     * Register action
     */
    const register = useCallback(async (userData: RegisterDto) => {
        setStatus('loading');
        setError(null);

        try {
            const response = await authService.register(userData);
            setUser(response.user);
            setStatus('authenticated');
        } catch (err) {
            setStatus('unauthenticated');
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred during registration');
            }
            throw err;
        }
    }, []);

    /**
     * Logout action
     */
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setStatus('unauthenticated');
            setError(null);
        }
    }, []);

    /**
     * Clear error
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // ===========================================
    // Context Value
    // ===========================================

    const value: AuthContextValue = {
        user,
        status,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ===========================================
// Hook
// ===========================================

/**
 * Hook to access authentication context
 * 
 * @example
 * function ProfileButton() {
 *   const { user, isAuthenticated, logout } = useAuth();
 * 
 *   if (!isAuthenticated) {
 *     return <LoginButton />;
 *   }
 * 
 *   return (
 *     <button onClick={logout}>
 *       {user?.firstName}
 *     </button>
 *   );
 * }
 */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export default AuthContext;
