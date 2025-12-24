import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ExternalLink, X, Sparkles, Wand2, Heart, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';

// --- Types ---
interface ContributorDetailProps {
    isOpen: boolean;
    onClose: () => void;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
    totalAdditions: number;
    totalDeletions: number;
    persona: {
        title: string;
        description: string;
        adjective: string;
        element: string; // e.g., 'Fire', 'Water', 'Void'
    };
    isOwner: boolean;
}

// --- Component ---
export const ContributorModal: React.FC<ContributorDetailProps> = ({
    isOpen,
    onClose,
    login,
    avatar_url,
    html_url,
    contributions,
    totalAdditions,
    totalDeletions,
    persona,
    isOwner,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Focus Trap
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key === 'Tab') {
                const focusableElements = modalRef.current?.parentElement?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        // Focus the close button initially or the modal itself
        setTimeout(() => closeButtonRef.current?.focus(), 100);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleDownload = async () => {
        if (!modalRef.current) return;
        try {
            const element = modalRef.current;
            const canvas = await html2canvas(element, {
                backgroundColor: '#030303',
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const link = document.createElement('a');
            link.download = `creative-soul-${login}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Gagal mengunduh kartu:', error);
        }
    };

    if (!isOpen) return null;

    // Dynamic mesh gradient based on name length/char (pseudo-random)
    const getGradient = (name: string) => {
        const colors = [
            'from-rose-500/20 via-purple-500/20 to-cyan-500/20',
            'from-emerald-500/20 via-teal-500/20 to-lime-500/20',
            'from-amber-500/20 via-orange-500/20 to-red-500/20',
            'from-blue-500/20 via-indigo-500/20 to-violet-500/20',
        ];
        return colors[name.length % colors.length];
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden pt-[max(1rem,env(safe-area-inset-top))]">
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                />

                {/* Modal Window */}
                <motion.div
                    layoutId={`card-${login}`}
                    className="relative w-full max-w-lg bg-[#0a0a0a]/80 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Close Button */}
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="absolute top-6 right-6 z-30 p-2 bg-white/5 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md"
                        aria-label="Tutup detail kontributor"
                    >
                        <X size={20} />
                    </button>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        <div ref={modalRef} className="relative bg-[#030303] p-8 md:p-12 overflow-hidden min-h-[500px] flex flex-col items-center text-center">

                            {/* Abstract Background Art */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(login)} blur-3xl opacity-50`} />
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                            {/* Orb */}
                            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

                            <div className="relative z-10 w-full flex flex-col items-center">

                                {/* Avatar: Floating & Organic */}
                                <div className="relative mb-8 group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                                    <div className={`w-32 h-32 rounded-full p-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 ${isOwner ? 'shadow-[0_0_40px_rgba(251,191,36,0.2)]' : ''}`}>
                                        <img src={avatar_url} alt={login} className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    {isOwner && (
                                        <div className="absolute -bottom-2 delay-100 left-1/2 -translate-x-1/2 bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest backdrop-blur-md">
                                            Visioner
                                        </div>
                                    )}
                                </div>

                                {/* Identity */}
                                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{login}</h2>
                                <div className="flex items-center gap-2 text-sm text-white/60 mb-8 font-light tracking-wide">
                                    <Sparkles size={14} className="text-purple-400" />
                                    <span>{persona.title}</span>
                                    <Sparkles size={14} className="text-purple-400" />
                                </div>

                                {/* Creative Signature / Bio */}
                                <div className="relative p-6 mb-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm max-w-sm">
                                    <Wand2 size={24} className="absolute -top-3 -left-3 text-rose-400 rotate-12" />
                                    <p className="text-lg text-gray-300 font-serif italic leading-relaxed">
                                        "{persona.description}"
                                    </p>
                                    <div className="mt-4 flex justify-center gap-2">
                                        <span className="px-2 py-1 bg-white/5 rounded-md textxs text-gray-400 text-[10px] uppercase tracking-wider">{persona.element}</span>
                                        <span className="px-2 py-1 bg-white/5 rounded-md textxs text-gray-400 text-[10px] uppercase tracking-wider">{persona.adjective}</span>
                                    </div>
                                </div>

                                {/* Abstract Stats */}
                                <div className="flex gap-8 md:gap-12 mb-8">
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-light text-white">{contributions}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Artefak</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-light text-emerald-400">
                                            {((totalAdditions + totalDeletions) / 1000).toFixed(1)}k
                                        </span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Dampak</span>
                                    </div>
                                </div>

                                {/* Links */}
                                <div className="flex gap-4">
                                    <a
                                        href={html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-full bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300"
                                        title="Lihat profil GitHub"
                                        aria-label="Lihat profil GitHub"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                </div>

                                {/* Footer */}
                                <div className="mt-12 mb-24 opacity-30 text-[10px] tracking-[0.3em] uppercase">
                                    OurCreativity • Kolektif
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-6 bg-[#0a0a0a]/90 border-t border-white/10 flex justify-center backdrop-blur-xl">
                        <button
                            onClick={handleDownload}
                            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                        >
                            <Download size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="uppercase tracking-widest text-xs">Abadikan Kartu</span>
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};
