-- =====================================================
-- SEED DATA FOR CHANGELOGS (v5.0 - v0.5)
-- Enhanced with Sub-logs for Each Era
-- =====================================================

-- Clear existing changelogs to avoid duplicates during development
DELETE FROM announcements WHERE type = 'changelog';

-- =====================================================
-- ERA 5.0: LUMINOUS REVOLUTION (Purple/Rose Theme)
-- =====================================================
INSERT INTO announcements (title, subtitle, version, major_version, date, category, status, color, description, content, highlights, type)
VALUES
(
    'Revolution Edition',
    'The New Standard',
    'v5.0',
    5,
    '2025-11-01',
    'Major Update',
    'Aktif',
    'from-purple-600 to-rose-500',
    'Redesain total dengan filosofi "Luminous Depth". Memperkenalkan Creation Studio dan Bento Grid navigasi.',
    'OurCreativity v5.0 adalah lompatan terbesar kami. Kami meninggalkan desain lama demi sesuatu yang lebih berani, gelap, dan imersif. Fitur utama termasuk Creation Studio yang memungkinkan upload karya langsung, sistem navigasi Bento Grid yang responsif, dan integrasi penuh dengan Supabase untuk konten dinamis. Ini bukan update biasa—ini adalah genesis dari era baru kreativitas digital.',
    ARRAY['Luminous Design System', 'Creation Studio', 'Bento Grid Navigation', 'Supabase Integration', 'Full Redesign'],
    'changelog'
),
(
    'Mobile Experience Refined',
    'Touch-First Philosophy',
    'v5.1',
    5,
    '2025-11-15',
    'Minor Update',
    'Aktif',
    'from-purple-500 to-pink-500',
    'Pengalaman mobile yang lebih halus dengan gesture dan animasi yang dioptimasi untuk layar sentuh.',
    'Update 5.1 fokus sepenuhnya pada pengalaman mobile. Kami memperkenalkan gesture swipe untuk navigasi antar karya, pull-to-refresh yang smooth, dan optimasi touch target untuk tombol-tombol kecil. Scroll behavior juga diperbaiki agar lebih natural di iOS dan Android. Ini adalah polish yang membuat perbedaan besar dalam daily use.',
    ARRAY['Swipe Gestures', 'Pull-to-Refresh', 'Touch Optimization', 'iOS Polish'],
    'changelog'
),
(
    'Content Discovery Engine',
    'Find What Inspires You',
    'v5.2',
    5,
    '2025-11-25',
    'Minor Update',
    'Aktif',
    'from-rose-500 to-orange-400',
    'Sistem pencarian dan filter yang lebih cerdas. Temukan karya berdasarkan mood, warna, atau gaya.',
    'Versi 5.2 menghadirkan mesin penemuan konten yang baru. Sekarang kamu bisa mencari karya tidak hanya berdasarkan judul atau tag, tapi juga mood (ceria, gelap, minimalis) dan dominan warna. Fitur "Similar Works" juga debut di sini, menampilkan karya-karya serupa berdasarkan analisis visual sederhana. Kreativitas jadi lebih mudah dieksplorasi.',
    ARRAY['Smart Search', 'Mood Filters', 'Color-based Discovery', 'Similar Works'],
    'changelog'
),
(
    'Hotfix: Modal Glitch',
    'Critical Stability Patch',
    'v5.0.1',
    5,
    '2025-11-05',
    'Patch',
    'Arsip',
    'from-purple-400 to-purple-600',
    'Perbaikan cepat untuk bug modal yang tidak bisa ditutup di beberapa browser.',
    'Beberapa jam setelah rilis v5.0, kami mendapat laporan bahwa modal detail karya tidak bisa ditutup di Safari dan Firefox versi lama. Tim langsung melakukan investigasi dan menemukan konflik event handler. Hotfix ini menyelesaikan masalah tersebut dan menambahkan fallback untuk browser legacy.',
    ARRAY['Modal Fix', 'Safari Compatibility', 'Event Handler'],
    'changelog'
),
(
    'Performance Boost',
    'Faster, Leaner, Smoother',
    'v5.0.2',
    5,
    '2025-11-10',
    'Patch',
    'Arsip',
    'from-pink-400 to-rose-500',
    'Optimasi bundle size dan lazy loading untuk initial load yang lebih cepat.',
    'Setelah melihat analytics, kami sadar initial load time masih bisa diperbaiki. Patch ini memperkenalkan aggressive code splitting, lazy loading untuk komponen berat seperti galeri dan modal, serta kompresi asset yang lebih baik. Hasilnya? Lighthouse score naik dari 82 ke 94, dan Time to Interactive turun 40%.',
    ARRAY['Code Splitting', 'Lazy Loading', 'Asset Compression', 'Lighthouse 94'],
    'changelog'
),

