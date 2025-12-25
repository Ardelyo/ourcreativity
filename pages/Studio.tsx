import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Maximize2, Minimize2, Settings, ArrowLeft,
    Image as ImageIcon, Type, Code, Globe,
    Save, Upload, ChevronRight, X, Play,
    Monitor, Check, Clock, Trash2, RotateCcw,
    Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { useIsMobile } from '../hooks/useIsMobile';

// Sub-components
import { EditorLayout } from '../components/CreationStudio/ControlCenter/EditorLayout';
import { MobileEditorLayout } from '../components/CreationStudio/ControlCenter/MobileEditorLayout';
import { CodeFile } from '../components/CreationStudio/ControlCenter/types';

import { TextEditor } from '../components/CreationStudio/editors/TextEditor';
import { SlideBuilder } from '../components/CreationStudio/carousel/SlideBuilder';
import { WebsiteEmbed } from '../components/CreationStudio/embed/WebsiteEmbed';
import { DocumentUploader } from '../components/CreationStudio/editors/DocumentUploader';
import { MediumSelector } from '../components/CreationStudio/MediumSelector';
import { IframeSandbox } from '../components/CreationStudio/sandbox/IframeSandbox'; // Legacy Keep for Preview if needed
import { PyodideSandbox } from '../components/CreationStudio/sandbox/PyodideSandbox';
import { InteractiveSandbox } from '../components/CreationStudio/ControlCenter/InteractiveSandbox'; // Legacy Keep for Preview if needed

// Types
import { CreationData, WorkType, DivisionId } from '../components/CreationStudio/types';

const DIVISIONS = [
    { id: 'graphics', name: 'Divisi Grafis' },
    { id: 'video', name: 'Divisi Video' },
    { id: 'writing', name: 'Divisi Tulisan' },
    { id: 'coding', name: 'Divisi Coding' },
    { id: 'meme', name: 'Divisi Meme' },
];

const DEFAULT_PROJECT_FILES = [
    {
        id: '1',
        name: 'index.html',
        language: 'html' as const,
        isMain: true,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Creation</title>
    <!-- CSS is injected automatically -->
    <!-- Libraries: Uncomment to use -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script>
</head>
<body>
    <main>
    </main>
    <!-- Scripts injected automatically -->
</body>
</html>`
    },
    {
        id: '2',
        name: 'style.css',
        language: 'css' as const,
        isMain: false,
        content: `body {
    margin: 0;
    padding: 0;
    background: #111;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: sans-serif;
}
canvas {
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
}`
    },
    {
        id: '3',
        name: 'script.js',
        language: 'javascript' as const,
        isMain: false,
        content: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(20);
  fill(255, 0, 100);
  noStroke();
  circle(mouseX, mouseY, 50);
}`
    }
];

