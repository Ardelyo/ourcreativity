-- Create platform_settings table for dynamic configuration
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read settings" ON public.platform_settings
FOR SELECT USING (true); -- Usually public needs to read config like "site_name" or "registration_open"

CREATE POLICY "Admin full access settings" ON public.platform_settings
FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Insert default settings
INSERT INTO public.platform_settings (key, value) VALUES
('site_config', '{"site_name": "OurCreativity", "tagline": "Platform Kreativitas Visual", "maintenance_mode": false}'),
('features', '{"registration_open": true, "auto_approve_works": false, "allow_comments": true}')
ON CONFLICT (key) DO NOTHING;
