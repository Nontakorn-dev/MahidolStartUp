import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `post-${Date.now()}`
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'd MMM yyyy', { locale: th })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'd MMM yyyy HH:mm', { locale: th })
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
