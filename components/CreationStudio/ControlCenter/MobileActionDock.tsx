import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Image as ImageIcon, Video, Code, Grid, Settings, Send, X, ChevronUp, Play, Maximize2 } from 'lucide-react';
import { WorkType } from '../types';

interface MobileActionDockProps {
    mode: WorkType;
    onModeChange: (mode: WorkType) => void;
    onPublish: () => void;
    onSettings: () => void;
    onPreview: () => void;
    isCodeMode?: boolean;
}

const modeConfig: { id: WorkType; label: string; icon: any; color: string }[] = [
    { id: 'text', label: 'Tulisan', icon: Type, color: 'text-blue-400' },
    { id: 'image', label: 'Gambar', icon: ImageIcon, color: 'text-purple-400' },
    { id: 'video', label: 'Video', icon: Video, color: 'text-orange-400' },
    { id: 'slide', label: 'Slide', icon: Grid, color: 'text-green-400' },
    { id: 'code', label: 'Kode', icon: Code, color: 'text-yellow-400' },
];

export const MobileActionDock: React.FC<MobileActionDockProps> = ({
    mode,
    onModeChange,
    onPublish,
    onSettings,
    onPreview,
    isCodeMode = false,
}) => {
    const [showModeSelector, setShowModeSelector] = useState(false);
    const currentMode = modeConfig.find(m => m.id === mode) || modeConfig[0];
    const CurrentIcon = currentMode.icon;

    return (
        <>
            {/* MINIMAL FLOATING DOCK */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
                {/* Mode Selector Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModeSelector(true)}
                    className={`
                        w-12 h-12 rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10
                        flex items-center justify-center shadow-xl shadow-black/50
                        ${currentMode.color} hover:bg-[#222] transition-colors
                    `}
                >
                    <CurrentIcon size={22} />
                </motion.button>

                {/* Preview/Run Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onPreview}
                    className="w-12 h-12 rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white shadow-xl shadow-black/50 transition-colors"
                >
                    {isCodeMode ? <Play size={20} /> : <Maximize2 size={20} />}
                </motion.button>

                {/* Settings Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onSettings}
                    className="w-12 h-12 rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white shadow-xl shadow-black/50 transition-colors"
                >
                    <Settings size={20} />
                </motion.button>

                {/* Publish FAB */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onPublish}
                    className="h-12 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-2 text-white font-bold text-sm shadow-xl shadow-rose-900/50 transition-colors"
                >
                    <Send size={18} /> Publikasikan
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
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-x-0 bottom-0 z-[70] bg-[#111] rounded-t-[2rem] border-t border-white/10 p-6 pb-10"
                        >
                            {/* Handle */}
                            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

                            {/* Title */}
                            <h3 className="text-lg font-bold text-white mb-6 text-center">Pilih Jenis Konten</h3>

                            {/* Mode Grid */}
                            <div className="grid grid-cols-3 gap-3">
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
                                                flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all
                                                ${isActive
                                                    ? 'bg-white text-black border-white shadow-lg shadow-white/20'
                                                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                                                }
                                            `}
                                        >
                                            <Icon size={28} className={isActive ? 'text-black' : m.color} />
                                            <span className="text-xs font-bold mt-2 uppercase tracking-wider">{m.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowModeSelector(false)}
                                className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 font-bold text-sm hover:bg-white/10 transition-colors"
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
