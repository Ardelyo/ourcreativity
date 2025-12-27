import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check, Upload, Globe, FileText, Video } from 'lucide-react';

import { Medium, CreationData, SlideContent, WorkType } from './types';
import { MediumSelector } from './MediumSelector';
import { CodeEditor, TextEditor } from './editors';
import { IframeSandbox } from './sandbox/IframeSandbox';
import { PyodideSandbox } from './sandbox/PyodideSandbox';
import { SlideBuilder } from './carousel/SlideBuilder';
import { supabase } from '../../lib/supabase';

// Re-using the props interface
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (data: any) => void;
}

type Step = 'selection' | 'editor' | 'details';

const divisions = [
    { id: 'graphics', name: 'Grafis' },
    { id: 'video', name: 'Video' },
    { id: 'writing', name: 'Tulisan' },
    { id: 'meme', name: 'Meme' },
    { id: 'coding', name: 'Coding' },
];

export const CreationStudio: React.FC<Props> = ({ isOpen, onClose, onPublish }) => {
    const [step, setStep] = useState<Step>('selection');
    const [medium, setMedium] = useState<Medium | null>(null);
    const [subMode, setSubMode] = useState<'default' | 'slide'>('default');

    // Form Data State
    const [formData, setFormData] = useState<Partial<CreationData>>({
        title: '',
        description: '',
        author: '',
        division: 'graphics',
        tags: [],
        content: '',
        slides: [],
        code_language: 'javascript'
    });

    // Execution State
    const [triggerRun, setTriggerRun] = useState(0);
    const [consoleOutput, setConsoleOutput] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMediumSelect = (m: Medium) => {
        setMedium(m);
        setStep('editor');
        setSubMode('default');

        // Auto-set division
        let div = 'graphics';
        if (m === 'narasi') div = 'writing';
        if (m === 'kode') div = 'coding';
        if (m === 'sinema') div = 'video';

        setFormData(prev => ({ ...prev, division: div as any }));
    };

    const handlePublish = () => {
        // Prepare final data based on medium
        let finalType = 'image';
        if (medium === 'kode') finalType = 'code';
        if (medium === 'narasi') finalType = 'text';
        if (medium === 'sinema') finalType = 'video';
        if (medium === 'visual' && (formData.slides && formData.slides.length > 1)) finalType = 'slide';

        onPublish({
            ...formData,
            id: Date.now(),
            type: finalType,
            role: "Member",
            created_at: new Date().toISOString()
        });
        onClose();
        setTimeout(() => {
            setStep('selection');
            setMedium(null);
            setSubMode('default');
            setFormData({
                title: '', description: '', author: '', division: 'graphics', tags: [], content: '', slides: []
            });
        }, 500);
    };

    const [isPublishing, setIsPublishing] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        // Preview locally first
        const reader = new FileReader();
        reader.onloadend = () => {
            const url = reader.result as string;
            setFormData(prev => ({ ...prev, image: url }));
        };
        reader.readAsDataURL(file);

        // Actual upload will happen on Publish to keep it efficient, 
        // or we store the file object to upload now.
        // Let's store the file for later upload to avoid abandoned files.
        setFormData(prev => ({ ...prev, _pendingFile: file }));
    };

    const uploadFile = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('works')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('works')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handlePublishInternal = async () => {
        try {
            setIsPublishing(true);
            let finalData = { ...formData };

            // Upload main image/video if exists
            if (formData._pendingFile) {
                const publicUrl = await uploadFile(formData._pendingFile as File);
                finalData.image_url = publicUrl;
                delete finalData._pendingFile;
            }

            // Upload slides images if any
            if (formData.slides && formData.slides.length > 0) {
                const updatedSlides = await Promise.all(formData.slides.map(async (slide) => {
                    if (slide.type === 'image' && slide.content.startsWith('data:')) {
                        // Extract blob from data URL
                        const res = await fetch(slide.content);
                        const blob = await res.blob();
                        const file = new File([blob], `slide_${slide.id}.jpg`, { type: 'image/jpeg' });
                        const publicUrl = await uploadFile(file);
                        return { ...slide, content: publicUrl };
                    }
                    return slide;
                }));
                finalData.slides = updatedSlides;
            }

            // Determine type and thumbnail
            let finalType = finalData.type || 'image';

            // Priority: Trust the subMode selection
            if (medium === 'visual') {
                if (subMode === 'slide') {
                    finalType = 'image';
                } else {
                    finalType = 'image';
                }
            } else if (medium === 'kode') {
                finalType = 'code';
            } else if (medium === 'narasi') {
                finalType = 'text';
            } else if (medium === 'sinema') {
                finalType = 'video';
            }

            // Fallback for image_url if it's a slide work
            // If image_url is missing (because we uploaded slides but not a main image), use the first slide
            if (!finalData.image_url && finalData.slides && finalData.slides.length > 0) {
                const firstImageSlide = finalData.slides.find(s => s.type === 'image');
                if (firstImageSlide) {
                    finalData.image_url = firstImageSlide.content;
                }
            }

            // SET THE FINAL TYPE
            finalData.type = finalType;

            // Cleanup payload before sending to Supabase
            // We remove 'image' (the local preview base64) to keep the DB entry clean
            if ('image' in finalData) delete (finalData as any).image;
            if ('_pendingFile' in finalData) delete (finalData as any)._pendingFile;

            // Wait for DB insertion to complete
            await onPublish(finalData);

            // Close and Reset
            onClose();
            setTimeout(() => {
                setStep('selection');
                setMedium(null);
                setSubMode('default');
                setFormData({
                    title: '', description: '', author: '', division: 'graphics', tags: [], content: '', slides: []
                });
            }, 500);

        } catch (error: any) {
            console.error('Error during upload:', error);
            alert('Gagal mengunggah media: ' + error.message);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-[70] w-full max-w-6xl h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto mx-4"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/50 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4">
                                {step !== 'selection' && (
                                    <button onClick={() => setStep(step === 'details' ? 'editor' : 'selection')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-white">
                                        {step === 'selection' && 'Creation Studio'}
                                        {step === 'editor' && `Editor: ${medium?.toUpperCase()}`}
                                        {step === 'details' && 'Final Details'}
                                    </h2>
                                </div>
                            </div>


                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden relative flex">
                            {/* Step 1: Selection */}
                            {step === 'selection' && (
                                <div className="w-full h-full overflow-y-auto">
                                    <MediumSelector
                                        activeType={(medium === 'visual' ? 'image' : medium === 'narasi' ? 'text' : medium === 'sinema' ? 'video' : medium === 'kode' ? 'code' : 'text') as WorkType}
                                        onChange={(type) => {
                                            // Map WorkType back to Medium for current component state
                                            const map: Record<string, Medium> = {
                                                text: 'narasi',
                                                document: 'narasi',
                                                image: 'visual',
                                                video: 'sinema',
                                                code: 'kode'
                                            };
                                            const m = map[type] || 'visual';
                                            handleMediumSelect(m);
                                        }}
                                    />
                                </div>
                            )}

                            {/* Step 2: Editor */}
                            {step === 'editor' && (
                                <div className="w-full h-full flex flex-col md:flex-row">
                                    {/* Main Editor Surface */}
                                    <div className={`flex-1 p-4 relative flex flex-col ${medium === 'kode' ? 'w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-white/5' : 'h-full'}`}>

                                        {/* --- KODE EDITOR --- */}
                                        {medium === 'kode' && (
                                            <CodeEditor
                                                value={formData.content || ''}
                                                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                                language={formData.code_language || 'javascript'}
                                                onLanguageChange={(lang) => setFormData(prev => ({ ...prev, code_language: lang }))}
                                                onRun={() => setTriggerRun(prev => prev + 1)}
                                                isExecuting={isExecuting}
                                            />
                                        )}

                                        {/* --- NARASI EDITOR --- */}
                                        {medium === 'narasi' && (
                                            <TextEditor
                                                content={formData.content || ''}
                                                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                                                className="h-full"
                                            />
                                        )}

                                        {/* --- VISUAL (SLIDES/IMAGE) EDITOR --- */}
                                        {medium === 'visual' && (
                                            <div className="h-full flex flex-col gap-4">
                                                <div className="flex gap-2 mb-2">
                                                    <button
                                                        onClick={() => setSubMode('default')}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${subMode === 'default' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
                                                    >
                                                        Single Image
                                                    </button>
                                                    <button
                                                        onClick={() => setSubMode('slide')}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${subMode === 'slide' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
                                                    >
                                                        Slide Series
                                                    </button>
                                                </div>

                                                {subMode === 'slide' ? (
                                                    <SlideBuilder
                                                        slides={formData.slides || []}
                                                        onChange={(slides) => setFormData(prev => ({ ...prev, slides }))}
                                                    />
                                                ) : (
                                                    <div
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className={`h-full rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all group relative overflow-hidden`}
                                                    >
                                                        {formData.image ? (
                                                            <img src={formData.image} alt="Preview" className="max-h-full max-w-full object-contain" />
                                                        ) : (
                                                            <div className="text-center">
                                                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                                                    <Upload className="text-gray-400 group-hover:text-white" size={32} />
                                                                </div>
                                                                <h3 className="text-xl font-bold text-white mb-2">Upload Image</h3>
                                                                <p className="text-gray-500 text-sm">PNG, JPG or WEBP</p>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={handleImageUpload}
                                                            accept="image/*"
                                                            className="hidden"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* --- SINEMA / YOUTUBE EMBED --- */}
                                        {medium === 'sinema' && (
                                            <div className="h-full flex flex-col gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">YouTube Link</label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Globe size={18} className="text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                                                        </div>
                                                        <input
                                                            type="url"
                                                            placeholder="https://www.youtube.com/watch?v=..."
                                                            value={formData.content || ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setFormData(prev => ({ ...prev, content: val }));

                                                                // Extract YouTube ID for preview if possible
                                                                if (val.includes('youtube.com') || val.includes('youtu.be')) {
                                                                    const videoId = val.split('v=')[1]?.split('&')[0] || val.split('/').pop();
                                                                    if (videoId) {
                                                                        setFormData(prev => ({ ...prev, image: `https://www.youtube.com/embed/${videoId}` }));
                                                                    }
                                                                } else {
                                                                    setFormData(prev => ({ ...prev, image: '' }));
                                                                }
                                                            }}
                                                            className="w-full bg-[#111] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-rose-500/50 transition-all text-lg font-medium"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest pl-1">Mendukung link video, shorts, dan mobile.</p>
                                                </div>

                                                <div className="flex-1 rounded-3xl border border-white/5 bg-black/40 overflow-hidden relative group">
                                                    {formData.content && formData.image?.includes('youtube.com/embed') ? (
                                                        <iframe
                                                            src={formData.image}
                                                            className="w-full h-full"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            title="YouTube Preview"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                                                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                                                <Video className="text-gray-600 group-hover:text-gray-400" size={32} />
                                                            </div>
                                                            <h4 className="text-white font-bold mb-2">Pratinjau Video</h4>
                                                            <p className="text-gray-500 text-sm max-w-xs">Masukkan link YouTube di atas untuk melihat cuplikan karyamu.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Code Preview Panel (Only for Kode) */}
                                    {medium === 'kode' && (
                                        <div className="w-full md:w-1/2 h-1/2 md:h-full p-4 bg-[#050505] flex flex-col">
                                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex justify-between">
                                                <span>Live Preview</span>
                                                {/* Hidden Pyodide Bridge */}
                                                <PyodideSandbox
                                                    code={formData.code_language === 'python' ? (formData.content || '') : ''}
                                                    triggerRun={formData.code_language === 'python' ? triggerRun : 0}
                                                    onOutput={(out) => setConsoleOutput(prev => prev + out)}
                                                    onError={(err) => setConsoleOutput(prev => prev + `\n🛑 Error: ${err}`)}
                                                />
                                            </div>

                                            <div className="flex-1 rounded-xl border border-white/10 overflow-hidden bg-white relative">
                                                <IframeSandbox
                                                    code={formData.content || ''}
                                                    triggerRun={triggerRun}
                                                    language={formData.code_language || 'html'}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Details */}
                            {step === 'details' && (
                                <div className="w-full h-full overflow-y-auto p-8">
                                    <div className="max-w-2xl mx-auto space-y-8">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full bg-transparent text-4xl font-serif font-bold text-white placeholder:text-gray-800 focus:outline-none border-b border-white/10 focus:border-white/50 pb-2"
                                                placeholder="Your Title..."
                                                autoFocus
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Division</label>
                                                <select
                                                    value={formData.division}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, division: e.target.value as any }))}
                                                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                                >
                                                    {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Author Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.author}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Tags (comma separated)</label>
                                            <input
                                                type="text"
                                                value={formData.tags?.join(', ')}
                                                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                                placeholder="design, tutorial, snippet"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none h-32 resize-none"
                                                placeholder="Tell us about your work..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {step !== 'selection' && (
                            <div className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-md flex justify-end gap-4">
                                {step === 'editor' ? (
                                    <button
                                        onClick={() => setStep('details')}
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        Next <ArrowRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePublishInternal}
                                        disabled={isPublishing}
                                        className="bg-accent-rose text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPublishing ? (
                                            <>Memproses... <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /></>
                                        ) : (
                                            <><Check size={18} /> Publish to Feed</>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
