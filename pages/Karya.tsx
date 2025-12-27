import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, X, Download, Heart, Share2, Plus, Play,
  Code, AlignLeft, Image as ImageIcon, Maximize2,
  ArrowLeft, ArrowRight, Send, MessageCircle, Search,
  SlidersHorizontal, Calendar, TrendingUp, MessageSquare,
  ChevronDown, Layers
} from 'lucide-react';

// Map Divisi ke Bahasa Indonesia
const DIVISION_LABELS: Record<string, string> = {
  all: 'Semua',
  graphics: 'Grafis',
  video: 'Video',
  writing: 'Tulisan',
  coding: 'Coding',
  meme: 'Meme'
};
import { KaryaCard } from '../components/KaryaCard';
import { ImmersiveDetailView } from '../components/Karya/ImmersiveDetailView';
import { useIsMobile } from '../hooks/useIsMobile';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchErrorState } from '../components/FetchErrorState';
import { useAuth } from '../components/AuthProvider';
import { useLoadingStatus } from '../components/LoadingTimeoutProvider';

import { supabase } from '../lib/supabase';
import { motionConfig } from '../lib/motion';

// Helper buat generate pratinjau kode live (HTML)
// Komponen Helper buat lihat Kode
const CodeViewer = ({ content }: { content: any }) => {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const files = React.useMemo(() => {
    try {
      if (typeof content === 'string') {
        // Coba parse kalo string
        if (content.trim().startsWith('[')) {
          return JSON.parse(content);
        }
      }
      if (Array.isArray(content)) {
        return content;
      }
      return null;
    } catch (e) {
      return null;
    }
  }, [content]);

  // Atur file aktif awal pas file-filenya dimuat
  useEffect(() => {
    if (files && files.length > 0) {
      setActiveFileId(files[0].id);
    }
  }, [files]);

  const activeFile = files?.find((f: any) => f.id === activeFileId) || files?.[0];

  if (!files || !Array.isArray(files)) {
    // Logika fallback buat konten lama/simple
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
      {/* Tab Bar - Scrollable on Mobile */}
      <div className="flex-shrink-0 bg-[#161b22] border-b border-white/10 flex overflow-x-auto no-scrollbar">
        {files.map((file: any) => (
          <button
            key={file.id}
            onClick={() => setActiveFileId(file.id)}
            className={`px - 3 md: px - 4 py - 2 md: py - 3 text - [10px] md: text - xs font - mono whitespace - nowrap border - b - 2 transition - colors ${file.id === activeFileId
              ? 'border-blue-500 text-white bg-[#0d1117]'
              : 'border-transparent text-gray-500 hover:text-gray-300'
              } `}
          >
            <span className={`mr - 1.5 ${file.name?.endsWith('.html') ? 'text-orange-400' :
              file.name?.endsWith('.css') ? 'text-blue-400' :
                file.name?.endsWith('.js') ? 'text-yellow-400' : 'text-gray-400'
              } `}>●</span>
            {file.name || 'file'}
          </button>
        ))}
      </div>

      {/* Konten Kode - Responsif */}
      <div className="flex-1 overflow-auto p-3 md:p-6 bg-[#0d1117]">
        <pre className="font-mono text-[10px] md:text-xs leading-relaxed">
          <code className={`${activeFile?.language === 'html' ? 'text-orange-300' :
            activeFile?.language === 'css' ? 'text-blue-300' :
              activeFile?.language === 'javascript' ? 'text-yellow-300' : 'text-green-300'
            } `}>
            {activeFile?.content || '// No content'}
          </code>
        </pre>
      </div>
    </div>
  );
};

