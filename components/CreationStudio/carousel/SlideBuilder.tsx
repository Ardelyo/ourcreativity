import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, X, GripVertical, Image as ImageIcon, Type, Code } from 'lucide-react';
import { SlideContent } from '../types';

interface SlideBuilderProps {
    slides: SlideContent[];
    onChange: (slides: SlideContent[]) => void;
}

export const SlideBuilder: React.FC<SlideBuilderProps> = ({ slides, onChange }) => {
    const onDrop = (acceptedFiles: File[]) => {
        if (slides.length + acceptedFiles.length > 10) {
            alert("Maximum 10 slides allowed");
            return;
        }

        const newSlides = acceptedFiles.map((file, index) => {
            const reader = new FileReader();
            const id = Date.now().toString() + Math.random().toString();

            // We need to handle async reading, for simplicity in this MVP 
            // we'll push a placeholder and update it when loaded
            // Ideally we'd use a more robust logic but this works for basic preview
            const slide: SlideContent = {
                id,
                type: 'image',
                content: '', // Will update
                order: slides.length + index
            };

            reader.onload = () => {
                updateSlideContent(id, reader.result as string);
            };
            reader.readAsDataURL(file);

            return slide;
        });

        onChange([...slides, ...newSlides]);
    };

    const updateSlideContent = (id: string, content: string) => {
        onChange(slides.map(s => s.id === id ? { ...s, content } : s));
    };

    const removeSlide = (id: string) => {
        onChange(slides.filter(s => s.id !== id));
    };

    const updateSlideOrder = (dragIndex: number, hoverIndex: number) => {
        // Basic array move
        const newSlides = [...slides];
        const dragSlide = newSlides[dragIndex];
        newSlides.splice(dragIndex, 1);
        newSlides.splice(hoverIndex, 0, dragSlide);
        // Refresh order index
        onChange(newSlides.map((s, i) => ({ ...s, order: i })));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        disabled: slides.length >= 10
    });

    return (
        <div className="h-full flex flex-col">
            {/* Slide List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {slides.map((slide, index) => (
                    <div key={slide.id} className="group relative flex items-center bg-[#1a1a1a] rounded-xl p-2 border border-white/5 hover:border-white/20 transition-all">
                        <div className="px-2 text-gray-600 cursor-move">
                            <GripVertical size={16} />
                        </div>

                        <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                            {slide.type === 'image' && slide.content && (
                                <img src={slide.content} alt="" className="w-full h-full object-cover" />
                            )}
                            {(!slide.content) && <div className="w-full h-full animate-pulse bg-white/5" />}
                        </div>

                        <div className="flex-1 ml-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-gray-400">Slide {index + 1}</span>
                                <select
                                    className="bg-[#0f0f0f] border border-white/10 text-xs rounded px-1 py-0.5"
                                    value={slide.type}
                                    onChange={(e) => {
                                        const newType = e.target.value as any;
                                        onChange(slides.map(s => s.id === slide.id ? { ...s, type: newType } : s));
                                    }}
                                >
                                    <option value="image">Image</option>
                                    <option value="text">Text (Caption)</option>
                                    <option value="code">Code Snippet</option>
                                </select>
                            </div>

                            {/* Simple caption input for now */}
                            <input
                                type="text"
                                placeholder="Caption..."
                                className="w-full bg-transparent text-sm border-b border-white/5 focus:border-white/20 focus:outline-none py-1"
                                value={slide.metadata?.caption || ''}
                                onChange={(e) => onChange(slides.map(s => s.id === slide.id ? { ...s, metadata: { ...s.metadata, caption: e.target.value } } : s))}
                            />
                        </div>

                        <button
                            onClick={() => removeSlide(slide.id)}
                            className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {slides.length < 10 && (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragActive
                                ? 'border-accent-purple bg-accent-purple/10'
                                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <Plus className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Add Slide (Image)</span>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/5 text-xs text-center text-gray-500">
                {slides.length} / 10 slides
            </div>
        </div>
    );
};
