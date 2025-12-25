import React from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, FileText, Image as ImageIcon, Video, Code, Monitor, Clock, ChevronRight, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Draft {
    id: string;
    title: string;
    mode: 'text' | 'image' | 'video' | 'code' | 'embed' | 'meme';
    lastSaved: string;
    content?: string;
    description?: string;
}

interface DraftManagerProps {
    currentDraftId: string | null;
    drafts: Draft[];
    onSelect: (draft: Draft) => void;
    onDelete: (id: string) => void;
    onNew: () => void;
    onClose: () => void;
}

export const DraftManager: React.FC<DraftManagerProps> = ({
    currentDraftId,
    drafts,
    onSelect,
    onDelete,
    onNew,
    onClose
}) => {
    const getIcon = (mode: string) => {
        switch (mode) {
            case 'text': return <FileText size={16} />;
            case 'image': return <ImageIcon size={16} />;
            case 'video': return <Video size={16} />;
            case 'code': return <Code size={16} />;
            case 'document': return <FileText size={16} />;
            case 'embed': return <Globe size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const getModeLabel = (mode: string) => {
        const labels: Record<string, string> = {
            text: 'Tulisan',
            image: 'Gambar',
            video: 'Video',
            code: 'Kode',
            document: 'Dokumen',
            embed: 'Embed',
            meme: 'Meme'
        };
        return labels[mode] || mode;
    };

    // Sort drafts by last saved (newest first)
    const sortedDrafts = [...drafts].sort((a, b) =>
        new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
    );

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-2 bottom-2 left-2 w-full max-w-sm bg-[#0a0a0a] border border-white/10 z-[70] p-6 shadow-2xl overflow-y-auto rounded-3xl flex flex-col"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white">Drafts</h2>
                        <p className="text-xs text-gray-500 mt-1">Kelola semua karyamu</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <X size={16} />
                    </button>
                </div>

                <button
                    onClick={onNew}
                    className="w-full py-4 mb-6 bg-white/5 border border-white/5 hover:bg-white hover:text-black hover:border-white transition-all rounded-2xl flex items-center justify-center gap-3 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                        <Plus size={16} />
                    </div>
                    <span className="font-bold text-sm tracking-wide">BUAT KARYA BARU</span>
                </button>

                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {sortedDrafts.length === 0 ? (
                        <div className="text-center py-10 text-gray-600">
                            <p className="text-sm">Belum ada draft tersimpan.</p>
                        </div>
                    ) : (
                        sortedDrafts.map(draft => (
                            <div
                                key={draft.id}
                                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${currentDraftId === draft.id
                                    ? 'bg-white/10 border-rose-500/50 shadow-lg shadow-rose-900/10'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                    }`}
                                onClick={() => onSelect(draft)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 rounded-lg ${currentDraftId === draft.id ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                                        {getIcon(draft.mode)}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(draft.id); }}
                                        className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-500 text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Hapus Draft"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <h3 className={`font-bold text-sm mb-1 line-clamp-1 ${currentDraftId === draft.id ? 'text-white' : 'text-gray-300'}`}>
                                    {draft.title || 'Tanpa Judul'}
                                </h3>

                                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                    <span>{getModeLabel(draft.mode)}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        {formatDistanceToNow(new Date(draft.lastSaved), { addSuffix: true, locale: id })}
                                    </span>
                                </div>

                                {currentDraftId === draft.id && (
                                    <div className="absolute right-4 bottom-4">
                                        <ChevronRight size={16} className="text-rose-500" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </>
    );
};
