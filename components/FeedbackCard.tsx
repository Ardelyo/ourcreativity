import React from 'react';
import { motion } from 'framer-motion';
import { Quote, User, Star, Trash2 } from 'lucide-react';

interface FeedbackCardProps {
    message: string;
    from_name?: string;
    social_handle?: string;
    created_at?: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps & { onDelete?: () => void }> = ({ message, from_name, social_handle, created_at, onDelete }) => {
    return (
        <motion.div
            className="w-[300px] md:w-[450px] flex-shrink-0 mx-6 relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-rose-500/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />

            <div className="relative h-full bg-[#0a0a0a]/80 border border-white/5 p-8 md:p-10 rounded-[2rem] backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-2xl">
                {/* Decoration */}
                <Quote className="text-white/5 absolute top-6 right-8 rotate-12" size={64} />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Admin Delete Button */}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Apakah anda yakin ingin menghapus pesan ini?')) {
                                onDelete();
                            }
                        }}
                        className="absolute top-4 right-4 z-50 p-2 bg-rose-500/20 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white"
                        title="Hapus Pesan"
                    >
                        <Trash2 size={16} />
                    </button>
                )}

                <div className="mb-8 relative z-10">
                    <p className="text-xl md:text-2xl font-serif italic text-neutral-200 leading-relaxed font-light tracking-wide">
                        "{message}"
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-white/5 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center border border-white/5 shrink-0 shadow-inner">
                        <User size={20} className="text-neutral-500" />
                    </div>
                    <div className="min-w-0 flex flex-col">
                        <h4 className="font-bold text-base text-white truncate font-sans tracking-tight">{from_name || "Guest User"}</h4>
                        <div className="flex items-center gap-2">
                            {social_handle && (
                                <span className="text-xs text-indigo-400 font-mono truncate bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                    {social_handle}
                                </span>
                            )}
                            {!social_handle && created_at && (
                                <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest">
                                    {new Date(created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
