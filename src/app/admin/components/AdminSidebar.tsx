'use client';

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
    Home,
    BarChart3
} from 'lucide-react';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const SidebarItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

export function AdminSidebar() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed h-full">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Tincadia Admin
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <SidebarItem href="/admin" icon={LayoutDashboard} label="Panel" />
                <SidebarItem href="/admin/users" icon={Users} label="Usuarios" />
                <SidebarItem href="/admin/courses" icon={BookOpen} label="Cursos (CMS)" />
                <SidebarItem href="/admin/notifications" icon={Bell} label="Notificaciones" />
                <SidebarItem href="/admin/finance" icon={CreditCard} label="Finanzas" />
                <SidebarItem href="/admin/pricing" icon={CreditCard} label="Precios" />
                <SidebarItem href="/admin/forms" icon={FileText} label="Formularios" />
                <SidebarItem href="/admin/landing" icon={Settings} label="Landing Page" />
                <SidebarItem href="/admin/analytics" icon={BarChart3} label="Analytics" />
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Home size={20} />
                    <span className="font-medium">Volver al Sitio</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
