-- Enable pg_trgm extension for text search if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Indexes for 'profiles' table
-- Speeds up: filtering by is_approved, role
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Speeds up: sorting by updated_at (recently active users)
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at DESC);

-- Speeds up: searching by username (trigram index for ILIKE)
CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm ON profiles USING GIN (username gin_trgm_ops);

-- Indexes for 'works' table
-- Speeds up: filtering by type
CREATE INDEX IF NOT EXISTS idx_works_type ON works(type);

-- Speeds up: sorting by created_at (recent works)
CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at DESC);

-- Speeds up: searching by title, description, author
CREATE INDEX IF NOT EXISTS idx_works_title_trgm ON works USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_works_description_trgm ON works USING GIN (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_works_author_trgm ON works USING GIN (author gin_trgm_ops);
