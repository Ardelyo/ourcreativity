import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, Feather, Quote, PenTool, BookOpen, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const writings = [
    {
        title: "Dialektika Sunyi",
        category: "Esai Filosofis",
        excerpt: "Dalam keheningan, kita menemukan kebisingan pikiran yang paling jujur. Sebuah kritik terhadap modernitas yang menolak jeda.",
        author: "Sarah A.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2573&auto=format&fit=crop"
    },
    {
        title: "Matinya Sang Penulis",
        category: "Kritik Sastra",
        excerpt: "Apakah intensi penulis masih relevan ketika teks telah dilepas ke publik? Membedah kembali teori Barthes di era media sosial.",
        author: "Rian K.",
        image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=2629&auto=format&fit=crop"
    },
    {
        title: "Kota Tanpa Jendela",
        category: "Prosa",
        excerpt: "Mereka membangun dinding-dinding kaca, namun tak ada yang benar-benar melihat ke luar. Sebuah alegori tentang narsisme urban.",
        author: "Dina M.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2428&auto=format&fit=crop"
    }
];

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    // Wrapper gulir halus yang disederhanakan untuk nuansa "premium"
    return <div className="scroll-smooth">{children}</div>;
};

const ParallaxImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.img style={{ y }} src={src} alt={alt} className="w-full h-[120%] object-cover" />
        </div>
    );
};

const RevealText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay }}
                viewport={{ once: true }}
            >
                {text}
            </motion.div>
        </div>
    );
};

