import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Instagram, User, MessageCircle, X, Mail, PenTool, Sparkles, Loader2, AlertCircle, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

//--- Types ---//
type Letter = {
    id: string;
    x: number;
    y: number;
    rotation: number;
    variant: number;
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

const Envelope = ({ data, constraintsRef, onOpen }: { data: Letter; constraintsRef: React.RefObject<HTMLDivElement>; onOpen: (l: Letter) => void }) => {
    const colors = [
        'bg-slate-50',
        'bg-stone-50',
        'bg-zinc-100',
        'bg-[#fffdfa]',
    ];

    const [zIndex, setZIndex] = useState(10);

    // Safety check for numbers
    const x = typeof data.x === 'number' ? data.x : 0;
    const y = typeof data.y === 'number' ? data.y : 0;
    const rotate = typeof data.rotation === 'number' ? data.rotation : 0;

    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={true}
            onDragStart={() => setZIndex(100)}
            onDragEnd={() => setZIndex(10)}
            whileDrag={{ scale: 1.1, rotate: 0, zIndex: 100, boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            whileHover={{ scale: 1.05, zIndex: 40 }}
            onClick={() => onOpen(data)}
            initial={{ x: x, y: -400, rotate: rotate, opacity: 0 }}
            animate={{
                x: x,
                y: y,
                rotate: rotate,
                opacity: 1,
                transition: {
                    type: "spring",
                    damping: 18,
                    stiffness: 70,
                    mass: 1.1,
                    delay: Math.random() * 0.3
                }
            }}
            className={`absolute w-28 h-16 sm:w-36 sm:h-20 ${colors[data.variant] || 'bg-white'} rounded-sm shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing border border-black/5 group overflow-hidden`}
            style={{ zIndex: zIndex }}
        >
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}></div>

            {/* Flap Detail */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-40%] left-[50%] -translate-x-1/2 w-[120%] h-[80%] bg-black/[0.03] rotate-12 transform origin-center border-b border-black/[0.05]"></div>
            </div>

            {/* Stamp */}
            <div className="absolute top-1.5 right-1.5 w-5 h-6 bg-rose-500/5 border border-rose-500/10 flex items-center justify-center pointer-events-none">
                <div className="w-3.5 h-4.5 border border-rose-500/20 rounded-[0.5px]"></div>
            </div>

            <div className="text-[9px] sm:text-[10px] text-slate-400 font-serif absolute bottom-1.5 left-2 pointer-events-none group-hover:text-slate-600 transition-colors uppercase tracking-widest opacity-60">
                Click
            </div>
        </motion.div>
    );
};

export const KotakSurat = () => {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [viewedLetter, setViewedLetter] = useState<Letter | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FormData>({ name: '', social: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchLetters = async () => {
            try {
                const { data, error } = await supabase
                    .from('letters')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(40);

                if (error) {
                    setErrorMsg('Gagal memuat surat: ' + error.message);
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

        // Calculate positions based on container size to keep them inside
        // For mobile, we might want a tighter dispersion
        const newLetterData = {
            x: (Math.random() - 0.5) * 150, // Range -75 to 75
            y: 150 + Math.random() * 100, // Bottom area
            rotation: (Math.random() - 0.5) * 40,
            variant: Math.floor(Math.random() * 4),
            message: formData.message,
            from_name: formData.name || "Anonim",
            social_handle: formData.social
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

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0a] text-white selection:bg-rose-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-rose-600/5 blur-[120px] rounded-full" />
                <Noise />
            </div>

            {/* Header Area */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center mb-10 max-w-2xl px-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-6 backdrop-blur-xl">
                    <Sparkles size={12} />
                    <span>Communication Hub</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold italic tracking-tighter mb-4 leading-none">Kotak Surat.</h1>
                <p className="text-neutral-500 text-sm md:text-lg font-light leading-relaxed max-w-md mx-auto">
                    Tuangkan sapaan, apresiasi, atau harapan Anda untuk komunitas secara aman dan anonim.
                </p>

                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-xs font-mono"
                    >
                        <AlertCircle size={14} />
                        <span>{errorMsg}</span>
                    </motion.div>
                )}
            </motion.div>

            {/* The Glass Mailbox */}
            <div className="relative z-10 w-full max-w-[90vw] sm:max-w-md h-[500px] sm:h-[650px] group perspective-1000">
                {/* Slot Top */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-2xl z-20 shadow-[0_0_30px_rgba(255,255,255,0.1)]"></div>

                {/* Main Body */}
                <motion.div
                    ref={containerRef}
                    className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-end p-6 shadow-2xl"
                    style={{
                        boxShadow: "inset 0 0 80px rgba(255,255,255,0.05), 0 30px 60px -12px rgba(0,0,0,0.8)"
                    }}
                >
                    {/* Interior Lighting */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none z-20 rounded-[3rem]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

                    {/* Content Container */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-full relative pointer-events-auto overflow-hidden">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-white/5" size={40} />
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {letters.map((letter) => (
                                        <Envelope
                                            key={letter.id}
                                            data={letter}
                                            constraintsRef={containerRef}
                                            onOpen={setViewedLetter}
                                        />
                                    ))}
                                </AnimatePresence>
                            )}

                            {!isLoading && letters.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center flex-col text-white/5 pointer-events-none px-6 text-center">
                                    <Inbox size={64} className="mb-6 opacity-30" />
                                    <p className="text-xl font-serif italic mb-2">Hening...</p>
                                    <p className="text-xs uppercase tracking-widest font-mono opacity-40">Kotak masih kosong</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Branding Overlay */}
                    <div className="absolute top-12 left-0 w-full text-center text-white/5 text-[9px] font-mono pointer-events-none z-0 uppercase tracking-[0.8em]">
                        &mdash; OURCREATIVITY ARCHIVE &mdash;
                    </div>
                </motion.div>
            </div>

            {/* Action Group */}
            <div className="mt-12 flex flex-col items-center gap-6 relative z-20 w-full">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsWriting(true)}
                    className="px-10 py-4 bg-white text-black rounded-full font-bold flex items-center gap-3 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:shadow-white/30 transition-all font-serif group"
                >
                    <PenTool size={20} className="group-hover:rotate-12 transition-transform" />
                    Tulis Sesuatu
                </motion.button>

                <Link to="/info" className="text-neutral-500 hover:text-white text-xs transition-colors py-2 flex items-center gap-3 group tracking-widest uppercase font-mono">
                    <X size={12} className="group-hover:rotate-90 transition-transform" /> Kembali ke Informasi
                </Link>
            </div>

            {/* WRITE MODAL */}
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
                            className="w-full max-w-lg bg-[#fffdfa] text-neutral-900 rounded-3xl shadow-2xl overflow-hidden relative"
                            style={{
                                backgroundImage: "linear-gradient(#eee 1px, transparent 1px)",
                                backgroundSize: "100% 32px"
                            }}
                        >
                            <div className="p-8 md:p-12 relative z-10 pt-16">
                                <div className="absolute top-8 right-8">
                                    <button onClick={() => !isSending && setIsWriting(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-neutral-400">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="mb-10">
                                    <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 m-0 italic font-bold tracking-tight">Surat Baru.</h2>
                                    <div className="h-1 w-12 bg-neutral-900 mt-4 rounded-full" />
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative group">
                                            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-2 block">Nama / Alias</label>
                                            <input
                                                type="text"
                                                placeholder="Seseorang..."
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-transparent border-b border-neutral-200 focus:border-neutral-900 outline-none pb-2 text-neutral-800 placeholder:text-neutral-300 font-serif transition-colors"
                                            />
                                            <User className="absolute right-0 bottom-2 text-neutral-200 group-focus-within:text-neutral-900 transition-colors" size={16} />
                                        </div>

                                        <div className="relative group">
                                            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-2 block">Social Handle</label>
                                            <input
                                                type="text"
                                                placeholder="@instagram"
                                                value={formData.social}
                                                onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                                                className="w-full bg-transparent border-b border-neutral-200 focus:border-neutral-900 outline-none pb-2 text-neutral-800 placeholder:text-neutral-300 font-serif transition-colors"
                                            />
                                            <Instagram className="absolute right-0 bottom-2 text-neutral-200 group-focus-within:text-neutral-900 transition-colors" size={16} />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-2 block">Pesan Anda</label>
                                        <textarea
                                            placeholder="Tuliskan isi pikiranmu..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={6}
                                            className="w-full bg-transparent border-none outline-none text-neutral-800 placeholder:text-neutral-300 font-serif resize-none text-lg leading-[32px] italic"
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSend}
                                        disabled={!formData.message || isSending}
                                        className="bg-neutral-900 text-white px-10 py-4 rounded-full font-serif shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg font-bold group"
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Mengirim...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Kirim Surat</span>
                                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* READ MODAL */}
            <AnimatePresence>
                {viewedLetter && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                            onClick={() => setViewedLetter(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="w-full max-w-xl bg-[#fffdfa] text-neutral-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative p-10 md:p-16 font-serif"
                            style={{
                                backgroundImage: "linear-gradient(#f0f0f0 1px, transparent 1px)",
                                backgroundSize: "100% 36px"
                            }}
                        >
                            <div className="relative z-10 pt-8">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <div className="text-[10px] text-neutral-400 uppercase tracking-[0.3em] mb-3 font-mono">Archive entry by</div>
                                        <h3 className="text-3xl md:text-4xl font-bold italic tracking-tight">{viewedLetter.from_name || "Anonim"}</h3>
                                        {viewedLetter.social_handle && (
                                            <div className="text-sm text-blue-600 mt-2 flex items-center gap-1.5 font-sans font-medium">
                                                <Instagram size={14} /> {viewedLetter.social_handle}
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setViewedLetter(null)} className="text-neutral-300 hover:text-neutral-900 transition-colors">
                                        <X size={32} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-2xl md:text-3xl leading-relaxed italic text-neutral-800 whitespace-pre-wrap">
                                        "{viewedLetter.message}"
                                    </p>
                                </div>

                                <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center text-neutral-300 italic text-[11px] gap-4">
                                    <span>Tercatat pada: {viewedLetter.created_at ? new Date(viewedLetter.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru saja'}</span>
                                    <span className="font-mono uppercase tracking-widest px-3 py-1 bg-neutral-50 rounded-full border border-neutral-100">OurCreativity Archive</span>
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
