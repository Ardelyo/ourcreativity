-- =====================================================
-- OURCREATIVITIES DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. DIVISIONS TABLE
-- =====================================================
CREATE TABLE divisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. DIVISION SCENES TABLE
-- =====================================================
CREATE TABLE division_scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    division_id UUID REFERENCES divisions(id) ON DELETE CASCADE,
    scene_order INTEGER NOT NULL,
    scene_id TEXT, -- e.g., "intro", "chaos", "styles"
    title TEXT,
    subtitle TEXT,
    description TEXT,
    tags TEXT[],
    items JSONB, -- For flexible content like styles list
    icons TEXT[], -- Icon names to use
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('announcement', 'changelog')),
    version TEXT, -- For changelogs (e.g., "v5.0")
    major_version INTEGER, -- For grouping (e.g., 5 for v5.x)
    minor_version INTEGER,
    patch_version INTEGER,
    metadata JSONB, -- For additional data like tags, images, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TEAM MEMBERS TABLE (Optional - for future use)
-- =====================================================
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
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
CREATE INDEX idx_division_scenes_division_id ON division_scenes(division_id);
CREATE INDEX idx_division_scenes_order ON division_scenes(scene_order);
CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_date ON announcements(date DESC);
CREATE INDEX idx_announcements_version ON announcements(version);
CREATE INDEX idx_team_members_division ON team_members(division_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE division_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for divisions"
    ON divisions FOR SELECT
    USING (true);

CREATE POLICY "Public read access for division_scenes"
    ON division_scenes FOR SELECT
    USING (true);

CREATE POLICY "Public read access for announcements"
    ON announcements FOR SELECT
    USING (true);

CREATE POLICY "Public read access for team_members"
    ON team_members FOR SELECT
    USING (true);

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
CREATE TRIGGER update_divisions_updated_at
    BEFORE UPDATE ON divisions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_division_scenes_updated_at
    BEFORE UPDATE ON division_scenes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
