'use client';

import { Search, MoreVertical, Loader2, Edit, Trash2, Check, X, ChevronLeft, ChevronRight, Filter, ListFilter, Mail, Phone, Calendar, User as UserIcon, Shield } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { usersService, User } from '@/services/users.service';
import { useAuth } from '@/contexts/AuthContext';

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);

    // Interaction State
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuUserId(null);
            }
            // Close panel if clicked outside (optional, maybe better not to closing accidentally)
            // if (panelRef.current && !panelRef.current.contains(event.target as Node) && selectedUser) {
            //    setSelectedUser(null);
            // }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedUser]);

    useEffect(() => {
        if (currentUser?.id) {
            fetchUsers();
        }
    }, [currentUser]);

    // Reset page on filter/size change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter, statusFilter, usersPerPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersService.getAllUsers(currentUser!.id);
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        const matchesStatus = statusFilter === 'all' ||
            user.status === statusFilter ||
            user.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleUpdateRole = async (userId: string) => {
        try {
            await usersService.updateUserRole(userId, selectedRole);
            // Update local state and selected user if needed
            setUsers(users.map(u => u.id === userId ? { ...u, role: selectedRole } : u));
            if (selectedUser?.id === userId) {
                setSelectedUser(prev => prev ? ({ ...prev, role: selectedRole }) : null);
            }
            setEditingUserId(null);
            setActiveMenuUserId(null);
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Error al actualizar el rol');
        }
    };

    const startEditing = (user: User) => {
        setEditingUserId(user.id);
        setSelectedRole(user.role);
        setActiveMenuUserId(null); // Close menu
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    const handleGmailRedirect = (email: string) => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
    };

    return (
        <div className="space-y-6 p-2 relative">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
                    <p className="text-slate-400 text-sm">Administra roles, estados y accesos</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

                    <div className="flex gap-3 w-full sm:w-auto">
                        {/* Role Filter */}
                        <div className="relative flex-1 sm:flex-none">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full sm:w-auto pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:border-slate-600 transition-colors"
                            >
                                <option value="all">Roles (Todos)</option>
                                <option value="User">Usuarios</option>
                                <option value="Admin">Admin</option>
                                <option value="Interpreter">Intérpretes</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="relative flex-1 sm:flex-none">
                            <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full sm:w-auto pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:border-slate-600 transition-colors"
                            >
                                <option value="all">Estado (Todos)</option>
                                <option value="Active">Activo</option>
                                <option value="Inactive">Inactivo</option>
                                <option value="Pending">Pendiente</option>
                            </select>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-6 items-start">
                {/* Users Table */}
                <div className={`flex-1 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl transition-all duration-300`}>
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-400 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Usuario</th>
                                            <th className="px-6 py-4 hidden md:table-cell">Rol</th>
                                            <th className="px-6 py-4 hidden lg:table-cell">Estado</th>
                                            <th className="px-6 py-4 hidden xl:table-cell">Registro</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {currentUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12 text-slate-500">
                                                    No se encontraron usuarios con los filtros actuales.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    onClick={() => setSelectedUser(user)}
                                                    className={`cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-slate-700/60 border-l-2 border-blue-500' : 'hover:bg-slate-700/30 border-l-2 border-transparent'}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                                                                {user.firstName.charAt(0)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-medium text-white truncate max-w-[150px] md:max-w-none">{user.firstName} {user.lastName}</div>
                                                                <div className="text-xs text-slate-400 truncate max-w-[150px] md:max-w-none">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        {editingUserId === user.id ? (
                                                            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-600 w-fit" onClick={e => e.stopPropagation()}>
                                                                <select
                                                                    value={selectedRole}
                                                                    onChange={(e) => setSelectedRole(e.target.value)}
                                                                    className="bg-transparent text-white text-xs rounded px-1 py-1 focus:outline-none"
                                                                >
                                                                    <option value="User">User</option>
                                                                    <option value="Admin">Admin</option>
                                                                    <option value="Interpreter">Interpreter</option>
                                                                </select>
                                                                <button onClick={() => handleUpdateRole(user.id)} className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded transition">
                                                                    <Check size={14} />
                                                                </button>
                                                                <button onClick={() => setEditingUserId(null)} className="p-1 hover:bg-rose-500/20 text-rose-400 rounded transition">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border ${user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                                    user.role === 'Interpreter' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                }`}>
                                                                {user.role}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 hidden lg:table-cell">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${user.status === 'Active' || user.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-slate-500'}`} />
                                                            <span className="text-sm text-slate-300 capitalize">{user.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400 text-sm hidden xl:table-cell">
                                                        {formatDate(user.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveMenuUserId(activeMenuUserId === user.id ? null : user.id);
                                                            }}
                                                            className={`p-1.5 rounded-lg transition-colors ${activeMenuUserId === user.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>

                                                        {activeMenuUserId === user.id && (
                                                            <div
                                                                ref={menuRef}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="absolute right-8 top-8 z-50 w-48 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 p-1"
                                                            >
                                                                <button
                                                                    onClick={() => startEditing(user)}
                                                                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
                                                                >
                                                                    <Edit size={14} />
                                                                    Cambiar Rol
                                                                </button>
                                                                <button
                                                                    onClick={() => handleGmailRedirect(user.email)}
                                                                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
                                                                >
                                                                    <Mail size={14} />
                                                                    Enviar Email
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            <div className="border-t border-slate-700 p-4 bg-slate-900/30 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span className="hidden sm:inline">Mostrar:</span>
                                    <select
                                        value={usersPerPage}
                                        onChange={(e) => setUsersPerPage(Number(e.target.value))}
                                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span>
                                        <span className="font-medium text-white">{filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0}</span> - <span className="font-medium text-white">{Math.min(indexOfLastUser, filteredUsers.length)}</span> de <span className="font-medium text-white">{filteredUsers.length}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <div className="hidden sm:flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
                                            const shouldShow = number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1);
                                            if (!shouldShow) {
                                                if (number === currentPage - 2 || number === currentPage + 2) return <span key={number} className="text-slate-600 px-1">...</span>;
                                                return null;
                                            }

                                            return (
                                                <button
                                                    key={number}
                                                    onClick={() => setCurrentPage(number)}
                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === number
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                            : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                                                        }`}
                                                >
                                                    {number}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User Detail Side Panel */}
                <div
                    className={`fixed inset-y-0 right-0 w-full md:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${selectedUser ? 'translate-x-0' : 'translate-x-full'}`}
                    ref={panelRef}
                >
                    {selectedUser ? (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                                <h3 className="text-xl font-bold text-white">Perfil de Usuario</h3>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Profile Header */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg ring-4 ring-slate-800 mb-4">
                                        {selectedUser.firstName.charAt(0)}
                                    </div>
                                    <h4 className="text-2xl font-bold text-white max-w-full break-words">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h4>
                                    <p className="text-slate-400 mt-1">{selectedUser.email}</p>
                                    <div className="mt-4 flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${selectedUser.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                selectedUser.role === 'Interpreter' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {selectedUser.role}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${selectedUser.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                            {selectedUser.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-4">
                                        <h5 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Información de Contacto</h5>

                                        <div className="flex gap-3 items-start">
                                            <Mail className="text-blue-500 shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Correo Electrónico</p>
                                                <p className="text-sm text-slate-200 break-all">{selectedUser.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 items-start">
                                            <Phone className="text-indigo-500 shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Teléfono</p>
                                                <p className="text-sm text-slate-200">{selectedUser.phone || 'No registrado'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-4">
                                        <h5 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Detalles de Cuenta</h5>

                                        <div className="flex gap-3 items-start">
                                            <Calendar className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Fecha de Registro</p>
                                                <p className="text-sm text-slate-200">{formatDate(selectedUser.createdAt)}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 items-start">
                                            <Shield className="text-purple-500 shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">ID de Usuario</p>
                                                <p className="text-xs font-mono text-slate-400 break-all">{selectedUser.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                                <button
                                    onClick={() => handleGmailRedirect(selectedUser.email)}
                                    className="w-full py-3 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-3"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center relative">
                                        {/* Simple Gmail-like icon or just Mail icon */}
                                        <Mail size={20} className="text-red-500" />
                                    </div>
                                    Redactar en Gmail
                                </button>

                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700"
                                >
                                    Cerrar Detalles
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="animate-spin text-blue-500" />
                        </div>
                    )}
                </div>

                {/* Backdrop for mobile */}
                {selectedUser && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setSelectedUser(null)}
                    />
                )}
            </div>
        </div>
    );
}
