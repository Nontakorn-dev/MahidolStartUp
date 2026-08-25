import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-line/50 text-ink-soft',
  gold: 'bg-gold-tint text-gold-deep',
  navy: 'bg-ink text-paper',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-50 text-blue-800',
  red: 'bg-red-50 text-red-700',
}

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}) {
  return (
    <span
      className={cn(
        // เดิมใช้ font-mono + uppercase ซึ่งไม่มีสระ/วรรณยุกต์ไทย ตัวอักษรไทยเลยตกฟอนต์
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold leading-6',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
