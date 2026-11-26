-- 01_baseline_schema.sql
-- Skema schema `public` OurCreativity, diambil dari database produksi
-- (project didjpfzpxwvamtlzgcbt) pada 2026-11-27 SETELAH migrasi 20261026 dan 20261027.
-- Tujuan: bisa memulihkan/memindahkan backend (Supabase <-> GCP) dari satu file.
--
-- Prasyarat:
--   * Supabase cloud: langsung jalan.
--   * Postgres lain: jalankan 00_roles_and_auth_shim.sql dan GoTrue dulu (tabel auth.users harus ada).
-- Perbedaan yang disengaja terhadap produksi:
--   * id memakai gen_random_uuid() (bawaan PG13+) menggantikan uuid_generate_v4() agar tidak butuh uuid-ossp.
--   * Tidak ada data. Data dipindah dengan pg_dump --data-only (lihat docs/MIGRASI_BACKEND.md).
-- Setelah file ini, terapkan supabase/migrations/20261128_harden_storage_letters_functions.sql
-- (sudah termasuk policy storage; 02_storage.sql hanya perlu pada backend Postgres baru).
--
-- Cek kecocokan: jalankan supabase/audit/rls_audit.sql di kedua database, hasilnya harus sama.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------- tabel
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at  timestamptz,
  username    text UNIQUE,
  avatar_url  text,
  website     text,
  is_approved boolean DEFAULT false,
  role        text DEFAULT 'member',
  bio         text,
  created_at  timestamptz DEFAULT now(),
  CONSTRAINT profiles_role_check CHECK (role = ANY (ARRAY['member','admin','moderator'])),
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

CREATE TABLE IF NOT EXISTS public.works (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  description     text,
  content         text,
  image_url       text,
  author          text,
  role            text,
  division        text,
  type            text,
  tags            text[],
  link            text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  slides          jsonb DEFAULT '[]'::jsonb,
  code_language   text,
  embed_url       text,
  document_source text,
  author_id       uuid REFERENCES auth.users(id),
  profile_id      uuid REFERENCES public.profiles(id),
  thumbnail_url   text,
  embed_type      text,
  CONSTRAINT works_type_check CHECK (type = ANY (ARRAY['image','video','text','code','slide','document','embed'])),
  CONSTRAINT works_embed_type_check CHECK (embed_type = ANY (ARRAY['youtube','instagram','tiktok','twitter','other']))
);

