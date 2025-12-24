import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Calendar, LayoutGrid, Heart, Share2,
    ArrowLeft, Image as ImageIcon, ExternalLink,
    MapPin, Link as LinkIcon, MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FetchErrorState } from '../components/FetchErrorState';

export const Profile = () => {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<any>(null);
    const [works, setWorks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!username) return;
        setLoading(true);
        setError(null);

        try {
            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, bio, website, role, is_approved, updated_at')
                .eq('username', username)
                .single();

            if (profileError) throw profileError;
            setProfile(profileData);

            // Fetch works for this profile
            const { data: worksData, error: worksError } = await supabase
                .from('works')
                .select('id, title, description, image_url, division, slides, created_at')
                .eq('author_id', profileData.id)
                .order('created_at', { ascending: false });

            if (worksError) throw worksError;
            setWorks(worksData || []);

        } catch (err: any) {
            console.error('Error fetching profile data:', err);
            setError(err.message === 'JSON object requested, multiple (or no) rows returned'
                ? 'Pengguna tidak ditemukan.'
                : 'Terjadi kesalahan saat memuat profil.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Subscribe to Realtime Updates for this profile
        const profileSubscription = supabase
            .channel(`profile-${username}`)
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `username=eq.${username}` },
                (payload) => {
                    setProfile(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(profileSubscription);
        };
    }, [username]);

    if (loading) return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen bg-[#030303] pt-32 px-4">
            <FetchErrorState message={error || 'Profil tidak ditemukan'} onRetry={fetchData} />
            <div className="flex justify-center mt-8">
                <Link to="/karya" className="text-rose-500 flex items-center gap-2 hover:underline">
                    <ArrowLeft size={18} /> Kembali ke Galeri
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030303] text-white pt-32 pb-20 font-sans">
            {/* Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-purple-500 shadow-2xl">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black border-4 border-black">
                                <img
                                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`}
                                    alt={profile.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {profile.is_approved && (
                            <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-[#030303]">
                                <Globe size={16} />
                            </div>
                        )}
                    </motion.div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <h1 className="text-4xl md:text-5xl font-bold">{profile.username}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-gray-400">
                                    {profile.role || 'Member'}
                                </span>
                            </div>
                        </div>

                        <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                            {profile.bio || 'Belum ada bio.'}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-gray-400">
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <LinkIcon size={16} /> {profile.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} /> Bergabung {new Date(profile.updated_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <LayoutGrid size={16} /> {works.length} Karya
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all">
                            Ikuti
                        </button>
                        <button className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="border-b border-white/10 mb-12">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        <button className="pb-4 border-b-2 border-rose-500 text-white font-bold text-sm tracking-wider uppercase">
                            Karya
                        </button>
                        <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-white transition-colors font-bold text-sm tracking-wider uppercase">
                            Tentang
                        </button>
                        <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-white transition-colors font-bold text-sm tracking-wider uppercase">
                            Likes
                        </button>
                    </div>
                </div>

                {/* Works Grid */}
                {works.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                        {works.map((work, index) => (
                            <motion.div
                                key={work.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="break-inside-avoid group relative bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden cursor-pointer hover:border-rose-500/30 transition-all shadow-xl"
                            >
                                <div className="aspect-[4/3] bg-gray-900 overflow-hidden relative">
                                    <img
                                        src={work.image_url || (work.slides?.[0]?.content)}
                                        alt={work.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                                <Heart size={14} className="fill-rose-500 text-rose-500" />
                                                <span className="text-xs font-bold">12</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                                <MessageSquare size={14} />
                                                <span className="text-xs font-bold">4</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-rose-500 transition-colors uppercase tracking-tight">{work.title}</h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 border border-white/10 px-2 py-0.5 rounded">
                                            {work.division}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2">{work.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ImageIcon size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Belum ada karya</h3>
                        <p className="text-gray-500">Pengguna ini belum mempublikasikan karya apapun.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
