import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Calendar, LayoutGrid, Heart, Share2,
    ArrowLeft, Image as ImageIcon, ExternalLink,
    MapPin, Link as LinkIcon, MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { FetchErrorState } from '../components/FetchErrorState';

export const Profile = () => {
    const { username } = useParams<{ username: string }>();
    const [activeTab, setActiveTab] = useState<'karya' | 'tentang' | 'likes'>('karya');

    // Query for Profile Data
    const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
        queryKey: ['profile', username],
        queryFn: async () => {
            if (!username) throw new Error('Username is required');
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, bio, website, role, is_approved, updated_at, created_at')
                .eq('username', username)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!username,
    });

    // Query for User's Works
    const { data: works = [], isLoading: worksLoading } = useQuery({
        queryKey: ['profile-works', profile?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('works')
                .select(`
                    id, 
                    title, 
                    description, 
                    image_url, 
                    division, 
                    slides, 
                    created_at,
                    likes:likes(count),
                    comments:comments(count)
                `)
                .eq('author_id', profile.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!profile?.id,
    });

    // Query for Liked Works
    const { data: likedWorks = [], isLoading: likesLoading } = useQuery({
        queryKey: ['profile-likes', profile?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('likes')
                .select(`
                    work:works (
                        id, 
                        title, 
                        description, 
                        image_url, 
                        division, 
                        slides, 
                        created_at,
                        likes:likes(count),
                        comments:comments(count),
                        author:profiles(username, avatar_url)
                    )
                `)
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data?.map((item: any) => item.work).filter(Boolean) || [];
        },
        enabled: !!profile?.id,
    });

    const loading = profileLoading || (activeTab === 'karya' && worksLoading) || (activeTab === 'likes' && likesLoading);
    const error = profileError;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen bg-[#030303] pt-32 px-4">
            <FetchErrorState message={error ? (error as any).message : 'Profil tidak ditemukan'} onRetry={() => { }} />
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
                                <Calendar size={16} /> Bergabung {formatDate(profile.created_at || profile.updated_at)}
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
                        <button
                            onClick={() => setActiveTab('karya')}
                            className={`pb-4 border-b-2 font-bold text-sm tracking-wider uppercase transition-colors ${activeTab === 'karya' ? 'border-rose-500 text-white' : 'border-transparent text-gray-500 hover:text-white'
                                }`}
                        >
                            Karya
                        </button>
                        <button
                            onClick={() => setActiveTab('tentang')}
                            className={`pb-4 border-b-2 font-bold text-sm tracking-wider uppercase transition-colors ${activeTab === 'tentang' ? 'border-rose-500 text-white' : 'border-transparent text-gray-500 hover:text-white'
                                }`}
                        >
                            Tentang
                        </button>
                        <button
                            onClick={() => setActiveTab('likes')}
                            className={`pb-4 border-b-2 font-bold text-sm tracking-wider uppercase transition-colors ${activeTab === 'likes' ? 'border-rose-500 text-white' : 'border-transparent text-gray-500 hover:text-white'
                                }`}
                        >
                            Likes
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'karya' && (
                        <motion.div
                            key="karya"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full"
                        >
                            {works.length > 0 ? (
                                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                                    {works.map((work, index) => (
                                        <WorkCard key={work.id} work={work} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="Pengguna ini belum mempublikasikan karya apapun." />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'tentang' && (
                        <motion.div
                            key="tentang"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-2xl mx-auto md:mx-0 bg-white/5 border border-white/10 rounded-3xl p-8"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Globe size={20} className="text-rose-500" />
                                Informasi Profil
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-[120px_1fr] gap-4">
                                    <div className="text-gray-500">Username</div>
                                    <div className="font-medium">@{profile.username}</div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] gap-4">
                                    <div className="text-gray-500">Role</div>
                                    <div className="font-medium capitalize">{profile.role || 'Member'}</div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] gap-4">
                                    <div className="text-gray-500">Bergabung</div>
                                    <div className="font-medium">{formatDate(profile.created_at || profile.updated_at)}</div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] gap-4">
                                    <div className="text-gray-500">Status</div>
                                    <div className="font-medium">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${profile.is_approved
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${profile.is_approved ? 'bg-green-500' : 'bg-gray-500'}`} />
                                            {profile.is_approved ? 'Verified' : 'Member'}
                                        </span>
                                    </div>
                                </div>
                                {profile.website && (
                                    <div className="grid grid-cols-[120px_1fr] gap-4">
                                        <div className="text-gray-500">Website</div>
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline break-all">
                                            {profile.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'likes' && (
                        <motion.div
                            key="likes"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full"
                        >
                            {likedWorks.length > 0 ? (
                                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                                    {likedWorks.map((work, index) => (
                                        <WorkCard key={work.id} work={work} index={index} showAuthor />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="Belum ada karya yang disukai." />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const WorkCard = ({ work, index, showAuthor = false }: { work: any, index: number, showAuthor?: boolean }) => (
    <motion.div
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
                        <span className="text-xs font-bold">{work.likes?.[0]?.count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <MessageSquare size={14} />
                        <span className="text-xs font-bold">{work.comments?.[0]?.count || 0}</span>
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
            {showAuthor && work.author && (
                <div className="flex items-center gap-2 mb-3">
                    <img
                        src={work.author.avatar_url || `https://ui-avatars.com/api/?name=${work.author.username}`}
                        alt={work.author.username}
                        className="w-5 h-5 rounded-full border border-white/10"
                    />
                    <span className="text-xs text-gray-400">by {work.author.username}</span>
                </div>
            )}
            <p className="text-xs text-gray-400 line-clamp-2">{work.description}</p>
        </div>
    </motion.div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="py-20 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon size={32} className="text-gray-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Tidak ada data</h3>
        <p className="text-gray-500">{message}</p>
    </div>
);
