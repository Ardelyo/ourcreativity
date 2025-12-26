import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import { useLoadingStatus } from '../../components/LoadingTimeoutProvider';
import { useEffect } from 'react';
import { useSystemLog } from '../../components/SystemLogProvider';

export const Login = () => {
    const navigate = useNavigate();
    const { setIsLoading } = useLoadingStatus();
    const { addLog } = useSystemLog();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        addLog(`Mencoba masuk...`, 'process');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            addLog(`Berhasil masuk! Selamat datang kembali.`, 'success');
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Gagal masuk. Periksa email dan password Anda.');
            addLog(`Gagal masuk. Periksa kembali akun Anda.`, 'error');
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
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-rose-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full" />
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
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Selamat Datang</h1>
                    <p className="text-gray-400">Masuk untuk melanjutkan ke studio kreatif.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
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
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Masuk Sekarang'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Belum punya akun? <Link to="/register" className="text-rose-500 hover:text-rose-400 font-bold transition-colors">Daftar disini</Link>
                </div>
            </motion.div>
        </div>
    );
};
