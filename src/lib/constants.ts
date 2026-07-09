export const INDUSTRIES = [
  'HealthTech',
  'FinTech',
  'EdTech',
  'AgriTech',
  'FoodTech',
  'AI/ML',
  'Cybersecurity',
  'E-commerce',
  'SaaS',
  'Social Impact',
  'Biotech',
  'IoT',
  'Other',
] as const

export const LOOKING_FOR_OPTIONS = [
  { value: 'mentor', label: 'Mentor' },
  { value: 'funding', label: 'Funding' },
  { value: 'cofounder', label: 'Co-founder' },
  { value: 'tech', label: 'Technical Partner' },
  { value: 'business', label: 'Business Partner' },
  { value: 'customer', label: 'Early Customers' },
] as const

export const CAN_OFFER_OPTIONS = [
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'funding', label: 'Funding / Investment' },
  { value: 'introductions', label: 'Industry Introductions' },
  { value: 'technical', label: 'Technical Expertise' },
  { value: 'business', label: 'Business Strategy' },
  { value: 'legal', label: 'Legal / Compliance' },
] as const

export const STAGE_LABELS: Record<string, string> = {
  idea: 'ไอเดีย',
  mvp: 'MVP',
  early_revenue: 'มีรายได้เริ่มต้น',
  growth: 'Growth',
}

export const AFFILIATION_LABELS: Record<string, string> = {
  mu_student: 'นักศึกษามหิดล',
  mu_alumni: 'ศิษย์เก่ามหิดล',
  mu_faculty: 'อาจารย์/บุคลากรมหิดล',
  external: 'ภายนอกมหิดล',
}

export const POST_CATEGORIES = [
  'announcement',
  'workshop',
  'competition',
  'success-story',
  'general',
] as const

export const SITE_LOGO = '/content/logo/logo.png'

export const SOCIAL_ICONS = {
  line: '/content/icon/line.png',
  instagram: '/content/icon/instagram.png',
} as const

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/mahidolstartup_official',
  line: 'http://bit.ly/MahidolStartup',
}
