import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Scissors, Layers, Monitor, HardDrive, Zap, Film, Aperture, Wand2, Music, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Aset & Data ---
const scenes = [
    {
        id: "intro",
        text: "MEMUAT ASET...",
        sub: "MENYIAPKAN TIMELINE"
    },
    {
        id: "chaos",
        title: "DIVISI PALING GILA",
        desc: "Kami tidak sekadar memotong gambar. Kami memanipulasi waktu, emosi, dan realitas penonton.",
        tags: ["CHAOS", "GLITCH", "RENDER"]
    },
    {
        id: "styles",
        title: "MULTI-GENRE",
        items: [
            { label: "SINEMATIK", color: "text-orange-500" },
            { label: "BRUTALISM", color: "text-white" },
            { label: "DOKUMENTER", color: "text-gray-400" },
            { label: "MEME/SHITPOST", color: "text-red-500" }
        ]
    },
    {
        id: "alchemy",
        title: "KEAJAIBAN EDITING",
        desc: "Dari potongan mentah menjadi mahakarya. Kami memberi warna pada abu-abu, dan suara pada keheningan.",
    },
    {
        id: "allinone",
        title: "EDITOR = HYBRID",
        desc: "Seorang editor adalah desainer grafis, penulis naskah, dan sound engineer yang terperangkap dalam satu tubuh.",
        icons: [Layers, Monitor, Zap]
    }
];

// --- Komponen ---

