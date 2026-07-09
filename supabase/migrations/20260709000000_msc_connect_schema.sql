-- MSC Connect (PRD v3) — Business Matching intake schema
-- Runs alongside existing MU Startup Hub tables

-- ─── Enums ───────────────────────────────────────────────────────────────────
CREATE TYPE intake_stage AS ENUM ('idea', 'prototype', 'early_revenue', 'growth');
CREATE TYPE startup_intake_status AS ENUM ('active', 'paused');
CREATE TYPE partner_role_type AS ENUM ('mentor', 'investor', 'corporate_partner', 'alumni', 'other');
CREATE TYPE partner_approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE intake_request_status AS ENUM ('new', 'in_progress', 'matched', 'closed');
CREATE TYPE tag_group_type AS ENUM ('industry', 'need_offer');
CREATE TYPE content_post_type AS ENUM ('news', 'featured_startup', 'success_story', 'event');

-- ─── Tag options (master list) ───────────────────────────────────────────────
CREATE TABLE tag_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_group tag_group_type NOT NULL,
  tag_key TEXT NOT NULL,
  label_th TEXT NOT NULL,
  label_en TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (tag_group, tag_key)
);

-- ─── Admin users (MSC Connect admin panel) ───────────────────────────────────
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Startup intake (public form, no auth) ───────────────────────────────────
CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_name TEXT NOT NULL,
  one_line_pitch TEXT NOT NULL CHECK (char_length(one_line_pitch) <= 150),
  team_members JSONB NOT NULL DEFAULT '[]',
  contact_email TEXT NOT NULL,
  contact_line TEXT,
  industry_tags TEXT[] NOT NULL DEFAULT '{}',
  stage intake_stage NOT NULL DEFAULT 'idea',
  need_tags TEXT[] NOT NULL DEFAULT '{}',
  need_detail TEXT,
  pitch_deck_url TEXT,
  consent_public_directory BOOLEAN NOT NULL DEFAULT FALSE,
  consent_pdpa BOOLEAN NOT NULL DEFAULT FALSE,
  status startup_intake_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── External partners (public form, admin approves) ─────────────────────────
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_or_org TEXT NOT NULL,
  role_type partner_role_type NOT NULL,
  contact_email TEXT NOT NULL,
  contact_line TEXT,
  industry_tags TEXT[] NOT NULL DEFAULT '{}',
  offer_tags TEXT[] NOT NULL DEFAULT '{}',
  interested_stages intake_stage[] DEFAULT '{}',
  availability_note TEXT,
  additional_note TEXT,
  consent_pdpa BOOLEAN NOT NULL DEFAULT FALSE,
  approval_status partner_approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Matching requests (created when startup submits) ────────────────────────
CREATE TABLE intake_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  requested_need_tags TEXT[] NOT NULL DEFAULT '{}',
  status intake_request_status NOT NULL DEFAULT 'new',
  matched_partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  matched_at TIMESTAMPTZ,
  matched_by_admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  followup_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Extend posts for PRD content types ─────────────────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS post_type content_post_type DEFAULT 'news',
  ADD COLUMN IF NOT EXISTS linked_startup_id UUID REFERENCES startups(id) ON DELETE SET NULL;

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_startups_status ON startups(status);
CREATE INDEX idx_startups_industry ON startups USING GIN (industry_tags);
CREATE INDEX idx_partners_approval ON partners(approval_status);
CREATE INDEX idx_partners_industry ON partners USING GIN (industry_tags);
CREATE INDEX idx_intake_requests_status ON intake_requests(status);
CREATE INDEX idx_intake_requests_startup ON intake_requests(startup_id);
CREATE INDEX idx_tag_options_group ON tag_options(tag_group) WHERE is_active = TRUE;

-- ─── Triggers ────────────────────────────────────────────────────────────────
CREATE TRIGGER startups_updated_at BEFORE UPDATE ON startups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create intake request when startup registers
CREATE OR REPLACE FUNCTION create_intake_request_on_startup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO intake_requests (startup_id, requested_need_tags)
  VALUES (NEW.id, NEW.need_tags);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_startup_registered
  AFTER INSERT ON startups
  FOR EACH ROW EXECUTE FUNCTION create_intake_request_on_startup();

