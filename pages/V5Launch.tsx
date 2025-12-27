import React, { useRef, useState, memo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
    Rocket, Zap, Palette, Layout, Smartphone,
    Sparkles, ChevronDown, Gauge,
    Database, Layers, ShieldCheck, Code2, MoveHorizontal, ExternalLink, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Komponen Latar Belakang: Luminous Fluid Enhanced (Optimized) ---
// Menggunakan memo untuk mencegah re-render yang tidak perlu
const FluidBackground = memo(() => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#020202]">
            {/* Orb 1: Rose Glow - Reduced blur for performance, added will-change */}
            <motion.div
                animate={{
                    x: [0, 50, -25, 0],
                    y: [0, -25, 50, 0],
                    scale: [1, 1.1, 0.95, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-rose-600/30 blur-[100px] rounded-full mix-blend-screen will-change-transform"
            />
            {/* Orb 2: Purple Glow */}
            <motion.div
                animate={{
                    x: [0, -40, 60, 0],
                    y: [0, 60, -30, 0],
                    scale: [1, 0.95, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen will-change-transform"
            />
            {/* Orb 3: Cyan Accent */}
            <motion.div
                animate={{
                    x: [0, 80, -50, 0],
                    y: [0, 50, 80, 0],
                    opacity: [0.15, 0.3, 0.15]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen will-change-transform"
            />

            {/* Grid Pattern Overlay - Static */}
            <div className="absolute inset-x-0 top-0 h-screen bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Noise Texture - Static */}
            <div className="absolute inset-0 opacity-[0.05] z-10 mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
        </div>
    );
});

// --- Independent Progress Bar to isolate re-renders ---
const ProgressBar = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 origin-left z-50 shadow-[0_0_20px_rgba(255,50,100,0.5)]"
            style={{ scaleX }}
        />
    );
};

// --- Komponen Slide Wrapper ---
const Slide = memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <section className={`min-h-screen w-full flex flex-col items-center justify-center relative z-20 px-6 py-24 ${className}`}>
        {children}
    </section>
));

// --- Komponen Compare Slider (Interactive) ---
const CompareSlider = memo(() => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current || !isDragging) return;

        const { left, width } = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const position = ((clientX - left) / width) * 100;

        setSliderPosition(Math.min(Math.max(position, 0), 100));
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl group transform-gpu"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* V5 (After) Image - Full Width */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="/images/comparison/v5_hero.png"
                    alt="V5 Revolution"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                    V5.0 REVOLUTION
                </div>
            </div>

            {/* V4 (Before) Image - Clipped */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden border-r border-white/20 will-change-[width]"
                style={{ width: `${sliderPosition}%` }}
            >
                <img
                    src="/images/comparison/v4_home.png"
                    alt="V4 Legacy"
                    className="w-full h-full object-cover object-left"
                    style={{ width: '100vw', maxWidth: 'unset' }}
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Dimmer for legacy */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                    V4.0 LEGACY
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(255,255,255,0.5)] will-change-[left]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
                    <MoveHorizontal size={20} />
                </div>
            </div>

            {/* Instruction */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/50 bg-black/50 px-3 py-1 rounded-full backdrop-blur pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Geser untuk membandingkan
            </div>
        </div>
    )
});

// --- Komponen Metrik Teranimasi (Enhanced) ---
const MetricCard = memo(({ label, value, sub, delay }: { label: string, value: string, sub?: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4 }}
        className="p-8 rounded-3xl bg-[#0a0a0a]/50 border border-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center group transition-colors relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-[0.2em] relative z-10">{label}</span>
        <span className="text-5xl md:text-7xl font-black font-serif italic text-white mb-2 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{value}</span>
        {sub && <span className="text-[10px] text-rose-300 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 relative z-10">{sub}</span>}
    </motion.div>
));

// --- Sub-Components for Slides (Memoized) ---

const HeroSlide = memo(() => (
    <Slide>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Status: Production Ready • v5.0.0</span>
            </motion.div>

            <h1 className="text-8xl md:text-[13rem] font-serif font-black tracking-tighter leading-[0.85] italic mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl">
                V5.0
                <span className="block text-3xl md:text-6xl font-sans font-light not-italic tracking-normal mt-4 text-gray-400">Revolution Edition</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-12 mix-blend-plus-lighter">
                Sebuah lompatan kuantum dalam <span className="text-white font-medium glow-text">Desain</span>, <span className="text-white font-medium glow-text">Performa</span>, dan <span className="text-white font-medium glow-text">Interaksi</span>.
            </p>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            >
                <ChevronDown size={32} />
            </motion.div>
        </motion.div>
    </Slide>
));

const ComparisonSlide = memo(() => (
    <Slide className="bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-7xl w-full">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl md:text-7xl font-serif font-bold italic">TRANSISI <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500">VISUAL.</span></h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Bandingkan langsung evolusi antarmuka. Dari dashboard fungsional v4.0 menuju ekosistem imersif v5.0.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full"
            >
                <CompareSlider />
            </motion.div>
        </div>
    </Slide>
));

