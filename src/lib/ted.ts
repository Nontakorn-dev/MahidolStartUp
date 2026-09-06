import { TED_EVENT_SLUG } from '../data/events'
import type { TedJoinPath } from '../types'

export { TED_EVENT_SLUG }

export const TED_SKILLS = [
  'Product',
  'Business',
  'Marketing',
  'Design',
  'Engineering',
  'Research',
  'Data / AI',
  'Finance',
  'Healthcare',
  'Operations',
  'Content',
  'Fundraising',
] as const

export const TED_ROLES = [
  'Co-founder',
  'Product Manager',
  'Developer',
  'Designer',
  'Marketer',
  'Business',
  'Researcher',
  'Domain expert',
] as const

export const TED_INTERESTS = [
  'HealthTech',
  'EdTech',
  'FinTech',
  'AgriTech',
  'FoodTech',
  'Climate',
  'Social Impact',
  'AI / ML',
  'Biotech',
  'Marketplace',
  'SaaS',
  'ยังไม่นิ่ง — อยากลอง',
] as const

export const JOIN_PATH_LABELS: Record<TedJoinPath, string> = {
  has_team: 'มีทีมแล้ว',
  looking_for_team: 'กำลังหาทีม',
}

export function peoplePath(slug: string) {
  return `/events/${slug}/people`
}

export function applyPath(slug: string) {
  return `/events/${slug}/apply`
}

export function personPath(slug: string, id: string) {
  return `/events/${slug}/people/${id}`
}

export function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}
