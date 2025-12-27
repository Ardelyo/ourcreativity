import React, { useState, useRef, useCallback } from 'react'; // Re-saving to force HMR update
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash2, GripVertical, Copy, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface Props {
    slides: any[];
    onChange: (slides: any[]) => void;
    isMobile: boolean;
    addLog?: (message: string, type: 'info' | 'success' | 'error' | 'process') => void;
}

interface SlideCardProps {
    slide: any;
    index: number;
    isMobile: boolean;
    draggedId: string | null;
    targetIndex: number | null;
    onDragStart: () => void;
    onDrag: (e: any, info: any) => void;
    onDragEnd: (e: any, info: any) => void;
    onRemove: () => void;
    onDuplicate: () => void;
}

const SlideCard = ({
    slide, index, isMobile, draggedId, targetIndex,
    onDragStart, onDrag, onDragEnd, onRemove, onDuplicate,
    gridRef
}: SlideCardProps & { gridRef: React.RefObject<HTMLDivElement> }) => {
    const [isHovered, setIsHovered] = useState(false);
    const controls = useDragControls();
    const isDragging = draggedId === slide.id;

    return (
        <motion.div
            layout="position"
            drag
            dragControls={controls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={gridRef}
            dragSnapToOrigin
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative slide-card w-full ${isDragging ? 'z-50' : 'z-10'}`}
            id={slide.id}
            style={{ touchAction: 'none' }}
            whileDrag={{
                scale: 1.05,
                rotate: 0,
                zIndex: 9999,
                cursor: "grabbing",
                filter: "brightness(1.1)",
                boxShadow: "0px 20px 50px rgba(0,0,0,0.5)"
            }}
        >
            <div className="w-full relative px-1 md:px-0">
                {/* The "Print" Frame */}
                <div className={`aspect-[4/3] bg-[#000] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative ${isMobile ? 'rounded-2xl' : ''}`}>
                    {/* Image */}
                    <img
                        src={slide.content}
                        alt={`Frame ${index + 1}`}
                        className="w-full h-full object-cover pointer-events-none select-none opacity-90 transition-opacity duration-500"
                    />

                    {/* Glass Overlay (Reflection) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Controls Overlay (Floating Dock) - Optimized for Mobile Touch */}
                    <div className={`absolute top-2 right-2 flex flex-col gap-3 transition-all duration-300 ${isHovered || isMobile ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                        {/* Drag Handle */}
                        <div
                            className={`rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-grab active:cursor-grabbing hover:bg-rose-500/80 hover:border-rose-500/50 transition-all shadow-lg ${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`}
                            onPointerDown={(e) => controls.start(e)}
                        >
                            <GripVertical size={isMobile ? 18 : 14} />
                        </div>

                        {/* Remove */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className={`rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/80 hover:border-red-500/50 transition-all shadow-lg ${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`}
                        >
                            <Trash2 size={isMobile ? 16 : 14} />
                        </button>
                    </div>

                    {/* Index Number (Watermark Style) */}
                    <div className="absolute bottom-2 left-3 pointer-events-none mix-blend-difference">
                        <span className={`font-serif font-bold text-white/80 leading-none tracking-tighter ${isMobile ? 'text-4xl' : 'text-6xl'}`}>
                            {(index + 1).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Reflection / Grounding Shadow */}
                <div className={`absolute -bottom-2 left-4 right-4 h-4 bg-black/50 blur-xl rounded-[100%] transition-opacity duration-500 ${isHovered || isDragging || isMobile ? 'opacity-100' : 'opacity-0'}`} />
            </div>
        </motion.div>
    );
};

export const VisualBuilder: React.FC<Props> = ({ slides, onChange, isMobile, addLog }) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');

    // --- UTILS ---
    const handleImageProcess = async (file: File) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error("Compression failed:", error);
            return file;
        }
    };

    const handleDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        // Check limit
        if (slides.length + acceptedFiles.length > 10) {
            alert('Maksimal 10 slide per karya.');
            return;
        }

        setIsProcessing(true);
        setProcessingStatus('Mengembangkan Film...');
        addLog?.(`Memulai pemrosesan ${acceptedFiles.length} file gambar...`, 'process');

        try {
            const newSlides = await Promise.all(acceptedFiles.map(async (file, idx) => {
                addLog?.(`[${idx + 1}/${acceptedFiles.length}] Mengompresi ${file.name}...`, 'process');
                const compressed = await handleImageProcess(file);
                addLog?.(`[${idx + 1}/${acceptedFiles.length}] Berhasil kompresi: ${(compressed.size / 1024).toFixed(1)}KB`, 'success');
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({
                            id: `slide-${Date.now()}-${Math.random()}`,
                            type: 'image',
                            content: e.target?.result as string,
                            caption: ''
                        });
                    };
                    reader.readAsDataURL(compressed);
                });
            }));

            onChange([...slides, ...newSlides]);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Gagal memproses gambar.");
            addLog?.(`Kritikal Error: Gagal memproses gambar - ${error.message || 'Unknown'}`, 'error');
        } finally {
            setIsProcessing(false);
            addLog?.(`Semua file berhasil divisualisasikan.`, 'success');
        }
    }, [slides, onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: { 'image/*': [] },
        maxFiles: 10 - slides.length,
        disabled: slides.length >= 10 || isProcessing
    });

    const removeSlide = (index: number) => {
        const newSlides = [...slides];
        newSlides.splice(index, 1);
        onChange(newSlides);
    };

    const duplicateSlide = (index: number) => {
        if (slides.length >= 10) return;
        const slideToClone = slides[index];
        const newSlide = { ...slideToClone, id: `slide-${Date.now()}-${Math.random()}` };
        const newSlides = [...slides];
        newSlides.splice(index + 1, 0, newSlide);
        onChange(newSlides);
    };

    const moveSlide = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        const newSlides = [...slides];
        const [movedSlide] = newSlides.splice(fromIndex, 1);
        newSlides.splice(toIndex, 0, movedSlide);
        onChange(newSlides);
    };

    const handleDrag = (event: any, info: any) => {
        if (!gridRef.current || !draggedId) return;

        const gridRect = gridRef.current.getBoundingClientRect();
        const x = info.point.x - gridRect.left;
        const y = info.point.y - gridRect.top;

        // Determine columns and gaps based on viewport width
        const isDesktop = window.innerWidth >= 1024;
        const isTablet = window.innerWidth >= 768;

        const cols = isDesktop ? 3 : 2;
        const gap = isTablet ? 48 : 32; // md:gap-12 vs gap-8

        // Calculate precise cell dimensions
        // Total Width = (Cols * CellWidth) + ((Cols - 1) * Gap)
        // CellWidth = (TotalWidth - ((Cols - 1) * Gap)) / Cols
        const totalGapWidth = (cols - 1) * gap;
        const cellWidth = (gridRect.width - totalGapWidth) / cols;
        const cellHeight = cellWidth * 0.75; // aspect-[4/3]

        const rowHeight = cellHeight + gap;
        const colWidth = cellWidth + gap;

        // Calculate grid coordinates
        // We add half gap to offset the hit area to the center of the gap 
        const col = Math.floor(x / colWidth);
        const row = Math.floor(y / rowHeight);

        // Calculate potential new index
        let newIndex = (row * cols) + col;

        // Clamp index to valid range
        newIndex = Math.max(0, Math.min(newIndex, slides.length - 1));

        const currentIndex = slides.findIndex(s => s.id === draggedId);

        if (newIndex !== currentIndex) {
            moveSlide(currentIndex, newIndex);
        }
    };

    const handleDragEnd = () => {
        setDraggedId(null);
    };

    // --- COMPONENTS ---
    // Moved SlideCard outside to prevent remounting during state updates

    // 2. Wrap for the grid items (not using DragHandle helper anymore to keep it simple)

    // --- MAIN RENDER ---
    return (
        <div className="w-full h-full flex flex-col select-none group/builder overflow-hidden bg-[#050505] relative rounded-t-3xl border-t border-white/5">

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Scrollable Canvas (The Darkroom Grid) */}
            <div className={`relative flex-1 w-full overflow-y-auto overflow-x-hidden p-4 pt-16 md:p-12 md:pt-20 custom-scrollbar ${isMobile ? 'px-3 pb-32' : ''}`}>
                <div
                    ref={gridRef}
                    className={`grid gap-4 md:gap-12 pb-24 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}
                >
                    <AnimatePresence initial={false}>
                        {slides.map((slide, index) => (
                            <SlideCard
                                key={slide.id}
                                slide={slide}
                                index={index}
                                isMobile={isMobile}
                                draggedId={draggedId}
                                targetIndex={null}
                                onDragStart={() => setDraggedId(slide.id)}
                                onDrag={handleDrag}
                                onDragEnd={handleDragEnd}
                                onRemove={() => removeSlide(index)}
                                onDuplicate={() => duplicateSlide(index)}
                                gridRef={gridRef}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Add Frame Button (Grid Integrated) */}
                    {slides.length < 10 && !isProcessing && (
                        <div className="w-full">
                            <div
                                {...getRootProps()}
                                className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 cursor-pointer transition-all duration-700 flex flex-col items-center justify-center group/add"
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center">
                                    <div className={`rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/20 group-hover/add:border-rose-500/50 group-hover/add:text-rose-500 group-hover/add:bg-rose-500/10 transition-all duration-500 mb-2 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                                        <Plus size={isMobile ? 20 : 24} />
                                    </div>
                                    <span className="font-serif text-white/20 group-hover/add:text-rose-500/80 tracking-widest text-[10px] uppercase transition-colors duration-500 whitespace-nowrap">
                                        Frame
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State (The Clean Canvas) */}
                {slides.length === 0 && !isProcessing && (
                    <div {...getRootProps()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/empty">
                        <input {...getInputProps()} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative flex flex-col items-center"
                        >
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-b from-white/5 to-transparent border border-white/10 flex items-center justify-center mb-6 group-hover/empty:scale-105 group-hover/empty:border-rose-500/30 transition-all duration-700 shadow-2xl">
                                <Plus size={isMobile ? 32 : 48} className="text-white/20 group-hover/empty:text-rose-500 transition-colors duration-500" />
                            </div>
                            <h3 className="text-2xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-2 px-4 text-center">
                                Visual Narrative
                            </h3>
                            <div className="flex items-center gap-2 text-white/20 text-[10px] uppercase tracking-[0.2em] group-hover/empty:text-rose-500/50 transition-colors">
                                <span>Muat Media</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
            {/* UNIFIED VISION CONTROL CENTER */}
            <div className={`shrink-0 flex flex-col items-center justify-center bg-[#0a0a0a] border-t border-white/5 z-20 px-8 relative ${isMobile ? 'h-14' : 'h-20'}`}>
                {/* Processing Progress Line */}
                {isProcessing && (
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
                        <div className="h-full bg-rose-500 w-1/2 animate-loading-bar" />
                    </div>
                )}

                <div className="flex items-center justify-between w-full max-w-6xl">
                    {/* Status Section */}
                    <div className="flex items-center gap-3 md:gap-6 text-[10px] font-mono tracking-widest text-white/20 uppercase">
                        <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${slides.length >= 10 ? 'bg-red-500' : 'bg-rose-500/50'}`} />
                            {slides.length}/10 {isMobile ? '' : 'EKSPOSUR'}
                        </span>
                        {!isMobile && <span className="w-px h-3 bg-white/10" />}
                        {!isMobile ? (
                            <span className="truncate">{isProcessing ? processingStatus : 'SISTEM SIAP'}</span>
                        ) : (
                            isProcessing && <span className="truncate text-[8px]">{processingStatus}</span>
                        )}
                    </div>

                    {/* Quick Actions / Tips */}
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-white/10">
                        <span>TIP: TARIK FRAME UNTUK MENGATUR URUTAN</span>
                    </div>
                </div>
            </div>

            {/* Overlay for Drag Active */}
            <AnimatePresence>
                {isDragActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-rose-500/10 backdrop-blur-sm border-2 border-rose-500 border-dashed m-4 rounded-3xl flex items-center justify-center pointer-events-none"
                    >
                        <h2 className="text-4xl font-serif font-bold text-white drop-shadow-xl">Lepas Media di Sini</h2>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};
