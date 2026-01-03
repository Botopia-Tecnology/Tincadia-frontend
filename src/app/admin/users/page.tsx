'use client';

import { Search, MoreVertical, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usersService, User } from '@/services/users.service';
import { useAuth } from '@/contexts/AuthContext';

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-900/50 text-purple-400' :
                                                user.role === 'Interpreter' ? 'bg-orange-900/50 text-orange-400' :
                                                    'bg-blue-900/50 text-blue-400'
                                                }`}>
                                                {user.role}
                                            </span>
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
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-white transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
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
