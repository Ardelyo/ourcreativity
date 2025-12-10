## 🎯 Deskripsi

Aplikasi menggunakan `MemoryRouter` yang **tidak mendukung persistensi URL**. Ini menyebabkan:
- URL tidak berubah saat navigasi
- Deep linking tidak berfungsi
- Refresh halaman kembali ke home
- SEO tidak optimal

## 📍 Lokasi

File `App.tsx` line 2, 74:
```tsx
import { MemoryRouter as Router, ... } from 'react-router-dom';
// ...
<Router>
```

## ❓ Latar Belakang

Dari dokumen `ARSITEKTUR.md`:
> **Tipe Router:** MemoryRouter
> - Alasan: SPA tanpa routing sisi server
> - **Tidak ada persistensi URL (dapat diubah ke BrowserRouter jika diperlukan)**

## ✅ Solusi yang Diharapkan

### Migrasi ke BrowserRouter

```tsx
// Sebelum
import { MemoryRouter as Router } from 'react-router-dom';

// Sesudah
import { BrowserRouter as Router } from 'react-router-dom';
```

### Konfigurasi Vercel (jika diperlukan)

Tambahkan `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Atau Gunakan HashRouter (Alternatif Mudah)

```tsx
import { HashRouter as Router } from 'react-router-dom';
```

## 💡 Pertimbangan

| Router | URL | Refresh | Deep Link | SEO |
|--------|-----|---------|-----------|-----|
| MemoryRouter | ❌ | ❌ | ❌ | ❌ |
| HashRouter | `#/karya` | ✅ | ✅ | ⚠️ |
| BrowserRouter | `/karya` | ✅* | ✅ | ✅ |

*Memerlukan konfigurasi server

## 📋 Kriteria Selesai

- [ ] Router diubah ke BrowserRouter/HashRouter
- [ ] URL berubah saat navigasi
- [ ] Deep linking berfungsi
- [ ] Refresh halaman tetap di halaman yang sama
