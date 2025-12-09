# Panduan Deployment

> Langkah-langkah deploy OurCreativities ke produksi

## Ringkasan

OurCreativities adalah aplikasi React statis yang dapat di-deploy ke berbagai platform hosting modern. Panduan ini mencakup deployment ke Vercel, Netlify, dan alternatif lainnya.

## Prasyarat

**Yang Dibutuhkan:**
- Node.js 18+ terinstal
- Repositori Git
- Akun di platform hosting pilihan
- Kode sumber sudah di-commit

## Build Produksi

### Build Lokal

**Langkah 1: Instal Dependensi**
```bash
npm install
```

**Langkah 2: Jalankan Build Produksi**
```bash
npm run build
```

**Output:**
- File build di folder `dist/`
- Teroptimasi dan diminifikasi
- Siap untuk deployment

**Langkah 3: Uji Build Produksi**
```bash
npm run preview
```

Buka `http://localhost:4173` untuk pratinjau.

### Konfigurasi Build

**Vite Config:**
File `vite.config.ts` sudah dikonfigurasi untuk produksi optimal.

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  }
})
```

## Platform Deployment

### Vercel (Disarankan)

Vercel adalah platform terbaik untuk aplikasi React dengan deployment tanpa konfigurasi (*zero-config*).

**Metode 1: Deploy via CLI**

**Langkah 1: Instal Vercel CLI**
```bash
npm i -g vercel
```

**Langkah 2: Login**
```bash
vercel login
```

**Langkah 3: Deploy**
```bash
# Pratinjau Pengembangan
vercel

