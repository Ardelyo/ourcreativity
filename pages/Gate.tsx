
import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    PenTool,
    Type,
    Youtube,
    Smile,
    Terminal,
    ArrowRight,
    ShieldAlert,
    Fingerprint
} from 'lucide-react';

// Data Divisi
const divisions = [
    {
        id: 'karyatulis',
        name: "Karya Tulis",
        tagline: "Merangkai Kata, Mengukir Makna",
        desc: "Wadah bagi para penulis untuk mengekspresikan ide, puisi, dan cerita yang menggugah jiwa.",
        logo: "/logo-oc-karyatulis.jpg",
        icon: Type,
        link: "https://forms.gle/placeholder-karyatulis",
        color: "from-rose-500 to-rose-700",
        text: "text-rose-400"
    },
    {
        id: 'desain',
        name: "Desain Grafis",
        tagline: "Visualisasi Tanpa Batas",
        desc: "Eksplorasi estetika visual, tipografi, dan komposisi untuk menciptakan karya yang memukau.",
        logo: "/logo-oc-desain.jpg",
        icon: PenTool,
        link: "https://forms.gle/placeholder-desain",
        color: "from-purple-500 to-purple-700",
        text: "text-purple-400"
    },
    {
        id: 'video',
        name: "Video Editing",
        tagline: "Sinematografi & Momen",
        desc: "Menggabungkan potongan momen menjadi narasi visual yang hidup dan bercerita.",
        logo: "/logo-oc-video.jpg",
        icon: Youtube,
        link: "https://forms.gle/placeholder-video",
        color: "from-blue-500 to-blue-700",
        text: "text-blue-400"
    },
    {
        id: 'meme',
        name: "Meme Creator",
        tagline: "Anjay",
        desc: "Seni menyebarkan tawa melalui gambar dan konteks yang relavan dengan budaya pop.",
        logo: "/logo-oc-meme.jpg",
        icon: Smile,
        link: "https://forms.gle/placeholder-meme",
        color: "from-yellow-500 to-yellow-700",
        text: "text-yellow-400"
    },
    {
        id: 'coding',
        name: "Coding",
        tagline: "Logika Pembangun Masa Depan",
        desc: "Menciptakan solusi digital melalui barisan kode dan algoritma yang presisi.",
        logo: "/logo-oc-coding.jpg",
        icon: Terminal,
        link: "https://forms.gle/placeholder-coding",
        color: "from-emerald-500 to-emerald-700",
        text: "text-emerald-400"
    },
];

