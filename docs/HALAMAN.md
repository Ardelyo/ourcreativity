# Dokumentasi Halaman

> Panduan lengkap untuk setiap halaman di OurCreativities v5.0

## Ringkasan

Aplikasi OurCreativities terdiri dari 5 halaman utama, masing-masing dengan tujuan dan fitur unik. Semua halaman menggunakan React Router untuk navigasi dan Framer Motion untuk transisi.

## Halaman-Halaman

### Home (Beranda)

**Lokasi:** `pages/Home.tsx`  
**Rute:** `/`  
**Tujuan:** Halaman pendaratan utama, kesan pertama bagi pengunjung

**Bagian:**
1. **Bagian Hero**
   - Judul besar "Merangkai Imajinasi Kita"
   - Subjudul deskriptif
   - Dua tombol CTA
   - Lencana status langsung

2. **Bagian BentoGrid**
   - Pameran sorotan dalam tata letak grid
   - Beberapa kartu konten
   - Status hover interaktif

3. **Bottom CTA**
   - Ajakan bertindak terakhir
   - Mendorong keterlibatan

**Fitur:**
- Animasi masuk untuk semua bagian
- Perilaku gulir halus
- Tata letak responsif
- Tipografi premium

**Kebutuhan Data:**
- Tidak ada data eksternal (konten statis)

**Performa:**
- Waktu muat: ~0.9s
- Lighthouse: 96/100

---

### Karya

**Lokasi:** `pages/Karya.tsx`  
**Rute:** `/karya`  
**Tujuan:** Pameran portofolio untuk karya kreatif komunitas

**Tata Letak:**
Tata letak grid Masonry untuk menampilkan karya dalam grid asimetris yang menarik secara visual.

**Fitur:**

**Sistem Grid:**
- Tata letak gaya Masonry/Pinterest
- Kolom responsif (1-4 tergantung layar)
- Pemuatan gambar secara malas (*Lazy loading*)
- Gulir tak terbatas (opsional)

**Kartu Karya:**
- Pratinjau gambar/video
- Judul dan deskripsi
- Informasi penulis
- Tombol suka dan bagikan
- Lencana sorotan untuk karya unggulan

**Interaksi:**
- Klik kartu untuk tampilan detail
- Fungsi suka
- Fungsi bagikan
- Filter berdasarkan kategori/tag
- Pencarian (dasar)

**Dukungan Media:**
- Gambar: JPG, PNG, WebP
- Video: MP4, WebM
- Pemuatan malas untuk performa
- Pembuatan thumbnail

**Struktur Data:**
```typescript
interface Karya {
  id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  likes: number;
  shares: number;
  isSpotlight: boolean;
  tags: string[];
  category: string;
}
```

**Pertimbangan Performa:**
- Pemuatan gambar progresif
- Gulir virtual untuk daftar besar
- Pengiriman media yang dioptimalkan
- Strategi caching

---

### Tim

**Lokasi:** `pages/Tim.tsx`  
**Rute:** `/tim`  
**Tujuan:** Menampilkan anggota tim dan kontributor

**Tata Letak:**
Tata letak kartu grid dengan profil anggota tim.

**Konten Kartu:**
- Foto profil/avatar
- Nama
- Peran/posisi
- Bio singkat
- Tautan media sosial
- Email (opsional)

**Fitur:**

**Grid Tim:**
- Grid responsif (1-3 kolom)
- Kartu dengan tinggi yang sama
- Efek hover
- Animasi halus

**Kartu Anggota:**
```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  email?: string;
}
```

**Interaksi:**
- Hover untuk mengungkapkan detail
- Klik ikon sosial untuk membuka tautan
- Animasi masuk halus

**Desain:**
- Kartu glassmorphism
- Spasi konsisten
- Presentasi profesional
- Dioptimalkan untuk seluler

---

### Story (Cerita Kami)

**Lokasi:** `pages/Story.tsx`  
**Rute:** `/story`  
**Tujuan:** Penceritaan merek, visi misi, perjalanan komunitas

**Tata Letak:**
Konten bentuk panjang gaya majalah dengan tipografi kaya.

**Bagian:**

**1. Pengantar**
- Pernyataan pembuka
- Nilai komunitas
- Pernyataan misi

**2. Linimasa Perjalanan**
- Tonggak sejarah dalam linimasa visual
- Momen kunci
- Kisah pertumbuhan

**3. Visi & Misi**
- Tujuan masa depan
- Dampak komunitas
- Nilai dan prinsip

**4. Dampak Komunitas**
- Pencapaian
- Statistik
- Testimoni (opsional)

**Elemen Desain:**
- Tipografi premium (Playfair Display)
- Judul besar
- Kutipan tarik (*Pull quotes*)
- Visualisasi linimasa
- Animasi gulir (halus)

**Blok Konten:**
```typescript
interface StorySection {
  id: string;
  type: 'text' | 'quote' | 'timeline' | 'stats';
  title?: string;
  content: string;
  image?: string;
  data?: any;
}
```

**Pengalaman Membaca:**
- Panjang baris optimal
- Hierarki jelas
- Ruang bernapas (whitespace)
- Gulir halus
- Pengungkapan progresif

---

### Info

**Lokasi:** `pages/Info.tsx`  
**Rute:** `/info`  
**Tujuan:** Informasi kontak, FAQ, informasi umum