# Deployment Produksi
vercel --prod
```

**Metode 2: Deploy via GitHub**

**Langkah 1:** Push kode ke repositori GitHub

**Langkah 2:** Buka [vercel.com](https://vercel.com)

**Langkah 3:** Klik "New Project"

**Langkah 4:** Impor repositori GitHub

**Langkah 5:** Konfigurasi:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Langkah 6:** Klik "Deploy"

**Deployment Otomatis:**
- Setiap push ke branch main = auto deploy ke produksi
- Pull requests = preview deployments
- HTTPS Otomatis
- Dukungan domain kustom

**Variabel Lingkungan:**
Saat ini tidak ada env vars, tapi untuk masa depan:
```
Dashboard → Project → Settings → Environment Variables
```

---

### Netlify

Alternatif populer dengan fitur serupa Vercel.

**Metode 1: Netlify CLI**

**Langkah 1: Instal Netlify CLI**
```bash
npm i -g netlify-cli
```

**Langkah 2: Login**
```bash
netlify login
```

**Langkah 3: Inisialisasi**
```bash
netlify init
```

**Langkah 4: Deploy**
```bash
# Build dan deploy
netlify deploy --prod
```

**Metode 2: Integrasi Git**

**Langkah 1:** Push kode ke GitHub/GitLab/Bitbucket

**Langkah 2:** Login ke [netlify.com](https://netlify.com)

**Langkah 3:** Klik "New site from Git"

**Langkah 4:** Hubungkan repositori

**Langkah 5:** Pengaturan Build:
```
Build command: npm run build
Publish directory: dist
```

**Langkah 6:** Klik "Deploy site"

**File Konfigurasi:**

Buat `netlify.toml` di root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Aturan pengalihan penting untuk routing SPA!

---

### GitHub Pages

Opsi hosting gratis via GitHub.

**Langkah 1: Instal gh-pages**
```bash
npm install --save-dev gh-pages
```

**Langkah 2: Perbarui package.json**
```json
{
  "homepage": "https://username.github.io/ourcreativities",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Langkah 3: Perbarui vite.config.ts**
```typescript
export default defineConfig({
  base: '/ourcreativities/', // nama repositori
  // ... konfigurasi lainnya
})
```

**Langkah 4: Deploy**
```bash
npm run deploy
```

**Catatan:** Perlu update Router dari MemoryRouter ke BrowserRouter + basename:
```typescript
<BrowserRouter basename="/ourcreativities">
```

---

### Cloudflare Pages

Platform modern dengan komputasi tepi (*edge computing*).

**Langkah 1:** Push kode ke GitHub

**Langkah 2:** Login ke [pages.cloudflare.com](https://pages.cloudflare.com)

**Langkah 3:** Buat proyek baru

**Langkah 4:** Hubungkan repositori

**Langkah 5:** Pengaturan Build:
```
Build command: npm run build
Build output directory: dist
```

**Langkah 6:** Deploy

**Fitur:**
- CDN Global
- SSL Otomatis
- Bandwidth tak terbatas gratis
- Jaringan tepi cepat

---

## Domain Kustom

### Domain Kustom Vercel

**Langkah 1:** Pergi ke Project Settings → Domains

**Langkah 2:** Tambahkan domain Anda (contoh: `ourcreativity.com`)

**Langkah 3:** Konfigurasi DNS:

**Opsi A - Nameserver Vercel:**
Perbarui di registrar domain ke nameserver Vercel.

**Opsi B - CNAME:**
```
CNAME record:
www → cname.vercel-dns.com
```

**Langkah 4:** Tunggu propagasi DNS (maks 48 jam)

### Domain Kustom Netlify

**Langkah 1:** Site Settings → Domain management

**Langkah 2:** Tambahkan domain kustom

**Langkah 3:** Konfigurasi DNS:
```
A record:
@ → 75.2.60.5

CNAME:
www → your-site.netlify.app
```

---

## Variabel Lingkungan

Untuk pengembangan masa depan dengan env vars:

**Pengembangan (.env.local):**
```bash
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_key
```

**Produksi:**

**Vercel:**
Dashboard → Settings → Environment Variables

**Netlify:**
Site Settings → Build & Deploy → Environment

**Akses dalam Kode:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Pipeline CI/CD

### GitHub Actions (Opsional)

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Optimasi Performa

### Daftar Periksa Pra-Deployment

**Optimasi Kode:**
- [ ] Hapus console.logs
- [ ] Hapus dependensi yang tidak digunakan
- [ ] Optimalkan gambar
- [ ] Aktifkan minifikasi
- [ ] Pemisahan kode diimplementasikan

**Optimasi Build:**
```bash
# Analisis ukuran bundle
npm run build -- --mode production

# Cek output build
ls -lh dist/
```

### Konfigurasi CDN

**Aset:**
Gunakan CDN untuk aset statis (gambar, font).

**Header Caching:**

**Vercel (ditangani otomatis):**
- Aset statis: Cache 1 tahun
- HTML: Tanpa cache

**Netlify (file _headers):**
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

---

## Pemantauan

### Integrasi Analitik

**Google Analytics:**
```html
<!-- Di index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```typescript
// Di App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Pelacakan Kesalahan

**Sentry (Disarankan):**
```bash
npm install @sentry/react
```

```typescript
// Di index.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  environment: "production",
});
```

---

## Pemecahan Masalah

### Masalah Umum

**Masalah: Rute mengembalikan 404**

**Solusi:** Tambahkan aturan pengalihan untuk SPA.

Netlify (file _redirects):
```
/*    /index.html   200
```

Vercel (vercel.json):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Masalah: CSS tidak dimuat**

**Solusi:** Cek base path di `vite.config.ts`

**Masalah: Gambar rusak**

**Solusi:** Gunakan path absolut atau impor gambar

```typescript
// Bagus
import logo from './assets/logo.png'
<img src={logo} />

// Atau
<img src="/assets/logo.png" />
```

**Masalah: Build gagal**

**Cek:**
- Kompatibilitas versi Node
- Dependensi terinstal
- Error TypeScript
- Perintah build benar

---

## Strategi Rollback

### Vercel

**Via Dashboard:**
1. Pergi ke Deployments
2. Temukan deployment yang berfungsi sebelumnya
3. Klik "..." → "Promote to Production"

**Via CLI:**
```bash
vercel rollback
```

### Netlify

**Via Dashboard:**
1. Pergi ke Deploys
2. Temukan deploy sebelumnya
3. Klik "Publish deploy"

---

## Keamanan

### HTTPS

- Otomatis pada Vercel/Netlify
- Sertifikat SSL gratis
- Pembaruan otomatis

### Header Keamanan

**Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## Daftar Periksa Pra-Peluncuran

**Teknis:**
- [ ] Build berhasil secara lokal
- [ ] Tidak ada error TypeScript
- [ ] Tidak ada error konsol
- [ ] Semua tautan berfungsi
- [ ] Gambar dimuat dengan benar
- [ ] Responsif seluler
- [ ] Performa teroptimasi

**SEO:**
- [ ] Meta tag dikonfigurasi
- [ ] Sitemap dibuat
- [ ] Robots.txt dikonfigurasi
- [ ] Analitik disiapkan

**Deployment:**
- [ ] Platform dikonfigurasi
- [ ] Domain terhubung
- [ ] SSL berfungsi
- [ ] Pemantauan disiapkan
- [ ] Pelacakan kesalahan aktif

---

**Terakhir Diperbarui:** November 2025  
**Rekomendasi Platform:** Vercel  
**Pemelihara:** Tim OurCreativities
