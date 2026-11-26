# Panduan Host Event Divisi Koding

Panduan untuk host yang mengajak member mencari bug dan memperbaiki website OurCreativity lewat GitHub, termasuk sistem bayaran dan cara melacaknya.

Hasil review repo (tanggal 2026-10-26) ada di bagian 1. Setup dan alur kerja ada di bagian 2 sampai 6.

---

## 1. Hasil Review: Apakah Repo Siap?

**Kesimpulan: cukup siap untuk event kecil dan terkontrol, belum siap untuk event terbuka berhadiah uang.** Ada 4 hal yang sebaiknya selesai dulu (bagian 1.3).

### 1.1 Yang sudah bagus
- Build produksi lolos (`npm run build`, sekitar 8 detik).
- `tsc --noEmit` bersih (sebelumnya 1 error di `MediaUploader.tsx`, sudah diperbaiki di branch ini).
- Dokumentasi lengkap: README, CONTRIBUTING, SECURITY, CODEOWNERS, template PR dan issue, 15 file di `docs/`.
- Tidak ada secret yang ter-commit. `.env` sudah di `.gitignore`. Hanya `VITE_SUPABASE_*` (anon key, memang publik) yang dipakai di client.
- Kode sudah di-split per halaman (lazy chunks).

### 1.2 Masalah yang ditemukan

| # | Severity | Temuan | Lokasi |
|---|----------|--------|--------|
| 1 | **High** | Tidak ada CI dan tidak ada test. PR tidak diverifikasi otomatis. (CI dasar sudah ditambahkan di `.github/workflows/ci.yml`.) | repo |
| 2 | **High** | Stored XSS. Konten karya user dirender lewat `dangerouslySetInnerHTML` tanpa sanitasi (tidak ada DOMPurify). | `pages/Karya.tsx:491,960,1143`, `pages/Profile.tsx:328,662` |
| 3 | **High** | Iframe kode user memakai `sandbox="allow-scripts allow-same-origin"` lewat `srcDoc`. Kombinasi ini membuat sandbox tidak efektif: script user bisa membaca `localStorage` induk, termasuk token sesi Supabase. | `pages/Karya.tsx:510,896,1164`, `components/CreationStudio/ControlCenter/InteractiveSandbox.tsx:191` |
| 4 | **High** | Skema tabel `profiles` dan policy RLS untuk UPDATE-nya tidak ada di `supabase/migrations`. Tidak bisa diverifikasi dari repo apakah user bisa mengubah `role` jadi `admin` sendiri. Cek langsung di Supabase. | `supabase/migrations/` |
| 5 | Medium | `npm audit --omit=dev`: 12 kerentanan (11 high, 1 moderate) pada dependency transitif (`ws`, `underscore`). | `package.json` |
| 6 | Medium | Policy `works_update_owner` tidak punya `WITH CHECK`. Owner bisa mengubah kolom sensitif (misalnya `author_id`, atau flag approve jika ada). | `supabase/migrations/20251226_performance_cleanup.sql:59` |
| 7 | Medium | Sekitar 97 `any` dan 96 `console.*`. File besar: `Karya.tsx` 1327 baris, `Studio.tsx` 950 baris, `Profile.tsx` 884 baris. | `pages/` |
| 8 | Medium | Chunk `Studio` 627 kB (200 kB gzip), terkait Monaco dan pyodide. | build output |
| 9 | Low | Dokumentasi tidak konsisten: CONTRIBUTING menyebut `supabase_schema.sql` padahal file ada di `supabase/migrations/`; `.github/CODEOWNERS` menunjuk path lama; README memuat badge versi lama. | docs |
| 10 | Low | Data statistik di halaman Coding di-hardcode ("125 member", "99.9% uptime"). | `pages/divisions/Coding.tsx` |
| 11 | Low | File sampah di root (`build_log*.txt`, `tsc_*.txt`). Sudah dihapus di branch ini. | root |

### 1.3 Wajib sebelum event berhadiah uang
1. **Cek RLS `profiles` di dashboard Supabase** (temuan 4), lalu simpan skemanya ke `supabase/migrations`. Pastikan user biasa tidak bisa meng-update kolom `role`.
2. **Tambah sanitasi HTML** dengan DOMPurify di semua `dangerouslySetInnerHTML` (temuan 2).
3. **Hapus `allow-same-origin`** dari iframe kode user (temuan 3). Hasil render tetap jalan dengan `allow-scripts` saja.
4. **Aktifkan branch protection** di `main` (bagian 2.2).

Temuan 2, 3, 4 ini sebaiknya jadi **bug pertama di papan event**. Karena severity-nya tinggi, kerjakan sendiri atau pilih kontributor yang dipercaya. Jangan umumkan detailnya di issue publik sebelum diperbaiki (lihat `SECURITY.md`).

---

## 2. Setup Awal Host (sekali saja)