-- Sync admin_users from profiles with PR+ role (optional bootstrap)
CREATE OR REPLACE FUNCTION sync_admin_user_from_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IN ('pr', 'core_team', 'admin') THEN
    INSERT INTO admin_users (id, email, display_name, role)
    VALUES (
      NEW.id,
      COALESCE((SELECT email FROM auth.users WHERE id = NEW.id), ''),
      NEW.full_name,
      CASE WHEN NEW.role = 'admin' THEN 'head' ELSE 'admin' END
    )
    ON CONFLICT (id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      role = EXCLUDED.role;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_profile_role_admin_sync
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_admin_user_from_profile();

-- ─── Helper: MSC admin check ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_msc_admin(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = uid
  ) OR is_pr_or_above(uid);
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE tag_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_requests ENABLE ROW LEVEL SECURITY;

-- tag_options: public read, admin write
CREATE POLICY "Anyone can read active tags" ON tag_options
  FOR SELECT USING (is_active = TRUE OR is_msc_admin(auth.uid()));
CREATE POLICY "Admins manage tags" ON tag_options
  FOR ALL USING (is_msc_admin(auth.uid()));

-- admin_users: self read, head manages (Phase 2)
CREATE POLICY "Admins read own record" ON admin_users
  FOR SELECT USING (id = auth.uid() OR is_msc_admin(auth.uid()));

-- startups: public insert, admin full access
CREATE POLICY "Public can submit startup form" ON startups
  FOR INSERT WITH CHECK (consent_pdpa = TRUE);
CREATE POLICY "Admins manage startups" ON startups
  FOR ALL USING (is_msc_admin(auth.uid()));
CREATE POLICY "Public directory startups viewable" ON startups
  FOR SELECT USING (
    consent_public_directory = TRUE AND status = 'active'
    OR is_msc_admin(auth.uid())
  );

-- partners: public insert, admin full access
CREATE POLICY "Public can submit partner form" ON partners
  FOR INSERT WITH CHECK (consent_pdpa = TRUE);
CREATE POLICY "Admins manage partners" ON partners
  FOR ALL USING (is_msc_admin(auth.uid()));

-- intake_requests: admin only
CREATE POLICY "Admins manage intake requests" ON intake_requests
  FOR ALL USING (is_msc_admin(auth.uid()));

-- ─── Seed tag options ────────────────────────────────────────────────────────
INSERT INTO tag_options (tag_group, tag_key, label_th, label_en, sort_order) VALUES
  ('industry', 'foodtech', 'FoodTech', 'FoodTech', 1),
  ('industry', 'healthtech', 'HealthTech', 'HealthTech', 2),
  ('industry', 'edtech', 'EdTech', 'EdTech', 3),
  ('industry', 'fintech', 'FinTech', 'FinTech', 4),
  ('industry', 'deeptech', 'Deep Tech', 'Deep Tech', 5),
  ('industry', 'sustainability', 'Sustainability', 'Sustainability', 6),
  ('industry', 'agritech', 'AgriTech', 'AgriTech', 7),
  ('industry', 'ai_ml', 'AI/ML', 'AI/ML', 8),
  ('industry', 'saas', 'SaaS', 'SaaS', 9),
  ('industry', 'social_impact', 'Social Impact', 'Social Impact', 10),
  ('need_offer', 'mentor_tech', 'Mentor ด้านเทคนิค', 'Technical Mentor', 1),
  ('need_offer', 'funding', 'เงินทุน', 'Funding', 2),
  ('need_offer', 'pilot_partner', 'Pilot Partner', 'Pilot Partner', 3),
  ('need_offer', 'beta_customers', 'ลูกค้าทดสอบ', 'Beta Customers', 4),
  ('need_offer', 'distribution', 'ช่องทาง Distribution', 'Distribution', 5),
  ('need_offer', 'legal', 'คำแนะนำด้านกฎหมาย', 'Legal Advice', 6),
  ('need_offer', 'connection', 'Connection / Network', 'Connection', 7),
  ('need_offer', 'feedback', 'Feedback ทั่วไป', 'General Feedback', 8);
