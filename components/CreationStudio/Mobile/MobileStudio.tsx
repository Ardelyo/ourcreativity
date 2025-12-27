import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Rocket, Layout, Settings, Eye, Code, Type, Image as ImageIcon, Video, Smartphone, ChevronRight, ChevronLeft, Upload, X, Check } from 'lucide-react';
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
    const [dockMinimized, setDockMinimized] = useState(false);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Max 100MB
        if (file.size > 100 * 1024 * 1024) {
            addLog('Ukuran video terlalu besar. Maksimal 100MB.', 'error');
            return;
        }

        const url = URL.createObjectURL(file);
        setVideoPreview(url);
        // setContent(url); // Or however video is stored in content
        addLog(`Video "${file.name}" terpilih.`, 'success');
    };

    const renderModeContent = () => {
        switch (mode) {
            case 'text':
                return (
                    <div className="flex-1 flex flex-col bg-black overflow-x-hidden pt-16 pb-32 w-screen">
                        <div className="w-full px-6 pt-6 box-border">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul..."
                                className="w-full bg-transparent border-none outline-none text-4xl font-serif font-medium text-white placeholder:text-white/10 mb-4 break-all leading-tight tracking-tight"
                            />
                        </div>
                        <div className="flex-1 w-full overflow-x-hidden box-border px-6">
                            <TextEditor
                                content={content}
                                onChange={setContent}
                                isMobile={true}
                                className="min-h-[70vh] w-full break-all text-lg leading-relaxed text-gray-300 font-serif"
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
            case 'video':
                return (
                    <div className="flex-1 flex flex-col items-center justify-center bg-black p-8 text-center pb-32 pt-20">
                        <div className="w-full mb-8">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Video..."
                                className="w-full bg-transparent border-none outline-none text-3xl font-serif font-medium text-white placeholder:text-white/10 text-center mb-2 tracking-tight"
                            />
                        </div>

                        {videoPreview ? (
                            <div className="w-full max-w-sm aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 relative group shadow-2xl shadow-black">
                                <video src={videoPreview} controls className="w-full h-full object-contain" />
                                <button
                                    onClick={() => setVideoPreview(null)}
                                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/5"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => videoInputRef.current?.click()}
                                className="w-64 h-40 rounded-2xl bg-[#0a0a0a] border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 group cursor-pointer active:scale-95 transition-all hover:bg-[#111] hover:border-white/20"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Upload size={20} className="text-white/30 group-hover:text-white" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-white/70 font-medium text-xs">Upload Video</p>
                                    <p className="text-white/20 text-[9px] uppercase tracking-widest font-bold">Max 100MB</p>
                                </div>
                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoSelect}
                                    className="hidden"
                                />
                            </div>
                        )}

                        <div className="mt-8 px-5 py-3 bg-[#0a0a0a] rounded-xl border border-white/5 max-w-xs">
                            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest text-left flex items-center gap-2 mb-1">
                                <span className="w-1 h-1 bg-rose-500 rounded-full" /> Info
                            </p>
                            <p className="text-white/40 text-[10px] leading-relaxed text-left font-mono">
                                Optimalkan durasi untuk pemutaran seluler yang lancar.
                            </p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex-1 flex items-center justify-center text-white/20 font-mono text-[10px] tracking-[0.2em] uppercase">
                        Sistem Sedang Memuat...
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden select-none font-sans">
            {/* Zen Background - Pure Void */}
            <div className="absolute inset-0 bg-black pointer-events-none" />

            {/* Floating Zen Header */}
            {mode !== 'code' && (
                <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 h-12 bg-black/40 backdrop-blur-xl border-b border-white/5 pt-safe transition-all">
                    <div className="flex items-center gap-2">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10">
                            <ArrowLeft size={16} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={onToggleDrafts} className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/5 transition-colors ${draftStatus !== 'idle' ? 'text-rose-500' : 'text-white/30'}`}>
                            <Layout size={14} />
                        </motion.button>
                    </div>

                    <div className="flex-1 truncate px-4 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                            {title || 'Untitled'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onPublish}
                            disabled={isPublishing}
                            className="h-8 px-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg shadow-white/5 disabled:opacity-50"
                        >
                            {isPublishing ? (
                                <div className="w-2.5 h-2.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                            )}
                            Kirim
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
                {renderModeContent()}
            </div>

            {/* Zen Dock - Floating Pill */}
            <AnimatePresence>
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: dockMinimized ? 'calc(100% - 48px)' : 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="fixed bottom-6 right-4 z-[100] flex items-center gap-3"
                >
                    {/* Minimal Toggle */}
                    <button
                        onClick={() => setDockMinimized(!dockMinimized)}
                        className="w-10 h-10 rounded-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 shadow-2xl hover:text-white transition-colors"
                    >
                        {dockMinimized ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>

                    <div className="flex bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl flex-col gap-2.5 items-center">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onSettings}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 mb-0.5 hover:bg-white/10 transition-colors"
                        >
                            <Settings size={16} />
                        </motion.button>

                        <div className="w-6 h-[1px] bg-white/5" />

                        <DockButton active={(mode as string) === 'text'} onClick={() => switchMode('text')} icon={<Type size={16} />} />
                        <DockButton active={(mode as string) === 'image' || (mode as string) === 'slide' || (mode as string) === 'meme'} onClick={() => switchMode('image')} icon={<ImageIcon size={16} />} />
                        <DockButton active={(mode as string) === 'code'} onClick={() => switchMode('code')} icon={<Code size={16} />} />
                        <DockButton active={mode === 'video'} onClick={() => switchMode('video')} icon={<Video size={16} />} />
                    </div>
                </motion.div>
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
