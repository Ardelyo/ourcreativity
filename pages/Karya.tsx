import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Download, Heart, Share2, Plus, Play, Code, AlignLeft, Image as ImageIcon, Maximize2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Changed import
import { FetchErrorState } from '../components/FetchErrorState';

import { supabase } from '../lib/supabase';

// Helper to generate live code preview HTML
const generateCodePreview = (code: string, language: string = 'html'): string => {
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
    canvas { display: block; }
  `;

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setArtworks(data);
      }
    } catch (error: any) {
      console.error('Error fetching works:', error);
      setError(error.message || 'Gagal memuat karya dari database. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // Reset active slide when switching artworks
  useEffect(() => {
    setActiveSlide(0);
  }, [selectedId]);

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

  const filteredArtworks = filter === 'all'
    ? artworks
    : artworks.filter(a => a.division === filter);

  // Helper untuk merender konten kartu berdasarkan tipe
  const renderCardContent = (art: any) => {
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
        return (
          <div className="w-full h-full bg-[#0d1117] p-6 font-mono text-xs text-gray-300 relative overflow-hidden group-hover:bg-[#161b22] transition-colors">
            <div className="absolute top-0 left-0 right-0 h-8 bg-[#0d1117] border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <pre className="mt-8 overflow-hidden opacity-80">
              <code>{art.content}</code>
            </pre>
            <Code className="absolute bottom-4 right-4 text-green-500/50" size={24} />
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

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-[1600px] mx-auto relative">

      {/* Header & Kontrol */}
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

      {/* Grid Masonry Modern */}
      {error ? (
        <FetchErrorState message={error} onRetry={fetchWorks} />
      ) : loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="break-inside-avoid bg-[#111] rounded-3xl overflow-hidden mb-6 h-64 animate-pulse border border-white/5">
              <div className="h-full w-full bg-gray-900/50"></div>
            </div>
          ))}
        </div>
      ) : filteredArtworks.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredArtworks.map((art, index) => (
            <motion.div
              key={art.id}
              layoutId={`card-${art.id}`}
              onClick={() => setSelectedId(art.id)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="break-inside-avoid group relative rounded-3xl overflow-hidden cursor-pointer bg-[#111] mb-6 shadow-2xl hover:shadow-purple-500/10 transition-shadow border border-white/5"
            >
              {/* Konten Kartu (Gambar/Teks/Kode) */}
              <div className={`relative w-full ${art.type === 'text' || art.type === 'code' ? 'aspect-[4/5]' : ''}`}>
                <motion.div layoutId={`content-${art.id}`} className="w-full h-full">
                  {renderCardContent(art)}
                </motion.div>

                {/* Hamparan Hover Glassmorphism */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-6">

                  <div className="flex justify-between items-start transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 ${art.division === 'coding' ? 'bg-green-500/20 text-green-400' :
                      art.division === 'video' ? 'bg-orange-500/20 text-orange-400' :
                        art.division === 'meme' ? 'bg-yellow-500/20 text-yellow-400' :
                          art.division === 'writing' ? 'bg-white/20 text-white' :
                            'bg-purple-500/20 text-purple-400'
                      }`}>
                      {art.division}
                    </span>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white text-white hover:text-black transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>

                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    <h3 className="text-white font-bold text-xl mb-1 leading-tight">{art.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded-full bg-gray-700 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${art.author}&background=random`} alt="Avatar" />
                      </div>
                      <p className="text-xs text-gray-300">{art.author}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-white text-black py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">
                        Lihat Detail
                      </button>
                      <button className="p-2 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
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
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform active:scale-95"
      >
        <Plus size={28} />
      </Link>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedId && selectedArtwork && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 pt-20 pb-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl pointer-events-auto"
            />

            <motion.div
              layoutId={`card-${selectedId}`}
              className="relative w-full max-w-6xl bg-[#111] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] pointer-events-auto border border-white/10"
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-md"
              >
                <X size={24} />
              </button>

              {/* Bagian Media */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden">
                <motion.div layoutId={`content-${selectedId}`} className="w-full h-full flex items-center justify-center">
                  {selectedArtwork.type === 'slide' && (
                    <div className="relative w-full h-full flex items-center justify-center group/carousel">
                      {/* Carousel Container */}
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

                          {/* Dots Container */}
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
                    <div className="w-full h-full bg-black relative">
                      <iframe
                        srcDoc={generateCodePreview(selectedArtwork.content, selectedArtwork.code_language || 'html')}
                        sandbox="allow-scripts"
                        className="w-full h-full border-0"
                        title="Code Preview"
                      />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Bagian Detail */}
              <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-[#111] border-l border-white/10">
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

                <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${selectedArtwork.author}&background=random`} alt="Avatar" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{selectedArtwork.author}</h4>
                    <p className="text-gray-500 text-xs">{selectedArtwork.role}</p>
                  </div>
                  <button className="ml-auto bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                    Follow
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedArtwork.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-white/10">
                  <button className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Heart size={18} /> Apresiasi Karya
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