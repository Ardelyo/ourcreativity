-- 02_storage.sql
-- Bucket dan policy storage, keadaan TARGET (sudah termasuk hardening 20261128).
-- Jalankan setelah Storage API menginisialisasi schema `storage` (backend Postgres baru).
-- Di Supabase cloud yang sudah menerapkan migrasi 20261128, file ini tidak perlu dijalankan.
-- Objek file (isi bucket) tidak ada di sini: salin dengan rclone / Storage API.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('works',   'works',   true, 52428800, NULL),
       ('avatars', 'avatars', true, 5242880,  ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public Access to Works and Avatars" ON storage.objects;
CREATE POLICY "Public Access to Works and Avatars" ON storage.objects FOR SELECT
  USING (bucket_id IN ('works', 'avatars'));

DROP POLICY IF EXISTS works_upload_authenticated ON storage.objects;
CREATE POLICY works_upload_authenticated ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'works'
    AND ((storage.foldername(name))[1] IN (auth.uid()::text, 'images', 'videos')
         OR array_length(storage.foldername(name), 1) IS NULL)
  );

DROP POLICY IF EXISTS avatars_upload_own ON storage.objects;
CREATE POLICY avatars_upload_own ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%');

DROP POLICY IF EXISTS avatars_delete_own ON storage.objects;
CREATE POLICY avatars_delete_own ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%');
