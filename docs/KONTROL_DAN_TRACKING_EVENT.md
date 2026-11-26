# Kontrol Keamanan dan Tracking Peserta Event

Panduan untuk host agar event tetap terkontrol dan aktivitas peserta bisa dilihat.

## 1. Prinsip kontrol

1. **Peserta tidak pernah menyentuh produksi.** Mereka pakai fork + Supabase staging. Kredensial staging dibagikan privat dan diganti setelah event.
2. **Semua perubahan lewat PR** dengan branch protection di `main` (approval + CODEOWNERS + CI hijau).
3. **Hak akses minimal.** Peserta tidak diberi akses write ke repo. Reviewer tepercaya cukup diberi *Triage*.
4. **Bug keamanan dilaporkan privat** lewat tab Security → Report a vulnerability, bukan issue publik.
5. **Satu sumber kebenaran untuk reward**: label issue + PR yang di-merge (bagian 3).

## 2. Verifikasi sebelum event (checklist host)

- [ ] Jalankan `supabase/audit/rls_audit.sql` di staging dan produksi. Simpan hasilnya. Pastikan: tidak ada tabel publik tanpa RLS, policy tulis sesuai harapan untuk `profiles`, `works`, `letters`, dan `storage.objects`, daftar admin sesuai.
- [ ] Jalankan migration `20261026_harden_profiles_and_works.sql` lalu `20261027_admin_audit_log.sql` (staging dulu).
- [ ] Uji sebagai user biasa di staging: `update({role:'admin'})` pada profil sendiri harus gagal.
- [ ] Bucket `works` dan `avatars`: batasi `file_size_limit` dan `allowed_mime_types` di dashboard Storage; policy upload hanya untuk path `auth.uid()/...`; tanpa overwrite oleh user lain.
- [ ] Auth Supabase: aktifkan konfirmasi email, CAPTCHA (Turnstile/hCaptcha), dan rate limit di Authentication → Settings.
- [ ] Aktifkan Dependabot, Secret scanning, dan Private vulnerability reporting.

## 3. Tracking peserta

### 3.1 Daftar peserta (registry)
Buat Google Sheet privat dengan kolom: `github`, `nama`, `kontak`, `tanggal daftar`, `setuju aturan (ya/tidak)`, `rekening/e-wallet`. Data pribadi tidak masuk repo. Hanya username GitHub yang dipakai di tooling.

### 3.2 Aktivitas di GitHub (otomatis)
- Workflow `Event report` (`.github/workflows/event-report.yml`) berjalan tiap Senin dan bisa dipicu manual (Actions → Event report → Run workflow, isi `since`). Hasilnya muncul di ringkasan job dan sebagai artifact `report.csv` / `report.md`.
- Per peserta: jumlah PR merge, jumlah laporan bug, dan perkiraan reward dari label (`event/rewards.json`).
- Jalankan manual: `GITHUB_TOKEN=<token> node scripts/event-report.mjs --since 2026-11-01 --until 2026-11-30`.
- Pantau juga: Insights → Contributors, Pulse, dan Project board (kolom `Assignee` dan `Rupiah`).
- Aturan hitung: PR harus menulis `Closes #N`; reward diambil dari label tertinggi pada issue tersebut. Maintainer di `excludeUsers` tidak dihitung. Batas per orang di `maxPerUser`.

### 3.3 Aktivitas di aplikasi (database)
Setelah migration `20261027_admin_audit_log.sql`, tabel `audit_log` mencatat siapa mengubah role/approval, menghapus karya, atau menghapus profil. Query contoh:
```sql
-- 100 aksi terbaru
select at, actor_id, table_name, action, row_id from audit_log order by at desc limit 100;
-- siapa dijadikan admin
select at, actor_id, row_id from audit_log where table_name='profiles' and new_data->>'role'='admin';
-- aktivitas satu pengguna
select * from audit_log where actor_id = '<uuid>' order by at desc;
```
Untuk login dan error auth: Supabase Dashboard → Logs → Auth dan API (lihat IP, status 4xx/5xx mencurigakan). Untuk pendaftaran baru selama event:
```sql
select id, username, created_at from public.profiles order by created_at desc limit 50;
```

### 3.4 Sinyal yang perlu dicurigai
- Banyak PR kecil dalam waktu singkat dari satu akun, atau PR tanpa penjelasan.
- Akun baru yang langsung mengirim banyak laporan bug.
- Perubahan di `supabase/`, `.github/`, `package.json`, atau file auth tanpa issue terkait: review ekstra, jalankan lokal.
- Lonjakan 401/403/429 di log Supabase atau lonjakan upload storage.
- Entri `audit_log` dengan `actor_id` bukan admin yang kamu kenal.

## 4. Menanggapi insiden
1. Cabut akses: ganti kunci staging, nonaktifkan akun (`update profiles set is_approved=false`), blokir user GitHub dari org.
2. Simpan bukti (log, `audit_log`, tautan PR).
3. Perbaiki lewat PR privat/advisory, lalu umumkan ringkas.
4. Peserta yang melanggar aturan: diskualifikasi dan hadiah ditahan sesuai aturan event.
