import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EditWorkModalProps {
    work: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const DIVISION_OPTIONS = [
    { value: 'web-design', label: 'Web Design' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'ui-ux', label: 'UI/UX Design' },
    { value: 'graphic', label: 'Graphic Design' },
    { value: 'illustration', label: 'Illustration' },
    { value: '3d', label: '3D Art' },
    { value: 'photography', label: 'Photography' },
    { value: 'videography', label: 'Videography' },
    { value: 'other', label: 'Lainnya' }
];

export const EditWorkModal: React.FC<EditWorkModalProps> = ({ work, isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState(work?.title || '');
    const [description, setDescription] = useState(work?.description || '');
    const [division, setDivision] = useState(work?.division || 'other');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update state when work changes (e.g. when opening modal)
    useEffect(() => {
        if (work) {
            setTitle(work.title);
            setDescription(work.description);
            setDivision(work.division);
        }
    }, [work]);

    const handleSave = async () => {
        if (!work) return;
        setIsSaving(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('works')
                .update({
                    title,
                    description,
                    division,
                    updated_at: new Date().toISOString()
                })
                .eq('id', work.id);

            if (updateError) throw updateError;

            onSave();
            onClose();
        } catch (err: any) {
            console.error('Error updating work:', err);
            setError(err.message || 'Gagal menyimpan perubahan.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
                            <h3 className="text-xl font-bold text-white">Edit Karya</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 bg-[#0a0a0a]">
                            {error && (
                                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Judul</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
                                    placeholder="Judul karya..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Divisi / Kategori</label>
                                <select
                                    value={division}
                                    onChange={(e) => setDivision(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
                                >
                                    {DIVISION_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="bg-[#111] text-white">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Deskripsi</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
                                    placeholder="Ceritakan tentang karya ini..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-[#111] flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isSaving}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 rounded-lg text-sm font-bold bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
