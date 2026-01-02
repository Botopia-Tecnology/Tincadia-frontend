import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { AdminSidebar } from './components/AdminSidebar';

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
        <div className="flex min-h-screen bg-slate-900 text-slate-100">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
