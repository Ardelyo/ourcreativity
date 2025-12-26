import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PreviewCarouselProps {
    slides: any[];
}

export const PreviewCarousel: React.FC<PreviewCarouselProps> = ({ slides }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'center',
        skipSnaps: false,
        duration: 30
    });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') scrollPrev();
            if (e.key === 'ArrowRight') scrollNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [scrollPrev, scrollNext]);

    if (!slides || slides.length === 0) return (
        <div className="flex flex-col items-center justify-center h-full text-white/20 gap-4">
            <X size={48} strokeWidth={1} />
            <p className="font-serif italic text-lg tracking-widest uppercase">Kosong</p>
        </div>
    );

    return (
        <div className="relative group w-full h-full flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-rose-500/10 via-transparent to-purple-500/10 blur-[120px] pointer-events-none opacity-50" />

            <div className="relative w-full max-w-5xl aspect-[16/10] md:aspect-video flex items-center justify-center">
                <div className="overflow-visible w-full h-full" ref={emblaRef}>
                    <div className="flex h-full gap-8 md:gap-16">
                        {slides.map((slide, index) => (
                            <div className="relative flex-[0_0_100%] md:flex-[0_0_70%] min-w-0 h-full transition-all duration-700" key={slide.id || index}
                                style={{
                                    opacity: index === selectedIndex ? 1 : 0.3,
                                    scale: index === selectedIndex ? 1 : 0.9,
                                    filter: index === selectedIndex ? 'blur(0px)' : 'blur(4px)'
                                }}
                            >
                                <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-black border border-white/10 group/item relative">
                                    <img
                                        src={slide.content}
                                        className="block w-full h-full object-contain bg-[#050505]"
                                        alt={`Slide ${index + 1}`}
                                    />

                                    {/* Number Badge */}
                                    <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/40 backdrop-blur-2xl rounded-2xl text-[10px] font-black text-white/90 border border-white/10 shadow-2xl tracking-[0.2em]">
                                        {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Controls - Hidden by default, visible on hover or mobile */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-2 md:-px-20 z-20">
                    <button
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 hover:bg-white hover:text-black backdrop-blur-md border border-white/5 flex items-center justify-center text-white/50 transition-all pointer-events-auto shadow-2xl opacity-0 group-hover:opacity-100 md:translate-x-0 ${!prevBtnEnabled && 'opacity-0 !pointer-events-none'}`}
                        onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                        disabled={!prevBtnEnabled}
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <button
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 hover:bg-white hover:text-black backdrop-blur-md border border-white/5 flex items-center justify-center text-white/50 transition-all pointer-events-auto shadow-2xl opacity-0 group-hover:opacity-100 md:translate-x-0 ${!nextBtnEnabled && 'opacity-0 !pointer-events-none'}`}
                        onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                        disabled={!nextBtnEnabled}
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="mt-12 w-full max-w-sm flex items-center gap-4">
                <div className="flex-1 h-[2px] bg-white/5 rounded-full relative overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                        initial={false}
                        animate={{ width: `${((selectedIndex + 1) / slides.length) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                </div>
                <div className="text-[10px] font-black tracking-widest text-white/40 uppercase">{selectedIndex + 1} / {slides.length}</div>
            </div>
        </div>
    );
};

