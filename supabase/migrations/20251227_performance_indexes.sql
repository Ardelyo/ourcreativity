-- 1. Author relationship index
CREATE INDEX IF NOT EXISTS idx_works_author_id ON works(author_id);

-- 2. Social features indexes
CREATE INDEX IF NOT EXISTS idx_likes_work_id ON likes(work_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_work_id ON comments(work_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- 3. Announcements optimization
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active) 
  WHERE is_active = true;

-- 4. Composite index for Karya filtering + sorting
CREATE INDEX IF NOT EXISTS idx_works_division_created_at ON works(division, created_at DESC);

-- 5. Performance indexes for division pages
CREATE INDEX IF NOT EXISTS idx_works_type_created_at ON works(type, created_at DESC);

-- 6. Partial index for approved users (faster admin queries)
CREATE INDEX IF NOT EXISTS idx_profiles_approved_not_admin 
  ON profiles(updated_at DESC) 
  WHERE is_approved = true AND role != 'admin';

-- 7. Analyze tables to update statistics
ANALYZE works;
ANALYZE likes;
ANALYZE comments;
ANALYZE profiles;
ANALYZE announcements;
