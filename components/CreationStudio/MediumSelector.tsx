import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Type, Code, Video, ArrowRight } from 'lucide-react';
import { Medium } from './types';

interface MediumSelectorProps {
    onSelect: (medium: Medium) => void;
}

export const MediumSelector: React.FC<MediumSelectorProps> = ({ onSelect }) => {
    const mediums = [
        { id: 'visual', label: 'Visual', icon: ImageIcon, desc: 'Image, Carousel, Showcase', color: 'from-purple-500 to-indigo-500' },
        { id: 'narasi', label: 'Narasi', icon: Type, desc: 'Story, Article, Document', color: 'from-rose-500 to-orange-500' },
        { id: 'kode', label: 'Kode', icon: Code, desc: 'Playground, Snippet, HTML/JS', color: 'from-emerald-500 to-teal-500' },
        { id: 'sinema', label: 'Sinema', icon: Video, desc: 'Video, Animation, Embed', color: 'from-blue-500 to-cyan-500' },
    ];

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 h-full content-center">
            {mediums.map((m) => (
                <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(m.id as Medium)}
                    className="group relative overflow-hidden rounded-2xl p-6 text-left border border-white/5 hover:border-white/20 transition-all bg-[#0a0a0a]"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                <m.icon className="text-white" size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{m.label}</h3>
                            <p className="text-gray-400 text-sm">{m.desc}</p>
                        </div>
                        <ArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                </motion.button>
            ))}
        </div>
    );
};
