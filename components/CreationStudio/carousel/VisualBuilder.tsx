import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Plus, X, Trash2, Image as ImageIcon,
    Layout, Scissors, GripVertical, Sparkles,
    Maximize2, Info, ChevronRight, Layers,
    RectangleHorizontal as RatioIcon
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { SlideContent } from '../types';

interface VisualBuilderProps {
    slides: SlideContent[];
    onChange: (slides: SlideContent[]) => void;
}

type AspectRatio = 'auto' | '1:1' | '4:5' | '9:16' | '3:4' | '16:9' | '21:9';

export const VisualBuilder: React.FC<VisualBuilderProps> = ({ slides, onChange }) => {
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('auto');
    const [detectedRatio, setDetectedRatio] = useState<number>(0.8); // Default to 4:5
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- LOGIC: AUTO RATIO DETECTION ---
    const detectRatio = (url: string) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            const ratio = img.width / img.height;
            setDetectedRatio(ratio);
        };
    };

    useEffect(() => {
        if (slides.length > 0 && aspectRatio === 'auto') {
            detectRatio(slides[0].content);
        }
    }, [slides, aspectRatio]);

    const getRatioValue = () => {
        if (aspectRatio === 'auto') return detectedRatio;
        const [w, h] = aspectRatio.split(':').map(Number);
        return w / h;
    };

    // --- LOGIC: PANORAMA SPLITTER ---
    const handlePanoramaUpload = async (file: File) => {
        setIsProcessing(true);
        const img = new Image();
        img.src = URL.createObjectURL(file);

        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentRatio = getRatioValue();
        const slideHeight = img.height;
        const slideWidth = slideHeight * currentRatio;

        const totalSlides = Math.ceil(img.width / slideWidth);
        const newSlides: SlideContent[] = [];

        canvas.height = slideHeight;
        canvas.width = slideWidth;

        for (let i = 0; i < totalSlides; i++) {
            ctx.clearRect(0, 0, slideWidth, slideHeight);
            ctx.drawImage(img, i * slideWidth, 0, slideWidth, slideHeight, 0, 0, slideWidth, slideHeight);

            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
            if (blob) {
                const reader = new FileReader();
                await new Promise(r => {
                    reader.onload = () => {
                        newSlides.push({
                            id: `slide-${Date.now()}-${Math.random()}`,
                            type: 'image',
                            content: reader.result as string,
                            order: slides.length + i
                        });
                        r(null);
                    };
                    reader.readAsDataURL(blob);
                });
            }
        }

        onChange([...slides, ...newSlides]);
        setIsProcessing(false);
    };

    // --- LOGIC: REGULAR UPLOAD ---
    const onDrop = async (acceptedFiles: File[]) => {
        const newSlides = await Promise.all(acceptedFiles.map(async (file, index) => {
            return new Promise<SlideContent>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const content = reader.result as string;
                    if (slides.length === 0 && index === 0 && aspectRatio === 'auto') {
                        detectRatio(content);
                    }
                    resolve({
                        id: `slide-${Date.now()}-${Math.random()}-${index}`,
                        type: 'image',
                        content,
                        order: slides.length + index
                    });
                };
                reader.readAsDataURL(file);
            });
        }));
        onChange([...slides, ...newSlides]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    const { getRootProps: getPanoProps, getInputProps: getPanoInput } = useDropzone({
        onDrop: (files) => { if (files[0]) handlePanoramaUpload(files[0]); },
        accept: { 'image/*': [] },
        multiple: false
    });

    const removeSlide = (id: string) => {
        onChange(slides.filter(s => s.id !== id));
    };

    const ratioOptions: { label: string; value: AspectRatio }[] = [
        { label: 'Auto ✨', value: 'auto' },
        { label: '1:1', value: '1:1' },
        { label: '4:5', value: '4:5' },
        { label: '9:16', value: '9:16' },
        { label: '3:4', value: '3:4' },
        { label: '16:9', value: '16:9' },
        { label: '21:9', value: '21:9' },
    ];

    return (
        <div className="h-full flex flex-col relative group/builder">
            {/* --- PREMIUM FLOATING TOOLBAR --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 opacity-0 group-hover/builder:opacity-100 group-hover/builder:translate-y-2 transition-all duration-500 z-50 pointer-events-none group-hover/builder:pointer-events-auto">
                <div className="bg-black/40 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 shadow-2xl flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <RatioIcon size={14} className="text-rose-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Aspect Ratio</span>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
                        {ratioOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setAspectRatio(opt.value)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${aspectRatio === opt.value
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <div {...getPanoProps()}>
                        <input {...getPanoInput()} />
                        <button className="flex items-center gap-2 px-5 py-2 bg-white text-black hover:bg-rose-500 hover:text-white rounded-full text-[10px] font-black tracking-widest transition-all">
                            <Scissors size={14} />
                            {isProcessing ? 'PROCESSING...' : 'SPLIT PANORAMA'}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- CENTRAL CANVAS --- */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar bg-[#050505] rounded-[3rem] border border-white/5 relative shadow-inner"
            >
                <AnimatePresence mode="wait">
                    {slides.length === 0 ? (
                        <div
                            {...getRootProps()}
                            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-all group/upload"
                        >
                            <motion.div
                                key="empty-content"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex flex-col items-center justify-center"
                            >
                                <input {...getInputProps()} />
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full group-hover/upload:scale-150 transition-transform duration-1000" />
                                    <div className="relative w-32 h-32 rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-2xl transition-transform group-hover/upload:-rotate-6">
                                        <ImageIcon className="text-rose-500" size={48} />
                                        <div className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-xl shadow-xl">
                                            <Plus size={20} />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-white mb-3">Mulai Visual Story</h3>
                                <p className="text-gray-500 text-sm max-w-xs text-center leading-relaxed">
                                    Upload foto atau panorama. Kami akan mendeteksi ratio secara <span className="text-rose-500 font-bold">otomatis</span>.
                                </p>

                                <div className="mt-12 flex items-center gap-8 text-[10px] font-black tracking-[0.3em] text-gray-700 uppercase">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Auto Ratio</div>
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Multi-Select</div>
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /> Panorama</div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <Reorder.Group
                            axis="x"
                            values={slides}
                            onReorder={onChange}
                            className="h-full flex items-center px-[15vw] min-w-max gap-8"
                        >
                            {slides.map((slide, idx) => (
                                <Reorder.Item
                                    key={slide.id}
                                    value={slide}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="relative group/slide shrink-0 cursor-grab active:cursor-grabbing"
                                    style={{
                                        aspectRatio: getRatioValue(),
                                        height: '65%'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-rose-500 animate-pulse-slow blur-2xl opacity-0 group-hover/slide:opacity-20 transition-opacity" />
                                    <div className="w-full h-full relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111] shadow-2xl transition-transform duration-500 group-hover/slide:scale-[1.02]">
                                        <img
                                            src={slide.content}
                                            className="w-full h-full object-contain pointer-events-none"
                                        />

                                        {/* Seamless Edge Indicators */}
                                        <div className="absolute inset-y-0 left-0 w-[1px] bg-white/20" />
                                        <div className="absolute inset-y-0 right-0 w-[1px] bg-white/20" />

                                        {/* Slide Info */}
                                        <div className="absolute top-4 left-6 flex items-center gap-2">
                                            <div className="px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full text-[10px] font-black text-white/50 border border-white/10">
                                                FRAME_0{idx + 1}
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeSlide(slide.id); }}
                                            className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-rose-600 text-white rounded-xl shadow-2xl opacity-0 group-hover/slide:opacity-100 transition-all scale-90 group-hover/slide:scale-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        {/* Sort Handle Label */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/slide:opacity-100 transition-all flex items-center gap-2 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                                            <GripVertical size={12} className="text-rose-500" />
                                            <span className="text-[10px] font-black tracking-widest text-white">REORDER</span>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}

                            {/* --- THEMATIC ADD BUTTON --- */}
                            <div
                                {...getRootProps()}
                                className="shrink-0 group/add cursor-pointer border-2 border-dashed border-white/10 hover:border-rose-500/50 rounded-[2rem] flex items-center justify-center transition-all bg-white/[0.02] hover:bg-rose-500/[0.02]"
                                style={{
                                    aspectRatio: getRatioValue(),
                                    height: '65%'
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-full h-full flex flex-col items-center justify-center"
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 group-hover/add:text-white group-hover/add:bg-rose-500 group-hover/add:border-transparent transition-all shadow-2xl rotate-45 group-hover/add:rotate-0">
                                            <Plus size={32} className="-rotate-45 group-hover/add:rotate-0 transition-transform" />
                                        </div>
                                        <span className="text-[10px] font-black tracking-[0.4em] text-gray-700 group-hover/add:text-rose-500 text-center">ADD FRAME</span>
                                    </div>
                                </motion.div>
                            </div>
                        </Reorder.Group>
                    )}
                </AnimatePresence>
            </div>

            {/* --- FILMSTRIP FOOTLINE --- */}
            <div className="p-8 flex justify-between items-center bg-[#0a0a0a] rounded-b-[3rem] border-x border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="flex -space-x-3">
                        {slides.slice(0, 5).map((s, i) => (
                            <img key={i} src={s.content} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] object-cover" />
                        ))}
                    </div>
                    <div>
                        <div className="text-white font-black text-xs tracking-widest">{slides.length} SEQUENCES</div>
                        <div className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Story Timeline Active</div>
                    </div>
                </div>

                <div className="flex items-center gap-8 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <Sparkles size={12} className="text-rose-500" />
                        {aspectRatio === 'auto' ? 'AI RATIO ACTIVE' : `RATIO: ${aspectRatio}`}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Layout size={12} />
                        DRAG TO REARRANGE
                    </div>
                </div>
            </div>
        </div>
    );
};
