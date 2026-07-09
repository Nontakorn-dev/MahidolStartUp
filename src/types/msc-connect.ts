export type IntakeStage = 'idea' | 'prototype' | 'early_revenue' | 'growth'
export type StartupIntakeStatus = 'active' | 'paused'
export type PartnerRoleType = 'mentor' | 'investor' | 'corporate_partner' | 'alumni' | 'other'
export type PartnerApprovalStatus = 'pending' | 'approved' | 'rejected'
export type IntakeRequestStatus = 'new' | 'in_progress' | 'matched' | 'closed'
export type TagGroup = 'industry' | 'need_offer'
export type ContentPostType = 'news' | 'featured_startup' | 'success_story' | 'event'

export interface TeamMember {
  name: string
  faculty: string
  role: string
}

export interface TagOption {
  id: string
  tag_group: TagGroup
  tag_key: string
  label_th: string
  label_en: string | null
  is_active: boolean
  sort_order: number
}

export interface StartupIntake {
  id: string
  startup_name: string
  one_line_pitch: string
  team_members: TeamMember[]
  contact_email: string
  contact_line: string | null
  industry_tags: string[]
  stage: IntakeStage
  need_tags: string[]
  need_detail: string | null
  pitch_deck_url: string | null
  consent_public_directory: boolean
  consent_pdpa: boolean
  status: StartupIntakeStatus
  created_at: string
  updated_at: string
}

export interface PartnerIntake {
  id: string
  name_or_org: string
  role_type: PartnerRoleType
  contact_email: string
  contact_line: string | null
  industry_tags: string[]
  offer_tags: string[]
  interested_stages: IntakeStage[]
  availability_note: string | null
  additional_note: string | null
  consent_pdpa: boolean
  approval_status: PartnerApprovalStatus
  created_at: string
  updated_at: string
}

export interface IntakeRequest {
  id: string
  startup_id: string
  requested_need_tags: string[]
  status: IntakeRequestStatus
  matched_partner_id: string | null
  matched_at: string | null
  matched_by_admin_id: string | null
  followup_notes: string | null
  created_at: string
  startups?: StartupIntake
  partners?: PartnerIntake
}

export interface AdminUser {
  id: string
  email: string
  display_name: string
  role: string
  created_at: string
}

export const STAGE_LABELS: Record<IntakeStage, string> = {
  idea: 'ไอเดีย',
  prototype: 'Prototype / MVP',
  early_revenue: 'มีรายได้เริ่มต้น',
  growth: 'Growth',
}

export const PARTNER_ROLE_LABELS: Record<PartnerRoleType, string> = {
  mentor: 'Mentor',
  investor: 'นักลงทุน',
  corporate_partner: 'Corporate Partner',
  alumni: 'Alumni',
  other: 'อื่น ๆ',
}

export const REQUEST_STATUS_LABELS: Record<IntakeRequestStatus, string> = {
  new: 'ใหม่',
  in_progress: 'กำลังดำเนินการ',
  matched: 'จับคู่แล้ว',
  closed: 'ปิดแล้ว',
}

export const APPROVAL_STATUS_LABELS: Record<PartnerApprovalStatus, string> = {
  pending: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
}

export const INDUSTRY_COLORS: Record<string, string> = {
  foodtech: 'bg-amber-100 text-amber-900',
  healthtech: 'bg-rose-100 text-rose-900',
  edtech: 'bg-sky-100 text-sky-900',
  fintech: 'bg-emerald-100 text-emerald-900',
  deeptech: 'bg-violet-100 text-violet-900',
  sustainability: 'bg-lime-100 text-lime-900',
  agritech: 'bg-green-100 text-green-900',
  ai_ml: 'bg-indigo-100 text-indigo-900',
  saas: 'bg-blue-100 text-blue-900',
  social_impact: 'bg-orange-100 text-orange-900',
}

export const DEFAULT_INDUSTRY_COLOR = 'bg-ted-light text-ted-blue'
