# Panduan Kontribusi

> Terima kasih telah tertarik berkontribusi pada OurCreativities!

## Selamat Datang

Kami sangat menghargai kontribusi dari komunitas. Dokumen ini memberikan panduan untuk berkontribusi pada proyek OurCreativities.

## Cara Berkontribusi

Ada beberapa cara untuk berkontribusi:

**Kontribusi Kode:**
- Perbaiki bug
- Tambah fitur baru
- Tingkatkan performa
- Refactor kode

**Kontribusi Non-Kode:**
- Tulis atau perbaiki dokumentasi
- Laporkan bug
- Sarankan fitur baru
- Perbaikan desain
- Pengujian (*Testing*)

## Memulai

### Persiapan Lingkungan Pengembangan

**Langkah 1: Fork Repository**
```bash
# Fork di GitHub, kemudian clone
git clone https://github.com/USERNAME_ANDA/ourcreativities.git
cd ourcreativities
```

**Langkah 2: Instal Dependensi**
```bash
npm install
```

**Langkah 3: Buat Branch**
```bash
git checkout -b feature/nama-fitur-anda
# atau
git checkout -b fix/deskripsi-bug
```

**Langkah 4: Jalankan Server Pengembangan**
```bash
npm run dev
```

### Alur Kerja Pengembangan

**1. Buat Perubahan**
- Edit file
- Uji perubahan secara lokal
- Pastikan tidak ada error

**2. Uji Secara Menyeluruh**
- Uji di browser desktop
- Uji di browser seluler
- Periksa desain responsif
- Verifikasi animasi berjalan lancar

**3. Commit Perubahan**
```bash
git add .
git commit -m "feat: tambah fitur baru"
```

**4. Push ke Fork Anda**
```bash
git push origin feature/nama-fitur-anda
```

**5. Buat Pull Request**
- Buka GitHub
- Klik "New Pull Request"
- Isi deskripsi
- Kirim (*Submit*)

---

## Panduan Gaya Kode

### Prinsip Umum

**Konsistensi:**
Ikuti gaya yang sudah ada di basis kode (*codebase*).

**Kejelasan:**
Kode harus mudah dibaca dan dipahami.

**Kesederhanaan:**
Pilih solusi sederhana daripada yang rumit.

### TypeScript

**Gunakan Anotasi Tipe:**
```typescript
// Bagus
const name: string = "OurCreativities";
function greet(name: string): string {
  return `Halo, ${name}`;
}

// Hindari
const name = "OurCreativities"; // any implisit
function greet(name) { // tanpa tipe
  return `Halo, ${name}`;
}
```

**Interface daripada Type:**
```typescript
// Disukai
interface User {
  name: string;
  email: string;
}

// Gunakan type untuk union/primitif
type Status = 'active' | 'inactive';
```

### Komponen React

**Komponen Fungsional:**
```typescript
// Bagus - Ekspor bernama
export const ComponentName = () => {
  return <div>Konten</div>;
};

// Hindari ekspor default untuk komponen
```

**Interface Props:**
```typescript
interface ComponentProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const Component = ({ title, onClick, children }: ComponentProps) => {
  // Kode komponen
};
```

### Konvensi Penamaan

**File:**
- Komponen: `PascalCase.tsx`
- Utilitas: `camelCase.ts`
- Halaman: `PascalCase.tsx`

**Variabel:**
```typescript
// camelCase untuk variabel
const userName = "John";
const isActive = true;

// PascalCase untuk Komponen
const UserCard = () => {};

// UPPERCASE untuk konstanta
const API_URL = "https://api.example.com";
```

**Fungsi:**
```typescript
// camelCase
function fetchData() {}
const handleClick = () => {};

// Penangan acara: handle*
const handleSubmit = () => {};
const handleChange = () => {};
```

### CSS/Tailwind

