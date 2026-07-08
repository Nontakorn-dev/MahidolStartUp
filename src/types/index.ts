export type UserRole = 'member' | 'pr' | 'core_team' | 'admin'
export type Affiliation = 'mu_student' | 'mu_alumni' | 'mu_faculty' | 'external'
export type StartupStage = 'idea' | 'mvp' | 'early_revenue' | 'growth'
export type Availability = 'open' | 'limited' | 'closed'
export type PostStatus = 'draft' | 'published' | 'archived'
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'
export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'expired'
export type ProfileTargetType = 'startup' | 'mentor' | 'individual'

export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  affiliation: Affiliation
  faculty: string | null
  bio: string | null
  role: UserRole
  linkedin_url: string | null
  line_id: string | null
  email_public: boolean
  created_at: string
  updated_at: string
}

export interface StartupProfile {
  id: string
  owner_id: string
  name: string
  tagline: string | null
  description: string | null
  industry: string[]
  stage: StartupStage
  team_size: number | null
  website_url: string | null
  logo_url: string | null
  looking_for: string[]
  offering: string[]
  is_public: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface MentorProfile {
  id: string
  owner_id: string
  title: string | null
  expertise: string[]
  industries: string[]
  can_offer: string[]
  availability: Availability
  is_public: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Post {
  id: string
  author_id: string
  title: string
  slug: string
  content: Record<string, unknown>
  cover_image_url: string | null
  category: string | null
  tags: string[]
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Event {
  id: string
  author_id: string
  title: string
  slug: string
  description: Record<string, unknown>
  cover_image_url: string | null
  start_at: string
  end_at: string | null
  location: string | null
  registration_url: string | null
  max_attendees: number | null
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface ConnectionRequest {
  id: string
  sender_id: string
  receiver_id: string
  target_type: ProfileTargetType
  target_id: string
  message: string | null
  status: ConnectionStatus
  responded_at: string | null
  created_at: string
  sender?: Profile
  receiver?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export interface MediaAsset {
  id: string
  uploaded_by: string
  file_path: string
  file_name: string
  mime_type: string | null
  size_bytes: number | null
  created_at: string
}
