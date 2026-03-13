'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, userService } from '@/services/user.service';
import { formsService } from '@/services/forms.service';
import { Payment, paymentsService } from '@/services/payments.service';

export type Tab = 'profile' | 'transactions' | 'subscription' | 'applications';

export function useUserProfile() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [user, setUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [subscription, setSubscription] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingApplication, setEditingApplication] = useState<any | null>(null);

    const loadData = useCallback(async () => {
        try {
            const userData = await userService.getMe();
            setUser(userData);

            if (userData?.id) {
                const [txData, subData, appsData] = await Promise.all([
                    paymentsService.getUserTransactions(userData.id),
                    paymentsService.getActiveSubscription(userData.id).catch(() => null),
                    formsService.getMyApplications(
                        userData.id,
                        userData.email,
                        userData.documentNumber
                    ).catch(() => [])
                ]);
                setTransactions(txData.items || []);
                const activeSub = Array.isArray(subData) ? subData[0] : subData;
                setSubscription(activeSub);
                setApplications(appsData || []);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleLogout = async () => {
        await logout();
    };

    return {
        user,
        transactions,
        subscription,
        applications,
        loading,
        activeTab,
        setActiveTab,
        editingApplication,
        setEditingApplication,
        handleLogout,
        refresh: loadData
    };
}
