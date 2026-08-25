import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * รองรับหัวข้อภาษาไทย — เดิม `\w` ตัดอักษรไทยทิ้งหมด ทำให้ทุกบทความไทย
 * ได้ slug เป็น post-1754... ที่อ่านไม่รู้เรื่องและซ้ำกันเองได้
 */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .normalize('NFC')
      // เก็บ a-z, 0-9, อักษรไทย (U+0E00–U+0E7F), ช่องว่าง และขีด
      .replace(/[^a-z0-9฀-๿\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `post-${Date.now()}`
  )
}

/**
 * เว็บใช้ภาษาไทยและข้อความที่เขียนไว้ในเนื้อหาใช้ พ.ศ. (เช่น "สมัครถึง 28 ก.พ. 2569")
 * date-fns ให้ปี ค.ศ. — ถ้าไม่แปลง หน้าเดียวกันจะมีทั้ง 2026 และ 2569 ปนกัน
 */
function toBuddhistYear(date: Date) {
  return date.getFullYear() + 543
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return `${format(d, 'd MMM', { locale: th })} ${toBuddhistYear(d)}`
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return `${format(d, 'd MMM', { locale: th })} ${toBuddhistYear(d)} ${format(d, 'HH:mm')} น.`
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: th })
}

export function tiptapToText(content: Record<string, unknown> | null): string {
  if (!content || !content.content) return ''
  const extract = (nodes: unknown[]): string => {
    return nodes
      .map((node) => {
        const n = node as { type?: string; text?: string; content?: unknown[] }
        if (n.text) return n.text
        if (n.content) return extract(n.content)
        return ''
      })
      .join(' ')
  }
  return extract(content.content as unknown[]).trim()
}

export function excerpt(text: string, max = 150): string {
  if (text.length <= max) return text
  return text.slice(0, max).trim() + '...'
}
