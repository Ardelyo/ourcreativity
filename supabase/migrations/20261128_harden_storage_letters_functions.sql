-- Hardening lanjutan hasil audit produksi 2026-11-27. BELUM diterapkan di produksi.
-- Idempotent. Terapkan di staging dulu, lalu uji dengan skenario di bawah.
--
-- Temuan yang ditutup:
--  1. Storage: bucket `works` bisa di-upload siapa saja tanpa login ("Public Upload").
--  2. Storage: user login mana pun bisa menghapus avatar milik orang lain.
--  3. Storage: tanpa batas ukuran/tipe file pada bucket.
--  4. letters: INSERT anonim tanpa batas panjang (spam/penyalahgunaan).
--  5. Fungsi SECURITY DEFINER pemicu bisa dipanggil lewat /rest/v1/rpc, dan handle_new_user tanpa search_path.
--  6. Policy lama "Users can update own profile." tanpa WITH CHECK (duplikat profiles_update_own).
--
-- Perilaku yang DIPERTAHANKAN: buku tamu (letters) tetap bisa dibaca dan dikirim tanpa login;
-- Studio mengunggah ke `works/<user_id>/...`, CreationStudio ke root bucket `works` (keduanya tetap diizinkan, hanya untuk user login);
-- Settings mengunggah avatar `avatars/<user_id>-<ts>.<ext>`.
-- get_auth_role() TIDAK di-REVOKE karena dipakai di dalam policy RLS.
--
-- Rollback (kondisi sebelum migrasi ini):
--   CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'works');
--   CREATE POLICY "Avatars Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
--   CREATE POLICY "Avatars Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
--   CREATE POLICY "Enable insert access for all users" ON public.letters FOR INSERT WITH CHECK (true);
--   CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id);
--   UPDATE storage.buckets SET file_size_limit = NULL, allowed_mime_types = NULL WHERE id IN ('works','avatars');
--   GRANT EXECUTE ON FUNCTION public.handle_new_user(), public.protect_profile_privileged_columns(),
--     public.write_audit_log(), public.update_updated_at_column() TO PUBLIC;

-- 1-3. Storage
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatars Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatars Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS works_upload_authenticated ON storage.objects;
DROP POLICY IF EXISTS avatars_upload_own ON storage.objects;
DROP POLICY IF EXISTS avatars_delete_own ON storage.objects;

CREATE POLICY works_upload_authenticated ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'works'
    AND ((storage.foldername(name))[1] IN (auth.uid()::text, 'images', 'videos')
         OR array_length(storage.foldername(name), 1) IS NULL)
  );
-- Catatan: useMediaUpload (Studio) menulis ke images/, images/thumbnails/, videos/, videos/thumbnails/.
-- Versi pertama migrasi ini hanya mengizinkan <user_id>/ dan root sehingga memblokir publikasi gambar/video;
-- diperbaiki lewat fix_works_upload_policy_studio_folders_20261128b.

CREATE POLICY avatars_upload_own ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%');

CREATE POLICY avatars_delete_own ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%');

UPDATE storage.buckets SET file_size_limit = 52428800 WHERE id = 'works';
UPDATE storage.buckets SET file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'] WHERE id = 'avatars';

-- 4. letters
DROP POLICY IF EXISTS "Authenticated users only" ON public.letters;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.letters;
DROP POLICY IF EXISTS letters_insert_bounded ON public.letters;
CREATE POLICY letters_insert_bounded ON public.letters
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(message)) BETWEEN 1 AND 1000
    AND length(coalesce(from_name, '')) <= 80
    AND length(coalesce(social_handle, '')) <= 100
  );

-- 5. Fungsi pemicu
ALTER FUNCTION public.handle_new_user() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_privileged_columns() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 6. Policy update profil duplikat tanpa WITH CHECK
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Uji setelah diterapkan (sebagai user biasa, semua di konsol browser / SQL dengan role authenticated):
--   * upload ke works tanpa login                      -> GAGAL
--   * upload ke works/<uid-sendiri>/x.jpg dan root     -> BERHASIL
--   * upload ke works/<uid-orang-lain>/x.jpg           -> GAGAL
--   * hapus avatar milik orang lain                    -> GAGAL
--   * kirim surat anonim 5 karakter                    -> BERHASIL; 1001 karakter -> GAGAL
--   * update bio sendiri, ubah role sendiri            -> BERHASIL / GAGAL ("Tidak boleh mengubah role")
--   * daftar akun baru                                 -> profil terbentuk (trigger handle_new_user)
