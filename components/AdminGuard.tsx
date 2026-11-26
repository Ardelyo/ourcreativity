// Pelindung rute khusus admin. Kalo bukan admin, tendang ke home.
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface AdminGuardProps {
    children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const { profile, loading, profileLoading } = useAuth();

    // Tunggu profil selesai dimuat: tanpa ini admin sah dialihkan ke beranda saat refresh di /admin.
    if (loading || profileLoading) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile || profile.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
