import React, { useState, useEffect } from 'react';
import { Menu, X, Asterisk, ArrowRight, User as UserIcon, LogOut, Settings, ChevronRight } from 'lucide-react';
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
        stiffness: 350,
        damping: 30,
        mass: 1
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
            <motion.nav
                layout
                initial={{ y: -100, opacity: 0, width: "auto", borderRadius: 50 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    width: isMobileMenuOpen ? "100%" : (showFullMenu ? "auto" : "max-content"),
                    maxWidth: isMobileMenuOpen ? "500px" : "100%",
                    borderRadius: isMobileMenuOpen ? "32px" : "100px",
                }}
                transition={springTransition}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className={`pointer-events-auto bg-[#111]/90 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50 flex flex-col ${isMobileMenuOpen ? 'p-6 gap-6 overflow-hidden' : (showFullMenu ? 'px-6 py-3 overflow-visible' : 'px-3 py-2 overflow-visible')
                    }`}
            >
                <motion.div layout className={`flex items-center justify-between w-full ${isMobileMenuOpen ? '' : (showFullMenu ? 'gap-8' : 'gap-2')}`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
                        <motion.div
                            layout
                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors"
                        >
                            <Asterisk size={16} />
                        </motion.div>
                        <AnimatePresence mode="popLayout">
                            {(showFullMenu || isMobileMenuOpen) && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
                                    exit={{ opacity: 0, width: 0, filter: "blur(10px)" }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="font-serif font-bold text-lg tracking-tight text-white whitespace-nowrap overflow-hidden ml-2"
                                >
                                    Our Creativity.
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Tautan Desktop */}
                    <div className="hidden md:flex items-center">
                        <AnimatePresence mode='popLayout'>
                            {showFullMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-1"
                                >
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.href}
                                            className={`px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors rounded-full whitespace-nowrap ${isActive(link.href)
                                                ? 'text-white bg-white/10'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* CTA & Toggle Seluler */}
                    <div className="flex items-center gap-2 shrink-0">
                        <AnimatePresence>
                            {showFullMenu && !isMobileMenuOpen ? (
                                <motion.div
                                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="hidden sm:flex items-center gap-2"
                                >
                                    {user && profile ? (
                                        <div className="relative group/profile">
                                            <div className="flex items-center">
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 pl-2 pr-3 py-1.5 rounded-l-full transition-colors border-r border-white/10"
                                                >
                                                    <img
                                                        src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`}
                                                        alt={profile.username}
                                                        className="w-6 h-6 rounded-full"
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

                                            <AnimatePresence>
                                                {isProfileOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute top-full right-0 mt-3 w-56 bg-[#18181b]/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1.5 flex flex-col gap-1 z-50 min-w-[200px]"
                                                    >
                                                        <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/5 mb-1">
                                                            Status: <span className={profile.is_approved ? "text-green-500 font-bold" : "text-yellow-500 font-bold"}>
                                                                {profile.is_approved ? "Member" : "Pending"}
                                                            </span>
                                                        </div>
                                                        <Link to={`/profile/${profile.username}`} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg w-full text-left transition-colors">
                                                            <UserIcon size={14} /> Profil Saya
                                                        </Link>
                                                        <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg w-full text-left transition-colors">
                                                            <Settings size={14} /> Pengaturan
                                                        </Link>
                                                        <button
                                                            onClick={signOut}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-white/5 rounded-lg w-full text-left transition-colors"
                                                        >
                                                            <LogOut size={14} /> Keluar
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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
                            ) : (
                                !isMobileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex gap-2"
                                    >
                                        {/* Status indicator or mini avatar when collapsed */}
                                        {user && (
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                <UserIcon size={14} className="text-white" />
                                            </div>
                                        )}
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse my-auto ml-2" />
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>

                        <button
                            className="md:hidden text-white p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </motion.div>

                {/* Konten Menu Seluler - Di dalam Pulau */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                            exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            className="flex flex-col gap-2 md:hidden overflow-hidden"
                        >
                            <div className="h-px bg-white/10 w-full my-2" />
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
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
                                className="flex flex-col gap-2"
                            >
                                {user ? (
                                    <>
                                        <Link
                                            to="/settings"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full bg-white/5 text-white text-center py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                                        >
                                            <Settings size={16} /> Pengaturan Akun
                                        </Link>
                                        <button
                                            onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                            className="w-full bg-red-500/10 text-red-500 text-center py-3 rounded-xl font-bold mt-2 flex items-center justify-center gap-2"
                                        >
                                            <LogOut size={16} /> Keluar
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-white text-black text-center py-3 rounded-xl font-bold mt-2 flex items-center justify-center gap-2"
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