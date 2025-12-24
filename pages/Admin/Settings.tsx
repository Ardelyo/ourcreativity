import React, { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Shield, Bell, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<any>({
        site_name: 'OurCreativity',
        tagline: 'Platform Kreativitas Visual',
        maintenance_mode: false,
        registration_open: true,
        auto_approve_works: false,
        allow_comments: true
    });

    // We merge multiple setting keys into one UI for simplicity
    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('platform_settings')
                .select('key, value');

            if (error) throw error;

            if (data) {
                const siteConfig = data.find(item => item.key === 'site_config')?.value || {};
                const features = data.find(item => item.key === 'features')?.value || {};

                setConfig(prev => ({ ...prev, ...siteConfig, ...features }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Fallback to defaults is handled by initial state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            // Split back into categories
            const siteConfig = {
                site_name: config.site_name,
                tagline: config.tagline,
                maintenance_mode: config.maintenance_mode
            };

            const features = {
                registration_open: config.registration_open,
                auto_approve_works: config.auto_approve_works,
                allow_comments: config.allow_comments
            };

            const { error: err1 } = await supabase
                .from('platform_settings')
                .upsert({ key: 'site_config', value: siteConfig });

            const { error: err2 } = await supabase
                .from('platform_settings')
                .upsert({ key: 'features', value: features });

            if (err1 || err2) throw new Error('Failed to save settings');

            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save settings.');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-rose-500 mb-4" size={40} />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Membaca konfigurasi...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-20 max-w-4xl">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Pengaturan Sistem</h1>
                    <p className="text-gray-500 text-lg">Konfigurasi perilaku global dan fitur platform.</p>
                </motion.div>
                <button
                    onClick={handleSave}
                    className="px-10 py-3 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                    <Save size={18} /> Simpan Perubahan
                </button>
            </header>

            <div className="space-y-8">
                {/* General Settings - Zen Refinement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[2.5rem] space-y-8"
                >
                    <div className="flex items-center gap-4 border-b border-white/[0.03] pb-6">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                            <Globe size={24} />
                        </div>
                        <h2 className="text-xl font-black tracking-tight uppercase">Identitas Situs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Nama Platform</label>
                            <input
                                type="text"
                                value={config.site_name}
                                onChange={(e) => handleChange('site_name', e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold"
                                placeholder="Masukkan nama situs..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Tagline Utama</label>
                            <input
                                type="text"
                                value={config.tagline}
                                onChange={(e) => handleChange('tagline', e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-rose-500/50 outline-none transition-all font-bold"
                                placeholder="Slogan atau deskripsi singkat..."
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Features & Security - Zen Refinement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[2.5rem] space-y-8"
                >
                    <div className="flex items-center gap-4 border-b border-white/[0.03] pb-6">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-xl font-black tracking-tight uppercase">Fitur & Keamanan</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-8 bg-white/[0.01] rounded-[2rem] border border-white/[0.03] hover:bg-white/[0.03] transition-all group">
                            <div>
                                <h3 className="text-lg font-black text-white group-hover:text-rose-500 transition-colors">Pendaftaran Terbuka</h3>
                                <p className="text-sm text-gray-500 font-medium">Izinkan member baru untuk bergabung secara otomatis.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={config.registration_open} onChange={(e) => handleChange('registration_open', e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gray-600 after:rounded-full after:h-[1.35rem] after:w-[1.35rem] after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-8 bg-white/[0.01] rounded-[2rem] border border-white/[0.03] hover:bg-white/[0.03] transition-all group">
                            <div>
                                <h3 className="text-lg font-black text-white group-hover:text-rose-500 transition-colors">Persetujuan Otomatis</h3>
                                <p className="text-sm text-gray-500 font-medium italic">Karya akan langsung tampil tanpa perlu moderasai (Kurang aman).</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={config.auto_approve_works} onChange={(e) => handleChange('auto_approve_works', e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gray-600 after:rounded-full after:h-[1.35rem] after:w-[1.35rem] after:transition-all peer-checked:bg-rose-500 peer-checked:after:bg-white"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-8 bg-rose-500/[0.02] rounded-[2rem] border border-rose-500/10 hover:bg-rose-500/[0.04] transition-all group">
                            <div>
                                <h3 className="text-lg font-black text-white group-hover:text-rose-500 transition-colors">Mode Pemeliharaan</h3>
                                <p className="text-sm text-gray-500 font-medium">Kunci akses situs untuk publik selama perbaikan sistem.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={config.maintenance_mode} onChange={(e) => handleChange('maintenance_mode', e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gray-600 after:rounded-full after:h-[1.35rem] after:w-[1.35rem] after:transition-all peer-checked:bg-rose-500 peer-checked:after:bg-white"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
