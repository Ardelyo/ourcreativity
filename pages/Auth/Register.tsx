import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User as UserIcon, Loader2, Asterisk } from 'lucide-react';
import { useLoadingStatus } from '../../components/LoadingTimeoutProvider';
import { useEffect } from 'react';
import { useSystemLog } from '../../components/SystemLogProvider';

export const Register = () => {
    const navigate = useNavigate();
    const { setIsLoading } = useLoadingStatus();
    const { addLog } = useSystemLog();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        addLog(`Mendaftarkan akun baru...`, 'process');

        if (username.length < 3) {
            setError('Username harus minimal 3 karakter.');
            setLoading(false);
            return;
        }

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                        avatar_url: `https://ui-avatars.com/api/?name=${username}&background=random`
                    }
                }
            });

            if (signUpError) throw signUpError;

            // Cek apa sesi udah ada (biasanya auto-login ok, kecuali konfirmasi email aktif)
            if (data.session) {
                addLog(`Akun berhasil didaftarkan! Selamat bergabung.`, 'success');
                navigate('/');
            } else {
                // Kalo butuh konfirmasi email, ini mungkin kejadian. 
                // Asumsi buat MVP ini auto-konfirm atau kita kasih tau usernya aja.
                addLog(`Pendaftaran berhasil. Silakan verifikasi email Anda.`, 'info');
                alert('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi (jika diperlukan) atau coba login.');
                navigate('/login');
            }

        } catch (err: any) {
            setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
            addLog(`Gagal mendaftar. Silakan coba lagi.`, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(loading);
        return () => setIsLoading(false);
    }, [loading, setIsLoading]);

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Efek Latar Belakang */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-rose-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors text-sm">
                    <ArrowLeft size={16} className="mr-2" /> Kembali ke Beranda
                </Link>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-serif font-bold text-white mb-6">Our Creativity.</h2>
                    <h1 className="text-3xl font-bold text-white mb-2">Bergabung</h1>
                    <p className="text-gray-400">Dalisasikan imajinasimu bersama kami.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Username</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors"
                                placeholder="nama_pengguna"
                                required
                                minLength={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors"
                                placeholder="nama@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Buat Akun'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Sudah punya akun? <Link to="/login" className="text-white hover:text-gray-300 font-bold transition-colors">Masuk</Link>
                </div>
            </motion.div>
        </div>
    );
};
