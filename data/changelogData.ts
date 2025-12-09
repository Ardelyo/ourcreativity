
import { LucideIcon, Sparkles, Zap, Layout, Palette, Layers, Box, Image, Share2, Star, Compass, Rocket, Shield, Megaphone, History, Clock, Globe, Cpu, Lock, Smartphone, PenTool, Database, Grid, User, FileText, Code, Terminal, Coffee, Bug, AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';

export interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    description: string;
    type: 'major' | 'minor' | 'patch';
    changes: string[];
    icon?: LucideIcon;
    color?: string; // Kelas warna Tailwind untuk aksen teks/latar belakang
}

export const changelogData: ChangelogEntry[] = [
    {
        version: "v5.0.0",
        date: "November 2025",
        title: "Revolution Edition",
        description: "Akhirnya rilis juga! Redesign total platform. Gila sih ini, bener-bener beda dari yang lama. Fokus ke estetika modern, interaksi yang 'mahal', dan experience yang premium abis.",
        type: "major",
        icon: Sparkles,
        color: "rose-500",
        changes: [
            "Redesign Hero section pake efek gradient glow yang smooth parah",
            "Ganti navigasi jadi Bento Grid, biar kekinian",
            "Font ganti pake serif modern, biar keliatan elegan",
            "Semua animasi dibikin fluid pake Framer Motion",
            "Dark mode permanen, soalnya lebih keren aja"
        ]
    },
    {
        version: "v4.9.5",
        date: "Juni 2025",
        title: "Final Polish",
        description: "Beres-beres terakhir sebelum rilis gede. Ngerapihin yang kecil-kecil biar perfect.",
        type: "patch",
        icon: CheckCircle,
        color: "emerald-400",
        changes: [
            "Ngebenerin padding yang agak miring dikit",
            "Ganti warna border biar ga terlalu kontras",
            "Hapus console.log yang ketinggalan",
            "Update readme dikit"
        ]
    },
    {
        version: "v4.9.0",
        date: "Juni 2025",
        title: "Bug Fixes Marathon",
        description: "Capek banget ngebenerin bug, tapi harus. Fokus total biar stabil pas dipake orang banyak.",
        type: "patch",
        icon: Bug,
        color: "blue-400",
        changes: [
            "Fix memory leaks pas ganti-ganti halaman cepet",
            "Benerin animasi yang kadang nge-glitch",
            "Modal kadang ga bisa diclose, sekarang udah aman",
            "Scroll di HP kadang nyangkut, udah dibenerin",
            "Layout geser-geser pas loading, udah difix"
        ]
    },
    {
        version: "v4.8.2",
        date: "Juni 2025",
        title: "Ngebut Dikit",
        description: "Optimasi lagi biar makin wuzz wuzz.",
        type: "patch",
        icon: Zap,
        color: "yellow-400",
        changes: [
            "Kurangin ukuran gambar biar load cepet",
            "Hapus code yang ga kepake",
            "Lazy load komponen yang berat-berat"
        ]
    },
    {
        version: "v4.8.0",
        date: "Juni 2025",
        title: "Build Optimization",
        description: "Ngoprek config build biar performanya maksimal. Lumayan nambah speed.",
        type: "minor",
        icon: Zap,
        color: "yellow-500",
        changes: [
            "Pake code splitting biar ga load semua di awal",
            "Tree shaking biar code sampah kebuang",
            "Bundle size turun 17%, lumayan lah",
            "Initial load lebih cepet 21%",
            "Lighthouse score tembus 94/100!"
        ]
    },
    {
        version: "v4.6.0",
        date: "Juni 2025",
        title: "Security & Quality",
        description: "Nambahin satpam digital. Biar aman dan code-nya ga berantakan.",
        type: "minor",
        icon: Lock,
        color: "green-400",
        changes: [
            "Integrasi GitHub CodeQL buat scan celah keamanan",
            "Pasang anti XSS & CSRF biar ga dihack iseng",
            "Paksain pake ESLint biar code rapi",
            "TypeScript strict mode on, biar ga males ngasih tipe data"
        ]
    },
    {
        version: "v4.4.0",
        date: "Juni 2025",
        title: "Mobile Menu Redesign",
        description: "Menu di HP jelek banget kemaren, jadi dibikin ulang biar enak dipencet.",
        type: "minor",
        icon: Smartphone,
        color: "purple-400",
        changes: [
            "Menu slide-in animasinya lebih enak",
            "Tombol digedein biar jempol ga salah pencet",
            "Bisa swipe buat tutup menu",
            "Background blur biar fokus",
            "Focus trap biar aksesibilitas aman"
        ]
    },
    {
        version: "v4.2.0",
        date: "Juni 2025",
        title: "Homepage Revolution",
        description: "Halaman depan dirombak total. Biar first impression-nya dapet.",
        type: "minor",
        icon: Layout,
        color: "orange-400",
        changes: [
            "Ganti nama 'Brand Story' jadi 'Cerita Kami', lebih lokal",
            "Layout pake grid modern",
            "Tipografi dibagusin, enak dibaca",
            "Visual hierarchy diperjelas",
            "Scroll animasi dibikin smooth"
        ]
    },
    {
        version: "v4.0.0",
        date: "Juni 2025",
        title: "Glowar Design System",
        description: "Ini dia, bahasa desain kita sendiri: 'Glowar'. Gelap tapi bercahaya, dalem banget filosofinya.",
        type: "major",
        icon: Palette,
        color: "cyan-400",
        changes: [
            "Implementasi 5 Pilar Glowar Design",
            "Background ganti 'Deep Charcoal', bukan item pekat biasa",
            "Pake 'Aurora Gradients' biar ada nyawa-nya",
            "Animasi transisi dibikin kayak GSAP feel-nya",
            "Semua radius dan spacing distandarisasi"
        ]
    },
    {
        version: "v3.9.5",
        date: "Mei 2025",
        title: "Pre-Major Cleanup",
        description: "Bersih-bersih sebelum update besar v4.0.",
        type: "patch",
        icon: RefreshCcw,
        color: "slate-400",
        changes: [
            "Refactor komponen yang udah spaghetti code",
            "Update dependencies",
            "Hapus file-file sampah"
        ]
    },
    {
        version: "v3.9.0",
        date: "Mei 2025",
        title: "Performance & Optimization",
        description: "Fokus benerin performa. Biar ga lemot pas dibuka di HP kentang.",
        type: "patch",
        icon: Cpu,
        color: "emerald-400",
        changes: [
            "Supabase error handling dibagusin",
            "Login flow dibikin lebih cepet",
            "Query di-cache biar ga request mulu",
            "Bundle size dikurangin lagi",
            "Error message dibikin manusiawi"
        ]
    },
    {
        version: "v3.7.0",
        date: "Juli 2025",
        title: "Karya Integration",
        description: "Akhirnya fitur Karya nyambung sama backend. Udah bisa pamer beneran.",
        type: "minor",
        icon: Image,
        color: "pink-400",
        changes: [
            "Galeri Karya udah pake data beneran",
            "Detail Modal jadi lebih immersive",
            "Bisa share ke sosmed langsung",
            "Filter divisi udah jalan lancar",
            "Gambar loading-nya pake lazy load biar hemat kuota"
        ]
    },
    {
        version: "v3.5.0",
        date: "Juni 2025",
        title: "Creative Constellations",
        description: "Update visual dikit, biar lebih fresh. Konsepnya rasi bintang gitu.",
        type: "minor",
        icon: Star,
        color: "indigo-400",
        changes: [
            "UI dibersihin, lebih lega",
            "Navigasi disederhanain biar ga bingung",
            "Tampilan di HP makin oke",
            "Konsep 'Constellations' buat koneksi antar kreator"
        ]
    },
    {
        version: "v3.2.0",
        date: "April 2025",
        title: "Supabase Integration",
        description: "Pindah ke Supabase buat backend. Database beneran nih bos.",
        type: "minor",
        icon: Database,
        color: "teal-400",
        changes: [
            "Init project Supabase",
            "Bikin tabel-tabel database PostgreSQL",
            "Setup storage bucket buat nyimpen gambar",
            "Pasang security rules (RLS)",
            "Data bisa sync real-time, keren abis"
        ]
    },
    {
        version: "v3.0.0",
        date: "April 2025",
        title: "Admin Dashboard (Beta)",
        description: "Rilis panel admin. Akhirnya ga perlu ngoding buat update konten.",
        type: "major",
        icon: Layout,
        color: "slate-500",
        changes: [
            "Bikin tampilan admin panel",
            "Sistem login admin",
            "Dashboard ada statistik-nya",
            "Bisa CRUD konten (Create, Read, Update, Delete)",
            "Halaman settings buat konfigurasi"
        ]
    },
    {
        version: "v2.9.0",
        date: "Maret 2025",
        title: "Refinement & Bug Fixes",
        description: "Banyak bug di fitur Karya kemaren, ini dibenerin semua.",
        type: "patch",
        icon: PenTool,
        color: "zinc-400",
        changes: [
            "Grid layout kadang berantakan, udah difix",
            "Infinite scroll biar ga perlu klik next page",
            "Masonry layout udah stabil",
            "Video autoplay kadang ganggu, dibenerin",
            "Scroll modal dikunci pas dibuka"
        ]
    },
    {
        version: "v2.4.0",
        date: "Maret 2025",
        title: "Media Optimization",
        description: "Biar gambar sama video ga berat loadingnya.",
        type: "minor",
        icon: Image,
        color: "cyan-500",
        changes: [
            "Implementasi lazy loading",
            "Video ada preview thumbnail-nya",
            "Play video pas di-hover doang",
            "Support fullscreen video"
        ]
    },
    {
        version: "v2.2.0",
        date: "Maret 2025",
        title: "Interactive Features",
        description: "Nambahin fitur like sama share biar rame.",
        type: "minor",
        icon: Share2,
        color: "red-400",
        changes: [
            "Tombol like dengan animasi hati",
            "Counter like jalan",
            "Tombol share copy link",
            "Spotlight system buat karya pilihan"
        ]
    },
    {
        version: "v2.0.0",
        date: "Maret 2025",
        title: "Halaman Karya",
        description: "Rilis fitur utama: Galeri Karya! Tempat pamer hasil kreativitas.",
        type: "major",
        icon: Grid,
        color: "red-500",
        changes: [
            "Halaman Karya pake layout masonry ala Pinterest",
            "Support upload gambar dan video",
            "Komponen Card buat tiap karya",
            "Modal detail buat liat karya lebih jelas",
            "Layout responsif banget"
        ]
    },
    {
        version: "v1.9.0",
        date: "Februari 2025",
        title: "Polish & Refinement",
        description: "Stabilin dulu sebelum lanjut fitur berat.",
        type: "patch",
        icon: Sparkles,
        color: "amber-400",
        changes: [
            "Spacing dirapihin semua biar konsisten",
            "Warna dipoles dikit",
            "Kontras teks dibenerin biar enak dibaca",
            "Aksesibilitas ditambahin (ARIA labels)",
            "Tipe data TypeScript diperjelas"
        ]
    },
    {
        version: "v1.8.0",
        date: "Februari 2025",
        title: "Optimisasi & Bug Fixes",
        description: "Ngebenerin performa yang mulai lemot.",
        type: "patch",
        icon: Bug,
        color: "orange-400",
        changes: [
            "Code splitting jalan",
            "Lazy loading gambar",
            "Bundle size turun 30%",
            "Lighthouse score naik jadi 88",
            "Fix menu mobile yang overflow"
        ]
    },
    {
        version: "v1.6.0",
        date: "Februari 2025",
        title: "Halaman Story",
        description: "Nambahin halaman buat cerita-cerita tentang kita.",
        type: "minor",
        icon: FileText,
        color: "lime-400",
        changes: [
            "Halaman Story buat branding",
            "Komponen timeline sejarah",
            "Pake font Playfair Display biar estetik",
            "Animasi scroll yang asik",
            "Efek parallax dikit-dikit"
        ]
    },
    {
        version: "v1.4.0",
        date: "Februari 2025",
        title: "BentoGrid System",
        description: "Bikin sistem grid yang fleksibel, biar layout ga kaku.",
        type: "minor",
        icon: Box,
        color: "fuchsia-400",
        changes: [
            "Komponen BentoGrid jadi",
            "Banyak variasi kartu",
            "Layout grid asimetris",
            "Algoritma auto-placement",
            "Efek glassmorphism dimana-mana"
        ]
    },
    {
        version: "v1.2.0",
        date: "Januari 2025",
        title: "Halaman Tim",
        description: "Kenalan sama orang-orang di balik layar.",
        type: "minor",
        icon: User,
        color: "sky-400",
        changes: [
            "Halaman profil Tim",
            "Kartu profil anggota",
            "Animasi hover di kartu",
            "Grid layout responsif",
            "Efek kaca di kartu tim"
        ]
    },
    {
        version: "v1.0.0",
        date: "Januari 2025",
        title: "Foundation Complete",
        description: "Rilis versi 1.0! Fondasi udah kuat, siap gaspol.",
        type: "major",
        icon: Rocket,
        color: "white",
        changes: [
            "Pasang Framer Motion buat animasi",
            "Redesign Hero section jadi keren",
            "Background ada ambience-nya",
            "Transisi antar halaman smooth",
            "Tekstur noise biar ada depth"
        ]
    },
    {
        version: "v0.9.0",
        date: "Desember 2024",
        title: "Polish & Optimization",
        description: "Poles-poles dikit sebelum rilis v1.0.",
        type: "patch",
        icon: Zap,
        color: "gray-400",
        changes: [
            "Optimasi loading awal",
            "Benerin error TypeScript yang merah semua",
            "Responsive design dibagusin",
            "Setup config buat build production"
        ]
    },
    {
        version: "v0.8.0",
        date: "Desember 2024",
        title: "Routing & Pages",
        description: "Udah bisa pindah-pindah halaman.",
        type: "minor",
        icon: Compass,
        color: "blue-300",
        changes: [
            "Pasang React Router",
            "Bikin halaman Home sama About basic",
            "Scroll otomatis ke atas pas pindah halaman"
        ]
    },
    {
        version: "v0.7.0",
        date: "Desember 2024",
        title: "Komponen Dasar",
        description: "Mulai bikin komponen-komponen inti.",
        type: "minor",
        icon: Box,
        color: "indigo-300",
        changes: [
            "Bikin Navbar sederhana",
            "Bikin Footer",
            "Setup App.tsx",
            "Menu hamburger buat di HP"
        ]
    },
    {
        version: "v0.6.0",
        date: "November 2024",
        title: "Setup Styling",
        description: "Ngatur gaya-gayaan biar ga polos banget.",
        type: "minor",
        icon: Palette,
        color: "pink-300",
        changes: [
            "Pasang Tailwind CSS",
            "Pilih palet warna",
            "Pasang font Inter & Playfair",
            "Custom scrollbar biar ganteng"
        ]
    },
    {
        version: "v0.5.5",
        date: "November 2024",
        title: "Struktur Folder",
        description: "Ngerapihin folder biar ga pusing nyari file.",
        type: "patch",
        icon: Layers,
        color: "gray-500",
        changes: [
            "Bikin folder components",
            "Bikin folder pages",
            "Bikin folder assets",
            "Bikin folder hooks"
        ]
    },
    {
        version: "v0.5.0",
        date: "November 2024",
        title: "Inisialisasi Proyek",
        description: "Bismillah, mulai project baru. Setup awal banget.",
        type: "major",
        icon: Terminal,
        color: "neutral-500",
        changes: [
            "Install React + Vite",
            "Setup TypeScript biar aman",
            "Install dependencies dasar",
            "Commit pertama!"
        ]
    }
];
