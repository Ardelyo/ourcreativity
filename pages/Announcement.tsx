import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Tag, ArrowRight, Star, Zap, Layout, Smartphone, Palette, Layers, Box, Image, Share2, Compass, Rocket, Shield, Megaphone, History, Clock, Globe, Cpu, X, ChevronRight } from 'lucide-react';
import { ChangelogTimeline } from '../components/ChangelogTimeline';
import { supabase } from '../lib/supabase';

export const Announcement = () => {
    const [activeTab, setActiveTab] = useState<'updates' | 'changelog'>('updates');
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data, error } = await supabase
                    .from('announcements')
                    .select('*')
                    .eq('type', 'announcement')
                    .order('date', { ascending: false });

                if (error) throw error;
                if (data) {
                    setEvents(data);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Bagian Header */}
            <div className="pt-24 md:pt-32 pb-12 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <span className="text-purple-400 font-bold tracking-widest text-xs uppercase mb-4 block">Pusat Informasi</span>
                    <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 tracking-tight">What's New?</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg mb-10">
                        Ikuti perkembangan terbaru dari komunitas dan evolusi teknis platform kami.
                    </p>

                    {/* Tab */}
                    <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm relative z-20">
                        <button
                            onClick={() => setActiveTab('updates')}
                            className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'updates' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Megaphone size={14} className="md:w-4 md:h-4" /> Papan Pengumuman
                        </button>
                        <button
                            onClick={() => setActiveTab('changelog')}
                            className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'changelog' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <History size={14} className="md:w-4 md:h-4" /> Riwayat Sistem
                        </button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'updates' ? (
                    <motion.div
                        key="updates"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-7xl mx-auto px-4 pb-20"
                    >
                        {/* Featured Announcement (Hero) */}
                        {events.length > 0 && (
                            <motion.div
                                layoutId={`card-${events[0].id}`}
                                onClick={() => setSelectedEvent(events[0])}
                                className="group relative w-full min-h-[500px] bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all mb-16 shadow-2xl"
                            >
                                {/* Dynamic Background Glow */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${events[0].color} opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />
                                <div className={`absolute -right-[20%] -top-[20%] w-[80%] h-[80%] bg-gradient-to-bl ${events[0].color} rounded-full blur-[150px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse`} />

                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                                <div className="relative z-10 h-full flex flex-col md:flex-row items-center p-8 md:p-16 gap-12">
                                    <div className="flex-1 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-bold text-white flex items-center gap-2 shadow-lg">
                                                <Sparkles size={14} className="text-yellow-400" /> FEATURED UPDATE
                                            </span>
                                            <span className="text-gray-400 text-sm font-mono">
                                                {new Date(events[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <motion.h2 layoutId={`title-${events[0].id}`} className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1]">
                                                {events[0].title}
                                            </motion.h2>
                                            <p className={`text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r ${events[0].color}`}>
                                                {events[0].subtitle}
                                            </p>
                                        </div>

                                        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl line-clamp-3">
                                            {events[0].description}
                                        </p>

                                        <div className="flex items-center gap-4 pt-4">
                                            <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                                Baca Selengkapnya <ArrowRight size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Visual Decoration for Featured */}
                                    <div className="w-full md:w-1/3 aspect-square relative hidden md:block">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${events[0].color} rounded-full blur-3xl opacity-20 animate-pulse`} />
                                        <div className="relative z-10 w-full h-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 transform rotate-6 group-hover:rotate-3 transition-transform duration-500">
                                            <div className="w-full h-full bg-black/50 rounded-2xl overflow-hidden flex items-center justify-center">
                                                <Megaphone size={80} className="text-white/50" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 z-20 transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500 flex items-center justify-center">
                                            <Star size={40} className="text-yellow-400 fill-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Recent Updates Grid */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-gray-500 font-mono text-sm uppercase tracking-widest">Update Terkini</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {events.slice(1).map((event, i) => (
                                <motion.div
                                    layoutId={`card-${event.id}`}
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-white/30 transition-all flex flex-col h-full"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    <div className="p-8 relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full border border-white/10 ${event.status === 'Baru' ? 'bg-rose-500/20 text-rose-400' : 'bg-gray-800 text-gray-400'}`}>
                                                {event.status}
                                            </span>
                                            <span className="text-gray-500 text-xs font-mono">
                                                {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>

                                        <motion.h3 layoutId={`title-${event.id}`} className="font-serif text-2xl text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                            {event.title}
                                        </motion.h3>

                                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                                            {event.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                                            Baca <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="changelog"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pb-20"
                    >
                        <ChangelogTimeline />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Tampilan Artikel */}
            <AnimatePresence>
                {selectedEvent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEvent(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]"
                        />
                        <motion.div
                            layoutId={`card-${selectedEvent.id}`}
                            className="fixed inset-0 z-[70] overflow-y-auto custom-scrollbar"
                        >
                            <div className="min-h-full flex items-center justify-center p-4 md:p-8">
                                <motion.div
                                    className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors z-20"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className={`h-64 md:h-80 relative overflow-hidden`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${selectedEvent.color} opacity-20`} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={`w-96 h-96 rounded-full bg-gradient-to-r ${selectedEvent.color} blur-[100px] opacity-40 animate-pulse`} />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-[#0a0a0a] to-transparent">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                                                    {selectedEvent.category}
                                                </span>
                                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(selectedEvent.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <motion.h2 layoutId={`title-${selectedEvent.id}`} className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
                                                {selectedEvent.title}
                                            </motion.h2>
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-12 space-y-8">
                                        <p className="text-xl text-gray-300 leading-relaxed font-serif">
                                            {selectedEvent.description}
                                        </p>

                                        <div className="w-full h-px bg-white/10" />

                                        <div className="prose prose-invert prose-lg max-w-none">
                                            <p className="text-gray-400 leading-relaxed">
                                                {selectedEvent.content}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3 pt-4">
                                            {selectedEvent.highlights?.map((tag: string, idx: number) => (
                                                <span key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-gray-300">
                                                    # {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
