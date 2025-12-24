import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, Check, X, Shield, User, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Pagination } from '../../components/Pagination';

export const Users = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, approved, admin
    const [page, setPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Query for Users
    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['users', page, filter, debouncedSearch],
        queryFn: async () => {
            let query = supabase
                .from('profiles')
                .select('id, username, avatar_url, is_approved, role, updated_at', { count: 'exact' })
                .order('updated_at', { ascending: false })
                .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

            if (filter === 'pending') {
                query = query.eq('is_approved', false);
            } else if (filter === 'approved') {
                query = query.eq('is_approved', true);
            } else if (filter === 'admin') {
                query = query.eq('role', 'admin');
            }

            if (debouncedSearch) {
                // Use ILIKE for search causing minimal conflict with indexes
                query = query.ilike('username', `%${debouncedSearch}%`);
            }

            const { data, error, count } = await query;
            if (error) throw error;
            return { users: data, total: count };
        },
        placeholderData: keepPreviousData, // Keep showing previous page data while loading next
    });

    const users = data?.users || [];
    const totalCount = data?.total || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Mutation for Actions
    const mutation = useMutation({
        mutationFn: async ({ userId, updates }: { userId: string, updates: any }) => {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.error('Action failed:', error);
            alert('Gagal melakukan aksi.');
        }
    });

    const handleAction = (userId: string, action: 'approve' | 'reject' | 'make_admin' | 'remove_admin') => {
        let updates = {};
        if (action === 'approve') updates = { is_approved: true };
        if (action === 'reject') updates = { is_approved: false };
        if (action === 'make_admin') updates = { role: 'admin' };
        if (action === 'remove_admin') updates = { role: 'member' };

        mutation.mutate({ userId, updates });
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Manajemen Pengguna</h1>
                    <p className="text-gray-500 text-lg">Kelola akses, peran, dan status kurasi member.</p>
                </motion.div>
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/[0.05]">
                    {[
                        { id: 'all', label: 'Semua' },
                        { id: 'pending', label: 'Tinjauan' },
                        { id: 'admin', label: 'Admin' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => { setFilter(f.id); setPage(1); }}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f.id ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Cari berdasarkan username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[2rem] py-5 pl-16 pr-6 text-white text-lg focus:outline-none focus:border-rose-500/50 focus:bg-white/[0.04] transition-all placeholder:text-gray-700"
                />
            </div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Pengguna</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Peran</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Bergabung</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <Loader2 className="animate-spin mx-auto mb-4 text-rose-500" size={32} />
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Memuat data...</p>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-all group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <img
                                                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`}
                                                        alt={user.username}
                                                        className="w-12 h-12 rounded-2xl bg-gray-900 object-cover border border-white/10 group-hover:border-rose-500/50 transition-colors"
                                                    />
                                                    {user.role === 'admin' && (
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-black flex items-center justify-center">
                                                            <Shield size={8} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-white text-lg">{user.username}</div>
                                                    <div className="text-xs text-gray-500 font-medium">{'Member'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-8">
                                            {user.is_approved ? (
                                                <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Tinjauan
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-8 text-sm text-gray-500 font-mono">
                                            {user.updated_at ? new Date(user.updated_at).toLocaleDateString('id-ID') : '-'}
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                {!user.is_approved && (
                                                    <button
                                                        onClick={() => handleAction(user.id, 'approve')}
                                                        className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center"
                                                        title="Setujui"
                                                        disabled={mutation.isPending}
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                {user.is_approved && (
                                                    <button
                                                        onClick={() => handleAction(user.id, 'reject')}
                                                        className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center"
                                                        title="Batalkan Persetujuan"
                                                        disabled={mutation.isPending}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction(user.id, user.role === 'admin' ? 'remove_admin' : 'make_admin')}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${user.role === 'admin' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                                                    title={user.role === 'admin' ? "Cabut Admin" : "Jadikan Admin"}
                                                    disabled={mutation.isPending}
                                                >
                                                    {user.role === 'admin' ? <User size={18} /> : <Shield size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {users.length > 0 && (
                    <div className="px-8 pb-8">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            hasMore={!isPlaceholderData && page < totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                            loading={isPlaceholderData}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
};
