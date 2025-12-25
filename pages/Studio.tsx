import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Maximize2, Settings,
    Image as ImageIcon, Globe,
    Save, Upload, ChevronDown, X,
    Trash2, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { useIsMobile } from '../hooks/useIsMobile';

// Sub-components
import { EditorLayout } from '@/components/CreationStudio/ControlCenter/EditorLayout';
import { MobileEditorLayout } from '@/components/CreationStudio/ControlCenter/MobileEditorLayout';
import { MobileActionDock } from '@/components/CreationStudio/ControlCenter/MobileActionDock';
import { CodeFile } from '@/components/CreationStudio/ControlCenter/types';
import { DraftManager } from '@/components/CreationStudio/ControlCenter/DraftManager';
import { TextEditor } from '@/components/CreationStudio/editors/TextEditor';
import { VisualBuilder } from '@/components/CreationStudio/carousel/VisualBuilder';
import { WebsiteEmbed } from '@/components/CreationStudio/embed/WebsiteEmbed';
import { DocumentUploader } from '@/components/CreationStudio/editors/DocumentUploader';
import { MediumSelector } from '@/components/CreationStudio/MediumSelector';
import { IframeSandbox } from '@/components/CreationStudio/sandbox/IframeSandbox';
import { PyodideSandbox } from '@/components/CreationStudio/sandbox/PyodideSandbox';
import { InteractiveSandbox } from '@/components/CreationStudio/ControlCenter/InteractiveSandbox';
import { StudioHeader } from '@/components/CreationStudio/StudioHeader';
import { PreviewCarousel } from '@/components/CreationStudio/PreviewCarousel';

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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script>
</head>
<body>
    <main></main>