const Timecode = ({ scrollProgress }: { scrollProgress: any }) => {
    const [time, setTime] = useState("00:00:00:00");

    useTransform(scrollProgress, (latest: number) => {
        const totalFrames = Math.floor(latest * 1000);
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
        <div className="font-mono text-orange-500 text-xl md:text-2xl tracking-widest font-bold shadow-orange-500/20 drop-shadow-lg">
            {time}
        </div>
    );
};

const GlitchText = ({ text, active }: { text: string, active: boolean }) => {
    return (
        <div className="relative inline-block">
            <span className="relative z-10">{text}</span>
            {active && (
                <>
                    <span className="absolute top-0 left-0 -ml-1 text-red-500 opacity-70 animate-pulse">{text}</span>
                    <span className="absolute top-0 left-0 ml-1 text-blue-500 opacity-70 animate-pulse delay-75">{text}</span>
                </>
            )}
        </div>
    );
};

export const VideoPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // --- Pemetaan Gulir ---
    // Adegan 1: Intro Memudar Keluar
    const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const introScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.2]);

    // Adegan 2: Kekacauan Memudar Masuk/Keluar
    const chaosOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.4, 0.5], [0, 1, 1, 0]);
    const chaosY = useTransform(scrollYProgress, [0.1, 0.5], ["50px", "-50px"]);

    // Adegan 3: Gaya
    const stylesOpacity = useTransform(scrollYProgress, [0.45, 0.5, 0.7, 0.75], [0, 1, 1, 0]);
    const stylesX = useTransform(scrollYProgress, [0.45, 0.75], ["100%", "-100%"]);

    // Adegan 4: Alkimia (Keajaiban Editing)
    const alchemyOpacity = useTransform(scrollYProgress, [0.7, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
    const alchemyScale = useTransform(scrollYProgress, [0.75, 0.85], [0.9, 1]);

    // Sub-animasi untuk elemen Alkimia
    const rawOpacity = useTransform(scrollYProgress, [0.7, 0.75], [1, 0.2]); // Rekaman mentah memudar
    const colorOpacity = useTransform(scrollYProgress, [0.72, 0.78], [0, 1]); // Color grading muncul
    const soundY = useTransform(scrollYProgress, [0.75, 0.82], [50, 0]); // Gelombang suara naik
    const soundOpacity = useTransform(scrollYProgress, [0.75, 0.82], [0, 1]);

    // Adegan 5: Semua Jadi Satu
    const allOpacity = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);

    // Kemajuan Timeline
    const timelineWidth = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), { stiffness: 100, damping: 30 });

    return (
        <div ref={containerRef} className="h-[600vh] bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-black relative">

            {/* --- HAMparan UI TETAP (Antarmuka Editor) --- */}
            <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-12">

                {/* Bilah Atas */}
                <div className="flex justify-between items-start">
                    <div className="pointer-events-auto">
                        <Link to="/info" className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-orange-500 transition-colors uppercase tracking-widest border border-gray-800 px-4 py-2 rounded bg-black/80 backdrop-blur-md">
                            <ArrowLeft size={14} /> KEMBALI
                        </Link>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                            <span className="font-mono text-xs text-red-500 tracking-widest">REC</span>
                        </div>
                        <Timecode scrollProgress={scrollYProgress} />
                    </div>
                </div>

                {/* Crosshair/Grid Tengah (Halus) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-[1px] h-full bg-orange-500"></div>
                    <div className="h-[1px] w-full bg-orange-500 absolute"></div>
                    <div className="border border-orange-500 w-[80%] h-[80%] absolute"></div>
                </div>

                {/* UI Timeline Bawah */}
                <div className="w-full bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50 pointer-events-auto">
                    {/* Kontrol */}
                    <div className="flex justify-center gap-8 mb-4 text-gray-500">
                        <SkipBack size={20} className="hover:text-white cursor-pointer transition-colors" />
                        <Play size={20} className="text-orange-500 fill-current hover:scale-110 transition-transform cursor-pointer" />
                        <SkipForward size={20} className="hover:text-white cursor-pointer transition-colors" />
                    </div>

                    {/* Trek Timeline */}
                    <div className="relative h-12 bg-[#111] border border-gray-800 rounded overflow-hidden flex items-center cursor-pointer group">
                        {/* Penggaris */}
                        <div className="absolute top-0 left-0 right-0 h-2 flex justify-between px-2 opacity-30">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div key={i} className={`w-[1px] bg-gray-500 ${i % 5 === 0 ? 'h-2' : 'h-1'}`}></div>
                            ))}
                        </div>

                        {/* Klip (Dekorasi Visual) */}
                        <div className="flex gap-1 w-full px-4 opacity-60 group-hover:opacity-80 transition-opacity">
                            <div className="h-6 w-1/4 bg-blue-900/50 border border-blue-500/30 rounded"></div>
                            <div className="h-6 w-1/6 bg-green-900/50 border border-green-500/30 rounded"></div>
                            <div className="h-6 w-1/3 bg-orange-900/50 border border-orange-500/30 rounded"></div>
                            <div className="h-6 w-1/4 bg-purple-900/50 border border-purple-500/30 rounded"></div>
                        </div>

                        {/* Playhead */}
                        <motion.div
                            style={{ left: timelineWidth }}
                            className="absolute top-0 bottom-0 w-[2px] bg-orange-500 z-10 shadow-[0_0_15px_rgba(249,115,22,1)]"
                        >
                            <div className="absolute top-0 -translate-x-1/2 -mt-1 text-orange-500 text-[10px]">▼</div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- KONTAINER KONTEN TETAP --- */}
            {/* Menambahkan pb-40 untuk mengangkat konten di atas UI bawah */}
            <div className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none z-0 pb-40">

                {/* ADEGAN 1: INTRO */}
                <motion.div style={{ opacity: introOpacity, scale: introScale }} className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-40 pb-40">
                    <Monitor size={64} className="text-orange-500 mb-8 animate-pulse" />
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 text-center">
                        <GlitchText text="DIVISI VIDEO" active={true} />
                    </h1>
                    <p className="font-mono text-orange-500 text-sm tracking-[0.5em] animate-pulse mt-4">GULIR UNTUK MEMUTAR</p>
                </motion.div>

                {/* ADEGAN 2: KEKACAUAN */}
                <motion.div style={{ opacity: chaosOpacity, y: chaosY }} className="absolute inset-0 flex flex-col items-center justify-center z-30 pb-40">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <h2 className="text-[12vw] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 mix-blend-difference text-center">
                        PALING GILA
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {scenes[1].tags?.map((tag, i) => (
                            <span key={i} className="bg-orange-500 text-black font-bold px-4 py-1 text-sm md:text-xl transform rotate-[-5deg] hover:rotate-0 transition-transform">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <p className="mt-12 max-w-xl text-center text-xl md:text-2xl font-mono text-gray-300 bg-black/80 p-6 border border-gray-800 backdrop-blur-sm">
                        "{scenes[1].desc}"
                    </p>
                </motion.div>

                {/* ADEGAN 3: GAYA (Efek Gulir Horizontal) */}
                <motion.div style={{ opacity: stylesOpacity, x: stylesX }} className="absolute flex items-center gap-20 pl-[50vw] z-20 whitespace-nowrap pb-40">
                    {scenes[2].items?.map((item, i) => (
                        <div key={i} className={`text-[15vw] font-black ${item.color} opacity-80 hover:opacity-100 transition-opacity drop-shadow-2xl`}>
                            {item.label}
                        </div>
                    ))}
                </motion.div>

                {/* ADEGAN 4: ALKIMIA EDITING */}
                <motion.div style={{ opacity: alchemyOpacity, scale: alchemyScale }} className="absolute inset-0 flex items-center justify-center z-30 bg-[#0a0a0a] pb-40">
                    <div className="relative w-full max-w-4xl p-8">
                        {/* Elemen Latar Belakang */}
                        <motion.div style={{ opacity: rawOpacity }} className="absolute inset-0 flex items-center justify-center">
                            <Film size={300} className="text-gray-800 opacity-20" />
                        </motion.div>

                        <div className="relative z-10 text-center">
                            <motion.div style={{ opacity: colorOpacity }} className="mb-8 inline-block">
                                <Palette size={64} className="text-orange-500 mx-auto mb-4" />
                                <h3 className="text-3xl font-bold text-orange-500 tracking-widest uppercase">Color Grading</h3>
                            </motion.div>

                            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                                KEAJAIBAN<br />EDITING
                            </h2>

                            <motion.div style={{ y: soundY, opacity: soundOpacity }} className="bg-gray-900/80 backdrop-blur border border-gray-800 p-8 rounded-2xl">
                                <div className="flex justify-center gap-2 mb-6 h-16 items-end">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [20, 60, 30, 50, 20] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                                            className="w-2 bg-orange-500 rounded-full"
                                        />
                                    ))}
                                </div>
                                <p className="text-xl text-gray-300 font-mono">
                                    "Kami memberi warna pada abu-abu.<br />Kami memberi suara pada keheningan."
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* ADEGAN 5: SEMUA JADI SATU */}
                <motion.div style={{ opacity: allOpacity }} className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#050505] pointer-events-auto pb-40">
                    <div className="grid grid-cols-3 gap-8 mb-12">
                        {[Wand2, Monitor, Layers].map((Icon, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="w-24 h-24 md:w-32 md:h-32 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 hover:border-orange-500 hover:bg-orange-900/20 transition-all group shadow-2xl"
                            >
                                <Icon size={40} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                    <h2 className="text-5xl md:text-8xl font-bold mb-6 text-center">
                        <span className="text-orange-500">EDITOR</span> = HYBRID
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl text-center leading-relaxed px-6 mb-12">
                        {scenes[4].desc}
                    </p>
                    <button className="bg-orange-500 text-black font-bold px-10 py-5 rounded-full hover:bg-white hover:scale-105 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                        <Play size={24} fill="currentColor" />
                        MULAI RENDER
                    </button>
                </motion.div>

            </div>
        </div>
    );
};
