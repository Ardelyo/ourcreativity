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

// Sub-components
import { CodeEditor } from '../components/CreationStudio/editors/CodeEditor';
import { TextEditor } from '../components/CreationStudio/editors/TextEditor';
import { SlideBuilder } from '../components/CreationStudio/carousel/SlideBuilder';
import { WebsiteEmbed } from '../components/CreationStudio/embed/WebsiteEmbed';
import { DocumentUploader } from '../components/CreationStudio/editors/DocumentUploader';
import { IframeSandbox } from '../components/CreationStudio/sandbox/IframeSandbox';
import { PyodideSandbox } from '../components/CreationStudio/sandbox/PyodideSandbox';

// Types
import { CreationData, WorkType, DivisionId } from '../components/CreationStudio/types';

const DIVISIONS = [
    { id: 'graphics', name: 'Divisi Grafis' },
    { id: 'video', name: 'Divisi Video' },
    { id: 'writing', name: 'Divisi Tulisan' },
    { id: 'coding', name: 'Divisi Coding' },
    { id: 'meme', name: 'Divisi Meme' },
];

export const Studio = () => {
    const navigate = useNavigate();
    const { user, profile, loading: authLoading } = useAuth();

    // --- STATE: MODE & CONTENT ---
    const [mode, setMode] = useState<WorkType>('text'); // text, image, video, slide, code, embed
    const [title, setTitle] = useState('Karya Tanpa Judul');
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [slides, setSlides] = useState<any[]>([]);
    const [embedUrl, setEmbedUrl] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');

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
            title, mode, content, description, embedUrl, codeLanguage, slides, tags, division,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('oc_studio_draft', JSON.stringify(draftData));
        setTimeout(() => setDraftStatus('saved'), 500);
        setTimeout(() => setDraftStatus('idle'), 2000);
    }, [title, mode, content, description, embedUrl, codeLanguage, slides, tags, division]);

    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(saveDraft, 2000); // Debounce 2s
        return () => clearTimeout(saveTimeoutRef.current);
    }, [saveDraft]);

    // --- HANDLERS ---

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
        if (!title.trim() || title === 'Karya Tanpa Judul') {
            setShowSettings(true);
            alert("Mohon isi judul karya Anda terlebih dahulu.");
            return;
        }

        try {
            setIsPublishing(true);
            setPublishProgress({ percent: 10, message: 'Menyiapkan...' });

            let finalImageUrl = mediaPreview; // Default to preview (base64) or existing
            let finalSlides = [...slides];

            // 1. Upload Media Principal
            if (mediaFile) {
                setPublishProgress({ percent: 30, message: 'Mengunggah media utama...' });
                finalImageUrl = await uploadToSupabase(mediaFile);
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
                content,
                image_url: finalImageUrl,
                author: user?.user_metadata?.username || profile?.username || 'Anonymous',
                author_id: user?.id,
                profile_id: profile?.id,
                role: profile?.role || 'Member',
                division,
                type: mode,
                tags,
                slides: finalSlides,
                code_language: codeLanguage,
                embed_url: embedUrl
            };

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
                    <IframeSandbox code={content} triggerRun={triggerRun} language={codeLanguage} />
                    <button
                        onClick={() => setIsPreview(false)}
                        className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xs font-bold z-50 flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <Code size={14} /> KEMBALI KE EDITOR
                    </button>
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
                    <div className="w-full max-w-3xl mx-auto h-full flex flex-col py-10 px-6">
                        <div className="mb-4 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Karya..."
                                className="bg-transparent text-4xl md:text-5xl font-serif font-bold placeholder:text-gray-700 outline-none w-full"
                            />
                        </div>
                        <div className="flex-1 min-h-0">
                            <TextEditor content={content} onChange={setContent} placeholder="Mulai menulis kisah Anda..." className="h-full text-lg leading-relaxed" />
                        </div>
                    </div>
                );
            case 'code':
                return (
                    <div className="w-full h-full flex flex-col md:flex-row">
                        <div className="flex-1 h-full relative border-r border-white/5">
                            <div className="absolute top-0 right-0 z-10 p-2 flex gap-2">
                                <select
                                    value={codeLanguage}
                                    onChange={(e) => setCodeLanguage(e.target.value)}
                                    className="bg-black/50 backdrop-blur border border-white/10 rounded-lg text-xs px-2 py-1 outline-none hover:border-white/30"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="html">HTML/CSS</option>
                                    <option value="python">Python</option>
                                </select>
                            </div>
                            <CodeEditor
                                value={content}
                                onChange={setContent}
                                language={codeLanguage}
                                onLanguageChange={setCodeLanguage}
                                onRun={() => { setTriggerRun(n => n + 1); setConsoleOutput(''); }}
                                isExecuting={false} // Managed by sandbox
                            />
                        </div>
                        {/* Live Mini Preview for Code */}
                        <div className="hidden md:flex flex-col w-[40%] bg-[#111]">
                            <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0a]">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-2"><Monitor size={12} /> Output</span>
                                <button onClick={() => { setTriggerRun(n => n + 1); setConsoleOutput(''); }} className="text-green-500 hover:text-green-400"><Play size={14} /></button>
                            </div>
                            <div className="flex-1 relative">
                                <IframeSandbox code={content} triggerRun={triggerRun} language={codeLanguage} />
                            </div>
                            {codeLanguage === 'python' && (
                                <div className="h-40 border-t border-white/5 bg-black p-4 font-mono text-xs text-green-400 overflow-auto">
                                    <div className="opacity-50 mb-2 border-b border-white/10 pb-1">CONSOLE</div>
                                    <PyodideSandbox
                                        code={codeLanguage === 'python' ? content : ''}
                                        triggerRun={triggerRun}
                                        onOutput={(o) => setConsoleOutput(p => p + o)}
                                        onError={(e) => setConsoleOutput(p => p + `\nErr: ${e}`)}
                                    />
                                    <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'image':
            case 'video':
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative w-full max-w-2xl aspect-video rounded-[3rem] border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden"
                        >
                            {mediaPreview ? (
                                mode === 'image' ?
                                    <img src={mediaPreview} className="w-full h-full object-contain p-4" /> :
                                    <video src={mediaPreview} className="w-full h-full object-contain p-4" controls />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="text-gray-400" size={32} />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold mb-2">Unggah {mode === 'image' ? 'Gambar' : 'Video'}</h3>
                                    <p className="text-gray-500 text-sm">Klik atau drag & drop file di sini</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept={mode === 'image' ? "image/*" : "video/*"}
                                onChange={handleMediaUpload}
                            />
                        </div>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Judul Karya..."
                            className="mt-8 bg-transparent text-center text-3xl font-serif font-bold placeholder:text-gray-800 outline-none w-full max-w-lg"
                        />
                    </div>
                );
            case 'slide':
                return (
                    <div className="w-full h-full flex flex-col p-4 md:p-8">
                        <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Serial Slide..."
                                className="bg-transparent text-3xl md:text-4xl font-serif font-bold placeholder:text-gray-800 outline-none w-full mb-6 px-4"
                            />
                            <div className="flex-1 min-h-0 bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden">
                                <SlideBuilder slides={slides} onChange={setSlides} />
                            </div>
                        </div>
                    </div>
                );
            case 'embed':
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                        <div className="w-full max-w-xl bg-[#111] p-8 rounded-[3rem] border border-white/10 text-center">
                            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6 text-cyan-400">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-6">Embed URL Eksternal</h3>
                            <input
                                value={embedUrl}
                                onChange={(e) => setEmbedUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-center focus:border-cyan-500/50 outline-none transition-colors mb-6"
                            />
                            {embedUrl && (
                                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                                    <WebsiteEmbed url={embedUrl} />
                                </div>
                            )}
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Karya..."
                                className="mt-8 bg-transparent text-center text-2xl font-serif font-bold placeholder:text-gray-800 outline-none w-full"
                            />
                        </div>
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

            {/* FLOATING CONTROL BAR (ZEN DOCK) */}
            <div className={`fixed bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none transition-transform duration-300 ${isPreview ? 'translate-y-24' : 'translate-y-0'}`}>
                <div className="pointer-events-auto bg-[#111]/80 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 group hover:bg-[#111] transition-colors">

                    {/* Mode Switcher */}
                    <div className="flex p-1 bg-black/50 rounded-3xl border border-white/5 mr-2">
                        {[
                            { id: 'text', icon: Type, label: 'Tulis' },
                            { id: 'image', icon: ImageIcon, label: 'Visual' },
                            { id: 'slide', icon: Layers, label: 'Slide' },
                            { id: 'code', icon: Code, label: 'Kode' },
                            { id: 'embed', icon: Globe, label: 'Embed' },
                        ].map(m => {
                            const Icon = m.icon;
                            const isActive = mode === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id as any)}
                                    className={`relative px-4 py-2 rounded-2xl flex items-center gap-2 transition-all overflow-hidden ${isActive ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {isActive && <motion.div layoutId="dock-active" className="absolute inset-0 bg-white rounded-2xl z-0" />}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Icon size={16} />
                                        {isActive && <span className="text-xs font-bold">{m.label}</span>}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="w-px h-8 bg-white/10 mx-2" />

                    <button
                        onClick={() => setIsPreview(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all tooltip"
                        title="Preview Fullscreen"
                    >
                        {mode === 'code' ? <Play size={18} /> : <Maximize2 size={18} />}
                    </button>

                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                        <Settings size={18} />
                    </button>

                    <button
                        onClick={handlePublish}
                        className="ml-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-rose-500/20 flex items-center gap-2"
                    >
                        Publikasikan <ArrowLeft className="rotate-180" size={16} />
                    </button>

                </div>
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


