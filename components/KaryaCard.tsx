import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Play, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motionConfig } from '../lib/motion';

// Helper buat bikin URL pratinjau kode
const generatePreviewUrl = (content: any, language: string) => {
    // Cek dulu apa kontennya objek JSON atau array
    let processedContent = content;
    if (typeof content !== 'string') {
        processedContent = JSON.stringify(content);
    }

    // Bungkus ke struktur HTML pelan-pelan
    const html = `<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #fff; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
</style>
</head>
<body>
<div id="app"></div>
<script>
    // Penanganan error tipis-tipis
    window.onerror = function(msg) { document.body.innerHTML = '<div style="color:red">'+msg+'</div>'; };
    try {
        ${language === 'p5' || language === 'p5js' ? '/* p5 logic handled in main */' : ''}
    } catch(e) {}
</script>
</body>
</html>`;

    // Sementara pake pendekatan URI data aja biar gak berat.
    // Idealnya pake logika generator yang sama kayak di Karya.tsx.
    // Kita asumsikan parent ngasih URL pratinjau yang valid atau render konten langsung.
    return '';
};


interface KaryaCardProps {
    art: any;
    index: number;
    onClick: () => void;
    renderContent: (art: any) => React.ReactNode;
}

// Map Divisi ke Bahasa Indonesia
const DIVISION_LABELS: Record<string, string> = {
    all: 'Semua',
    graphics: 'Grafis',
    video: 'Video',
    writing: 'Tulisan',
    coding: 'Coding',
    meme: 'Meme'
};

export const KaryaCard: React.FC<KaryaCardProps> = ({ art, index, onClick, renderContent }) => {
    return (
        <motion.div
            layoutId={`card-${art.id}`}
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, transition: { duration: motionConfig.durations.fast } }}
            whileTap={{ scale: 0.98 }}
            transition={{ ...motionConfig.springs.smooth, delay: (index % 10) * motionConfig.stagger.fast }}
            className="break-inside-avoid group relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer bg-[#0a0a0a] shadow-2xl hover:shadow-rose-500/20 transition-all border border-white/5"
        >
            {/* Area Konten Utama - Aspek Rasio Standar biar Gridnya gak berantakan */}
            <div className="relative w-full aspect-[4/5] md:aspect-[3/4]">
                <div className="w-full h-full overflow-hidden">
                    {renderContent(art)}
                </div>

                {/* Mobile: Gradasi muncul terus, Desktop: Muncul pas hover aja */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 md:p-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">

                    {/* Meta Info - Animated lift */}
                    <div className="flex justify-between items-end mb-4 transform md:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="flex-1 mr-3">
                            <h3 className="text-white font-bold text-base md:text-xl leading-tight line-clamp-2 mb-1 drop-shadow-lg">{art.title}</h3>
                            <p className="text-[11px] md:text-xs text-gray-400 line-clamp-1 font-medium italic opacity-80">{art.description || 'No description'}</p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            {art.slides && art.slides.length > 1 && (
                                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-2.5 py-1 rounded-full text-white text-[10px] md:text-xs font-bold ring-1 ring-white/10">
                                    <Layers size={12} className="text-white/80" />
                                    {art.slides.length}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 bg-rose-500/10 backdrop-blur-xl px-2.5 py-1 rounded-full text-rose-400 text-[10px] md:text-xs font-bold ring-1 ring-rose-500/20">
                                <Heart size={12} className="fill-rose-500 text-rose-500" />
                                {art.likes?.[0]?.count || 0}
                            </div>
                        </div>
                    </div>

                    {/* Penulis & Divisi */}
                    <div className="flex items-center justify-between transform md:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500 delay-100 ease-out">
                        <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                            <Link to={`/profile/${art.author_profile?.username || art.author}`} className="flex items-center gap-2.5 hover:opacity-100 group/author">
                                <div className="w-7 h-7 rounded-full bg-gray-800 overflow-hidden ring-2 ring-white/10 group-hover/author:ring-rose-500/50 transition-all">
                                    <img
                                        src={art.author_profile?.avatar_url || (art.author ? `https://ui-avatars.com/api/?name=${art.author}&background=random` : '/default-avatar.png')}
                                        alt="Avatar"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-xs md:text-sm text-gray-200 font-bold group-hover/author:text-white transition-colors">{art.author_profile?.username || art.author}</span>
                            </Link>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            {DIVISION_LABELS[art.division] || art.division}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
