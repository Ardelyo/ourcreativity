import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, Users, FileText, Megaphone,
    Settings, LogOut, ArrowLeft
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';

export const AdminLayout = () => {
    const location = useLocation();
    const { signOut } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Beranda', path: '/admin' },
        { icon: Users, label: 'Pengguna', path: '/admin/users' },
        { icon: FileText, label: 'Konten', path: '/admin/content' },
        { icon: Megaphone, label: 'Pengumuman', path: '/admin/announcements' },
        { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30">
            {/* Sidebar - Clean & Zen */}
            <aside className="w-64 border-r border-white-[0.05] flex flex-col fixed inset-y-0 bg-[#080808] z-50">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-9 h-9 bg-gradient-to-tr from-rose-500 to-rose-700 rounded-xl flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                            O
                        </div>
                        <div>
                            <h1 className="font-black tracking-tighter text-lg leading-none">OC.ADMIN</h1>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-rose-500/80 font-bold">Zen System</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-4 mb-3">Menu Utama</div>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive(item.path)
                                ? 'bg-white/5 text-rose-500 font-bold'
                                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
                                }`}
                        >
                            <item.icon size={18} className={`transition-transform duration-500 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                            {isActive(item.path) && (
                                <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/[0.05] space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-all text-sm group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Situs
                    </Link>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 transition-all text-sm group"
                    >
                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                        Keluar Sesi
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Zen Mode */}
            <main className="flex-1 ml-64 min-h-screen relative overflow-hidden">
                {/* Minimal Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 p-10 max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
