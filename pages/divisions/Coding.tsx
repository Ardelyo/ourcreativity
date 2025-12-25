import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Globe, Share2, Layers, GitBranch, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MatrixRain, GlitchText } from '../../components/effects';

// Data proyek
const projects = [
    { title: "Proyek: NEBULA", category: "Web App", status: "Deployed", desc: "Platform komunitas next-gen dengan arsitektur mikroservis React & Node.js yang skalabel.", id: "0X4F2A", tech: ["React", "Node.js", "GraphQL"] },
    { title: "CyberGuard", category: "Keamanan", status: "Aktif", desc: "Scanner kerentanan otomatis untuk jaringan lokal dengan pelaporan realtime.", id: "0X9B7C", tech: ["Python", "Rust", "Kali"] },
    { title: "AlgoVisualizer", category: "Edukasi", status: "Beta", desc: "Visualisasi algoritma sorting interaktif untuk pembelajaran struktur data.", id: "0X1E3D", tech: ["TypeScript", "Canvas API"] },
    { title: "Bot: Sentinel", category: "Otomasi", status: "Online", desc: "Bot moderasi Discord dengan kapabilitas AI untuk deteksi spam dan toxicity.", id: "0X5C8F", tech: ["Discord.js", "OpenAI API"] },
];

// Data statistik
const stats = [
    { label: "Baris Kode", value: "150K+", icon: Code },
    { label: "Proyek Aktif", value: "24", icon: Layers },
    { label: "Kontributor", value: "50+", icon: Globe },
    { label: "Waktu Aktif", value: "99.9%", icon: Server },
];

// Data langkah kolaborasi
const collaborationSteps = [
    { step: "01", title: "Inisiasi", desc: "Buat konsep, tulis kode awal, atau rekam demo proyekmu.", icon: Code },
    { step: "02", title: "Publikasi", desc: "Upload ke repo atau media sosial dengan tagar komunitas.", icon: Share2 },
    { step: "03", title: "Sinergi", desc: "Undang kolaborator untuk review, refactor, dan scale-up.", icon: GitBranch },
];

// Data skill areas
const skillAreas = [
    { label: "Web Development", color: "text-blue-400" },
    { label: "Data Science", color: "text-pink-400" },
    { label: "Cybersecurity", color: "text-red-400" },
    { label: "Game Dev", color: "text-purple-400" }
];

