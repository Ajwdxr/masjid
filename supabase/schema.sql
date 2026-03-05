-- Zahir Digital - Comprehensive Database Schema (Supabase)

-- ─── ENUMS ───
CREATE TYPE facility_status AS ENUM ('available', 'limited', 'not_available');
CREATE TYPE complaint_status AS ENUM ('Dalam Tindakan', 'Selesai');
CREATE TYPE complaint_category AS ENUM ('Kebersihan', 'Kemudahan', 'Pengurusan', 'Keselamatan', 'Lain-lain');
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

-- 2) Mosque Facilities
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

-- 3) Announcements
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

-- 4) Campaigns (Infaq)
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

-- 5) Complaints (Aduan)
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

-- 6) Donations (Derma)
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    donor_name TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
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
CREATE TRIGGER set_mosque_facilities_updated_at BEFORE UPDATE ON mosque_facilities FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── ROW LEVEL SECURITY (RLS) ───

-- Enable RLS
ALTER TABLE mosque_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE mosque_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public Read Mosque Profile" ON mosque_profile FOR SELECT USING (true);
CREATE POLICY "Public Read Mosque Facilities" ON mosque_facilities FOR SELECT USING (true);
CREATE POLICY "Public Read Announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public Read Campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public Read Complaints" ON complaints FOR SELECT USING (true);
CREATE POLICY "Public Read Donations" ON donations FOR SELECT USING (true);

-- Anonymous Insert for Complaints & Donations
CREATE POLICY "Public Insert Complaints" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Donations" ON donations FOR INSERT WITH CHECK (true);

-- Admin CRUD Access (Authenticated Users)
CREATE POLICY "Admin CRUD Mosque Profile" ON mosque_profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Mosque Facilities" ON mosque_facilities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Announcements" ON announcements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Campaigns" ON campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Complaints" ON complaints FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD Donations" ON donations FOR ALL USING (auth.role() = 'authenticated');
