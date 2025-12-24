-- Create announcements table with rich fields
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    content TEXT,
    type TEXT DEFAULT 'announcement', -- 'announcement', 'changelog'
    date TIMESTAMPTZ DEFAULT NOW(),
    color TEXT DEFAULT 'from-purple-500 to-blue-500',
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'New', -- 'Baru', 'Update', 'Maintenance'
    highlights TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read active announcements" ON public.announcements
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access announcements" ON public.announcements
FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
