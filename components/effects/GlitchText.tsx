import React from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
    text: string;
    className?: string;
}

/**
 * Komponen GlitchText - Efek teks glitch/bergetar
 * Digunakan untuk judul dengan efek cyberpunk
 */
export const GlitchText = ({ text, className }: GlitchTextProps) => {
    return (
        <div className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>
            <motion.span
                className="absolute inset-0 z-0 text-green-500 opacity-30 translate-x-[2px]"
                animate={{ x: [0, -2, 2, -1, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            >
                {text}
            </motion.span>
            <motion.span
                className="absolute inset-0 z-0 text-red-500 opacity-30 -translate-x-[2px]"
                animate={{ x: [0, 2, -2, 1, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3, delay: 0.1 }}
            >
                {text}
            </motion.span>
        </div>
    );
};