**Urutan Konsisten:**
```typescript
// Tata Letak → Spasi → Tipografi → Visual → Efek
className="flex items-center gap-4 px-6 py-3 text-lg font-bold bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
```

**Desain Responsif:**
```typescript
// Mobile-first
className="text-sm md:text-base lg:text-lg"
```

**Kelas Kustom:**
Gunakan utilitas Tailwind, hindari CSS kustom kecuali diperlukan.

### Organisasi File

**Urutan Impor:**
```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. Pustaka eksternal
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

// 3. Komponen internal
import { Navbar } from './components/Navbar';

// 4. Utilitas/helper
import { formatDate } from './utils';

// 5. Tipe
import type { User } from './types';
```

---

## Pesan Commit

### Format

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipe>(<lingkup>): <subjek>

<body>

<footer>
```

### Tipe

- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi
- `style`: Gaya kode (format, tanpa perubahan logika)
- `refactor`: Refactoring kode
- `perf`: Peningkatan performa
- `test`: Menambahkan tes
- `chore`: Proses build, dependensi

### Contoh

```bash
feat(navbar): tambah animasi menu seluler

fix(karya): perbaiki masalah pemuatan gambar di seluler

docs(readme): perbarui instruksi instalasi

style(components): format kode dengan prettier

refactor(hero): sederhanakan logika animasi

perf(images): implementasikan lazy loading

test(navbar): tambah unit test untuk navigasi

chore(deps): update react ke v19.2.0
```

### Praktik Terbaik

**LAKUKAN:**
- Gunakan kalimat perintah ("tambah" bukan "menambahkan")
- Pertahankan baris subjek di bawah 50 karakter
- Huruf besar di awal kalimat
- Tidak ada titik di akhir
- Jelaskan "apa" dan "mengapa" di bagian body

**JANGAN:**
- Pesan umum seperti "perbaiki bug" atau "update"
- Menggabungkan perubahan yang tidak terkait dalam satu commit
- Commit kode yang rusak

---

## Panduan Pull Request

### Sebelum Mengirim

**Daftar Periksa:**
- [ ] Kode mengikuti panduan gaya
- [ ] Tidak ada error TypeScript
- [ ] Diuji di berbagai browser
- [ ] Diuji desain responsif
- [ ] Dokumentasi diperbarui (jika perlu)
- [ ] Pesan commit mengikuti konvensi

### Judul PR

Format sama seperti pesan commit:
```
feat(component): tambah fitur baru
```

### Deskripsi PR

**Template:**
```markdown
## Deskripsi
Deskripsi singkat perubahan

## Jenis Perubahan
- [ ] Perbaikan bug
- [ ] Fitur baru
- [ ] Pembaruan dokumentasi
- [ ] Peningkatan performa

## Pengujian
- Diuji di Chrome, Firefox, Safari
- Pengujian seluler dilakukan di iOS/Android
- Tidak ada error konsol

## Tangkapan Layar (jika ada)
[Tambahkan tangkapan layar di sini]

## Masalah Terkait
Closes #123
```

### Proses Tinjauan

**Jadwal:**
- Tinjauan awal: 1-3 hari
- Umpan balik dimasukkan: berkelanjutan
- Merge: setelah disetujui

**Apa yang Kami Cari:**
- Kualitas kode
- Dampak performa
- Perubahan yang merusak (*Breaking changes*)
- Kelengkapan dokumentasi

---

## Laporan Bug

### Cara Melapor

Gunakan GitHub Issues dengan template:

```markdown
**Deskripsi Bug**
Deskripsi jelas tentang bug

**Langkah untuk Mereproduksi**
1. Pergi ke '...'
2. Klik pada '...'
3. Gulir ke '...'
4. Lihat error

**Perilaku yang Diharapkan**
Apa yang seharusnya terjadi

**Perilaku Sebenarnya**
Apa yang sebenarnya terjadi

**Tangkapan Layar**
Jika ada

