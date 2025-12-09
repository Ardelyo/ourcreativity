import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowLeft, Code, Cpu, Globe, Database, Lock, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
    { title: "Proyek: NEBULA", category: "Web App", status: "Deployed", desc: "Platform komunitas next-gen dengan React & Node.js" },
    { title: "CyberGuard", category: "Keamanan", status: "Aktif", desc: "Scanner kerentanan otomatis untuk jaringan lokal" },
    { title: "AlgoVisualizer", category: "Edukasi", status: "Beta", desc: "Visualisasi algoritma sorting interaktif" },
    { title: "Bot: Sentinel", category: "Otomasi", status: "Online", desc: "Bot moderasi Discord dengan kapabilitas AI" },
];

export const Coding = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <div
            ref={containerRef}
            onWheel={handleWheel}
            className="h-screen w-screen overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory bg-[#020202] text-green-500 font-mono scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {/* Latar Belakang Tetap - Efek Hujan Matrix (Disimulasikan) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20 animate-pulse"></div>
            </div>

            {/* Navigasi Tetap */}
            <div className="fixed top-8 left-8 z-50">
                <Link to="/info" className="inline-flex items-center text-green-500 hover:text-green-400 transition-colors group bg-black/80 px-4 py-2 border border-green-500/30 rounded-sm">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">cd ..</span>
                </Link>
            </div>

            {/* BAGIAN 1: BOOT TERMINAL */}
            <section className="min-w-screen w-screen h-screen snap-start flex items-center justify-center shrink-0 relative px-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl w-full"
                >
                    <div className="mb-8 text-sm opacity-50">
                        <p>Initializing system...</p>
                        <p>Loading modules... [OK]</p>
                        <p>Connecting to neural network... [ESTABLISHED]</p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-8 py-4 mb-8">
                        <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tighter text-white">
                            SOFTWARE <br />
                            <span className="text-green-500">ENGINEERING</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 text-xl animate-pulse">
                        <span className="text-green-500">$</span>
                        <span className="text-white">./execute_portfolio.sh</span>
                        <span className="w-3 h-6 bg-green-500 block"></span>
                    </div>
                </motion.div>
            </section>

            {/* BAGIAN 2: PIPA (Proyek) */}
            <section className="min-w-screen w-auto h-screen snap-start flex items-center px-20 shrink-0 bg-[#050505] gap-12 border-l border-green-500/20">
                <div className="w-80 shrink-0">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        <span className="text-green-500">git</span> log
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Commit history and deployed artifacts.
                    </p>
                </div>

                {/* Garis Koneksi */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-green-500/20 -z-10"></div>

                {projects.map((project, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-[400px] h-[50vh] shrink-0 bg-[#0a0a0a] border border-green-500/30 p-6 flex flex-col relative group hover:border-green-500 transition-colors"
                    >
                        {/* Titik Node */}
                        <div className="absolute top-1/2 -left-[3.25rem] w-4 h-4 bg-black border-2 border-green-500 rounded-full z-10 group-hover:bg-green-500 transition-colors"></div>

                        <div className="flex justify-between items-start mb-6 border-b border-green-500/20 pb-4">
                            <span className="text-xs text-gray-500 font-bold">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            <span className={`text-xs px-2 py-1 rounded-sm ${project.status === 'Deployed' || project.status === 'Online' || project.status === 'Aktif' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {project.status}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                            {project.title}
                        </h3>
                        <span className="text-xs text-green-500 mb-4 block">[{project.category}]</span>

                        <p className="text-gray-400 text-sm leading-relaxed mb-auto">
                            {project.desc}
                        </p>

                        <div className="mt-6 pt-4 border-t border-green-500/10 flex items-center gap-2 text-xs text-gray-500 font-bold cursor-pointer hover:text-green-500">
                            <Code size={14} /> VIEW SOURCE
                        </div>
                    </motion.div>
                ))}

                <div className="w-40 shrink-0"></div>
            </section>

            {/* BAGIAN 3: STATISTIK SISTEM */}
            <section className="min-w-screen w-screen h-screen snap-start flex items-center justify-center shrink-0 bg-[#000] relative overflow-hidden">
                {/* Latar Belakang Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0_1px,transparent_1px),linear-gradient(to_bottom,#0f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>

                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {[
                        { icon: Code, label: "Bahasa", value: "POLYGLOT" },
                        { icon: Cpu, label: "Performa", value: "OPTIMAL" },
                        { icon: Globe, label: "Skala", value: "GLOBAL" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#050505] border border-green-500/30 p-8 text-center hover:bg-green-500/10 transition-colors"
                        >
                            <stat.icon className="mx-auto mb-6 text-green-500" size={48} />
                            <div className="text-4xl font-bold text-white mb-2 tracking-tighter">{stat.value}</div>
                            <div className="text-sm font-bold text-green-500/70 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};