### 2.1 Repo
1. Pastikan akun host punya akses **Maintain** atau **Admin** ke `OurCreativity/ourcreativity`.
2. Merge branch ini agar CI, template issue, dan panduan ini aktif.
3. Buat **Supabase project terpisah untuk staging/event**. Jangan beri kontributor akses ke database produksi. Jalankan semua file di `supabase/migrations/` ke project itu.

### 2.2 Branch protection (Settings → Branches → Add rule untuk `main`)
- Require a pull request before merging, dengan minimal 1 approval.
- Require review from Code Owners.
- Require status checks to pass: pilih `check` (dari `ci.yml`).
- Dismiss stale approvals saat ada commit baru.
- Larang force-push dan penghapusan branch.

### 2.3 Label (Issues → Labels)
```
bug, koding, good-first-issue, needs-triage, confirmed, duplicate, invalid, wontfix
sev:critical, sev:high, sev:medium, sev:low
bounty:S, bounty:M, bounty:L, bounty:XL
paid
```

### 2.4 GitHub Project (board)
Buat Project (Table + Board) bernama "Event Koding". Kolom status: `Triage → Open → Claimed → In Review → Merged → Paid`. Tambah field: `Assignee`, `Severity`, `Points`, `Rupiah`, `Bulan`.

### 2.5 Keamanan repo
- Aktifkan **Dependabot alerts**, **Secret scanning**, dan **Private vulnerability reporting** (Settings → Code security).
- Kontributor bekerja lewat **fork + PR**, bukan push langsung. Jangan beri akses write ke member biasa.

---

## 3. Alur Event (dari sisi host)

### Fase A: Persiapan (H-7)
- Siapkan 15 sampai 30 issue awal: bug yang sudah kamu ketahui, tugas `good-first-issue`, dan improvement (aksesibilitas, performa, refactor `Karya.tsx`, test). Beri label `sev:*` dan `bounty:*`.
- Tulis aturan dan tabel hadiah (bagian 4) di satu issue yang di-pin.
- Umumkan ke member: cara daftar, cara klaim, tenggat.

### Fase B: Onboarding member (kirim ke member)
```bash
# 1. Fork repo di GitHub, lalu:
git clone https://github.com/<username>/ourcreativity.git
cd ourcreativity
git remote add upstream https://github.com/OurCreativity/ourcreativity.git
npm ci
cp .env.example .env     # isi dengan kredensial Supabase STAGING dari host
npm run dev              # buka http://localhost:3000

# 2. Kerjakan
git checkout -b fix/<nomor-issue>-<deskripsi-singkat>
# ...ubah kode...
npx tsc --noEmit && npm run build   # wajib lolos sebelum PR
git commit -m "fix: <deskripsi> (#<nomor-issue>)"
git push origin fix/<nomor-issue>-<deskripsi-singkat>
# 3. Buka Pull Request ke OurCreativity/ourcreativity:main
```
Bagikan kredensial staging lewat pesan privat, bukan di issue atau channel publik.

### Fase C: Selama event (rutin harian, sekitar 20 menit)
1. **Triage** issue baru dengan label `needs-triage`: reproduksi bug, tentukan `sev:*` dan `bounty:*`, tandai `duplicate` atau `invalid` bila perlu.
2. **Klaim**: member komentar `/claim` atau "Saya ambil". Host meng-assign. Satu orang maksimal 2 issue aktif; klaim kadaluarsa dalam 5 hari tanpa PR.
3. **Review PR**: cek CI hijau, diff kecil dan fokus, tidak mengubah file di luar scope, tidak menyisipkan dependency baru tanpa alasan. Jalankan lokal bila perubahan menyentuh auth, RLS, atau iframe.
4. **Merge**, lalu pindahkan card ke `Merged` dan isi field `Points` dan `Rupiah`.

### Fase D: Penutupan dan payout (akhir bulan)
Lihat bagian 5.

---

## 4. Skema Bayaran

Angka di bawah hanya usulan awal. Sesuaikan dengan budget. **Tetapkan dulu total budget bulanan dan batas per orang** (misalnya maksimum 25% budget per member) sebelum diumumkan.

### 4.1 Hadiah per bug (dibayar setelah PR merge, bukan saat laporan)

| Severity | Contoh | Reward |
|----------|--------|--------|
| Critical | XSS tersimpan, eskalasi role, kebocoran data | Rp 150.000 sampai 300.000 |
| High | Fitur utama rusak, crash halaman | Rp 75.000 |
| Medium | Fitur rusak sebagian, bug di mobile | Rp 40.000 |
| Low | Typo, visual minor, dokumentasi | Rp 15.000 |

### 4.2 Hadiah improvement

| Ukuran | Contoh | Reward |
|--------|--------|--------|
| S | refactor kecil, alt text, perbaikan docs | Rp 20.000 |
| M | test untuk satu modul, optimasi satu halaman | Rp 50.000 |
| L | pecah `Karya.tsx` jadi komponen, fitur kecil | Rp 100.000 |
| XL | fitur besar, infrastruktur test | Rp 200.000 atau lebih |