**Bagian:**

**1. Informasi Kontak**
- Alamat email
- Tautan media sosial
- Lokasi (jika ada)
- Jam operasional

**2. Bagian FAQ**
- Pertanyaan umum
- Jawaban gaya akordeon
- Dapat dicari (masa depan)

**3. Formulir Kontak** (Opsional/Masa Depan)
- Bidang nama
- Bidang email
- Area teks pesan
- Tombol kirim

**4. Grid Media Sosial**
- Tautan ikon ke platform sosial
- Jumlah pengikut (opsional)
- Postingan terbaru (integrasi masa depan)

**Tata Letak:**
```typescript
Info
├── Bagian Hero (Halaman Info)
├── Kartu Kontak
│   ├── Kartu Email
│   ├── Kartu Media Sosial
│   └── Kartu Lokasi
├── Akordeon FAQ
└── Bagian CTA
```

**Struktur Data:**
```typescript
interface ContactInfo {
  email: string;
  social: {
    instagram: string;
    twitter: string;
    linkedin: string;
    github: string;
  };
  location?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
```

---

## Fitur Umum

### Transisi Halaman

Semua halaman menggunakan Framer Motion untuk transisi halus:

```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Konten Halaman */}
</motion.div>
```

### Gulir ke Atas

Gulir otomatis ke atas saat rute berubah melalui komponen `ScrollToTop`.

### Desain Responsif

Semua halaman responsif dengan breakpoint:
- Seluler: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Optimasi SEO

**Meta Tag Per Halaman:**
```html
<title>Judul Halaman | Our Creativity</title>
<meta name="description" content="Deskripsi halaman" />
<meta property="og:title" content="Judul Halaman" />
<meta property="og:description" content="Deskripsi halaman" />
```

### Status Pemuatan

**Layar Skeleton:**
Konten placeholder saat data dimuat (implementasi masa depan).

**Indikator Progres:**
Spinner pemuatan untuk operasi async.

---

## Panduan Pengembangan Halaman

### Membuat Halaman Baru

**Langkah 1: Buat File Halaman**
```bash
# Di folder pages/
touch NewPage.tsx
```

**Langkah 2: Struktur Dasar**
```typescript
import React from 'react';
import { motion } from 'framer-motion';

export const NewPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-20"
    >
      <h1>Halaman Baru</h1>
      {/* Konten */}
    </motion.div>
  );
};
```

**Langkah 3: Tambahkan Rute**
```typescript
// Di App.tsx
import { NewPage } from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

**Langkah 4: Tambahkan ke Navigasi**
```typescript
// Di Navbar.tsx
const navLinks = [
  // tautan yang ada
  { name: 'Halaman Baru', href: '/new-page' },
];
```

### Pola Tata Letak Halaman

**Struktur yang Disarankan:**
```typescript
<motion.div className="py-20">
  {/* Hero/Header */}
  <section className="mb-16">
    <h1>Judul Halaman</h1>
    <p>Deskripsi</p>
  </section>

  {/* Konten Utama */}
  <section className="mb-16">
    {/* Blok konten */}
  </section>

  {/* CTA atau Footer */}
  <section>
    <BottomCTA />
  </section>
</motion.div>
```

### Praktik Terbaik

**Performa:**
- Lazy load gambar
- Code split komponen berat
- Optimalkan animasi
- Minimalkan render ulang

**Aksesibilitas:**
- HTML Semantik
- Hierarki judul yang tepat
- Teks alt untuk gambar
- Navigasi keyboard

**SEO:**
- Judul halaman unik
- Deskripsi meta
- Data terstruktur
- URL kanonis

**Pengalaman Pengguna:**
- Navigasi jelas
- Desain konsisten
- Interaksi cepat
- Ramah seluler

---

## Manajemen Data

### Pendekatan Saat Ini

**Data Statis:**
- Di-hard-code dalam komponen
- Tidak ada panggilan API eksternal
- Tidak ada database

### Pendekatan Masa Depan

**Integrasi CMS:**
```typescript
// Contoh dengan Strapi
const Page = () => {
  const { data } = useQuery('pageContent', fetchPageContent);
  
  return <Content data={data} />;
};
```

**Panggilan API:**
```typescript
// Contoh struktur API
GET /api/pages/home
GET /api/karya
GET /api/team
GET /api/story
```

---

## Pengujian Halaman

### Daftar Periksa Pengujian Manual

**Per Halaman:**
- [ ] Render tanpa error
- [ ] Responsif di semua breakpoint
- [ ] Animasi berjalan lancar
- [ ] Tautan menavigasi dengan benar
- [ ] Gambar dimuat dengan benar
- [ ] Teks dapat dibaca
- [ ] Sesuai aksesibilitas
- [ ] Performa dapat diterima

### Pengujian Otomatis (Masa Depan)

**Unit Tests:**
```typescript
describe('Home Page', () => {
  it('renders hero section', () => {
    render(<Home />);
    expect(screen.getByText(/Merangkai/i)).toBeInTheDocument();
  });
});
```

**E2E Tests:**
```typescript
test('navigate to karya page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Karya');
  await expect(page).toHaveURL('/karya');
});
```

---

**Terakhir Diperbarui:** November 2025  
**Versi:** 5.0  
**Pemelihara:** Tim OurCreativities
