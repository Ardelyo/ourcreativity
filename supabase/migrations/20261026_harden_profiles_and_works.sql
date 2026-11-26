-- Hardening RLS: cegah eskalasi role dan pemindahan kepemilikan karya.
-- Aman dijalankan ulang (idempotent). Jalankan di Supabase STAGING dulu.
-- Catatan: SQL Editor / service_role punya auth.uid() NULL, jadi tidak diblokir trigger.

-- 1. Pastikan RLS aktif
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- 2. Trigger: user biasa tidak boleh membuat/mengubah role admin atau is_approved sendiri
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.get_auth_role(), '') = 'admin' THEN
    RETURN NEW;  -- SQL Editor / service_role / admin
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'admin' OR NEW.is_approved IS TRUE THEN
      RAISE EXCEPTION 'Tidak boleh membuat profil dengan role admin atau is_approved';
    END IF;
  ELSIF NEW.role IS DISTINCT FROM OLD.role
        OR NEW.is_approved IS DISTINCT FROM OLD.is_approved THEN
    RAISE EXCEPTION 'Tidak boleh mengubah role atau is_approved';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileged_columns
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_columns();

-- 3. Policy update profil: hanya baris sendiri
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 4. Works: WITH CHECK agar author_id tidak bisa dipindahkan ke orang lain
DROP POLICY IF EXISTS "works_update_owner" ON public.works;
CREATE POLICY "works_update_owner" ON public.works
  FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

-- Verifikasi manual (login sebagai user biasa di staging, harus GAGAL):
--   supabase.from('profiles').update({ role: 'admin' }).eq('id', '<id-sendiri>')
