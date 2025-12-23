import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Zap, Heart, Camera, MessageSquare } from 'lucide-react';

export const Meme = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500 selection:text-white overflow-x-hidden">
            {/* Load Fonts */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=VT323&family=Anton&display=swap');
          
          .font-pixel { font-family: 'VT323', monospace; }
          .font-meme { font-family: 'Anton', sans-serif; letter-spacing: 1px; }
          
          .retro-shadow {
            box-shadow: 8px 8px 0px rgba(255, 255, 255, 0.1);
          }

          .hover-lift {
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .hover-lift:hover {
            transform: translateY(-5px) rotate(1deg);
          }

          .gradient-text {
            background: linear-gradient(to bottom, #ffffff 0%, #a1a1aa 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
            </style>

            {/* Main Container with Dynamic Island Fix */}
            <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-20 relative z-20">

                {/* Simple Navigation */}
                <div className="mb-16">
                    <Link
                        to="/info"
                        className="inline-flex items-center gap-2 font-pixel text-2xl text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span>KEMBALI KE INFO</span>
                    </Link>
                </div>

                {/* Hero Section - Clean & High Impact */}
                <div className="mb-20 text-center">
                    <div className="inline-block relative mb-8 group">
                        <div className="absolute inset-0 bg-rose-500 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <img
                            src="/logo-oc-meme.jpg"
                            alt="Logo Divisi Meme"
                            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-2 border-zinc-800 relative z-10 group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    <h1 className="text-7xl md:text-9xl font-meme uppercase leading-none mb-4 gradient-text">
                        DIVISI MEME
                    </h1>

                    <p className="font-pixel text-2xl md:text-3xl text-zinc-500 max-w-2xl mx-auto leading-tight italic">
                        Tawa adalah bahasa universal kreativitas.
                        Kami mengubah piksel menjadi kultur.
                    </p>
                </div>

                {/* Content Section - Simplified Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

                    {/* Identity Card */}
                    <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 p-10 rounded-2xl hover-lift">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-rose-500/20 p-3 rounded-xl">
                                <Heart className="text-rose-500 w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-meme uppercase">Identitas</h2>
                        </div>
                        <p className="font-pixel text-2xl text-zinc-400 leading-relaxed">
                            Bukan sekadar hiburan, tapi refleksi kreatif dari kejadian
                            sehari-hari yang dikemas dengan cerdas dan relatable.
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 p-10 rounded-2xl hover-lift">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-yellow-500/20 p-3 rounded-xl">
                                <Zap className="text-yellow-500 w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-meme uppercase">Misi Kami</h2>
                        </div>
                        <p className="font-pixel text-2xl text-zinc-400 leading-relaxed">
                            Membangun jembatan tawa antara kreator dan audiens,
                            satu meme di satu waktu.
                        </p>
                    </div>
                </div>

                {/* Information Table - Clean Typography */}
                <div className="mb-20">
                    <h2 className="text-5xl font-meme mb-10 text-center underline decoration-zinc-800 underline-offset-8">PROGRAM & KEGIATAN</h2>

                    <div className="space-y-6">
                        {[
                            { icon: Camera, title: "PRODUKSI KONTEN", desc: "Feeds harian di Instagram & TikTok." },
                            { icon: MessageSquare, title: "KOLABORASI", desc: "Bekerjasama lintas divisi untuk event spesial." },
                            { icon: Zap, title: "RISET TREN", desc: "Menganalisis humor digital terkini." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-6 group">
                                <div className="text-zinc-600 group-hover:text-white transition-colors pt-1">
                                    <item.icon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-meme group-hover:text-rose-500 transition-colors uppercase">{item.title}</h3>
                                    <p className="font-pixel text-xl text-zinc-500 uppercase tracking-widest">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action - Massive & Simple */}
                <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-12 md:p-20 text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-yellow-500 to-purple-500"></div>

                    <h2 className="text-5xl md:text-7xl font-meme mb-8 uppercase leading-tight">
                        LIHAT KARYA KAMI
                        <br />
                        <span className="text-rose-500">@OCEDISIMEME.ID</span>
                    </h2>

                    <a
                        href="https://www.instagram.com/ocedisimeme.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-white text-black font-meme text-3xl px-12 py-5 rounded-full hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-2xl"
                    >
                        <Share2 className="w-8 h-8" />
                        DUKUNG KAMI
                    </a>
                </div>

                {/* Minimal Footer */}
                <footer className="mt-20 text-center">
                    <p className="font-pixel text-zinc-700 text-xl tracking-widest uppercase">
                        © 2025 OURCREATIVITY / DIVISI MEME / BEYOND THE PIXEL
                    </p>
                </footer>

            </div>
        </div>
    );
};
