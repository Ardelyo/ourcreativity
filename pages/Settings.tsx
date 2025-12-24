import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        avatar_url: '',
        website: '',
        bio: '' // Assuming we might add this later, or use extended profile fields
    });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (profile) {
            setFormData({
                username: profile.username || '',
                avatar_url: profile.avatar_url || '',
                website: profile.website || '',
                bio: ''
            });
        }
    }, [user, profile, loading, navigate]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setMessage(null);

        try {
            const updates = {
                id: user.id,
                username: formData.username,
                avatar_url: formData.avatar_url,
                website: formData.website,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });

            // Reload page to refresh context (optional, but ensures global state sync)
            setTimeout(() => window.location.reload(), 1000);

        } catch (error: any) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Gagal memperbarui profil: ' + error.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030303] text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
                >
                    {/* Header Decorative Background */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <h1 className="text-3xl font-serif font-bold mb-2">Pengaturan Akun</h1>
                        <p className="text-gray-400 mb-8">Kelola informasi profil dan preferensi akun Anda.</p>

                        <div className="flex flex-col gap-8">

                            {/* Avatar Section */}
                            <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-black border-2 border-white/10 group-hover:border-white/30 transition-colors">
                                        <img
                                            src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.username}`}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full cursor-not-allowed">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{formData.username || 'User'}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${profile?.is_approved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {profile?.is_approved ? 'Terverifikasi' : 'Menunggu Persetujuan'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                            {profile?.role || 'Member'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                                            placeholder="Username unik Anda"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">URL Avatar (Link Gambar)</label>
                                    <input
                                        type="text"
                                        value={formData.avatar_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="https://example.com/foto.jpg"
                                    />
                                    <p className="text-[10px] text-gray-600">
                                        *Untuk saat ini silakan gunakan link gambar langsung. Fitur upload akan segera hadir.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Website / Portfolio</label>
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="https://portfolio-anda.com"
                                    />
                                </div>
                            </div>

                            {/* Status Message */}
                            {message && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-bold">{message.text}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>Menyimpan... <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /></>
                                    ) : (
                                        <><Save size={18} /> Simpan Perubahan</>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
