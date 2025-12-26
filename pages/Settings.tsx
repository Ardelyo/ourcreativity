import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Save, Camera, AlertCircle, CheckCircle,
    Shield, Bell, Lock, LogOut, Trash2, Mail,
    CreditCard, Globe, ChevronRight, Upload
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Toast, ToastType } from '../components/Toast';

type TabId = 'profile' | 'account' | 'preferences' | 'security';

export const Settings = () => {
    const { user, profile, loading, signOut, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [isSaving, setIsSaving] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ isVisible: boolean, message: string, type: ToastType }>({
        isVisible: false,
        message: '',
        type: 'success'
    });

    // Profile State
    const [formData, setFormData] = useState({
        username: '',
        avatar_url: '',
        website: '',
        bio: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Password State
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (profile) {
            setFormData({
                username: profile.username || '',
                avatar_url: profile.avatar_url || '',
                website: profile.website || '',
                bio: profile.bio || ''
            });
        }
    }, [user, profile, loading, navigate]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const uploadAvatar = async (userId: string): Promise<string | null> => {
        if (!avatarFile) return null;

        // Validation: Max 2MB
        if (avatarFile.size > 2 * 1024 * 1024) {
            throw new Error('Ukuran file terlalu besar (Maksimal 2MB)');
        }

        console.log('DEBUG [uploadAvatar]: Starting...', { userId, file: avatarFile.name, size: avatarFile.size });

        try {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log('DEBUG [uploadAvatar]: Uploading to "avatars" bucket at path:', filePath);

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('DEBUG [uploadAvatar]: Supabase Upload Error:', uploadError);
                throw uploadError;
            }

            console.log('DEBUG [uploadAvatar]: Upload Success:', uploadData);

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            console.log('DEBUG [uploadAvatar]: Public URL generated:', data.publicUrl);
            return data.publicUrl;
        } catch (error) {
            console.error('DEBUG [uploadAvatar]: Exception caught:', error);
            throw error;
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        console.log('DEBUG [handleSaveProfile]: Started');
        setIsSaving(true);
        setToast(prev => ({ ...prev, isVisible: false }));

        try {
            let avatarUrl = formData.avatar_url;

            if (avatarFile) {
                console.log('DEBUG [handleSaveProfile]: Avatar file detected, calling uploadAvatar');
                const uploadedUrl = await uploadAvatar(user.id);
                console.log('DEBUG [handleSaveProfile]: uploadAvatar returned:', uploadedUrl);
                if (uploadedUrl) avatarUrl = uploadedUrl;
            }

            console.log('DEBUG [handleSaveProfile]: Updating profiles table...', { avatarUrl, username: formData.username });

            const updates = {
                id: user.id,
                username: formData.username,
                avatar_url: avatarUrl,
                website: formData.website,
                bio: formData.bio,
                updated_at: new Date().toISOString(),
            };

            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert(updates);

            if (upsertError) {
                console.error('DEBUG [handleSaveProfile]: Error upserting profile:', upsertError);
                throw upsertError;
            }

            console.log('DEBUG [handleSaveProfile]: Profile updated successfully');

            // Force global state refresh
            await refreshProfile();

            // Invalidate React Query cache
            await queryClient.invalidateQueries({ queryKey: ['works'] });
            await queryClient.invalidateQueries({ queryKey: ['profile'] });
            await queryClient.invalidateQueries({ queryKey: ['profile-works'] });
            await queryClient.invalidateQueries({ queryKey: ['profile-likes'] });

            // Update local state if successful
            setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
            setAvatarPreview(null);
            setAvatarFile(null);

            setToast({
                message: 'Profil berhasil diperbarui!',
                type: 'success',
                isVisible: true
            });

        } catch (error: any) {
            console.error('DEBUG [handleSaveProfile]: Caught error in sequence:', error);
            setToast({
                message: 'Gagal memperbarui profil: ' + (error.message || 'Error tidak diketahui'),
                type: 'error',
                isVisible: true
            });
        } finally {
            console.log('DEBUG [handleSaveProfile]: Setting isSaving to false');
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setToast({ message: 'Password tidak cocok.', type: 'error', isVisible: true });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setToast({ message: 'Password minimal 6 karakter.', type: 'error', isVisible: true });
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;
            setToast({ message: 'Password berhasil diubah!', type: 'success', isVisible: true });
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setToast({ message: 'Gagal mengubah password: ' + error.message, type: 'error', isVisible: true });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        // Placeholder for deletion logic
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.');
        if (confirmed) {
            // Implement delete logic here
            alert('Fitur hapus akun akan segera hadir. Hubungi admin untuk penghapusan manual.');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'account', label: 'Akun', icon: Shield },
        { id: 'preferences', label: 'Preferensi', icon: Bell },
        // { id: 'security', label: 'Keamanan', icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white pt-24 pb-12 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Pengaturan</h1>
                    <p className="text-gray-400">Kelola profil dan preferensi akun Anda.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 p-2 sticky top-24">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabId)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-white/10 text-white font-bold shadow-lg'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? 'text-rose-500' : ''} />
                                        {tab.label}
                                        {isActive && <motion.div layoutId="activeTabIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500" />}
                                    </button>
                                );
                            })}

                            <div className="my-2 border-t border-white/5 mx-2" />

                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={18} />
                                Keluar
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-6 md:p-8 relative overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

                            {activeTab === 'profile' && (
                                <div className="space-y-8 relative z-10">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <User className="text-rose-500" size={24} /> Edit Profil
                                    </h2>

                                    {/* Avatar Upload */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-black border-2 border-white/10 group-hover:border-rose-500/50 transition-colors">
                                                <img
                                                    src={avatarPreview || formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.username}`}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity rounded-full backdrop-blur-sm">
                                                <Camera size={24} className="text-white" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                />
                                            </label>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg">{formData.username || 'User'}</h3>
                                            <p className="text-sm text-gray-400">Allowed JPG, GIF or PNG. Max size of 2MB</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username</label>
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-rose-500/30 focus:ring-1 focus:ring-rose-500/30 transition-all"
                                                placeholder="Username unik"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bio</label>
                                                <span className="text-[10px] text-gray-600">{formData.bio.length}/200</span>
                                            </div>
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value.slice(0, 200) }))}
                                                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-rose-500/30 focus:ring-1 focus:ring-rose-500/30 transition-all min-h-[100px] resize-none"
                                                placeholder="Ceritakan sedikit tentang karya dan diri Anda..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Website / Portfolio</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                <input
                                                    type="url"
                                                    value={formData.website}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                                    className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500/30 focus:ring-1 focus:ring-rose-500/30 transition-all"
                                                    placeholder="https://your-portfolio.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSaving ? 'Menyimpan...' : <><Save size={18} /> Simpan Perubahan</>}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'account' && (
                                <div className="space-y-8 relative z-10">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Shield className="text-rose-500" size={24} /> Akun & Keamanan
                                    </h2>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Terdaftar</label>
                                            <div className="text-lg font-medium">{user?.email}</div>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle size={12} /> Terverifikasi
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/5 my-6" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">Ganti Password</h3>
                                        <div className="grid gap-4 max-w-md">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password Baru</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                    <input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500/30 focus:ring-1 focus:ring-rose-500/30 transition-all"
                                                        placeholder="Minimal 6 karakter"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konfirmasi Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                    <input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500/30 focus:ring-1 focus:ring-rose-500/30 transition-all"
                                                        placeholder="Ulangi password baru"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={isSaving}
                                            className="bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-full font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
                                        >
                                            {isSaving ? 'Memproses...' : 'Ubah Password'}
                                        </button>
                                    </div>

                                    <div className="border-t border-white/5 my-6" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">Danger Zone</h3>
                                        <p className="text-gray-400 text-sm">Tindakan ini tidak dapat dibatalkan. Menghapus akun akan menghilangkan semua data dan karya Anda secara permanen.</p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="bg-red-500/10 border border-red-500/30 text-red-500 px-6 py-2.5 rounded-full font-bold hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 size={18} /> Hapus Akun
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="space-y-8 relative z-10">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Bell className="text-rose-500" size={24} /> Preferensi & Notifikasi
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div>
                                                <h4 className="font-bold">Notifikasi Email</h4>
                                                <p className="text-sm text-gray-400">Terima update tentang status karya dan berita platform.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div>
                                                <h4 className="font-bold">Tampilkan Status Online</h4>
                                                <p className="text-sm text-gray-400">Izinkan anggota lain melihat status aktif Anda.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Global Message Toast */}
                            <Toast
                                isVisible={toast.isVisible}
                                message={toast.message}
                                type={toast.type}
                                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
