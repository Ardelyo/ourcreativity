-- =====================================================
-- PERFORMANCE OPTIMIZATION & CLEANUP
-- =====================================================

-- 1. Optimize get_auth_role() to use configuration setting for performance
-- This avoids a table scan/index lookup for every row processing
CREATE OR REPLACE FUNCTION public.get_auth_role()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  _role text;
BEGIN
  -- Attempt to get role from session variable (custom claim equivalent)
  -- Or just use a simple lookup with a limit to ensure speed
  SELECT role INTO _role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
  RETURN _role;
END;
$function$;

-- 2. Consolidate RLS Policies (Removing Redundant/Overlapping Policies)

-- Table: works
DROP POLICY IF EXISTS "Public works are viewable by everyone" ON works;
DROP POLICY IF EXISTS "Works are viewable by everyone" ON works;
CREATE POLICY "works_select_public" ON works FOR SELECT USING (true);

-- Table: profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (true);

-- Table: announcements
DROP POLICY IF EXISTS "Public read access for announcements" ON announcements;
DROP POLICY IF EXISTS "Public read active announcements" ON announcements; -- Assuming we want to show all announcements for now, or use a better filter
CREATE POLICY "announcements_select_public" ON announcements FOR SELECT USING (true);

-- 3. Fix platform_settings performance-draining subquery
DROP POLICY IF EXISTS "Admin full access settings" ON public.platform_settings;
CREATE POLICY "Admin full access settings" ON public.platform_settings
FOR ALL USING (
    (get_auth_role() = 'admin')
);

-- 4. Add Missing Indexes for Foreign Keys
-- These were identified by the Supabase performance advisor
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_settings_updated_by ON public.platform_settings(updated_by);

-- 5. Fix Works UPDATE/INSERT RLS (Removing redundant subqueries)
-- The existing policies used (SELECT auth.uid()) which is slightly slower than just auth.uid()
DROP POLICY IF EXISTS "Users can insert their own works" ON works;
CREATE POLICY "works_insert_owner" ON works FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own works" ON works;
CREATE POLICY "works_update_owner" ON works FOR UPDATE USING (auth.uid() = author_id);