-- =====================================================
-- ERA 4.0: GLOWAR NEON (Cyan/Teal Theme)
-- =====================================================
(
    'Glowar Update',
    'Neon & Glass',
    'v4.0',
    4,
    '2025-06-15',
    'Major Update',
    'Arsip',
    'from-cyan-500 to-teal-500',
    'Era kejayaan Glassmorphism dan Neon. Fokus pada estetika visual yang memukau mata.',
    'Versi 4.0 membawa tren Glassmorphism ke level ekstrem. Seluruh antarmuka terasa seperti kaca yang melayang di atas latar belakang neon yang bergerak. Ini adalah masa di mana kami bereksperimen gila-gilaan dengan CSS backdrop-filter dan animasi CSS murni. Warna aksen dominan adalah cyan dan teal, memberikan kesan futuristik dan bersih.',
    ARRAY['Glassmorphism UI', 'Neon Accents', 'Animated Backgrounds', 'Futuristic Aesthetic'],
    'changelog'
),
(
    'Homepage Revolution',
    'First Impression Matters',
    'v4.2',
    4,
    '2025-06-20',
    'Minor Update',
    'Arsip',
    'from-teal-400 to-cyan-500',
    'Halaman depan dirombak total. Layout baru dengan visual hierarchy yang lebih jelas.',
    'Homepage adalah wajah platform. Di v4.2, kami mendesain ulang hero section dengan animated gradient background, memperkenalkan section "Cerita Kami" yang lebih personal, dan menambahkan carousel karya unggulan. Tipografi juga diperbaiki dengan kombinasi serif untuk heading dan sans-serif untuk body text.',
    ARRAY['New Hero Section', 'Animated Gradients', 'Featured Carousel', 'Typography Update'],
    'changelog'
),
(
    'Mobile Menu Redesign',
    'Thumb-Friendly Navigation',
    'v4.4',
    4,
    '2025-06-25',
    'Minor Update',
    'Arsip',
    'from-cyan-400 to-emerald-400',
    'Menu mobile yang lebih intuitif dengan gesture support dan animasi slide-in.',
    'Navigasi di HP sebelumnya kurang optimal. V4.4 menghadirkan menu slide-in dari bawah (bukan samping) yang lebih mudah dijangkau dengan satu tangan. Gesture swipe down untuk menutup, blur background untuk fokus, dan tombol yang lebih besar untuk menghindari misclick. Aksesibilitas juga ditingkatkan dengan focus trap.',
    ARRAY['Bottom Sheet Menu', 'Swipe Gestures', 'Blur Background', 'Accessibility'],
    'changelog'
),
(
    'Security & Quality',
    'Hardening the Platform',
    'v4.6',
    4,
    '2025-07-01',
    'Minor Update',
    'Arsip',
    'from-emerald-400 to-teal-500',
    'Penguatan keamanan dan peningkatan kualitas kode dengan static analysis.',
    'Seiring pertumbuhan pengguna, keamanan menjadi prioritas. Kami mengintegrasikan GitHub CodeQL untuk mendeteksi celah keamanan secara otomatis, menambahkan proteksi XSS dan CSRF, serta mengaktifkan TypeScript strict mode untuk mengurangi bug. ESLint rules juga diperketat untuk menjaga konsistensi kode.',
    ARRAY['CodeQL Integration', 'XSS Protection', 'CSRF Protection', 'Strict TypeScript'],
    'changelog'
),
(
    'Build Optimization',
    'Lighthouse Champion',
    'v4.8',
    4,
    '2025-07-10',
    'Minor Update',
    'Arsip',
    'from-teal-500 to-cyan-600',
    'Optimasi build pipeline. Bundle lebih kecil, load lebih cepat.',
    'Performa adalah fitur. Di v4.8, kami fokus pada build optimization: tree shaking agresif untuk membuang dead code, code splitting per route, dan preloading critical assets. Hasilnya luar biasa—bundle size turun 17%, initial load 21% lebih cepat, dan Lighthouse performance score tembus 94!',
    ARRAY['Tree Shaking', 'Code Splitting', 'Asset Preloading', 'Lighthouse 94'],
    'changelog'
),
(
    'Minor Fixes',
    'Stability Improvements',
    'v4.0.1',
    4,
    '2025-06-17',
    'Patch',
    'Arsip',
    'from-cyan-400 to-cyan-500',
    'Perbaikan kecil untuk stabilitas setelah rilis major.',
    'Post-launch patch untuk mengatasi beberapa isu yang ditemukan pengguna: animasi yang terlalu berat di device low-end, beberapa typo di UI, dan konsol error yang muncul di production build. Semua sudah dibersihkan.',
    ARRAY['Animation Optimization', 'Typo Fixes', 'Console Cleanup'],
    'changelog'
),

