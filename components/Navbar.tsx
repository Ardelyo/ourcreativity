import React, { useState, useEffect } from 'react';
import { Menu, X, Asterisk, ArrowRight, User as UserIcon, LogOut, Settings, ChevronRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Beranda', href: '/' },
        { name: 'Karya', href: '/karya' },
        { name: 'Tim', href: '/tim' },
        { name: 'Info', href: '/info' },
        { name: 'Pengumuman', href: '/announcement' },
    ];

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const handleScroll = () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                setIsScrolled(window.scrollY > 50);
                timeoutId = undefined!;
            }, 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Tentukan apakah kita harus menampilkan menu lengkap (Desktop)
    const showFullMenu = !isScrolled || isHovered;

    // Konfigurasi transisi animasi - pegas cair "mirip Apple"
    const springTransition = {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
        mass: 0.8
    };

    const containerVariants = {
        collapsed: {
            width: "auto",
            height: "50px",
            borderRadius: "50px",
            padding: "8px 16px",
        },
        expanded: {
            width: "auto",
            height: "60px",
            borderRadius: "50px",
            padding: "12px 24px",
        },
        profileOpen: {
            width: "auto",
            minWidth: "200px",
            height: "auto",
            borderRadius: "32px",
            padding: "12px 20px 20px 20px",
        },
        mobileOpen: {
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            borderRadius: "32px",
            padding: "24px",
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
            <motion.nav
                layout
                initial="expanded"
                animate={isMobileMenuOpen ? "mobileOpen" : (isProfileOpen ? "profileOpen" : (showFullMenu ? "expanded" : "collapsed"))}
                variants={containerVariants}
                transition={springTransition}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="pointer-events-auto bg-[#111]/90 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
            >
                <div className={`flex items-center justify-between w-full relative ${showFullMenu && !isMobileMenuOpen ? 'gap-12' : 'gap-4'} ${isProfileOpen ? 'h-[40px]' : 'h-full'}`}>
                    {/* Logo & Title Wrapper */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2 group shrink-0 relative z-10" onClick={() => setIsMobileMenuOpen(false)}>
                            <motion.div
                                layout="position"
                                className={`rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors ${showFullMenu || isMobileMenuOpen ? 'w-8 h-8 bg-white/10' : 'w-8 h-8 bg-transparent'}`}
                            >
                                <Asterisk size={showFullMenu || isMobileMenuOpen ? 18 : 20} className={!(showFullMenu || isMobileMenuOpen) ? "animate-spin-slow" : ""} />
                            </motion.div>
                        </Link>

                        <AnimatePresence mode="popLayout">
                            {(showFullMenu || isMobileMenuOpen) && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -10, filter: "blur(5px)" }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="font-serif font-bold text-lg tracking-tight text-white whitespace-nowrap"
                                >
                                    Our Creativity.
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Tautan Desktop */}
                    <AnimatePresence mode="popLayout">
                        {showFullMenu && !isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                                transition={{ duration: 0.25 }}
                                className="hidden md:flex items-center gap-1"
                            >
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={`px-4 py-2 text-[10px] lg:text-xs font-medium uppercase tracking-[0.2em] transition-all rounded-full whitespace-nowrap relative group ${isActive(link.href)
                                            ? 'text-white'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        {isActive(link.href) && (
                                            <motion.div
                                                layoutId="navPill"
                                                className="absolute inset-0 bg-white/10 rounded-full -z-0"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        {!isActive(link.href) && (
                                            <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-0" />
                                        )}
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA & Toggle Area */}
                    <div className="flex items-center gap-2 shrink-0 z-10">
                        <AnimatePresence mode="popLayout">
                            {showFullMenu && !isMobileMenuOpen && (
                                <motion.div
                                    key="desktop-auth"
                                    initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 10, scale: 0.9, transition: { duration: 0.15 } }}
                                    transition={{ duration: 0.25 }}
                                    className="hidden sm:flex items-center gap-2"
                                >
                                    {user && profile ? (
                                        <div className="flex items-center">
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 pl-2 pr-3 py-1.5 rounded-l-full transition-colors border-r border-white/10"
                                            >
                                                <img
                                                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username || 'User'}`}
                                                    alt={profile.username}
                                                    className="w-6 h-6 rounded-full bg-neutral-800"
                                                />
                                                <span className="text-xs font-bold text-white max-w-[80px] truncate">{profile.username}</span>
                                            </Link>
                                            <button
                                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                                className="bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-r-full transition-colors h-[36px] flex items-center justify-center"
                                            >
                                                <motion.div
                                                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronRight size={14} className="text-white rotate-90" />
                                                </motion.div>
                                            </button>
                                        </div>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all whitespace-nowrap flex items-center gap-2"
                                        >
                                            <span>Masuk</span>
                                            <UserIcon size={14} />
                                        </Link>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isMobileMenuOpen && !showFullMenu && (
                            <motion.div
                                key="collapsed-indicator"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex gap-2 items-center"
                            >
                                {user && (
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                        <UserIcon size={12} className="text-white" />
                                    </div>
                                )}
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            </motion.div>
                        )}

                        <button
                            className="md:hidden text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <motion.div
                                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.div>
                        </button>
                    </div>
                </div>

                {/* Profile Dropdown Content */}
                <AnimatePresence>
                    {isProfileOpen && !isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="h-px bg-white/5 w-full my-2" />
                            <div className="flex flex-col gap-1 p-1">
                                <div className="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-widest flex justify-between">
                                    <span>Status</span>
                                    <span className={profile?.is_approved ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                                        {profile?.is_approved ? "ACTIVE MEMBER" : "PENDING APPROVAL"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link to={`/profile/${profile?.username}`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                        <UserIcon size={14} /> Profil Saya
                                    </Link>
                                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                        <Settings size={14} /> Pengaturan
                                    </Link>
                                </div>
                                {profile?.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors">
                                        <Shield size={14} /> Panel Admin
                                    </Link>
                                )}
                                <button
                                    onClick={() => { signOut(); setIsProfileOpen(false); }}
                                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                                >
                                    <LogOut size={14} /> Keluar Aplikasi
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu Content */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex flex-col gap-2 md:hidden overflow-hidden mt-2"
                        >
                            <div className="h-px bg-white/10 w-full mb-4" />
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 + 0.1 }}
                                >
                                    <Link
                                        to={link.href}
                                        className={`text-lg font-medium px-4 py-3 rounded-xl transition-colors flex items-center justify-between group ${isActive(link.href)
                                            ? 'bg-white/10 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive(link.href) ? 'opacity-100' : ''}`} />
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5"
                            >
                                {user && profile ? (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                                            <img
                                                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username || 'User'}`}
                                                alt={profile.username}
                                                className="w-10 h-10 rounded-full bg-neutral-800"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">{profile.username}</span>
                                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{profile.is_approved ? "Member" : "Pending"}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                to={`/profile/${profile.username}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="px-4 py-3 bg-white/5 rounded-xl text-xs font-bold text-gray-300 hover:text-white flex items-center justify-center gap-2"
                                            >
                                                <UserIcon size={14} /> Profil
                                            </Link>
                                            <Link
                                                to="/settings"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="px-4 py-3 bg-white/5 rounded-xl text-xs font-bold text-gray-300 hover:text-white flex items-center justify-center gap-2"
                                            >
                                                <Settings size={14} /> Settings
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                            className="w-full bg-rose-500/10 text-rose-500 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                                        >
                                            <LogOut size={14} /> Keluar
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-white text-black text-center py-3 rounded-xl font-bold mt-2 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <span>Masuk / Daftar</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};