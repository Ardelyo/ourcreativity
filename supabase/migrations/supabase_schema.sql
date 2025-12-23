-- =====================================================
-- OURCREATIVITIES DATABASE SCHEMA (REFOCUSED)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CLEANUP (Remove old tables)
-- =====================================================
DROP TABLE IF EXISTS team_members; -- Drop this first because it depends on divisions
DROP TABLE IF EXISTS division_scenes;
DROP TABLE IF EXISTS divisions;

-- =====================================================
-- 2. WORKS (KARYA) TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- For text/code types
    image_url TEXT,
    author TEXT,
    role TEXT, -- e.g., '3D Artist', 'Writer'
    division TEXT, -- e.g., 'graphics', 'video', 'writing', 'coding', 'meme'
    type TEXT CHECK (type IN ('image', 'video', 'text', 'code', 'slide', 'embed', 'document')),
    slides JSONB DEFAULT '[]', -- Array of slide objects
    code_language TEXT, -- For code type
    embed_url TEXT, -- For embed type
    document_source TEXT, -- Original filename for converted docs
    tags TEXT[], -- Array of tags
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT, -- Short summary
    content TEXT NOT NULL, -- Full content
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('announcement', 'changelog')),
    category TEXT, -- e.g., 'Launch', 'Event'
    status TEXT, -- e.g., 'Baru', 'Selesai'
    color TEXT, -- Tailwind gradient classes e.g. 'from-rose-500 ...'
    highlights TEXT[], -- Array of highlights
    version TEXT, -- For changelogs
    major_version INTEGER,
    minor_version INTEGER,
    patch_version INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    division TEXT, -- Changed from division_id to text since divisions table is gone
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB, -- {instagram: "...", github: "..."}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_works_division ON works(division);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_version ON announcements(version);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'works' AND policyname = 'Public read access for works'
    ) THEN
        CREATE POLICY "Public read access for works" ON works FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Public read access for announcements'
    ) THEN
        CREATE POLICY "Public read access for announcements" ON announcements FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Public read access for team_members'
    ) THEN
        CREATE POLICY "Public read access for team_members" ON team_members FOR SELECT USING (true);
    END IF;
END
$$;

-- =====================================================
-- FUNCTIONS
-- =====================================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_works_updated_at ON works;
CREATE TRIGGER update_works_updated_at
    BEFORE UPDATE ON works
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
