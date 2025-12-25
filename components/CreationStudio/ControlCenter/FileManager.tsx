import React, { useState } from 'react';
import { FileCode, FilePlus, Trash2, FolderOpen } from 'lucide-react';
import { CodeFile, FileType } from './types';
import { motion, AnimatePresence } from 'framer-motion';

interface FileManagerProps {
    files: CodeFile[];
    activeFileId: string;
    onSelectFile: (id: string) => void;
    onAddFile: (name: string, language: FileType) => void;
    onDeleteFile: (id: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
    files,
    activeFileId,
    onSelectFile,
    onAddFile,
    onDeleteFile
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    const handleAdd = () => {
        if (!newFileName.trim()) return;
        const ext = newFileName.split('.').pop();
        // deteksi ekstensi simpel aja
        let lang: FileType = 'javascript';
        if (ext === 'js') lang = 'javascript';
        if (ext === 'html') lang = 'html';
        if (ext === 'css') lang = 'css';
        if (ext === 'json') lang = 'json';
        if (ext === 'svg') lang = 'svg';

        onAddFile(newFileName, lang);
        setNewFileName('');
        setIsAdding(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-white/5 w-64">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <FolderOpen size={14} /> EXPLORER
                </span>
                <button
                    onClick={() => setIsAdding(true)}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                    <FilePlus size={16} className="text-gray-400 hover:text-white" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {files.map(file => (
                    <div
                        key={file.id}
                        onClick={() => onSelectFile(file.id)}
                        className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${activeFileId === file.id ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FileCode size={14} className={
                                file.language === 'javascript' ? 'text-yellow-400' :
                                    file.language === 'html' ? 'text-orange-400' :
                                        file.language === 'css' ? 'text-blue-400' :
                                            'text-gray-400'
                            } />
                            <span className="truncate">{file.name}</span>
                        </div>
                        {!file.isMain && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                ))}

                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[#111] p-2 rounded-lg border border-white/10 mt-2"
                        >
                            <input
                                autoFocus
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAdd();
                                    if (e.key === 'Escape') setIsAdding(false);
                                }}
                                onBlur={() => setIsAdding(false)}
                                placeholder="filename.js"
                                className="w-full bg-transparent text-sm outline-none text-white placeholder:text-gray-600"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
