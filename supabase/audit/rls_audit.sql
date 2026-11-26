-- AUDIT READ-ONLY. Jalankan di Supabase SQL Editor (staging dulu, lalu produksi).
-- Tidak mengubah data. Simpan hasilnya sebagai bukti sebelum event.

-- 1. Tabel di schema public TANPA RLS (harus kosong)
select c.relname as table_without_rls
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;

-- 2. Semua policy (periksa tiap tabel: siapa boleh INSERT/UPDATE/DELETE)
select tablename, policyname, cmd, roles, qual as using_expr, with_check
from pg_policies where schemaname = 'public' order by tablename, cmd;

-- 3. Tabel RLS aktif tapi tanpa policy tulis (fitur tulis akan gagal / atau ada drift)
select t.tablename,
       bool_or(p.cmd in ('INSERT','ALL')) as has_insert,
       bool_or(p.cmd in ('UPDATE','ALL')) as has_update,
       bool_or(p.cmd in ('DELETE','ALL')) as has_delete
from pg_tables t left join pg_policies p on p.schemaname = t.schemaname and p.tablename = t.tablename
where t.schemaname = 'public' group by t.tablename order by t.tablename;

-- 4. Policy storage (bucket works / avatars): siapa boleh upload, overwrite, hapus
select policyname, cmd, roles, qual as using_expr, with_check
from pg_policies where schemaname = 'storage' and tablename = 'objects' order by cmd;

-- 5. Bucket publik dan batasan ukuran/tipe
select id, public, file_size_limit, allowed_mime_types from storage.buckets;

-- 6. Fungsi SECURITY DEFINER (rawan eskalasi jika tanpa search_path)
select p.proname, p.prosecdef as security_definer, p.proconfig as config
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef;

-- 7. Siapa admin sekarang (harus sesuai daftar yang kamu kenal)
select id, username, role, is_approved, updated_at from public.profiles
where role = 'admin' order by updated_at desc;

-- 8. Tabel `letters` (Kotak Surat): apakah ada dan apa policy-nya
select policyname, cmd, roles, qual, with_check from pg_policies where tablename = 'letters';
