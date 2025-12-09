import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section className="flex flex-col items-center justify-center text-center mt-16 md:mt-32 relative">

            {/* Lencana Editorial */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <div className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">Komunitas Terbuka</span>
                </div>
            </motion.div>

            {/* Judul Utama - Pelacakan Ketat & Kontras Tinggi */}
            <motion.h1
                // Optimasi LCP: Mulai terlihat, animasikan dari keadaan yang sedikit berbeda atau gunakan animasi tata letak
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] md:leading-[0.85] tracking-tight mb-8"
            >
                <span className="block text-white mix-blend-difference">Merangkai</span>
                <span className="block relative">
                    {/* Garis bawah/sorotan gradien halus */}
                    <span className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-emerald-500/20 blur-xl opacity-50"></span>
                    <span className="relative italic bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 pr-2">
                        Imajinasi
                    </span>
                    <span className="text-white">Kita.</span>
                </span>
            </motion.h1>

            {/* Subteks - Keterbacaan lebih baik */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light tracking-wide"
            >
                Sebuah ruang kolaborasi tanpa sekat. Kami memadukan <span className="text-white font-medium">seni</span>, <span className="text-white font-medium">teknologi</span>,
                dan <span className="text-white font-medium">cerita</span> dalam satu spektrum.
            </motion.p>

            {/* Tombol - Glassmorphism Modern */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center gap-4"
            >
                <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-sm overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                    <span className="relative z-10 flex items-center gap-2">
                        Mulai Jelajahi <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>

                <button className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm text-white rounded-full font-medium text-sm hover:bg-white/10 transition-all flex items-center gap-3">
                    <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    Tonton Reel
                </button>
            </motion.div>
        </section>
    );
};