export const Writing = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-[#f4f1ea] text-[#1a1a1a] font-serif selection:bg-[#1a1a1a] selection:text-[#f4f1ea] overflow-x-hidden">
                {/* Bilah Kemajuan */}
                <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-[#1a1a1a] origin-left z-50" />

                {/* Navigasi */}
                <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-[#f4f1ea] pointer-events-none">
                    <Link to="/info" className="flex items-center gap-3 text-sm tracking-[0.2em] uppercase hover:opacity-70 transition-opacity pointer-events-auto font-sans font-medium">
                        <ArrowLeft size={16} /> Kembali
                    </Link>
                    <div className="hidden md:block text-xs tracking-[0.2em] uppercase opacity-70 font-sans">
                        O.C Karya Tulis • Vol. 01
                    </div>
                </nav>

                {/* Bagian Hero - "DIVISI PALING KRITIS" */}
                <header className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20">
                    <div className="max-w-[90vw]">
                        <div className="overflow-hidden mb-4">
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                                className="text-sm md:text-base font-sans font-medium tracking-[0.3em] uppercase text-[#1a1a1a]/60 flex items-center gap-4"
                            >
                                <span className="w-12 h-[1px] bg-[#1a1a1a]/60"></span>
                                Selamat Datang di
                            </motion.div>
                        </div>

                        <h1 className="text-[12vw] leading-[0.85] font-medium tracking-tighter uppercase mb-12 mix-blend-multiply">
                            <RevealText text="Divisi" delay={0.1} />
                            <RevealText text="Paling" delay={0.2} className="ml-[10vw] italic font-light" />
                            <RevealText text="Kritis" delay={0.3} />
                        </h1>

                        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-t border-[#1a1a1a] pt-8">
                            <p className="max-w-md text-lg md:text-xl leading-relaxed font-sans text-[#1a1a1a]/80">
                                Di mana setiap kata ditimbang, setiap ide diuji, dan setiap tulisan adalah bentuk perlawanan terhadap kedangkalan.
                            </p>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="hidden md:flex flex-col items-center gap-2 font-sans text-xs tracking-widest uppercase"
                            >
                                Scroll
                                <ArrowDown size={16} />
                            </motion.div>
                        </div>
                    </div>
                </header>

                {/* Bagian Manifesto / Kolase */}
                <section className="py-32 px-6 md:px-20 border-t border-[#1a1a1a]/10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                        <div className="md:col-span-4 sticky top-32">
                            <span className="font-sans text-xs tracking-[0.2em] uppercase mb-6 block text-[#1a1a1a]/60">Manifesto Kami</span>
                            <h2 className="text-5xl md:text-7xl leading-none mb-8">
                                Berpikir.<br />
                                Menulis.<br />
                                <span className="italic font-light">Mengubah.</span>
                            </h2>
                            <p className="font-sans text-[#1a1a1a]/70 leading-relaxed mb-8">
                                Kami percaya bahwa tulisan bukan sekadar hiasan. Ia adalah senjata tajam yang membedah realitas. Di sini, kami tidak hanya belajar menulis indah, tapi belajar berpikir benar.
                            </p>
                            <div className="flex gap-4">
                                <div className="px-6 py-3 border border-[#1a1a1a] rounded-full font-sans text-sm uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#f4f1ea] transition-colors cursor-pointer">
                                    Gabung Diskusi
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-8 relative min-h-[100vh]">
                            {/* Elemen Kolase */}
                            <div className="relative z-10 bg-white p-8 shadow-xl max-w-md ml-auto transform rotate-2 mb-[-100px]">
                                <Quote size={40} className="text-[#1a1a1a]/20 mb-4" />
                                <p className="text-2xl italic leading-tight mb-4">
                                    "Orang yang tidak bisa menulis, tidak bisa berpikir. Dan orang yang tidak bisa berpikir, akan dikendalikan oleh orang lain."
                                </p>
                                <span className="font-sans text-xs tracking-widest uppercase">— George Orwell</span>
                            </div>

                            <ParallaxImage
                                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2670&auto=format&fit=crop"
                                alt="Library"
                                className="w-full aspect-[4/5] md:w-[80%] z-0 grayscale contrast-125"
                            />

                            <div className="absolute bottom-20 left-[-50px] bg-[#1a1a1a] text-[#f4f1ea] p-8 max-w-xs shadow-2xl transform -rotate-3 z-20 hidden md:block">
                                <span className="font-sans text-xs tracking-widest uppercase mb-2 block text-[#f4f1ea]/60">Aktivitas Rutin</span>
                                <h3 className="text-2xl font-medium mb-4">Bedah Buku & Diskusi Filosofis</h3>
                                <div className="h-[1px] w-full bg-[#f4f1ea]/20 mb-4"></div>
                                <p className="font-sans text-sm text-[#f4f1ea]/80">Setiap Jumat malam. Membahas Camus, Nietzsche, hingga Sastra Indonesia modern.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bagian Pameran / Karya */}
                <section className="py-32 px-6 md:px-20 bg-[#1a1a1a] text-[#f4f1ea]">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[#f4f1ea]/20 pb-8">
                        <div>
                            <span className="font-sans text-xs tracking-[0.2em] uppercase mb-4 block text-[#f4f1ea]/60">Arsip Karya</span>
                            <h2 className="text-6xl md:text-8xl font-medium tracking-tight">Antologi</h2>
                        </div>
                        <div className="font-sans text-right hidden md:block">
                            <p className="text-sm text-[#f4f1ea]/60">Koleksi Terpilih</p>
                            <p className="text-xl">2024 — 2025</p>
                        </div>
                    </div>

                    <div className="space-y-32">
                        {writings.map((work, i) => (
                            <div key={i} className="group flex flex-col md:flex-row gap-12 items-center">
                                <div className={`w-full md:w-1/2 overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                                    <div className="relative overflow-hidden aspect-[4/3]">
                                        <img
                                            src={work.image}
                                            alt={work.title}
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                </div>
                                <div className={`w-full md:w-1/2 ${i % 2 === 1 ? 'md:text-right md:order-1' : ''}`}>
                                    <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#f4f1ea]/60 mb-4 block">{work.category}</span>
                                    <h3 className="text-5xl md:text-7xl mb-6 leading-[0.9] group-hover:italic transition-all duration-500">{work.title}</h3>
                                    <p className={`font-sans text-[#f4f1ea]/70 text-lg leading-relaxed mb-8 max-w-md ${i % 2 === 1 ? 'ml-auto' : ''}`}>
                                        {work.excerpt}
                                    </p>
                                    <div className={`flex items-center gap-4 ${i % 2 === 1 ? 'justify-end' : ''}`}>
                                        <div className="w-12 h-[1px] bg-[#f4f1ea]/40"></div>
                                        <span className="font-sans text-sm uppercase tracking-widest">{work.author}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-32 px-6 md:px-20 bg-[#f4f1ea] text-center">
                    <div className="max-w-3xl mx-auto">
                        <Feather size={64} className="mx-auto mb-12 text-[#1a1a1a]" strokeWidth={1} />
                        <h2 className="text-5xl md:text-7xl mb-8 leading-tight">
                            Bergabunglah dengan<br />
                            <span className="italic font-light">Kaum Berpikir.</span>
                        </h2>
                        <p className="font-sans text-lg text-[#1a1a1a]/70 mb-12 max-w-xl mx-auto">
                            Jangan biarkan idemu mati dalam diam. Mari berdialektika, mengkritik, dan menulis sejarah baru bersama kami.
                        </p>
                        <button className="group relative px-10 py-5 bg-[#1a1a1a] text-[#f4f1ea] font-sans text-sm uppercase tracking-[0.2em] overflow-hidden">
                            <span className="relative z-10 flex items-center gap-4 group-hover:gap-6 transition-all">
                                Mulai Menulis <ArrowLeft className="rotate-180" size={16} />
                            </span>
                            <div className="absolute inset-0 bg-[#333] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]"></div>
                        </button>
                    </div>

                    <div className="mt-32 pt-8 border-t border-[#1a1a1a]/10 flex justify-between items-center font-sans text-xs tracking-widest uppercase text-[#1a1a1a]/40">
                        <span>© 2025 O.C Karya Tulis</span>
                        <span>Jakarta, Indonesia</span>
                    </div>
                </footer>
            </div>
        </SmoothScroll>
    );
};
