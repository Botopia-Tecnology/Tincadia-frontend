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

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
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
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed h-full z-50 transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
            `}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Tincadia Admin
                    </h1>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
        </>
    );
}