-- =====================================================
-- ERA 3.0: CONSTELLATION (Indigo/Violet Theme)
-- =====================================================
(
    'Constellation Era',
    'Connecting the Dots',
    'v3.0',
    3,
    '2025-01-20',
    'Major Update',
    'Arsip',
    'from-indigo-500 to-violet-500',
    'Filosofi desain berbasis rasi bintang. Setiap karya adalah bintang, dan komunitas adalah garis yang menghubungkannya.',
    'Di v3.0, kami memperkenalkan konsep "Constellation". UI didominasi oleh partikel interaktif yang saling terhubung. Navigasi utama berbentuk peta bintang abstrak. Ini adalah upaya pertama kami untuk memvisualisasikan konektivitas antar anggota komunitas secara harfiah. Warna utama adalah indigo dan violet, memberikan nuansa kosmik yang mendalam.',
    ARRAY['Constellation UI', 'Interactive Nodes', 'Space Theme', 'Community Graph', 'Cosmic Palette'],
    'changelog'
),
(
    'Supabase Integration',
    'Real Database, Real Power',
    'v3.2',
    3,
    '2025-02-10',
    'Minor Update',
    'Arsip',
    'from-violet-400 to-indigo-500',
    'Migrasi dari data statis ke Supabase. Database PostgreSQL, real-time sync, dan authentication.',
    'Ini adalah perubahan besar di balik layar. Kami pindah dari JSON file ke Supabase sebagai backend. Sekarang data karya, tim, dan pengumuman tersimpan di PostgreSQL. Fitur real-time subscription memungkinkan update instan tanpa refresh. Authentication juga sudah siap untuk fitur login di masa depan.',
    ARRAY['PostgreSQL', 'Real-time Sync', 'Auth Ready', 'Storage Buckets'],
    'changelog'
),
(
    'Creative Constellations',
    'Visual Refresh',
    'v3.5',
    3,
    '2025-03-01',
    'Minor Update',
    'Arsip',
    'from-indigo-400 to-purple-500',
    'Penyegaran visual dengan konsep konstelasi yang lebih matang.',
    'Setelah beberapa bulan, kami menyempurnakan konsep Constellation. Partikel background lebih subtle, garis penghubung lebih elegan, dan color palette disempurnakan. UI menjadi lebih "bersih" tanpa kehilangan identitas kosmiknya. Navigasi juga disederhanakan berdasarkan feedback pengguna.',
    ARRAY['Subtle Particles', 'Refined Palette', 'Cleaner UI', 'Simplified Navigation'],
    'changelog'
),
(
    'Birth of Karya Gallery',
    'The Creative Showcase Begins',
    'v3.7',
    3,
    '2025-03-20',
    'Minor Update',
    'Arsip',
    'from-purple-400 to-violet-500',
    'Lahirnya Karya Gallery—fitur utama platform. Tempat kreator memamerkan karya terbaik mereka.',
    'Ini adalah momen bersejarah: lahirnya Karya Gallery, jantung dari OurCreativity. Untuk pertama kalinya, kreator bisa mengupload dan menampilkan karya mereka secara real di platform. Modal detail karya hadir dengan tampilan fullscreen yang immersive, metadata lengkap, dan tombol share ke sosial media. Filter divisi memudahkan navigasi. Karya Studio juga mulai terbentuk sebagai fondasi workflow kreatif. Inilah saat platform benar-benar "hidup".',
    ARRAY['Karya Gallery Launch', 'Karya Studio Foundation', 'Fullscreen Modal', 'Social Share', 'Division Filter'],
    'changelog'
),
(
    'Performance Tune-up',
    'Smoother Experience',
    'v3.9',
    3,
    '2025-04-10',
    'Minor Update',
    'Arsip',
    'from-violet-500 to-indigo-600',
    'Optimasi performa fokus pada Supabase query dan error handling.',
    'Seiring bertambahnya data, performa mulai terasa berat. V3.9 hadir dengan query optimization, caching strategy untuk data yang jarang berubah, dan error handling yang lebih manusiawi. Pesan error sekarang jelas dan actionable, bukan hanya "Something went wrong".',
    ARRAY['Query Optimization', 'Data Caching', 'Better Errors', 'UX Polish'],
    'changelog'
),
(
    'Patch: Particle Overflow',
    'Background Fix',
    'v3.0.1',
    3,
    '2025-01-25',
    'Patch',
    'Arsip',
    'from-indigo-400 to-indigo-500',
    'Perbaikan bug di mana partikel background menyebabkan scrollbar horizontal.',
    'Bug kecil tapi mengganggu: partikel interaktif ternyata render di luar viewport, menyebabkan horizontal scroll di beberapa browser. Patch ini menambahkan overflow:hidden pada container dan membatasi area render partikel. Problem solved.',
    ARRAY['Overflow Fix', 'Particle Boundary', 'Browser Compatibility'],
    'changelog'
),

