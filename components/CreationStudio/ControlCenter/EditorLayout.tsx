import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileManager } from './FileManager';
import { ConsolePanel } from './ConsolePanel';
import { CodeEditor } from './CodeEditor';
import { InteractiveSandbox } from './InteractiveSandbox';
import { CodeFile, ConsoleMessage, FileType } from './types';
import { Play, Pause, Save, Download, RefreshCw, GripVertical, GripHorizontal } from 'lucide-react';

interface EditorLayoutProps {
    files: CodeFile[];
    setFiles: React.Dispatch<React.SetStateAction<CodeFile[]>>;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ files, setFiles }) => {
    // --- state ---
    const [activeFileId, setActiveFileId] = useState<string>('1');
    const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
    const [triggerRun, setTriggerRun] = useState(0);

    // --- state buat resize & preview ---
    const [previewWidth, setPreviewWidth] = useState(40); // Percentage
    const [consoleHeight, setConsoleHeight] = useState(192); // Pixels
    const [isResizingH, setIsResizingH] = useState(false);
    const [isResizingV, setIsResizingV] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // --- reset layout balikin ke awal ---
    const resetLayout = useCallback(() => {
        setPreviewWidth(40);
        setConsoleHeight(192);
    }, []);

    // --- handler buat resizing ---
    const startResizingH = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizingH(true);
    }, []);

    const startResizingV = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizingV(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizingH(false);
        setIsResizingV(false);
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizingH && containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const newWidth = ((containerWidth - e.clientX) / containerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) {
                setPreviewWidth(newWidth);
            }
        }

        if (isResizingV && containerRef.current) {
            const containerHeight = containerRef.current.offsetHeight;
            const newHeight = containerHeight - e.clientY;
            if (newHeight > 100 && newHeight < 500) {
                setConsoleHeight(newHeight);
            }
        }
    }, [isResizingH, isResizingV]);

    useEffect(() => {
        if (isResizingH || isResizingV) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizingH, isResizingV, resize, stopResizing]);

    // pastiin id file aktifnya beneran ada
    useEffect(() => {
        if (!files.find(f => f.id === activeFileId) && files.length > 0) {
            setActiveFileId(files[0].id);
        }
    }, [files, activeFileId]);

    const activeFile = files.find(f => f.id === activeFileId);

    // --- aksi-aksi ---
    const handleFileChange = (val: string | undefined) => {
        if (val === undefined) return;
        setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: val } : f));
    };

    const handleAddFile = (name: string, language: FileType) => {
        const newFile: CodeFile = {
            id: Date.now().toString(),
            name,
            language,
            content: language === 'html' ? '<h1>Hello</h1>' : '',
            isMain: false
        };
        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
    };

    const handleDeleteFile = (id: string) => {
        const fileToDelete = files.find(f => f.id === id);
        if (fileToDelete?.isMain) return; // jangan hapus file utama (main)
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div ref={containerRef} className={`flex flex-col h-full bg-[#050505] ${isResizingH ? 'cursor-col-resize' : isResizingV ? 'cursor-row-resize' : ''}`}>
            {/* workspace utama */}
            <div className="flex-1 flex min-h-0 relative">
                {/* kiri: daftar file */}
                <FileManager
                    files={files}
                    activeFileId={activeFileId}
                    onSelectFile={setActiveFileId}
                    onAddFile={handleAddFile}
                    onDeleteFile={handleDeleteFile}
                />

                {/* tengah: editor & konsol */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#080808]">
                    {/* area editor */}
                    <div className="flex-1 relative overflow-hidden">
                        {activeFile ? (
                            <CodeEditor
                                value={activeFile.content}
                                onChange={handleFileChange}
                                language={activeFile.language}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 font-serif italic text-lg">Pilih file untuk mulai berkreasi...</div>
                        )}
                    </div>

                    {/* pembatas vertikal (resize konsol) */}
                    <div
                        onMouseDown={startResizingV}
                        className={`h-1 cursor-row-resize transition-all flex items-center justify-center group relative ${isResizingV ? 'bg-rose-500 scale-y-150 z-50' : 'bg-white/5 hover:bg-rose-500/50'}`}
                    >
                        <div className={`w-12 h-0.5 rounded-full transition-all ${isResizingV ? 'bg-white' : 'bg-white/10 group-hover:bg-white/30'}`} />
                        {isResizingV && (
                            <div className="absolute -top-8 bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded shadow-xl tracking-widest">
                                {Math.round(consoleHeight)}PX
                            </div>
                        )}
                    </div>

                    {/* Bottom: Console */}
                    <div style={{ height: consoleHeight }} className="shrink-0 border-t border-white/5 bg-black/40">
                        <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
                    </div>
                </div>

                {/* pembatas horizontal (resize preview) */}
                <div
                    onMouseDown={startResizingH}
                    className={`w-1 cursor-col-resize transition-all flex items-center justify-center group relative ${isResizingH ? 'bg-rose-500 scale-x-150 z-50' : 'bg-white/5 hover:bg-rose-500/50'}`}
                >
                    <div className={`w-0.5 h-12 rounded-full transition-all ${isResizingH ? 'bg-white' : 'bg-white/10 group-hover:bg-white/30'}`} />
                    {isResizingH && (
                        <div className="absolute left-4 bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded shadow-xl tracking-widest whitespace-nowrap">
                            {Math.round(100 - previewWidth)}% : {Math.round(previewWidth)}%
                        </div>
                    )}
                </div>

                {/* kanan: pratinjau live */}
                <div
                    style={{ width: `${previewWidth}%` }}
                    className="shrink-0 bg-black flex flex-col border-l border-white/5 relative"
                >
                    <div className="h-8 bg-[#0a0a0a] border-b border-white/5 flex items-center px-4 justify-between">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Live Preview</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={resetLayout}
                                className="p-1 hover:bg-white/10 rounded-md transition-all text-gray-500 hover:text-white"
                                title="Atur Ulang Tata Letak"
                            >
                                <RefreshCw size={10} />
                            </button>
                            <div className="h-3 w-px bg-white/10 mx-1" />
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all ${isPaused ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                            >
                                {isPaused ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />}
                                <span className="text-[9px] font-bold uppercase tracking-wider">{isPaused ? 'LANJUTKAN' : 'JEDA'}</span>
                            </button>
                            <div className="flex gap-2">
                                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isPaused ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`} />
                                <div className="w-2 h-2 rounded-full bg-blue-500/20" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        {/* masker: biar iframe ga ganggu pas lagi resize */}
                        {(isResizingH || isResizingV) && (
                            <div className="absolute inset-0 z-50 cursor-inherit select-none" />
                        )}

                        <InteractiveSandbox
                            files={files}
                            triggerRun={triggerRun}
                            onConsole={(msg) => setConsoleLogs(prev => [...prev, msg])}
                            isPaused={isPaused}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

