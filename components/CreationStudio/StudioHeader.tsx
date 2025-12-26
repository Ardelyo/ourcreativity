import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Layout, Check, Settings, Save,
    Maximize2, Monitor, Play, Eye, ChevronDown, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MediumSelector } from './MediumSelector';
import { WorkType } from './types';

interface StudioHeaderProps {
    title: string;
    setTitle: (title: string) => void;
    mode: WorkType;
    onModeChange: (mode: WorkType) => void;
    draftStatus: 'saved' | 'saving' | 'idle';
    draftsCount: number;
    showDrafts: boolean;
    onToggleDrafts: () => void;
    onPublish: () => void;
    isPublishing: boolean;
    onSettings: () => void;
    onPreview: () => void;
    onBack: () => void;
    isMobile?: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
    title, setTitle, mode, onModeChange,
    draftStatus, draftsCount, showDrafts, onToggleDrafts,
    onPublish, isPublishing, onSettings, onPreview, onBack,
    isMobile = false
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // --- header mobile ---
    if (isMobile) {
        return (
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-40 px-3 py-2 bg-black/60 backdrop-blur-xl border-b border-white/5 pt-safe"
            >
                <div className="flex items-center justify-between">
                    {/* kiri: balik & draft */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onBack}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-gray-400 active:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={18} strokeWidth={1.5} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onToggleDrafts}
                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${showDrafts ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400'}`}
                        >
                            <Layout size={16} strokeWidth={1.5} />
                        </motion.button>
                    </div>

                    {/* tengah: judul (dipotong kalo panjang) */}
                    <div className="flex-1 mx-3 flex items-center justify-center gap-2">
                        {draftStatus !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1"
                            >
                                {draftStatus === 'saving' ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                ) : (
                                    <Check size={10} className="text-emerald-500" strokeWidth={3} />
                                )}
                            </motion.div>
                        )}
                        <span className="text-xs font-bold text-white truncate max-w-[140px]">
                            {title || 'Tanpa Judul'}
                        </span>
                    </div>

                    {/* kanan: kirim aja (action lain ada di dock) */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onPublish}
                        disabled={isPublishing}
                        className="h-8 px-4 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-transform disabled:opacity-50"
                    >
                        {isPublishing ? (
                            <div className="w-2.5 h-2.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                        Kirim
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-[60] h-20 group/studio-header pointer-events-none"
        >
            {/* Invisible Trigger Zone */}
            <div className="absolute inset-0 pointer-events-auto" />

            <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto transition-all duration-500 -translate-y-24 opacity-0 group-hover/studio-header:translate-y-4 group-hover/studio-header:opacity-100 px-4 md:px-6">

                {/* kiri: navigasi & draf */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white transition-all backdrop-blur-md border border-white/5 ring-1 ring-white/5 shadow-lg group"
                        title="Kembali ke Dashboard"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={onToggleDrafts}
                        className={`
                            h-10 px-4 rounded-full flex items-center gap-2 text-xs font-bold transition-all border backdrop-blur-md shadow-lg ring-1 ring-white/5
                            ${showDrafts
                                ? 'bg-rose-500 border-rose-500 text-white'
                                : 'bg-black/40 border-white/5 text-gray-400 hover:bg-black/60 hover:text-white'}
                        `}
                    >
                        <Layout size={16} />
                        <span className="hidden md:inline">DRAF</span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${showDrafts ? 'bg-white/20' : 'bg-white/10'}`}>
                            {draftsCount}
                        </div>
                    </button>
                </div>

                {/* tengah: judul & mode (keliatan di desktop) */}
                <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-4 md:top-6">
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="flex items-center justify-center gap-2 mb-1">
                            {draftStatus !== 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-500"
                                >
                                    {draftStatus === 'saving' ? (
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    ) : (
                                        <Check size={12} strokeWidth={3} />
                                    )}
                                    <span>{draftStatus === 'saving' ? 'Menyimpan...' : 'Tersimpan'}</span>
                                </motion.div>
                            )}
                        </div>

                        <div className="h-10 px-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-xl ring-1 ring-white/5 transition-all group-hover:bg-black/60 cursor-text min-w-[200px]">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Karya Tanpa Judul"
                                className="bg-transparent text-center text-sm font-bold text-white placeholder:text-gray-600 outline-none w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* kanan: aksi */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full border border-white/5 p-1 ring-1 ring-white/5 shadow-lg">
                        <button
                            onClick={onPreview}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Pratinjau"
                        >
                            <Eye size={16} strokeWidth={1.5} />
                        </button>
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <button
                            onClick={onSettings}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Pengaturan"
                        >
                            <Settings size={16} strokeWidth={1.5} />
                        </button>
                    </div>

                    <button
                        onClick={onPublish}
                        disabled={isPublishing}
                        className="h-10 pl-4 pr-5 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-white/5 ring-1 ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? (
                            <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                        PUBLIKASIKAN
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

