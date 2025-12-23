import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Film, MousePointer2, Scissors, GripHorizontal,
    Play, SkipBack, SkipForward, Download, Settings,
    Monitor, Maximize2, Hash, LayoutTemplate, Layers,
    Video, Info, Zap, Camera, Mic, Palette, Wand2, Aperture, Music
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Data Bahasa Indonesia ---
const workGallery = [
    { title: "V5 Launch", type: "Promo", thumb: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400&h=225&fit=crop" },
    { title: "Echoes MV", type: "Seni", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&h=225&fit=crop" },
    { title: "Akar Budaya", type: "Dokumenter", thumb: "https://images.unsplash.com/photo-1542204111-37083204968c?q=80&w=400&h=225&fit=crop" },
    { title: "The Void", type: "Fiksi", thumb: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&h=225&fit=crop" },
    { title: "OC Day 2024", type: "Event", thumb: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop" },
    { title: "Glitch Art", type: "Eksperimental", thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252723f?q=80&w=400&h=225&fit=crop" }
];

const stats = [
    { label: "PROYEK SELESAI", val: "100+" },
    { label: "JAM RENDER", val: "5000+" },
    { label: "RESOLUSI MAK", val: "8K" }
];

// --- Components ---

const Timecode = ({ scrollProgress }: { scrollProgress: any }) => {
    const [time, setTime] = useState("00:00:00:00");

    useTransform(scrollProgress, (latest: number) => {
        const totalFrames = Math.floor(latest * 8000); // More frames for longer scroll
        const frames = totalFrames % 60;
        const seconds = Math.floor((totalFrames / 60) % 60);
        const minutes = Math.floor((totalFrames / 3600) % 60);
        const hours = Math.floor(totalFrames / 216000);

        const f = frames.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const h = hours.toString().padStart(2, '0');

        return `${h}:${m}:${s}:${f}`;
    }).on("change", (latest) => setTime(latest));

    return (
        <div className="font-mono text-blue-400 text-sm md:text-lg tracking-widest font-bold drop-shadow-md">
            {time}
        </div>
    );
};

export const VideoPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [isPlaying, setIsPlaying] = useState(false);

    // --- Animation Transforms (Expanded for More Slides) ---
    // Total Height: 1000vh approx to accommodate steps

    // 1. Intro (0 - 0.1)
    const introOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
    const introScale = useTransform(scrollYProgress, [0, 0.08], [1, 1.2]);

    // 2. Philosophy (0.08 - 0.2)
    const philoOpacity = useTransform(scrollYProgress, [0.08, 0.12, 0.18, 0.22], [0, 1, 1, 0]);

    // 3. Workflow A: Editing (0.22 - 0.35)
    const wfEditOpacity = useTransform(scrollYProgress, [0.22, 0.25, 0.32, 0.35], [0, 1, 1, 0]);
    const wfEditX = useTransform(scrollYProgress, [0.22, 0.35], [50, -50]);

    // 4. Workflow B: VFX (0.35 - 0.48) 
    const wfVfxOpacity = useTransform(scrollYProgress, [0.35, 0.38, 0.45, 0.48], [0, 1, 1, 0]);
    const wfVfxScale = useTransform(scrollYProgress, [0.35, 0.48], [0.9, 1.1]);

    // 5. Workflow C: Color (0.48 - 0.6)
    const wfColorOpacity = useTransform(scrollYProgress, [0.48, 0.52, 0.58, 0.62], [0, 1, 1, 0]);

    // 6. Workflow D: Sound (0.62 - 0.75)
    const wfSoundOpacity = useTransform(scrollYProgress, [0.62, 0.65, 0.72, 0.75], [0, 1, 1, 0]);

    // 7. Gallery (0.75 - 0.9)
    const galleryOpacity = useTransform(scrollYProgress, [0.75, 0.78, 0.88, 0.92], [0, 1, 1, 0]);

    // 8. CTA (0.92 - 1.0)
    const ctaOpacity = useTransform(scrollYProgress, [0.92, 0.95, 1], [0, 1, 1]);

    const timelineWidth = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), { stiffness: 100, damping: 30 });

    return (
        <div ref={containerRef} className="h-[1000vh] bg-[#1a1a1a] text-xs text-[#ddd] font-sans selection:bg-orange-500 overflow-hidden">

            <div className="fixed inset-0 z-10 flex flex-col bg-[#121212]">

                {/* --- HEADER --- */}
                <div className="h-10 bg-[#1f1f1f] border-b border-[#000] flex items-center justify-between px-4 shrink-0 shadow-sm z-50">
                    <div className="flex items-center gap-6">
                        <Link to="/info" className="flex items-center gap-2 font-bold text-gray-300 hover:text-white transition-colors">
                            <ArrowLeft size={14} />
                            <span className="hidden sm:inline">Our Creativity<span className="text-orange-500">.prproj</span></span>
                        </Link>
                        <div className="hidden lg:flex gap-4 text-[#888]">
                            {["Berkas", "Ubah", "Klip", "Urutan", "Penanda", "Grafis", "Jendela", "Bantuan"].map(m => (
                                <span key={m} className="hover:text-white cursor-pointer transition-colors">{m}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-5 w-[1px] bg-gray-800"></div>
                        <Timecode scrollProgress={scrollYProgress} />
                        <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] px-3 py-1 rounded text-orange-500 border border-orange-500/20 ml-2">
                            <Download size={12} />
                            <span className="font-bold">EKSPOR</span>
                        </button>
                    </div>
                </div>

                {/* --- WORKSPACE --- */}
                <div className="flex-1 flex overflow-hidden">

                    {/* LEFT BIN (Browser Media) */}
                    <div className="hidden md:flex w-[20%] min-w-[240px] flex-col border-r border-[#000] bg-[#1a1a1a]">
                        <div className="flex bg-[#1f1f1f] border-b border-[#000]">
                            <div className="px-3 py-1.5 bg-[#2a2a2a] text-[#eee] border-t-2 border-orange-500 text-[11px] font-bold">Proyek</div>
                            <div className="px-3 py-1.5 text-[#888] text-[11px]">Peramban Media</div>
                        </div>
                        <div className="flex-1 p-2 overflow-y-auto custom-scrollbar space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                {["Sequence_Final", "Footage_Raw", "Audio_SFX", "Grafis_VFX"].map(f => (
                                    <div key={f} className="aspect-square bg-[#111] border border-[#333] rounded hover:border-orange-500 flex flex-col items-center justify-center p-2 text-gray-600 group cursor-pointer transition-colors">
                                        <Hash size={20} className="group-hover:text-orange-500 transition-colors" />
                                        <span className="text-[9px] mt-1 text-center font-medium group-hover:text-gray-300">{f}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-[#333] pt-2">
                                <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase">Aset Terbaru</div>
                                <div className="space-y-1">
                                    {workGallery.map((v, i) => (
                                        <div key={i} className="flex items-center gap-2 p-1.5 hover:bg-[#2a2a2a] rounded cursor-pointer group transition-colors">
                                            <Film size={12} className="text-blue-500" />
                                            <span className="text-gray-400 group-hover:text-gray-200 truncate font-mono text-[10px]">{v.title}_FINAL.mp4</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER MONITOR (Program) */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f0f]">
                        <div className="h-8 bg-[#1f1f1f] border-b border-[#000] flex items-center justify-between px-2 text-[#888] text-[10px]">
                            <div className="flex items-center gap-1">
                                <div className="px-3 py-1 bg-[#2a2a2a] text-orange-500 border-t-2 border-orange-500 font-bold">Program: Tampilan_Utama</div>
                            </div>
                            <span>1920 x 1080 (1.0) - FIT</span>
                        </div>

                        {/* SCREENBOX */}
                        <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#151515]">

                            <div className="aspect-video w-full max-h-full bg-black shadow-2xl relative overflow-hidden border border-[#333] group">

                                {/* Safe Margins Overlay (Hidden by default, shown on hover/play) */}
                                <div className="absolute inset-[5%] border border-cyan-500/20 pointer-events-none z-[60] opacity-50"></div>
                                <div className="absolute inset-[10%] border border-cyan-500/20 pointer-events-none z-[60] opacity-30"></div>
                                <div className="absolute top-4 right-4 flex gap-2 z-[60]">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[8px] font-black text-red-500 tracking-widest">REC</span>
                                </div>

                                {/* --- SCENES --- */}

                                {/* 1. Intro */}
                                <motion.div style={{ opacity: introOpacity, scale: introScale }} className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050505]">
                                    <div className="w-32 md:w-48 mb-6 relative">
                                        <div className="absolute inset-0 bg-orange-500 blur-[50px] opacity-20"></div>
                                        <img src="/assets/divisions/video_logo.jpg" className="w-full h-full object-contain relative z-10" alt="Video Logo" />
                                    </div>
                                    <h1 className="text-3xl md:text-6xl font-black text-white text-center tracking-tighter mb-2">
                                        VIDEO DIVISION
                                    </h1>
                                    <p className="text-orange-500/80 font-mono text-[10px] tracking-widest uppercase mb-4">
                                        IG: @ocvideoediting
                                    </p>
                                    <p className="text-orange-500 font-mono text-[10px] tracking-[0.5em] uppercase border border-orange-500/30 px-4 py-1 rounded-full">
                                        GULIR UNTUK MEMULAI
                                    </p>
                                </motion.div>

                                {/* 2. Philosophy */}
                                <motion.div style={{ opacity: philoOpacity }} className="absolute inset-0 z-20 flex bg-[#0a0a0a] items-center justify-center p-12">
                                    <div className="text-center max-w-3xl">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            className="inline-block mb-4"
                                        >
                                            <Aperture size={48} className="text-orange-500 mx-auto mb-4 animate-spin-slow" />
                                        </motion.div>
                                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                            KAMI TIDAK SEKADAR <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">MEMOTONG GAMBAR.</span>
                                        </h2>
                                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                            Kami merangkai emosi. Dari potongan mentah menjadi narasi visual yang menggerakkan hati dan pikiran audiens.
                                        </p>
                                        <div className="flex justify-center gap-8 border-t border-gray-800 pt-8">
                                            {stats.map(s => (
                                                <div key={s.label} className="text-center">
                                                    <div className="text-2xl font-black text-white">{s.val}</div>
                                                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 3. Workflow A: Editing */}
                                <motion.div style={{ opacity: wfEditOpacity, x: wfEditX }} className="absolute inset-0 z-30 flex bg-[#111] items-center px-16">
                                    <div className="w-1/2 pr-8 space-y-6">
                                        <div className="flex items-center gap-3 text-orange-500 font-mono text-xs font-bold">
                                            <Scissors size={16} />
                                            <span>TAHAP 01: OFFLINE EDIT</span>
                                        </div>
                                        <h2 className="text-5xl font-black text-white">PENYUSUNAN <br />CERITA</h2>
                                        <p className="text-gray-400">
                                            Fase di mana struktur, ritme, dan alur cerita dibangun. Kami memilih momen terbaik dari ribuan klip mentah (raw footer).
                                        </p>
                                        <div className="flex gap-2">
                                            {["Multicam", "Pacing", "Storytelling"].map(t => (
                                                <span key={t} className="px-2 py-1 border border-white/20 rounded text-[10px] text-gray-300">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-1/2 h-64 bg-gray-900 border border-gray-800 rounded relative overflow-hidden">
                                        {/* Abstract Timeline Visualization */}
                                        <div className="absolute inset-0 flex flex-col justify-center gap-2 p-4 opacity-50">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ width: ["0%", "80%", "40%", "100%"] }}
                                                    transition={{ duration: 2 + i, repeat: Infinity, ease: "easeInOut" }}
                                                    className={`h-4 rounded ${i % 2 === 0 ? 'bg-blue-600' : 'bg-purple-600'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 4. Workflow B: VFX */}
                                <motion.div style={{ opacity: wfVfxOpacity, scale: wfVfxScale }} className="absolute inset-0 z-30 flex flex-row-reverse bg-[#0d0d0d] items-center px-16">
                                    <div className="w-1/2 pl-8 space-y-6 text-right">
                                        <div className="flex items-center justify-end gap-3 text-purple-500 font-mono text-xs font-bold">
                                            <span>TAHAP 02: ONLINE / VFX</span>
                                            <Wand2 size={16} />
                                        </div>
                                        <h2 className="text-5xl font-black text-white">MANIPULASI <br />VISUAL</h2>
                                        <p className="text-gray-400">
                                            Menambahkan elemen grafis, membersihkan gambar, dan menciptakan dunia yang tidak mungkin direkam kamera.
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            {["Compositing", "Motion Graphics", "3D Tracker"].map(t => (
                                                <span key={t} className="px-2 py-1 border border-purple-500/30 bg-purple-500/10 rounded text-[10px] text-purple-300">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-1/2 h-64 bg-gray-900 border border-gray-800 rounded relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
                                            {[...Array(64)].map((_, i) => <div key={i} className="border border-green-500/30"></div>)}
                                        </div>
                                        <motion.div
                                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                            transition={{ duration: 8, repeat: Infinity }}
                                            className="w-32 h-32 border-2 border-green-500 rounded-full flex items-center justify-center"
                                        >
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* 5. Workflow C: Color */}
                                <motion.div style={{ opacity: wfColorOpacity }} className="absolute inset-0 z-30 flex bg-[#111] items-center px-16">
                                    <div className="w-1/2 pr-8 space-y-6">
                                        <div className="flex items-center gap-3 text-pink-500 font-mono text-xs font-bold">
                                            <Palette size={16} />
                                            <span>TAHAP 03: COLOR GRADING</span>
                                        </div>
                                        <h2 className="text-5xl font-black text-white">PSIKOLOGI <br />WARNA</h2>
                                        <p className="text-gray-400">
                                            Mengatur mood dan atmosfer. Dari tampilan sinematik yang gelap hingga warna pop yang cerah.
                                        </p>
                                    </div>
                                    <div className="w-1/2 h-64 flex gap-2">
                                        {/* Color Palette Strips */}
                                        {['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-teal-500', 'bg-blue-500', 'bg-indigo-500'].map((c, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: "10%" }}
                                                whileInView={{ height: "100%" }}
                                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                                className={`flex-1 ${c} rounded-full opacity-80 mix-blend-screen`}
                                            />
                                        ))}
                                    </div>
                                </motion.div>

                                {/* 6. Workflow D: Sound */}
                                <motion.div style={{ opacity: wfSoundOpacity }} className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#080808]">
                                    <div className="text-center mb-8">
                                        <Music size={40} className="text-emerald-500 mx-auto mb-4" />
                                        <h2 className="text-4xl font-black text-white">SOUND DESIGN</h2>
                                        <p className="text-gray-500 text-sm mt-2">50% DARI VIDEO ADALAH AUDIO</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 h-32 w-full max-w-2xl px-12">
                                        {[...Array(40)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: ["10%", "80%", "30%", "60%"] }}
                                                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.02 }}
                                                className="w-2 bg-emerald-500/60 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </motion.div>

                                {/* 7. Gallery */}
                                <motion.div style={{ opacity: galleryOpacity }} className="absolute inset-0 z-40 bg-[#0a0a0a] p-8 flex flex-col">
                                    <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
                                        <h2 className="text-2xl font-black text-white">GALERI KARYA</h2>
                                        <span className="text-[10px] text-gray-500 font-mono">PORTFOLIO_TERPILIH</span>
                                    </div>
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        {workGallery.map((item, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.05, borderColor: '#f97316' }}
                                                className="relative group overflow-hidden border border-white/5 rounded-sm bg-gray-900 cursor-pointer transition-all"
                                            >
                                                <img src={item.thumb} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={item.title} />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                                                    <div className="text-[10px] font-black text-white truncate">{item.title}</div>
                                                    <div className="text-[8px] text-orange-500 font-bold uppercase">{item.type}</div>
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                    <Play size={24} className="text-white fill-current drop-shadow-lg" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* 8. CTA */}
                                <motion.div style={{ opacity: ctaOpacity }} className="absolute inset-0 z-50 bg-[#000] flex flex-col items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        whileInView={{ scale: 1 }}
                                        className="text-center px-4"
                                    >
                                        <h2 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase leading-none">
                                            Gabung <br /><span className="text-orange-500">Divisi.</span>
                                        </h2>
                                        <p className="text-gray-500 text-sm tracking-widest uppercase mb-10">Mulai perjalanan kreatifmu bersama kami.</p>
                                        <button className="bg-orange-500 text-black px-12 py-5 font-black text-xl rounded hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                                            DAFTAR SEKARANG
                                        </button>
                                    </motion.div>
                                </motion.div>

                            </div>
                        </div>

                        {/* NAV CONTROLS */}
                        <div className="h-10 bg-[#1f1f1f] border-t border-[#000] flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-4">
                                <SkipBack size={16} className="text-[#666] cursor-pointer hover:text-white" />
                                <div
                                    className={`w-8 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${isPlaying ? 'bg-orange-500 text-black' : 'bg-[#333] text-[#888] hover:bg-gray-600'}`}
                                    onClick={() => setIsPlaying(!isPlaying)}
                                >
                                    <Play size={12} fill={isPlaying ? "currentColor" : "none"} />
                                </div>
                                <SkipForward size={16} className="text-[#666] cursor-pointer hover:text-white" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-[10px] text-gray-500 bg-[#111] px-2 py-0.5 rounded border border-[#333]">PENUH</div>
                                <Settings size={14} className="text-[#666]" />
                                <Maximize2 size={14} className="text-[#666]" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT INSPECTOR */}
                    <div className="hidden xl:flex w-[20%] min-w-[240px] flex-col border-l border-[#000] bg-[#1a1a1a]">
                        <div className="flex bg-[#1f1f1f] border-b border-[#000]">
                            <div className="px-3 py-1.5 bg-[#2a2a2a] text-[#eee] border-t-2 border-orange-500 text-[11px] font-bold">Effect Controls</div>
                            <div className="px-3 py-1.5 text-[#888] text-[11px]">Lumetri Color</div>
                        </div>
                        <div className="p-4 space-y-6">
                            <div className="space-y-4">
                                <div className="text-[10px] font-bold text-gray-500 uppercase">Parameter Video</div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-400">Posisi</span>
                                        <span className="text-[10px] text-blue-400 font-mono">960, 540</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-400">Skala</span>
                                        <span className="text-[10px] text-blue-400 font-mono">
                                            <motion.span>{useTransform(scrollYProgress, [0, 1], [100.0, 120.0]).get()?.toFixed(1)}</motion.span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-400">Rotasi</span>
                                        <span className="text-[10px] text-blue-400 font-mono">0.0</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-[#333] pt-4 space-y-4">
                                <div className="text-[10px] font-bold text-gray-500 uppercase">Efek Aktif</div>
                                {[
                                    { n: "Lumetri Color", c: "bg-purple-500" },
                                    { n: "Warp Stabilizer", c: "bg-blue-500" },
                                    { n: "Noise Reduction", c: "bg-green-500" }
                                ].map(e => (
                                    <div key={e.n} className="flex items-center justify-between p-2 bg-[#222] border border-[#333] rounded-sm">
                                        <span className="text-[10px] text-gray-300">{e.n}</span>
                                        <div className={`w-1.5 h-1.5 ${e.c} rounded-full`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- TIMELINE --- */}
                <div className="h-[25vh] min-h-[150px] bg-[#1a1a1a] border-t border-[#000] flex flex-col shrink-0">
                    <div className="h-6 bg-[#1f1f1f] border-b border-[#000] flex items-center px-4 justify-between text-[#888] text-[9px] font-mono">
                        <div className="flex items-center gap-6">
                            <span className="font-bold text-gray-500">Seq_01</span>
                            <span className="text-orange-500">1080p24</span>
                        </div>
                        <div className="text-blue-400">00:00:23:14</div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        <div className="w-10 border-r border-[#000] flex flex-col items-center py-4 gap-6 text-[#666]">
                            <MousePointer2 size={14} className="text-blue-500" />
                            <Scissors size={14} />
                            <GripHorizontal size={14} />
                        </div>

                        <div className="flex-1 bg-[#151515] relative p-1 flex flex-col gap-1 overflow-hidden">
                            {/* Playhead Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-50">
                                <motion.div
                                    style={{ left: timelineWidth }}
                                    className="absolute top-0 bottom-0 w-[1px] bg-red-600 h-full"
                                >
                                    <div className="w-3 h-4 bg-red-600 -mx-[1.5px] rounded-b-sm shadow-sm"></div>
                                </motion.div>
                            </div>

                            {/* Tracks */}
                            <div className="h-8 bg-[#222] border border-white/5 relative flex items-center group">
                                <div className="absolute left-0 w-8 h-full bg-[#333] border-r border-black flex items-center justify-center text-[8px] font-bold text-gray-500">V2</div>
                                <div className="absolute left-[10%] w-[15%] h-full bg-pink-500/20 border border-pink-500/40 flex items-center px-1 text-[8px] text-pink-300 rounded-sm">Teks_Intro</div>
                                <div className="absolute left-[60%] w-[20%] h-full bg-pink-500/20 border border-pink-500/40 flex items-center px-1 text-[8px] text-pink-300 rounded-sm">Lower_Third</div>
                            </div>
                            <div className="h-8 bg-[#222] border border-white/5 relative flex items-center group">
                                <div className="absolute left-0 w-8 h-full bg-[#333] border-r border-black flex items-center justify-center text-[8px] font-bold text-gray-500">V1</div>
                                <div className="absolute left-[5%] w-[40%] h-full bg-blue-500/20 border border-blue-500/40 flex items-center px-1 text-[8px] text-blue-300 rounded-sm">Klip_Utama_01.mp4</div>
                                <div className="absolute left-[45%] w-[35%] h-full bg-blue-500/20 border border-blue-500/40 flex items-center px-1 text-[8px] text-blue-300 rounded-sm">Klip_Utama_02.mp4</div>
                            </div>
                            <div className="h-8 bg-[#222] border border-white/5 mt-1 flex items-center relative group">
                                <div className="absolute left-0 w-8 h-full bg-[#333] border-r border-black flex items-center justify-center text-[8px] font-bold text-gray-500">A1</div>
                                <div className="absolute left-0 w-full h-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-[1px] px-8 pl-10 opacity-60">
                                    {[...Array(80)].map((_, i) => <div key={i} className="flex-1 bg-emerald-500" style={{ height: `${30 + Math.random() * 70}%` }}></div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};