const generateCodePreview = (content: any, language: string = 'html'): string => {
  if (!content) return '';

  const baseStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
  font-family: system-ui, sans-serif;
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
    canvas { display: block; margin: auto; }
`;

  // Helper to escape </script> to prevent breaking out of the container script tag
  const escapeScript = (str: any) => {
    if (typeof str !== 'string') return '';
    return str.replace(/<\/script>/gi, '<\\/script>');
  };

  // Otomatis deteksi kalo kontennya JSON multi-file
  // Bisa jadi string JSON atau objek yang udah di-parse sama Supabase/client
  const isJsonArray = (typeof content === 'string' && content.trim().startsWith('[')) || Array.isArray(content);

  if (language === 'json_multifile' || isJsonArray) {
    try {
      const files = typeof content === 'string' ? JSON.parse(content) : content;
      if (!Array.isArray(files) || files.length === 0) throw new Error('Not a valid files array');

      // Cari file berdasarkan tipe (pake fallback kals filenya cuma satu tapi isMain-nya lupa di-set)
      const htmlFile = files.find((f: any) => f.name?.endsWith('.html'));
      const cssFile = files.find((f: any) => f.name?.endsWith('.css'));
      const mainJsFile = files.find((f: any) => f.isMain && f.name?.endsWith('.js')) ||
        files.find((f: any) => f.name?.endsWith('.js'));
      const otherJsFile = files.find((f: any) => f.name?.endsWith('.js') && f.id !== mainJsFile?.id);

      // SKENARIO A: Ada file HTML - pake sebagai basis
      if (htmlFile?.content) {
        let html = htmlFile.content;
        if (cssFile?.content) {
          html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
        }
        if (mainJsFile?.content || otherJsFile?.content) {
          const scriptsContent = (mainJsFile?.content || '') + '\n' + (otherJsFile?.content || '');
          html = html.replace('</body>', `<script>${escapeScript(scriptsContent)}</script></body>`);
        }
        return html;
      }

      // SKENARIO B: Gak ada HTML, tapi ada file JS (kayaknya p5.js atau vanilla JS)
      if (mainJsFile?.content) {
        const jsCode = mainJsFile.content;
        const isP5 = jsCode.includes('createCanvas') || jsCode.includes('setup()') || jsCode.includes('draw()');

        if (isP5) {
          return `<!DOCTYPE html><html><head><style>${baseStyles}</style>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
  ${cssFile?.content ? `<style>${cssFile.content}</style>` : ''}
</head><body><script>${escapeScript(jsCode)}</script></body></html>`;
        } else {
          return `<!DOCTYPE html><html><head><style>${baseStyles}</style>
  ${cssFile?.content ? `<style>${cssFile.content}</style>` : ''}
</head><body><div id="app"></div><script>try{${escapeScript(jsCode)}}catch(e){document.body.innerHTML = '<pre style="color:red">' + e.message + '</pre>'}</script></body></html>`;
        }
      }

      // SKENARIO C: Cuma ada CSS atau file lain
      if (cssFile?.content) {
        return `<!DOCTYPE html><html><head><style>${baseStyles}\n${cssFile.content}</style></head><body></body></html>`;
      }

      return `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#ff6b6b;padding:20px;font-family:monospace;">⚠️ Tidak dapat merender: File utama tidak ditemukan</body></html>`;

    } catch (e) {
      console.error('Error generating preview from JSON:', e);
    }
  }

  // Fallback buat format string yang lama (legacy)
  const code = typeof content === 'string' ? content : '';

  switch (language) {
    case 'p5js':
    case 'p5':
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
</head><body><script>${escapeScript(code)}</script></body></html>`;
    case 'html':
      return code; // Harusnya udah valid HTML
    case 'javascript':
    case 'js':
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body><div id="app"></div><script>try{${escapeScript(code)}}catch(e){document.body.innerHTML = '<pre style="color:red">' + e.message + '</pre>'}</script></body></html>`;
    default:
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>${code}</body></html>`;
  }
};

export const Karya = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { setIsLoading } = useLoadingStatus();
  const isMobile = useIsMobile();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('all');

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes' | 'comments'>('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 16; // 4x4 grid friendly

  // State Sosial (Like/Comment)
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // React Query for Works
  const { data: worksData, isLoading: worksLoading, error: worksError, isFetching: worksFetching } = useQuery({
    queryKey: ['works', filter, page, sortBy],
    queryFn: async () => {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Step 1: Fetch works WITHOUT nested relationships to avoid N+1 problem
      let query = supabase
        .from('works')
        .select(`
          id, title, description, image_url, author_id, author,
          type, division, tags, slides, code_language, content, 
          thumbnail_url, created_at
        `, { count: 'exact' });

      // Apply Sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else {
        // Fallback or other sorts
        query = query.order('created_at', { ascending: false });
      }

      if (filter !== 'all') {
        query = query.eq('division', filter);
      }

      const { data: works, error, count } = await query.range(from, to);
      if (error) throw error;
      if (!works || works.length === 0) return { data: [], count: 0 };

      // Step 2: Fetch counts and profile info in parallel for the retrieved works
      const workIds = works.map(w => w.id);
      const authorIds = [...new Set(works.filter(w => w.author_id).map(w => w.author_id))];

      const [likesRes, commentsRes, profilesRes] = await Promise.all([
        supabase.from('likes').select('work_id').in('work_id', workIds),
        supabase.from('comments').select('work_id').in('work_id', workIds),
        authorIds.length > 0
          ? supabase.from('profiles').select('id, username, avatar_url, role').in('id', authorIds)
          : Promise.resolve({ data: [] })
      ]);

      // Step 3: Combine data
      const likesMap = new Map();
      likesRes.data?.forEach(l => likesMap.set(l.work_id, (likesMap.get(l.work_id) || 0) + 1));

      const commentsMap = new Map();
      commentsRes.data?.forEach(c => commentsMap.set(c.work_id, (commentsMap.get(c.work_id) || 0) + 1));

      const profileMap = new Map(profilesRes.data?.map(p => [p.id, p]) as [string, any][]);

      const enrichedWorks = works.map(w => ({
        ...w,
        likes: { count: likesMap.get(w.id) || 0 },
        comments: { count: commentsMap.get(w.id) || 0 },
        author_profile: profileMap.get(w.author_id)
      }));

      return { data: enrichedWorks, count };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: true,
  });

  useEffect(() => {
    setIsLoading(worksLoading || worksFetching);
    return () => setIsLoading(false);
  }, [worksLoading, worksFetching, setIsLoading]);

  // Sync total count with React Query result
  useEffect(() => {
    if (worksData) {
      setTotalCount(worksData.count || 0);
    }
  }, [worksData]);



  const { data: socialData, isLoading: socialLoading } = useQuery({
    queryKey: ['work-social', selectedId],
    queryFn: async () => {
      if (!selectedId) return null;

      const [
        { count: likesCount },
        { data: userLike },
        { data: comments }
      ] = await Promise.all([
        supabase.from('likes').select('*', { count: 'exact', head: true }).eq('work_id', selectedId),
        user ? supabase.from('likes').select('id').eq('work_id', selectedId).eq('user_id', user.id).single() : Promise.resolve({ data: null }),
        supabase.from('comments').select('id, content, created_at, user_id, profiles:user_id (username, avatar_url, role)').eq('work_id', selectedId).order('created_at', { ascending: false })
      ]);

      return {
        likesCount: likesCount || 0,
        isLiked: !!userLike?.data,
        comments: comments || []
      };
    },
    enabled: !!selectedId,
  });

  // Sync social states with query result (for initial load)
  useEffect(() => {
    if (socialData) {
      setLikesCount(socialData.likesCount);
      setIsLiked(socialData.isLiked);
      setComments(socialData.comments);
    }
  }, [socialData]);

  // Reset slide aktif pas ganti karya
  useEffect(() => {
    setActiveSlide(0);
  }, [selectedId]);

  const handleToggleLike = async () => {
    if (!user || !selectedId) {
      alert('Silakan login untuk menyukai karya ini.');
      return;
    }

    // Update Optimis (Biar berasa cepet)
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      if (previousIsLiked) {
        // Hapus Like
        await supabase.from('likes').delete().eq('work_id', selectedId).eq('user_id', user.id);
      } else {
        // Tambah Like
        await supabase.from('likes').insert({ work_id: selectedId, user_id: user.id });
      }
    } catch (error) {
      // Balikin lagi kalo error
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedId || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          work_id: selectedId,
          user_id: user.id,
          content: newComment.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Tambah ke state lokal (Agak optimis, atau langsung tempel hasilnya)
      if (data) {
        // Kita butuh data profil buat tampilan, biasanya ambil ulang atau simulasi aja:
        const newCommentObj = {
          ...data,
          profiles: profile // Pake profil user saat ini
        };
        setComments(prev => [newCommentObj, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Gagal mengirim komentar.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Atur scroll snap buat update dot yang aktif
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveSlide(index);
  };

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth'
    });
  };

  const artworks = worksData?.data || [];
  const selectedArtwork = artworks.find(a => a.id === selectedId);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Helper untuk merender konten kartu berdasarkan tipe
  const renderCardContent = (art: any, showCode: boolean = false) => {
    switch (art.type) {
      case 'text':
        return (
          <div className="w-full h-full bg-[#f0f0f0] text-black p-8 flex flex-col justify-center items-center font-serif relative overflow-hidden group-hover:bg-white transition-colors">
            <AlignLeft className="absolute top-4 left-4 text-gray-300" size={24} />
            <div
              className="prose prose-sm prose-invert text-black line-clamp-6 pointer-events-none"
              dangerouslySetInnerHTML={{ __html: art.content }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f0f0f0] to-transparent group-hover:from-white transition-colors"></div>
          </div>
        );
      case 'code':
        // Kalo showCode true, tampilin CodeViewer (bukan iframe)
        if (showCode) {
          return (
            <div className="w-full h-full bg-[#0d1117]">
              <CodeViewer content={art.content} />
            </div>
          );
        }
        return (
          <div className="w-full h-full bg-[#0d1117] relative group overflow-hidden">
            {/* Iframe Pratinjau buat Kartu - Pake Data URI biar lebih kompatibel */}
            <iframe
              src={`data:text/html;charset=utf-8,${encodeURIComponent(generateCodePreview(art.content, art.code_language || 'html'))}`}
              sandbox="allow-scripts allow-same-origin"
              className="w-[200%] h-[200%] border-0 transform scale-50 origin-top-left pointer-events-none bg-white" // Paksa background putih buat konten iframe
              title="Code Preview"
            />
            <div className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-green-400 border border-green-500/20">
              CODE
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="relative w-full h-full group/video bg-black">
            <video
              src={art.image_url}
              poster={art.thumbnail_url}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => e.currentTarget.pause()}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-transparent transition-colors pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover/video:scale-110 transition-transform">
                <Play className="text-white fill-current ml-1" size={24} />
              </div>
            </div>
          </div>
        );

      case 'slide':
      case 'image':
      case 'meme':
        // Jika ada lebih dari satu slide, tampilin pratinjau yang sesuai atau tetap thumbnail
        const hasSlides = art.slides && art.slides.length > 1;
        const previewUrl = art.thumbnail_url || art.image_url || (art.slides?.[0]?.content);
        return (
          <div className="relative w-full h-full group/image bg-black">
            <img src={previewUrl} alt={art.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110" />
            {hasSlides && (
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-bold border border-white/10 opacity-0 group-hover/image:opacity-100 transition-opacity">
                <Layers size={10} className="inline mr-1" />
                {art.slides.length} SLIDES
              </div>
            )}
          </div>
        );
      default:
        return <img src={art.thumbnail_url || art.image_url || (art.slides?.[0]?.content)} alt={art.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />;
    }
  };

  // State buat Ganti Tampilan Kode di Modal
  const [showSourceCode, setShowSourceCode] = useState(false);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-[1600px] mx-auto relative">

      {/* Header & Kontrol - SAMA (Gak Berubah) */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 truncate">Galeri</h1>
          <p className="text-gray-400 text-lg truncate">Kurasi visual terbaik dari komunitas.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Scrollable Filters */}
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto overflow-y-hidden pb-4 md:pb-0 no-scrollbar">
            <div className="flex flex-nowrap bg-[#111] p-1 rounded-full border border-white/10 relative shrink-0">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'graphics', label: 'Grafis' },
                { id: 'video', label: 'Video' },
                { id: 'writing', label: 'Tulisan' },
                { id: 'coding', label: 'Coding' },
                { id: 'meme', label: 'Meme' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    setPage(1);
                  }}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap z-10 ${filter === f.id ? 'text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {filter === f.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fixed Controls (Sort + Create) */}
          <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#111] border border-white/10 rounded-full text-sm text-white font-bold hover:bg-white/5 transition-all"
              >
                <SlidersHorizontal size={16} className="text-gray-500" />
                <span>
                  {sortBy === 'newest' ? 'Terbaru' :
                    sortBy === 'oldest' ? 'Terlama' :
                      sortBy === 'likes' ? 'Terpopuler' : 'Banyak Diskusi'}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowSortDropdown(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-[#181818] border border-white/10 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
                    >
                      {[
                        { id: 'newest', label: 'Paling Baru', icon: Calendar },
                        { id: 'oldest', label: 'Paling Lama', icon: Calendar },
                        { id: 'likes', label: 'Terpopuler', icon: TrendingUp },
                        { id: 'comments', label: 'Banyak Diskusi', icon: MessageSquare },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id as any);
                            setPage(1);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${sortBy === option.id ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <option.icon size={16} />
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/studio"
              className="hidden md:flex bg-white text-black px-6 py-3 rounded-full font-bold items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Plus size={20} /> Buat Karya
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Masonry Modern - Pinterest Style - SAMA (Gak berubah) */}
      {worksError ? (
        <FetchErrorState message={(worksError as any).message || 'Gagal memuat karya'} onRetry={() => setPage(1)} />
      ) : (worksLoading || worksFetching) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-[2rem] overflow-hidden h-[400px] animate-pulse border border-white/5 shadow-lg">
              <div className="h-full w-full bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>
          ))}
        </div>
      ) : worksData?.data && worksData.data.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={filter + sortBy + page}
            variants={motionConfig.variants.staggerContainer}
            initial="initial"
            animate="animate"
            exit="initial"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {worksData.data.map((art, index) => (
              <motion.div
                key={art.id}
                layout
                className="h-full"
                variants={motionConfig.variants.fadeInUp}
                transition={{
                  duration: motionConfig.durations.normal,
                  ease: motionConfig.easings.smooth,
                  layout: { duration: 0.3 }
                }}
              >
                <KaryaCard
                  art={art}
                  index={index}
                  onClick={() => { setSelectedId(art.id); setShowSourceCode(false); }}
                  renderContent={renderCardContent}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : null}

      {/* Pagination Controls */}
      {totalPages > 1 && worksData?.data && worksData.data.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-16 pb-16">
          {(() => {
            const maxVisiblePages = 7;
            let pages: (number | string)[] = [];

            if (totalPages <= maxVisiblePages) {
              // Show all pages if total is small
              pages = Array.from({ length: totalPages }, (_, i) => i + 1);
            } else {
              // Show dynamic pagination with ellipsis
              if (page <= 4) {
                pages = [1, 2, 3, 4, 5, '...', totalPages];
              } else if (page >= totalPages - 3) {
                pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
              } else {
                pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
              }
            }

            return (
              <>
                {/* Previous Button */}
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || worksFetching}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-white flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden md:inline">Sebelumnya</span>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {pages.map((pageNum, idx) => {
                    if (pageNum === '...') {
                      return (
                        <span key={`ellipsis - ${idx} `} className="px-3 py-2 text-gray-500">
                          •••
                        </span>
                      );
                    }

                    const isActive = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum as number)}
                        disabled={worksFetching}
                        className={`min - w - [44px] px - 3 py - 2 rounded - xl font - bold transition - all ${isActive
                          ? 'bg-white text-black shadow-lg scale-110'
                          : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:scale-105'
                          } disabled: opacity - 50 active: scale - 95`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || worksFetching}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-white flex items-center gap-2"
                >
                  <span className="hidden md:inline">Selanjutnya</span>
                  <ArrowRight size={16} />
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Empty State */}
      {!worksLoading && !worksFetching && (!worksData?.data || worksData.data.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6">
            <ImageIcon size={40} className="text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Belum ada karya</h3>
          <p className="text-gray-400 max-w-md">
            Kategori ini masih kosong. Jadilah yang pertama mempublikasikan karya di sini!
          </p>
          <Link
            to="/studio"
            className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Buat Karya Baru
          </Link>
        </div>
      )}

      {/* Tombol Aksi Mengambang (Seluler) */}
      <Link
        to="/studio"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform active:scale-[0.98]"
      >
        <Plus size={28} />
      </Link>
      {/* Modal Detail Karya */}
      <AnimatePresence>
        {selectedId && selectedArtwork && (
          isMobile ? (
            <ImmersiveDetailView
              key="mobile-immersive-view"
              art={selectedArtwork}
              onClose={() => setSelectedId(null)}
              renderContent={(art, showCode) => {
                // Buat tipe kode, kita rendernya beda tergantung showCode
                if (art.type === 'code') {
                  if (showCode) {
                    // Tampilin tampilan kode
                    return (
                      <div className="w-full h-full bg-[#0d1117] overflow-auto">
                        <CodeViewer content={art.content} />
                      </div>
                    );
                  } else {
                    // Tampilin pratinjau interaktif - UKURAN PENUH, TANPA SCALING
                    return (
                      <iframe
                        src={`data: text / html; charset = utf - 8, ${encodeURIComponent(generateCodePreview(art.content, art.code_language || 'html'))} `}
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-full border-0 bg-white"
                        style={{ touchAction: 'auto' }}
                        title="Interactive Code Preview"
                      />
                    );
                  }
                } else if (art.type === 'video') {
                  // Video Player Full
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <video
                        src={art.image_url}
                        controls
                        autoPlay
                        className="max-w-full max-h-full aspect-video"
                        controlsList="nodownload"
                      />
                    </div>
                  );
                }

                // Buat tipe lain, pake konten kartu standar aja
                return (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    {renderCardContent(art, false)}
                  </div>
                );
              }}
            />
          ) : (
            <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:px-4 md:pt-20 md:pb-10 pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl pointer-events-auto"
              />

              <motion.div
                layoutId={`card - ${selectedId} `}
                id={`modal - card - ${selectedId} `}
                className="relative w-full max-w-6xl bg-[#111] rounded-t-[2rem] md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:max-h-[85vh] pointer-events-auto border border-white/10"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                {/* Tombol Tutup - Posisi Aman buat Mobile */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 z-50 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Logika Toggle Fullscreen (Layar Penuh)
                      const mediaContainer = document.getElementById(`media - container - ${selectedId} `);
                      if (!document.fullscreenElement) {
                        mediaContainer?.requestFullscreen().catch(err => console.log(err));
                      } else {
                        document.exitFullscreen();
                      }
                    }}
                    className="p-2 bg-black/70 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-md border border-white/20 hidden md:flex"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-2 bg-black/70 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-md border border-white/20"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Bagian Media */}
                <div
                  id={`media - container - ${selectedId} `}
                  className="w-full h-[40vh] md:h-auto md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden group flex-shrink-0"
                >
                  <motion.div layoutId={`content - ${selectedId} `} className="w-full h-full flex items-center justify-center">

                    {/* ...Logika Slide... */}
                    {(selectedArtwork.type === 'slide' || (selectedArtwork.slides && selectedArtwork.slides.length > 1)) && (
                      <div className="relative w-full h-full flex items-center justify-center group/carousel">
                        <div
                          ref={carouselRef}
                          onScroll={handleCarouselScroll}
                          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar bg-black"
                        >
                          {(selectedArtwork.slides || []).map((slide: any, i: number) => (
                            <div key={slide.id || i} className="min-w-full h-full snap-center flex items-center justify-center relative">
                              <img src={slide.content} className="max-w-full max-h-full object-contain" alt={`Slide ${i + 1} `} />
                            </div>
                          ))}
                        </div>
                        {/* Logika Panah & Dot ... */}
                        {/* Panah Navigasi */}
                        {selectedArtwork.slides && selectedArtwork.slides.length > 1 && (
                          <>
                            {activeSlide > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); scrollToSlide(activeSlide - 1); }}
                                className="absolute left-4 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover/carousel:opacity-100"
                              >
                                <ArrowLeft size={20} />
                              </button>
                            )}
                            {activeSlide < selectedArtwork.slides.length - 1 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); scrollToSlide(activeSlide + 1); }}
                                className="absolute right-4 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover/carousel:opacity-100"
                              >
                                <ArrowRight size={20} />
                              </button>
                            )}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/5">
                              {selectedArtwork.slides.map((_: any, i: number) => (
                                <button
                                  key={i}
                                  onClick={() => scrollToSlide(i)}
                                  className={`w - 1.5 h - 1.5 rounded - full transition - all duration - 300 ${activeSlide === i ? 'bg-white w-3' : 'bg-white/30'
                                    } `}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {selectedArtwork.type === 'image' && (!selectedArtwork.slides || selectedArtwork.slides.length <= 1) && (
                      <img src={selectedArtwork.image_url || selectedArtwork.slides?.[0]?.content} className="w-full h-full object-contain" alt={selectedArtwork.title} />
                    )}
                    {selectedArtwork.type === 'video' && (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <video
                          src={selectedArtwork.image_url}
                          controls
                          autoPlay
                          className="max-w-full max-h-full aspect-video"
                          controlsList="nodownload"
                        />
                      </div>
                    )}
                    {selectedArtwork.type === 'text' && (
                      <div className="w-full h-full bg-[#f0f0f0] text-black p-12 md:p-20 overflow-y-auto">
                        <div
                          className="prose prose-lg prose-p:text-black prose-headings:text-black prose-strong:text-black prose-em:text-black max-w-none font-serif leading-loose"
                          dangerouslySetInnerHTML={{ __html: selectedArtwork.content }}
                        />
                      </div>
                    )}
                    {selectedArtwork.type === 'code' && (
                      <div className="w-full h-full bg-[#0d1117] relative flex flex-col">
                        {/* Tombol Ganti Tampilan - Ramah Mobile */}
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50">
                          <button
                            onClick={() => setShowSourceCode(!showSourceCode)}
                            className="bg-black/80 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold border border-white/20 backdrop-blur-md hover:bg-white hover:text-black transition-colors"
                          >
                            {showSourceCode ? '▶ HASIL' : '</> KODE'}
                          </button>
                        </div>

                        {showSourceCode ? (
                          <CodeViewer content={selectedArtwork.content} />
                        ) : (
                          <iframe
                            srcDoc={generateCodePreview(selectedArtwork.content, selectedArtwork.code_language || 'html')}
                            sandbox="allow-scripts allow-same-origin"
                            className="w-full h-full border-0 bg-white"
                            style={{ touchAction: 'manipulation' }}
                            title="Code Preview"
                          />
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Bagian Detail - Flex-1 to fill remaining space, scrollable */}
                <div className="flex-1 md:w-2/5 p-4 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-[#111] border-t md:border-t-0 md:border-l border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`px - 3 py - 1 rounded - full text - xs font - bold uppercase tracking - widest border border - white / 10 ${selectedArtwork.division === 'coding' ? 'bg-green-500/10 text-green-400' :
                      selectedArtwork.division === 'video' ? 'bg-orange-500/10 text-orange-400' :
                        selectedArtwork.division === 'meme' ? 'bg-yellow-500/10 text-yellow-400' :
                          selectedArtwork.division === 'writing' ? 'bg-white/10 text-white' :
                            'bg-purple-500/10 text-purple-400'
                      } `}>
                      {DIVISION_LABELS[selectedArtwork.division] || selectedArtwork.division}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><Share2 size={20} /></button>
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><Download size={20} /></button>
                    </div>
                  </div>

                  <h2 className="text-4xl font-serif text-white mb-4">{selectedArtwork.title}</h2>
                  <p className="text-gray-400 leading-relaxed mb-8">{selectedArtwork.description}</p>

                  <Link to={`/profile/${selectedArtwork.author}`} className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${selectedArtwork.author}&background=random`} alt="Avatar" />
                    </div >
                    <div>
                      <h4 className="text-white font-bold">{selectedArtwork.author}</h4>
                      <p className="text-gray-500 text-xs">{(selectedArtwork.author_profile as any)?.role || 'Member'}</p>
                    </div>
                    <button className="ml-auto bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                      Lihat
                    </button>
                  </Link >

                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedArtwork.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Aksi Sosial (Like) */}
                  <div className="flex gap-4 mb-8">
                    <button
                      onClick={handleToggleLike}
                      className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isLiked ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50 border border-rose-500' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                    >
                      <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                      {likesCount > 0 ? `${likesCount} Apresiasi` : 'Apresiasi Karya'}
                    </button>
                    <button className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2">
                      <Share2 size={20} />
                    </button>
                  </div>

                  {/* Bagian Komentar */}
                  <div className="border-t border-white/10 pt-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <MessageCircle size={20} className="text-gray-400" />
                      Diskusi ({comments.length})
                    </h3>

                    {/* Input Komentar */}
                    {user ? (
                      <form onSubmit={handleSubmitComment} className="flex gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden shrink-0">
                          <img
                            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`}
                            alt="Me"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Tulis pendapatmu..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-6 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all"
                            disabled={isSubmittingComment}
                          />
                          <button
                            type="submit"
                            disabled={!newComment.trim() || isSubmittingComment}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-rose-600 rounded-full text-white hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 transition-colors"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-white/5 rounded-2xl p-6 text-center mb-8 border border-white/5 border-dashed">
                        <p className="text-gray-400 text-sm mb-3">Login untuk bergabung dalam diskusi</p>
                        <Link to="/auth" className="inline-block px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                          Masuk Sekarang
                        </Link>
                      </div>
                    )}

                    {/* Daftar Komentar */}
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {comments.length > 0 ? comments.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                          <Link to={`/profile/${comment.profiles?.user_id || '#'}`} className="shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden ring-1 ring-white/10">
                              <img
                                src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles?.username || 'User'}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm">{comment.profiles?.username || 'Pengguna'}</span>
                              <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-gray-600">
                          <p className="text-sm">Belum ada komentar.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div >
              </motion.div >
            </div >
          )
        )}
      </AnimatePresence >
    </div >
  );
};

export default Karya;