-- =====================================================
-- ERA 2.0: INDUSTRIAL PHASE (Orange/Red Theme)
-- =====================================================
(
    'Industrial Phase',
    'Raw & Brutal',
    'v2.0',
    2,
    '2024-08-10',
    'Major Update',
    'Arsip',
    'from-orange-500 to-red-500',
    'Pendekatan Brutalisme. Tipografi besar, grid kasar, dan warna monokrom dengan aksen oranye keselamatan.',
    'Meninggalkan kesan "cantik", v2.0 merangkul estetika "work in progress". Kami menggunakan font monospace, garis-garis konstruksi yang terlihat, dan layout yang menabrak aturan grid tradisional. Ini adalah pernyataan bahwa kreativitas adalah proses yang berantakan. Warna safety orange menjadi signature look.',
    ARRAY['Brutalism Style', 'Monospace Typography', 'Raw Grid Layout', 'Work In Progress Vibe'],
    'changelog'
),

-- =====================================================
-- ERA 1.0: THE GENESIS (Gray/White Theme)
-- =====================================================
(
    'The Genesis',
    'Hello World',
    'v1.0',
    1,
    '2024-03-01',
    'Major Update',
    'Arsip',
    'from-gray-400 to-white',
    'Lahirnya OurCreativity. Sebuah portofolio sederhana untuk memamerkan karya teman-teman dekat.',
    'Versi pertama yang sangat sederhana. Dibangun hanya dengan HTML, CSS, dan sedikit JS. Tujuannya hanya satu: punya tempat untuk menaruh link Google Drive karya kami. Belum ada login, belum ada database, hanya semangat murni dan kebersamaan. Ini adalah titik nol dari segalanya.',
    ARRAY['Static HTML', 'Simple Portfolio', 'Manual Updates', 'Pure Spirit'],
    'changelog'
),

-- =====================================================
-- ERA 0.5: BETA / MVP (Dark Gray Theme)
-- =====================================================
(
    'Project Zero',
    'Proof of Concept',
    'v0.5',
    0,
    '2024-01-15',
    'Beta',
    'Arsip',
    'from-gray-700 to-gray-900',
    'Prototipe awal. Halaman hitam dengan daftar nama dan link.',
    'Sebelum ada nama "OurCreativity", ini adalah "Project Zero". Hanya sebuah file index.html yang di-hosting di GitHub Pages. Sangat kasar, tapi fungsional. Ini adalah bukti bahwa kami bisa membuat sesuatu bersama—sebuah fondasi dari mimpi yang lebih besar.',
    ARRAY['Single Page', 'No CSS Framework', 'Pure Chaos', 'The Beginning'],
    'changelog'
);
