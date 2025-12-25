import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PreviewCarouselProps {
    slides: any[];
}

export const PreviewCarousel: React.FC<PreviewCarouselProps> = ({ slides }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center' });
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

    if (!slides || slides.length === 0) return (
        <div className="flex items-center justify-center h-full text-white/50">Gak ada slide buat ditampilin</div>
    );

    return (
        <div className="relative group w-full h-full flex flex-col items-center justify-center">
            <div className="overflow-hidden w-full max-w-2xl aspect-[4/5] rounded-xl shadow-2xl bg-black border border-white/10" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div className="relative flex-[0_0_100%] min-w-0 h-full" key={slide.id || index}>
                            {/* konten slide */}
                            <img
                                src={slide.content}
                                className="block w-full h-full object-contain bg-[#111]"
                                alt={`Slide ${index + 1}`}
                            />

                            {/* nomor slide */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                {index + 1} / {slides.length}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* tombol navigasi (muncul pas hover) */}
            <button
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-white/20 disabled:opacity-0 ${!prevBtnEnabled && 'opacity-0 pointer-events-none'}`}
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
            >
                <ChevronLeft size={24} />
            </button>

            <button
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-white/20 disabled:opacity-0 ${!nextBtnEnabled && 'opacity-0 pointer-events-none'}`}
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
            >
                <ChevronRight size={24} />
            </button>

            {/* indikator titik */}
            <div className="flex gap-2 mt-6">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? 'bg-white w-6' : 'bg-white/20 hover:bg-white/40'}`}
                        onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
};
