import React, { useState, useEffect, Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home'; // Muat Home secara eager

// Muat halaman lain secara lazy
const Karya = React.lazy(() => import('./pages/Karya').then(module => ({ default: module.Karya })));
const Tim = React.lazy(() => import('./pages/Tim').then(module => ({ default: module.Tim })));
const Info = React.lazy(() => import('./pages/Info').then(module => ({ default: module.Info })));
const Story = React.lazy(() => import('./pages/Story').then(module => ({ default: module.Story })));
const Announcement = React.lazy(() => import('./pages/Announcement').then(module => ({ default: module.Announcement })));
const Graphics = React.lazy(() => import('./pages/divisions/Graphics').then(module => ({ default: module.Graphics })));
const VideoPage = React.lazy(() => import('./pages/divisions/Video').then(module => ({ default: module.VideoPage })));
const Writing = React.lazy(() => import('./pages/divisions/Writing').then(module => ({ default: module.Writing })));
const Meme = React.lazy(() => import('./pages/divisions/Meme').then(module => ({ default: module.Meme })));
const Coding = React.lazy(() => import('./pages/divisions/Coding').then(module => ({ default: module.Coding })));

// Komponen Loading
const Loading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
  </div>
);

// Komponen pembungkus untuk menangani scroll ke atas saat rute berubah
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Pembungkus Rute Beranimasi
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="w-full">
        <Suspense fallback={<Loading />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/karya" element={<Karya />} />
            <Route path="/tim" element={<Tim />} />
            <Route path="/info" element={<Info />} />
            <Route path="/story" element={<Story />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/division/graphics" element={<Graphics />} />
            <Route path="/division/video" element={<VideoPage />} />
            <Route path="/division/writing" element={<Writing />} />
            <Route path="/division/meme" element={<Meme />} />
            <Route path="/division/coding" element={<Coding />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </AnimatePresence>
  );
};

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#030303] text-white selection:bg-rose-500/30 font-sans overflow-x-hidden flex flex-col relative">

        {/* Suasana Latar Belakang - Gaya Editorial Bercahaya */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Hamparan Grain Halus - Dioptimalkan untuk Seluler (Opasitas dikurangi, mix-blend-overlay dihapus jika berat) */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`, backgroundSize: '100px 100px' }}></div>

          {/* Cahaya Utama - Statis di seluler untuk menghemat baterai/performa */}
          <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] bg-rose-900/10 blur-[100px] rounded-full" />
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[20%] w-[900px] h-[900px] bg-[#0a0a0a] blur-[80px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <AnimatedRoutes />
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}