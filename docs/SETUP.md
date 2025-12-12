# 🚀 Panduan Setup

> **English:** This guide provides step-by-step setup instructions for running OurCreativity locally. You'll need Node.js 18+, npm/yarn, and a free Supabase account. Follow the sections below for database configuration and environment setup.

---

Panduan lengkap untuk menjalankan OurCreativity di lingkungan lokal.

## 📋 Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** v9+ atau **yarn** v1.22+
- Akun **Supabase** (gratis)

## 🔧 Langkah-langkah Setup

### 1. Clone Repository

```bash
git clone https://github.com/ardelyo/ourcreativity.git
cd ourcreativity
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Supabase

#### a. Buat Project Baru

1. Pergi ke [supabase.com](https://supabase.com) dan login
2. Klik **"New Project"**
3. Isi nama project (contoh: `ourcreativity`)
4. Pilih region terdekat (contoh: `Southeast Asia (Singapore)`)
5. Tunggu hingga project siap (~2 menit)

#### b. Setup Database Schema

1. Di dashboard Supabase, buka **SQL Editor**
2. Buat query baru
3. Copy isi file `supabase_schema.sql` dan paste ke editor
4. Klik **Run** untuk menjalankan

#### c. (Opsional) Tambahkan Data Contoh

Jika ingin data contoh:
```sql
-- Jalankan di SQL Editor
-- Pilih salah satu file seed:
-- - supabase_seed.sql (data umum)
-- - supabase_seed_refocused.sql (data minimal)
```

### 4. Konfigurasi Environment

```bash
# Copy template environment
cp .env.example .env
```

Edit file `.env` dengan kredensial Supabase kamu:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Cara Mendapatkan Kredensial:

1. Buka project di [Supabase Dashboard](https://supabase.com/dashboard)
2. Pergi ke **Settings** → **API**
3. Copy **Project URL** → paste ke `VITE_SUPABASE_URL`
4. Copy **anon public** key → paste ke `VITE_SUPABASE_ANON_KEY`

> ⚠️ **PENTING**: Jangan pernah commit file `.env` ke git!

### 5. Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka browser di: **http://localhost:5173**

## ✅ Verifikasi Setup

Jika setup berhasil, kamu akan melihat:
- ✅ Homepage dengan hero section
- ✅ Navigasi berfungsi
- ✅ Data ter-load dari Supabase (di halaman Karya, Pengumuman, dll)

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solusi**: Pastikan file `.env` ada dan berisi kredensial yang benar.

### Error: "Failed to fetch" atau data tidak muncul

**Solusi**: 
1. Pastikan URL Supabase benar
2. Cek apakah database schema sudah dijalankan
3. Verifikasi RLS policies membolehkan public read

### Error saat npm install

**Solusi**:
```bash
# Hapus cache dan coba lagi
rm -rf node_modules package-lock.json
npm install
```

## 📁 Struktur File Environment

```
ourcreativity/
├── .env              # Kredensial lokal (JANGAN commit!)
├── .env.example      # Template untuk developer baru
└── .gitignore        # Mengecualikan .env dari git
```

## 🔗 Link Berguna

- [Dokumentasi Supabase](https://supabase.com/docs)
- [Dokumentasi Vite](https://vitejs.dev)
- [Dokumentasi React](https://react.dev)
