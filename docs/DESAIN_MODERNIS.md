# Desain Modernis (Home dan Karya)

Dokumen ini menjelaskan tema baru untuk halaman `/` dan `/karya`, dan cara memperluasnya ke halaman lain.

## Prinsip

- **Karya yang berbicara.** Halaman dibangun di sekitar karya anggota, bukan kata-kata tentang kreativitas. Hero berupa dua baris karya terbaru, bukan ilustrasi atau gradasi.
- **Grid kaku, tipografi besar.** Grid 12 kolom dengan garis tipis, judul grotesk besar dengan satu kata dalam serif miring, keterangan kecil bergaya mono.
- **Netral di semua tempat, warna hanya dari karya.** Warna edisi hanya muncul sebagai titik kecil. Selebihnya abu-abu terang `#EDEDEB` dan tinta `#0E0E0F`.
- **Bahasa visual dari header Instagram.** Kertas abu-abu bergrid, logo OC, dan enam ikon (video, kamera, pena, catatan, tawa, kode) diambil dari header resmi @ourcreativity.ofc.

## Token

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| Kertas | `#EDEDEB` | Latar halaman |
| Tinta | `#0E0E0F` | Teks, garis tebal, hover |
| Abu 1 | `#55555A` | Teks sekunder |
| Abu 2 | `#8A8A8F` | Keterangan, label |
| Garis | `rgba(14,14,15,.15)` | Pemisah tipis |

Font: **Archivo** (`font-display`), **Instrument Serif** (`font-editorial`, hanya untuk satu kata penekanan), **JetBrains Mono** (`font-mono`, keterangan). Inter tetap dipakai halaman lama.

## Berkas

| Berkas | Fungsi |
| --- | --- |
| `pages/Home.tsx` | Landing: hero, daftar edisi, program, ajakan gabung |
| `pages/KaryaGaleri.tsx` | Galeri Karya (rute `/karya`): kanvas, daftar, galeri, lightbox |
| `pages/Karya.tsx` | Halaman Karya lama (suka, komentar, detail), kini di `/karya/arsip` |
| `components/modern/` | `ModernNav`, `ModernFooter`, `WorkImage` |
| `hooks/useWorks.ts` | Mengambil karya terbaru dari tabel `works` (kolom ringan, tanpa hitungan sosial) |
| `lib/works.ts` | Model dan fungsi murni (pemilihan gambar, hash, rasio) |
| `lib/karyaLayout.ts` | Tata letak kanvas dan pembatas geseran (diuji) |
| `lib/edisi.ts` | Data tujuh edisi Instagram dan program. Angka pengikut adalah potret pada `EDISI_ASOF`. |
| `public/brand/` | Logo dan ikon yang diekstrak dari header Instagram |

## Cara kerja halaman Karya

- Data dari `works` (160 terbaru). Karya tanpa gambar (tulisan, kode) tampil sebagai kartu tipografi.
- Tata letak kanvas dihitung dari rasio asli gambar yang dilaporkan setelah termuat. Sebelum itu dipakai tebakan stabil per id, jadi tile bergeser halus saat gambar masuk.
- Geser dengan seret, roda mouse, atau sentuhan. Tile fokus lewat keyboard otomatis digeser ke layar.
- Filter divisi disimpan di URL: `/karya?divisi=graphics`.
- Lightbox: panah kiri dan kanan untuk berpindah, Esc untuk menutup, fokus kembali ke tile asal.
- `Detail, suka, dan komentar` mengarah ke `/karya/arsip`, yaitu halaman lama yang fiturnya tidak diubah.

## Perluasan ke halaman lain

Halaman lain (login, studio, profil, divisi, tim, info, admin) masih memakai tema gelap lama dan `Navbar` lama. Pemilihan tema ada di `AppContent` pada `App.tsx` (`isModern`). Untuk memindahkan satu halaman ke tema baru, tambahkan rutenya ke `isModern` dan pakai token di atas.

## Catatan

- Ikon Ilustrasi belum ada di header Instagram, jadi baris Ilustrasi memakai titik warna. Perlu dibuat ikon baru yang cocok.
- Logo di `public/brand/oc-mark.png` berasal dari tangkapan header beresolusi rendah (162×90 px). Ganti dengan berkas vektor atau PNG resolusi tinggi bila ada.
- Gambar karya tidak disimpan di repo. Semuanya dibaca dari Supabase Storage.
