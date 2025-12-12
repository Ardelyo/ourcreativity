## 🎯 Deskripsi

Beberapa aspek performa dapat ditingkatkan untuk pengalaman pengguna yang lebih baik.

## 📍 Temuan Performa

### 1. Code Splitting Bisa Ditingkatkan

Saat ini lazy loading sudah diimplementasikan, tapi:

- `ChangelogTimeline.tsx` (23KB) dan `Karya.tsx` (18KB) cukup besar
- Komponen CreationStudio bisa di-split lebih lanjut

### 2. Bundle Size Warning

Build menunjukkan warning tentang chunk size limit.

### 3. Gambar Eksternal

Banyak gambar dari Unsplash dan external URLs:

```tsx
// components/BentoGrid.tsx
src = 'https://images.unsplash.com/...';
```

Tidak ada:

- Image optimization
- Lazy loading untuk gambar
- Placeholder/blur

### 4. Animasi di Mobile

Dari komentar di `App.tsx`:

```tsx
{
  /* Cahaya Utama - Statis di seluler untuk menghemat baterai/performa */
}
```

Tapi belum ada deteksi `prefers-reduced-motion`.

## ✅ Solusi yang Diharapkan

### 1. Optimasi Image

```tsx
// Tambahkan loading lazy dan dimensi
<img src={url} loading='lazy' width={800} height={600} alt='description' />
```

### 2. Respek Reduced Motion

```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Di framer-motion
<motion.div animate={prefersReducedMotion ? {} : normalAnimation} />;
```

### 3. Web Vitals Monitoring

Tambahkan ke `index.tsx`:

```tsx
import { onCLS, onFID, onLCP } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onLCP(console.log);
```

### 4. Further Code Splitting

Split komponen besar:

- `ChangelogTimeline` → per-section
- `CreationStudio` → per-step

## 📋 Kriteria Selesai

- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms
- [ ] Gambar lazy loaded
- [ ] Reduced motion dihormati
- [ ] Bundle size optimal
