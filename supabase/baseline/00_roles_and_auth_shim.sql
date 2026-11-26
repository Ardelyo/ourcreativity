-- 00_roles_and_auth_shim.sql
-- HANYA untuk backend Postgres biasa (mis. Cloud SQL) yang menjalankan GoTrue + PostgREST + Storage API sendiri.
-- JANGAN dijalankan di Supabase cloud: role dan fungsi ini sudah ada di sana.
-- Idempotent. Definisi mengikuti inisialisasi standar Supabase.

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')          THEN CREATE ROLE anon NOLOGIN NOINHERIT; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN NOINHERIT; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role')  THEN CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS; END IF;
  -- 'authenticator' dipakai PostgREST untuk login lalu SET ROLE ke anon/authenticated.
  -- Beri password lewat Secret Manager, JANGAN taruh di file ini:
  --   ALTER ROLE authenticator WITH LOGIN PASSWORD '<dari-secret-manager>';
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN CREATE ROLE authenticator NOINHERIT NOLOGIN; END IF;
END $$;

GRANT anon, authenticated, service_role TO authenticator;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE SCHEMA IF NOT EXISTS auth;

-- Dibaca dari klaim JWT yang di-set PostgREST per request.
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT nullif(
    coalesce(current_setting('request.jwt.claim.sub', true),
             (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')),
    '')::uuid
$$;

CREATE OR REPLACE FUNCTION auth.role() RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT nullif(
    coalesce(current_setting('request.jwt.claim.role', true),
             (current_setting('request.jwt.claims', true)::jsonb ->> 'role')),
    '')::text
$$;

CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb
LANGUAGE sql STABLE AS $$
  SELECT coalesce(nullif(current_setting('request.jwt.claim', true), ''),
                  nullif(current_setting('request.jwt.claims', true), ''))::jsonb
$$;

-- Catatan: tabel auth.users dan auth.identities dibuat oleh migrasi GoTrue sendiri
-- (jalankan GoTrue sekali terhadap database kosong SEBELUM 01_baseline_schema.sql).
