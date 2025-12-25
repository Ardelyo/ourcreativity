import React, { useState, useEffect } from 'react';
import { FileManager } from './FileManager';
import { ConsolePanel } from './ConsolePanel';
import { CodeEditor } from './CodeEditor';
import { InteractiveSandbox } from './InteractiveSandbox';
import { CodeFile, ConsoleMessage, FileType } from './types';
import { Eye, Code, Terminal, Folder, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileEditorLayoutProps {
    files: CodeFile[];
    setFiles: React.Dispatch<React.SetStateAction<CodeFile[]>>;
    triggerRun?: number;
}

export const MobileEditorLayout: React.FC<MobileEditorLayoutProps> = ({ files, setFiles, triggerRun = 0 }) => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    const [activeFileId, setActiveFileId] = useState<string>('1');
    const [showConsole, setShowConsole] = useState(false);
    const [showFiles, setShowFiles] = useState(false);
    const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);

    // Sync active file
    useEffect(() => {
        if (!files.find(f => f.id === activeFileId) && files.length > 0) {
            setActiveFileId(files[0].id);
        }
    }, [files, activeFileId]);

    const activeFile = files.find(f => f.id === activeFileId);

    // Auto-switch to preview on run
    useEffect(() => {
        if (triggerRun > 0) {
            setActiveTab('preview');
            setConsoleLogs([]);
        }
    }, [triggerRun]);

    // --- ACTIONS ---
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
        setShowFiles(false);
    };

    const handleDeleteFile = (id: string) => {
        const fileToDelete = files.find(f => f.id === id);
        if (fileToDelete?.isMain) return;
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">

            {/* TOP NAVIGATION TABS */}
            <div className="flex items-center justify-between px-2 pt-2 pb-2 bg-[#0a0a0a] border-b border-white/5 z-20">
                <div className="flex bg-[#111] rounded-lg p-1 border border-white/5">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <Code size={14} /> Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <Eye size={14} /> Preview
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFiles(true)}
                        className={`p-2 rounded-lg bg-[#111] border border-white/5 text-gray-400 hover:text-white ${!activeFile ? 'animate-pulse text-rose-500' : ''}`}
                    >
                        <Folder size={16} />
                    </button>
                    <button
                        onClick={() => setShowConsole(!showConsole)}
                        className={`p-2 rounded-lg bg-[#111] border border-white/5 text-gray-400 hover:text-white ${consoleLogs.length > 0 ? 'text-yellow-400' : ''}`}
                    >
                        <Terminal size={16} />
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeTab === 'editor' ? (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="h-full flex flex-col"
                        >
                            {/* File Name Banner */}
                            <div className="px-4 py-2 bg-[#0a0a0a] border-b border-white/5 text-xs font-mono text-gray-500 flex justify-between items-center">
                                <span>{activeFile?.name || 'No file selected'}</span>
                                <span className={activeFile?.language === 'html' ? 'text-orange-400' : activeFile?.language === 'css' ? 'text-blue-400' : 'text-yellow-400'}>
                                    {activeFile?.language}
                                </span>
                            </div>

                            <div className="flex-1 relative">
                                {activeFile ? (
                                    <CodeEditor
                                        value={activeFile.content}
                                        onChange={handleFileChange}
                                        language={activeFile.language}
                                        fontSize={14} // Larger font for mobile
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                        <p>Pilih file untuk mulai coding</p>
                                        <button onClick={() => setShowFiles(true)} className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold text-white">Buka File Manager</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="h-full bg-black relative"
                        >
                            <InteractiveSandbox
                                files={files}
                                triggerRun={triggerRun}
                                onConsole={(msg) => setConsoleLogs(prev => [...prev, msg])}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* CONSOLE DRAWER */}
            <AnimatePresence>
                {showConsole && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0d1117] border-t border-white/10 z-30 shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/10">
                            <span className="text-xs font-bold text-gray-400 flex items-center gap-2"><Terminal size={12} /> Console</span>
                            <button onClick={() => setShowConsole(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FILE MANAGER DRAWER */}
            <AnimatePresence>
                {showFiles && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFiles(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute top-0 bottom-0 left-0 w-3/4 max-w-[300px] bg-[#0d1117] border-r border-white/10 z-50 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between px-4 py-4 bg-[#161b22] border-b border-white/10">
                                <span className="text-sm font-bold text-white flex items-center gap-2"><Folder size={16} /> Project Files</span>
                                <button onClick={() => setShowFiles(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
                            </div>
                            <div className="flex-1">
                                <FileManager
                                    files={files}
                                    activeFileId={activeFileId}
                                    onSelectFile={(id) => { setActiveFileId(id); setShowFiles(false); }}
                                    onAddFile={handleAddFile}
                                    onDeleteFile={handleDeleteFile}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
};