export const Studio = () => {
    const navigate = useNavigate();
    const { user, profile, loading: authLoading } = useAuth();
    const isMobile = useIsMobile(); // Hook for responsive logic

    // --- STATE: MODE & CONTENT ---
    const [mode, setMode] = useState<WorkType>('text'); // text, image, video, slide, code, embed
    const [title, setTitle] = useState('Karya Tanpa Judul');
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [slides, setSlides] = useState<any[]>([]);
    const [embedUrl, setEmbedUrl] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');

    // CODE STATE
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>(DEFAULT_PROJECT_FILES);

    // --- STATE: METADATA ---
    const [description, setDescription] = useState('');
    const [division, setDivision] = useState<DivisionId>('graphics');
    const [tags, setTags] = useState<string[]>([]);

    // --- STATE: UI ---
    const [showSettings, setShowSettings] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
    const [publishProgress, setPublishProgress] = useState({ percent: 0, message: '' });

    // --- STATE: CODE EXECUTION ---
    const [triggerRun, setTriggerRun] = useState(0);
    const [dockMinimized, setDockMinimized] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- EFFECT: AUTH & INIT ---
    useEffect(() => {
        if (!authLoading && !user) navigate('/login');

        // Load Draft
        const savedDraft = localStorage.getItem('oc_studio_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                // Confirm restore logic could go here, for now auto-restore
                setTitle(parsed.title || 'Karya Tanpa Judul');
                setMode(parsed.mode || 'text');
                setContent(parsed.content || '');
                setDescription(parsed.description || '');
                setEmbedUrl(parsed.embedUrl || '');
                setCodeLanguage(parsed.codeLanguage || 'javascript');
                setSlides(parsed.slides || []);
                setTags(parsed.tags || []);
                setDivision(parsed.division || 'graphics');
                if (parsed.codeFiles) setCodeFiles(parsed.codeFiles);
            } catch (e) {
                console.error("Failed to restore draft", e);
            }
        }
    }, [authLoading, user, navigate]);

    // --- EFFECT: AUTO-SAVE ---
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const saveDraft = useCallback(() => {
        setDraftStatus('saving');
        const draftData = {
            title, mode, content, description, embedUrl, codeLanguage, slides, tags, division, codeFiles,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('oc_studio_draft', JSON.stringify(draftData));
        setTimeout(() => setDraftStatus('saved'), 500);
        setTimeout(() => setDraftStatus('idle'), 2000);
    }, [title, mode, content, description, embedUrl, codeLanguage, slides, tags, division, codeFiles]);

    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(saveDraft, 2000); // Debounce 2s
        return () => clearTimeout(saveTimeoutRef.current);
    }, [saveDraft]);

    // --- UPLOAD HANDLERS ---

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (mode === 'image' && !file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        if (mode === 'video' && !file.type.startsWith('video/')) {
            alert('Please select a video file');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setMediaFile(file);
        setMediaPreview(previewUrl);
    };

    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setMediaPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const uploadToSupabase = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('works').upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from('works').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handlePublish = async () => {
        if (!title.trim()) {
            setShowSettings(true);
            alert("Mohon isi Judul Karya terlebih dahulu sebelum mempublikasikan."); // Or use a toast if available, but alert is simple for now as requested "wajib kasih title"
            return;
        }

        if (!user) {
            alert("Silakan login untuk mempublikasikan karya.");
            return;
        }

        try {
            setIsPublishing(true);
            setPublishProgress({ percent: 10, message: 'Menyiapkan...' });

            let finalImageUrl = mediaPreview; // Default to preview (base64) or existing
            let finalSlides = [...slides];

            // 1. Upload Media Principal
            // 1. Upload Media Principal
            if (mediaFile) {
                setPublishProgress({ percent: 30, message: 'Mengunggah media utama...' });
                finalImageUrl = await uploadToSupabase(mediaFile);
            } else if (mediaPreview && mediaPreview.startsWith('data:')) {
                // Handle restored draft or base64 without file object
                setPublishProgress({ percent: 35, message: 'Mengunggah ulang media dari draft...' });
                try {
                    const res = await fetch(mediaPreview);
                    const blob = await res.blob();
                    const file = new File([blob], `restored_cover_${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
                    finalImageUrl = await uploadToSupabase(file);
                } catch (e) {
                    console.error("Failed to process base64 image", e);
                    // Fallback: keep base64 or set null? keeping it might fail DB, but better than crash.
                    // Actually, if fail, warn user.
                    // alert("Gagal memproses gambar. Silakan unggah ulang gambar utama.");
                    // throw new Error("Gagal memproses gambar.");
                }
            }

            // 2. Process Slides
            if (mode === 'slide' && slides.length > 0) {
                setPublishProgress({ percent: 50, message: 'Mengunggah slide...' });
                finalSlides = await Promise.all(slides.map(async (slide) => {
                    if (slide.type === 'image' && slide.content.startsWith('data:')) {
                        const res = await fetch(slide.content);
                        const blob = await res.blob();
                        const file = new File([blob], `slide_${slide.id}.jpg`, { type: 'image/jpeg' });
                        const url = await uploadToSupabase(file);
                        return { ...slide, content: url };
                    }
                    return slide;
                }));
            }

            // 3. Simpan Database
            setPublishProgress({ percent: 80, message: 'Menyimpan ke database...' });

            const payload = {
                title,
                description,
                content: mode === 'code' ? JSON.stringify(codeFiles) : content,
                image_url: finalImageUrl,
                author: user?.user_metadata?.username || profile?.username || 'Anonymous',
                author_id: user?.id,
                profile_id: profile?.id,
                role: profile?.role || 'Member',
                division,
                type: mode,
                tags,
                slides: finalSlides,
                code_language: mode === 'code' ? 'json_multifile' : codeLanguage,
                embed_url: embedUrl
            };

            console.log("Publish Payload:", { ...payload, content: payload.content?.substring(0, 100) + '...', image_url: finalImageUrl?.substring(0, 50) + '...' });

            const { error } = await supabase.from('works').insert([payload]);
            if (error) throw error;

            setPublishProgress({ percent: 100, message: 'Berhasil!' });
            localStorage.removeItem('oc_studio_draft'); // Clear draft
            setTimeout(() => navigate('/karya'), 800);

        } catch (err: any) {
            console.error(err);
            alert("Gagal mempublikasikan: " + err.message);
            setIsPublishing(false);
        }
    };

    // --- RENDERERS ---

    const renderCanvas = () => {
        if (isPreview && mode === 'code') {
            return (
                <div className="w-full h-full flex flex-col bg-white text-black overflow-hidden relative">
                    <InteractiveSandbox
                        files={codeFiles}
                        triggerRun={triggerRun}
                        onConsole={(msg) => console.log('Fullscreen Console:', msg)}
                    />
                    <button
                        onClick={() => setIsPreview(false)}
                        className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xs font-bold z-50 flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <Code size={14} /> KEMBALI KE EDITOR
                    </button>
                    {/* Replaced legacy IframeSandbox with InteractiveSandbox */}
                </div>
            )
        }

        if (isPreview) {
            return (
                <div className="w-full h-full overflow-y-auto bg-black p-8 flex justify-center">
                    <div className="max-w-4xl w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-12 min-h-full shadow-2xl relative">
                        <button
                            onClick={() => setIsPreview(false)}
                            className="absolute top-6 right-6 bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-all"
                        >
                            <X size={20} />
                        </button>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">{title}</h1>
                        <div className="flex gap-3 mb-8">
                            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">{DIVISIONS.find(d => d.id === division)?.name}</span>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5 text-xs font-bold uppercase tracking-wider">{mode}</span>
                        </div>
                        <div className="prose prose-invert prose-lg max-w-none">
                            {mode === 'text' && <div dangerouslySetInnerHTML={{ __html: content }} />}
                            {mode === 'embed' && <WebsiteEmbed url={embedUrl} />}
                            {(mode === 'image' || mode === 'video') && mediaPreview && (
                                mode === 'image' ? <img src={mediaPreview} className="rounded-2xl w-full" /> : <video src={mediaPreview} controls className="rounded-2xl w-full" />
                            )}
                            {mode === 'slide' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {slides.map(s => (
                                        <div key={s.id} className="aspect-video bg-white/5 rounded-xl overflow-hidden relative">
                                            {s.type === 'image' ? <img src={s.content} className="w-full h-full object-cover" /> : <div className="p-4 text-xs">{s.content}</div>}
                                            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] font-bold">Slide {s.order + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        switch (mode) {
            case 'text':
                return (
                    <div className="w-full h-full max-w-4xl mx-auto pt-16 md:pt-24 pb-32 px-4 md:px-12 overflow-y-auto">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Judul Tulisan..."
                            className="text-3xl md:text-5xl font-serif font-bold bg-transparent outline-none w-full mb-6 md:mb-8 placeholder:text-gray-700"
                        />
                        <TextEditor content={content} onChange={setContent} />
                    </div>
                );

            case 'image':
            case 'video':
            case 'meme': // Treat meme as image/video upload for now or specific editor if needed
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={mode === 'video' ? "Judul Video..." : "Judul Karya Visual..."}
                            className="text-2xl md:text-4xl font-bold bg-transparent text-center outline-none w-full max-w-2xl mb-8 md:mb-12 placeholder:text-gray-700"
                        />

                        {mediaPreview ? (
                            <div className="relative group w-full max-w-3xl max-h-[50vh] md:max-h-[60vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                                {mode === 'video' || (mediaFile?.type.startsWith('video')) ? (
                                    <video src={mediaPreview} controls className="w-full h-full object-contain" />
                                ) : (
                                    <img src={mediaPreview} className="w-full h-full object-contain" />
                                )}
                                <button
                                    onClick={() => { setMediaPreview(null); setMediaFile(null); }}
                                    className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-xl h-64 md:h-96 border-4 border-dashed border-white/10 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-gray-500 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer relative">
                                <input
                                    type="file"
                                    accept={mode === 'video' ? "video/*" : "image/*"}
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload size={48} className="mb-4 md:mb-6 opacity-50 md:w-16 md:h-16" />
                                <h3 className="text-xl md:text-2xl font-bold mb-2">Upload {mode === 'video' ? 'Video' : 'Gambar'}</h3>
                                <p className="text-xs md:text-sm opacity-60">Klik atau geser file ke sini</p>
                            </div>
                        )}
                    </div>
                );

            case 'slide':
                return (
                    <div className="w-full h-full flex flex-col pt-16 md:pt-24 pb-32">
                        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 mb-4 md:mb-8">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Presentasi..."
                                className="text-2xl md:text-4xl font-bold bg-transparent outline-none w-full placeholder:text-gray-700"
                            />
                        </div>
                        <div className="flex-1 overflow-hidden px-4 md:px-8">
                            <SlideBuilder slides={slides} onChange={setSlides} />
                        </div>
                    </div>
                );

            case 'embed':
                return (
                    <div className="w-full h-full flex flex-col items-center pt-24 px-4 md:px-8">
                        <div className="w-full max-w-3xl space-y-4 md:space-y-8">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Bookmark..."
                                className="text-4xl font-bold bg-transparent text-center outline-none w-full placeholder:text-gray-700"
                            />

                            <div className="bg-[#111] p-2 rounded-2xl border border-white/10 flex gap-4 items-center pl-6 pr-2 shadow-xl">
                                <Globe className="text-gray-500" />
                                <input
                                    value={embedUrl}
                                    onChange={(e) => setEmbedUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="bg-transparent flex-1 py-4 outline-none text-white font-mono"
                                />
                            </div>

                            <div className="w-full h-[50vh] bg-black rounded-2xl border border-white/10 overflow-hidden relative">
                                {embedUrl ? (
                                    <WebsiteEmbed url={embedUrl} />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold tracking-widest uppercase">
                                        Preview Tampil Disini
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'code':
                return (
                    <div className="w-full h-full relative flex flex-col">
                        <div className="absolute top-2 left-64 z-10 w-96 transform translate-y-2">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Nama Project..."
                                className="bg-transparent text-sm font-bold text-gray-400 placeholder:text-gray-700 outline-none w-full focus:text-white transition-colors"
                            />
                        </div>
                        {/* Pass state to EditorLayout or MobileEditorLayout */}
                        {isMobile ? (
                            <MobileEditorLayout
                                files={codeFiles}
                                setFiles={setCodeFiles}
                                triggerRun={triggerRun} // Pass trigger run
                            />
                        ) : (
                            <EditorLayout files={codeFiles} setFiles={setCodeFiles} />
                        )}
                    </div>
                );
        }
    };

    // --- RENDER ---

    if (authLoading) return <div className="h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" /></div>;

    return (
        <div className="fixed inset-0 bg-[#050505] text-white font-sans selection:bg-rose-500/30 flex flex-col">

            {/* OVERLAY: PUBLISHING */}
            <AnimatePresence>
                {isPublishing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center flex-col">
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-rose-500 animate-spin mb-8" />
                        <h2 className="text-2xl font-serif font-bold mb-2">{publishProgress.message}</h2>
                        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                            <motion.div className="h-full bg-rose-500" animate={{ width: `${publishProgress.percent}%` }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADERLESS TOP AREA (Just Back Button & Status) */}
            <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-40 pointer-events-none ${isPreview ? 'opacity-0' : 'opacity-100'} transition-opacity hover:opacity-100`}>
                <button onClick={() => navigate('/karya')} className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-sm">
                    <ArrowLeft size={20} />
                </button>

                <div className="flex flex-col items-end gap-2">
                    <AnimatePresence>
                        {draftStatus !== 'idle' && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                                {draftStatus === 'saving' ? <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> : <Check size={12} className="text-green-500" />}
                                {draftStatus === 'saving' ? 'MENYIMPAN DRAFT...' : 'DRAFT TERSIMPAN'}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button onClick={() => setTriggerRun(n => n + 1)} className="pointer-events-auto opacity-0 group-hover:opacity-100"></button>
                </div>
            </div>

            {/* ZEN CANVAS */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                {renderCanvas()}
            </div>

            {/* FLOATING CONTROL BAR (ZEN DOCK) - MINIMIZABLE ONLY */}
            <div
                className={`fixed z-50 flex flex-col items-center justify-center transition-all duration-500 ${isPreview ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'}`}
                style={{
                    bottom: isMobile ? '1.5rem' : '2rem',
                    left: '50%',
                    transform: `translate(-50%, ${isPreview ? '200%' : '0'})`,
                    width: isMobile ? '90%' : 'auto' // Wider on mobile
                }}
            >
                {/* Collapse Toggle */}
                <button
                    onClick={() => setDockMinimized(!dockMinimized)}
                    className="mb-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 backdrop-blur-md border border-white/5 transition-colors"
                >
                    {dockMinimized ? <ChevronRight className="-rotate-90" size={14} /> : <ChevronRight className="rotate-90" size={14} />}
                </button>

                {/* Main Dock */}
                <AnimatePresence>
                    {!dockMinimized && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            className="bg-[#111]/80 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 group hover:bg-[#111] transition-colors"
                        >

                            {/* Mode Switcher */}
                            <div className="mr-2">
                                <MediumSelector activeType={mode} onChange={(newMode) => setMode(newMode)} />
                            </div>

                            <div className="w-px h-8 bg-white/10 mx-2" />

                            <button
                                onClick={() => {
                                    if (mode === 'code' && isMobile) {
                                        setTriggerRun(n => n + 1);
                                    } else {
                                        setIsPreview(true);
                                    }
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all tooltip"
                                title="Run Code / Preview"
                            >
                                {mode === 'code' ? <Play size={18} /> : <Maximize2 size={18} />}
                            </button>

                            <button
                                onClick={() => setShowSettings(true)}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <Settings size={18} />
                            </button>

                            <button
                                onClick={handlePublish}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="ml-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-rose-500/20 flex items-center gap-2"
                            >
                                Publikasikan <ArrowLeft className="rotate-180" size={16} />
                            </button>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* SETTINGS DRAWER */}
            <AnimatePresence>
                {showSettings && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSettings(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 z-[70] p-8 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-serif font-bold">Metadata Publikasi</h2>
                                <button onClick={() => setShowSettings(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X size={18} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Karya</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-rose-500/50 transition-colors"
                                        placeholder="Judul..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deskripsi</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-rose-500/50 transition-colors h-32 resize-none leading-relaxed"
                                        placeholder="Ceritakan tentang karya ini..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pilih Divisi</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {DIVISIONS.map(div => (
                                            <button
                                                key={div.id}
                                                onClick={() => setDivision(div.id as any)}
                                                className={`px-4 py-3 rounded-xl text-xs font-bold text-left transition-all border ${division === div.id ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'}`}
                                            >
                                                {div.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tags</label>
                                    <input
                                        value={tags.join(', ')}
                                        onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-rose-500/50 transition-colors"
                                        placeholder="Contoh: Tutorial, React, Seni..."
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handlePublish}
                                className="w-full py-4 mt-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Publikasikan Sekarang
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
