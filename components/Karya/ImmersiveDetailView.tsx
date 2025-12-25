import React, { useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { ChevronUp, Heart, MessageCircle, Share2, X, Maximize2, User } from 'lucide-react';

interface ImmersiveDetailViewProps {
    art: any; // Using any for now to match Artwork type flexibility, ideally strictly typed
    onClose: () => void;
    renderContent: (art: any) => React.ReactNode;
}

export const ImmersiveDetailView: React.FC<ImmersiveDetailViewProps> = ({ art, onClose, renderContent }) => {
    const controls = useAnimation();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.y < -100) {
            // Dragged up enough
            setIsExpanded(true);
            controls.start({ y: 0 }); // Snap to top (relative to container logic)
        } else if (info.offset.y > 100 && isExpanded) {
            // Dragged down enough
            setIsExpanded(false);
            controls.start({ y: "calc(100% - 180px)" }); // Snap back to peek
        } else {
            // Snap back to current state
            controls.start({ y: isExpanded ? 0 : "calc(100% - 180px)" });
        }
    };

    // Toggle expansion on click if not dragging
    const toggleExpand = () => {
        const target = !isExpanded;
        setIsExpanded(target);
        controls.start({ y: target ? 0 : "calc(100% - 180px)" });
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col overflow-hidden">
            {/* 1. MEDIA LAYER (FULLSCREEN) */}
            <div
                className="absolute inset-0 z-0 flex items-center justify-center bg-[#050505]"
                style={{ height: 'calc(100% - 180px)' }} // Logically visual area, but actual content is fullscreen
            >
                {/* 
                   Prevent touch actions on the content to allow easier swiping/scrolling of the parent 
                   if needed, but usually we want interaction. 
                   For 'Immersive', content is king.
               */}
                <div className="w-full h-full relative" style={{ touchAction: 'none', overscrollBehavior: 'contain' }}>
                    {renderContent(art)}
                </div>

                {/* Top Bar Floating */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
                    <button
                        onClick={onClose}
                        className="pointer-events-auto p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white/20"
                    >
                        <X size={24} />
                    </button>
                    {/* Add more top controls if needed */}
                </div>
            </div>

            {/* 2. DRAGGABLE SHEET LAYER */}
            <motion.div
                initial={{ y: "calc(100% - 180px)" }} // Start peek
                animate={controls}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }} // Constraints handled by logic + elasticity
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="absolute inset-x-0 bottom-0 z-20 bg-[#111] rounded-t-[2rem] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] h-[85vh] flex flex-col"
            >
                {/* Drag Handle Area */}
                <div
                    onClick={toggleExpand}
                    className="w-full pt-4 pb-2 flex flex-col items-center justify-center cursor-pointer bg-[#111] rounded-t-[2rem]"
                >
                    <div className="w-12 h-1.5 bg-white/20 rounded-full mb-2" />
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto px-6 pb-20 custom-scrollbar">
                    {/* Header (Always Visible in Peek) */}
                    <div className="mb-6" onClick={isExpanded ? undefined : toggleExpand}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-xs font-bold">
                                {art.author?.[0] || 'A'}
                            </div>
                            <span className="font-bold text-sm tracking-wide text-gray-300">
                                @{art.author || 'Anonymous'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-serif font-bold leading-tight mb-2">
                            {art.title}
                        </h2>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 mt-4">
                            <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-rose-500 transition-colors">
                                <div className="p-2 bg-white/5 rounded-full"><Heart size={20} /></div>
                                <span className="text-xs">{typeof art.likes === 'object' ? (art.likes?.[0]?.count || 0) : (art.likes || 0)}</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                                <div className="p-2 bg-white/5 rounded-full"><MessageCircle size={20} /></div>
                                <span className="text-xs">{typeof art.comments === 'object' ? (art.comments?.[0]?.count || 0) : (art.comments || 0)}</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-green-500 transition-colors">
                                <div className="p-2 bg-white/5 rounded-full"><Share2 size={20} /></div>
                                <span className="text-xs">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Expanded Details */}
                    <div className={`space-y-6 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-50 blur-sm'}`}>
                        {/* Description */}
                        <div className="prose prose-invert prose-sm max-w-none">
                            <p className="text-gray-300 leading-relaxed">
                                {art.description || "Tidak ada deskripsi untuk karya ini."}
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {art.tags?.map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-gray-400">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/10 my-4" />

                        {/* Comments Placeholder */}
                        <div>
                            <h3 className="font-bold text-sm mb-4 text-gray-400 uppercase tracking-wider">Komentar</h3>
                            <div className="text-center py-8 text-gray-600 italic text-sm">
                                Feature komentar akan segera hadir.
                            </div>
                        </div>

                        {/* Extra padding for bottom safe area */}
                        <div className="h-10" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
