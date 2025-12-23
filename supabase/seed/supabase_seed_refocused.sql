-- =====================================================
-- SEED DATA FOR WORKS (KARYA)
-- =====================================================
INSERT INTO works (title, author, role, description, content, image_url, tags, division, type, link)
VALUES
(
    'Neon Dreams',
    'Rizky A.',
    '3D Artist',
    'Eksplorasi pencahayaan neon dalam ruang liminal cyberpunk.',
    NULL,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    ARRAY['3D', 'Cyberpunk'],
    'graphics',
    'image',
    NULL
),
(
    'Cinematic Reel',
    'Dimas P.',
    'Videographer',
    'Showreel sinematik dari perjalanan keliling Indonesia.',
    NULL,
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop',
    ARRAY['Travel', 'Cinematic'],
    'video',
    'video',
    NULL
),
(
    'Algoritma Kehidupan',
    'Sarah M.',
    'Writer',
    'Sebuah esai pendek tentang persimpangan teknologi dan kemanusiaan.',
    'Di antara baris-baris kode yang kita tulis, terselip harapan akan masa depan yang lebih baik. Namun, apakah kita sedang membangun jembatan atau tembok?',
    NULL,
    ARRAY['Esai', 'Filsafat'],
    'writing',
    'text',
    NULL
),
(
    'Auth System v2',
    'Eko W.',
    'Fullstack Dev',
    'Implementasi sistem autentikasi yang aman menggunakan JWT.',
    'const generateToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: ''30d'' }
  );
};',
    NULL,
    ARRAY['Backend', 'Security'],
    'coding',
    'code',
    NULL
),
(
    'Meme of the Week',
    'Joko S.',
    'Meme Lord',
    'POV: Ketika code jalan di local tapi error di production.',
    NULL,
    'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=800&auto=format&fit=crop',
    ARRAY['Humor', 'Relatable'],
    'meme',
    'image',
    NULL
),
(
    'Abstract Flow',
    'Linda K.',
    'Digital Painter',
    'Eksperimen warna dan bentuk.',
    NULL,
    'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop',
    ARRAY['Abstract', 'Art'],
    'graphics',
    'image',
    NULL
);

-- =====================================================
-- SEED DATA FOR ANNOUNCEMENTS
-- =====================================================
INSERT INTO announcements (title, subtitle, date, category, status, color, description, content, highlights, type)
VALUES
(
    'OurCreativity v5.0: The Revolution',
    'A New Era Begins',
    '2025-11-01',
    'Launch',
    'Baru',
    'from-rose-500 via-purple-500 to-emerald-500',
    'Kami dengan bangga mempersembahkan evolusi terbesar platform ini. Jelajahi desain baru, fitur canggih, dan pengalaman yang benar-benar revolusioner.',
    'Selamat datang di era baru OurCreativity. Versi 5.0 bukan sekadar pembaruan, melainkan sebuah revolusi dalam cara kita berinteraksi, berkarya, dan berkolaborasi. Dengan desain ''Revolution Edition'' yang sepenuhnya baru, kami menghadirkan estetika gelap yang elegan, animasi yang hidup, dan performa yang tak tertandingi. Fitur utama meliputi Creation Studio yang didesain ulang, navigasi Bento Grid yang intuitif, dan integrasi komunitas yang lebih dalam.',
    ARRAY['New UI/UX', 'Dark Mode', 'Performance Boost'],
    'announcement'
),
(
    'Pekan Kreativitas Vol. 4',
    'Cyberpunk 2077 Edition',
    '2025-10-20',
    'Event',
    'Selesai',
    'from-yellow-400 to-pink-500',
    'Kompetisi tahunan terbesar kembali dengan tema futuristik. Tunjukkan interpretasi visualmu tentang masa depan dystopia yang penuh neon dan teknologi.',
    'Pekan Kreativitas kembali hadir! Kali ini kita menyelami dunia Cyberpunk. Kami menantang seluruh kreator—baik grafis, video, maupun penulis—untuk membayangkan masa depan tahun 2077. Apakah itu utopia teknologi atau dystopia neon? Pilihan ada di tanganmu. Pemenang akan mendapatkan badge eksklusif dan fitur spotlight di halaman utama selama satu bulan penuh.',
    ARRAY['Pameran Virtual', 'Workshop Digital Art', 'Live Coding Session'],
    'announcement'
),
(
    'Tagwall Community',
    'Jejak Digital Anggota',
    '2025-09-15',
    'Activity',
    'Aktif',
    'from-blue-400 to-indigo-500',
    'Fitur baru di mana setiap anggota dapat meninggalkan pesan, tanda tangan, atau doodle digital di dinding komunitas kita.',
    'Ingin meninggalkan jejakmu? Tagwall Community adalah kanvas digital raksasa milik kita bersama. Tulis pesan semangat, gambar doodle lucu, atau sekadar tinggalkan tanda tanganmu. Ini adalah monumen hidup dari kebersamaan kita. Setiap kontribusi akan tersimpan selamanya dalam sejarah OurCreativity.',
    ARRAY['Interactive Canvas', 'Real-time Updates', 'Member Badges'],
    'announcement'
),
(
    'Workshop: Glowar Design',
    'Mastering Luminous Depth',
    '2025-08-10',
    'Workshop',
    'Arsip',
    'from-cyan-400 to-teal-500',
    'Sesi bedah desain sistem ''Glowar'' bersama tim pengembang. Pelajari cara membuat antarmuka yang bercahaya dan imersif.',
    'Pelajari rahasia di balik tampilan OurCreativity v4.0. Dalam workshop ini, kita akan membedah filosofi ''Luminous Depth'', cara menggunakan gradient mesh untuk menciptakan kedalaman, dan teknik glassmorphism yang tepat. Cocok untuk UI/UX designer yang ingin meningkatkan skill visual mereka.',
    ARRAY['Design Principles', 'Figma Assets', 'Q&A Session'],
    'announcement'
);
