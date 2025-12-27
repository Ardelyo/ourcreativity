import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Megaphone, Activity, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export const Dashboard = () => {
    const queryClient = useQueryClient();

    const { data, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const [
                { count: totalUsers },
                { count: pendingUsers },
                { count: activeAnnouncements },
                { count: totalWorks },
                { data: latestWorks },
                { data: latestUsers }
            ] = await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_approved', false),
                supabase.from('announcements').select('id', { count: 'exact', head: true }).eq('is_active', true),
                supabase.from('works').select('id', { count: 'exact', head: true }),
                supabase.from('works').select('title, author, created_at').order('created_at', { ascending: false }).limit(5),
                supabase.from('profiles').select('username, updated_at').order('updated_at', { ascending: false }).limit(5)
            ]);

            const stats = [
                { label: 'Total Pengguna', value: (totalUsers || 0).toString(), change: '+100%', icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                { label: 'Member Tertunda', value: (pendingUsers || 0).toString(), change: pendingUsers ? 'Perlu Tindakan' : 'Bersih', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Pengumuman Aktif', value: (activeAnnouncements || 0).toString(), change: 'Live', icon: Megaphone, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { label: 'Total Karya', value: (totalWorks || 0).toString(), change: 'Stabil', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ];

            const activities = [
                ...(latestWorks || []).map(w => ({ user: w.author, action: `Mengunggah karya: ${w.title}`, time: new Date(w.created_at) })),
                ...(latestUsers || []).map(u => ({ user: u.username, action: 'Memperbarui profil / Bergabung', time: new Date(u.updated_at) }))
            ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

            return { stats, activities };
        }
    });

    const stats = data?.stats || [
        { label: 'Total Pengguna', value: '-', change: '...', icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Member Tertunda', value: '-', change: '...', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Pengumuman Aktif', value: '-', change: '...', icon: Megaphone, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Total Karya', value: '-', change: '...', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];
    const recentActivity = data?.activities || [];

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        return date.toLocaleDateString('id-ID');
    };

    return (
        <div className="space-y-12 pb-20">
            <header className="relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-black tracking-tight mb-2">Ringkasan Sistem</h1>
                    <p className="text-gray-500 text-lg">Data real-time performa platform Anda.</p>
                </motion.div>
            </header>

            {/* Stats Grid - Ultra Clean */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={22} />
                            </div>
                            <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full bg-white/5 text-gray-500`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-black mb-1">{loading ? '...' : stat.value}</h3>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Grid for activity and more */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black tracking-tight">Aktivitas Terbaru</h2>
                        <button onClick={() => refetch()} className="text-xs font-bold text-rose-500 uppercase tracking-widest hover:text-white transition-colors">Segarkan</button>
                    </div>
                    <div className="space-y-2">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center opacity-20">
                                <Loader2 className="animate-spin mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Sinkronisasi...</span>
                            </div>
                        ) : recentActivity.length > 0 ? (
                            recentActivity.map((item, i) => (
                                <div key={i} className="flex items-center gap-5 p-5 hover:bg-white/[0.03] rounded-3xl transition-all cursor-pointer group border border-transparent hover:border-white/[0.05]">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 shadow-xl">
                                        {(item.user || '?').substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white group-hover:text-rose-500 transition-colors">{item.user || 'Seseorang'}</p>
                                        <p className="text-xs text-gray-500">{item.action}</p>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                                        {formatTime(item.time)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-gray-700 font-black uppercase tracking-widest text-[10px]">Belum ada aktivitas baru.</div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 rounded-[2.5rem] p-8 flex flex-col justify-center text-center space-y-4"
                >
                    <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(225,29,72,0.4)]">
                        <Activity className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-black">Status Server</h3>
                    <p className="text-gray-400 text-sm">Semua sistem beroperasi normal tanpa gangguan.</p>
                    <div className="pt-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-500 rounded-full text-xs font-black uppercase tracking-widest">
                            Terlindungi
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
