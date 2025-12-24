import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, ExternalLink, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Pagination } from '../../components/Pagination';

export const Content = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Query for Works
    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['works', page, filter, debouncedSearch],
        queryFn: async () => {
            let query = supabase
                .from('works')
                .select('id, title, description, image_url, author, type, division, created_at, slides, content', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

            if (filter !== 'all') {
                query = query.eq('type', filter);
            }

            if (debouncedSearch) {
                // Optimized OR search manually since Supabase client has limitations on mixed AND/OR groups without complexity
                // But with just one condition set, .or works fine if used correctly.
                // However, merging filter AND search OR is tricky in simple syntax.
                // We'll prioritize search on title if searching, to use the index efficiently.
                // Or try RPC if available, but staying safe with simple title search for performance on indexes
                // query = query.ilike('title', `%${debouncedSearch}%`);

                // Using .or with query string format:
                query = query.or(`title.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,author.ilike.%${debouncedSearch}%`);
            }

            const { data, error, count } = await query;
            if (error) throw error;
            return { works: data, total: count };
        },
        placeholderData: keepPreviousData,
    });

    const works = data?.works || [];
    const totalCount = data?.total || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Mutation for Deletion
    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('works')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['works'] });
        },
        onError: (error) => {
            console.error('Delete failed:', error);
            alert('Failed to delete work.');
        }
    });

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this work? This action cannot be undone.')) return;
        mutation.mutate(id);
    };

    const filteredWorks = works;

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Moderasi Konten</h1>
                    <p className="text-gray-500 text-lg">Tinjau dan kelola karya yang diunggah oleh member.</p>
                </motion.div>
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/[0.05] overflow-x-auto custom-scrollbar no-scrollbar">
                    {['all', 'image', 'video', 'code', 'text', 'slide'].map(f => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
                        >
                            {f === 'all' ? 'Semua' : f}
                        </button>
                    ))}
                </div>
            </header>

            {/* Search - Zen Refinement */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Cari karya berdasarkan judul, deskripsi, atau pembuat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[2rem] py-5 pl-16 pr-6 text-white text-lg focus:outline-none focus:border-rose-500/50 focus:bg-white/[0.04] transition-all placeholder:text-gray-700"
                />
            </div>

            {/* Works Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="animate-spin text-rose-500 mb-4" size={40} />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Menyelaraskan data...</p>
                </div>
            ) : filteredWorks.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredWorks.map((work, index) => (
                            <motion.div
                                key={work.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all hover:bg-white/[0.04]"
                            >
                                <div className="aspect-[4/3] bg-black relative overflow-hidden m-4 mb-0 rounded-[2rem]">
                                    {work.type === 'image' || work.type === 'slide' ? (
                                        <img src={work.image_url || work.slides?.[0]?.content} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : work.type === 'video' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                            <ExternalLink size={32} className="text-white/20" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full p-6 bg-zinc-950 text-[10px] overflow-hidden opacity-30 font-mono leading-relaxed">
                                            {work.content}
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                                        <Link to={`/karya?id=${work.id}`} target="_blank" className="w-12 h-12 bg-white text-black rounded-2xl hover:scale-110 transition-transform flex items-center justify-center" title="Lihat">
                                            <Eye size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(work.id)}
                                            className="w-12 h-12 bg-rose-500 text-white rounded-2xl hover:scale-110 transition-transform flex items-center justify-center"
                                            title="Hapus"
                                            disabled={mutation.isPending}
                                        >
                                            {mutation.isPending && mutation.variables === work.id ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={20} />
                                            )}
                                        </button>
                                    </div>

                                    <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-xl text-[9px] font-black uppercase tracking-widest text-white rounded-full border border-white/10">
                                        {work.division}
                                    </span>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-black text-white text-lg truncate mb-1 group-hover:text-rose-500 transition-colors">{work.title}</h3>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                        <span>oleh {work.author}</span>
                                        <span className="font-mono text-gray-700">{new Date(work.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {works.length > 0 && (
                        <div className="pb-8">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                hasMore={!isPlaceholderData && page < totalPages}
                                onPageChange={(newPage) => setPage(newPage)}
                                loading={isPlaceholderData}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
                    <AlertTriangle className="mx-auto mb-4 text-gray-800" size={48} />
                    <p className="text-gray-600 font-black uppercase tracking-[0.2em] text-sm">Tidak ada karya yang ditemukan</p>
                </div>
            )}
        </div>
    );
};
