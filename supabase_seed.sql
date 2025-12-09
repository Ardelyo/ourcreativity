-- Insert Divisions
INSERT INTO divisions (slug, name, description) VALUES
('video', 'DIVISI VIDEO', 'Kami tidak sekadar memotong gambar. Kami memanipulasi waktu, emosi, dan realitas penonton.'),
('graphics', 'DIVISI GRAFIS', 'Komunitas Paling Liar. Rumah bagi 700+ desainer yang siap menggebrak industri kreatif.'),
('meme', 'DIVISI MEME', 'THE OFFICIAL HOMEPAGE. WEBSITE TERBURUK DI DUNIA!!!')
ON CONFLICT (slug) DO NOTHING;

-- Get Division IDs
DO $$
DECLARE
    video_id UUID;
    graphics_id UUID;
    meme_id UUID;
BEGIN
    SELECT id INTO video_id FROM divisions WHERE slug = 'video';
    SELECT id INTO graphics_id FROM divisions WHERE slug = 'graphics';
    SELECT id INTO meme_id FROM divisions WHERE slug = 'meme';

    -- Insert Video Scenes
    DELETE FROM division_scenes WHERE division_id = video_id;

    INSERT INTO division_scenes (division_id, scene_order, scene_id, title, subtitle, description, tags, items, icons) VALUES
    (video_id, 1, 'intro', 'MEMUAT ASET...', 'MENYIAPKAN TIMELINE', NULL, NULL, NULL, NULL),
    (video_id, 2, 'chaos', 'DIVISI PALING GILA', NULL, 'Kami tidak sekadar memotong gambar. Kami memanipulasi waktu, emosi, dan realitas penonton.', ARRAY['CHAOS', 'GLITCH', 'RENDER'], NULL, NULL),
    (video_id, 3, 'styles', 'MULTI-GENRE', NULL, NULL, NULL, '[
        {"label": "SINEMATIK", "color": "text-orange-500"},
        {"label": "BRUTALISM", "color": "text-white"},
        {"label": "DOKUMENTER", "color": "text-gray-400"},
        {"label": "MEME/SHITPOST", "color": "text-red-500"}
    ]'::jsonb, NULL),
    (video_id, 4, 'alchemy', 'KEAJAIBAN EDITING', NULL, 'Dari potongan mentah menjadi mahakarya. Kami memberi warna pada abu-abu, dan suara pada keheningan.', NULL, NULL, NULL),
    (video_id, 5, 'allinone', 'EDITOR = HYBRID', NULL, 'Seorang editor adalah desainer grafis, penulis naskah, dan sound engineer yang terperangkap dalam satu tubuh.', NULL, NULL, ARRAY['Layers', 'Monitor', 'Zap']);

    -- Insert Graphics Scenes (Mapping sections to scenes)
    DELETE FROM division_scenes WHERE division_id = graphics_id;

    INSERT INTO division_scenes (division_id, scene_order, scene_id, title, subtitle, description, items) VALUES
    (graphics_id, 1, 'hero', 'Komunitas Paling Liar', 'DIVISI_01: DESAIN GRAFIS', 'Divisi favorit dan paling aktif di OurCreativity. Rumah bagi 700+ desainer yang siap menggebrak industri kreatif.', NULL),
    (graphics_id, 2, 'stats', 'STATISTIK', NULL, NULL, '[
        {"label": "Anggota Aktif", "value": "700+"},
        {"label": "Divisi Terfavorit", "value": "#1"},
        {"label": "Aktivitas Non-stop", "value": "24/7"}
    ]'::jsonb),
    (graphics_id, 3, 'gallery', 'Galeri Kekacauan', 'DOKUMENTASI KEGIATAN & KARYA', NULL, '[
        {"title": "WEEKLY JAM", "desc": "Sesi desain bareng setiap minggu.", "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop"},
        {"title": "SHOWCASE", "desc": "Pameran karya member terbaik.", "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop"},
        {"title": "WORKSHOP", "desc": "Belajar teknik baru dari mentor.", "image": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop"},
        {"title": "CHALLENGE", "desc": "Kompetisi desain berhadiah.", "image": "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2670&auto=format&fit=crop"}
    ]'::jsonb);

    -- Insert Meme Scenes
    DELETE FROM division_scenes WHERE division_id = meme_id;

    INSERT INTO division_scenes (division_id, scene_order, scene_id, title, subtitle, description, items) VALUES
    (meme_id, 1, 'main', 'DIVISI MEME', 'THE OFFICIAL HOMEPAGE', 'SELAMAT DATANG DI WEBSITE TERBURUK DI DUNIA!!!', NULL),
    (meme_id, 2, 'about', 'TENTANG KAMI', '(BACA DENGAN TELITI!!!)', 'Kami adalah entitas digital yang bergerak di bidang produksi konten humor berbasis internet (MEME) yang bertujuan untuk menghibur, menyindir, dan kadang-kadang membuat orang tersinggung (tapi bercanda).', NULL),
    (meme_id, 3, 'vision_mission', 'VISI & MISI', NULL, NULL, '{
        "vision": ["Menjadi raja meme lokal.", "Mengalahkan algoritma.", "Dapet centang biru (mimpi)."],
        "mission": ["Upload tiap hari (kalo ga lupa).", "Bikin admin lain iri.", "Tidur yang cukup."]
    }'::jsonb);

END $$;
