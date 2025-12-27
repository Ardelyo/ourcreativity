import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './components/AuthProvider';
// Halaman yang dimuat secara eager
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';

// Halaman yang dimuat secara lazy (biar enteng pas buka awal)
const Karya = React.lazy(() => import('./pages/Karya'));
const Tim = React.lazy(() => import('./pages/Tim').then(module => ({ default: module.Tim })));
const Info = React.lazy(() => import('./pages/Info').then(module => ({ default: module.Info })));
const Story = React.lazy(() => import('./pages/Story').then(module => ({ default: module.Story })));
const Announcement = React.lazy(() => import('./pages/Announcement').then(module => ({ default: module.Announcement })));
const Graphics = React.lazy(() => import('./pages/divisions/Graphics').then(module => ({ default: module.Graphics })));
const VideoPage = React.lazy(() => import('./pages/divisions/Video').then(module => ({ default: module.VideoPage })));
const Writing = React.lazy(() => import('./pages/divisions/Writing').then(module => ({ default: module.Writing })));
const Meme = React.lazy(() => import('./pages/divisions/Meme').then(module => ({ default: module.Meme })));
const Coding = React.lazy(() => import('./pages/divisions/Coding').then(module => ({ default: module.Coding })));
const Studio = React.lazy(() => import('./pages/Studio').then(module => ({ default: module.Studio })));
const Settings = React.lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Profile = React.lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const V5Launch = React.lazy(() => import('./pages/V5Launch').then(module => ({ default: module.V5Launch })));
const Gate = React.lazy(() => import('./pages/Gate').then(module => ({ default: module.default })));


import { MotionPage } from './components/MotionPage';

// Komponen Admin
import { AdminGuard } from './components/AdminGuard';
import { AdminLayout } from './components/AdminLayout';
const AdminDashboard = React.lazy(() => import('./pages/Admin/Dashboard').then(module => ({ default: module.Dashboard })));
const AdminUsers = React.lazy(() => import('./pages/Admin/Users').then(module => ({ default: module.Users })));
const AdminContent = React.lazy(() => import('./pages/Admin/Content').then(module => ({ default: module.Content })));
const AdminAnnouncements = React.lazy(() => import('./pages/Admin/Announcements').then(module => ({ default: module.Announcements })));
const AdminSettings = React.lazy(() => import('./pages/Admin/Settings').then(module => ({ default: module.Settings })));

import { LoadingTimeoutProvider, useLoadingStatus } from './components/LoadingTimeoutProvider';
import { SystemLogProvider } from './components/SystemLogProvider';

// Ini buat ngecek apa ada suspense yang lagi loading secara global
const GlobalLoadingTracker = () => {
  const { setIsLoading } = useLoadingStatus();

  useEffect(() => {
    // Karena kita pake Suspense di AnimatedRoutes, kita bisa deteksi kalo render keputus
    // Tapi karena Suspense fallback itu pasif, kita pancing lewat mounting 
    setIsLoading(true);
    return () => setIsLoading(false);
  }, [setIsLoading]);

  return null;
};

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <GlobalLoadingTracker />
      <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// ... imports
const KotakSurat = React.lazy(() => import('./pages/KotakSurat').then(module => ({ default: module.KotakSurat })));

// ... existing lazy imports

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div className="w-full">
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes location={location}>
              <Route path="/" element={<MotionPage><Home /></MotionPage>} />
              <Route path="/login" element={<MotionPage><Login /></MotionPage>} />
              <Route path="/register" element={<MotionPage><Register /></MotionPage>} />
              <Route path="/karya" element={<MotionPage><Karya /></MotionPage>} />
              <Route path="/tim" element={<MotionPage><Tim /></MotionPage>} />
              <Route path="/info" element={<MotionPage><Info /></MotionPage>} />
              <Route path="/kotak-surat" element={<MotionPage><KotakSurat /></MotionPage>} />
              <Route path="/story" element={<MotionPage><Story /></MotionPage>} />
              <Route path="/announcement" element={<MotionPage><Announcement /></MotionPage>} />
// ... rest of routes
              <Route path="/division/graphics" element={<MotionPage><Graphics /></MotionPage>} />
              <Route path="/division/video" element={<MotionPage><VideoPage /></MotionPage>} />
              <Route path="/division/writing" element={<MotionPage><Writing /></MotionPage>} />
              <Route path="/division/meme" element={<MotionPage><Meme /></MotionPage>} />
              <Route path="/division/coding" element={<MotionPage><Coding /></MotionPage>} />
              <Route path="/studio" element={<MotionPage><Studio /></MotionPage>} />
              <Route path="/settings" element={<MotionPage><Settings /></MotionPage>} />
              <Route path="/profile/:username" element={<MotionPage><Profile /></MotionPage>} />
              <Route path="/v5-launch" element={<MotionPage><V5Launch /></MotionPage>} />
              <Route path="/gate" element={<MotionPage><Gate /></MotionPage>} />

              {/* Rute Admin */}
              <Route path="/admin" element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { pathname } = useLocation();
  const isStudio = pathname.toLowerCase() === '/studio';
  const isAdmin = pathname.toLowerCase().startsWith('/admin');
  const isZenMode = isStudio || isAdmin;

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-rose-500/30 font-sans overflow-x-hidden flex flex-col relative">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Efek noise tekstur */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`, backgroundSize: '100px 100px' }}></div>
        {/* Gradien dekoratif buat estetika zen */}
        <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] bg-rose-900/10 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[20%] w-[900px] h-[900px] bg-[#0a0a0a] blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {!isZenMode && <Navbar />}
        <main className={`flex-grow ${isStudio ? 'w-full h-screen overflow-hidden' : (isAdmin ? 'w-full px-0 container-none max-w-none' : 'container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl')}`}>
          <AnimatedRoutes />
        </main>
        {!isZenMode && <Footer />}
      </div>
    </div>
  );
};

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LoadingTimeoutProvider>
          <Router>
            <SystemLogProvider>
              <ScrollToTop />
              <AppContent />
            </SystemLogProvider>
          </Router>
        </LoadingTimeoutProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}