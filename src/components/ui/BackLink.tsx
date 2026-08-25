import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * ปุ่มย้อนกลับของหน้ารายละเอียด — เดิมเป็นข้อความเปล่า ๆ ลอยอยู่มุมบน
 * tone='dark' ใช้เมื่อวางบนพื้นเข้ม (hero), 'light' สำหรับพื้นสว่าง
 */
export function BackLink({
  to,
  children,
  tone = 'light',
  className,
}: {
  to: string
  children: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium no-underline transition-colors',
        tone === 'dark'
          ? 'border-white/25 bg-white/10 text-hero-text-strong backdrop-blur-sm hover:border-white/45 hover:bg-white/20 hover:text-white'
          : 'border-line bg-surface text-ink-soft hover:border-gold/50 hover:text-ink',
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
      {children}
    </Link>
  )
}
