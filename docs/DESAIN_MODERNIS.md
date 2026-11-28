# Desain Modernis (Home dan Katalog Karya)

Dokumen ini menjelaskan tema baru untuk halaman `/` dan `/karya`, dan cara memperluasnya ke halaman lain.

## Prinsip

- **Karya yang berbicara.** Halaman dibangun di sekitar karya anggota, bukan kata-kata tentang kreativitas. Hero berupa globe karya yang bisa diputar.
- **Grid kaku, tipografi besar.** Grid 12 kolom dengan garis tipis, judul grotesk besar dengan satu kata dalam serif miring, keterangan kecil bergaya mono.
- **Netral di semua tempat, warna hanya dari karya.** Warna edisi hanya muncul sebagai titik kecil. Selebihnya abu-abu terang `#EDEDEB` dan tinta `#0E0E0F`.
- **Bahasa visual dari header Instagram.** Kertas abu-abu bergrid, logo OC, dan enam ikon diambil dari header resmi @ourcreativity.ofc.
- **Tanpa fitur sosial.** Halaman publik tidak menampilkan suka atau komentar. Kredit kreator dan tautan ke sumber asli yang jadi gantinya.

## Berkas

| Berkas | Fungsi |
| --- | --- |
| `pages/Home.tsx` | Landing: hero globe, ticker, daftar edisi dengan pratinjau yang mengikuti kursor, program, ajakan gabung |
| `pages/KaryaGaleri.tsx` | Katalog Karya (`/karya`): Bola, Peta, Daftar, Galeri, filter edisi, pencarian, lightbox |
| `pages/Karya.tsx` | Halaman Karya lama, kini di `/karya/arsip`. Tidak ditautkan dari halaman baru. |
| `components/modern/WorksGlobe.tsx` | Globe canvas 2D tanpa dependensi (lihat di bawah) |
| `components/modern/WorkLightbox.tsx` | Detail karya: nomor katalog, kreator, edisi, sumber |
| `components/modern/micro.tsx` | `RiseText`, `Magnet`, `useScrollSkew`, `HoverPreview` |
| `components/modern/Cursor.tsx` | Kursor cincin dengan label konteks |
| `components/modern/Reveal.tsx` | Muncul halus saat masuk layar |
| `components/modern/FooterWordmark.tsx` | Wordmark raksasa yang melebar dan menebal mengikuti kursor |
| `lib/globe.ts` | Matematika globe (sebaran Fibonacci, rotasi, perspektif, dinding), diuji |
| `lib/works.ts` | Model karya publik dan fungsi murni |
| `lib/edisi.ts` | Data tujuh edisi dan program. Angka pengikut adalah potret pada `EDISI_ASOF`. |
| `hooks/useWorks.ts` | Mengambil karya terbaru dari `works` (kolom ringan) |
| `public/brand/` | Logo dan ikon yang diekstrak dari header Instagram |

## Globe karya

- Karya disebar rata di bola dengan spiral Fibonacci. Tile menghadap kamera, ukurannya mengikuti perspektif, dan yang di belakang memudar.
- **Interaksi:** seret untuk memutar (dengan inersia), roda untuk zoom, klik untuk membuka, panah keyboard untuk memutar, `+` dan `-` untuk zoom. Saat tidak disentuh bola berputar pelan.
- **Hover:** tile membesar, tetangganya terdorong menjauh (riak), dan label kreator muncul.
- **Peta:** tombol `[ Peta ]` membentangkan bola menjadi dinding yang bisa digeser tanpa ujung. Transisinya adalah morf, bukan lompat.
- **Filter dan acak:** mengubah filter menyebar ulang karya ke seluruh bola. `Acak` mengacak penempatan lalu memutar bola.
- **Intro:** tile terbang dari pusat ke posisinya, berurutan.
- **Aksesibilitas:** canvas bisa difokus dan diputar dengan keyboard. Untuk pembaca layar, tersedia tampilan Daftar. `prefers-reduced-motion` mematikan putar otomatis, inersia, intro, dan kursor kustom.
- **Performa:** loop berhenti saat canvas di luar layar atau tab tersembunyi. Gambar dimuat bertahap (maksimum 8 sekaligus) dan DPR dibatasi 2.

## Intro dan scrolly di landing

- **Intro:** saat Home dibuka, bola karya memenuhi layar dengan penghitung muat 000 sampai 100 yang mengikuti kemajuan muat gambar sebenarnya. Setelah selesai, bola meluncur ke sisi kanan header sementara judul naik huruf demi huruf dan navigasi turun. Intro hanya diputar sekali per pemuatan halaman, bisa dilewati lewat tombol `Lewati` atau Enter/Esc, dan tidak diputar bila pengguna meminta gerak berkurang. Halaman dikunci dari gulir selama intro.
- **Bola dan gulir:** bola terdorong naik, mengecil, dan berputar sesuai kecepatan gulir.
- **Pernyataan:** kata demi kata menyala mengikuti gulir, dengan gambar karya sebaris yang melebar saat gilirannya (`ScrollStatement`).
- **Edisi:** bagian ini disematkan dan gulir vertikal menggeser trek ke samping, dengan paralaks gambar di tiap kartu (`EdisiTrack`). Di layar sempit menjadi carousel geser biasa.
- **Sorotan:** dua baris karya bergeser berlawanan arah mengikuti gulir (`ScrollRows`).
- **Micro-interaction lain:** judul dan "Gabung." menebal mengikuti kursor (`ProximityText`), tombol magnetik, kursor kustom dengan label dan denyut saat klik, garis progres gulir, navigasi yang sembunyi saat gulir turun, garis bawah yang menyapu, garis judul bagian yang tergambar, angka yang menghitung naik, dan pratinjau program yang mengikuti kursor.

## Mode demo lokal

Supabase tidak selalu terjangkau saat pengembangan. Untuk melihat UI dengan karya nyata, buat `.env.local` berisi `VITE_DEMO_WORKS=1` dan taruh manifest di `public/demo/works.json` (baris bentuk tabel `works` plus `edisi`, `username`, `source`) dengan gambar di `public/demo/t/` dan `public/demo/m/`. Folder `public/demo/` ada di `.gitignore`, jadi tidak ikut ter-commit, dan tanpa flag itu aplikasi selalu membaca Supabase.

Karya di folder demo dikutip dari post publik Instagram. Karya itu milik masing-masing kreator, jadi jangan ditaruh di repo atau dipublikasikan tanpa izin mereka.

## Perluasan ke halaman lain

Halaman lain (login, studio, profil, divisi, tim, info, admin) masih memakai tema gelap lama dan `Navbar` lama. Pemilihan tema ada di `AppContent` pada `App.tsx` (`isModern`). Untuk memindahkan satu halaman ke tema baru, tambahkan rutenya ke `isModern` dan pakai token di atas.

## Catatan

- Ikon Ilustrasi belum ada di header Instagram, jadi edisi itu memakai titik warna. Perlu dibuat ikon baru yang cocok.
- Logo di `public/brand/oc-mark.png` berasal dari tangkapan header beresolusi rendah (162×90 px). Ganti dengan berkas vektor atau PNG resolusi tinggi bila ada.
- Gambar karya tidak disimpan di repo. Semuanya dibaca dari Supabase Storage.
