import type { ClubEventStatus } from '../data/events'
import type {
  Availability,
  ConnectionStatus,
  EventStatus,
  PostStatus,
  UserRole,
} from '../types'

/**
 * ป้ายกำกับภาษาไทยกลางของทั้งเว็บ — ห้ามโชว์ค่า enum ดิบ (pending, draft, open)
 * ให้ผู้ใช้เห็นบนหน้าเว็บ
 */

export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
  pending: 'รอการตอบรับ',
  accepted: 'ตอบรับแล้ว',
  declined: 'ปฏิเสธแล้ว',
  expired: 'หมดอายุ',
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  open: 'รับเพิ่มได้',
  limited: 'รับได้จำกัด',
  closed: 'ยังไม่ว่าง',
}

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'ฉบับร่าง',
  published: 'เผยแพร่แล้ว',
  archived: 'เก็บเข้าคลัง',
}

/** สถานะการรับสมัครที่ผู้ใช้เห็นบนการ์ด/หน้ารายละเอียดกิจกรรม */
export const CLUB_EVENT_STATUS_LABELS: Record<ClubEventStatus, string> = {
  open: 'เปิดรับสมัคร',
  upcoming: 'เร็ว ๆ นี้',
  closed: 'ปิดรับแล้ว',
}

/** สถานะการเผยแพร่ในระบบหลังบ้าน */
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: 'ฉบับร่าง',
  published: 'เผยแพร่แล้ว',
  cancelled: 'ยกเลิก',
  completed: 'จบแล้ว',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  member: 'สมาชิก',
  pr: 'ทีม PR',
  core_team: 'Core Team',
  admin: 'ผู้ดูแลระบบ',
}

const POST_CATEGORY_LABELS: Record<string, string> = {
  announcement: 'ประกาศ',
  workshop: 'เวิร์กช็อป',
  competition: 'การแข่งขัน',
  'success-story': 'Success Story',
  success_story: 'Success Story',
  featured_startup: 'Startup แนะนำ',
  general: 'ข่าวสารทั่วไป',
  news: 'ข่าวสาร',
  event: 'กิจกรรม',
}

export function postCategoryLabel(category?: string | null): string {
  if (!category) return 'ข่าวสาร'
  return POST_CATEGORY_LABELS[category] ?? category
}

/** ตัวเลือกหมวดหมู่สำหรับ CMS — ค่าเก็บใน DB คือ key, ที่แสดงคือภาษาไทย */
export const POST_CATEGORY_OPTIONS = [
  'announcement',
  'workshop',
  'competition',
  'success-story',
  'general',
].map((value) => ({ value, label: postCategoryLabel(value) }))