CREATE TABLE IF NOT EXISTS public.comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (work_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.follows (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.letters (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message       text NOT NULL,
  from_name     text,
  social_handle text,
  variant       integer NOT NULL DEFAULT 0,
  x             double precision NOT NULL,
  y             double precision NOT NULL,
  rotation      double precision NOT NULL,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  subtitle      text,
  description   text,
  content       text NOT NULL,
  date          timestamptz DEFAULT now(),
  type          text NOT NULL,
  category      text,
  status        text,
  color         text,
  highlights    text[],
  version       text,
  major_version integer,
  minor_version integer,
  patch_version integer,
  metadata      jsonb,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  is_active     boolean DEFAULT true,
  CONSTRAINT announcements_type_check CHECK (type = ANY (ARRAY['announcement','changelog']))
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  role         text,
  division     text,
  bio          text,
  avatar_url   text,
  social_links jsonb,
  is_active    boolean DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  at         timestamptz NOT NULL DEFAULT now(),
  actor_id   uuid,
  table_name text NOT NULL,
  action     text NOT NULL,
  row_id     text,
  old_data   jsonb,
  new_data   jsonb
);

-- ---------------------------------------------------------------- indeks
CREATE INDEX IF NOT EXISTS idx_announcements_created_at  ON public.announcements USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_date        ON public.announcements USING btree (date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active   ON public.announcements USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active_type ON public.announcements USING btree (is_active, type);
CREATE INDEX IF NOT EXISTS idx_announcements_type        ON public.announcements USING btree (type);
CREATE INDEX IF NOT EXISTS idx_announcements_version     ON public.announcements USING btree (version);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor           ON public.audit_log USING btree (actor_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_at              ON public.audit_log USING btree (at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_user_id          ON public.comments USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_work_id          ON public.comments USING btree (work_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id       ON public.follows USING btree (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id      ON public.follows USING btree (following_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id             ON public.likes USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_likes_work_id             ON public.likes USING btree (work_id);
CREATE INDEX IF NOT EXISTS idx_platform_settings_updated_by ON public.platform_settings USING btree (updated_by);
CREATE INDEX IF NOT EXISTS idx_profiles_approved_not_admin ON public.profiles USING btree (updated_at DESC) WHERE ((is_approved = true) AND (role <> 'admin'));
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved      ON public.profiles USING btree (is_approved);
CREATE INDEX IF NOT EXISTS idx_profiles_role             ON public.profiles USING btree (role);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at       ON public.profiles USING btree (updated_at);
CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm    ON public.profiles USING gin (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_works_author_id           ON public.works USING btree (author_id);
CREATE INDEX IF NOT EXISTS idx_works_author_trgm         ON public.works USING gin (author gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_works_created_at          ON public.works USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_works_description_trgm    ON public.works USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_works_division            ON public.works USING btree (division);
CREATE INDEX IF NOT EXISTS idx_works_division_created_at ON public.works USING btree (division, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_works_embed_type          ON public.works USING btree (embed_type) WHERE (embed_type IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_works_profile_id          ON public.works USING btree (profile_id);
CREATE INDEX IF NOT EXISTS idx_works_thumbnail           ON public.works USING btree (thumbnail_url) WHERE (thumbnail_url IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_works_title_trgm          ON public.works USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_works_type                ON public.works USING btree (type);
CREATE INDEX IF NOT EXISTS idx_works_type_created_at     ON public.works USING btree (type, created_at DESC);

-- ---------------------------------------------------------------- fungsi
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  _role text;
BEGIN
  SELECT role INTO _role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
  RETURN _role;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
begin
  insert into public.profiles (id, username, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url',
    'member'
  );
  return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.get_auth_role(), '') = 'admin' THEN
    RETURN NEW;
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

CREATE OR REPLACE FUNCTION public.write_audit_log()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (actor_id, table_name, action, row_id, old_data)
    VALUES (auth.uid(), TG_TABLE_NAME, TG_OP, to_jsonb(OLD)->>'id', to_jsonb(OLD));
    RETURN OLD;
  END IF;

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

-- ---------------------------------------------------------------- trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_works_updated_at ON public.works;
CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileged_columns BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_columns();
DROP TRIGGER IF EXISTS trg_audit_profiles ON public.profiles;
CREATE TRIGGER trg_audit_profiles AFTER DELETE OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
DROP TRIGGER IF EXISTS trg_audit_works ON public.works;
CREATE TRIGGER trg_audit_works AFTER DELETE OR UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
DROP TRIGGER IF EXISTS trg_audit_letters ON public.letters;
CREATE TRIGGER trg_audit_letters AFTER DELETE ON public.letters
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- ---------------------------------------------------------------- RLS + policy (sama dengan produksi)
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log         ENABLE ROW LEVEL SECURITY;

-- announcements
CREATE POLICY "Admin full access announcements" ON public.announcements FOR ALL
  USING (get_auth_role() = 'admin') WITH CHECK (get_auth_role() = 'admin');
CREATE POLICY "announcements_select_public" ON public.announcements FOR SELECT USING (true);
-- audit_log
CREATE POLICY "audit_log_admin_read" ON public.audit_log FOR SELECT
  USING (COALESCE(public.get_auth_role(), '') = 'admin');
-- comments
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can insert their own comments" ON public.comments FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Comments are viewable by everyone"   ON public.comments FOR SELECT USING (true);
-- follows
CREATE POLICY "Users can unfollow"            ON public.follows FOR DELETE USING ((SELECT auth.uid()) = follower_id);
CREATE POLICY "Users can follow others"       ON public.follows FOR INSERT WITH CHECK ((SELECT auth.uid()) = follower_id);
CREATE POLICY "Users view own follows"        ON public.follows FOR SELECT USING (follower_id = (SELECT auth.uid()) OR following_id = (SELECT auth.uid()));
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
-- letters (buku tamu publik; policy insert dibatasi oleh migrasi 20261128)
CREATE POLICY "Authenticated users only"       ON public.letters FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');
CREATE POLICY "Enable insert access for all users" ON public.letters FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users"   ON public.letters FOR SELECT USING (true);
-- likes
CREATE POLICY "Users can delete their own likes" ON public.likes FOR DELETE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can toggle their own likes" ON public.likes FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Likes are viewable by everyone"   ON public.likes FOR SELECT USING (true);
-- platform_settings
CREATE POLICY "Admin full access settings" ON public.platform_settings FOR ALL USING (get_auth_role() = 'admin');
CREATE POLICY "Public read settings"       ON public.platform_settings FOR SELECT USING (true);
-- profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL TO authenticated
  USING (get_auth_role() = 'admin') WITH CHECK (get_auth_role() = 'admin');
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY "profiles_select_public"     ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((SELECT auth.uid()) = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id);
CREATE POLICY "profiles_update_own"        ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- team_members
CREATE POLICY "Public read access for team_members" ON public.team_members FOR SELECT USING (true);
-- works
CREATE POLICY "Admins can manage all works" ON public.works FOR ALL TO authenticated
  USING (get_auth_role() = 'admin') WITH CHECK (get_auth_role() = 'admin');
CREATE POLICY "works_insert_owner"  ON public.works FOR INSERT WITH CHECK ((SELECT auth.uid()) = author_id);
CREATE POLICY "works_select_public" ON public.works FOR SELECT USING (true);
CREATE POLICY "works_update_owner"  ON public.works FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
