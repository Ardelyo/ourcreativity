# Runbook produksi: hardening Supabase OurCreativity

Project: `didjpfzpxwvamtlzgcbt` (Supabase). Dikerjakan oleh pemilik, di **SQL Editor** dashboard Supabase
(satu-satunya cara yang tidak mengharuskan membagikan kredensial database).
Setiap langkah punya **hasil yang diharapkan**. Jika hasil berbeda, **berhenti** dan jangan lanjut ke langkah berikutnya.

## Langkah 0. Cadangan (wajib sebelum mengubah apa pun)

Dashboard, Database, Backups. Pastikan ada backup harian terbaru, atau unduh dump:
Project Settings, Database, "Database backups". Catat waktu backup: `__________`.

Cek project tidak dalam status paused dan region/plan sesuai harapan: Project Settings, General.

## Langkah 1. Audit read-only

Jalankan seluruh isi `supabase/audit/rls_audit.sql` (hanya `select`, tidak mengubah data).
Simpan hasil tiap query (screenshot atau export CSV) sebagai bukti.

| Query | Hasil yang diharapkan | Jika tidak |
|---|---|---|
| 1. tabel tanpa RLS | kosong | Aktifkan RLS di tabel itu SEBELUM lanjut; tabel tanpa RLS terbuka penuh lewat anon key |
| 2. semua policy | `profiles` dan `works` tidak punya policy `FOR ALL`/`INSERT`/`UPDATE` dengan `USING (true)` | Catat tabel dan policy-nya, kirim ke saya |
| 3. policy tulis per tabel | tiap tabel yang ditulis dari client punya policy yang sesuai | Fitur terkait gagal; catat saja |
| 4. policy storage | upload dibatasi ke folder milik user (`auth.uid()`) | Catat |
| 5. bucket publik | ukuran dan tipe file dibatasi | Catat |
| 6. fungsi SECURITY DEFINER | semua punya `search_path=public` di kolom `config` | Catat fungsi tanpa config |
| 7. daftar admin | hanya akun yang Anda kenal | **Darurat**: ada admin tak dikenal, anggap akun/sesi terkompromi, lanjut ke Langkah 5 |
| 8. policy `letters` | tabel ada dan ada policy | Jika tabel tidak ada, abaikan |

Tambahan yang dibutuhkan migrasi (cek keberadaannya):

```sql
-- fungsi yang dipakai trigger harus ada
select proname from pg_proc where proname = 'get_auth_role';           -- harus 1 baris
-- kolom yang dirujuk trigger harus ada
select column_name from information_schema.columns
 where table_schema='public' and table_name='profiles'
   and column_name in ('role','is_approved');                           -- harus 2 baris
```

Jika `get_auth_role` atau kolom tidak ada, **jangan** jalankan migrasi (trigger akan membuat semua update profil gagal).
Jalankan dulu `supabase/migrations/20251226_performance_cleanup.sql` bagian 1 (fungsi `get_auth_role`).

## Langkah 2. Pindai konten berbahaya yang sudah tersimpan

Karena XSS sempat aktif, periksa konten yang sudah ada. Read-only:

```sql
select id, author_id, title, type, created_at
from public.works
where content ~* '<script|onerror\s*=|onload\s*=|javascript:|<iframe|document\.cookie|localStorage|sb-.*-auth-token|fetch\s*\(|XMLHttpRequest'
  and type in ('text','code')
order by created_at desc;
```

Karya bertipe `code` memang memuat `<script>` yang sah (p5, JS) sehingga banyak hasil normal.
Fokus pada pola yang tidak wajar: `localStorage`, `document.cookie`, `sb-`, `fetch(` ke domain asing, `parent.`.
Jika ada yang mencurigakan: jangan hapus dulu, ekspor sebagai bukti, lalu sembunyikan (`is_approved=false` atau pindah ke staging) dan lanjut ke Langkah 5.

## Langkah 3. Terapkan migrasi (setelah Langkah 0 sampai 2 bersih)

Urutan, satu per satu, di SQL Editor:

1. `supabase/migrations/20261026_harden_profiles_and_works.sql`
2. `supabase/migrations/20261027_admin_audit_log.sql`

Keduanya idempotent (aman diulang).

## Langkah 4. Verifikasi (harus lulus semua)

Login sebagai **user biasa** (bukan admin) di situs, buka konsol browser:

```js
// 1. eskalasi role harus GAGAL dengan "Tidak boleh mengubah role atau is_approved"
const { data: { user } } = await supabase.auth.getUser();
await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);

// 2. memindah kepemilikan karya harus GAGAL / 0 baris berubah
await supabase.from('works').update({ author_id: '<uuid-user-lain>' }).eq('id', '<id-karya-sendiri>');

// 3. update profil biasa tetap BERHASIL (pastikan fitur Settings tidak rusak)
await supabase.from('profiles').update({ bio: 'tes' }).eq('id', user.id);
```

Lalu sebagai **admin**: setujui/tolak satu user dari panel Admin (harus tetap berhasil dan tercatat di `audit_log`):

```sql
select at, actor_id, table_name, action, row_id from public.audit_log order by at desc limit 10;
```

## Langkah 5. Jika ada indikasi eksploitasi

1. Ganti JWT secret: Project Settings, API, "JWT Settings" (memaksa semua sesi login ulang). Anon key ikut berganti, jadi update `VITE_SUPABASE_ANON_KEY` di Vercel lalu redeploy.
2. Paksa logout semua user.
3. Jika ada data pribadi anggota yang mungkin terbaca: UU PDP Pasal 46 mewajibkan pemberitahuan tertulis dalam 3x24 jam kepada subjek data dan lembaga PDP.

## Langkah 6. Rotasi kunci Gemini (jika pernah diset di Vercel)

`GEMINI_API_KEY` sempat disuntikkan ke bundle client pada 9 sampai 12 Des 2025. Jika key itu pernah diset di Vercel:
buat key baru di Google AI Studio, hapus yang lama, dan jangan taruh di variabel `VITE_*`.
