# Rencana Eksekusi Event Koding

Pelengkap `HOST_KODING.md`. Dokumen ini berisi urutan kerja, daftar issue awal, dan teks siap tempel. Angka Rupiah dan tanggal adalah usulan, sesuaikan dengan budget dan kalendermu.

## 1. Timeline

| Minggu | Fokus | Hasil yang harus ada |
|--------|-------|----------------------|
| **M-2** (persiapan teknis) | Tutup 4 blocker keamanan | Issue #S1 sampai #S4 (bagian 2) selesai dan merge, CI hijau, branch protection aktif |
| **M-1** (persiapan event) | Setup operasional | Supabase staging, label, Project board, ledger, 20+ issue terlabel, aturan di-pin, pendaftaran dibuka |
| **M0 minggu 1** (pilot) | Uji dengan 3 sampai 5 orang tepercaya | Alur klaim, review, merge, dan ledger terbukti jalan. Catat gesekan, perbaiki aturan |
| **M0 minggu 2 sampai 4** (event penuh) | Buka untuk semua member Koding | Triage dan review harian, rekap mingguan di issue pin |
| **M+1 tanggal 1 sampai 5** | Payout dan retrospektif | Ledger lunas, label `paid`, kredit di `AUTHORS.md` dan `CHANGELOG.md` |

Jangan buka event penuh sebelum pilot selesai dan 4 blocker keamanan tertutup.

## 2. Issue Blocker (kerjakan sebelum event)

Dikerjakan host atau 1 sampai 2 orang tepercaya. Jangan dibuka sebagai bounty publik.

| ID | Judul | Isi pekerjaan | Cara verifikasi |
|----|-------|---------------|-----------------|
| S1 | Audit RLS `profiles` | Di Supabase SQL Editor, jalankan `select * from pg_policies where tablename='profiles'`. Pastikan tidak ada policy UPDATE yang mengizinkan user mengubah `role`, `is_approved`. Simpan skema dan policy ke `supabase/migrations/` sebagai file baru. Tambah `WITH CHECK` pada `works_update_owner` | Login sebagai user biasa di staging, jalankan `supabase.from('profiles').update({role:'admin'}).eq('id', myId)` dari console. Harus gagal |
| S2 | Sanitasi HTML karya | `npm i dompurify` lalu bungkus semua `dangerouslySetInnerHTML` di `pages/Karya.tsx` (3 tempat) dan `pages/Profile.tsx` (2 tempat) dengan `DOMPurify.sanitize` | Buat karya teks berisi `<img src=x onerror=alert(1)>`. Alert tidak boleh muncul |
| S3 | Perketat sandbox iframe | Hapus `allow-same-origin` dari iframe di `Karya.tsx` (3 tempat), `Profile.tsx`, dan `InteractiveSandbox.tsx`. Tes bahwa preview p5/JS tetap jalan | Di preview, `localStorage.getItem('x')` harus melempar SecurityError |
| S4 | Branch protection dan CI wajib | Pengaturan di `HOST_KODING.md` bagian 2.2 | PR tanpa approval atau dengan CI merah tidak bisa di-merge |
| S5 | `npm audit fix` | Jalankan `npm audit fix` (tanpa `--force`), pastikan build dan tsc lolos | `npm audit --omit=dev` tinggal sedikit atau nol high |

**Status eksekusi (branch `claude/koding-event-host-setup-ikq7nz`)**
- S2 selesai di kode: `lib/sanitize.ts` (DOMPurify) dipakai di semua `dangerouslySetInnerHTML`.
- S3 selesai di kode: `allow-same-origin` dihapus dari semua iframe preview.
- S5 selesai sebagian: `npm audit fix` dijalankan. Sisa temuan berasal dari DOMPurify bawaan Monaco dan `react-router`; perlu upgrade terpisah.
- S1: file `supabase/migrations/20261026_harden_profiles_and_works.sql` sudah ditulis tapi **belum dijalankan**. Jalankan di staging, lakukan verifikasi, baru di produksi.
- S4: harus diatur manual di GitHub Settings (tidak bisa dilakukan lewat kode).

## 3. Daftar Issue Awal untuk Papan Event

Judul dan label siap dipakai saat membuat issue. Tambahkan detail lokasi file di deskripsi.

**Bug dan kualitas (bounty)**
1. Hapus 96 `console.*` dari kode produksi (ganti dengan logger yang bisa dimatikan). `sev:low`, `bounty:M`
2. Ganti `any` secara bertahap, mulai dari `lib/` dan `hooks/`. `bounty:M` per direktori
3. Pecah `pages/Karya.tsx` (1327 baris) jadi komponen: card, viewer, filter. `bounty:L`
4. Pecah `pages/Profile.tsx` dan `pages/Studio.tsx` dengan pola yang sama. `bounty:L` masing-masing
5. Lazy-load Monaco dan pyodide agar chunk `Studio` (627 kB) turun. `bounty:L`
6. Kode preview duplikat (`generateCodePreview` di Karya dan Profile): satukan ke `lib/`. `bounty:M`
7. Tambah alt text dan label ARIA di Navbar, Hero, BentoGrid, dan form. Lihat `.github/issues/issue_06_accessibility.md`. `bounty:M`
8. Stat halaman Coding yang di-hardcode (125 member, 99.9% uptime): ambil dari Supabase atau hapus. `sev:low`, `bounty:S`
9. Perbarui dokumentasi yang menunjuk path lama (`supabase_schema.sql` di CONTRIBUTING, `CODEOWNERS`). `bounty:S`
10. Uji tampilan di mobile: Studio, Karya, Gate. Laporkan dan perbaiki bug layout. `sev:medium`, `bounty:M` per bug

