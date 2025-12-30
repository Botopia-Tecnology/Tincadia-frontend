import type { Metadata } from 'next';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    Bell,
    CreditCard,
    LogOut,
    FileText,
    Home
} from 'lucide-react';
import React from 'react';

export const metadata: Metadata = {
    title: 'Tincadia Admin',
    description: 'Tincadia Administration Dashboard',
};

const SidebarItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-900 text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed h-full">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Tincadia Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem href="/admin/users" icon={Users} label="Users" />
                    <SidebarItem href="/admin/courses" icon={BookOpen} label="Courses (CMS)" />
                    <SidebarItem href="/admin/notifications" icon={Bell} label="Notifications" />
                    <SidebarItem href="/admin/finance" icon={CreditCard} label="Finance" />
                    <SidebarItem href="/admin/forms" icon={FileText} label="Formularios" />
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <SidebarItem href="/admin/settings" icon={Settings} label="Settings" />
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Home size={20} />
                        <span className="font-medium">Volver al Sitio</span>
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-950/30 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