const Gate = () => {
    const container = useRef<HTMLDivElement>(null);
    const gateParent = useRef<HTMLDivElement>(null);
    const gateLeft = useRef<HTMLDivElement>(null);
    const gateRight = useRef<HTMLDivElement>(null);
    const contentWrapper = useRef<HTMLDivElement>(null);
    const lockBtn = useRef<HTMLButtonElement>(null);

    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isMaintenance] = useState(true); // Toggle this for maintenance
    const navigate = useNavigate();

    useGSAP(() => {
        // Initial State: Locked view with slight 3D perspective
        gsap.set(gateParent.current, { perspective: 2000 });
        gsap.set([gateLeft.current, gateRight.current], { transformOrigin: "left center" });
        gsap.set(gateRight.current, { transformOrigin: "right center" });

        // Idle animation for the lock
        gsap.to(".lock-pulse", {
            scale: 1.5,
            opacity: 0,
            duration: 2,
            repeat: -1,
            ease: "power2.out"
        });
    }, { scope: container });

    const handleOpen = () => {
        if (isUnlocked || isMaintenance) return;
        setIsUnlocked(true);

        const tl = gsap.timeline();

        // 1. Zoom into the lock (Impact)
        tl.to(lockBtn.current, {
            scale: 1.5,
            duration: 0.4,
            ease: "power2.in"
        })
            .to(lockBtn.current, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power4.in"
            })

            // 2. 3D Gate Open Animation (Stepping in effect)
            .to(gateLeft.current, {
                rotateY: -110,
                duration: 2,
                ease: "power3.inOut"
            }, "-=0.2")
            .to(gateRight.current, {
                rotateY: 110,
                duration: 2,
                ease: "power3.inOut"
            }, "-=2")

            // 3. Camera Move-In Effect (Scale up the background while doors open)
            .to(".immersive-bg", {
                scale: 1.2,
                opacity: 1,
                duration: 2.5,
                ease: "power2.out"
            }, "-=1.8")

            // 4. Content Sequential Appearance (The Story)
            .fromTo(".story-item",
                {
                    y: 40,
                    opacity: 0,
                    filter: "blur(10px)"
                },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power4.out"
                },
                "-=1.2"
            );
    };

    return (
        <div ref={container} className="fixed inset-0 z-50 bg-[#020202] overflow-hidden font-sans text-white select-none">

            {/* IMMERSIVE BACKGROUND (Revealed behind the gate) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="immersive-bg absolute inset-0 opacity-0 transform-gpu transition-opacity duration-1000">
                    {/* Ambient Lighting */}
                    <div className="absolute top-[10%] left-[-5%] w-[60vw] h-[60vw] bg-rose-900/10 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-[10%] right-[-5%] w-[70vw] h-[70vw] bg-indigo-900/10 rounded-full blur-[150px]"></div>

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{
                        backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
                        backgroundSize: '80px 80px'
                    }}></div>

                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                </div>
            </div>

            {/* NAVIGATION: ABORT/BACK */}
            <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => navigate('/info')}
                className="absolute top-10 left-10 z-[100] flex items-center gap-4 px-6 py-3 rounded-full bg-black/40 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-xl group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold tracking-[0.4em]">KEMBALI</span>
            </motion.button>

            {/* MAINTENANCE OVERLAY */}
            <AnimatePresence>
                {isMaintenance && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md"
                    >
                        <div className="text-center max-w-md px-10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 20 }}
                                className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-8 relative"
                            >
                                <ShieldAlert className="w-10 h-10 text-amber-500" />
                                <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-xl animate-pulse"></div>
                            </motion.div>

                            <h2 className="text-3xl font-serif text-white mb-4 italic tracking-wide">Gerbang Tertutup</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-10 font-serif">
                                Portal divisi saat ini sedang dalam pemeliharaan sistem. Kami sedang merapihkan gerbang untuk pengalaman yang lebih baik. Silakan kembali lagi nanti.
                            </p>

                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10"></div>

                            <div className="flex items-center justify-center gap-4">
                                <div className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold tracking-[0.2em] text-gray-500">
                                    STATUS: MAINTENANCE
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D GATE SYSTEM */}
            <div
                ref={gateParent}
                className={`absolute inset-0 z-50 flex overflow-hidden pointer-events-none ${isUnlocked ? 'z-10' : 'z-50'}`}
            >
                {/* Left 3D Panel */}
                <div
                    ref={gateLeft}
                    className="relative w-1/2 h-full bg-[#0a0a0a] border-r border-white/5 flex items-center justify-end px-12 transform-style-3d pointer-events-auto"
                >
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-black/40 transition-opacity duration-1000 ${isUnlocked ? 'opacity-100' : 'opacity-0'}`}></div>
                    <div className="opacity-10 pointer-events-none select-none hidden md:block">
                        <Fingerprint size={300} strokeWidth={0.5} />
                    </div>
                </div>

                {/* Right 3D Panel */}
                <div
                    ref={gateRight}
                    className="relative w-1/2 h-full bg-[#0a0a0a] border-l border-white/5 flex items-center justify-start px-12 transform-style-3d pointer-events-auto"
                >
                    <div className={`absolute inset-0 bg-gradient-to-l from-transparent to-black/40 transition-opacity duration-1000 ${isUnlocked ? 'opacity-100' : 'opacity-0'}`}></div>
                    <div className="opacity-10 pointer-events-none select-none hidden md:block">
                        <Fingerprint size={300} strokeWidth={0.5} className="rotate-180" />
                    </div>
                </div>

                {/* LOCK MECHANISM (Floating in center) */}
                <div className={`absolute inset-0 z-[60] flex items-center justify-center transition-all duration-700 ${isUnlocked ? 'pointer-events-none opacity-0' : 'pointer-events-auto'}`}>
                    <button
                        ref={lockBtn}
                        onClick={handleOpen}
                        className="relative w-40 h-40 flex items-center justify-center outline-none group"
                    >
                        {/* Pulsing Visuals */}
                        <div className="lock-pulse absolute inset-0 rounded-full border-2 border-rose-500/50"></div>
                        <div className="lock-pulse absolute inset-0 rounded-full border-2 border-rose-500/30 scale-125 animation-delay-500"></div>

                        <div className="absolute inset-[-20px] rounded-full border border-white/5 animate-[spin_20s_linear_infinite]"></div>

                        {/* Inner Circle */}
                        <div className="relative w-28 h-28 bg-[#000] border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(244,63,94,0.1)] group-hover:shadow-[0_0_100px_rgba(244,63,94,0.25)] transition-all duration-500 group-active:scale-90">
                            <ShieldAlert className="w-10 h-10 text-white group-hover:text-rose-400 transition-colors" strokeWidth={1.5} />

                            {/* Decorative HUD Ring */}
                            <svg className="absolute w-full h-full inset-0 opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-rose-500" />
                            </svg>
                        </div>

                        <div className="absolute -bottom-20 flex flex-col items-center gap-2">
                            <span className="text-[10px] tracking-[0.8em] font-bold text-gray-500 group-hover:text-rose-400 transition-colors">SIAPKAN_DIRI</span>
                            <div className="w-12 h-[1px] bg-white/10"></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT (Story Revealed) */}
            <div
                ref={contentWrapper}
                className={`relative z-20 w-full h-full overflow-y-auto ${!isUnlocked ? 'invisible pointer-events-none' : 'visible pointer-events-auto'}`}
            >
                <div className="min-h-screen container mx-auto px-6 py-32 flex flex-col items-center">

                    {/* Story Header */}
                    <div className="story-item text-center mb-24 max-w-4xl">
                        <h2 className="text-rose-500 text-xs font-bold tracking-[1em] uppercase mb-8">INITIATED_SUCCESSFULLY</h2>
                        <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight tracking-tight">
                            Selamat Datang di <br />
                            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400">Portal Divisi</span>
                        </h1>
                        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8"></div>
                        <p className="text-xl text-gray-400 font-light leading-relaxed font-serif max-w-2xl mx-auto">
                            Perjalanan dimulai dari sebuah pilihan. Pilih divisi yang paling
                            sesuai dengan jiwamu dan mari berkarya bersama dalam ekosistem ini.
                        </p>
                    </div>

                    {/* Division Grid (The Discovery) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl pb-40">
                        {divisions.map((div) => (
                            <a
                                key={div.id}
                                href={div.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="story-item group relative flex flex-col bg-[#050505] border border-white/[0.03] hover:border-white/10 rounded-[2.5rem] p-4 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden"
                            >
                                {/* Visual Identity */}
                                <div className="relative h-64 rounded-[2rem] overflow-hidden mb-8">
                                    <img
                                        src={div.logo}
                                        alt={div.name}
                                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>

                                    <div className={`absolute top-6 left-6 p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 ${div.text}`}>
                                        <div.icon size={28} />
                                    </div>
                                </div>

                                {/* Information */}
                                <div className="px-6 pb-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${div.color}`}></div>
                                        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 ${div.text}`}>Akses Terbuka</span>
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-2 leading-none">{div.name}</h3>
                                    <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed line-clamp-2 h-10 group-hover:text-white transition-colors duration-500 text-serif italic">
                                        "{div.tagline}"
                                    </p>

                                    {/* Join Button */}
                                    <div className="relative mt-auto">
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${div.color} blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                                        <div className="relative w-full flex items-center justify-between py-5 px-6 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-white/20 transition-all duration-500">
                                            <span className="text-sm font-bold tracking-widest text-white/80 group-hover:text-white transition-colors">MULAI DISINI</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                </div>
            </div>

            {/* GLOBAL STYLES FOR GSAP */}
            <style>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>

        </div>
    );
};

export default Gate;