**Lingkungan**
- OS: [mis. Windows 11]
- Browser: [mis. Chrome 120]
- Ukuran layar: [mis. 1920x1080]

**Konteks Tambahan**
Informasi relevan lainnya
```

---

## Permintaan Fitur

### Cara Menyarankan

Buat GitHub Issue dengan template:

```markdown
**Deskripsi Fitur**
Deskripsi jelas tentang fitur

**Masalah yang Dipecahkan**
Masalah apa yang diatasi ini?

**Solusi yang Diusulkan**
Bagaimana Anda membayangkan ini bekerja?

**Alternatif yang Dipertimbangkan**
Cara lain untuk memecahkan ini

**Konteks Tambahan**
Mockup, contoh, referensi
```

---

## Tinjauan Kode

### Untuk Kontributor

**Bersabar:**
Tinjauan mungkin memakan waktu.

**Terbuka:**
Terima umpan balik secara konstruktif.

**Responsif:**
Tanggapi komentar tinjauan dengan segera.

### Untuk Peninjau

**Spesifik:**
Tunjukkan masalah yang tepat dan sarankan perbaikan.

**Konstruktif:**
Bingkai umpan balik secara positif.

**Tepat Waktu:**
Tinjau PR dalam waktu yang wajar.

---

## Pengujian

### Pengujian Manual

**Daftar Periksa:**
- [ ] Fitur berfungsi sebagaimana mestinya
- [ ] Tidak ada error konsol
- [ ] Responsif di seluler
- [ ] Responsif di tablet
- [ ] Berjalan di Chrome
- [ ] Berjalan di Firefox
- [ ] Berjalan di Safari
- [ ] Animasi halus
- [ ] Tidak ada regresi performa

### Pengujian Otomatis (Masa Depan)

Ketika kerangka kerja pengujian ditambahkan:

```bash
# Jalankan tes
npm run test

# Jalankan dengan cakupan
npm run test:coverage
```

---

## Dokumentasi

### Kapan Memperbarui Dokumen

**Selalu Perbarui Ketika:**
- Menambahkan komponen baru
- Mengubah API komponen
- Menambahkan halaman baru
- Mengubah struktur proyek
- Menambahkan dependensi

### Lokasi Dokumen

- Umum: `README.md`
- Arsitektur: `docs/ARSITEKTUR.md`
- Komponen: `docs/KOMPONEN.md`
- Halaman: `docs/HALAMAN.md`
- Deployment: `docs/PANDUAN_DEPLOYMENT.md`
- File ini: `docs/KONTRIBUSI.md`

---

## Komunitas

### Kode Etik

**Hormat:**
Perlakukan semua orang dengan hormat.

**Inklusif:**
Sambut perspektif yang beragam.

**Kolaboratif:**
Bekerja sama secara konstruktif.

**Profesional:**
Jaga diskusi tetap profesional.

### Komunikasi

**Pertanyaan:**
- GitHub Discussions (disarankan)
- GitHub Issues (untuk bug/fitur)

**Pembaruan:**
- Pantau repositori untuk notifikasi
- Cek changelog.md untuk pembaruan

---

## Pengakuan

### Kontributor

Semua kontributor akan terdaftar di:
- README.md
- CONTRIBUTORS.md (masa depan)

### Hall of Fame

Kontributor signifikan mungkin ditampilkan di:
- Dokumentasi proyek
- Catatan rilis
- Sebutan media sosial

---

## Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah lisensi yang sama dengan proyek.

---

## Pertanyaan?

Jika ada pertanyaan tentang kontribusi:

1. Cek dokumentasi ini
2. Cari issue yang ada
3. Buat diskusi baru
4. Hubungi pemelihara

---

**Terima kasih telah berkontribusi pada OurCreativities!**

Setiap kontribusi, sekecil apapun, sangat berarti untuk proyek ini.

---

**Terakhir Diperbarui:** November 2025  
**Versi:** 5.0  
**Pemelihara:** Tim OurCreativities
