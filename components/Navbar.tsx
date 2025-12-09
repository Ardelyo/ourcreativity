import React, { useState, useEffect } from 'react';
import { Menu, X, Asterisk, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', href: '/' },
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
        type: "spring",
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
                    width: isMobileMenuOpen ? "100%" : (showFullMenu ? "auto" : "fit-content"),
                    maxWidth: isMobileMenuOpen ? "500px" : "100%",
                    borderRadius: isMobileMenuOpen ? 32 : 9999,
                    height: isMobileMenuOpen ? "auto" : "auto"
                }}
                transition={springTransition}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className={`pointer-events-auto bg-[#111]/90 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50 overflow-hidden flex flex-col ${isMobileMenuOpen ? 'p-6 gap-6' : (showFullMenu ? 'px-6 py-3' : 'px-3 py-2')
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
                        <AnimatePresence mode="popLayout">
                            {showFullMenu && !isMobileMenuOpen ? (
                                <motion.div
                                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="hidden sm:block overflow-hidden"
                                >
                                    <Link
                                        to="/info"
                                        className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all whitespace-nowrap flex items-center gap-2"
                                    >
                                        <span>Bergabung</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </motion.div>
                            ) : (
                                !isMobileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* Indikator mini saat diciutkan */}
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
                            >
                                <Link
                                    to="/info"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="bg-white text-black text-center py-3 rounded-xl font-bold mt-2 flex items-center justify-center gap-2"
                                >
                                    <span>Bergabung Sekarang</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};