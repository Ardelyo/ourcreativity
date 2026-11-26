# Rencana migrasi backend: Supabase <-> Google Cloud

Status: **rencana, belum dijalankan dan belum diuji**. Tidak ada resource GCP yang dibuat.
Keputusan saat ini (26 Nov 2026): tetap di Supabase, hardening dulu (lihat `RUNBOOK_PRODUKSI.md`).
Dokumen ini ada supaya pindah ke GCP, atau kembali ke Supabase, tinggal mengikuti langkah.

## Prinsip portabilitas

Aplikasi hanya bergantung pada dua variabel (`lib/supabase.ts`):

```
VITE_SUPABASE_URL      alamat API (Supabase cloud atau gateway self-hosted)
VITE_SUPABASE_ANON_KEY kunci anon (JWT yang ditandatangani JWT secret backend)
```

Selama backend mengimplementasikan API yang sama (PostgREST untuk tabel, GoTrue untuk auth,
Storage API untuk file), kode aplikasi **tidak berubah**: pindah backend = ganti dua variabel,
pindahkan data, lalu deploy ulang. Karena itu jalur yang direkomendasikan adalah menjalankan
komponen Supabase open-source di GCP, bukan menulis ulang 67 panggilan `supabase.from()` di
20 file ke Firestore atau API buatan sendiri. Menulis ulang akan mematikan jalur kembali ke Supabase.

## Yang harus dipindahkan

| Komponen | Isi | Cara |
|---|---|---|
| Database | schema `public` (profiles, works, likes, comments, letters, announcements, platform_settings, audit_log), RLS, fungsi, trigger | `pg_dump` |
| Auth | tabel `auth.users` dan `auth.identities` (hash password, email) | `pg_dump --schema=auth` ke database tujuan dengan **JWT secret yang sama** agar sesi lama tetap valid, atau paksa login ulang |
| Storage | bucket `works`, `avatars` (objek file) | salin objek lewat Storage API / `rclone` |
| Konfigurasi | JWT secret, SMTP, redirect URL, provider OAuth | catat dari dashboard (Project Settings, Auth) |

## Susunan target di GCP (project `gemma4good-494311`)

- **Cloud SQL for PostgreSQL 15** (instance kecil, mis. `db-g1-small`), backup harian dan PITR aktif
- **Cloud Run**: GoTrue (`supabase/gotrue`), PostgREST (`postgrest/postgrest`), Storage API (`supabase/storage-api`),
  dan satu gateway yang menyatukan rute `/auth/v1`, `/rest/v1`, `/storage/v1` di satu domain
- **Cloud Storage** sebagai backend file Storage API
- **Secret Manager** untuk JWT secret, password database, kunci SMTP
- Region `asia-southeast2` (Jakarta), selaras dengan layanan lain di project

Perkiraan biaya (kasar, perlu dicek di kalkulator GCP sebelum membuat apa pun): puluhan dolar per bulan,
jauh di bawah batas belanja Gemma 4 sebesar 3.000 dolar. Cloud SQL adalah komponen terbesar.
Project yang sama menjalankan VM dan layanan lain (mis. `halio`); jangan disentuh.

## Urutan kerja (setiap langkah punya cek lulus/gagal)

1. **Selesaikan audit RLS produksi lebih dulu** (`RUNBOOK_PRODUKSI.md`). Skema baseline hanya boleh
   ditulis dari skema produksi yang nyata, karena repo tidak punya `CREATE TABLE` untuk `profiles` dan
   `letters`, dan `announcements` dibuat di tiga file berbeda.
2. Ekspor dari Supabase: `pg_dump "$SUPABASE_DB_URL" --no-owner --schema=public --schema=auth > dump.sql`
   (connection string ada di Project Settings, Database). Simpan juga hasil `rls_audit.sql`.
3. Buat Cloud SQL, restore ke database **kosong**, jalankan ulang `rls_audit.sql`, bandingkan hasilnya
   dengan produksi. Selisih apa pun = berhenti.
4. Deploy GoTrue, PostgREST, Storage ke Cloud Run dengan JWT secret yang sama. Uji dengan akun uji:
   daftar, login, buat karya, unggah gambar, like, komentar, dan **ulangi uji eskalasi role** dari runbook (harus gagal).
5. Salin objek Storage dan cocokkan jumlah serta checksum.
6. Build staging dengan `VITE_SUPABASE_URL` baru, uji penuh, baru ganti produksi.
7. Pertahankan Supabase lama (read-only) minimal 14 hari sebagai jalur kembali.

## Jalur kembali ke Supabase

Kebalikan langkah 2 sampai 6: `pg_dump` dari Cloud SQL, restore ke project Supabase, salin objek Storage,
ganti dua variabel env. Karena aplikasi tidak berubah, rollback tidak butuh deploy kode, hanya ganti env dan redeploy.

## Risiko yang sudah diketahui

- Menjalankan stack Supabase sendiri berarti Anda memegang pembaruan keamanan GoTrue/PostgREST/Storage.
- Email konfirmasi butuh SMTP sendiri (Supabase cloud menyediakannya, self-hosted tidak).
- Realtime tidak dipakai di kode saat ini; jangan dipindahkan kecuali nanti dibutuhkan.
- Jika JWT secret berbeda, semua sesi login lama tidak valid dan pengguna harus login ulang.
