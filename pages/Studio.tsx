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

// sub-komponen buat studio
import { EditorLayout } from '@/components/CreationStudio/ControlCenter/EditorLayout';
import { MobileEditorLayout } from '@/components/CreationStudio/ControlCenter/MobileEditorLayout';
import { MobileActionDock } from '@/components/CreationStudio/ControlCenter/MobileActionDock';
import { CodeFile } from '@/components/CreationStudio/ControlCenter/types';
import { DraftManager } from '@/components/CreationStudio/ControlCenter/DraftManager';
import { TextEditor } from '@/components/CreationStudio/editors/TextEditor';
import { VisualBuilder } from '@/components/CreationStudio/carousel/VisualBuilder';

import { MediumSelector } from '@/components/CreationStudio/MediumSelector';
import { PreviewCarousel } from '@/components/CreationStudio/PreviewCarousel';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { CreationData, WorkType, DivisionId } from '@/components/CreationStudio/types';
import { useQueryClient } from '@tanstack/react-query';
import { useLoadingStatus } from '@/components/LoadingTimeoutProvider';

import { toast } from 'react-hot-toast';
import { InteractiveSandbox } from '@/components/CreationStudio/ControlCenter/InteractiveSandbox';
import { StudioHeader } from '@/components/CreationStudio/StudioHeader';
import { LogEntry } from '@/components/CreationStudio/ControlCenter/LogContainer';
import { useSystemLog } from '@/components/SystemLogProvider';
import { MobileStudio } from '@/components/CreationStudio/Mobile/MobileStudio';

