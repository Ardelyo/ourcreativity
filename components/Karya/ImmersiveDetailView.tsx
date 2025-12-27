import React, { useState, useEffect } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Heart, MessageCircle, Share2, X, Code, Play, Edit3, Trash2 } from 'lucide-react';



interface ImmersiveDetailViewProps {
    art: any;
    onClose: () => void;
    renderContent: (art: any, showCode?: boolean) => React.ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
    showCode?: boolean;
    setShowCode?: (show: boolean) => void;
}

export const ImmersiveDetailView: React.FC<ImmersiveDetailViewProps> = ({
    art, onClose, renderContent, onEdit, onDelete,
    showCode = false, setShowCode
}) => {
    const controls = useAnimation();
    const [isExpanded, setIsExpanded] = useState(false);

    // CRITICAL: Lock body scroll when this component mounts
    useEffect(() => {
        // Save original styles
        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalTouchAction = window.getComputedStyle(document.body).touchAction;

        // Lock scroll
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = originalStyle;
            document.body.style.touchAction = originalTouchAction;
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, []);

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.y < -80) {
            setIsExpanded(true);
            controls.start({ y: 0 });
        } else if (info.offset.y > 80 && isExpanded) {
            setIsExpanded(false);
            controls.start({ y: "calc(100% - 200px)" });
        } else {
            controls.start({ y: isExpanded ? 0 : "calc(100% - 200px)" });
        }
    };

    const toggleExpand = () => {
        const target = !isExpanded;
        setIsExpanded(target);
        controls.start({ y: target ? 0 : "calc(100% - 200px)" });
    };

    // Prevent touch events from propagating to background
    const handleTouchMove = (e: React.TouchEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black text-white flex flex-col"
            style={{ touchAction: 'none' }}
        >
            {/* 1. MEDIA LAYER (FULLSCREEN) */}
            <div
                className="absolute inset-0 z-0 flex items-center justify-center bg-[#050505]"
                style={{
                    height: 'calc(100% - 200px)',
                    touchAction: 'auto' // Allow touch INSIDE the content
                }}
                onTouchMove={handleTouchMove}
            >
                {/* Content Container - Allow all interactions */}
                <div
                    className="w-full h-full relative"
                    style={{
                        touchAction: 'auto',  // Allow pinch, zoom, scroll INSIDE
                        overscrollBehavior: 'contain'
                    }}
                >
                    {/* Content Logic */}
                    {renderContent(art, showCode)}
                </div>



                {/* Top Bar Floating */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/50 to-transparent z-50">
                    <button
                        onClick={onClose}
                        className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex gap-3">
                        {/* Edit/Delete Buttons (Mobile) */}
                        {(onEdit || onDelete) && (
                            <div className="flex gap-2">
                                {onEdit && (
                                    <button
                                        onClick={onEdit}
                                        className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform"
                                    >
                                        <Edit3 size={20} />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={onDelete}
                                        className="p-3 bg-rose-500/80 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Code Toggle Button - ALWAYS visible for code type */}
                        {art.type === 'code' && (
                            <button
                                onClick={() => setShowCode?.(!showCode)}
                                className="flex items-center gap-2 px-5 py-3 bg-black/50 backdrop-blur-md rounded-full text-white font-bold text-sm border border-white/30 active:scale-95 transition-transform"
                            >
                                {showCode ? (
                                    <><Play size={16} /> Preview</>
                                ) : (
                                    <><Code size={16} /> Lihat Kode</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. DRAGGABLE SHEET LAYER */}
            <motion.div
                initial={{ y: "calc(100% - 200px)" }}
                animate={controls}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                className="absolute inset-x-0 bottom-0 z-20 bg-[#111] rounded-t-[2rem] border-t border-white/10 shadow-[0_-10px_60px_rgba(0,0,0,0.9)] flex flex-col"
                style={{ height: '85vh' }}
            >
                {/* Drag Handle Area */}
                <div
                    onClick={toggleExpand}
                    className="w-full pt-4 pb-3 flex flex-col items-center justify-center cursor-pointer bg-[#111] rounded-t-[2rem] shrink-0"
                >
                    <div className="w-14 h-1.5 bg-white/30 rounded-full" />
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                        {isExpanded ? 'Geser ke bawah untuk tutup' : 'Geser ke atas untuk detail'}
                    </p>
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto px-6 pb-24">
                    {/* Header */}
                    <div className="mb-6" onClick={isExpanded ? undefined : toggleExpand}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-sm font-bold">
                                {art.author_profile?.avatar_url ? (
                                    <img src={art.author_profile.avatar_url} alt={art.author} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center">
                                        {art.author?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                )}
                            </div>
                            <span className="font-bold text-base text-white">
                                @{art.author || 'Anonymous'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-serif font-bold leading-tight mb-3">
                            {art.title}
                        </h2>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 mt-4">
                            <button className="flex flex-col items-center gap-1 text-gray-400 active:text-rose-500 transition-colors">
                                <div className="p-3 bg-white/5 rounded-full"><Heart size={22} /></div>
                                <span className="text-xs">{typeof art.likes === 'object' ? (art.likes?.[0]?.count || 0) : (art.likes || 0)}</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 text-gray-400 active:text-blue-500 transition-colors">
                                <div className="p-3 bg-white/5 rounded-full"><MessageCircle size={22} /></div>
                                <span className="text-xs">{typeof art.comments === 'object' ? (art.comments?.[0]?.count || 0) : (art.comments || 0)}</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 text-gray-400 active:text-green-500 transition-colors">
                                <div className="p-3 bg-white/5 rounded-full"><Share2 size={22} /></div>
                                <span className="text-xs">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Expanded Details */}
                    <div className={`space-y-6 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-40 blur-sm pointer-events-none'}`}>
                        {/* Description */}
                        <div className="prose prose-invert prose-sm max-w-none">
                            <p className="text-gray-300 leading-relaxed text-base">
                                {art.description || "Tidak ada deskripsi untuk karya ini."}
                            </p>
                        </div>

                        {/* Tags */}
                        {art.tags && art.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {art.tags.map((tag: string, i: number) => (
                                    <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Comments Section */}
                        <div>
                            <h3 className="font-bold text-sm mb-4 text-gray-400 uppercase tracking-wider">Komentar</h3>
                            <div className="text-center py-10 text-gray-600 italic text-sm bg-white/5 rounded-2xl border border-white/5">
                                Feature komentar akan segera hadir.
                            </div>
                        </div>

                        {/* Safe area padding */}
                        <div className="h-16" />
                    </div>
                </div>
            </motion.div>
        </div >
    );
};
