import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Clock, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface LoadingTimeoutPopupProps {
    isVisible: boolean;
    countdown: number | null;
    onRefresh: () => void;
    onWait: () => void;
    showOptions: boolean;
    logs?: string[];
}

export const LoadingTimeoutPopup: React.FC<LoadingTimeoutPopupProps> = ({
    isVisible,
    countdown,
    onRefresh,
    onWait,
    showOptions,
    logs = []
}) => {
    const [showLogs, setShowLogs] = useState(false);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
                    className="fixed bottom-12 left-1/2 z-[9999] w-[90%] max-w-md pointer-events-auto"
                >
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-1.5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5 overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-500/10 via-indigo-500/10 to-rose-500/10 p-6 rounded-[2.25rem] flex flex-col items-center gap-4 text-center">

                            {/* Icon Section */}
                            <div className="w-14 h-14 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                                <AlertTriangle size={28} className="animate-pulse" />
                            </div>

                            {/* Text Content */}
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold tracking-tight text-white uppercase italic">Server Sedang Padat</h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed px-4">
                                    Sepertinya koneksi memerlukan waktu lebih lama dari biasanya karena traffic yang tinggi.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            {showOptions && (
                                <div className="flex items-center gap-2 w-full pt-2">
                                    <button
                                        onClick={onRefresh}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-bold rounded-2xl transition-all group text-white"
                                    >
                                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                                        Muat Ulang
                                    </button>

                                    <button
                                        onClick={onWait}
                                        disabled={countdown !== null}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-[11px] font-bold transition-all relative overflow-hidden ${countdown !== null
                                            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/20'
                                            : 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_15px_rgba(244,63,94,0.3)]'
                                            }`}
                                    >
                                        {countdown !== null ? (
                                            <>
                                                <Clock size={14} className="animate-spin" />
                                                Tunggu ({countdown}s)
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={14} />
                                                Tunggu Sebentar
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Debug Logs Section */}
                            <div className="w-full mt-2 border-t border-white/5 pt-3">
                                <button
                                    onClick={() => setShowLogs(!showLogs)}
                                    className="flex items-center gap-1.5 text-[9px] text-gray-500 hover:text-gray-400 transition-colors mx-auto uppercase tracking-widest font-black"
                                >
                                    <Terminal size={10} />
                                    {showLogs ? 'Sembunyikan Log Laporan' : 'Lihat Log Laporan & Debug'}
                                    {showLogs ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                </button>

                                <AnimatePresence>
                                    {showLogs && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-3 p-3 bg-black/60 rounded-2xl border border-white/5 font-mono text-[9px] text-gray-400 max-h-40 overflow-y-auto text-left custom-scrollbar scroll-smooth">
                                                {logs.length > 0 ? (
                                                    logs.map((log, i) => (
                                                        <div key={i} className="mb-1.5 border-b border-white/5 pb-1.5 last:border-0 last:mb-0">
                                                            <span className="text-indigo-400/80 font-bold mr-1 opacity-70 tracking-tighter">
                                                                {log.split(']')[0]}]
                                                            </span>
                                                            <span className={log.includes('ERROR') ? 'text-rose-400' : log.includes('WARN') ? 'text-amber-400' : ''}>
                                                                {log.split(']')[1] || log}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-4 italic text-white/20">Belum ada aktivitas terekam...</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Branded decorative accents */}
                        <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
                        <div className="absolute bottom-0 right-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
