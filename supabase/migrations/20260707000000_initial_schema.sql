-- MU Startup Hub - Initial Schema
-- Run via: supabase db push (or apply in Supabase SQL Editor)

-- Enums
CREATE TYPE user_role AS ENUM ('member', 'pr', 'core_team', 'admin');
CREATE TYPE affiliation_type AS ENUM ('mu_student', 'mu_alumni', 'mu_faculty', 'external');
CREATE TYPE startup_stage AS ENUM ('idea', 'mvp', 'early_revenue', 'growth');
CREATE TYPE availability_type AS ENUM ('open', 'limited', 'closed');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE profile_target_type AS ENUM ('startup', 'mentor', 'individual');
CREATE TYPE registration_status AS ENUM ('registered', 'cancelled', 'attended');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  affiliation affiliation_type DEFAULT 'mu_student',
  faculty TEXT,
  bio TEXT,
  role user_role NOT NULL DEFAULT 'member',
  linkedin_url TEXT,
  line_id TEXT,
  email_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Startup profiles
CREATE TABLE startup_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  industry TEXT[] DEFAULT '{}',
  stage startup_stage DEFAULT 'idea',
  team_size INT,
  website_url TEXT,
  logo_url TEXT,
  looking_for TEXT[] DEFAULT '{}',
  offering TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentor profiles
CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  expertise TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  can_offer TEXT[] DEFAULT '{}',
  availability availability_type DEFAULT 'open',
  is_public BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts (CMS)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB DEFAULT '{}',
  cover_image_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description JSONB DEFAULT '{}',
  cover_image_url TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  location TEXT,
  registration_url TEXT,
  max_attendees INT,
  status event_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event registrations
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status registration_status NOT NULL DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Connection requests (matching)
CREATE TABLE connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type profile_target_type NOT NULL,
  target_id UUID NOT NULL,
  message TEXT,
  status connection_status NOT NULL DEFAULT 'pending',
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Media assets
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_startup_profiles_public ON startup_profiles(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_mentor_profiles_public ON mentor_profiles(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_connection_requests_receiver ON connection_requests(receiver_id, status);
CREATE INDEX idx_connection_requests_sender ON connection_requests(sender_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, ''),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER startup_profiles_updated_at BEFORE UPDATE ON startup_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER mentor_profiles_updated_at BEFORE UPDATE ON mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Helper: check if user has PR+ role
CREATE OR REPLACE FUNCTION is_pr_or_above(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = uid AND role IN ('pr', 'core_team', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION is_core_team_or_above(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = uid AND role IN ('core_team', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (is_core_team_or_above(auth.uid()));

-- Startup profiles
CREATE POLICY "Public startup profiles viewable" ON startup_profiles
  FOR SELECT USING (is_public = TRUE OR owner_id = auth.uid() OR is_core_team_or_above(auth.uid()));
CREATE POLICY "Owners manage startup profiles" ON startup_profiles
  FOR ALL USING (owner_id = auth.uid());

-- Mentor profiles
CREATE POLICY "Public mentor profiles viewable" ON mentor_profiles
  FOR SELECT USING (is_public = TRUE OR owner_id = auth.uid() OR is_core_team_or_above(auth.uid()));
CREATE POLICY "Owners manage mentor profiles" ON mentor_profiles
  FOR ALL USING (owner_id = auth.uid());

-- Posts
CREATE POLICY "Published posts are public" ON posts
  FOR SELECT USING (status = 'published' OR author_id = auth.uid() OR is_pr_or_above(auth.uid()));
CREATE POLICY "PR can manage posts" ON posts
  FOR ALL USING (is_pr_or_above(auth.uid()));

-- Events
CREATE POLICY "Published events are public" ON events
  FOR SELECT USING (status = 'published' OR author_id = auth.uid() OR is_pr_or_above(auth.uid()));
CREATE POLICY "PR can manage events" ON events
  FOR ALL USING (is_pr_or_above(auth.uid()));

-- Event registrations
CREATE POLICY "Users see own registrations" ON event_registrations
  FOR SELECT USING (user_id = auth.uid() OR is_pr_or_above(auth.uid()));
CREATE POLICY "Users can register" ON event_registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can cancel own registration" ON event_registrations
  FOR UPDATE USING (user_id = auth.uid());

-- Connection requests
CREATE POLICY "Users see own connections" ON connection_requests
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send requests" ON connection_requests
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Receivers can respond" ON connection_requests
  FOR UPDATE USING (receiver_id = auth.uid());

-- Notifications
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can mark read" ON notifications
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Media assets
CREATE POLICY "PR can manage media" ON media_assets
  FOR ALL USING (is_pr_or_above(auth.uid()));
CREATE POLICY "Public can view media" ON media_assets
  FOR SELECT USING (true);

-- Storage bucket (run in Supabase dashboard or via CLI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Notification trigger on connection request
CREATE OR REPLACE FUNCTION notify_connection_request()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, body, link)
  VALUES (
    NEW.receiver_id,
    'connection_request',
    'คำขอเชื่อมต่อใหม่',
    'มีคนส่งคำขอเชื่อมต่อถึงคุณ',
    '/match/connections'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_connection_request
  AFTER INSERT ON connection_requests
  FOR EACH ROW EXECUTE FUNCTION notify_connection_request();

CREATE OR REPLACE FUNCTION notify_connection_response()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status IN ('accepted', 'declined') THEN
    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (
      NEW.sender_id,
      'connection_response',
      CASE WHEN NEW.status = 'accepted' THEN 'คำขอเชื่อมต่อได้รับการตอบรับ' ELSE 'คำขอเชื่อมต่อถูกปฏิเสธ' END,
      CASE WHEN NEW.status = 'accepted' THEN 'คุณสามารถดูข้อมูลติดต่อได้แล้ว' ELSE 'ลองค้นหา partner คนอื่นได้นะ' END,
      '/match/connections'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_connection_response
  AFTER UPDATE ON connection_requests
  FOR EACH ROW EXECUTE FUNCTION notify_connection_response();
