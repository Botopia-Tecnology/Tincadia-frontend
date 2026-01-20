import type { Metadata } from 'next';
import React from 'react';
import { AdminShell } from './components/AdminShell';

export const metadata: Metadata = {
    title: 'Tincadia Admin',
    description: 'Tincadia Administration Dashboard',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminShell>
            {children}
        </AdminShell>
    );
}
