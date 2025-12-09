# Dokumentasi Komponen

> Referensi API dan panduan penggunaan komponen OurCreativities v5.0

## Ringkasan

Dokumentasi ini menjelaskan setiap komponen yang ada di aplikasi OurCreativities, termasuk props, penggunaan, dan contoh implementasi.

## Komponen Tata Letak

### Navbar

Komponen bilah navigasi dengan dukungan untuk menu desktop dan seluler.

**Lokasi:** `components/Navbar.tsx`

**Fitur:**
- Posisi tetap (*fixed*) di atas
- Desain Glassmorphism dengan *backdrop blur*
- Responsif seluler dengan menu hamburger
- Penyorotan rute aktif (*Active route highlighting*)
- Animasi halus dengan Framer Motion

**Props:**
Tidak ada props (komponen mandiri)

**Penggunaan:**
```typescript
import { Navbar } from './components/Navbar';

<Navbar />
```

**Struktur:**
```typescript
Navbar
├── Logo (Tautan ke beranda)
├── Tautan Navigasi Desktop
├── Tombol CTA "Bergabung"
└── Toggle Menu Seluler
    └── Overlay Menu Seluler
```

**Tautan Navigasi:**
```typescript
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Karya', href: '/karya' },
  { name: 'Tim', href: '/tim' },
  { name: 'Info', href: '/info' },
];
```

**Styling:**
- Latar Belakang: `bg-[#111]/80` dengan `backdrop-blur-xl`
- Batas: `border-white/10`
- Bentuk: `rounded-full`
- Lebar maksimal: `max-w-4xl`

**Menu Seluler:**
- Terbuka pada breakpoint responsif `md:hidden`
- Animasi geser masuk (*Slide-in*)
- Latar belakang dengan glassmorphism
- Menutup secara otomatis saat navigasi

---

### Footer

Komponen kaki halaman sederhana dengan hak cipta dan tautan.

**Lokasi:** `components/Footer.tsx`

**Fitur:**
- Desain minimalis yang bersih
- Informasi hak cipta
- Tautan sosial (opsional)
- Tata letak responsif

**Props:**
Tidak ada props

**Penggunaan:**
```typescript
import { Footer } from './components/Footer';

<Footer />
```

**Styling:**
- Batas atas halus
- Warna teks diredam (*muted*)
- Tata letak terpusat
- Padding responsif

---

## Komponen Konten

### Hero

Bagian Hero untuk halaman beranda dengan judul animasi dan tombol CTA.

**Lokasi:** `components/Hero.tsx`

**Fitur:**
- Tipografi besar dengan Playfair Display
- Efek teks gradien
- Lencana animasi "Komunitas Terbuka"
- Dua tombol CTA
- Animasi masuk Framer Motion

**Props:**
Tidak ada props

**Penggunaan:**
```typescript
import { Hero } from './components/Hero';

<Hero />
```

**Struktur:**
```typescript
Hero
├── Lencana Editorial (dengan indikator langsung)
├── Judul Utama
│   ├── "Merangkai"
│   ├── "Imajinasi" (teks gradien)
│   └── "Kita."
├── Teks Subjudul
└── Tombol CTA
    ├── Primer: "Mulai Jelajahi"
    └── Sekunder: "Tonton Reel"
```

**Tipografi:**
- Ukuran H1: `text-6xl md:text-8xl lg:text-9xl`
- Font: `font-serif` (Playfair Display)
- Tinggi baris: `leading-[0.9]` (ketat)
- Tracking: `tracking-tight`

**Animasi:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.8 }}
>
```

**Varian Tombol:**
1. Primer: Latar belakang putih, bayangan bersinar saat hover
2. Sekunder: Efek kaca dengan batas

---

### BentoGrid

Sistem tata letak grid fleksibel untuk menampilkan kartu konten dengan berbagai ukuran.

**Lokasi:** `components/BentoGrid.tsx`

**Fitur:**
- Tata letak grid asimetris
- Berbagai variasi ukuran kartu
- Breakpoint responsif
- Efek glassmorphism
- Animasi hover

**Props:**
```typescript
interface BentoGridProps {
  // Tidak ada props eksternal
  // Data di-hard-code dalam komponen
}
```

**Penggunaan:**
```typescript
import { BentoGrid } from './components/BentoGrid';

<BentoGrid />
```

**Tata Letak Grid:**
```typescript
// Desktop: 4 kolom dengan auto-fit
// Tablet: 2-3 kolom
// Seluler: 1-2 kolom

className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

**Jenis Kartu:**

**Kartu Standar:**
```typescript
<div className="bg-white/5 border border-white/10 rounded-2xl p-6">
  <Icon />
  <h3>{title}</h3>
  <p>{description}</p>
</div>
```

**Kartu Unggulan (Besar):**
- Merentang beberapa kolom: `lg:col-span-2`
- Padding lebih besar
- Konten lebih menonjol

