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
import { compressImage } from '../../../lib/image-utils';

interface VisualBuilderProps {
    slides: SlideContent[];
    onChange: (slides: SlideContent[]) => void;
    isMobile?: boolean; // New prop
}

type AspectRatio = 'auto' | '1:1' | '4:5' | '9:16' | '3:4' | '16:9' | '21:9';

export const VisualBuilder: React.FC<VisualBuilderProps> = ({ slides, onChange, isMobile = false }) => {
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
            const compressedFile = await compressImage(file);
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
                        file: compressedFile, // Store compressed file
                        order: slides.length + index
                    });
                };
                reader.readAsDataURL(compressedFile);
            });
        }));
        onChange([...slides, ...newSlides]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        noClick: true // Prefer explicit add button interactions on mobile
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
        { label: 'Auto', value: 'auto' },
        { label: '1:1', value: '1:1' },
        { label: '4:5', value: '4:5' },
        { label: '9:16', value: '9:16' },
        { label: '16:9', value: '16:9' },
    ];

    return (
        <div className="h-full flex flex-col relative group/builder">
            {/* --- TOOLBAR (Responsive) --- */}
            <div className={`absolute left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-full max-w-lg px-4
                ${isMobile ? 'bottom-4' : 'top-0 -translate-y-4 opacity-0 group-hover/builder:opacity-100 group-hover/builder:translate-y-2'}
            `}>
                <div className="bg-black/60 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 shrink-0">
                        <RatioIcon size={14} className="text-rose-500" />
                    </div>

                    <div className="flex gap-2 shrink-0">
                        {ratioOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setAspectRatio(opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all whitespace-nowrap ${aspectRatio === opt.value
                                    ? 'bg-rose-500 text-white'
                                    : 'text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="h-4 w-px bg-white/10 shrink-0" />

                    <div {...getPanoProps()} className="shrink-0">
                        <input {...getPanoInput()} />
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded-lg text-[10px] font-bold tracking-wider hover:bg-rose-500 hover:text-white transition-colors">
                            <Scissors size={14} />
                            {isProcessing ? '...' : 'SPLIT'}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- CENTRAL CANVAS --- */}
            <div
                ref={scrollContainerRef}
                className={`flex-1 overflow-x-auto overflow-y-hidden no-scrollbar bg-[#050505] rounded-[2rem] border border-white/5 relative shadow-inner ${isMobile ? 'mb-20' : ''}`}
            >
                <AnimatePresence mode="wait">
                    {slides.length === 0 ? (
                        <div
                            {...getRootProps({ onClick: (e) => e.stopPropagation() })}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <label className="cursor-pointer group/upload text-center">
                                <input {...getInputProps()} className="hidden" />
                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full group-hover/upload:scale-150 transition-transform duration-1000" />
                                    <div className="relative w-24 h-24 rounded-[2rem] bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-2xl transition-transform group-hover/upload:-rotate-6">
                                        <ImageIcon className="text-rose-500" size={32} />
                                        <div className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 rounded-lg shadow-xl">
                                            <Plus size={16} />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-white mb-2">Mulai Story</h3>
                                <p className="text-gray-500 text-xs max-w-[200px] mx-auto">
                                    Tap untuk upload foto. Auto-ratio aktif.
                                </p>
                            </label>
                        </div>
                    ) : (
                        <Reorder.Group
                            axis="x"
                            values={slides}
                            onReorder={onChange}
                            className={`h-full flex items-center min-w-max gap-4 px-4 md:gap-8 md:px-[10vw]`}
                        >
                            {slides.map((slide, idx) => (
                                <Reorder.Item
                                    key={slide.id}
                                    value={slide}
                                    className="relative group/slide shrink-0"
                                    dragListener={!isMobile} // Disable default drag on mobile, use handle
                                    style={{
                                        aspectRatio: getRatioValue(),
                                        height: isMobile ? '70%' : '65%'
                                    }}
                                >
                                    <div className="w-full h-full relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
                                        <img
                                            src={slide.content}
                                            className="w-full h-full object-contain pointer-events-none"
                                        />

                                        {/* Slide Info */}
                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                            <div className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-md text-[9px] font-bold text-white/70 border border-white/10">
                                                {idx + 1}
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeSlide(slide.id); }}
                                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors opacity-100 md:opacity-0 md:group-hover/slide:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        {/* Drag Handle (Mobile) */}
                                        {isMobile && (
                                            <div className="absolute bottom-2 right-2 p-1.5 bg-black/60 rounded-lg text-white/70 backdrop-blur-md">
                                                <GripVertical size={14} />
                                            </div>
                                        )}
                                    </div>
                                </Reorder.Item>
                            ))}

                            {/* --- ADD BUTTON --- */}
                            <label
                                className="shrink-0 group/add cursor-pointer border-2 border-dashed border-white/10 hover:border-rose-500/50 rounded-2xl flex items-center justify-center transition-all bg-white/[0.02] hover:bg-rose-500/[0.02]"
                                style={{
                                    aspectRatio: getRatioValue(),
                                    height: isMobile ? '70%' : '65%'
                                }}
                            >
                                <input {...getInputProps()} className="hidden" />
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover/add:text-white group-hover/add:bg-rose-500 transition-colors">
                                        <Plus size={20} />
                                    </div>
                                    {!isMobile && <span className="text-[9px] font-bold tracking-widest text-gray-600">ADD</span>}
                                </div>
                            </label>
                        </Reorder.Group>
                    )}
                </AnimatePresence>
            </div>

            {/* FOOTER HIDDEN ON MOBILE TO SAVE SPACE */}
            {!isMobile && (
                <div className="p-4 flex justify-between items-center bg-[#0a0a0a] rounded-b-[2rem] border-x border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{slides.length} FRAMES</div>
                    </div>
                </div>
            )}
        </div>
    );
};