</body>
</html>`
    },
    {
        id: '2',
        name: 'style.css',
        language: 'css' as const,
        isMain: false,
        content: `body { margin: 0; background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; }`
    },
    {
        id: '3',
        name: 'script.js',
        language: 'javascript' as const,
        isMain: false,
        content: `function setup() { createCanvas(400, 400); } \nfunction draw() { background(20); fill(255, 0, 100); circle(mouseX, mouseY, 50); }`
    }
];

export const Studio = () => {
    const navigate = useNavigate();
    const { user, profile, loading: authLoading } = useAuth();
    const isMobile = useIsMobile();

    // --- STATE: DRAFT MANAGEMENT ---
    const [drafts, setDrafts] = useState<any[]>([]);
    const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
    const [showDrafts, setShowDrafts] = useState(false);

    // --- STATE: MODE & CONTENT ---
    const [mode, setMode] = useState<WorkType>('text');
    const [title, setTitle] = useState('Karya Tanpa Judul');
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [slides, setSlides] = useState<any[]>([]);
    const [embedUrl, setEmbedUrl] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');
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
    const [isTyping, setIsTyping] = useState(false); // Mobile keyboard state

    // --- EFFECT: INITIAL LOAD ---
    useEffect(() => {
        if (!authLoading && !user) navigate('/login');

        const savedDrafts = localStorage.getItem('oc_studio_v2_drafts');
        if (savedDrafts) {
            try {
                const parsed = JSON.parse(savedDrafts);
                // Migrate any 'slide' drafts to 'image'
                const migrated = parsed.map((d: any) => d.mode === 'slide' ? { ...d, mode: 'image' } : d);
                setDrafts(migrated);

                if (migrated.length > 0) {
                    // Try to load the most recent draft of the current mode (default text)
                    const mostRecentOfMode = migrated
                        .filter((d: any) => d.mode === mode)
                        .sort((a: any, b: any) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime())[0];

                    if (mostRecentOfMode) {
                        applyDraft(mostRecentOfMode);
                    } else {
                        // If no draft for current mode, load the most recent draft overall
                        const mostRecent = migrated.sort((a: any, b: any) =>
                            new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
                        )[0];
                        applyDraft(mostRecent);
                    }
                } else {
                    handleNewDraft(mode);
                }
            } catch (e) {
                console.error("Failed to load drafts", e);
                handleNewDraft(mode);
            }
        } else {
            handleNewDraft(mode);
        }
    }, [authLoading, user]);

    const applyDraft = (draft: any) => {
        setCurrentDraftId(draft.id);
        setTitle(draft.title || 'Karya Tanpa Judul');
        setMode(draft.mode || 'text');
        setContent(draft.content || '');
        setDescription(draft.description || '');
        setEmbedUrl(draft.embedUrl || '');
        setCodeLanguage(draft.codeLanguage || 'javascript');
        setSlides(draft.slides || []);
        setTags(draft.tags || []);
        setDivision(draft.division || 'graphics');
        if (draft.codeFiles) setCodeFiles(draft.codeFiles);
        setMediaPreview(draft.mediaPreview || null);
    };

    const handleNewDraft = (specificMode?: WorkType) => {
        const newId = typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 15);

        const targetMode = specificMode || mode;
        const newDraft = {
            id: newId,
            title: 'Karya Tanpa Judul',
            mode: targetMode,
            content: '',
            lastSaved: new Date().toISOString()
        };
        // Don't add to list yet, only on first save
        applyDraft(newDraft);
        setShowDrafts(false);
    };

    const switchMode = (newMode: WorkType) => {
        if (newMode === mode) return;

        // Try to find the most recent draft of the NEW mode
        const existingDraft = drafts
            .filter(d => d.mode === newMode)
            .sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime())[0];

        if (existingDraft) {
            applyDraft(existingDraft);
        } else {
            handleNewDraft(newMode);
        }
    };

    const handleDeleteDraft = (id: string) => {
        const updated = drafts.filter(d => d.id !== id);
        setDrafts(updated);
        localStorage.setItem('oc_studio_v2_drafts', JSON.stringify(updated));
        if (currentDraftId === id) {
            if (updated.length > 0) {
                applyDraft(updated[0]);
            } else {
                handleNewDraft();
            }
        }
    };

    // --- EFFECT: AUTO-SAVE (OPTIMIZED) ---
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSaveDataRef = useRef<string>('');

    const saveDraftsToStorage = useCallback(() => {
        if (!currentDraftId) return;

        // Smart Save: Only save if title is changed or content is not empty
        const isDefaultTitle = title === 'Karya Tanpa Judul' || !title.trim();
        const hasContent = content.trim().length > 0 || slides.length > 0 || embedUrl.trim().length > 0 || codeFiles.length > 3;

        if (isDefaultTitle && !hasContent) {
            console.log("Skipping auto-draft: empty draft");
            return;
        }

        // Check if data actually changed
        const currentData = {
            id: currentDraftId,
            title, mode, content, description, embedUrl, codeLanguage, slides, tags, division, codeFiles,
            mediaPreview,
            lastSaved: new Date().toISOString()
        };

        const currentDataStr = JSON.stringify({ title, mode, content, description, embedUrl, slides, codeFiles });
        if (currentDataStr === lastSaveDataRef.current) {
            console.log("Skipping auto-draft: no changes detected");
            return;
        }

        lastSaveDataRef.current = currentDataStr;

        setDraftStatus('saving');
        const updatedDrafts = drafts.filter(d => d.id !== currentDraftId);
        updatedDrafts.unshift(currentData); // Put current at top

        setDrafts(updatedDrafts);
        localStorage.setItem('oc_studio_v2_drafts', JSON.stringify(updatedDrafts));

        setTimeout(() => setDraftStatus('saved'), 500);
        setTimeout(() => setDraftStatus('idle'), 2500);
    }, [currentDraftId, title, mode, content, description, embedUrl, codeLanguage, slides, tags, division, codeFiles, mediaPreview, drafts]);

    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        // Increased debounce to 5 seconds to reduce save frequency
        saveTimeoutRef.current = setTimeout(saveDraftsToStorage, 5000);
        return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
    }, [saveDraftsToStorage]);

    // --- UPLOAD HANDLERS ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setMediaFile(file);
        setMediaPreview(previewUrl);
    };

    const uploadToSupabase = async (file: File | Blob, path?: string) => {
        const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
        const fileName = path || `${user?.id}/${Date.now()}.${fileExt}`;

        // Convert base64 to blob if needed is handled before calling this, but ensure we have file/blob
        const { error } = await supabase.storage.from('works').upload(fileName, file, {
            contentType: file.type || 'image/jpeg',
            upsert: true
        });
        if (error) throw error;
        const { data } = supabase.storage.from('works').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const processSlidesForUpload = async (slidesData: any[]) => {
        if (!slidesData || slidesData.length === 0) return [];

        const processedSlides = await Promise.all(slidesData.map(async (slide, index) => {
            // Check if content is base64
            if (slide.content && slide.content.startsWith('data:image')) {
                try {
                    // Convert base64 to Blob
                    const fetchRes = await fetch(slide.content);
                    const blob = await fetchRes.blob();

                    // Upload
                    const fileName = `${user?.id}/slides/${Date.now()}_${index}.jpg`;
                    const publicUrl = await uploadToSupabase(blob, fileName);

                    return { ...slide, content: publicUrl };
                } catch (e) {
                    console.error("Failed to upload slide image", e);
                    return slide; // Return original on fail, though it might fail DB insert
                }
            }
            return slide; // Already a URL or text
        }));

        return processedSlides;
    };

    const handlePublish = async () => {
        if (!title.trim() || title === 'Karya Tanpa Judul') {
            setShowSettings(true);
            alert("Judul wajib diisi. Silakan berikan judul yang unik untuk karyamu.");
            return;
        }

        if (!division) {
            setShowSettings(true);
            alert("Harap pilih Divisi yang sesuai sebelum publikasi.");
            return;
        }

        try {
            setIsPublishing(true);
            setPublishProgress({ percent: 10, message: 'Menyiapkan...' });

            let finalImageUrl = mediaPreview;
            if (mediaFile) {
                setPublishProgress({ percent: 30, message: 'Mengunggah media...' });
                finalImageUrl = await uploadToSupabase(mediaFile);
            }

            setPublishProgress({ percent: 50, message: 'Memproses slide visual...' });
            let finalSlides = slides;
            if (mode === 'image' || mode === 'meme') {
                finalSlides = await processSlidesForUpload(slides);
            }

            setPublishProgress({ percent: 80, message: 'Menyimpan ke database...' });
            const payload = {
                title, description, image_url: finalImageUrl,
                author: profile?.username || 'Anonymous',
                author_id: user?.id, role: profile?.role || 'Member',
                division, type: mode, tags,
                content: mode === 'code' ? JSON.stringify(codeFiles) : content,
                code_language: mode === 'code' ? 'json_multifile' : codeLanguage,
                slides: (mode === 'image' || mode === 'meme') ? finalSlides : null,
                embed_url: embedUrl
            };

            const { error } = await supabase.from('works').insert([payload]);
            if (error) throw error;

            setPublishProgress({ percent: 100, message: 'Berhasil!' });
            handleDeleteDraft(currentDraftId!); // Remove from drafts after publish
            setTimeout(() => navigate('/karya'), 800);
        } catch (err: any) {
            alert("Gagal: " + err.message);
            setIsPublishing(false);
        }
    };

    // Unified Content Renderer
    const renderContent = () => {
        switch (mode) {
            case 'text':
                return (
                    <div className={`w-full h-full max-w-4xl mx-auto px-6 md:px-0 overflow-y-auto custom-scrollbar ${isMobile ? 'pt-4 pb-20' : 'pt-24 pb-32'}`}>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Judul Karya Tulis..."
                            className="text-4xl md:text-5xl font-serif font-bold bg-transparent outline-none w-full mb-8 placeholder:text-white/10"
                        />
                        <TextEditor
                            content={content}
                            onChange={setContent}
                            className={isMobile ? "min-h-[50vh]" : "min-h-[60vh]"}
                            isMobile={isMobile}
                            onFocus={() => isMobile && setIsTyping(true)}
                            onBlur={() => isMobile && setIsTyping(false)}
                        />
                    </div>
                );
            case 'code':
                return (
                    <div className="w-full h-full relative pt-[4.5rem]">
                        {isMobile ? <MobileEditorLayout files={codeFiles} setFiles={setCodeFiles} triggerRun={triggerRun} /> : <EditorLayout files={codeFiles} setFiles={setCodeFiles} />}
                    </div>
                );
            case 'image':
            case 'meme': // Unified Visual Mode
                return (
                    <div className={`w-full h-full flex flex-col ${isMobile ? 'pt-4 pb-20' : 'pt-24 pb-32'}`}>
                        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 mb-4 md:mb-8 text-center md:text-left">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Visual Story..."
                                className="text-3xl md:text-5xl font-serif font-bold bg-transparent outline-none w-full placeholder:text-gray-700"
                            />
                        </div>
                        <div className="flex-1 overflow-hidden px-4 md:px-8">
                            <VisualBuilder slides={slides} onChange={setSlides} isMobile={isMobile} />
                        </div>
                    </div>
                );

            case 'video':
                // Keeping Video Separate as per plan (Phase 3)
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Judul Video..."
                            className="text-2xl md:text-4xl font-bold bg-transparent text-center outline-none w-full max-w-2xl mb-8 md:mb-12 placeholder:text-gray-700"
                        />
                        {/* Video Upload Logic remains similar for now until Phase 3 */}
                        {mediaPreview ? (
                            <div className="relative group w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                                <video src={mediaPreview} controls className="w-full h-full object-contain" />
                                <button
                                    onClick={() => { setMediaPreview(null); setMediaFile(null); }}
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-xl h-64 md:h-96 border-4 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-gray-500 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload size={64} className="mb-6 opacity-20" />
                                <h3 className="text-2xl font-bold mb-2">Upload Video</h3>
                                <p className="text-sm opacity-40">Klik atau seret file ke sini</p>
                            </div>
                        )}
                    </div>
                );
            case 'document':
                return (
                    <div className="w-full h-full flex flex-col pt-16 md:pt-24 pb-32">
                        <div className="max-w-4xl mx-auto w-full px-6 md:px-0 mb-8">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul Dokumen..."
                                className="text-4xl md:text-5xl font-serif font-bold bg-transparent outline-none w-full placeholder:text-gray-700"
                            />
                        </div>
                        <div className="flex-1 min-h-[60vh] md:min-h-[75vh] overflow-hidden">
                            <DocumentUploader content={content} onChange={setContent} />
                        </div>
                    </div>
                );
            case 'embed':
                return (
                    <div className="w-full h-full flex flex-col items-center pt-24 px-8">
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul Embed..." className="text-4xl font-bold bg-transparent text-center outline-none w-full mb-12" />
                        <div className="w-full max-w-3xl space-y-8">
                            <div className="bg-[#111] p-2 rounded-2xl border border-white/10 flex gap-4 items-center px-6 shadow-xl leading-none">
                                <Globe className="text-gray-500" />
                                <input value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)} placeholder="https://..." className="bg-transparent flex-1 py-5 outline-none font-mono" />
                            </div>
                            <div className="aspect-video bg-black rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative">
                                {embedUrl ? <WebsiteEmbed url={embedUrl} /> : <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold uppercase tracking-widest">Preview Area</div>}
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    if (isPreview) {
        if (mode === 'image' || mode === 'meme') {
            return (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <button
                        onClick={() => setIsPreview(false)}
                        className="absolute top-4 right-4 mt-safe mr-safe bg-black/50 text-white p-3 rounded-full hover:bg-rose-500 transition-all z-10 backdrop-blur-md border border-white/10 shadow-2xl"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-full h-full p-4 pb-safe flex flex-col justify-center">
                        <PreviewCarousel slides={slides} />
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black flex justify-center custom-scrollbar">
                <div className={`w-full h-full min-h-screen bg-[#0a0a0a] p-6 md:p-16 relative ${isMobile ? 'pt-safe' : ''}`}>
                    <button
                        onClick={() => setIsPreview(false)}
                        className="fixed top-4 right-4 mt-safe mr-safe bg-black/50 text-white p-3 rounded-full hover:bg-rose-500 transition-all z-[60] backdrop-blur-md border border-white/10 shadow-2xl"
                    >
                        <X size={24} />
                    </button>
                    <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 leading-[1.1]">{title}</h1>
                    <div className="flex gap-3 mb-12">
                        <span className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest">{DIVISIONS.find(d => d.id === division)?.name}</span>
                    </div>
                    <div className="prose prose-invert prose-xl max-w-none">
                        {mode === 'text' && <div dangerouslySetInnerHTML={{ __html: content }} />}
                        {mode === 'embed' && <WebsiteEmbed url={embedUrl} />}
                        {mode === 'video' && mediaPreview && (
                            <video src={mediaPreview} controls className="rounded-3xl w-full" />
                        )}
                        {mode === 'code' && (
                            <div className="aspect-video bg-white rounded-3xl overflow-hidden shadow-2xl">
                                <InteractiveSandbox
                                    files={codeFiles}
                                    triggerRun={triggerRun}
                                    onConsole={(log) => console.log(log)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 bg-[#050505] text-white font-sans selection:bg-rose-500/30 flex">
            {/* DRAFT MANAGER SIDEBAR */}
            <AnimatePresence>
                {showDrafts && (
                    <DraftManager
                        currentDraftId={currentDraftId}
                        drafts={drafts.filter(d => d.mode === mode)}
                        onSelect={applyDraft}
                        onDelete={handleDeleteDraft}
                        onNew={() => handleNewDraft(mode)}
                        onClose={() => setShowDrafts(false)}
                    />
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col relative overflow-hidden bg-black pt-safe pb-safe h-safe-screen">
                {/* TOP HEADER */}
                <StudioHeader
                    title={title}
                    setTitle={setTitle}
                    mode={mode}
                    onModeChange={switchMode}
                    draftStatus={draftStatus}
                    draftsCount={drafts.length}
                    showDrafts={showDrafts}
                    onToggleDrafts={() => setShowDrafts(!showDrafts)}
                    onPublish={handlePublish}
                    isPublishing={isPublishing}
                    onSettings={() => setShowSettings(true)}
                    onPreview={() => setIsPreview(true)}
                    onBack={() => navigate('/karya')}
                    isMobile={isMobile}
                />

                {/* MAIN CONTENT */}
                <div className={`flex-1 overflow-hidden ${isMobile ? 'pt-[60px] pb-[80px]' : ''}`}>
                    {renderContent()}
                </div>

                {/* BOTTOM DOCK */}
                {isMobile ? (
                    !isTyping && <MobileActionDock mode={mode} onModeChange={switchMode} onPublish={handlePublish} onSettings={() => setShowSettings(true)} onPreview={() => mode === 'code' ? setTriggerRun(n => n + 1) : setIsPreview(true)} />
                ) : (
                    <div className="fixed bottom-0 left-0 right-0 h-16 z-50 flex items-center justify-center group/footer pointer-events-none">
                        {/* THE DOCK */}
                        <div className={`flex flex-col items-center transition-all duration-500 pointer-events-auto ${isPreview || (mode === 'code' && !dockMinimized) ? 'translate-y-32 opacity-0 group-hover/footer:translate-y-[-16px] group-hover/footer:opacity-100' : 'translate-y-[-16px] opacity-100'}`}>
                            <AnimatePresence mode="wait">
                                {!dockMinimized ? (
                                    <motion.div
                                        key="expanded-dock"
                                        initial={{ y: 20, opacity: 0, scale: 0.9 }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        exit={{ y: 20, opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-2 ring-1 ring-white/5 relative group/dockinner"
                                    >
                                        <button
                                            onClick={() => setDockMinimized(true)}
                                            className="absolute -top-12 left-1/2 -translate-x-1/2 p-2 rounded-full bg-black/50 border border-white/5 text-white/50 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all opacity-0 group-hover/dockinner:opacity-100 translate-y-2 group-hover/dockinner:translate-y-0"
                                            title="Sembunyikan Menu"
                                        >
                                            <ChevronDown size={14} />
                                        </button>

                                        <div className="px-2">
                                            <MediumSelector activeType={mode} onChange={switchMode} />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="minimized-dock"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        className="h-10 flex items-end justify-center pb-2 cursor-pointer"
                                    >
                                        <button
                                            onClick={() => setDockMinimized(false)}
                                            className="w-16 h-1 rounded-full bg-white/20 hover:bg-rose-500/50 transition-all shadow-lg hover:w-24 group/minhandle relative"
                                        >
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/minhandle:opacity-100 transition-all text-[8px] font-black text-rose-500 uppercase tracking-[0.3em] translate-y-1 group-hover/minhandle:translate-y-0 whitespace-nowrap bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                                                Buka Menu
                                            </div>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                )}
            </div>

            {/* SETTINGS (PUBLISH & DRAFT METADATA) */}
            <AnimatePresence>
                {showSettings && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-2 bottom-2 right-2 w-full max-w-sm bg-[#0a0a0a] border border-white/10 z-[70] p-6 shadow-2xl overflow-y-auto rounded-3xl flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Draft Details</h2>
                                    <p className="text-xs text-gray-500 mt-1">Kelola detail karyamu</p>
                                </div>
                                <button onClick={() => setShowSettings(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-6">
                                {/* Thumbnail Upload (Optional) */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                        Thumbnail
                                        <span className="text-gray-700 font-normal normal-case">Optional</span>
                                    </label>
                                    <div className="w-full aspect-video bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative group cursor-pointer hover:border-white/20 transition-all">
                                        {mediaPreview ? (
                                            <>
                                                <img src={mediaPreview} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                                    <span className="text-xs font-bold text-white">Ganti Gambar</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 group-hover:text-gray-400 transition-colors gap-2">
                                                <ImageIcon size={24} />
                                                <span className="text-xs font-medium">Upload Cover</span>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>

                                <MetaField label="Judul" value={title} onChange={setTitle} required />
                                <MetaField label="Deskripsi" value={description} onChange={setDescription} isTextArea placeholder="Ceritakan sedikit tentang karyamu..." />

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                        Divisi
                                        <span className="text-rose-500 font-bold lowercase">Wajib</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {DIVISIONS.map(div => (
                                            <button
                                                key={div.id}
                                                onClick={() => setDivision(div.id as any)}
                                                className={`px-3 py-3 rounded-xl text-[10px] font-bold text-left transition-all border ${division === div.id
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {div.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <MetaField label="Tags" value={tags.join(', ')} onChange={(val) => setTags(val.split(',').map(t => t.trim()))} placeholder="design, art, code..." />
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/5">
                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPublishing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                    {isPublishing ? 'Publishing...' : 'Publish Project'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* PUBLISHING PROGRESS OVERLAY */}
            <AnimatePresence>
                {isPublishing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-rose-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-mono font-bold">{publishProgress.percent}%</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{publishProgress.message}</h2>
                        <p className="text-gray-500 text-sm">Mohon tunggu sebentar...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MetaField = ({ label, value, onChange, isTextArea = false, placeholder = "", required = false }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
            {label}
            {required && <span className="text-rose-500 font-bold lowercase">Wajib</span>}
        </label>
        {isTextArea ? (
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30 focus:bg-white/10 transition-all h-24 resize-none text-sm leading-relaxed text-gray-300 focus:text-white"
                placeholder={placeholder}
            />
        ) : (
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm text-gray-300 focus:text-white"
                placeholder={placeholder}
            />
        )}
    </div>
);