Tambah bonus Rp 10.000 sampai 25.000 bila disertai test atau dokumentasi.

### 4.3 Aturan wajib
- Hanya **PR yang di-merge** yang dibayar.
- Laporan duplikat: hanya yang pertama (waktu issue) dibayar.
- Severity ditentukan host dan bersifat final.
- Bug keamanan dilaporkan privat lewat Security Advisory, dibayar setelah patch merge.
- Dilarang: bug yang sengaja dibuat lalu "ditemukan", PR spam/otomatis tanpa pemahaman, menyalin PR orang lain, menguji ke produksi atau merusak data. Pelanggaran berarti diskualifikasi.
- Gunakan akun GitHub asli, satu orang satu akun.

---

## 5. Tracking dan Pembayaran

**Prinsip: GitHub adalah sumber kebenaran, spreadsheet hanya buku kas.** Tidak perlu membangun sistem sendiri dulu.

### 5.1 Pelacakan di GitHub
- Tiap issue punya label `sev:*` atau `bounty:*`. Saat PR merge, tambahkan label `paid` hanya setelah uang benar-benar dikirim.
- Di PR, tulis `Closes #<issue>` agar issue otomatis tertutup dan tertaut ke pembuatnya.
- Di GitHub Project, field `Rupiah` diisi saat merge. Dari view Table, filter per `Bulan`, lalu grup per `Assignee` untuk total per orang.

### 5.2 Spreadsheet ledger (Google Sheets)
Buat satu sheet dengan kolom:

| Tanggal merge | Username GitHub | Nama asli | Issue | PR | Kategori | Severity/Size | Rupiah | Metode bayar | Status (Belum/Lunas) | Tgl bayar | Bukti transfer |
|---|---|---|---|---|---|---|---|---|---|---|---|

Tab ke-2 berisi rekap per orang memakai `SUMIFS` per bulan. Data pribadi (nama asli, rekening) disimpan di sheet privat milik host, **jangan** di repo.

### 5.3 Tarik data otomatis (opsional)
Daftar PR merge sebulan dapat diambil dengan GitHub CLI:
```bash
gh pr list --repo OurCreativity/ourcreativity --state merged \
  --search "merged:2026-11-01..2026-11-30" \
  --json number,title,author,mergedAt,labels,closingIssuesReferences \
  --limit 200 > merged.json
```
Ubah ke CSV lalu tempel ke ledger. Kalau volume sudah besar, baru pertimbangkan membuat workflow GitHub Actions atau tabel `payouts` di Supabase.

### 5.4 Siklus payout
1. **Tanggal 1 tiap bulan**: ekspor PR merge bulan lalu, cocokkan dengan ledger.
2. **Tanggal 1 sampai 3**: umumkan rekap di issue pin ("Rekap November"), beri waktu 3 hari untuk keberatan.
3. **Tanggal 5**: transfer (bank, e-wallet). Catat bukti, isi `Lunas`, tambah label `paid`.
4. Minimum payout, misalnya Rp 25.000. Di bawah itu, saldo digulung ke bulan berikutnya.

### 5.5 Hal non-teknis yang perlu diputuskan
- **Sumber dana dan transparansi**: dari kas pribadi, kas komunitas, atau donasi? Umumkan total budget agar tidak ada ekspektasi berlebihan.
- **Status pembayaran**: ini bounty lepas, bukan gaji. Tulis jelas di aturan bahwa member bukan karyawan, dan hadiah bisa berubah atau dihentikan dengan pemberitahuan.
- **Pajak dan legal**: konsultasikan bila nilai total besar atau rutin. Bagian ini bukan nasihat hukum.
- **Lisensi kontribusi**: repo memakai MIT. Cantumkan di aturan bahwa kontribusi berlisensi sama.
- **Peserta di bawah umur**: pastikan ada persetujuan orang tua bila relevan.

---

## 6. Checklist Host

**Sebelum event**
- [ ] Merge branch ini (CI, template, panduan)
- [ ] Cek RLS `profiles` dan simpan skemanya ke migrations
- [ ] Sanitasi `dangerouslySetInnerHTML` dan hapus `allow-same-origin`
- [ ] Branch protection `main` aktif
- [ ] Supabase staging siap, kredensial dibagikan privat
- [ ] Label, Project board, dan ledger siap
- [ ] 15 sampai 30 issue terlabel
- [ ] Budget dan aturan diumumkan

**Selama event**
- [ ] Triage harian
- [ ] Review PR maksimal 48 jam
- [ ] Bersihkan klaim kadaluarsa

**Setelah event**
- [ ] Rekap, payout, dan label `paid`
- [ ] Update `CHANGELOG.md` dan `AUTHORS.md` (kredit kontributor)
- [ ] Retrospektif: apa yang berhasil, apa yang perlu diubah di event berikutnya
