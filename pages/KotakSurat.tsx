import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Instagram, User, Sparkles, Loader2, AlertCircle, Podcast, MessageSquarePlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { FeedbackMarquee } from '../components/FeedbackMarquee';
import { FeedbackCard } from '../components/FeedbackCard';

//--- Types ---//
type Letter = {
    id: string;
    from_name?: string;
    social_handle?: string;
    message: string;
    created_at?: string;
};

type FormData = {
    name: string;
    social: string;
    message: string;
};

//--- Components ---//

const Noise = () => (
    <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
        style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}
    ></div>
);

export const KotakSurat = () => {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [formData, setFormData] = useState<FormData>({ name: '', social: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { profile } = useAuth();
    const isAdmin = profile?.role === 'admin';

    useEffect(() => {
        const fetchLetters = async () => {
            try {
                const { data, error } = await supabase
                    .from('letters')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50); // Fetch more for the loop

                if (error) {
                    setErrorMsg('Gagal memuat feedback: ' + error.message);
                } else {
                    if (data) setLetters(data);
                }
            } catch (err: any) {
                setErrorMsg('Terjadi kesalahan sistem.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLetters();
    }, []);

    const handleSend = async () => {
        if (!formData.message.trim()) return;
        setIsSending(true);
        setErrorMsg(null);

        const newLetterData = {
            message: formData.message,
            from_name: formData.name || "Anonim",
            social_handle: formData.social,
            // x, y, rotation, variant are kept for compatibility if needed, or ignored if schema allows nulls
            // assuming table allows nulls or defaults, otherwise we might need mock values
            x: 0,
            y: 0,
            rotation: 0,
            variant: 0
        };

        try {
            const { error } = await supabase
                .from('letters')
                .insert([newLetterData]);

            if (error) {
                setErrorMsg('Gagal mengirim: ' + error.message);
            } else {
                const localLetter = { ...newLetterData, id: Math.random().toString(), created_at: new Date().toISOString() } as Letter;
                setLetters((prev) => [localLetter, ...prev]);
                setIsWriting(false);
                setFormData({ name: '', social: '', message: '' });
            }
        } catch (err: any) {
            setErrorMsg('Terjadi kesalahan saat mengirim.');
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('letters')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Gagal menghapus pesan: ' + error.message);
            } else {
                setLetters((prev) => prev.filter((letter) => letter.id !== id));
            }
        } catch (err) {
            alert('Terjadi kesalahan saat menghapus pesan.');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 w-full flex flex-col relative overflow-hidden bg-[#050505] text-white selection:bg-rose-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[1000px] h-[500px] bg-rose-600/10 blur-[120px] rounded-full mix-blend-screen" />
                <Noise />
            </div>

            {/* Header Area */}
            <div className="relative z-10 container mx-auto px-6 text-center mb-16 md:mb-24 mt-8 md:mt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-indigo-400 uppercase mb-6 backdrop-blur-xl"
                >
                    <Podcast size={12} />
                    <span>Community Voices</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-8xl font-serif font-bold italic tracking-tighter mb-6 bg-gradient-to-br from-white via-white to-neutral-500 bg-clip-text text-transparent pb-2"
                >
                    Suara Komunitas.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-neutral-400 text-sm md:text-lg font-light leading-relaxed max-w-xl mx-auto"
                >
                    Dengarkan apa yang dikatakan kreator lain. Apresiasi, kritik, dan harapan yang membangun ekosistem kita bersama.
                </motion.p>

                {isAdmin && (
                    <div className="mt-4 inline-block bg-rose-500/20 text-rose-500 px-4 py-1 rounded-full text-xs font-bold border border-rose-500/30">
                        Admin Mode: Tap trash icon to delete
                    </div>
                )}
            </div>

            {/* Marquee Section */}
            <div className="relative w-full py-12 mb-12">
                {isLoading ? (
                    <div className="h-60 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white/20" size={32} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-16">
                        <FeedbackMarquee speed={40} direction="left">
                            {letters.slice(0, Math.ceil(letters.length / 2)).map((letter) => (
                                <FeedbackCard
                                    key={`row1-${letter.id}`}
                                    {...letter}
                                    onDelete={isAdmin ? () => handleDelete(letter.id) : undefined}
                                />
                            ))}
                            {letters.length === 0 && <span className="text-neutral-600 italic px-10">Belum ada pesan... Jadilah yang pertama!</span>}
                        </FeedbackMarquee>

                        <FeedbackMarquee speed={50} direction="right">
                            {letters.slice(Math.ceil(letters.length / 2)).map((letter) => (
                                <FeedbackCard
                                    key={`row2-${letter.id}`}
                                    {...letter}
                                    onDelete={isAdmin ? () => handleDelete(letter.id) : undefined}
                                />
                            ))}
                            {letters.length <= 1 && <span className="text-neutral-600 italic px-10">Suara anda berharga bagi kami.</span>}
                        </FeedbackMarquee>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="relative z-10 flex flex-col items-center gap-8 mt-auto px-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsWriting(true)}
                    className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] hover:shadow-white/50 transition-all font-serif group"
                >
                    <MessageSquarePlus size={20} className="group-hover:-rotate-12 transition-transform" />
                    <span>Tulis Pesan</span>
                </motion.button>

                <Link to="/info" className="text-neutral-500 hover:text-white text-xs transition-colors mb-12 flex items-center gap-2 group tracking-widest uppercase font-mono">
                    <X size={12} /> Kembali
                </Link>
            </div>

            {/* WRITE MODAL - Reused logic with updated design */}
            <AnimatePresence>
                {isWriting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md"
                            onClick={() => !isSending && setIsWriting(false)}
                        />

                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 text-white rounded-3xl shadow-2xl overflow-hidden relative"
                        >
                            <div className="p-8 md:p-10 relative z-10">
                                <div className="absolute top-6 right-6">
                                    <button onClick={() => !isSending && setIsWriting(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mb-8">
                                    <h2 className="font-serif text-3xl text-white m-0 italic font-bold tracking-tight">Kirim Pesan.</h2>
                                    <p className="text-sm text-neutral-500 mt-2">Suara anda akan didengar oleh seluruh komunitas.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Nama (Opsional)</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-neutral-700"
                                                    placeholder="Anonim"
                                                />
                                                <User className="absolute right-3 top-3 text-white/20" size={16} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Social (Opsional)</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={formData.social}
                                                    onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-neutral-700"
                                                    placeholder="@username"
                                                />
                                                <Instagram className="absolute right-3 top-3 text-white/20" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Pesan Anda</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={5}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-neutral-700 resize-none leading-relaxed"
                                            placeholder="Tuliskan apresiasi, saran, atau sekadar sapaan..."
                                        />
                                    </div>

                                    {errorMsg && (
                                        <div className="flex items-center gap-2 text-rose-500 text-xs bg-rose-500/10 p-3 rounded-lg">
                                            <AlertCircle size={14} />
                                            {errorMsg}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleSend}
                                        disabled={!formData.message || isSending}
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-neutral-200 transition-colors"
                                    >
                                        {isSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                        {isSending ? 'Mengirim...' : 'Kirim Sekarang'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KotakSurat;
