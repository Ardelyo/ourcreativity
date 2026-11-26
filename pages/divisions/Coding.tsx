import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Globe, Share2, Layers, GitBranch, Server, Database, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MatrixRain, GlitchText } from '../../components/effects';
import { useHaptic } from '../../hooks/useHaptic';

// Data proyek
const projects = [
    { title: "OurCreativity/ourcreativity", category: "Core Platform", status: "Aktif", desc: "Sistem pusat komunitas kreatif dengan arsitektur modern berorientasi performa.", id: "0XPROD", tech: ["React", "Supabase", "TypeScript", "TailwindCSS"], link: "https://github.com/OurCreativity/ourcreativity" },
    { title: "OurCreativity/atomic-model", category: "AI / ML", status: "Dev", desc: "Model Text Diffusion ringan untuk Bahasa Indonesia.", id: "0XAI", tech: ["Python", "PyTorch", "HuggingFace"], link: "https://github.com/OurCreativity/atomic-model" },
];

// Data statistik
const stats = [
    { label: "Repositories", value: "2+", icon: Code },
    { label: "Commits", value: "500+", icon: Layers },
    { label: "Members", value: "125", icon: Globe },
    { label: "Lisensi", value: "MIT", icon: Server },
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
    const playHaptic = useHaptic();

    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
            <MatrixRain />

            {/* Navigasi Tetap (Sticky) */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
                <Link to="/info" onClick={() => playHaptic('navigation')} className="flex items-center text-gray-400 hover:text-emerald-500 transition-colors group">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-mono font-bold tracking-widest hidden sm:inline">CD ..</span>
                </Link>
                <div className="flex items-center gap-3 md:gap-4">
                    <a href="https://github.com/OurCreativity" target="_blank" rel="noopener noreferrer" onClick={() => playHaptic('tap')} className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-gray-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-2 py-1 md:px-3 md:py-1.5 rounded bg-white/5 backdrop-blur-sm">
                        <Code size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden sm:inline">GitHub Org</span><span className="sm:hidden">GitHub</span>
                    </a>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                        <span className="hidden sm:inline text-xs font-mono text-emerald-500">SYSTEM_ONLINE</span>
                    </div>
                </div>
            </nav>

            {/* SEKSI 1: HERO */}
            <section className="min-h-dvh flex flex-col items-center justify-center relative px-6 py-20">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505] pointer-events-none z-0"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="z-10 text-center max-w-4xl"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotateX: 45 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 100 }}
                        className="mb-10 relative inline-block perspective-1000"
                    >
                        <div className="absolute inset-0 bg-emerald-500/30 blur-[60px] rounded-full"></div>
                        <img src="/logo-oc-coding.jpg" alt="OC Coding Logo" className="w-28 h-28 md:w-40 md:h-40 mx-auto relative z-10 rounded-full object-cover border-[3px] border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-white mb-4 md:mb-6 font-mono drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                        <GlitchText text="O.C. CODING" />
                    </h1>

                    <p className="text-base sm:text-xl md:text-3xl text-emerald-500 font-mono mb-6 md:mb-8 tracking-[0.2em] uppercase font-bold text-shadow-sm">
                        Adapt <span className="text-gray-600">or</span> Die.
                    </p>

                    <a
                        href="https://instagram.com/oc.edisicoding"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playHaptic('tap')}
                        className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-[10px] sm:text-xs font-mono text-emerald-400 mb-8 md:mb-10 tracking-[0.1em] uppercase hover:bg-emerald-500 hover:text-black transition-all duration-300 cursor-pointer rounded-sm"
                    >
                        CONNECT: @oc.edisicoding
                    </a>

                    <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-base md:text-lg font-light">
                        Divisi elit untuk arsitek digital, software engineers, dan problem solvers.
                        Kami membangun arsitektur masa depan komunitas, baris demi baris, fungsi demi fungsi.
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
            <section className="py-24 px-6 md:px-20 relative bg-[#080808] border-y border-white/5">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 font-mono">
                            <span className="text-emerald-500">const</span> mission = <span className="text-yellow-400">"ENGINEER_FUTURE"</span>;
                        </h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed font-light text-base">
                            <p>
                                Di O.C. Coding, kami tidak sekadar menulis skrip; kami mendesain ekosistem.
                                Dari pondasi platform <span className="text-emerald-400 font-mono">@OurCreativity</span> hingga arsitektur AI terapan.
                            </p>
                            <p>
                                Komitmen kami berakar pada prinsip
                                <span className="text-white font-medium mx-1 border-b border-emerald-500/50">Open Source</span>,
                                <span className="text-white font-medium mx-1 border-b border-emerald-500/50">Clean Architecture</span>, dan
                                <span className="text-white font-medium mx-1 border-b border-emerald-500/50">Scalability</span>.
                            </p>
                            <ul className="grid grid-cols-2 gap-4 pt-6 mt-8 border-t border-white/5">
                                {skillAreas.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-mono text-xs md:text-sm bg-white/5 p-3 rounded-sm border border-white/5 hover:border-emerald-500/30 transition-colors cursor-default">
                                        <span className={`w-2 h-2 rounded-sm bg-current ${item.color} shadow-[0_0_8px_currentColor]`}></span>
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-lg pointer-events-none"></div>
                        <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-4 sm:p-6 md:p-8 font-mono text-xs md:text-sm text-gray-400 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 overflow-x-auto transform hover:-translate-y-2 transition-transform duration-500 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] custom-scrollbar">
                            <div className="flex gap-2 mb-4 md:mb-6 border-b border-white/10 pb-4 min-w-[300px]">
                                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f56] shadow-sm"></div>
                                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#ffbd2e] shadow-sm"></div>
                                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27c93f] shadow-sm"></div>
                                <div className="ml-4 text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest flex items-center">developer.ts</div>
                            </div>
                            <div className="space-y-1.5 md:space-y-2 min-w-[300px]">
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
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SEKSI 3: ALUR KERJA KOLABORASI */}
            <section className="py-32 px-6 md:px-20 relative bg-[#050505] overflow-hidden">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">OPEN SOURCE</span> WORKFLOW
                        </motion.h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-transparent mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {collaborationSteps.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="bg-[#0a0a0a] border border-white/5 p-10 rounded-xl hover:border-emerald-500/40 hover:bg-[#0f0f0f] transition-all duration-300 group relative overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                            >
                                <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                                    <item.icon size={160} />
                                </div>
                                <div className="text-6xl font-black text-white/5 mb-8 group-hover:text-emerald-500/20 transition-colors duration-300 font-mono italic">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors flex items-center gap-3">
                                    <item.icon size={24} className="text-emerald-500" />
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.desc}</p>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/50 group-hover:via-emerald-500 group-hover:to-cyan-500/50 transition-all duration-500"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEKSI 4: PROJECTS */}
            <section className="py-32 px-6 md:px-20 bg-[#080808] border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-mono tracking-tight">
                                <span className="text-emerald-500 font-normal mr-4">$</span>
                                <span className="text-gray-300">gh</span> api orgs/OurCreativity/repos
                            </h2>
                            <p className="text-gray-500 text-base font-light border-l-2 border-emerald-500/30 pl-4 ml-2">Open Source Production-Ready Infrastructure.</p>
                        </motion.div>

                        <motion.a
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            href="https://github.com/OurCreativity"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playHaptic('tap')}
                            className="bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-white hover:text-emerald-400 px-4 py-2 md:px-6 md:py-3 rounded-lg font-mono text-xs md:text-sm transition-all flex items-center gap-2 md:gap-3 group backdrop-blur-sm w-full md:w-auto justify-center"
                        >
                            VIEW IN GITHUB
                            <ArrowLeft className="rotate-135 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rotate-[135deg]" size={14} />
                        </motion.a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="group bg-[#0c0c0c] border border-white/10 rounded-xl p-8 hover:border-emerald-500/40 transition-all duration-500 flex flex-col relative overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                            >
                                {/* Top Gradient Glow */}
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-700"></div>

                                <div className="flex justify-between items-start mb-6 align-top">
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded inline-flex items-center gap-2 uppercase tracking-widest">
                                            <Database size={10} /> {project.id}
                                        </div>
                                        <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors word-break break-all leading-tight pr-4">
                                            {project.title}
                                        </h3>
                                    </div>
                                    <div className="flex-shrink-0 pt-1">
                                        <div className={`w-3 h-3 rounded-full ${project.status === 'Deployed' || project.status === 'Online' || project.status === 'Aktif' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-yellow-500 shadow-[0_0_12px_#eab308]'}`}></div>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow font-light">{project.desc}</p>

                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((t, idx) => (
                                            <span key={idx} className="text-[11px] text-gray-300 font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-md group-hover:bg-white/10 transition-colors">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{project.category}</span>
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => playHaptic('tap')}
                                                className="flex items-center gap-1 sm:gap-2 text-[10px] md:text-sm font-mono text-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer hover:underline underline-offset-4"
                                            >
                                                <span>Visit Repo</span>
                                                <ExternalLink size={12} className="md:w-[14px] md:h-[14px]" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-20 md:mt-32 text-center p-8 sm:p-12 md:p-20 bg-[#0a0a0a] border border-white/5 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-8 tracking-tighter">SIAP BERKONTRIBUSI?</h2>
                        <p className="text-gray-400 max-w-xl mx-auto mb-8 md:mb-12 font-light text-sm md:text-base px-4">
                            Jadilah bagian dari tim elit yang mendesain masa depan arsitektur digital komunitas kami. No room for average.
                        </p>
                        <a
                            href="https://forms.gle/koA7J9giDqtokfBq7"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playHaptic('action')}
                            className="inline-flex items-center gap-3 md:gap-4 px-6 py-4 md:px-10 md:py-5 bg-emerald-500 text-black font-black uppercase tracking-widest text-sm md:text-lg lg:text-xl rounded-sm hover:-translate-y-1 active:translate-y-0 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.5)]"
                        >
                            <span className="text-center">JOIN THE ARCHITECTURE</span>
                            <Code size={20} className="md:w-[24px] md:h-[24px] hidden sm:block" />
                        </a>
                    </motion.div>
                </div>
            </section>
            {/* SEKSI 5: STATS FOOTER */}
            <section className="py-24 px-6 border-t border-emerald-500/20 bg-[#020202] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="space-y-4 group"
                        >
                            <div className="inline-flex p-4 rounded-full bg-white/5 border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-300">
                                <stat.icon size={28} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-white tracking-tight">{stat.value}</div>
                            <div className="text-xs font-mono text-emerald-500 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center mt-32 text-gray-600 text-[10px] font-mono tracking-widest uppercase">
                    <p className="flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"></span>
                        SESSION_ACTIVE // ID: {Math.random().toString(36).substr(2, 8).toUpperCase()} // ROOT ACCESS GRANTED
                    </p>
                </div>
            </section>
        </div>
    );
};
