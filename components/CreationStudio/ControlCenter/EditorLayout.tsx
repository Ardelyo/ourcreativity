import React, { useState, useEffect } from 'react';
import { FileManager } from './FileManager';
import { ConsolePanel } from './ConsolePanel';
import { CodeEditor } from './CodeEditor';
import { InteractiveSandbox } from './InteractiveSandbox';
import { CodeFile, ConsoleMessage, FileType } from './types';
import { Play, Save, Download, RefreshCw } from 'lucide-react';

interface EditorLayoutProps {
    files: CodeFile[];
    setFiles: React.Dispatch<React.SetStateAction<CodeFile[]>>;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ files, setFiles }) => {
    // --- STATE ---
    const [activeFileId, setActiveFileId] = useState<string>('1');
    const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
    const [triggerRun, setTriggerRun] = useState(0);

    // Ensure activeFileId is valid
    useEffect(() => {
        if (!files.find(f => f.id === activeFileId) && files.length > 0) {
            setActiveFileId(files[0].id);
        }
    }, [files, activeFileId]);

    const activeFile = files.find(f => f.id === activeFileId);

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
    };

    const handleDeleteFile = (id: string) => {
        const fileToDelete = files.find(f => f.id === id);
        if (fileToDelete?.isMain) return; // Prevent deleting main file
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const [isRunning, setIsRunning] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        setConsoleLogs([]); // Clear logs on run
        setTriggerRun(prev => prev + 1);
        setTimeout(() => setIsRunning(false), 500);
    };

    return (
        <div className="flex flex-col h-full bg-[#050505]">
            {/* Toolbar - REMOVED per user request (User prefers Dock PLAY button) */}
            {/* <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0a]">...</div> */}

            {/* Main Workspace */}
            <div className="flex-1 flex min-h-0">
                {/* Left: Files */}
                <FileManager
                    files={files}
                    activeFileId={activeFileId}
                    onSelectFile={setActiveFileId}
                    onAddFile={handleAddFile}
                    onDeleteFile={handleDeleteFile}
                />

                {/* Center: Editor */}
                <div className="flex-1 flex flex-col border-r border-white/5 relative">
                    {activeFile ? (
                        <CodeEditor
                            value={activeFile.content}
                            onChange={handleFileChange}
                            language={activeFile.language}
                        />

                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">Pilih file untuk diedit</div>
                    )}

                    {/* Bottom: Console */}
                    <div className="h-48 border-t border-white/10">
                        <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="w-[40%] bg-black flex flex-col">
                    <div className="h-8 bg-[#111] border-b border-white/5 flex items-center px-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preview</span>
                    </div>
                    <div className="flex-1 relative">
                        <InteractiveSandbox
                            files={files}
                            triggerRun={triggerRun}
                            onConsole={(msg) => setConsoleLogs(prev => [...prev, msg])}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
