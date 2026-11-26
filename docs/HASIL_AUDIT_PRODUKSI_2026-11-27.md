# Hasil audit RLS produksi dan status penerapan (27 Nov 2026)

Project Supabase `didjpfzpxwvamtlzgcbt` ("OurCreativities", PG 17, ap-south-1). Audit dijalankan read-only
lewat konektor Supabase memakai `supabase/audit/rls_audit.sql`. Data: 299 profil, 11 karya, 4 surat, 20 pengumuman, 66 objek storage.

## Sudah diterapkan di produksi (diverifikasi)

| Migrasi | Isi | Verifikasi |
|---|---|---|
| `20261026_harden_profiles_and_works` | trigger anti-eskalasi `role`/`is_approved`, `profiles_update_own`, `works_update_owner ... WITH CHECK` | role admin sendiri **diblokir**, self-approve **diblokir**, update bio **berhasil**, pindah kepemilikan karya **diblokir** (RLS), edit karya sendiri **berhasil**. Diuji dengan role `authenticated` di subtransaksi yang di-rollback, data tidak berubah |
| `20261027_admin_audit_log` | tabel `audit_log` + trigger `profiles`, `works`, `letters` | tabel ada, RLS aktif, 4 trigger terpasang |

Admin: hanya `ardelyo` (sesuai yang dikenal). Tidak ada tabel tanpa RLS. Pindai `works.content`: dua karya `code`
memuat `<script>` sah (p5.js); tidak ada `localStorage`, `document.cookie`, `fetch(`, `parent.`, `iframe`.
Rollback tidak perlu data: migrasi hanya mengubah trigger/policy (lihat header SQL untuk balikannya).

## Temuan yang BELUM ditutup di produksi

Diatasi oleh `supabase/migrations/20261128_harden_storage_letters_functions.sql` (siap, sintaks tervalidasi, belum diterapkan):

1. Bucket `works` bisa di-upload **tanpa login** (policy "Public Upload"); bucket tanpa batas ukuran/tipe.
2. Siapa pun yang login bisa menghapus avatar orang lain.
3. `letters`: INSERT anonim tanpa batas panjang.
4. `handle_new_user` tanpa `search_path`; fungsi pemicu `SECURITY DEFINER` bisa dipanggil lewat `/rest/v1/rpc`.
5. Policy lama `Users can update own profile.` tanpa `WITH CHECK` (tertutup trigger, tapi duplikat).

Butuh tindakan manual di dashboard (tidak bisa lewat SQL): **Auth, Password, aktifkan Leaked Password Protection**.
Ekstensi `pg_trgm` ada di schema `public` (peringatan advisor; memindahkannya perlu menguji indeks GIN, ditunda).

## Vercel

Env proyek hanya `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. Tidak ada `GEMINI_API_KEY`, jadi rotasi key Gemini tidak diperlukan.
Deployment produksi terakhir: 3 Mar 2026 (commit `1f1f529`). Integrasi Git masih menunjuk nama lama `Ardelyo/ourcreativity`,
sehingga merge ke `OurCreativity/ourcreativity` tidak memicu deploy. Perbaikan XSS belum live sampai deploy dilakukan
(Dashboard Vercel, Settings, Git: hubungkan ulang repo `OurCreativity/ourcreativity`, lalu Redeploy `main`).