type Division = 'graphics' | 'tech' | 'music' | 'writing' | 'meme' | 'video';

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

    const handleBack = () => navigate('/karya');

    // --- state: manage draft-draft ---
    const [drafts, setDrafts] = useState<any[]>([]);
    const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
    const [showDrafts, setShowDrafts] = useState(false);

    // --- state: mode sama konten ---
    const [mode, setMode] = useState<WorkType>('text');
    const [title, setTitle] = useState(''); // Default empty to show placeholder
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [slides, setSlides] = useState<any[]>([]);
    const [codeLanguage, setCodeLanguage] = useState('html');
    const [carouselSlides, setCarouselSlides] = useState<any[]>([]);
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>(DEFAULT_PROJECT_FILES);

    const queryClient = useQueryClient();
    const { setIsLoading, reportLoadingComplete } = useLoadingStatus();

    // --- state: metadata karya ---
    const [description, setDescription] = useState('');
    const [division, setDivision] = useState<DivisionId>('graphics');
    const [tags, setTags] = useState<string[]>([]);

    // --- state: tampilan ui ---
    const [showSettings, setShowSettings] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
    const [publishProgress, setPublishProgress] = useState({ percent: 0, message: '' });

    const { uploadMedia, uploadImage, uploading: mediaUploading, progress: mediaProgress } = useMediaUpload();

    // --- state: jalanin kode ---
    const [triggerRun, setTriggerRun] = useState(0);
    const [dockMinimized, setDockMinimized] = useState(false);
    const [isTyping, setIsTyping] = useState(false); // state keyboard di mobile

    // --- use global system logs ---
    const { addLog } = useSystemLog();

    // --- effect: load awal ---
    useEffect(() => {
        if (!authLoading && !user) navigate('/login');

        const savedDrafts = localStorage.getItem('oc_studio_v2_drafts');
        if (savedDrafts) {
            try {
                const parsed = JSON.parse(savedDrafts);
                // migrate semua draft 'slide' jadi 'image' agar terbuka di VisualBuilder tapi tetap dikenal sebagai slide secara internal
                const migrated = parsed.map((d: any) => d.mode === 'slide' ? { ...d, mode: 'image' } : d);
                setDrafts(migrated);

                if (migrated.length > 0) {
                    // coba load draft paling baru dari mode yang aktif (default text)
                    const mostRecentOfMode = migrated
                        .filter((d: any) => d.mode === mode)
                        .sort((a: any, b: any) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime())[0];

                    if (mostRecentOfMode) {
                        applyDraft(mostRecentOfMode);
                    } else {
                        // kalo ga ada draft buat mode ini, load draft paling baru aja
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
        setTitle(draft.title || '');
        setMode(draft.mode || 'text');
        setContent(draft.content || '');
        setDescription(draft.description || '');

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
            title: '',
            mode: targetMode,
            content: '',
            lastSaved: new Date().toISOString()
        };
        // jangan tambahin ke list dulu, nanti pas save pertama kali aja
        applyDraft(newDraft);
        setShowDrafts(false);
    };

    const switchMode = (newMode: WorkType) => {
        if (newMode === mode) return;

        // coba cari draft paling baru dari mode BARU
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

    // --- effect: auto-save (optimized) ---
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSaveDataRef = useRef<string>('');

    const saveDraftsToStorage = useCallback(() => {
        if (!currentDraftId) return;

        // smart save: cuma save kalo title berubah atau ada content
        const isDefaultTitle = title === 'Karya Tanpa Judul' || !title.trim();
        const hasContent = content.trim().length > 0 || slides.length > 0 || codeFiles.length > 3;

        if (isDefaultTitle && !hasContent) {
            console.log("Skipping auto-draft: empty draft");
            return;
        }

        // cek apa datanya beneran berubah
        const currentData = {
            id: currentDraftId,
            title, mode, content, description, codeLanguage, slides, tags, division, codeFiles,
            mediaPreview,
            lastSaved: new Date().toISOString()
        };

        const currentDataStr = JSON.stringify({ title, mode, content, description, slides, codeFiles });
        if (currentDataStr === lastSaveDataRef.current) {
            console.log("Skipping auto-draft: no changes detected");
            return;
        }

        lastSaveDataRef.current = currentDataStr;

        setDraftStatus('saving');
        const updatedDrafts = drafts.filter(d => d.id !== currentDraftId);
        updatedDrafts.unshift(currentData); // taro current di paling atas

        setDrafts(updatedDrafts);
        localStorage.setItem('oc_studio_v2_drafts', JSON.stringify(updatedDrafts));

        setTimeout(() => setDraftStatus('saved'), 500);
        setTimeout(() => setDraftStatus('idle'), 2500);
    }, [currentDraftId, title, mode, content, description, codeLanguage, slides, tags, division, codeFiles, mediaPreview, drafts]);

    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        // debounce naikin jadi 5 detik biar ga terlalu sering save
        saveTimeoutRef.current = setTimeout(saveDraftsToStorage, 5000);
        return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
    }, [saveDraftsToStorage]);

    // --- handler upload ---

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log(`[Studio] File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

        // Just set the file, compression will happen during publish
        setMediaFile(file);
        setMediaPreview(URL.createObjectURL(file));
    };

    const uploadToSupabase = async (file: File | Blob, path?: string, onProgress?: (percent: number) => void) => {
        if (!user) throw new Error("User session not found");

        const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
        const fileName = path || `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const bucketName = 'works'; // Primary bucket

        console.log(`[Studio] Starting upload to bucket '${bucketName}': ${fileName}`, {
            size: file.size,
            type: file.type
        });

        const { error, data } = await supabase.storage.from(bucketName).upload(fileName, file, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
            // @ts-ignore - Supabase v2 support onUploadProgress
            onUploadProgress: (progress) => {
                const percent = (progress.loaded / progress.total) * 100;
                console.log(`[Studio] Upload progress: ${percent.toFixed(2)}%`);
                if (onProgress) onProgress(percent);
            }
        });

        if (error) {
            console.error(`[Studio] Upload failed for bucket '${bucketName}':`, error);

            // Helpful error mapping
            if (error.message.includes('bucket not found') || error.message.includes('Bucket not found')) {
                throw new Error(`Bucket '${bucketName}' tidak ditemukan di Supabase. Pastikan bucket sudah dibuat di Storage Dashboard.`);
            }
            if (error.message.includes('Policy') || error.message.includes('permission')) {
                throw new Error(`Gagal upload: Masalah hak akses (RLS Policies). Pastikan bucket '${bucketName}' mengizinkan upload oleh user.`);
            }

            throw error;
        }

        console.log(`[Studio] Upload successful:`, data);
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        return urlData.publicUrl;
    };

    const processSlidesForUpload = async (slidesData: any[]) => {
        if (!slidesData || slidesData.length === 0) return [];

        console.log(`[Studio] Processing ${slidesData.length} slides for upload`);

        const processedSlides = await Promise.all(slidesData.map(async (slide, index) => {
            // cek apa contentnya base64
            if (slide.content && slide.content.startsWith('data:image')) {
                try {
                    console.log(`[Studio] Uploading slide ${index + 1}/${slidesData.length}`);
                    // convert base64 jadi blob
                    const fetchRes = await fetch(slide.content);
                    const blob = await fetchRes.blob();

                    // upload ke storage
                    const fileName = `${user?.id}/slides/${Date.now()}_${index}.jpg`;
                    const publicUrl = await uploadToSupabase(blob, fileName);

                    return { ...slide, content: publicUrl };
                } catch (e) {
                    console.error(`[Studio] Failed to upload slide ${index + 1}`, e);
                    return slide; // return original kalo gagal, tapi mungkin gagal insert db
                }
            }
            return slide; // udah jadi url atau text
        }));

        return processedSlides;
    };

    const handlePublish = async () => {
        // Detailed debugging log
        console.log("[Studio] handlePublish triggered", {
            mode,
            title,
            division,
            mediaFile: mediaFile ? `${mediaFile.name} (${mediaFile.size} bytes)` : "NULL",
            mediaPreview: mediaPreview ? (mediaPreview.length > 50 ? mediaPreview.substring(0, 50) + "..." : mediaPreview) : "NULL"
        });

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

        // Safety check for missing file scenarios (e.g. Broken draft state)
        if ((mode === 'video' || mode === 'image') && !mediaFile && mediaPreview && mediaPreview.startsWith('blob:')) {
            alert("File media tidak ditemukan! Kemungkinan Anda me-refresh halaman sehingga referensi file hilang. Silakan pilih ulang file media Anda.");
            // Reset state to force re-selection
            setMediaFile(null);
            setMediaPreview(null);
            return;
        }

        try {
            setIsPublishing(true);
            setIsLoading(true);
            setPublishProgress({ percent: 5, message: 'Menyiapkan publikasi...' });
            addLog("Memulai proses publikasi karya...", 'info');

            // 1. Upload Thumbnail/Media utama
            let finalImageUrl = mediaPreview;
            let finalThumbnailUrl = null;

            if (mediaFile && (mode === 'image' || mode === 'video' || mode === 'meme')) {
                console.log("[Studio] Uploading with compression...");
                setPublishProgress({ percent: 10, message: 'Mengoptimasi & mengunggah media...' });

                const uploadResult = await uploadMedia(mediaFile, {
                    bucket: 'works',
                    folder: mode === 'video' ? 'videos' : 'images',
                    generateThumbnail: true,
                    onProgress: (p) => {
                        setPublishProgress({
                            percent: 10 + (p * 0.6),
                            message: p < 60 ? 'Mengompres media...' : `Mengunggah (${p}%)...`
                        });
                    }
                });

                finalImageUrl = uploadResult.url;
                finalThumbnailUrl = uploadResult.thumbnailUrl;
                addLog(`Media berhasil diunggah: ${finalImageUrl}`, 'success');
                console.log("[Studio] Media uploaded:", uploadResult);
            } else if (mode === 'video' && !finalImageUrl) {
                throw new Error("File video wajib diupload!");
            }

            // 2. Upload Slide (kalo mode visual)
            setPublishProgress({ percent: 40, message: 'Memproses slide visual...' });
            let finalSlides = slides;
            if (mode === 'image' || mode === 'meme' || mode === 'slide') {
                addLog(`Memproses ${slides.length} slide visual...`, 'process');
                finalSlides = await processSlidesForUpload(slides);
                addLog("Semua slide visual berhasil diunggah.", 'success');
            }

            // 3. Prepare final content
            let finalContent = mode === 'code' ? JSON.stringify(codeFiles) : content;


            setPublishProgress({ percent: 85, message: 'Menyimpan metadata ke database...' });
            addLog("Menyimpan metadata ke database...", 'process');
            console.log("[Studio] Preparing payload for database insert");

            const payload = {
                title,
                description,
                image_url: finalImageUrl,
                author: profile?.username || 'Anonymous',
                author_id: user?.id,
                profile_id: user?.id,
                role: profile?.role || 'Member',
                division,
                type: mode,
                tags,
                content: finalContent,
                code_language: mode === 'code' ? codeLanguage : null,
                slides: (mode === 'image' || mode === 'meme' || mode === 'slide') ? finalSlides : null,
                thumbnail_url: finalThumbnailUrl,
                updated_at: new Date().toISOString()
            };

            const { error: dbError } = await supabase.from('works').insert([payload]);
            if (dbError) throw dbError;

            console.log("[Studio] Publish successful!");
            addLog("Karya berhasil dipublikasikan ke server!", 'success');
            toast.success('Karya berhasil dipublikasikan!');

            // Invalidate query biar data update
            await queryClient.invalidateQueries({ queryKey: ['works'] });
            await queryClient.refetchQueries({ queryKey: ['works'] });

            setPublishProgress({ percent: 100, message: 'Berhasil!' });
            handleDeleteDraft(currentDraftId!); // hapus dari draft abis publish
            reportLoadingComplete();
            setTimeout(() => navigate('/karya'), 800);
        } catch (err: any) {
            console.error("[Studio] Publish error:", err);
            addLog(`Error Publikasi: ${err.message || 'Kesalahan Server'}`, 'error');
            setIsLoading(false);
            alert("Gagal Publikasi: " + (err.message || "Terjadi kesalahan pada server."));
            setIsPublishing(false);
        }
    };

    // render konten sesuai mode
    const renderContent = () => {
        switch (mode) {
            case 'text':
                return (
                    <div className={`w-full max-w-4xl mx-auto ${isMobile ? 'px-2 pt-4 pb-20' : 'px-6 md:px-0 pt-24 pb-32'}`}>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Judul Karya Tulis..."
                            className={`font-serif font-bold bg-transparent outline-none w-full mb-8 placeholder:text-white/10 ${isMobile ? 'text-3xl text-left px-2' : 'text-4xl md:text-5xl text-center'}`}
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
                    <div className={`w-full h-full relative ${isMobile ? 'pt-0' : 'pt-[4.5rem]'}`}>
                        {isMobile ? (
                            <MobileEditorLayout
                                files={codeFiles}
                                setFiles={setCodeFiles}
                                triggerRun={triggerRun}
                                onBack={handleBack}
                                onPublish={handlePublish}
                                isPublishing={isPublishing}
                            />
                        ) : (
                            <EditorLayout files={codeFiles} setFiles={setCodeFiles} />
                        )}
                    </div>
                );
            case 'image':
            case 'meme':
            case 'slide':
                return (
                    <div className={`w-full flex flex-col ${isMobile ? 'pt-6 pb-24' : 'pt-24 pb-32'}`}>
                        <div className="max-w-4xl mx-auto w-full px-6 md:px-0 mb-8 md:mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative group"
                            >
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Abadikan Momentum..."
                                    className="text-4xl md:text-6xl font-serif font-bold bg-transparent outline-none w-full placeholder:text-white/5 border-b border-white/5 pb-4 focus:border-rose-500/30 transition-all duration-700 text-center"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-px bg-rose-500 group-focus-within:w-full transition-all duration-1000" />
                            </motion.div>
                            <p className="mt-4 text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase text-center">
                                {slides.length > 1 ? 'Slide Visual' : 'Gambar Tunggal'}
                            </p>
                        </div>
                        <div className={`w-full ${isMobile ? 'flex-1 min-h-[400px]' : 'h-[750px]'} px-4 md:px-12 transition-all duration-500`}>
                            <VisualBuilder slides={slides} onChange={setSlides} isMobile={isMobile} addLog={addLog} />
                        </div>
                    </div>
                );

            case 'video':
                // video masih terpisah sesuai plan (fase 3)
                return (
                    <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center p-6 md:p-12">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Judul Video..."
                            className="text-2xl md:text-4xl font-bold bg-transparent text-center outline-none w-full max-w-2xl mb-8 md:mb-12 placeholder:text-gray-700"
                        />
                        {/* logika upload video masih sama dulu sampe fase 3 */}
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
                                <p className="text-sm opacity-40">Maks. 50MB (Lebih baik pakai Slide/Embed)</p>
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    };

    if (isPreview) {
        if (mode === 'image' || mode === 'meme' || mode === 'slide') {
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
                        <span className="px-6 py-2 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                            {DIVISIONS.find(d => d.id === division)?.name || 'Karya Kreatif'}
                        </span>
                    </div>
                    <div className="prose prose-invert prose-xl max-w-none">
                        {mode === 'text' && <div dangerouslySetInnerHTML={{ __html: content }} />}

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
    if (isMobile) {
        return (
            <MobileStudio
                mode={mode}
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                codeFiles={codeFiles}
                setCodeFiles={setCodeFiles}
                slides={slides}
                setSlides={setSlides}
                draftStatus={draftStatus}
                isPublishing={isPublishing}
                onBack={handleBack}
                onPublish={handlePublish}
                onToggleDrafts={() => setShowDrafts(!showDrafts)}
                onSettings={() => setShowSettings(true)}
                switchMode={switchMode}
                triggerRun={triggerRun}
                setTriggerRun={setTriggerRun}
                isTyping={isTyping}
                setIsTyping={setIsTyping}
                addLog={addLog}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-rose-500/30 selection:text-white flex flex-col relative overflow-hidden">
            <div className="flex-1 flex flex-col relative bg-black pt-safe pb-safe min-h-screen">
                {/* header atas */}
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
                    onBack={handleBack}
                    isMobile={isMobile}
                />

                {/* konten utama */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar`}>
                    {renderContent()}
                </div>

                {/* dock bawah */}
                <div className="fixed bottom-0 left-0 right-0 h-20 z-50 flex items-end justify-center group/footer pointer-events-none">
                    {/* zone trigger hover invisible soalnya wrappernya pointer-events-none */}
                    <div className="absolute inset-0 pointer-events-auto" />

                    {/* docknya */}
                    <div className={`flex flex-col items-center transition-all duration-500 pointer-events-auto translate-y-24 opacity-0 group-hover/footer:translate-y-[-16px] group-hover/footer:opacity-100`}>
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

                {/* settings (publish & metadata draft) */}
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
                                        <h2 className="text-xl font-bold text-white">Detail Draft</h2>
                                        <p className="text-xs text-gray-500 mt-1">Kelola detail karyamu</p>
                                    </div>
                                    <button onClick={() => setShowSettings(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-6">
                                    {/* thumbnail upload (opsional) */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                            Thumbnail
                                            <span className="text-gray-700 font-normal normal-case">Opsional</span>
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
                                        {isPublishing ? 'Mempublikasikan...' : 'Publikasikan Proyek'}
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

            const MetaField = ({label, value, onChange, isTextArea = false, placeholder = "", required = false}: any) => (
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
