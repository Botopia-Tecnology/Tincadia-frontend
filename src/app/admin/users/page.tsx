'use client';

import { Search, MoreVertical, Loader2, Edit, Trash2, Check, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { usersService, User } from '@/services/users.service';
import { useAuth } from '@/contexts/AuthContext';

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuUserId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (currentUser?.id) {
            fetchUsers();
        }
    }, [currentUser]);

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

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateRole = async (userId: string) => {
        try {
            await usersService.updateUserRole(userId, selectedRole);
            // Update local state
            setUsers(users.map(u => u.id === userId ? { ...u, role: selectedRole } : u));
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Add User functionality would go here - usually via invite or admin creation */}
                    <button className="bg-slate-700 text-slate-400 cursor-not-allowed px-4 py-2 rounded-lg font-medium">
                        Agregar Usuario
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Última Actividad</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-500">No se encontraron usuarios.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold uppercase">
                                                    {user.firstName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
                                                    <div className="text-sm text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingUserId === user.id ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={selectedRole}
                                                        onChange={(e) => setSelectedRole(e.target.value)}
                                                        className="bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600 focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="User">User</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Interpreter">Interpreter</option>
                                                    </select>
                                                    <button onClick={() => handleUpdateRole(user.id)} className="text-green-400 hover:text-green-300">
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={() => setEditingUserId(null)} className="text-red-400 hover:text-red-300">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-900/50 text-purple-400' :
                                                    user.role === 'Interpreter' ? 'bg-orange-900/50 text-orange-400' :
                                                        'bg-blue-900/50 text-blue-400'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                                                {user.status === 'Active' ? 'Activo' : user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuUserId(activeMenuUserId === user.id ? null : user.id);
                                                }}
                                                className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {activeMenuUserId === user.id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-8 top-8 z-10 w-48 bg-slate-800 rounded-md shadow-lg border border-slate-700 py-1"
                                                >
                                                    <button
                                                        onClick={() => startEditing(user)}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                                                    >
                                                        <Edit size={14} />
                                                        Cambiar Rol
                                                    </button>
                                                    {/* Future actions like Delete or Ban */}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
