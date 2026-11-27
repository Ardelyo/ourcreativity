import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
    id: string;
    username: string;
    avatar_url: string;
    is_approved: boolean;
    role: string;
    website?: string;
    bio?: string;
}

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    /** true selama profil (role, is_approved) untuk user yang login masih diambil. Guard berbasis role wajib menunggu ini. */
    profileLoading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const currentUserId = useRef<string | null>(null);
    const profileLoadedFor = useRef<string | null>(null);
    const fetchesInFlight = useRef(0);

    useEffect(() => {
        if (import.meta.env.DEV) console.log('AuthProvider: Starting initialization...');

        // Safety timeout: If Supabase takes too long (> 2s), force loading to false so user isn't stuck
        const safetyTimeout = setTimeout(() => {
            console.warn('AuthProvider: Initialization timed out. Forcing app to load.');
            setLoading(false);
        }, 2000);

        // 1. Ambil session awal pas baru masuk
        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                currentUserId.current = session?.user?.id ?? null;
                setSession(session);
                setUser(session?.user ?? null);

                // Optimasi: Jangan await fetchProfile di sini kalo bisa jalan parallel
                // Tapi buat UX login, kita tunggu profil biar redirect bener
                if (session?.user) {
                    setProfileLoading(true);
                    await fetchProfile(session.user.id);
                }
            } catch (err) {
                console.error('Error getting session:', err);
            } finally {
                clearTimeout(safetyTimeout);
                setLoading(false);
            }
        };

        getInitialSession();

        // 2. Pantau perubahan auth (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const previousId = currentUserId.current;
            currentUserId.current = session?.user?.id ?? null;
            setSession(session);
            setUser(session?.user ?? null);

            // Cek apakah user berubah beneran biar gak fetch ulang kalo cuma token refresh.
            // Jangan await panggilan Supabase di dalam callback ini (bisa deadlock), jadi ditunda.
            // Profil (role) belum tentu sudah ada saat event ini tiba. Tandai "sedang memuat profil" di batch
            // yang sama dengan setLoading(false), supaya guard berbasis role tidak sempat melihat profile=null
            // dan mengalihkan admin yang sah (terjadi saat refresh langsung di /admin).
            if (session?.user) {
                const userId = session.user.id;
                const needsProfile = profileLoadedFor.current !== userId;
                if (needsProfile) setProfileLoading(true);
                if (userId !== previousId || (needsProfile && fetchesInFlight.current === 0)) {
                    setTimeout(() => { void fetchProfile(userId); }, 0);
                }
            } else {
                profileLoadedFor.current = null;
                setProfileLoading(false);
                setProfile(null);
            }

            // Pastikan loading dimatikan setelah auth check selesai
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (userId: string) => {
        fetchesInFlight.current += 1;
        try {
            // Gunakan query simple dan cepat
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, is_approved, role, bio, website')
                .eq('id', userId)
                .single();

            if (error) {
                // Ignore specific errors like 'PGRST116' (row not found) which might happen if profile trigger is slow
                if (error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error);
                }
            } else {
                setProfile(data);
                profileLoadedFor.current = userId;
            }
        } catch (err) {
            console.error('Error in fetchProfile:', err);
        } finally {
            fetchesInFlight.current -= 1;
            if (fetchesInFlight.current === 0) setProfileLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        profileLoadedFor.current = null;
        setProfile(null);
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, profileLoading, signOut, refreshProfile }}>
            {loading ? (
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
