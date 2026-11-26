-- Audit log aksi sensitif (perubahan profil/role, hapus karya, hapus surat).
-- Hanya admin yang bisa membaca. Tidak ada policy tulis: diisi trigger (SECURITY DEFINER).

CREATE TABLE IF NOT EXISTS public.audit_log (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  at         timestamptz NOT NULL DEFAULT now(),
  actor_id   uuid,            -- auth.uid(); NULL = SQL Editor / service_role
  table_name text NOT NULL,
  action     text NOT NULL,   -- INSERT / UPDATE / DELETE
  row_id     text,
  old_data   jsonb,
  new_data   jsonb
);

CREATE INDEX IF NOT EXISTS idx_audit_log_at ON public.audit_log (at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON public.audit_log (actor_id, at DESC);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_log_admin_read" ON public.audit_log;
CREATE POLICY "audit_log_admin_read" ON public.audit_log
  FOR SELECT USING (COALESCE(public.get_auth_role(), '') = 'admin');

CREATE OR REPLACE FUNCTION public.write_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (actor_id, table_name, action, row_id, old_data)
    VALUES (auth.uid(), TG_TABLE_NAME, TG_OP, to_jsonb(OLD)->>'id', to_jsonb(OLD));
    RETURN OLD;
  END IF;

  -- UPDATE: untuk profiles catat hanya perubahan kolom sensitif
  IF TG_TABLE_NAME = 'profiles'
     AND to_jsonb(NEW)->'role' IS NOT DISTINCT FROM to_jsonb(OLD)->'role'
     AND to_jsonb(NEW)->'is_approved' IS NOT DISTINCT FROM to_jsonb(OLD)->'is_approved' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.audit_log (actor_id, table_name, action, row_id, old_data, new_data)
  VALUES (auth.uid(), TG_TABLE_NAME, TG_OP, to_jsonb(NEW)->>'id', to_jsonb(OLD), to_jsonb(NEW));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_profiles ON public.profiles;
CREATE TRIGGER trg_audit_profiles AFTER UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

DROP TRIGGER IF EXISTS trg_audit_works ON public.works;
CREATE TRIGGER trg_audit_works AFTER UPDATE OR DELETE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- Jalankan baris ini hanya jika tabel `letters` ada:
-- DROP TRIGGER IF EXISTS trg_audit_letters ON public.letters;
-- CREATE TRIGGER trg_audit_letters AFTER DELETE ON public.letters
--   FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- Contoh query tracking:
--   select at, actor_id, table_name, action, row_id from public.audit_log order by at desc limit 100;
--   select * from public.audit_log where table_name = 'profiles' and new_data->>'role' = 'admin';
