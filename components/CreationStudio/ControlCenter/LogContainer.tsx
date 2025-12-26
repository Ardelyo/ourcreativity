import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ChevronDown, ChevronUp, TerminalSquare, Info, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface LogEntry {
    id: string;
    timestamp: number;
    type: 'info' | 'success' | 'error' | 'process';
    message: string;
}

interface LogContainerProps {
    logs: LogEntry[];
    isOpen: boolean;
    onToggle: () => void;
    onClear: () => void;
    isMobile?: boolean;
}

export const LogContainer: React.FC<LogContainerProps> = ({ logs, isOpen, onToggle, onClear, isMobile }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isOpen]);

    const getIcon = (type: LogEntry['type']) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={12} className="text-emerald-500" />;
            case 'error': return <AlertCircle size={12} className="text-rose-500" />;
            case 'process': return <Loader2 size={12} className="text-blue-500 animate-spin" />;
            default: return <Info size={12} className="text-gray-400" />;
        }
    };

    return (
        <div className={`fixed z-[100] transition-all duration-500 pointer-events-none ${isMobile
                ? 'bottom-[90px] left-4 right-4 max-w-none'
                : 'bottom-24 right-6 w-full max-w-sm'
            }`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden mb-4 pointer-events-auto flex flex-col ${isMobile ? 'max-h-[300px]' : 'max-h-[400px]'
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2">
                                <TerminalSquare size={16} className="text-rose-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Container Logs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onClear}
                                    className="text-[8px] font-bold text-gray-500 hover:text-white uppercase tracking-tighter transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={onToggle}
                                    className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Logs List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] custom-scrollbar">
                            {logs.length === 0 ? (
                                <div className="text-center py-8 text-gray-600 italic">No logs documented yet...</div>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-1 duration-300">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getIcon(log.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600 text-[8px]">
                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${log.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    log.type === 'error' ? 'bg-rose-500/10 text-rose-500' :
                                                        log.type === 'process' ? 'bg-blue-500/10 text-blue-500' :
                                                            'bg-white/5 text-gray-500'
                                                    }`}>
                                                    {log.type}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{log.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            {!isOpen && logs.length > 0 && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={onToggle}
                    className="ml-auto flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/30 transition-all shadow-xl pointer-events-auto group"
                >
                    <div className="relative">
                        <Terminal size={14} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:block">Open Logs</span>
                </motion.button>
            )}
        </div>
    );
};