const PhilosophySlide = memo(() => {
    const items = [
        {
            icon: <Layout className="text-rose-500" size={32} />,
            title: "Calm over Chaos",
            desc: "Ketenangan visual melalui dominasi ruang negatif dan palet monokrom."
        },
        {
            icon: <Sparkles className="text-purple-500" size={32} />,
            title: "Luminous Feel",
            desc: "Sentuhan cahaya halus (glow) sebagai penunjuk fokus, bukan sekadar hiasan."
        },
        {
            icon: <Gauge className="text-blue-500" size={32} />,
            title: "Function First",
            desc: "Setiap piksel memiliki tujuan. Eliminasi dekorasi tak bermakna."
        },
        {
            icon: <ShieldCheck className="text-green-500" size={32} />,
            title: "Immersive Dark",
            desc: "Mode gelap mendalam yang menyatu dengan konten, seperti bioskop."
        }
    ];

    return (
        <Slide>
            <div className="max-w-7xl w-full text-center">
                <span className="text-rose-500 font-mono tracking-[0.3em] uppercase text-xs mb-8 block glow-text-rose">Luminous Philosophy</span>
                <h2 className="text-6xl md:text-8xl font-serif font-bold italic mb-24">ZEN <span className="text-white/20">MINIMALISM</span></h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2rem] text-left hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="mb-8 p-4 bg-black border border-white/10 w-fit rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10 shadow-lg">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold font-serif italic mb-3 text-white relative z-10">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed font-light relative z-10">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Slide>
    );
});

const MetricsSlide = memo(() => {
    const specs = [
        { l: "Framework", v: "React 19.2", i: <Code2 size={16} /> },
        { l: "Build Tool", v: "Vite 6.2", i: <Zap size={16} /> },
        { l: "Database", v: "Supabase Realtime", i: <Database size={16} /> },
        { l: "Animation", v: "Framer Motion 12", i: <Layers size={16} /> },
    ];

    return (
        <Slide className="bg-white/[0.02]">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-5xl md:text-8xl font-serif font-bold italic leading-none mb-8">
                        DIBALIK <br /><span className="text-green-400">LAYAR.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-12">
                        Keindahan visual didukung oleh otot teknologi yang kuat. Kami bermigrasi ke arsitektur modern untuk kecepatan tanpa kompromi.
                    </p>

                    <div className="space-y-6">
                        {specs.map((spec, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 text-gray-300 border-b border-white/5 pb-4"
                            >
                                <div className="p-2 bg-white/5 rounded-lg">{spec.i}</div>
                                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 flex-1">{spec.l}</span>
                                <span className="font-bold">{spec.v}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <MetricCard label="Lighthouse" value="98" sub="Performance Score" delay={0.1} />
                    <MetricCard label="Bundle Size" value="-15%" sub="More Efficient" delay={0.2} />
                    <MetricCard label="Load Time" value="0.8s" sub="First Contentful Paint" delay={0.3} />
                    <MetricCard label="SEO" value="100" sub="Search Optimized" delay={0.4} />
                </div>
            </div>
        </Slide>
    );
});

const ReferencesSlide = memo(() => (
    <Slide>
        <div className="max-w-4xl w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500" />

            <div className="flex items-center gap-4 mb-8">
                <Info className="text-blue-500" />
                <h3 className="text-2xl font-bold font-serif">Referensi Riset</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500">Tim Pengembang</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 font-bold">A</div>
                            <div>
                                <div className="font-bold text-white">Ardelyo</div>
                                <div className="text-xs text-gray-500">Lead V5 Architecture & Design</div>
                            </div>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">D</div>
                            <div>
                                <div className="font-bold text-white">DoctorThink</div>
                                <div className="text-xs text-gray-500">V4 Foundation & Stabilization</div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500">Sumber Data</h4>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <ExternalLink size={14} className="text-gray-400" />
                            <span className="font-bold text-sm">docs/risetful.md</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Dokumen analisis komparatif lengkap mencakup metrik performa, filosofi desain, dan riwayat migrasi dari V4 ke V5.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Slide>
));

const CTASlide = memo(() => (
    <Slide className="border-none">
        <div className="relative z-10 text-center space-y-12">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-6xl md:text-[10rem] font-serif font-black italic tracking-tighter leading-none mb-4">
                    ERA <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">BARU.</span>
                </h2>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Link to="/" className="group relative px-12 py-5 bg-white text-black rounded-full font-bold text-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                    <span className="relative z-10 flex items-center gap-3">
                        Mulai Eksplorasi <Rocket size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                </Link>
                <Link to="/studio" className="px-12 py-5 rounded-full border border-white/10 font-bold text-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white flex items-center gap-3 backdrop-blur-md">
                    <Smartphone size={20} />
                    Buka Studio
                </Link>
            </div>

            <div className="pt-24 opacity-30">
                <p className="font-mono text-[10px] tracking-[0.5em] uppercase">OurCreativity © 2025 • Revolution Edition</p>
            </div>
        </div>
    </Slide>
));

export const V5Launch = () => {
    return (
        <div className="relative bg-[#020202] text-white selection:bg-rose-500/30 font-sans overflow-x-hidden">
            <FluidBackground />
            <ProgressBar />

            {/* Navigasi Persisten */}
            <div className="fixed top-8 left-8 z-40 flex items-center gap-6 mix-blend-difference pointer-events-none">
                {/* Enable pointer events on link */}
                <div className="pointer-events-auto">
                    <Link to="/announcement" className="text-white hover:text-rose-400 transition-all flex items-center gap-2 font-mono text-xs tracking-[0.2em] group uppercase">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Pusat Informasi
                    </Link>
                </div>
            </div>

            <HeroSlide />
            <ComparisonSlide />
            <PhilosophySlide />
            <MetricsSlide />
            <ReferencesSlide />
            <CTASlide />
        </div>
    );
};

