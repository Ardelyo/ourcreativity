import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ArrowLeft, Check, Upload, Globe, FileText,
    Clock, AlertCircle, Folder, File, Settings,
    Layout, Image as ImageIcon, Video, Type, Code, Save,
    MoreVertical, ChevronRight, ChevronDown, Monitor,
    Play, Eye, PenTool, Database, Layers, Smartphone,
    Maximize2, Minimize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';

// Types & Sub-components
import { Medium, CreationData, SlideContent, DivisionId, WorkType } from '../components/CreationStudio/types';
import { CodeEditor } from '../components/CreationStudio/editors/CodeEditor';
import { TextEditor } from '../components/CreationStudio/editors/TextEditor';
import { IframeSandbox } from '../components/CreationStudio/sandbox/IframeSandbox';
import { PyodideSandbox } from '../components/CreationStudio/sandbox/PyodideSandbox';
import { WebsiteEmbed } from '../components/CreationStudio/embed/WebsiteEmbed';
import { DocumentUploader } from '../components/CreationStudio/editors/DocumentUploader';
import { SlideBuilder } from '../components/CreationStudio/carousel/SlideBuilder';

const CONTENT_TYPES = [
    { id: 'image', name: 'Gambar Tunggal', icon: ImageIcon, color: 'text-rose-400' },
    { id: 'video', name: 'Video Kreatif', icon: Video, color: 'text-blue-400' },
    { id: 'slide', name: 'Seri Slide/Carousel', icon: Layers, color: 'text-amber-400' },
    { id: 'text', name: 'Artikel / Narasi', icon: Type, color: 'text-green-400' },
    { id: 'code', name: 'Project Coding', icon: Code, color: 'text-purple-400' },
    { id: 'embed', name: 'Embed Website/Media', icon: Globe, color: 'text-cyan-400' },
];

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

    // --- ARCHITECTURE STATE ---
    const [activeContentType, setActiveContentType] = useState<WorkType>('image');
    const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
    const [subMode, setSubMode] = useState<'default' | 'embed' | 'document'>('default');

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [propertiesOpen, setPropertiesOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // Execution State (for Code)
    const [triggerRun, setTriggerRun] = useState(0);
    const [consoleOutput, setConsoleOutput] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState<Partial<CreationData>>({
        title: 'Karya Tanpa Judul',
        description: '',
        division: 'graphics',
        tags: [],
        content: '',
        slides: [],
        code_language: 'javascript',
        embed_url: ''
    });

    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState({ progress: 0, message: '' });

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- EFFECTS ---
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        if (isMobile) {
            setSidebarOpen(false);
            setPropertiesOpen(false);
            setViewMode('editor');
        }
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    useEffect(() => {
        if (!authLoading) {
            if (!user) navigate('/login');
            else if (profile) setFormData(prev => ({ ...prev, author: profile.username || 'Anonymous' }));
        }
    }, [user, profile, authLoading, navigate]);

    // --- UTILS ---
    const uploadFile = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('works').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('works').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handlePublish = async () => {
        if (!formData.title?.trim()) {
            alert("Judul karya tidak boleh kosong.");
            setPropertiesOpen(true);
            return;
        }

        try {
            setIsPublishing(true);
            setPublishStatus({ progress: 10, message: 'Menyiapkan keajaiban...' });

            let finalData = { ...formData, type: activeContentType };

            // Handle Media Uploads
            if (formData._pendingFile) {
                setPublishStatus({ progress: 40, message: 'Mengunggah aset utama...' });
                finalData.image_url = await uploadFile(formData._pendingFile as File);
            }

            // Handle Slides
            if (activeContentType === 'slide' && formData.slides?.length) {
                setPublishStatus({ progress: 60, message: 'Memproses slide...' });
                const slideUploads = formData.slides.map(async (slide) => {
                    if (slide.type === 'image' && slide.content.startsWith('data:')) {
                        const res = await fetch(slide.content);
                        const blob = await res.blob();
                        const file = new File([blob], `slide_${slide.id}.jpg`, { type: 'image/jpeg' });
                        const url = await uploadFile(file);
                        return { ...slide, content: url };
                    }
                    return slide;
                });
                finalData.slides = await Promise.all(slideUploads);
            }

            // Database Insert
            setPublishStatus({ progress: 90, message: 'Menyimpan karya Anda...' });
            const payload = {
                ...finalData,
                author_id: user?.id,
                profile_id: profile?.id,
                role: profile?.role || 'Member',
                _pendingFile: undefined, // cleanup
                image: undefined // cleanup
            };

            const { error } = await supabase.from('works').insert([payload]);
            if (error) throw error;

            setPublishStatus({ progress: 100, message: 'Karya berhasil dipublikasikan!' });
            setTimeout(() => navigate('/karya'), 1000);

        } catch (error: any) {
            console.error('Publish Error:', error);
            alert('Gagal: ' + error.message);
            setIsPublishing(false);
        }
    };

    // --- RENDERS ---

    const renderEditor = () => {
        switch (activeContentType) {
            case 'code':
                return (
                    <CodeEditor
                        value={formData.content || ''}
                        onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                        language={formData.code_language || 'javascript'}
                        onLanguageChange={(lang) => setFormData(prev => ({ ...prev, code_language: lang }))}
                        onRun={() => { setTriggerRun(prev => prev + 1); setConsoleOutput(''); }}
                        isExecuting={isExecuting}
                    />
                );
            case 'text':
                return (
                    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <PenTool size={20} className="text-green-400" /> Tulis Narasi
                            </h2>
                            <button
                                onClick={() => setSubMode(subMode === 'document' ? 'default' : 'document')}
                                className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all"
                            >
                                {subMode === 'document' ? 'Mode Editor' : 'Upload Dokumen (PDF/Word)'}
                            </button>
                        </div>
                        {subMode === 'document' ? (
                            <DocumentUploader onContentExtracted={(html) => { setFormData(prev => ({ ...prev, content: html })); setSubMode('default'); }} />
                        ) : (
                            <TextEditor content={formData.content || ''} onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} />
                        )}
                    </div>
                );
            case 'slide':
                return (
                    <div className="h-full p-4 overflow-auto">
                        <SlideBuilder slides={formData.slides || []} onChange={(slides) => setFormData(prev => ({ ...prev, slides }))} />
                    </div>
                );
            case 'image':
            case 'video':
                return (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full max-w-2xl aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group"
                        >
                            {formData.image ? (
                                activeContentType === 'video' ?
                                    <video src={formData.image} className="h-full w-full object-contain rounded-[2rem]" controls /> :
                                    <img src={formData.image} className="h-full w-full object-contain rounded-[2rem]" alt="Preview" />
                            ) : (
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="text-gray-400" size={32} />
                                    </div>
                                    <p className="text-gray-300 font-bold text-lg">Klik untuk Unggah {activeContentType === 'image' ? 'Gambar' : 'Video'}</p>
                                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-medium">Mendukung format PNG, JPG, MP4</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept={activeContentType === 'image' ? "image/*" : "video/*"}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string, _pendingFile: file }));
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                    </div>
                );
            case 'embed':
                return (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                        <div className="w-full max-w-xl bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                            <Globe size={48} className="text-cyan-400 mb-6 mx-auto" />
                            <h3 className="text-2xl font-bold text-center mb-6">Sematkan Media Luar</h3>
                            <input
                                type="url"
                                placeholder="Masukkan URL (Youtube, Instagram, Web)"
                                value={formData.embed_url || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, embed_url: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all mb-4"
                            />
                            <p className="text-gray-500 text-xs text-center px-4">URL akan ditampilkan sebagai frame interaktif di galeri.</p>
                        </div>
                    </div>
                );
        }
    };

    const renderPreview = () => {
        if (activeContentType === 'code') {
            return (
                <div className="h-full flex flex-col bg-white overflow-hidden rounded-[2rem] border border-black/5 m-4">
                    <div className="bg-gray-100 px-4 py-2 text-[10px] font-bold text-gray-400 flex justify-between border-b">
                        <span>LIVE PREVIEW</span>
                        <Monitor size={12} />
                    </div>
                    <div className="flex-1 relative">
                        <IframeSandbox code={formData.content || ''} triggerRun={triggerRun} language={formData.code_language || 'javascript'} />
                    </div>
                    <div className="h-32 bg-black/90 p-4 font-mono text-[11px] text-green-400 overflow-auto">
                        <div className="text-gray-600 mb-1 border-b border-white/10 pb-1">Console Output</div>
                        <PyodideSandbox
                            code={formData.code_language === 'python' ? (formData.content || '') : ''}
                            triggerRun={formData.code_language === 'python' ? triggerRun : 0}
                            onOutput={(out) => setConsoleOutput(prev => prev + out)}
                            onError={(err) => setConsoleOutput(prev => prev + `\n🛑 Error: ${err}`)}
                        />
                        <pre className="mt-2 text-white/80">{consoleOutput || '> Waiting for execution...'}</pre>
                    </div>
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
                <div className="w-full h-full rounded-[3rem] border border-white/5 bg-black flex flex-col overflow-hidden shadow-2xl overflow-y-auto">
                    <div className="p-12 max-w-2xl mx-auto w-full">
                        <h1 className="text-4xl font-serif font-bold mb-6">{formData.title}</h1>
                        <div className="flex gap-2 mb-8">
                            <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] uppercase font-bold tracking-widest">
                                {DIVISIONS.find(d => d.id === formData.division)?.name || 'Umum'}
                            </span>
                            <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-[10px] uppercase font-bold tracking-widest">
                                {activeContentType}
                            </span>
                        </div>
                        <div className="prose prose-invert prose-rose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content || '' }} />

                        {activeContentType === 'image' && formData.image && <img src={formData.image} className="w-full rounded-3xl mt-8" alt="Karya" />}
                        {activeContentType === 'video' && formData.image && <video src={formData.image} controls className="w-full rounded-3xl mt-8" />}
                    </div>
                </div>
            </div>
        );
    };

    if (authLoading || !user) return <div className="h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

    return (
        <div className="h-screen bg-[#030303] text-white flex flex-col overflow-hidden font-sans selection:bg-rose-500/30">

            {/* OVERLAYS */}
            <AnimatePresence>
                {isPublishing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6">
                        <div className="max-w-xs w-full text-center">
                            <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-transparent border-b-transparent border-l-transparent" />
                                <span className="font-bold text-xl">{publishStatus.progress}%</span>
                            </div>
                            <h2 className="text-xl font-bold mb-2">{publishStatus.message}</h2>
                            <p className="text-gray-500 text-xs animate-pulse">Sedang merakit mahakarya Anda ke awan...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOP HEADER */}
            <header className="h-16 border-b border-white/5 bg-[#080808]/50 backdrop-blur-md flex items-center justify-between px-6 z-50 shrink-0">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/karya')} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-sm font-black shadow-lg shadow-rose-500/20">OC</div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight">STUDIO CREATIVE</span>
                            <span className="text-[10px] text-rose-500/60 font-black uppercase tracking-[0.2em] leading-tight">Platform V5.0</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                        <button onClick={() => setViewMode('editor')} className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'editor' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white'}`}>Editor</button>
                        <button onClick={() => setViewMode('split')} className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'split' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white'}`}>Tampilan Belah</button>
                        <button onClick={() => setViewMode('preview')} className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'preview' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white'}`}>Pratinjau</button>
                    </div>

                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-white text-black h-10 px-6 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-white/10"
                    >
                        <Upload size={14} /> Terbitkan
                    </button>
                </div>
            </header>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">

                {/* SIDEBAR (CONTENT TYPES) */}
                <motion.aside
                    initial={false}
                    animate={{ width: sidebarOpen ? (isMobile ? '100%' : 280) : 0, opacity: sidebarOpen ? 1 : 0 }}
                    style={{ position: isMobile && sidebarOpen ? 'absolute' : 'relative', zIndex: 100 }}
                    className="border-r border-white/5 bg-[#080808] flex flex-col shrink-0 overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Arsitektur Karya</h2>
                        {isMobile && <button onClick={() => setSidebarOpen(false)} className="p-2 bg-white/5 rounded-xl"><X size={16} /></button>}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="space-y-1">
                            {CONTENT_TYPES.map(type => {
                                const Icon = type.icon;
                                const isActive = activeContentType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => { setActiveContentType(type.id as any); if (isMobile) setSidebarOpen(false); }}
                                        className={`w-full group px-4 py-4 rounded-[1.5rem] flex items-center gap-4 transition-all duration-300 ${isActive ? 'bg-white text-black shadow-2xl shadow-white/10 scale-[1.02]' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                    >
                                        <div className={`p-2.5 rounded-2xl ${isActive ? 'bg-black text-white' : 'bg-white/5 group-hover:bg-white/10 transition-colors'} ${!isActive ? type.color : ''}`}>
                                            <Icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{type.name}</span>
                                            <span className={`text-[9px] font-medium opacity-50 ${isActive ? 'text-black' : 'text-gray-500'}`}>Template Pro</span>
                                        </div>
                                        {isActive && <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-12 group cursor-pointer" onClick={() => setPropertiesOpen(true)}>
                            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-rose-500/10 to-rose-500/[0.02] border border-rose-500/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white"><Settings size={14} /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Metadata</span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed">Sesuaikan judul, divisi, dan deskripsi publikasi Anda.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-black/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 overflow-hidden border border-white/5">
                                <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold">{profile?.username}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-rose-500/50">{profile?.role}</span>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* WORKSPACE AREA */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative overflow-hidden">

                    {/* BREADCRUMBS & TOOLS */}
                    <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between text-xs transition-all">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`w-9 h-9 flex items-center justify-center rounded-xl border border-white/5 transition-all ${sidebarOpen ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                                <Layout size={16} />
                            </button>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                <span className="hover:text-white cursor-pointer transition-colors">Workspace</span>
                                <ChevronRight size={14} strokeWidth={3} />
                                <span className="text-white">Live Editor</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="bg-white/5 p-1 rounded-xl flex items-center gap-1">
                                {activeContentType === 'code' && (
                                    <button
                                        onClick={() => { setTriggerRun(prev => prev + 1); setConsoleOutput(''); }}
                                        className="h-8 px-4 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <Play size={12} fill="currentColor" /> Run code
                                    </button>
                                )}
                                <button
                                    onClick={() => setPropertiesOpen(!propertiesOpen)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${propertiesOpen ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <Smartphone size={14} />
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white transition-all"><MoreVertical size={14} /></button>
                            </div>
                        </div>
                    </div>

                    {/* LIVE VIEW GROUP */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* THE EDITOR */}
                        <motion.div
                            initial={false}
                            animate={{
                                width: viewMode === 'split' ? '50%' : (viewMode === 'editor' ? '100%' : '0%'),
                                opacity: viewMode === 'preview' ? 0 : 1,
                                scale: viewMode === 'preview' ? 0.98 : 1
                            }}
                            className="h-full relative overflow-hidden flex flex-col bg-[#080808]/30"
                        >
                            <div className="flex-1 relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeContentType}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="h-full w-full"
                                    >
                                        {renderEditor()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* SPLITTER INDICATOR */}
                        {viewMode === 'split' && <div className="w-px bg-white/5 h-full relative z-10"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-12 rounded-full border border-white/10 bg-[#0a0a0a] flex items-center justify-center gap-0.5"><div className="w-0.5 h-4 bg-white/20 rounded-full" /><div className="w-0.5 h-4 bg-white/20 rounded-full" /></div></div>}

                        {/* THE PREVIEW */}
                        <motion.div
                            initial={false}
                            animate={{
                                width: viewMode === 'split' ? '50%' : (viewMode === 'preview' ? '100%' : '0%'),
                                opacity: viewMode === 'editor' ? 0 : 1,
                                scale: viewMode === 'editor' ? 0.98 : 1
                            }}
                            className="h-full relative overflow-hidden bg-[#030303]"
                        >
                            {renderPreview()}
                        </motion.div>
                    </div>
                </main>

                {/* PROPERTIES DRAWER */}
                <motion.aside
                    initial={false}
                    animate={{ width: propertiesOpen ? (isMobile ? '100%' : 340) : 0, opacity: propertiesOpen ? 1 : 0 }}
                    style={{ position: isMobile && propertiesOpen ? 'absolute' : 'relative', right: 0, zIndex: 110 }}
                    className="border-l border-white/5 bg-[#080808] flex flex-col shrink-0 overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Properti Publikasi</h2>
                        <button onClick={() => setPropertiesOpen(false)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><X size={16} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Identitas Karya</label>
                            <input
                                type="text"
                                placeholder="Tulis judul yang memikat..."
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all font-bold placeholder:text-gray-600"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Klasifikasi Divisi</label>
                            <div className="grid grid-cols-1 gap-2">
                                {DIVISIONS.map(div => (
                                    <button
                                        key={div.id}
                                        onClick={() => setFormData(prev => ({ ...prev, division: div.id as any }))}
                                        className={`px-4 py-3 rounded-2xl text-[11px] font-bold text-left transition-all border ${formData.division === div.id ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'}`}
                                    >
                                        {div.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Deskripsi Ringkas</label>
                            <textarea
                                placeholder="Ceritakan latar belakang karya ini..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 text-sm text-white focus:outline-none focus:border-rose-500/50 h-36 resize-none transition-all placeholder:text-gray-600 leading-relaxed"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Label (Tags)</label>
                            <input
                                type="text"
                                placeholder="Seni, Kode, Inovatif..."
                                value={formData.tags?.join(', ')}
                                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all font-medium"
                            />
                        </div>

                        <div className="pt-6">
                            <div className="p-6 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4"><Database size={24} className="text-rose-500" /></div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">Status Keamanan</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-tighter">Draft otomatis tersimpan secara lokal di peramban Anda.</p>
                            </div>
                        </div>
                    </div>
                </motion.aside>

            </div>

            {/* FOOTER BAR */}
            <div className="h-8 bg-[#000] border-t border-white/5 flex items-center px-6 justify-between text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 select-none">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> SINKRONISASI AKTIF</span>
                    <span>TIPE: {activeContentType}</span>
                    <span>DIV: {formData.division}</span>
                </div>
                <div className="flex items-center gap-6">
                    <span>UTF-8</span>
                    <span className="flex items-center gap-1.5"><Smartphone size={10} /> {isMobile ? 'Mobile' : 'Desktop'} Optimized</span>
                    <span className="text-rose-500/50">OurCreativity V5 Engine</span>
                </div>
            </div>
        </div>
    );
};
