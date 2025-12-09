import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, BookOpen, Info, FileText, ArrowUpRight, Megaphone, Star, ChevronRight, Hash, Download, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CardProps {
    children?: React.ReactNode;
    className?: string;
    delay?: number;
}

// Komponen Noise Modern - Dioptimalkan
const Noise = () => (
    <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
        style={{
            backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px'
        }}
    ></div>
);

const Card = ({ children, className, delay = 0 }: CardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{
            duration: 0.8,
            delay: delay,
            ease: [0.22, 1, 0.36, 1], // Cubic-bezier kustom untuk "nuansa GSAP"
        }}
        className={`relative overflow-hidden rounded-[2rem] p-6 md:p-8 transition-shadow duration-500 hover:shadow-2xl hover:shadow-white/5 ${className}`}
    >
        <Noise />
        {children}
    </motion.div>
);

export const BentoGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-7xl mx-auto auto-rows-[minmax(180px,auto)] content-visibility-auto">

            {/* 1. Kartu Fitur - Gaya Editorial */}
            <Card className="md:col-span-8 md:row-span-2 bg-[#080808] text-white min-h-[450px] flex flex-col justify-between group border border-white/5 hover:border-white/10" delay={0.1}>
                <Link to="/announcement" className="absolute inset-0 z-20"></Link>
                {/* Titik Gradien Halus */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-b from-indigo-900/20 to-purple-900/10 rounded-full blur-[120px] transition-all duration-700 group-hover:opacity-100 opacity-60"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Update Komunitas</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold leading-[0.95] tracking-tight mt-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-gray-500 transition-all duration-500">
                            Pekan <br />
                            <span className="italic font-light text-white/80">Kreativitas.</span>
                        </h2>
                    </div>
                    <Megaphone className="text-white/20 -rotate-12 group-hover:rotate-0 transition-transform duration-500" size={32} />
                </div>

                <div className="relative z-10 mt-auto">
                    <div className="flex items-end justify-between gap-4">
                        <div className="space-y-4 max-w-md">
                            <div className="inline-block px-3 py-1 rounded-md border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono text-gray-300">
                                v5.0: Revolution Edition
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed border-l border-white/10 pl-4">
                                Edisi terbaru telah hadir. Cek pembaruan visual dan fitur komunitas sekarang.
                            </p>
                        </div>

                        <button className="hidden md:flex h-16 w-16 rounded-full bg-white text-black items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <ArrowRight size={24} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* 2. Kartu Galeri - Visual Berat */}
            <Card className="md:col-span-4 md:row-span-1 bg-black border border-white/5 hover:border-white/20 group cursor-pointer" delay={0.2}>
                <Link to="/karya" className="block h-full w-full">
                    <img
                        src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop"
                        alt="Art"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1 block">Showcase</span>
                            <h4 className="text-xl font-serif text-white">Galeri Karya</h4>
                        </div>
                        <ArrowUpRight size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0" />
                    </div>
                </Link>
            </Card>

            {/* 3. Kartu Tim - Gaya Data/Statistik */}
            <Card className="md:col-span-4 md:row-span-1 bg-[#0a0a0a] border border-white/5 hover:border-white/20 group flex flex-col justify-center" delay={0.3}>
                <Link to="/tim" className="block w-full">
                    <div className="flex items-center justify-between mb-2">
                        <Users size={20} className="text-gray-500" />
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border border-black bg-gray-800" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }}></div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-4xl font-sans font-bold text-white group-hover:text-rose-400 transition-colors">3.2k+</div>
                        <p className="text-xs text-gray-500 font-mono mt-1">TOTAL ANGGOTA AKTIF</p>
                    </div>
                </Link>
            </Card>

            {/* 4. Kartu Cerita - Teks Minimalis */}
            <Card className="md:col-span-4 bg-[#0a0a0a] border border-white/5 hover:bg-[#0f0f0f] transition-colors flex flex-col justify-center" delay={0.4}>
                <Link to="/story" className="block h-full">
                    <BookOpen size={24} className="text-white mb-4" />
                    <h3 className="text-xl font-serif text-white mb-2">Perjalanan Kami</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        The Loop: Bagaimana kami membangun ekosistem kreatif yang berkelanjutan dari nol.
                    </p>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors flex items-center gap-2">
                        Baca Kisah <ArrowRight size={12} />
                    </div>
                </Link>
            </Card>

            {/* 5. Kartu Info - Daftar Bersih */}
            <Card className="md:col-span-4 bg-[#0a0a0a] border border-white/5 hover:bg-[#0f0f0f] flex flex-col justify-between" delay={0.5}>
                <Link to="/info" className="block h-full">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-serif text-white">Info & FAQ</h3>
                        <Info size={20} className="text-gray-600" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-xs text-gray-400 py-2 border-b border-white/5 flex justify-between">
                            <span>Divisi</span> <span className="text-white">4 Group</span>
                        </div>
                        <div className="text-xs text-gray-400 py-2 border-b border-white/5 flex justify-between">
                            <span>Status</span> <span className="text-emerald-400">Open</span>
                        </div>
                        <div className="text-xs text-gray-400 py-2 flex justify-between">
                            <span>Join</span> <span className="text-white">Free</span>
                        </div>
                    </div>
                </Link>
            </Card>

            {/* 6. Kartu Panduan - Unduhan Menonjol */}
            <Card className="md:col-span-4 bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 hover:border-white/20 group relative" delay={0.6}>
                <Link to="/info" className="flex flex-col h-full justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FileText size={16} className="text-rose-400" />
                            <span className="text-[10px] font-bold uppercase text-rose-400 tracking-wider">Guidebook</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Panduan 2024</h3>
                    </div>

                    <div className="flex items-center justify-between mt-4 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400">FORMAT</span>
                            <span className="text-xs font-bold text-white">PDF Document</span>
                        </div>
                        <Download size={16} className="text-white" />
                    </div>
                </Link>
                {/* Blur Dekoratif */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-rose-500/10 blur-[40px] rounded-full pointer-events-none"></div>
            </Card>

        </div>
    );
};