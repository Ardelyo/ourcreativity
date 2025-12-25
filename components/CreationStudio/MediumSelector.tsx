import React from 'react';
import { motion } from 'framer-motion';
import { Type, Image as ImageIcon, Video, Code, Grid, FileCode, FileText } from 'lucide-react';
import { WorkType } from './types';

interface MediumSelectorProps {
    activeType: WorkType;
    onChange: (type: WorkType) => void;
}

export const MediumSelector: React.FC<MediumSelectorProps> = ({ activeType, onChange }) => {
    const types: { id: WorkType, label: string, icon: any }[] = [
        { id: 'text', label: 'Tulisan', icon: Type },
        { id: 'image', label: 'Gambar', icon: ImageIcon },
        { id: 'video', label: 'Video', icon: Video },
        { id: 'document', label: 'Dokumen', icon: FileText },
        // { id: 'embed', label: 'Embed', icon: FileCode },
        { id: 'code', label: 'Kode', icon: Code },
    ];

    return (
        <div className="w-full">
            {/* Mobile: 2x3 Grid */}
            <div className="md:hidden grid grid-cols-3 gap-2 mb-6">
                {types.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onChange(type.id)}
                        className={`
                            flex flex-col items-center justify-center p-4 rounded-xl border transition-all active:scale-95
                            ${activeType === type.id
                                ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                            }
                        `}
                    >
                        <type.icon size={24} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                    </button>
                ))}
            </div>

            {/* Desktop: Horizontal Pills */}
            <div className="hidden md:flex bg-[#111] p-1 rounded-full border border-white/10 inline-flex mb-8">
                {types.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onChange(type.id)}
                        className={`
                            relative px-6 py-2 rounded-full text-sm font-medium transition-all
                            ${activeType === type.id ? 'text-black' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        {activeType === type.id && (
                            <motion.div
                                layoutId="activeMedium"
                                className="absolute inset-0 bg-white rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <type.icon size={16} />
                            {type.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
