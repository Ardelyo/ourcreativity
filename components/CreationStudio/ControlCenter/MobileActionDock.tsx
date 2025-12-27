import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Image as ImageIcon, Video, Code, FileText, Settings, Send, X, Play, Eye, Globe, Component } from 'lucide-react';
import { WorkType } from '../types';

interface MobileActionDockProps {
    mode: WorkType;
    onModeChange: (mode: WorkType) => void;
    onPublish: () => void;
    onSettings: () => void;
    onPreview: () => void;
    isCodeMode?: boolean;
}

// branding "zen": konsisten monokrom & minimalis
const modeConfig: { id: WorkType; label: string; icon: any }[] = [
    { id: 'text', label: 'Tulisan', icon: Type },
    { id: 'image', label: 'Gambar', icon: ImageIcon },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'code', label: 'Kode', icon: Code },
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
            {/* dock melayang minimalis */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe flex items-center justify-center gap-4 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                {/* tombol pilih mode */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setShowModeSelector(true)}
                    className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-white/10 active:scale-90 transition-all font-bold"
                >
                    <CurrentIcon size={24} />
                </motion.button>

                {/* tombol pratinjau/run (bentuk pil) */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onPreview}
                    className="h-14 px-6 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center gap-2 text-white font-medium shadow-xl shadow-black/50 active:bg-white/10 transition-all"
                >
                    {isCodeMode ? (
                        <>
                            <Play size={18} className="fill-white" />
                            <span className="text-xs tracking-wider uppercase">Jalankan</span>
                        </>
                    ) : (
                        <>
                            <Eye size={18} />
                            <span className="text-xs tracking-wider uppercase">Pratinjau</span>
                        </>
                    )}
                </motion.button>

                {/* tombol setting (kecil) */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onSettings}
                    className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-gray-400 active:text-white shadow-xl shadow-black/50 transition-colors"
                >
                    <Settings size={22} />
                </motion.button>
            </div>

            {/* bottom sheet buat pilih mode */}
            <AnimatePresence>
                {showModeSelector && (
                    <>
                        {/* background gelap */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModeSelector(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                        />

                        {/* panel sheetnya */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 z-[70] bg-[#0a0a0a] rounded-t-[2.5rem] border-t border-white/5 p-6 pb-safe"
                        >
                            {/* garis handle */}
                            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />

                            {/* judul panel */}
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h3 className="text-xl font-medium text-white font-serif">Pilih Kreativitas</h3>
                                <button
                                    onClick={() => setShowModeSelector(false)}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* grid mode - layout zen */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {modeConfig.map((m) => {
                                    const Icon = m.icon;
                                    const isActive = mode === m.id;
                                    return (
                                        <motion.button
                                            key={m.id}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => {
                                                onModeChange(m.id);
                                                setShowModeSelector(false);
                                            }}
                                            className={`
                                                flex flex-col items-center justify-center p-5 rounded-2xl border transition-all aspect-square
                                                ${isActive
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-white/5 text-gray-400 border-transparent active:bg-white/10'
                                                }
                                            `}
                                        >
                                            <Icon size={26} strokeWidth={1.5} />
                                            <span className="text-[10px] font-medium mt-3 uppercase tracking-widest">{m.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};


