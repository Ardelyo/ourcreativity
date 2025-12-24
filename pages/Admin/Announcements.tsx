import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Loader2, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const Announcements = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({
        title: '',
        subtitle: '',
        description: '',
        content: '',
        type: 'announcement',
        category: 'General',
        status: 'Baru',
        color: 'from-purple-500 to-blue-500',
        highlights: '',
        is_active: true
    });

    // Query for Announcements
    const { data: announcements = [], isLoading } = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('announcements')
                .select('id, title, subtitle, description, date, type, status, color, is_active, content, category, highlights')
                .order('date', { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    // Mutation for Save/Update
    const saveMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (payload.id) {
                const { error } = await supabase
                    .from('announcements')
                    .update(payload)
                    .eq('id', payload.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('announcements')
                    .insert([payload]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            setIsEditing(false);
            resetForm();
        },
        onError: (error) => {
            console.error('Error saving announcement:', error);
            alert('Gagal menyimpan pengumuman.');
        }
    });

    // Mutation for Delete
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('announcements').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
        onError: (error) => {
            console.error('Error deleting:', error);
            alert('Gagal menghapus pengumuman.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            highlights: typeof formData.highlights === 'string'
                ? formData.highlights.split(',').map((h: string) => h.trim()).filter(Boolean)
                : formData.highlights,
            date: formData.id ? formData.date : new Date().toISOString()
        };
        saveMutation.mutate(payload);
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Hapus pengumuman ini?')) return;
        deleteMutation.mutate(id);
    };

    const handleEdit = (item: any) => {
        setFormData({
            ...item,
            highlights: item.highlights ? item.highlights.join(', ') : ''
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setFormData({
            title: '', subtitle: '', description: '', content: '',
            type: 'announcement', category: 'General', status: 'Baru',
            color: 'from-purple-500 to-blue-500', highlights: '', is_active: true
        });
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Pusat Pengumuman</h1>
                    <p className="text-gray-500 text-lg">Kelola berita, pembaruan, dan notifikasi platform.</p>
                </motion.div>
                <button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="px-8 py-3 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                    <Plus size={18} /> Buat Baru
                </button>
            </header>

            {/* List - Zen Refinement */}
            <div className="grid gap-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-rose-500 mb-4" size={32} />
                        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Menarik data...</p>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">Belum ada pengumuman</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {announcements.map((item: any, index: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] flex flex-col group hover:bg-white/[0.04] hover:border-white/10 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color || 'from-rose-500 to-rose-700'} text-white shadow-lg`}>
                                            <Megaphone size={18} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                {item.category || 'Umum'}
                                            </span>
                                            <div className="text-[10px] font-bold text-gray-700 uppercase">{new Date(item.date).toLocaleDateString('id-ID')}</div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-rose-500">
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-white mb-2 group-hover:text-rose-500 transition-colors">{item.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-8 flex-grow">{item.description}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={deleteMutation.isPending}
                                            className="w-10 h-10 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all"
                                        >
                                            {deleteMutation.isPending && deleteMutation.variables === item.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-800'}`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal - Zen Refinement */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#080808] border border-white/[0.08] w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden pointer-events-auto my-8"
                        >
                            <div className="p-10 border-b border-white/[0.05] flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{formData.id ? 'Perbarui Rilis' : 'Terbitkan Baru'}</h2>
                                    <p className="text-gray-500 text-sm font-medium">Lengkapi detail informasi untuk publik.</p>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar no-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Judul Utama</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold placeholder:text-gray-800" placeholder="Ketik judul pengumuman..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Subjudul</label>
                                        <input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold placeholder:text-gray-800" placeholder="Opsional subjudul..." />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Ringkasan Pendek</label>
                                    <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold placeholder:text-gray-800 resize-none" placeholder="Jelaskan dalam satu atau dua kalimat..." />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Konten Lengkap</label>
                                    <textarea rows={6} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold placeholder:text-gray-800 resize-none" placeholder="Tuliskan isi lengkap pengumuman di sini..." />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Status Rilis</label>
                                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold appearance-none">
                                            <option value="Baru">Baru</option>
                                            <option value="Update">Pembaruan</option>
                                            <option value="Maintenance">Pemeliharaan</option>
                                            <option value="Event">Acara</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Kategori</label>
                                        <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold placeholder:text-gray-800" placeholder="Contoh: Teknis, Kreatif..." />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Sorotan Fitur (pisahkan dengan koma)</label>
                                    <input type="text" value={formData.highlights} onChange={e => setFormData({ ...formData, highlights: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold placeholder:text-gray-800" placeholder="Efek Air, Perbaikan UI, Optimasi Kecepatan..." />
                                </div>
                            </form>
                            <div className="p-10 border-t border-white/[0.05] flex justify-end gap-4 bg-white/[0.01]">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-500 hover:text-white transition-all">Batal</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={saveMutation.isPending}
                                    className="px-10 py-3 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-rose-600 transition-all shadow-xl shadow-rose-900/20 active:scale-95"
                                >
                                    {saveMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                    {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
