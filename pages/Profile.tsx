import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Calendar, LayoutGrid, Heart, Share2,
    ArrowLeft, Image as ImageIcon, ExternalLink,
    MapPin, Link as LinkIcon, MessageSquare, X, Maximize2, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon, Send, Plus, UserMinus, UserPlus, Edit3, AlignLeft, Play
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchErrorState } from '../components/FetchErrorState';
import { useAuth } from '../components/AuthProvider';
import { ImmersiveDetailView } from '../components/Karya/ImmersiveDetailView';
import { useIsMobile } from '../hooks/useIsMobile';
import { motionConfig } from '../lib/motion';
import { useLoadingStatus } from '../components/LoadingTimeoutProvider';
import { useSystemLog } from '../components/SystemLogProvider';
import { EditWorkModal } from '../components/EditWorkModal';
import { Trash2 } from 'lucide-react';

// Helper for code previews (transplanted from Karya.tsx)
const CodeViewer = ({ content }: { content: any }) => {
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const files = React.useMemo(() => {
        try {
            if (typeof content === 'string') {
                if (content.trim().startsWith('[')) return JSON.parse(content);
            }
            if (Array.isArray(content)) return content;
            return null;
        } catch (e) { return null; }
    }, [content]);

    useEffect(() => {
        if (files && files.length > 0) setActiveFileId(files[0].id);
    }, [files]);

    const activeFile = files?.find((f: any) => f.id === activeFileId) || files?.[0];

    if (!files || !Array.isArray(files)) {
        const displayContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
        return (
            <div className="flex-1 overflow-auto p-3 md:p-6 bg-[#0d1117]">
                <pre className="font-mono text-[10px] md:text-xs text-green-400 leading-relaxed whitespace-pre-wrap break-words">
                    {displayContent}
                </pre>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="flex-shrink-0 bg-[#161b22] border-b border-white/10 flex overflow-x-auto no-scrollbar">
                {files.map((file: any) => (
                    <button
                        key={file.id}
                        onClick={() => setActiveFileId(file.id)}
                        className={`px-3 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-mono whitespace-nowrap border-b-2 transition-colors ${file.id === activeFileId
                            ? 'border-blue-500 text-white bg-[#0d1117]'
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        <span className={`mr-1.5 ${file.name?.endsWith('.html') ? 'text-orange-400' :
                            file.name?.endsWith('.css') ? 'text-blue-400' :
                                file.name?.endsWith('.js') ? 'text-yellow-400' : 'text-gray-400'
                            }`}>●</span>
                        {file.name || 'file'}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-auto p-3 md:p-6 bg-[#0d1117]">
                <pre className="font-mono text-[10px] md:text-xs leading-relaxed">
                    <code className={`${activeFile?.language === 'html' ? 'text-orange-300' :
                        activeFile?.language === 'css' ? 'text-blue-300' :
                            activeFile?.language === 'javascript' ? 'text-yellow-300' : 'text-green-300'
                        }`}>
                        {activeFile?.content || '// No content'}
                    </code>
                </pre>
            </div>
        </div>
    );
};

const generateCodePreview = (content: string, language: string = 'html'): string => {
    const baseStyles = `* { margin:0; padding:0; box-sizing:border-box; } body { font-family:system-ui, sans-serif; background:#0a0a0a; color:white; min-height:100vh; display:flex; align-items:center; justify-content:center; } canvas { display:block; margin:auto; }`;
    const code = content || '';
    switch (language) {
        case 'p5js': case 'p5':
            return `<!DOCTYPE html><html><head><style>${baseStyles}</style><script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script></head><body><script>${code}<\/script></body></html>`;
        case 'javascript': case 'js':
            return `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body><div id="app"></div><script>try{${code}}catch(e){document.body.innerHTML='<pre style="color:red">'+e.message+'</pre>'}</script></body></html>`;
        default:
            if (code.trim().toLowerCase().startsWith('<!doctype') || code.trim().toLowerCase().startsWith('<html')) return code;
            return `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>${code}</body></html>`;
    }
};

export const Profile = () => {
    const { username } = useParams<{ username: string }>();
    const [activeTab, setActiveTab] = useState<'karya' | 'tentang' | 'likes'>('karya');
    const { user, profile: currentUserProfile } = useAuth();
    const { setIsLoading } = useLoadingStatus();
    const isMobile = useIsMobile();
    const queryClient = useQueryClient();
    const { addLog } = useSystemLog();

    // State for Modal
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [showSourceCode, setShowSourceCode] = useState(false);

    // State for Social Interaction (for modal)
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Edit/Delete State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingWork, setEditingWork] = useState<any>(null);

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
                    thumbnail_url,
                    author,
                    author_id,
                    type,
                    division, 
                    tags,
                    slides, 
                    content,
                    code_language,
                    created_at,
                    likes:likes(count),
                    comments:comments(count),
                    author_profile:profiles(username, avatar_url)
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
                        thumbnail_url,
                        author,
                        author_id,
                        type,
                        division, 
                        tags,
                        slides, 
                        content,
                        code_language,
                        created_at,
                        likes:likes(count),
                        comments:comments(count),
                        author_profile:profiles(username, avatar_url)
                    )
                `)
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data?.map((item: any) => item.work).filter(Boolean) || [];
        },
        enabled: !!profile?.id,
    });

    // Query for Social detail (for modal)
    const { data: socialData } = useQuery({
        queryKey: ['work-social', selectedId],
        queryFn: async () => {
            if (!selectedId) return null;
            const [{ count: likesCount }, { data: userLike }, { data: comments }] = await Promise.all([
                supabase.from('likes').select('*', { count: 'exact', head: true }).eq('work_id', selectedId),
                user ? supabase.from('likes').select('id').eq('work_id', selectedId).eq('user_id', user.id).single() : Promise.resolve({ data: null }),
                supabase.from('comments').select('id, content, created_at, user_id, profiles:user_id (username, avatar_url, role)').eq('work_id', selectedId).order('created_at', { ascending: false })
            ]);
            return { likesCount: likesCount || 0, isLiked: !!userLike, comments: comments || [] };
        },
        enabled: !!selectedId,
    });

    useEffect(() => {
        if (socialData) {
            setLikesCount(socialData.likesCount);
            setIsLiked(socialData.isLiked);
            setComments(socialData.comments);
        }
    }, [socialData]);

    const handleToggleLike = async () => {
        if (!user || !selectedId) return;
        const prevLiked = isLiked;
        const prevCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
        try {
            if (prevLiked) {
                await supabase.from('likes').delete().eq('work_id', selectedId).eq('user_id', user.id);
                addLog('Batal menyukai karya.', 'info');
            } else {
                await supabase.from('likes').insert({ work_id: selectedId, user_id: user.id });
                addLog('Menyukai karya!', 'success');
            }
        } catch (error) {
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedId || !newComment.trim()) return;
        setIsSubmittingComment(true);
        try {
            const { data, error } = await supabase.from('comments').insert({ work_id: selectedId, user_id: user.id, content: newComment.trim() }).select().single();
            if (error) throw error;
            setComments(prev => [{ ...data, profiles: currentUserProfile }, ...prev]);
            setNewComment('');
            addLog('Komentar berhasil dikirim.', 'success');
        } catch (err: any) {
            addLog(`Gagal mengirim komentar.`, 'error');
        } finally { setIsSubmittingComment(false); }
    };

    const handleDeleteWork = async (workId: string) => {
        if (!confirm('Apakah anda yakin ingin menghapus karya ini? Tindakan ini tidak dapat dibatalkan.')) return;

        try {
            const { error: deleteError } = await supabase
                .from('works')
                .delete()
                .eq('id', workId);

            if (deleteError) throw deleteError;

            addLog('Karya berhasil dihapus.', 'success');
            setSelectedId(null);
            queryClient.invalidateQueries({ queryKey: ['profile-works', profile?.id] });
        } catch (err: any) {
            addLog('Gagal menghapus karya.', 'error');
        }
    };

    const handleEditSuccess = () => {
        addLog('Karya berhasil diperbarui.', 'success');
        queryClient.invalidateQueries({ queryKey: ['profile-works', profile?.id] });
    };

    const handleCarouselScroll = () => {
        if (!carouselRef.current) return;
        setActiveSlide(Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth));
    };

    const scrollToSlide = (index: number) => {
        carouselRef.current?.scrollTo({ left: index * carouselRef.current.offsetWidth, behavior: 'smooth' });
    };

    const selectedArtwork = (activeTab === 'karya' ? works : likedWorks).find((a: any) => a.id === selectedId);

    const renderCardContent = (art: any) => {
        const thumb = art.thumbnail_url || art.image_url || art.slides?.[0]?.content;
        switch (art.type) {
            case 'text':
                return (
                    <div className="w-full h-full bg-[#f0f0f0] text-black p-8 flex flex-col justify-center items-center font-serif relative overflow-hidden group-hover:bg-white transition-colors">
                        <AlignLeft className="absolute top-4 left-4 text-gray-300" size={24} />
                        <div className="prose prose-sm prose-invert text-black line-clamp-6 pointer-events-none" dangerouslySetInnerHTML={{ __html: art.content }} />
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f0f0f0] to-transparent group-hover:from-white transition-colors"></div>
                    </div>
                );
            case 'code':
                return (
                    <div className="w-full h-full bg-[#0d1117] relative group overflow-hidden">
                        <iframe src={`data:text/html;charset=utf-8,${encodeURIComponent(generateCodePreview(art.content, art.code_language || 'html'))}`} sandbox="allow-scripts allow-same-origin" className="w-[200%] h-[200%] border-0 transform scale-50 origin-top-left pointer-events-none bg-white" title="Code Preview" />
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-green-400 border border-green-500/20">CODE</div>
                    </div>
                );
            case 'video':
                return (
                    <div className="relative w-full h-full group/video">
                        <video src={art.image_url} className="w-full h-full object-cover" muted loop playsInline onMouseOver={(e) => e.currentTarget.play()} onMouseOut={(e) => e.currentTarget.pause()} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-transparent transition-colors pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"><Play className="text-white fill-current ml-1" size={24} /></div>
                        </div>
                    </div>
                );
            default: return <img src={thumb} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />;
        }
    };

    const loading = profileLoading || (activeTab === 'karya' && worksLoading) || (activeTab === 'likes' && likesLoading);

    useEffect(() => {
        setIsLoading(loading);
        return () => setIsLoading(false);
    }, [loading, setIsLoading]);

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
            {/* Edit Modal */}
            <EditWorkModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingWork(null);
                }}
                onSave={handleEditSuccess}
                work={editingWork}
            />

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
                            <FollowStats profileId={profile.id} />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <ProfileActions profileId={profile.id} />
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
                <div className="relative"> {/* Container to prevent layout shift */}
                    <AnimatePresence mode="popLayout" initial={false}>
                        {activeTab === 'karya' && (
                            <motion.div
                                key="tab-karya"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="w-full"
                            >
                                {works.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {works.map((work, index) => (
                                            <WorkCard key={work.id} work={work} index={index} onClick={() => { setSelectedId(work.id); setShowSourceCode(false); }} renderContent={renderCardContent} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState message="Pengguna ini belum mempublikasikan karya apapun." />
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'likes' && (
                            <motion.div
                                key="tab-likes"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="w-full"
                            >
                                {likedWorks.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {likedWorks.map((work, index) => (
                                            <WorkCard key={work.id} work={work} index={index} showAuthor={true} onClick={() => { setSelectedId(work.id); setShowSourceCode(false); }} renderContent={renderCardContent} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState message="Belum ada karya yang disukai." />
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'tentang' && (
                            <motion.div
                                key="tab-tentang"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-2xl mx-auto md:mx-0 bg-white/5 border border-white/10 rounded-3xl p-8"
                            >
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Globe size={20} className="text-rose-500" />
                                    Informasi Profil
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Bio</div>
                                        <div className="text-gray-200 leading-relaxed italic">"{profile.bio || 'Belum ada bio.'}"</div>
                                    </div>

                                    <div className="border-t border-white/5 my-4" />

                                    <div className="grid grid-cols-[120px_1fr] gap-4">
                                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Username</div>
                                        <div className="font-medium">@{profile.username}</div>
                                    </div>
                                    <div className="grid grid-cols-[120px_1fr] gap-4">
                                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Role</div>
                                        <div className="font-medium capitalize">{profile.role || 'Member'}</div>
                                    </div>
                                    <div className="grid grid-cols-[120px_1fr] gap-4">
                                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Bergabung</div>
                                        <div className="font-medium">{formatDate(profile.created_at || profile.updated_at)}</div>
                                    </div>
                                    <div className="grid grid-cols-[120px_1fr] gap-4">
                                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Status</div>
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
                                            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Website</div>
                                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline break-all">
                                                {profile.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}


                    </AnimatePresence>
                </div>

                {/* Modal Detail Karya (Transplanted from Karya.tsx) */}
                <AnimatePresence>
                    {selectedId && selectedArtwork && (
                        isMobile ? (
                            <ImmersiveDetailView
                                art={selectedArtwork}
                                onClose={() => setSelectedId(null)}
                                onEdit={user && (user.id === selectedArtwork.author || user.id === selectedArtwork.author_id) ? () => {
                                    setEditingWork(selectedArtwork);
                                    setIsEditModalOpen(true);
                                } : undefined}
                                onDelete={user && (user.id === selectedArtwork.author || user.id === selectedArtwork.author_id) ? () => handleDeleteWork(selectedArtwork.id) : undefined}
                                renderContent={(art, showCode) => {
                                    if (art.type === 'code') {
                                        return showCode ? <CodeViewer content={art.content} /> : <iframe src={`data:text/html;charset=utf-8,${encodeURIComponent(generateCodePreview(art.content, art.code_language || 'html'))}`} sandbox="allow-scripts allow-same-origin" className="w-full h-full border-0 bg-white" title="Interactive Preview" />;
                                    } else if (art.type === 'video') {
                                        return <div className="w-full h-full flex items-center justify-center bg-black"><video src={art.image_url} controls autoPlay className="max-w-full max-h-full" /></div>;
                                    }
                                    return <div className="w-full h-full flex items-center justify-center bg-black">{renderCardContent(art)}</div>;
                                }}
                            />
                        ) : (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:pt-20 md:pb-10 pointer-events-none">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedId(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl pointer-events-auto" />
                                <motion.div layoutId={`card-${selectedId}`} className="relative w-full max-w-6xl bg-[#111] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] pointer-events-auto border border-white/10">
                                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                                        {user && (user.id === selectedArtwork.author || user.id === selectedArtwork.author_id) && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingWork(selectedArtwork);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-2 bg-black/70 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-md border border-white/20"
                                                    title="Edit Karya"
                                                >
                                                    <Edit3 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteWork(selectedArtwork.id)}
                                                    className="p-2 bg-black/70 hover:bg-rose-500 text-white hover:text-white rounded-full transition-colors backdrop-blur-md border border-white/20"
                                                    title="Hapus Karya"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </>
                                        )}
                                        <button onClick={() => setSelectedId(null)} className="p-2 bg-black/70 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-md border border-white/20"><X size={20} /></button>
                                    </div>

                                    <div className="w-full h-[40vh] md:h-auto md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                        <motion.div layoutId={`content-${selectedId}`} className="w-full h-full flex items-center justify-center">
                                            {selectedArtwork.type === 'slide' && (
                                                <div className="relative w-full h-full flex items-center justify-center group/carousel">
                                                    <div ref={carouselRef} onScroll={handleCarouselScroll} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar bg-black">
                                                        {(selectedArtwork.slides || []).map((slide: any, i: number) => (
                                                            <div key={i} className="min-w-full h-full snap-center flex items-center justify-center"><img src={slide.content} className="max-w-full max-h-full object-contain" /></div>
                                                        ))}
                                                    </div>
                                                    {selectedArtwork.slides?.length > 1 && (
                                                        <>
                                                            {activeSlide > 0 && <button onClick={(e) => { e.stopPropagation(); scrollToSlide(activeSlide - 1); }} className="absolute left-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover/carousel:opacity-100"><ArrowLeftIcon size={20} /></button>}
                                                            {activeSlide < selectedArtwork.slides.length - 1 && <button onClick={(e) => { e.stopPropagation(); scrollToSlide(activeSlide + 1); }} className="absolute right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover/carousel:opacity-100"><ArrowRightIcon size={20} /></button>}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {selectedArtwork.type === 'image' && <img src={selectedArtwork.image_url || selectedArtwork.slides?.[0]?.content} className="w-full h-full object-contain" />}
                                            {selectedArtwork.type === 'video' && <video src={selectedArtwork.image_url} controls autoPlay className="max-w-full max-h-full" />}
                                            {selectedArtwork.type === 'text' && <div className="w-full h-full bg-[#f0f0f0] text-black p-12 md:p-20 overflow-y-auto"><div className="prose prose-lg font-serif" dangerouslySetInnerHTML={{ __html: selectedArtwork.content }} /></div>}
                                            {selectedArtwork.type === 'code' && (
                                                <div className="w-full h-full bg-[#0d1117] relative flex flex-col">
                                                    <div className="absolute top-4 right-4 z-50"><button onClick={() => setShowSourceCode(!showSourceCode)} className="bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20 backdrop-blur-md hover:bg-white hover:text-black transition-colors">{showSourceCode ? '▶ HASIL' : '</> KODE'}</button></div>
                                                    {showSourceCode ? <CodeViewer content={selectedArtwork.content} /> : <iframe src={`data:text/html;charset=utf-8,${encodeURIComponent(generateCodePreview(selectedArtwork.content, selectedArtwork.code_language || 'html'))}`} sandbox="allow-scripts allow-same-origin" className="w-full h-full border-0 bg-white" title="Code Preview" />}
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>

                                    <div className="flex-1 md:w-2/5 p-8 overflow-y-auto custom-scrollbar bg-[#111] border-l border-white/10">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-gray-400">{selectedArtwork.division}</span>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4">{selectedArtwork.title}</h2>
                                        <p className="text-gray-400 mb-8 leading-relaxed">{selectedArtwork.description}</p>
                                        <div className="flex items-center gap-6 py-6 border-y border-white/5 mb-8">
                                            <button onClick={handleToggleLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-white'}`}><Heart size={20} className={isLiked ? 'fill-rose-500' : ''} /> <span className="font-bold">{likesCount}</span></button>
                                            <div className="flex items-center gap-2 text-gray-400"><MessageSquare size={20} /> <span className="font-bold">{comments.length}</span></div>
                                        </div>
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-lg">Komentar</h3>
                                            <form onSubmit={handleSubmitComment} className="flex gap-2">
                                                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Tulis komentar..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-rose-500/50" />
                                                <button type="submit" disabled={isSubmittingComment} className="p-2 bg-rose-500 text-white rounded-full disabled:opacity-50"><Send size={18} /></button>
                                            </form>
                                            <div className="space-y-4">
                                                {comments.map((comment, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <img src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles?.username}`} className="w-8 h-8 rounded-full" />
                                                        <div className="flex-1 bg-white/5 rounded-2xl p-3">
                                                            <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-rose-500">@{comment.profiles?.username}</span><span className="text-[10px] text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span></div>
                                                            <p className="text-sm text-gray-300">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const WorkCard = ({ work, index, onClick, renderContent, showAuthor = false }: { work: any, index: number, onClick: () => void, renderContent: (art: any) => React.ReactNode, showAuthor?: boolean }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        onClick={onClick}
        className="break-inside-avoid group relative bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden cursor-pointer hover:border-rose-500/30 transition-all shadow-xl"
    >
        <div className="aspect-[4/5] bg-gray-900 overflow-hidden relative">
            {renderContent(work)}
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
                <h3 className="font-bold text-sm md:text-base leading-tight group-hover:text-rose-500 transition-colors uppercase tracking-tight line-clamp-2">{work.title}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 border border-white/10 px-2 py-0.5 rounded shrink-0">
                    {work.division}
                </span>
            </div>
            {showAuthor && work.author_profile && (
                <div className="flex items-center gap-2 mb-3">
                    <img
                        src={work.author_profile.avatar_url || `https://ui-avatars.com/api/?name=${work.author_profile.username}`}
                        alt={work.author_profile.username}
                        className="w-5 h-5 rounded-full border border-white/10"
                    />
                    <span className="text-[10px] text-gray-400">by {work.author_profile.username}</span>
                </div>
            )}
            <p className="text-[10px] text-gray-400 line-clamp-2">{work.description}</p>
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



const ProfileActions = ({ profileId }: { profileId: string }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { addLog } = useSystemLog();
    const isOwner = user?.id === profileId;

    // Check if following
    const { data: isFollowing = false } = useQuery({
        queryKey: ['isFollowing', user?.id, profileId],
        queryFn: async () => {
            if (!user) return false;
            const { data } = await supabase
                .from('follows')
                .select('id')
                .eq('follower_id', user.id)
                .eq('following_id', profileId)
                .single();
            return !!data;
        },
        enabled: !!user && !isOwner
    });

    const followMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error('Must be logged in');
            if (isFollowing) {
                await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', profileId);
                addLog('Berhenti mengikuti pengguna.', 'info');
            } else {
                await supabase.from('follows').insert({ follower_id: user.id, following_id: profileId });
                addLog('Sekarang mengikuti pengguna!', 'success');
            }
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['isFollowing', user?.id, profileId] });
            const previousIsFollowing = queryClient.getQueryData(['isFollowing', user?.id, profileId]);
            queryClient.setQueryData(['isFollowing', user?.id, profileId], !isFollowing);
            return { previousIsFollowing };
        },
        onError: (_err, _newTodo, context) => {
            queryClient.setQueryData(['isFollowing', user?.id, profileId], context?.previousIsFollowing);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['isFollowing', user?.id, profileId] });
        }
    });

    if (isOwner) {
        return (
            <Link to="/settings" className="bg-white/10 border border-white/10 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                <Edit3 size={18} /> Edit Profil
            </Link>
        );
    }

    if (!user) {
        return (
            <Link to="/login" className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-all">
                Login untuk Ikuti
            </Link>
        );
    }

    return (
        <button
            onClick={() => followMutation.mutate()}
            disabled={followMutation.isPending}
            className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${isFollowing
                ? 'bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500 border-2 border-rose-500/50 hover:border-rose-500'
                : 'bg-white text-black hover:bg-gray-200'
                }`}
        >
            {isFollowing ? (
                <>
                    <span className="text-rose-500"><UserMinus size={18} /></span>
                    <span className="text-rose-500">Mengikuti</span>
                </>
            ) : (
                <>
                    <UserPlus size={18} /> Ikuti
                </>
            )}
        </button>
    );
};

const FollowStats = ({ profileId }: { profileId: string }) => {
    const { data: stats } = useQuery({
        queryKey: ['followStats', profileId],
        queryFn: async () => {
            const { count: followers } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('following_id', profileId);

            const { count: following } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('follower_id', profileId);

            return { followers: followers || 0, following: following || 0 };
        }
    });

    return (
        <div className="flex gap-4 text-gray-400">
            <div className="flex items-center gap-1">
                <span className="font-bold text-white">{stats?.followers || 0}</span>
                <span className="text-xs">Pengikut</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="font-bold text-white">{stats?.following || 0}</span>
                <span className="text-xs">Mengikuti</span>
            </div>
        </div>
    );
};
