import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Image as ImageIcon, Video, Code, Laugh, FileText, Settings, Send, X, ChevronUp, Play, Maximize2, Eye, Globe } from 'lucide-react';
import { WorkType } from '../types';

interface MobileActionDockProps {
    mode: WorkType;
    onModeChange: (mode: WorkType) => void;
    onPublish: () => void;
    onSettings: () => void;
    onPreview: () => void;
    isCodeMode?: boolean;
}

const modeConfig: { id: WorkType; label: string; icon: any; color: string; bgColor: string }[] = [
    { id: 'text', label: 'Tulisan', icon: Type, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { id: 'image', label: 'Gambar', icon: ImageIcon, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'meme', label: 'Meme', icon: Laugh, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { id: 'video', label: 'Video', icon: Video, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { id: 'code', label: 'Kode', icon: Code, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { id: 'document', label: 'Dokumen', icon: FileText, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
    { id: 'embed', label: 'Embed', icon: Globe, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
];

export const MobileActionDock: React.FC<MobileActionDockProps> = ({
    mode,
    onModeChange,
    onPublish,
    onSettings,
    onPreview,
}) => {
    const [showModeSelector, setShowModeSelector] = useState(false);
    const currentMode = modeConfig.find(m => m.id === mode) || modeConfig[0];
    const CurrentIcon = currentMode.icon;
    const isCodeMode = mode === 'code';

    return (
        <>
            {/* MINIMAL FLOATING DOCK */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe flex items-center justify-center gap-2 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                {/* Mode Selector Button */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setShowModeSelector(true)}
                    className={`
                        w-12 h-12 rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10
                        flex items-center justify-center shadow-xl shadow-black/50
                        ${currentMode.color} active:bg-[#222] transition-colors
                    `}
                >
                    <CurrentIcon size={22} />
                </motion.button>

                {/* Preview/Run Button (Context-aware) */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onPreview}
                    className="w-12 h-12 rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-gray-400 active:text-white shadow-xl shadow-black/50 transition-colors"
                >
                    {isCodeMode ? <Play size={20} className="text-green-400" /> : <Eye size={20} />}
                </motion.button>

                {/* Settings Button */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onSettings}
                    className="w-12 h-12 rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-gray-400 active:text-white shadow-xl shadow-black/50 transition-colors"
                >
                    <Settings size={20} />
                </motion.button>
            </div>

            {/* MODE SELECTOR BOTTOM SHEET */}
            <AnimatePresence>
                {showModeSelector && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModeSelector(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 z-[70] bg-[#0a0a0a] rounded-t-[2rem] border-t border-white/10 p-5 pb-safe"
                        >
                            {/* Handle */}
                            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

                            {/* Title */}
                            <h3 className="text-base font-bold text-white mb-5 text-center font-serif">Pilih Jenis Konten</h3>

                            {/* Mode Grid */}
                            <div className="grid grid-cols-4 gap-2">
                                {modeConfig.map((m) => {
                                    const Icon = m.icon;
                                    const isActive = mode === m.id;
                                    return (
                                        <motion.button
                                            key={m.id}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                onModeChange(m.id);
                                                setShowModeSelector(false);
                                            }}
                                            className={`
                                                flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                                                ${isActive
                                                    ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                                                    : `${m.bgColor} text-gray-400 border-white/5 active:bg-white/10`
                                                }
                                            `}
                                        >
                                            <Icon size={22} className={isActive ? 'text-black' : m.color} />
                                            <span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">{m.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowModeSelector(false)}
                                className="w-full mt-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 font-bold text-xs uppercase tracking-wider active:bg-white/10 transition-colors"
                            >
                                Tutup
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

