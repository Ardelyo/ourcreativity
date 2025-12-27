import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Rocket, Layout, Settings, Eye, Code, Type, Image as ImageIcon, Video, Smartphone } from 'lucide-react';
import { TextEditor } from '../editors/TextEditor';
import { VisualBuilder } from '../carousel/VisualBuilder';
import { MobileEditorLayout } from '../ControlCenter/MobileEditorLayout';
import { MobileActionDock } from '../ControlCenter/MobileActionDock';
import { WorkType, DivisionId } from '../types';
import { CodeFile } from '../ControlCenter/types';

interface MobileStudioProps {
    mode: WorkType;
    title: string;
    setTitle: (val: string) => void;
    content: string;
    setContent: (val: string) => void;
    codeFiles: CodeFile[];
    setCodeFiles: (files: CodeFile[]) => void;
    slides: any[];
    setSlides: (slides: any[]) => void;
    draftStatus: 'saved' | 'saving' | 'idle';
    isPublishing: boolean;
    onBack: () => void;
    onPublish: () => void;
    onToggleDrafts: () => void;
    onSettings: () => void;
    switchMode: (mode: WorkType) => void;
    triggerRun: number;
    setTriggerRun: (val: any) => void;
    isTyping: boolean;
    setIsTyping: (val: boolean) => void;
    addLog: (msg: string, type: any) => void;
}

export const MobileStudio: React.FC<MobileStudioProps> = ({
    mode, title, setTitle, content, setContent,
    codeFiles, setCodeFiles, slides, setSlides,
    draftStatus, isPublishing, onBack, onPublish,
    onToggleDrafts, onSettings, switchMode,
    triggerRun, setTriggerRun, isTyping, setIsTyping, addLog
}) => {

    const renderModeContent = () => {
        switch (mode) {
            case 'text':
                return (
                    <div className="flex-1 flex flex-col bg-[#050505] overflow-x-hidden pt-14 pb-24 w-screen">
                        <div className="w-full px-4 pt-4 box-border">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Teks..."
                                className="w-full bg-transparent border-none outline-none text-3xl font-serif font-bold text-white placeholder:text-white/10 mb-2 break-all"
                            />
                        </div>
                        <div className="flex-1 w-full overflow-x-hidden box-border px-4">
                            <TextEditor
                                content={content}
                                onChange={setContent}
                                isMobile={true}
                                className="min-h-[70vh] w-full break-all"
                                onFocus={() => setIsTyping(true)}
                                onBlur={() => setIsTyping(false)}
                            />
                        </div>
                    </div>
                );
            case 'code':
                return (
                    <div className="flex-1 flex flex-col pt-0 pb-0 overflow-hidden bg-black">
                        <MobileEditorLayout
                            files={codeFiles}
                            setFiles={setCodeFiles}
                            triggerRun={triggerRun}
                            onBack={onBack}
                            onPublish={onPublish}
                            isPublishing={isPublishing}
                        />
                    </div>
                );
            case 'image':
            case 'meme':
            case 'slide':
                return (
                    <div className="flex-1 flex flex-col bg-[#050505] pt-12 pb-24 overflow-x-hidden">
                        <div className="w-full px-5 pt-6 pb-2 border-b border-white/5 bg-black/20">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Abadikan Narasi..."
                                className="w-full bg-transparent border-none outline-none text-2xl font-serif font-bold text-white placeholder:text-white/10 text-center"
                            />
                        </div>
                        <div className="flex-1">
                            <VisualBuilder slides={slides} onChange={setSlides} isMobile={true} addLog={addLog} />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex-1 flex items-center justify-center text-white/20 font-mono text-xs tracking-widest">
                        MEMBUKA SISTEM...
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden select-none">
            {/* Minimal Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none opacity-20" />

            {/* Floating Mobile Nav (Always fixed top except in Code Mode) */}
            {mode !== 'code' && (
                <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-3 h-14 bg-black/60 backdrop-blur-2xl border-b border-white/5 pt-safe">
                    <div className="flex items-center gap-1">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 text-white/50">
                            <ArrowLeft size={20} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={onToggleDrafts} className={`p-2 ${draftStatus !== 'idle' ? 'text-rose-500' : 'text-white/30'}`}>
                            <Layout size={18} />
                        </motion.button>
                    </div>

                    <div className="flex-1 truncate px-2 text-center text-[10px] font-black uppercase tracking-tighter text-white/40">
                        {title || 'NARASI BARU'}
                    </div>

                    <div className="flex items-center gap-1">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onPublish}
                            disabled={isPublishing}
                            className="h-7 px-4 bg-white text-black font-black text-[9px] uppercase tracking-tighter rounded-full flex items-center gap-1.5"
                        >
                            {isPublishing ? (
                                <div className="w-2 h-2 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                            )}
                            KIRIM
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
                {renderModeContent()}
            </div>

            {/* Mobile Dock (Hidden when typing or in Code Mode) */}
            <AnimatePresence>
                {(!isTyping && mode !== 'code') && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]"
                    >
                        <div className="flex bg-[#111]/80 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full shadow-2xl flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <DockButton active={mode === 'text'} onClick={() => switchMode('text')} icon={<Type size={18} />} />
                                <DockButton active={(mode as any) === 'image' || (mode as any) === 'slide'} onClick={() => switchMode('image')} icon={<ImageIcon size={18} />} />
                                <DockButton active={mode === 'code'} onClick={() => switchMode('code')} icon={<Code size={18} />} />
                                <DockButton active={mode === 'video'} onClick={() => switchMode('video')} icon={<Video size={18} />} />
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onSettings}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50"
                            >
                                <Settings size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DockButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
    <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${active ? 'bg-white text-black' : 'text-white/40 hover:bg-white/5'}`}
    >
        {icon}
    </motion.button>
);
