-- Zahir Digital - Comprehensive Database Schema (Supabase)

-- ─── ENUMS ───
CREATE TYPE facility_status AS ENUM ('available', 'limited', 'not_available');
CREATE TYPE complaint_status AS ENUM ('Dalam Tindakan', 'Selesai');
CREATE TYPE complaint_category AS ENUM ('Kebersihan', 'Kemudahan', 'Pengurusan', 'Keselamatan', 'Lain-lain');
CREATE TYPE user_role AS ENUM ('admin', 'visitor');
CREATE TYPE payment_method AS ENUM ('qr', 'online', 'manual');

-- ─── TABLES ───

-- 1) Mosque Profile
CREATE TABLE IF NOT EXISTS mosque_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    description TEXT,
    hero_image_url TEXT,
    parking_capacity INTEGER DEFAULT 0,
    parking_available INTEGER DEFAULT 0,
    parking_notes TEXT,
    google_map_embed_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Profiles (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role user_role DEFAULT 'visitor',
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) Mosque Facilities
CREATE TABLE IF NOT EXISTS mosque_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mosque_id UUID REFERENCES mosque_profile(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    availability_status facility_status DEFAULT 'available',
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    event_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5) Campaigns (Infaq)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL,
    collected_amount NUMERIC(12, 2) DEFAULT 0,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    qr_code_url TEXT,
    payment_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6) Complaints (Aduan)
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category complaint_category NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    status complaint_status DEFAULT 'Dalam Tindakan',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7) Donations (Derma)
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Link for Visitors
    donor_name TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8) Task Definitions (Predefined Daily Deeds)
CREATE TABLE IF NOT EXISTS task_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9) User Deed Logs (Track completions)
CREATE TABLE IF NOT EXISTS user_deed_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES task_definitions(id) ON DELETE CASCADE,
    completed_at DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    UNIQUE(user_id, task_id, completed_at)
);

-- 10) Settings (Key-Value Store for app config)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FUNCTIONS & TRIGGERS ───

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER set_mosque_profile_updated_at BEFORE UPDATE ON mosque_profile FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_mosque_facilities_updated_at BEFORE UPDATE ON mosque_facilities FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── ROW LEVEL SECURITY (RLS) ───

-- Enable RLS
ALTER TABLE mosque_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mosque_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deed_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public Read Mosque Profile" ON mosque_profile FOR SELECT USING (true);
CREATE POLICY "Public Read Mosque Facilities" ON mosque_facilities FOR SELECT USING (true);
CREATE POLICY "Public Read Announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public Read Campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public Read Task Definitions" ON task_definitions FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Donations RLS
CREATE POLICY "Public Insert Donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own donations" ON donations FOR SELECT USING (auth.uid() = profile_id OR auth.role() = 'authenticated');

-- Complaints RLS
CREATE POLICY "Public Read Complaints" ON complaints FOR SELECT USING (true);
CREATE POLICY "Public Insert Complaints" ON complaints FOR INSERT WITH CHECK (true);

-- Daily Deeds Logs RLS
CREATE POLICY "Users can view own deeds" ON user_deed_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deeds" ON user_deed_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own deeds" ON user_deed_logs FOR DELETE USING (auth.uid() = user_id);

-- Admin CRUD Access (Authenticated Users with admin role)
-- Note: In a real app, you'd check a role column in profiles
CREATE POLICY "Admin CRUD Mosque Profile" ON mosque_profile FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin CRUD Mosque Facilities" ON mosque_facilities FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin CRUD Announcements" ON announcements FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin CRUD Campaigns" ON campaigns FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin CRUD Complaints" ON complaints FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin CRUD Donations" ON donations FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin CRUD Task Definitions" ON task_definitions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin CRUD Settings" ON settings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ─── ADVANCED TRIGGERS ───

-- Function to update campaign progress
CREATE OR REPLACE FUNCTION update_campaign_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE campaigns
    SET collected_amount = collected_amount + NEW.amount
    WHERE id = NEW.campaign_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on donation insert
CREATE TRIGGER on_donation_inserted
AFTER INSERT ON donations
FOR EACH ROW EXECUTE FUNCTION update_campaign_progress();

-- ─── AUTH TRIGGERS ───

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, 'visitor');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
