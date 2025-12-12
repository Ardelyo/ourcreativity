<div align="center">

# 🎨 OurCreativity

### Revolution Edition v5.0

![Version](https://img.shields.io/badge/Versi-5.0.0-0D1117?style=for-the-badge&labelColor=1a1a2e)
![Status](https://img.shields.io/badge/Status-Aktif-00d26a?style=for-the-badge&labelColor=1a1a2e)
![License](https://img.shields.io/badge/Lisensi-MIT-blue?style=for-the-badge&labelColor=1a1a2e)

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-FF0055?style=flat-square&logo=framer&logoColor=white)

<br/>

**Platform Komunitas Kreatif Generasi Berikutnya**

*Merangkai Imajinasi, Menghidupkan Karya.*

<br/>

[Lihat Demo](https://ourcreativity.vercel.app) · [Laporkan Bug](https://github.com/ardelyo/ourcreativity/issues) · [Ajukan Fitur](https://github.com/ardelyo/ourcreativity/issues)

---

</div>

<br/>

## 🌐 English Quick Start

**OurCreativity** is a creative community platform built with React 19, TypeScript, and Tailwind CSS. It showcases creative works across five divisions: Graphics, Coding, Video, Writing, and Memes.

### Quick Setup
```bash
git clone https://github.com/ardelyo/ourcreativity.git
cd ourcreativity
npm install
cp .env.example .env  # Add your Supabase credentials
npm run dev
```

📖 **For detailed setup instructions, see [docs/SETUP.md](docs/SETUP.md)** (available in Indonesian with key technical details)

---

<br/>

## 📋 Daftar Isi

- [English Quick Start](#-english-quick-start)
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Memulai](#-memulai)
- [Struktur Proyek](#-struktur-proyek)
- [Dokumentasi](#-dokumentasi)
- [Kontribusi](#-kontribusi)
- [Tim Pengembang](#-tim-pengembang)
- [Lisensi](#-lisensi)

<br/>

## 🌟 Tentang Proyek

**OurCreativity** adalah platform ekosistem digital yang dirancang untuk menjadi wadah utama bagi para kreator dari berbagai disiplin ilmu. Dibangun dengan filosofi **"Luminous Design"**, platform ini menawarkan pengalaman visual yang mendalam, elegan, dan futuristik.

Versi 5.0 (**Revolution Edition**) menandai transformasi total dari antarmuka pengguna, menghadirkan:

- ✅ Interaksi yang cair dan responsif
- ✅ Performa tinggi dengan optimisasi modern
- ✅ Struktur navigasi berbasis *Bento Grid* yang intuitif
- ✅ Nuansa atmosferik dan pencahayaan dinamis

<br/>

## ✨ Fitur Utama

### 🎨 Desain Luminous
Antarmuka yang hidup dengan kedalaman visual, efek glassmorphism, dan pencahayaan ambien yang bereaksi terhadap interaksi pengguna.

### 🧩 Lima Divisi Kreativitas

| Divisi | Deskripsi |
|--------|-----------|
| **🖼️ Grafis** | Galeri visual untuk seni digital, UI/UX, dan ilustrasi |
| **💻 Coding** | Showcase untuk rekayasa perangkat lunak dan eksperimen kode |
| **🎬 Video** | Teater sinematik untuk karya gambar bergerak |
| **✍️ Menulis** | Ruang editorial untuk literatur dan jurnalisme |
| **😂 Meme** | Pusat budaya internet yang dinamis dan penuh humor |

### 📱 Pengalaman Pengguna Premium
- **Navigasi Bento Grid** — Menu navigasi yang modular dan visual
- **Animasi Fluid** — Transisi halaman menggunakan Framer Motion
- **Responsif Total** — Optimal di desktop, tablet, dan mobile

<br/>

## 🛠️ Tech Stack

Proyek ini dibangun di atas fondasi teknologi web modern:

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | React v19 |
| **Bahasa** | TypeScript v5.8 |
| **Build Tool** | Vite v6 |
| **Styling** | Tailwind CSS v3 (File-based Config) |
| **Animasi** | Framer Motion |
| **Routing** | React Router DOM |
| **Ikon** | Lucide React |
| **Database** | Supabase |
| **Analytics** | Vercel Analytics & Speed Insights |

<br/>

## 🚀 Memulai

### Prasyarat

Pastikan Anda telah menginstal:
- **Node.js** v18 atau lebih baru
- **npm** atau **yarn**

### Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/ardelyo/ourcreativity.git
   ```

2. **Masuk ke direktori proyek**
   ```bash
   cd ourcreativity
   ```

3. **Instal dependensi**
   ```bash
   npm install
   # atau
   yarn install
   ```

4. **Jalankan server pengembangan**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Konfigurasi Environment**
   ```bash
   cp .env.example .env
   # Edit .env dengan kredensial Supabase kamu
   ```

6. **Buka di browser**
   ```
   http://localhost:5173
   ```

> 📖 Untuk panduan setup lengkap termasuk Supabase, lihat [Panduan Setup](docs/SETUP.md)

### Perintah Tersedia

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Build untuk produksi |
| `npm run preview` | Preview build produksi |
| `npm run lint` | Menjalankan ESLint |

<br/>

## 📂 Struktur Proyek

```
ourcreativity/
│
├── 📁 components/        # Komponen UI Reusable
│   ├── BentoGrid/
│   ├── Navbar/
│   ├── CreationStudio/
│   └── ...
│
├── 📁 pages/             # Halaman Aplikasi
│   ├── Home.tsx
│   ├── Karya.tsx
│   ├── Tim.tsx
│   └── ...
│
├── 📁 lib/               # Utilities & Helpers
│   └── supabase.ts       # Supabase client
│
├── 📁 docs/              # Dokumentasi (Bahasa Indonesia)
│   ├── versions/         # Arsip Riwayat Versi
│   ├── ARSITEKTUR.md
│   ├── KOMPONEN.md
│   └── ...
│
├── 📄 App.tsx            # Komponen Root & Routing
├── 📄 index.css          # Global Styles
├── 📄 tailwind.config.ts # Konfigurasi Tailwind
├── 📄 vite.config.ts     # Konfigurasi Vite
└── 📄 README.md
```

<br/>

## 📚 Dokumentasi

Dokumentasi teknis lengkap tersedia dalam **Bahasa Indonesia**:

| Dokumen | Deskripsi |
|---------|-----------|
| 🚀 [Panduan Setup](docs/SETUP.md) | **MULAI DARI SINI** - Install & konfigurasi |
| 🗄️ [Database](docs/DATABASE.md) | Schema & query Supabase |
| 🏗️ [Arsitektur Sistem](docs/ARSITEKTUR.md) | Struktur kode dan keputusan teknis |
| 🧩 [Komponen UI](docs/KOMPONEN.md) | Panduan penggunaan komponen |
| 📄 [Halaman](docs/HALAMAN.md) | Detail implementasi setiap halaman |
| 🚀 [Deployment](docs/PANDUAN_DEPLOYMENT.md) | Panduan peluncuran ke produksi |
| 🤝 [Kontribusi](docs/KONTRIBUSI.md) | Standar kode dan alur kerja |
| 📝 [Catatan Pengembang](docs/CATATAN_PENGEMBANG.md) | Catatan teknis dan TODO |
| 📜 [Riwayat Versi](docs/versions/RIWAYAT_VERSI_LENGKAP.md) | Sejarah evolusi proyek |

<br/>

## 🤝 Kontribusi

Kontribusi sangat kami hargai! Untuk berkontribusi:

1. Fork repositori ini
2. Buat branch fitur (`git checkout -b fitur/FiturBaru`)
3. Commit perubahan (`git commit -m 'Menambahkan FiturBaru'`)
4. Push ke branch (`git push origin fitur/FiturBaru`)
5. Buat Pull Request

> 📖 Baca [Panduan Kontribusi](docs/KONTRIBUSI.md) untuk informasi lebih detail.

<br/>

## 👥 Tim Pengembang

<table>
  <tr>
    <td align="center">
      <strong>Ardelyo</strong><br/>
      <sub>Lead Developer & Designer</sub>
    </td>
    <td align="center">
      <strong>DoctorThink</strong><br/>
      <sub>Code Refactoring & Documentation</sub>
    </td>
  </tr>
</table>

<br/>

## ⚠️ Penggunaan Brand & Lisensi

### 📝 Penting Dibaca!

**OurCreativity adalah proyek open source untuk edukasi**, dengan aturan sederhana:

✅ **Kode: Bebas dipakai** (MIT License)
- Gratis untuk belajar, modifikasi, dan pakai di project sendiri
- Boleh untuk komersial
- Boleh fork dan distribute

⚠️ **Brand: Dilindungi**
- **JANGAN pakai** nama "OurCreativity" untuk website/project kamu
- **JANGAN copy** logo dan identitas visual kami
- Tujuan: Menghindari kebingungan di komunitas

> 📖 **Baca detail lengkap:** [BRAND_USAGE.md](./BRAND_USAGE.md) (Bahasa Indonesia, mudah dipahami!)

<br/>

## 📄 Lisensi


```
Hak Cipta © 2025 OurCreativity

Proyek ini dilisensikan di bawah Lisensi MIT.
Lihat file LICENSE untuk informasi lebih lanjut.
```

<br/>

---

<div align="center">

**Dibuat dengan ❤️ dan ☕ oleh Tim OurCreativity Edisi Coding**

*"Merangkai Imajinasi Kita."*

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/ardelyo/ourcreativity?style=social)](https://github.com/ardelyo/ourcreativity)

</div>
