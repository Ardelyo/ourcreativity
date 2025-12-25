import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper for generating code preview URL
const generatePreviewUrl = (content: any, language: string) => {
    // Check if content is JSON object/array
    let processedContent = content;
    if (typeof content !== 'string') {
        processedContent = JSON.stringify(content);
    }

    // Wrap in HTML structure
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
    // Minimal error handling
    window.onerror = function(msg) { document.body.innerHTML = '<div style="color:red">'+msg+'</div>'; };
    try {
        ${language === 'p5' || language === 'p5js' ? '/* p5 logic handled in main */' : ''}
    } catch(e) {}
</script>
</body>
</html>`;

    // For now, simpler data URI approach if generating complex preview is too heavy here.
    // Ideally use the same generator logic as Karya.tsx or pass it down.
    // We will assume the parent passes a valid preview URL or render content directly.
    return '';
};


interface KaryaCardProps {
    art: any;
    index: number;
    onClick: () => void;
    renderContent: (art: any) => React.ReactNode;
}

export const KaryaCard: React.FC<KaryaCardProps> = ({ art, index, onClick, renderContent }) => {
    return (
        <motion.div
            layoutId={`card-${art.id}`}
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: (index % 10) * 0.05 }}
            className="break-inside-avoid group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden cursor-pointer bg-[#111] shadow-xl hover:shadow-2xl hover:shadow-rose-500/10 transition-all border border-white/5"
        >
            {/* Main Content Area - Standardized Aspect Ratio for Grid Stability */}
            <div className="relative w-full aspect-[4/5] md:aspect-[3/4]">
                <div className="w-full h-full overflow-hidden">
                    {renderContent(art)}
                </div>

                {/* Mobile: Gradient Always Visible, Desktop: Hover Only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">

                    {/* Title & Stats */}
                    <div className="flex justify-between items-end mb-3 transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex-1 mr-2">
                            <h3 className="text-white font-bold text-sm md:text-lg leading-tight line-clamp-2 mb-1">{art.title}</h3>
                            <p className="text-[10px] text-gray-400 line-clamp-1">{art.description || 'No description'}</p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-bold">
                                <Heart size={10} className="fill-rose-500 text-rose-500" />
                                {art.likes?.[0]?.count || 0}
                            </div>
                        </div>
                    </div>

                    {/* Author & Division */}
                    <div className="flex items-center justify-between transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link to={`/profile/${art.author}`} className="flex items-center gap-2 hover:opacity-80">
                                <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden ring-1 ring-white/20">
                                    <img src={`https://ui-avatars.com/api/?name=${art.author}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] md:text-xs text-white font-medium">{art.author}</span>
                            </Link>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            {art.division}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
