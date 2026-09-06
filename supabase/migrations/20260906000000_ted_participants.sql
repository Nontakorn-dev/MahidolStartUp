-- TED Youth Startup: in-app apply, team matching, CV upload

CREATE TYPE ted_join_path AS ENUM ('has_team', 'looking_for_team');

CREATE TABLE ted_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_slug TEXT NOT NULL,
  path ted_join_path NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  faculty TEXT,
  bio TEXT,
  idea TEXT,
  team_name TEXT,
  team_size INT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  looking_for TEXT[] NOT NULL DEFAULT '{}',
  cv_path TEXT,
  cv_file_name TEXT,
  linkedin_url TEXT,
  line_id TEXT,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, event_slug)
);

CREATE INDEX idx_ted_participants_public
  ON ted_participants (event_slug, created_at DESC)
  WHERE is_public = TRUE;

CREATE INDEX idx_ted_participants_path
  ON ted_participants (event_slug, path)
  WHERE is_public = TRUE;

CREATE TRIGGER ted_participants_updated_at
  BEFORE UPDATE ON ted_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE ted_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public TED profiles are viewable" ON ted_participants
  FOR SELECT USING (
    is_public = TRUE
    OR user_id = auth.uid()
    OR is_core_team_or_above(auth.uid())
  );

CREATE POLICY "Users insert own TED profile" ON ted_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own TED profile" ON ted_participants
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users delete own TED profile" ON ted_participants
  FOR DELETE USING (user_id = auth.uid());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated read resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users upload own resumes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users update own resumes" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own resumes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
