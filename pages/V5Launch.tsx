import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Palette, Code, Globe, ArrowRight, Star, Sparkles, Layout, Smartphone, Check, HelpCircle, HardDrive, Share2, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Komponen Latar Belakang: Luminous Fluid ---
const FluidBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#030303]">
            {/* Orb 1: Rose Glow */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 100, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-rose-500/20 blur-[120px] rounded-full"
            />
            {/* Orb 2: Purple Glow */}
            <motion.div
                animate={{
                    x: [0, -80, 120, 0],
                    y: [0, 120, -60, 0],
                    scale: [1, 0.9, 1.3, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-[10%] -right-[10%] w-[70vw] h-[70vw] bg-purple-500/15 blur-[140px] rounded-full"
            />
            {/* Orb 3: Accent Blue */}
            <motion.div
                animate={{
                    x: [0, 150, -100, 0],
                    y: [0, 100, 150, 0],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-blue-500/10 blur-[150px] rounded-full"
            />
            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] z-10 mix-blend-overlay"
                style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
        </div>
    );
};

// --- Komponen Slide ---
const Slide = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <section className={`min-h-screen w-full flex flex-col items-center justify-center relative z-20 px-6 py-24 ${className}`}>
        {children}
    </section>
);

export const V5Launch = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className="relative min-h-[500vh] bg-[#030303] text-white selection:bg-rose-500/30 overflow-x-hidden font-sans">
            <FluidBackground />

            {/* Navigasi Persisten */}
            <div className="fixed top-8 left-8 z-50 flex items-center gap-6">
                <Link to="/announcement" className="text-white/40 hover:text-white transition-all flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> PUSAT INFORMASI
                </Link>
            </div>

            {/* SLIDE 1: THE AWAKENING */}
            <Slide>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center max-w-5xl"
                >
                    <span className="text-rose-500 font-mono tracking-[0.5em] text-[10px] uppercase mb-8 block font-bold">REVOLUTION EDITION</span>
                    <h1 className="text-7xl md:text-[14rem] font-serif font-bold tracking-tighter leading-none italic mb-12 relative">
                        V5.0
                        <motion.span
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1.02, 0.98] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-10 -right-10 text-4xl md:text-6xl text-rose-500/50 not-italic"
                        >
                            ★
                        </motion.span>
                    </h1>
                    <p className="text-gray-400 text-xl md:text-4xl font-light leading-relaxed mb-16 max-w-3xl mx-auto italic">
                        "Sinergi antara <span className="text-white">seni</span>, <span className="text-white">teknologi</span>, dan <span className="text-white">imajinasi</span> tanpa batas."
                    </p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="flex flex-col items-center gap-4 text-white/20"
                    >
                        <span className="text-[9px] font-mono tracking-[0.4em] uppercase">Gulir ke bawah untuk memulai</span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ChevronDown size={20} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Slide>

            {/* SLIDE 2: THE EVOLUTION (MIGRATION STORY) */}
            <Slide className="bg-black/40 backdrop-blur-sm border-y border-white/5">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: "-100px" }}
                        className="space-y-8"
                    >
                        <h2 className="text-5xl md:text-9xl font-serif font-bold italic leading-none">
                            TRANSISI <br /> <span className="text-rose-500">ABSOLUT.</span>
                        </h2>
                        <div className="w-24 h-1 bg-rose-500" />
                        <p className="text-gray-400 text-xl leading-relaxed font-light">
                            Meninggalkan masa lalu, membangun masa depan. Migrasi penuh dari <span className="font-mono text-sm text-gray-500 line-through">lovable.app</span> menuju rumah baru yang lebih bertenaga di <span className="font-mono text-sm text-white">vercel.app</span>.
                        </p>
                    </motion.div>

                    <div className="relative aspect-square md:aspect-video bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                            <div className="flex flex-col items-center gap-8 w-full">
                                <div className="w-full h-24 bg-surface/50 rounded-2xl border border-white/5 flex items-center justify-between px-8 opacity-40 grayscale">
                                    <span className="font-mono text-xs">LOVABLE.APP</span>
                                    <span className="text-[10px] py-1 px-3 bg-white/5 rounded-full uppercase">Legacy</span>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="text-rose-500"
                                >
                                    <Rocket size={48} />
                                </motion.div>
                                <div className="w-full h-24 bg-surface rounded-2xl border border-rose-500/30 flex items-center justify-between px-8 shadow-[0_0_30px_rgba(225,29,72,0.2)]">
                                    <span className="font-mono text-xs text-white">VERCEL.APP</span>
                                    <span className="text-[10px] py-1 px-3 bg-rose-500/20 text-rose-500 rounded-full font-bold uppercase">Official</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Slide>

            {/* SLIDE 3: DESIGN ZEN (AUDIT) */}
            <Slide>
                <div className="max-w-6xl w-full text-center space-y-24">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-[10rem] font-serif font-bold italic tracking-tighter"
                    >
                        DESIGN <span className="text-transparent border-b-2 border-white">ZEN</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                tag: "Typography",
                                h: "Tipografi Luminous",
                                d: "Playfair Display Serif bertemu Inter Sans. Keseimbangan antara klasik dan futuristik.",
                                icon: <Palette size={32} className="text-rose-500" />
                            },
                            {
                                tag: "Layout",
                                h: "Modular Bento Grid",
                                d: "Struktur informasi berbasis blok yang adaptif dan memberikan kejelasan visual maksimal.",
                                icon: <Layout size={32} className="text-purple-500" />
                            },
                            {
                                tag: "Motion",
                                h: "Fluidity Zero",
                                d: "Animasi yang dirancang untuk terasa alami, tanpa gangguan, dan memperkuat narasi konten.",
                                icon: <Zap size={32} className="text-blue-500" />
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] text-left hover:border-rose-500/20 transition-all group"
                            >
                                <div className="mb-6 p-4 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-4 block">{item.tag}</span>
                                <h3 className="text-2xl font-serif font-bold italic mb-4">{item.h}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-light">{item.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Slide>

            {/* SLIDE 4: THE STUDIO (LIVE PREVIEW FEEL) */}
            <Slide className="bg-white/5 overflow-hidden">
                <div className="max-w-7xl w-full flex flex-col md:flex-row gap-20 items-center">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-6xl md:text-9xl font-serif font-bold italic tracking-tighter">STUDIO <br /><span className="text-purple-500">KREATIF.</span></h2>
                        <p className="text-gray-400 text-xl font-light">
                            Lebih dari sekadar galeri. v5.0 memperkenalkan ekosistem di mana setiap orang adalah kurator bagi kreativitas mereka sendiri.
                        </p>
                        <div className="flex gap-4">
                            <div className="h-16 w-16 rounded-full border border-white/10 flex items-center justify-center group hover:border-rose-500 transition-colors">
                                <Smartphone size={24} className="group-hover:text-rose-500 transition-colors" />
                            </div>
                            <div className="h-16 w-16 rounded-full border border-white/10 flex items-center justify-center group hover:border-purple-500 transition-colors">
                                <Globe size={24} className="group-hover:text-purple-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ rotate: 10, y: 50, opacity: 0 }}
                            whileInView={{ rotate: -5, y: 0, opacity: 1 }}
                            className="w-full max-w-md aspect-[9/16] bg-[#0f0f0f] rounded-[3rem] border-[8px] border-white/5 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
                            <div className="p-8 pt-20 space-y-6">
                                <div className="h-8 w-32 bg-rose-500/20 rounded-md" />
                                <div className="h-48 w-full bg-white/5 rounded-2xl" />
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-white/10 rounded" />
                                    <div className="h-4 w-2/3 bg-white/10 rounded" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 bg-purple-500/10 rounded-xl" />
                                    <div className="h-24 bg-blue-500/10 rounded-xl" />
                                </div>
                            </div>
                        </motion.div>
                        {/* Floating SVG Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-10 -right-10 text-rose-500 opacity-30"
                        >
                            <Sparkles size={120} />
                        </motion.div>
                    </div>
                </div>
            </Slide>

            {/* SLIDE 5: CALL TO CREATION */}
            <Slide>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-16"
                >
                    <div className="space-y-4">
                        <span className="text-[10px] font-mono tracking-[0.8em] text-white/40 uppercase">Visi Kami Adalah Anda</span>
                        <h2 className="text-7xl md:text-[12rem] font-serif font-bold italic tracking-tighter leading-none">
                            MULAI <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500">MENCIPTA.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Link to="/" className="px-16 py-6 bg-white text-black rounded-full font-bold text-2xl hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center gap-4 group">
                            Eksplorasi V5 <Rocket size={28} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link to="/tim" className="px-16 py-6 border border-white/10 rounded-full font-bold text-2xl hover:bg-white/5 transition-all text-white/50 hover:text-white group">
                            Tim Kami <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>

                {/* Footer Minimal */}
                <div className="absolute bottom-12 left-0 right-0 px-12 flex justify-between items-center text-[10px] font-mono text-white/20 tracking-widest uppercase">
                    <span>OUR CREATIVITY © 2025</span>
                    <div className="flex gap-8">
                        <a href="https://www.instagram.com/ourcreativity.ofc/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                        <a href="https://www.tiktok.com/@ourcreativity.ofc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>
                    </div>
                    <span>REVOLUTION EDITION</span>
                </div>

            </Slide>
        </div>
    );
};