export const Coding = () => {
    return (
        <div className="min-h-screen bg-[#020202] text-gray-300 font-sans selection:bg-green-500/30 overflow-x-hidden">
            <MatrixRain />

            {/* Navigasi Tetap */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#020202]/80 backdrop-blur-md border-b border-white/5">
                <Link to="/info" className="flex items-center text-gray-400 hover:text-green-500 transition-colors group">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-mono font-bold tracking-widest">CD ..</span>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-mono text-green-500">SISTEM_AKTIF</span>
                </div>
            </nav>

            {/* SEKSI 1: HERO */}
            <section className="min-h-dvh flex flex-col items-center justify-center relative px-6 py-20">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/50 to-[#020202] pointer-events-none z-0"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10 text-center max-w-4xl"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-8 relative inline-block"
                    >
                        <div className="absolute inset-0 bg-green-500/20 blur-[50px] rounded-full"></div>
                        <img src="/logo-oc-coding.jpg" alt="OC Coding Logo" className="w-24 h-24 md:w-32 md:h-32 mx-auto relative z-10 rounded-full object-cover border-2 border-green-500/50" />
                    </motion.div>

                    <h1 className="text-4xl md:text-8xl font-bold tracking-tighter text-white mb-6 font-mono">
                        <GlitchText text="O.C. CODING" />
                    </h1>

                    <p className="text-lg md:text-2xl text-green-500 font-mono mb-4 tracking-widest uppercase">
                        Beradaptasi <span className="text-gray-500">atau</span> Mati.
                    </p>

                    <p className="text-xs font-mono text-green-500/60 mb-8 tracking-widest uppercase">
                        Instagram: @oc.edisicoding
                    </p>

                    <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                        Divisi elit untuk arsitek digital, insinyur perangkat lunak, dan pemecah masalah.
                        Kami membangun masa depan, satu baris kode pada satu waktu.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">Gulir untuk Memulai</span>
                    <div className="w-px h-12 bg-gradient-to-b from-green-500/50 to-transparent"></div>
                </motion.div>
            </section>

            {/* SEKSI 2: ABOUT / PHILOSOPHY */}
            <section className="py-16 md:py-24 px-6 md:px-20 relative bg-[#030303] border-t border-white/5">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 font-mono">
                            <span className="text-green-500">const</span> mission = <span className="text-yellow-500">"INNOVATE"</span>;
                        </h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed font-light text-sm md:text-base">
                            <p>
                                Di O.C. Coding, kami tidak sekadar menulis kode; kami merancang solusi.
                                Dari pengembangan web full-stack hingga eksperimen AI, kami menyediakan
                                ekosistem bagi para developer untuk tumbuh melampaui batas kurikulum standar.
                            </p>
                            <p>
                                Kami percaya pada prinsip <span className="text-white font-medium">Open Source</span>,
                                <span className="text-white font-medium">Clean Code</span>, dan
                                <span className="text-white font-medium">Continuous Learning</span>.
                            </p>
                            <ul className="grid grid-cols-2 gap-4 pt-4 mt-6 border-t border-white/5">
                                {skillAreas.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 font-mono text-xs md:text-sm">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-current ${item.color}`}></span>
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-green-500/5 blur-2xl rounded-lg"></div>
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 font-mono text-xs md:text-sm text-gray-400 shadow-2xl relative z-10 overflow-x-auto">
                            <div className="flex gap-2 mb-4 border-b border-white/5 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="space-y-2">
                                <p><span className="text-purple-400">class</span> <span className="text-yellow-400">Developer</span> <span className="text-white">{`{`}</span></p>
                                <p className="pl-4"><span className="text-purple-400">constructor</span>() <span className="text-white">{`{`}</span></p>
                                <p className="pl-8"><span className="text-blue-400">this</span>.passion = <span className="text-green-400">true</span>;</p>
                                <p className="pl-8"><span className="text-blue-400">this</span>.coffee = <span className="text-orange-400">Infinity</span>;</p>
                                <p className="pl-8"><span className="text-blue-400">this</span>.bugs = <span className="text-red-400">0</span>; <span className="text-gray-600">// Hopefully</span></p>
                                <p className="pl-4"><span className="text-white">{`}`}</span></p>
                                <p className="pl-4"><span className="text-yellow-400">code</span>() <span className="text-white">{`{`}</span></p>
                                <p className="pl-8"><span className="text-blue-400">while</span>(<span className="text-green-400">alive</span>) <span className="text-white">{`{`}</span></p>
                                <p className="pl-12">eat();</p>
                                <p className="pl-12">sleep();</p>
                                <p className="pl-12">code();</p>
                                <p className="pl-12">repeat();</p>
                                <p className="pl-8"><span className="text-white">{`}`}</span></p>
                                <p className="pl-4"><span className="text-white">{`}`}</span></p>
                                <p><span className="text-white">{`}`}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEKSI 3: ALUR KOLABORASI */}
            <section className="py-24 px-6 md:px-20 relative bg-[#020202]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">ALUR KOLABORASI</h2>
                        <div className="w-20 h-1 bg-green-500 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {collaborationSteps.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-[#080808] border border-white/5 p-8 rounded-sm hover:border-green-500/50 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <item.icon size={64} />
                                </div>
                                <div className="text-5xl font-black text-white/5 mb-6 group-hover:text-green-500/20 transition-colors">{item.step}</div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-500 transition-colors">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEKSI 4: PROJECTS */}
            <section className="py-24 px-6 md:px-20 bg-[#030303] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
                                <span className="text-green-500">git</span> log --oneline
                            </h2>
                            <p className="text-gray-500 text-sm">Proyek unggulan yang dikembangkan oleh anggota.</p>
                        </div>
                        <button className="text-sm font-mono text-green-500 hover:text-white transition-colors flex items-center gap-2 border-b border-green-500/30 pb-1">
                            LIHAT SEMUA REPOSITORY <ArrowLeft className="rotate-180" size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group bg-[#080808] border border-white/5 rounded-sm p-8 hover:border-green-500/50 transition-all duration-300 flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-mono text-green-500/70 border border-green-500/20 px-2 py-0.5 rounded inline-block mb-2">
                                            {project.id}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-green-500 transition-colors">{project.title}</h3>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${project.status === 'Deployed' || project.status === 'Online' || project.status === 'Aktif' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`}></div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{project.desc}</p>

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((t, idx) => (
                                            <span key={idx} className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors uppercase tracking-wider">{project.category}</span>
                                        <div className="flex items-center gap-1 text-xs font-mono text-green-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <span>&lt;source /&gt;</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEKSI 5: STATS FOOTER */}
            <section className="py-20 px-6 border-t border-green-500/10 bg-[#010101] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <stat.icon size={20} className="mx-auto text-gray-600 mb-2" />
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs font-mono text-green-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-20 text-gray-600 text-xs font-mono">
                    <p>SESI TERMINAL AKTIF // ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                </div>
            </section>
        </div>
    );
};
