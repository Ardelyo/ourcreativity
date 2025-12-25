import React, { useEffect, useRef } from 'react';
import { Terminal, XCircle, Trash } from 'lucide-react';
import { ConsoleMessage } from './types';

interface ConsolePanelProps {
    logs: ConsoleMessage[];
    onClear: () => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ logs, onClear }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] border-t border-white/10 font-mono text-xs">
            <div className="h-8 border-b border-white/5 flex items-center justify-between px-4 bg-[#111]">
                <div className="flex items-center gap-2 text-gray-400">
                    <Terminal size={12} />
                    <span className="uppercase tracking-widest font-bold">Console</span>
                    <span className="bg-white/10 px-1.5 rounded-full text-[10px] min-w-[1.5rem] text-center">{logs.length}</span>
                </div>
                <button
                    onClick={onClear}
                    className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors"
                    title="Clear Console"
                >
                    <Trash size={12} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {logs.length === 0 && (
                    <div className="text-gray-600 italic px-2 py-4 text-center">No output logs yet. Run your code to see results.</div>
                )}
                {logs.map((log, i) => (
                    <div
                        key={i}
                        className={`flex gap-2 px-2 py-1 rounded border-l-2 ${log.type === 'error' ? 'border-rose-500 bg-rose-500/5 text-rose-400' :
                            log.type === 'warn' ? 'border-yellow-500 bg-yellow-500/5 text-yellow-400' :
                                'border-transparent text-gray-300 hover:bg-white/5'
                            }`}
                    >
                        <span className="text-gray-600 select-none flex-shrink-0">
                            [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                        </span>
                        <div className="whitespace-pre-wrap break-all flex-1">
                            {log.content.map((item, idx) => (
                                <span key={idx} className="mr-2">
                                    {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
