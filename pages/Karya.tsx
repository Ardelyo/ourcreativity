import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Download, Heart, Share2, Plus, Play, Code, AlignLeft, Image as ImageIcon, Maximize2, ArrowLeft, ArrowRight, ArrowDown, Send, MessageCircle, MoreVertical } from 'lucide-react';
import { KaryaCard } from '../components/KaryaCard';
import { ImmersiveDetailView } from '../components/Karya/ImmersiveDetailView';
import { useIsMobile } from '../hooks/useIsMobile';
import { Link, useNavigate } from 'react-router-dom'; // Changed import
import { FetchErrorState } from '../components/FetchErrorState';
import { useAuth } from '../components/AuthProvider';

import { supabase } from '../lib/supabase';

// Helper to generate live code preview HTML
// Helper Component for Code Viewing
const CodeViewer = ({ content }: { content: any }) => {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const files = React.useMemo(() => {
    try {
      if (typeof content === 'string') {
        // Try parsing if string
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

  // Set initial active file when files load
  useEffect(() => {
    if (files && files.length > 0) {
      setActiveFileId(files[0].id);
    }
  }, [files]);

  const activeFile = files?.find((f: any) => f.id === activeFileId) || files?.[0];

  if (!files || !Array.isArray(files)) {
    // Fallback logic for legacy/simple content
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

      {/* Code Content - Responsive */}
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

  // Handle new multi-file JSON format
  if (language === 'json_multifile') {
    try {
      const files = JSON.parse(content);

      // Find files by type
      const htmlFile = files.find((f: any) => f.name?.endsWith('.html'));
      const cssFile = files.find((f: any) => f.name?.endsWith('.css'));
      const mainJsFile = files.find((f: any) => f.isMain && f.name?.endsWith('.js'));
      const otherJsFile = files.find((f: any) => f.name?.endsWith('.js') && !f.isMain);

      // SCENARIO A: Has HTML file - use it as base
      if (htmlFile?.content) {
        let html = htmlFile.content;
        if (cssFile?.content) {
          html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
        }
        if (otherJsFile?.content) {
          html = html.replace('</body>', `<script>${otherJsFile.content}</script></body>`);
        }
        return html;
      }

      // SCENARIO B: No HTML, but has main JS file (likely p5.js or vanilla JS)
      if (mainJsFile?.content) {
        const jsCode = mainJsFile.content;
        const isP5 = jsCode.includes('createCanvas') || jsCode.includes('setup()') || jsCode.includes('draw()');

        if (isP5) {
          // p5.js project - wrap with p5 CDN
          return `<!DOCTYPE html>
<html><head>
<style>${baseStyles}</style>
<script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
${cssFile?.content ? `<style>${cssFile.content}</style>` : ''}
</head>
<body>
<script>${jsCode}</script>
</body></html>`;
        } else {
          // Vanilla JS
          return `<!DOCTYPE html>
<html><head>
<style>${baseStyles}</style>
${cssFile?.content ? `<style>${cssFile.content}</style>` : ''}
</head>
<body>
<div id="app"></div>
<script>try{${jsCode}}catch(e){document.body.innerHTML='<pre style="color:red">'+e.message+'</pre>'}</script>
</body></html>`;
        }
      }

      // SCENARIO C: Fallback - show error
      return `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#ff6b6b;padding:20px;font-family:monospace;">
        <p>⚠️ Tidak dapat merender pratinjau</p>
        <p style="color:#888;font-size:12px;">Format file tidak dikenali</p>
      </body></html>`;

    } catch (e) {
      console.error('Error parsing multi-file code:', e);
      return `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#ff6b6b;padding:20px;font-family:monospace;">
        <p>⚠️ Error parsing code</p>
      </body></html>`;
    }
  }

  // Fallback for old string format
  const code = content || '';

  switch (language) {
    case 'p5js':
    case 'p5':
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style>
        <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
      </head><body><script>${code}</script></body></html>`;

    case 'javascript':
    case 'js':
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style></head>
        <body><div id="app"></div><script>try{${code}}catch(e){document.body.innerHTML='<pre style="color:red">'+e.message+'</pre>'}</script></body></html>`;

    case 'html':
    default:
      if (code.trim().toLowerCase().startsWith('<!doctype') || code.trim().toLowerCase().startsWith('<html')) {
        return code;
      }
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>${code}</body></html>`;
  }
};

export const Karya = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 6;

  // Social State
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchWorks = async (pageNum = 0, currentFilter = filter) => {
    // If auth is still initializing, don't fetch yet as it might lead to empty results if RLS is strict
    if (authLoading) return;

    try {
      if (pageNum === 0) setLoading(true);
      setError(null);

      const from = pageNum * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('works')
        .select(`
          id, 
          title, 
          description, 
          image_url, 
          author, 
          type, 
          division, 
          tags, 
          slides, 
          created_at,
          code_language,
          content,
          likes:likes(count),
          comments:comments(count)
        `);

      if (currentFilter !== 'all') {
        query = query.eq('division', currentFilter);
      }

      const { data, error } = await query.range(from, to);

      if (error) throw error;

      if (data) {
        if (pageNum === 0) {
          setArtworks(data);
        } else {
          setArtworks(prev => [...prev, ...data]);
        }
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error: any) {
      console.error('Error fetching works:', error);
      setError(error.message || 'Gagal memuat karya dari database. Silakan coba lagi nanti.');
    } finally {
      if (pageNum === 0) setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      setPage(0);
      fetchWorks(0, filter);
    }
  }, [filter, authLoading]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWorks(nextPage, filter);
  };

  // Reset active slide when switching artworks
  useEffect(() => {
    setActiveSlide(0);
    if (selectedId) {
      fetchSocialData(selectedId);
    }
  }, [selectedId]);

  const fetchSocialData = async (workId: string) => {
    try {
      // 1. Fetch Likes Count
      const { count: likesData, error: likesError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('work_id', workId);

      if (!likesError) setLikesCount(likesData || 0);

      // 2. Check if user liked
      if (user) {
        const { data: userLike } = await supabase
          .from('likes')
          .select('id')
          .eq('work_id', workId)
          .eq('user_id', user.id)
          .single();
        setIsLiked(!!userLike);
      } else {
        setIsLiked(false);
      }

      // 3. Fetch Comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (username, avatar_url, role)
        `)
        .eq('work_id', workId)
        .order('created_at', { ascending: false });

      if (!commentsError) setComments(commentsData || []);

    } catch (error) {
      console.error('Error fetching social data:', error);
    }
  };

  const handleToggleLike = async () => {
    if (!user || !selectedId) {
      alert('Silakan login untuk menyukai karya ini.');
      return;
    }

    // Optimistic Update
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      if (previousIsLiked) {
        // Unlike
        await supabase.from('likes').delete().eq('work_id', selectedId).eq('user_id', user.id);
      } else {
        // Like
        await supabase.from('likes').insert({ work_id: selectedId, user_id: user.id });
      }
    } catch (error) {
      // Revert if error
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

      // Add to local state (Optimistic-ish, or just append result)
      if (data) {
        // We need profile data for display, usually we refetch or simpler: mock it
        const newCommentObj = {
          ...data,
          profiles: profile // Use current user profile
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

  // Handle scroll snap to update active dot
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

  const selectedArtwork = artworks.find(a => a.id === selectedId);

  const filteredArtworks = artworks;

  // Helper untuk merender konten kartu berdasarkan tipe
  const renderCardContent = (art: any, showCode: boolean = false) => {
    switch (art.type) {
      case 'text':
        return (
          <div className="w-full h-full bg-[#f0f0f0] text-black p-8 flex flex-col justify-center items-center text-center font-serif relative overflow-hidden group-hover:bg-white transition-colors">
            <AlignLeft className="absolute top-4 left-4 text-gray-300" size={24} />
            <p className="text-lg italic leading-relaxed line-clamp-6">"{art.content}"</p>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f0f0f0] to-transparent group-hover:from-white transition-colors"></div>
          </div>
        );
      case 'code':
        // If showCode is true, render CodeViewer instead of iframe
        if (showCode) {
          return (
            <div className="w-full h-full bg-[#0d1117]">
              <CodeViewer content={art.content} />
            </div>
          );
        }
        return (
          <div className="w-full h-full bg-[#0d1117] relative group overflow-hidden">
            {/* Preview Iframe for Card - Data URI for better compatibility */}
            <iframe
              src={`data:text/html;charset=utf-8,${encodeURIComponent(generateCodePreview(art.content, art.code_language || 'html'))}`}
              sandbox="allow-scripts allow-same-origin"
              className="w-[200%] h-[200%] border-0 transform scale-50 origin-top-left pointer-events-none bg-white" // Force white bg for iframe content
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
          <div className="relative w-full h-full">
            <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <Play className="text-white fill-current ml-1" size={32} />
              </div>
            </div>
          </div>
        );
      case 'slide':
        const slidePreviewUrl = art.image_url || (art.slides?.[0]?.content);
        return <img src={slidePreviewUrl} alt={art.title} className="w-full h-full object-cover" />;
      default: // image
        return <img src={art.image_url || (art.slides?.[0]?.content)} alt={art.title} className="w-full h-full object-cover" />;
    }
  };

  // State for Code View Toggle in Modal
  const [showSourceCode, setShowSourceCode] = useState(false);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-[1600px] mx-auto relative">

      {/* Header & Kontrol - SAME */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">Galeri Karya</h1>
          <p className="text-gray-400 text-lg">Kurasi visual terbaik dari komunitas.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="flex bg-[#111] p-1 rounded-full border border-white/10">
            {['all', 'graphics', 'video', 'writing', 'coding', 'meme'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${filter === f ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <Link
            to="/studio"
            className="hidden md:flex bg-white text-black px-6 py-3 rounded-full font-bold items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Plus size={20} /> Buat Karya
          </Link>
        </div>
      </div>

      {/* Grid Masonry Modern - Pinterest Style - SAME */}
      {error ? (
        <FetchErrorState message={error} onRetry={fetchWorks} />
      ) : loading && artworks.length === 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="break-inside-avoid bg-white/[0.03] rounded-3xl overflow-hidden mb-4 md:mb-6 h-64 animate-pulse border border-white/5 shadow-lg">
              <div className="h-full w-full bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>
          ))}
        </div>
      ) : artworks.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {artworks.map((art, index) => (
            <KaryaCard
              key={art.id}
              art={art}
              index={index}
              onClick={() => { setSelectedId(art.id); setShowSourceCode(false); }}
              renderContent={renderCardContent}
            />
          ))}
        </div>
      ) : null}

      {/* Load More & Empty State */}
      {hasMore && artworks.length > 0 && (
        <div className="flex justify-center mt-12 pb-12">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2 group active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>Muat Lebih Banyak <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" /></>
            )}
          </button>
        </div>
      )}

      {artworks.length === 0 && !loading && (
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
      {/* Modal Detail */}
      <AnimatePresence>
        {selectedId && selectedArtwork && (
          isMobile ? (
            <ImmersiveDetailView
              key="mobile-immersive-view"
              art={selectedArtwork}
              onClose={() => setSelectedId(null)}
              renderContent={(art) => (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  {renderCardContent(art)}
                </div>
              )}
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
                layoutId={`card-${selectedId}`}
                id={`modal-card-${selectedId}`}
                className="relative w-full max-w-6xl bg-[#111] rounded-t-[2rem] md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:max-h-[85vh] pointer-events-auto border border-white/10"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                {/* Close Button - Safe Position for Mobile */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 z-50 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle Fullscreen logic
                      const card = document.getElementById(`modal-card-${selectedId}`);
                      if (!document.fullscreenElement) {
                        card?.requestFullscreen().catch(err => console.log(err));
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
                <div className="w-full h-[40vh] md:h-auto md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden group flex-shrink-0">
                  <motion.div layoutId={`content-${selectedId}`} className="w-full h-full flex items-center justify-center">

                    {/* ...Slide Logic... */}
                    {selectedArtwork.type === 'slide' && (
                      <div className="relative w-full h-full flex items-center justify-center group/carousel">
                        <div
                          ref={carouselRef}
                          onScroll={handleCarouselScroll}
                          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar bg-black"
                        >
                          {(selectedArtwork.slides || []).map((slide: any, i: number) => (
                            <div key={slide.id || i} className="min-w-full h-full snap-center flex items-center justify-center relative">
                              <img src={slide.content} className="max-w-full max-h-full object-contain" alt={`Slide ${i + 1}`} />
                            </div>
                          ))}
                        </div>
                        {/* Arrows & Dots logic ... */}
                        {/* Navigation Arrows */}
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
                                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeSlide === i ? 'bg-white w-3' : 'bg-white/30'
                                    }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {selectedArtwork.type === 'image' && (
                      <img src={selectedArtwork.image_url || selectedArtwork.slides?.[0]?.content} className="w-full h-full object-contain" />
                    )}
                    {selectedArtwork.type === 'video' && (
                      <div className="relative w-full h-full">
                        {/* Video Player or Image Preview */}
                        {/* For now keeping original logic unless improved */}
                        <img src={selectedArtwork.image_url || selectedArtwork.slides?.[0]?.content} className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play size={64} className="text-white fill-current" />
                        </div>
                      </div>
                    )}
                    {selectedArtwork.type === 'text' && (
                      <div className="w-full h-full bg-[#f0f0f0] text-black p-12 md:p-20 overflow-y-auto font-serif text-lg leading-loose whitespace-pre-wrap">
                        {selectedArtwork.content}
                      </div>
                    )}
                    {selectedArtwork.type === 'code' && (
                      <div className="w-full h-full bg-[#0d1117] relative flex flex-col">
                        {/* Toggle View Button - Mobile Friendly */}
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
                            src={`data:text/html;charset=utf-8,${encodeURIComponent(generateCodePreview(selectedArtwork.content, selectedArtwork.code_language || 'html'))}`}
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
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 ${selectedArtwork.division === 'coding' ? 'bg-green-500/10 text-green-400' :
                      selectedArtwork.division === 'video' ? 'bg-orange-500/10 text-orange-400' :
                        selectedArtwork.division === 'meme' ? 'bg-yellow-500/10 text-yellow-400' :
                          selectedArtwork.division === 'writing' ? 'bg-white/10 text-white' :
                            'bg-purple-500/10 text-purple-400'
                      }`}>
                      {selectedArtwork.division}
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
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{selectedArtwork.author}</h4>
                      <p className="text-gray-500 text-xs">{selectedArtwork.role}</p>
                    </div>
                    <button className="ml-auto bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                      Lihat
                    </button>
                  </Link>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedArtwork.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Social Actions (Like) */}
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

                  {/* Comments Section */}
                  <div className="border-t border-white/10 pt-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <MessageCircle size={20} className="text-gray-400" />
                      Diskusi ({comments.length})
                    </h3>

                    {/* Comment Input */}
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

                    {/* Comments List */}
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
                </div>
              </motion.div>
            </div>
          )
        )}
      </AnimatePresence >
    </div >
  );
};