**Kartu Kaca:**
```typescript
<div className="bg-white/10 backdrop-blur-xl border border-white/20">
  {/* Konten */}
</div>
```

**Struktur Internal:**
```typescript
BentoGrid
├── Wadah Grid
├── Kartu 1 (Standar)
├── Kartu 2 (Lebar span-2)
├── Kartu 3 (Standar)
├── Kartu 4 (Tinggi)
└── Kartu 5 (Unggulan kaca)
```

**Kustomisasi:**
- Ubah data kartu dalam komponen
- Sesuaikan kolom grid melalui className
- Ubah ukuran kartu dengan col-span/row-span
- Perbarui animasi per kartu

---

### BottomCTA

Bagian ajakan bertindak untuk mendorong keterlibatan pengguna.

**Lokasi:** `components/BottomCTA.tsx`

**Fitur:**
- Bagian lebar penuh
- Latar belakang gradien
- Konten terpusat
- Tombol aksi

**Props:**
Tidak ada props (dapat ditambahkan untuk kustomisasi)

**Penggunaan:**
```typescript
import { BottomCTA } from './components/BottomCTA';

<BottomCTA />
```

**Struktur:**
```typescript
BottomCTA
├── Wadah
├── Judul
├── Deskripsi
└── Tombol CTA
```

**Styling:**
- Latar belakang gradien atau warna solid
- Tipografi besar
- Tombol menonjol
- Padding responsif

---

## Komponen Utilitas

### ScrollToTop

Komponen utilitas untuk menggulir ke atas saat rute berubah.

**Lokasi:** `App.tsx` (inline)

**Implementasi:**
```typescript
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};
```

**Penggunaan:**
```typescript
<Router>
  <ScrollToTop />
  {/* Komponen lainnya */}
</Router>
```

---

### AnimatedRoutes

Pembungkus untuk rute dengan transisi halaman.

**Lokasi:** `App.tsx`

**Implementasi:**
```typescript
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rute */}
      </Routes>
    </AnimatePresence>
  );
};
```

**Fitur:**
- Transisi halaman Framer Motion
- Mode: "wait" (tunggu keluar sebelum masuk)
- Kunci berbasis lokasi untuk animasi yang tepat

---

## Praktik Terbaik Komponen

### Panduan Styling

**Pola Konsisten:**
```typescript
// Glassmorphism
className="bg-white/10 backdrop-blur-xl border border-white/20"

// Desain Kartu
className="bg-white/5 border border-white/10 rounded-2xl p-6"

// Status Hover
className="hover:bg-white/20 transition-colors duration-300"
```

### Panduan Animasi

**Animasi Masuk:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

**Animasi Hover:**
```typescript
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
>
```

**Transisi Halaman:**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
```

### Desain Responsif

**Breakpoints (Tailwind):**
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Mobile-First:**
```typescript
// Basis: Seluler
// md: Tablet+
// lg: Desktop+

className="text-sm md:text-base lg:text-lg"
```

### Tipe TypeScript

**Pola Umum:**
```typescript
// Item Tautan
interface NavLink {
  name: string;
  href: string;
}

// Data Kartu
interface CardData {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  link?: string;
}

// Props Komponen (contoh)
interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}
```

## Panduan Ekstensi Komponen

### Menambahkan Komponen Baru

**Langkah 1: Buat File Komponen**
```bash
# Di folder components/
touch NewComponent.tsx
```

**Langkah 2: Struktur Dasar**
```typescript
import React from 'react';
import { motion } from 'framer-motion';

export const NewComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="..."
    >
      {/* Konten */}
    </motion.div>
  );
};
```

**Langkah 3: Tambahkan ke Index (opsional)**
```typescript
// components/index.ts
export { NewComponent } from './NewComponent';
```

**Langkah 4: Impor dan Gunakan**
```typescript
import { NewComponent } from './components/NewComponent';
```

### Memodifikasi Komponen yang Ada

**Panduan:**
1. Pertahankan antarmuka props yang ada
2. Jangan merusak kompatibilitas ke belakang (*backward compatibility*)
3. Perbarui dokumentasi
4. Uji perilaku responsif
5. Periksa performa animasi

## Pertimbangan Performa

**Tips Optimasi:**

**Pemuatan Malas (*Lazy Loading*):**
```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

**Memoization:**
```typescript
export const Component = React.memo(() => {
  // Kode komponen
});
```

**Optimasi Callback:**
```typescript
const handleClick = useCallback(() => {
  // Kode handler
}, [dependencies]);
```

**Performa Animasi:**
- Gunakan `transform` dan `opacity` untuk animasi
- Hindari menganimasikan `width`, `height`, `top`, `left`
- Gunakan `will-change` dengan hati-hati
- Batasi animasi bersamaan

---

**Terakhir Diperbarui:** November 2025  
**Versi:** 5.0  
**Pemelihara:** Tim OurCreativities