**Infrastruktur (bounty besar)**
11. Setup Vitest dan React Testing Library, plus test untuk `lib/utils.ts`, `AdminGuard`, dan `AuthProvider`. `bounty:XL` (lihat `issue_02_testing.md`)
12. Tambah lint (ESLint) dan format (Prettier) ke CI. `bounty:L`
13. Pemisahan error boundary per rute dan pesan error yang konsisten (`issue_03_error_handling.md`). `bounty:M`
14. Review RLS tabel lain (`comments`, `likes`, `follows`, `works`) dan tulis test SQL sederhana. `bounty:L`

**Pemula (`good-first-issue`)**
15. Perbaiki typo dan teks Indonesia yang tidak konsisten di README dan docs. `bounty:S`
16. Hapus badge versi lama di README dan sesuaikan dengan `package.json`. `bounty:S`
17. Tambah `.nvmrc` dan field `engines` di `package.json`. `bounty:S`

Mulai dengan 12 sampai 17 issue agar pilot tidak kewalahan, lalu tambah bertahap.

## 4. Teks Siap Tempel

### 4.1 Aturan event (pin sebagai issue)

```
# Aturan Event Bug Hunt Koding

Periode: <tanggal mulai> sampai <tanggal selesai>
Budget total: Rp <jumlah>. Batas per orang: Rp <jumlah>.

CARA IKUT
1. Fork repo, setup sesuai docs/HOST_KODING.md bagian 3 (Fase B).
2. Pilih issue berlabel `good-first-issue` atau `bounty:*`, komentar "Saya ambil #N".
3. Tunggu di-assign. Maksimal 2 issue aktif per orang. Klaim hangus bila 5 hari tanpa PR.
4. Buat PR dengan "Closes #N" di deskripsi. CI harus hijau. Isi template PR.

MENEMUKAN BUG BARU
- Buka issue dengan template "Bug (Divisi Koding / Bounty)". Sertakan langkah reproduksi dan bukti.
- Bug keamanan: JANGAN buka issue publik. Pakai Security Advisory (tab Security).
- Severity ditentukan host dan bersifat final.

PEMBAYARAN
- Dibayar hanya bila PR di-merge. Duplikat: hanya laporan pertama.
- Rekap tiap akhir bulan, transfer maksimal tanggal 5 bulan berikutnya.
- Minimum payout Rp 25.000, sisanya digulung.
- Ini bounty lepas, bukan hubungan kerja. Aturan dan hadiah dapat berubah dengan pemberitahuan.

DILARANG
- Membuat bug lalu melaporkannya, PR spam atau hasil otomatis tanpa dipahami,
  menyalin PR orang lain, menguji ke produksi, merusak atau mengambil data,
  memakai lebih dari satu akun.
- Pelanggaran: diskualifikasi dan hadiah ditahan.

Kontribusi dilisensikan MIT sesuai LICENSE repo.
```

### 4.2 Pengumuman ke member

```
Halo anak Koding! Kita buka Bug Hunt OurCreativity.
Cari bug, rapikan kode, dan dapat bayaran untuk PR yang di-merge.
Mulai <tanggal>. Aturan dan daftar tugas: <link issue pin>.
Daftar: balas pesan ini dengan username GitHub kamu.
Pemula boleh ikut, ada label good-first-issue.
```

### 4.3 Tambahan untuk template PR
Tambahkan bagian ini ke `.github/PULL_REQUEST_TEMPLATE.md`:
```
## Issue terkait
Closes #

## Cara verifikasi
Langkah agar reviewer dapat memastikan perubahan bekerja.

## Checklist
- [ ] `npx tsc --noEmit` lolos
- [ ] `npm run build` lolos
- [ ] Diuji di desktop dan mobile (bila menyentuh UI)
- [ ] Tidak ada secret atau data pribadi di diff
```

## 5. Ritme Mingguan Host

| Hari | Kegiatan | Durasi |
|------|----------|--------|
| Setiap hari | Triage issue baru, review PR yang menunggu | 20 sampai 30 menit |
| Senin | Bersihkan klaim kadaluarsa, tambah 3 sampai 5 issue baru | 20 menit |
| Jumat | Rekap mingguan di issue pin: PR merge, leaderboard poin, issue tersisa | 20 menit |
| Akhir bulan | Ekspor PR merge, isi ledger, umumkan rekap, payout | 1 sampai 2 jam |

Kalau review mulai menumpuk, tunjuk 1 sampai 2 reviewer tepercaya dari member senior (beri izin Triage, bukan Write) dan kurangi issue baru.

## 6. Ukuran Keberhasilan

Cek di akhir pilot dan akhir event:
- Jumlah PR merge dan rasio PR merge terhadap PR yang dibuka (sehat: di atas 50%).
- Waktu rata-rata dari klaim sampai merge.
- Jumlah kontributor aktif unik.
- Tidak ada regresi di produksi dan CI tetap hijau.
- Total pengeluaran terhadap budget.

## 7. Risiko dan Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Budget habis lebih cepat dari rencana | Batas total dan per orang, antrean issue dibatasi, jeda bila 80% terpakai |
| Review jadi bottleneck | Batas 2 klaim per orang, reviewer tambahan, issue kecil dan fokus |
| PR berkualitas rendah atau spam | Aturan diskualifikasi, hanya merge dibayar, CI wajib |
| Eksploitasi bug keamanan sebelum patch | Blocker S1 sampai S3 selesai lebih dulu, pelaporan privat |
| Kebocoran kredensial | Supabase staging terpisah, anon key saja, rotasi setelah event |
| Sengketa pembayaran | Severity final oleh host, rekap publik 3 hari sebelum payout, bukti transfer disimpan |
