'use client';

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
    OAuthProvider,
    UpdateProfileDto,
} from '@/types/auth.types';
import { isProfileComplete } from '@/types/auth.types';

interface AuthContextValue {
    user: User | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    profileComplete: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    loginWithOAuth: (provider: OAuthProvider, idToken: string, accessToken?: string) => Promise<void>;
    register: (userData: RegisterDto) => Promise<void>;
    updateProfile: (profileData: UpdateProfileDto) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<AuthStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = status === 'authenticated';
    const isLoading = status === 'loading';

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

    const login = useCallback(async (credentials: LoginDto) => {
        setStatus('loading');
        setError(null);

        try {
            const response = await authService.login(credentials);
            setUser({
                ...response.user,
                isProfileComplete: response.isProfileComplete ?? response.user.isProfileComplete,
            });
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

    const register = useCallback(async (userData: RegisterDto) => {
        setStatus('loading');
        setError(null);

        try {
            const response = await authService.register(userData);
            setUser({
                ...response.user,
                isProfileComplete: response.isProfileComplete ?? response.user.isProfileComplete,
            });
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

    const loginWithOAuth = useCallback(async (provider: OAuthProvider, idToken: string, accessToken?: string) => {
        setStatus('loading');
        setError(null);

        try {
            const response = await authService.loginWithOAuth(provider, idToken, accessToken);
            setUser({
                ...response.user,
                isProfileComplete: response.isProfileComplete ?? response.user.isProfileComplete,
            });
            setStatus('authenticated');
        } catch (err) {
            setStatus('unauthenticated');
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred during OAuth login');
            }
            throw err;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setStatus('unauthenticated');
            setError(null);
        }
    }, []);

    const updateProfile = useCallback(async (profileData: UpdateProfileDto) => {
        if (!user) {
            throw new Error('User must be logged in to update profile');
        }

        setError(null);

        try {
            const response = await authService.updateProfile(user.id, profileData);
            const updatedProfile = response.profile || (response as unknown as { user?: User }).user || response;

            if (updatedProfile && typeof updatedProfile === 'object' && 'id' in updatedProfile) {
                setUser({
                    ...user,
                    ...updatedProfile,
                } as User);
            } else {
                setUser({
                    ...user,
                    ...profileData,
                } as User);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred updating profile');
            }
            throw err;
        }
    }, [user]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const profileComplete = isProfileComplete(user);

    const value: AuthContextValue = {
        user,
        status,
        isAuthenticated,
        isLoading,
        error,
        profileComplete,
        login,
        loginWithOAuth,
        register,
        updateProfile,
        logout,
        clearError,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
