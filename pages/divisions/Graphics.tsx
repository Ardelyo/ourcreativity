import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Maximize2, Crosshair, Users, Trophy, Zap, Star, ArrowUpRight } from 'lucide-react';

// --- Komponen Marquee Lokal ---
const Marquee = ({ text }: { text: string }) => (
    <div className="overflow-hidden whitespace-nowrap py-4 bg-purple-900/20 border-y border-purple-500/20">
        <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="inline-block"
        >
            {[...Array(4)].map((_, i) => (
                <span key={i} className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-white mx-4">
                    {text}
                </span>
            ))}
        </motion.div>
    </div>
);

// --- Data Statis ---
const stats = [
    { value: "700+", label: "ANGGOTA" },
    { value: "50+", label: "PROYEK KOLABORASI" },
    { value: "24/7", label: "AKTIVITAS DISCORD" }
];

const highlights = [
    {
        title: "POSTER DESIGN",
        desc: "Event 2024",
        image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=800&auto=format&fit=crop",
        rotate: 6,
        margin: "mt-10",
        zIndex: "z-10"
    },
    {
        title: "UI EXPLORATION",
        desc: "Mobile App Concept",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
        rotate: -3,
        margin: "mt-0",
        zIndex: "z-20"
    },
    {
        title: "BRAND IDENTITY",
        desc: "Logo Folio Vol. 1",
        image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=800&auto=format&fit=crop",
        rotate: 3,
        margin: "mt-20",
        zIndex: "z-10"
    },
    {
        title: "ILLUSTRATION",
        desc: "Character Design",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        rotate: -6,
        margin: "mt-5",
        zIndex: "z-0"
    }
];

