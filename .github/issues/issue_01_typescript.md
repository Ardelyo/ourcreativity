## 🎯 Deskripsi

Terdapat **10+ penggunaan tipe `any`** yang tersebar di berbagai komponen dan halaman. Hal ini mengurangi keamanan tipe TypeScript dan dapat menyebabkan bug yang sulit dilacak.

## 📍 Lokasi Terdeteksi

| File                                                  | Line        | Kode                          |
| ----------------------------------------------------- | ----------- | ----------------------------- |
| `pages/Story.tsx`                                     | 140         | `progress: any`               |
| `pages/Karya.tsx`                                     | 48          | `useState<any[]>([]);`        |
| `pages/Karya.tsx`                                     | 76          | `handlePublish(newWork: any)` |
| `pages/Karya.tsx`                                     | 91          | `renderCardContent(art: any)` |
| `pages/divisions/Video.tsx`                           | 44          | `scrollProgress: any`         |
| `pages/Announcement.tsx`                              | 9-10        | `useState<any[]>`             |
| `components/CreationStudio/index.tsx`                 | 19, 69, 314 | Multiple `as any`             |
| `components/CreationStudio/carousel/SlideBuilder.tsx` | 91          | `as any`                      |

## ✅ Solusi yang Diharapkan

1. Buat interface/type untuk **Work**, **Announcement**, **TeamMember** di folder `types/`
2. Ganti semua `any` dengan tipe yang spesifik
3. Manfaatkan Supabase-generated types dari `supabase gen types`

## 📋 Kriteria Selesai

- [ ] Tidak ada penggunaan `any` di komponen utama
- [ ] Semua tipe didefinisikan dengan jelas
- [ ] Build TypeScript berhasil tanpa error
