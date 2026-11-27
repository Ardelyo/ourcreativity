-- Perbaikan regresi 20261128: Studio (hooks/useMediaUpload.ts) mengunggah ke images/, images/thumbnails/,
-- videos/, videos/thumbnails/. Policy versi pertama hanya mengizinkan <user_id>/ dan root bucket,
-- sehingga publikasi gambar dan video dari Studio ditolak RLS. Idempotent.
DROP POLICY IF EXISTS works_upload_authenticated ON storage.objects;
CREATE POLICY works_upload_authenticated ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'works'
    AND ((storage.foldername(name))[1] IN (auth.uid()::text, 'images', 'videos')
         OR array_length(storage.foldername(name), 1) IS NULL)
  );