export const Graphics = () => {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
            {/* Navigasi Mengambang */}
            <nav className="fixed top-6 left-0 right-0 z-50 px-6 md:px-12 flex justify-between items-start pointer-events-none">
                <Link to="/info" className="flex items-center gap-2 text-sm font-mono hover:text-purple-400 transition-colors bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
                    <ArrowLeft size={16} /> KEMBALI
                </Link>
                <div className="hidden md:flex flex-col items-end gap-1 pointer-events-auto">
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <span>STATUS: AKTIF</span>
                        <span className="text-purple-500 animate-pulse">● LIVE</span>
                    </div>
                    <div className="text-xs font-mono text-purple-400 bg-black/50 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 mt-1">
                        ANGGOTA: 700+
                    </div>
                </div>
            </nav>

            {/* Bagian Hero */}
            < header className="relative min-h-screen flex flex-col pt-32 border-x border-white/5 max-w-[1600px] mx-auto" >
                <div className="flex-1 flex flex-col justify-center px-6 md:px-12 relative">
                    {/* Garis Grid Dekoratif */}
                    <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-20">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="border-r border-purple-500/30 h-full"></div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="relative z-10"
                    >
                        <div className="flex items-start justify-between mb-4 border-b border-purple-500/30 pb-4">
                            <span className="font-mono text-purple-400 text-sm">[ DIVISI_01: DESAIN GRAFIS ]</span>
                            <Maximize2 className="text-purple-500" size={24} />
                        </div>

                        <h1 className="text-[10vw] leading-[0.85] font-black uppercase tracking-tighter mix-blend-difference mb-8">
                            Komunitas <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-400 to-white">Paling Liar</span>
                        </h1>

                        <div className="mt-8 flex flex-col md:flex-row gap-12 items-start md:items-end justify-between">
                            <div className="max-w-2xl">
                                <p className="text-xl md:text-3xl text-white font-bold leading-relaxed mb-4">
                                    Divisi favorit dan paling aktif di OurCreativity.
                                </p>
                                <p className="text-lg text-gray-400 font-mono border-l-4 border-purple-500 pl-4">
                                    Rumah bagi <span className="text-purple-400">700+ desainer</span> yang siap menggebrak industri kreatif. Bukan sekadar grup chat, ini adalah pergerakan.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-32 h-32 border border-purple-500/30 rounded-full flex items-center justify-center animate-spin-slow bg-purple-500/5 backdrop-blur-sm">
                                    <Crosshair className="text-purple-500" size={40} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <Marquee text="KOLABORASI TANPA BATAS • KARYA TANPA HENTI •" />
            </header >

            {/* Bagian Statistik / Manifesto */}
            < section className="border-x border-white/5 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#0a0a0a]" >
                {
                    stats.map((stat, i) => (
                        <div key={i} className="p-12 flex flex-col items-center text-center group hover:bg-purple-900/10 transition-colors">
                            {i === 0 && <Users className="w-16 h-16 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />}
                            {i === 1 && <Trophy className="w-16 h-16 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />}
                            {i === 2 && <Zap className="w-16 h-16 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />}
                            <h3 className="text-5xl font-black text-white mb-2">{stat.value}</h3>
                            <p className="font-mono text-purple-400 uppercase">{stat.label}</p>
                        </div>
                    ))
                }
            </section >

            {/* Galeri Kolase Tersebar */}
            < section className="py-32 border-x border-white/5 max-w-[1600px] mx-auto px-6 overflow-hidden relative" >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                <div className="flex flex-col items-center justify-center mb-20 relative z-10">
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-center">
                        Galeri <span className="text-purple-500 italic">Kekacauan</span>
                    </h2>
                    <p className="font-mono text-gray-500 mt-4">DOKUMENTASI KEGIATAN & KARYA</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative min-h-[800px]">
                    {highlights.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: item.rotate }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative group ${item.margin} ${item.zIndex}`}
                        >
                            <div className="relative aspect-[3/4] bg-gray-900 border-4 border-white p-2 shadow-[10px_10px_0px_0px_rgba(168,85,247,0.5)] hover:shadow-[15px_15px_0px_0px_rgba(168,85,247,0.8)] transition-all duration-300 transform hover:-translate-y-2 hover:rotate-0">
                                <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay z-10 pointer-events-none"></div>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-500"
                                />

                                {/* Efek Selotip */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/80 rotate-[-2deg] shadow-sm backdrop-blur-sm"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 text-white transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <h3 className="font-black text-xl uppercase text-purple-400">{item.title}</h3>
                                    <p className="text-xs font-mono text-gray-300">{item.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Elemen Mengambang */}
                    <div className="absolute top-1/4 left-10 hidden lg:block animate-bounce duration-[3000ms]">
                        <Star className="text-purple-500 w-12 h-12" fill="currentColor" />
                    </div>
                    <div className="absolute bottom-1/3 right-20 hidden lg:block animate-pulse">
                        <div className="text-8xl font-black text-white/5 rotate-90">CREATIVE</div>
                    </div>
                </div>
            </section >

            {/* CTA Footer */}
            < footer className="border-t border-white/10 bg-[#0a0a0a] py-32 relative overflow-hidden" >
                <div className="absolute inset-0 bg-purple-900/10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
                    <h2 className="text-5xl md:text-7xl font-black uppercase mb-8">
                        Siap Bergabung <br /> dengan <span className="text-purple-500 underline decoration-4 underline-offset-8">Elite?</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Jangan cuma jadi penonton. Jadilah bagian dari 700+ kreator yang mengubah wajah industri kreatif Indonesia.
                    </p>
                    <button className="group relative px-12 py-6 bg-purple-600 overflow-hidden text-white font-black uppercase tracking-widest hover:bg-purple-500 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                        <span className="relative z-10 flex items-center gap-3 text-xl">
                            GABUNG SEKARANG <ArrowUpRight size={24} />
                        </span>
                    </button>
                </div>

                {/* Bilah Bawah */}
                <div className="absolute bottom-0 left-0 w-full border-t border-white/5 py-4 px-6 flex justify-between items-center font-mono text-xs text-gray-600">
                    <span>© 2025 OURCREATIVITIES</span>
                    <span>SISTEM: ONLINE</span>
                </div>
            </footer >
        </div >
    );
};
