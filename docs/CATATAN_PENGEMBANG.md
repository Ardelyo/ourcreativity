# Catatan Pengembang (Developer Notes)

> Kumpulan catatan teknis, TODO, dan penjelasan implementasi yang diambil langsung dari kode sumber.

## Ringkasan

Dokumen ini berisi catatan penting yang ditemukan dalam komentar kode. Ini berguna untuk memahami keputusan implementasi spesifik, logika animasi, dan area yang mungkin memerlukan optimasi di masa depan.

## Komponen & Halaman

### `components/Hero.tsx`

*   **Optimasi LCP:**
    > "LCP Optimization: Start visible, animate from a slightly different state or use layout animation"
    *   **Penjelasan:** Untuk meningkatkan *Largest Contentful Paint* (LCP), elemen Hero sebaiknya dimulai dalam keadaan terlihat, bukan `opacity: 0`. Animasi harus dimulai dari keadaan yang sedikit berbeda atau menggunakan animasi tata letak agar browser dapat merender konten utama lebih cepat.

### `components/Navbar.tsx`

*   **Logika Menu Desktop:**
    > "Determine if we should show the full menu (Desktop)"
    *   **Penjelasan:** Logika untuk menentukan kapan menu lengkap ditampilkan versus menu hamburger/seluler.
*   **Konfigurasi Animasi:**
    > "Animation transition config - 'Apple-like' fluid spring"
    *   **Penjelasan:** Menggunakan konfigurasi pegas (*spring*) yang cair untuk meniru nuansa animasi antarmuka Apple.

### `components/BentoGrid.tsx`

*   **Komponen Noise:**
    > "Modern Noise Component - Optimized"
    *   **Penjelasan:** Implementasi efek *noise* (bintik-bintik) untuk tekstur latar belakang.
*   **Kurva Animasi:**
    > "Custom cubic-bezier for 'GSAP feel'"
    *   **Penjelasan:** Menggunakan `ease: [0.22, 1, 0.36, 1]` untuk memberikan nuansa animasi yang mirip dengan GSAP (GreenSock Animation Platform), yang terkenal halus.

### `components/ChangelogTimeline.tsx`

*   **Ekstraksi Warna:**
    > "Extract color name (e.g., 'rose' from 'rose-500') or use default"
    *   **Penjelasan:** Logika untuk mengambil nama warna dasar dari kelas Tailwind (misalnya mengambil 'rose' dari 'rose-500') untuk penggunaan dinamis dalam styling.

### `components/CreationStudio.tsx`

*   **Placeholder Konten:**
    > "For text/code" / "For visual/video thumb"
    *   **Penjelasan:** Menandai properti konten dan gambar sebagai placeholder untuk berbagai jenis media.
*   **Logika Divisi:**
    > "Auto-set division based on medium (can be changed later)"
    *   **Penjelasan:** Secara otomatis menetapkan divisi (misal: Coding, Video) berdasarkan jenis media yang diunggah, namun tetap memungkinkan pengguna untuk mengubahnya.

### `pages/Story.tsx`

*   **Komponen Bersama:**
    > "Shared Components"
    *   **Penjelasan:** Bagian kode yang mendefinisikan komponen yang digunakan berulang kali dalam halaman Story.
*   **Bagian 1: Intro Sinematik:**
    > "Section 1: Cinematic Intro"
    *   **Penjelasan:** Implementasi bagian pembuka dengan gaya sinematik.
*   **Bagian 2: Filosofi:**
    > "Section 2: Philosophy (Animated Infinity)"
    *   **Penjelasan:** Animasi simbol tak terhingga (*infinity*) yang digambar berdasarkan posisi gulir (*scroll*).
*   **Bagian 3: The Loop:**
    > "Section 3: The Loop (Vertical Scrollytelling)"
    *   **Penjelasan:** Implementasi *scrollytelling* vertikal di mana konten muncul dan menghilang seiring pengguna menggulir ke bawah.
    *   *Catatan Teknis:* `Fade in then out` - Opasitas diatur untuk memudar masuk lalu keluar.
*   **Bagian 4: Statistik & Dampak:**
    > "Section 4: Stats & Impact"
    *   **Penjelasan:** Bagian yang menampilkan metrik dan dampak komunitas.

### `pages/Video.tsx` (Divisi Video)

*   **Pemetaan Gulir (Scroll Mappings):**
    *   **Scene 1:** "Intro Fade Out"
    *   **Scene 2:** "Chaos Fade In/Out"
    *   **Scene 3:** "Styles"
    *   **Scene 4:** "Alchemy (The Magic of Editing)" - Termasuk sub-animasi untuk elemen *Alchemy* seperti *raw footage fades*, *color grading appears*, dan *sound waves rise*.
    *   **Scene 5:** "All In One"

### `pages/Karya.tsx`

*   **Data Dummy:**
    > "Extended dummy data to showcase all types"
    *   **Penjelasan:** Data sampel yang diperluas untuk mendemonstrasikan semua jenis tampilan kartu karya.
*   **Penentuan Tipe:**
    > "Determine type based on division if not specified"
    *   **Penjelasan:** Logika fallback untuk menentukan tipe media jika tidak ditentukan secara eksplisit.

### `pages/divisions/Writing.tsx`

*   **Smooth Scroll:**
    > "A simplified smooth scroll wrapper for the 'premium' feel"
    *   **Penjelasan:** Pembungkus gulir halus yang disederhanakan untuk memberikan nuansa premium pada halaman tulisan.

## Catatan Umum

*   **Background Noise:**
    Banyak komponen (`Info.tsx`, `Meme.tsx`, `Story.tsx`) menggunakan pola SVG atau GIF untuk efek *noise* latar belakang guna memberikan tekstur dan kedalaman visual.
*   **Avatar UI:**
    Penggunaan `ui-avatars.com` untuk menghasilkan avatar default berdasarkan nama pengguna.
*   **Gambar Unsplash:**
    Penggunaan URL Unsplash dengan parameter kustom (`q=80&w=800...`) untuk optimasi pemuatan gambar.

---

**Terakhir Diperbarui:** November 2025
**Dibuat Oleh:** Asisten AI (Berdasarkan analisis kode)
