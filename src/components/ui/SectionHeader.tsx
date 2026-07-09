import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  actionHref,
  actionLabel = 'ดูทั้งหมด',
  light = false,
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  action?: React.ReactNode
  actionHref?: string
  actionLabel?: string
  light?: boolean
  className?: string
}) {
  return (
    <div className={cn('mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12', className)}>
      <div className="max-w-xl">
        <div className={cn('eyebrow', light && 'eyebrow-light')}>{eyebrow}</div>
        <h2 className={cn('mt-2 font-heading text-2xl md:text-3xl', light ? 'text-white' : 'text-ink')}>
          {title}
        </h2>
        {description && (
          <p className={cn('mt-3 text-base leading-relaxed md:text-[17px]', light ? 'text-hero-text' : 'text-ink-soft')}>
            {description}
          </p>
        )}
      </div>
      {action ?? (actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink no-underline hover:text-ted-blue"
        >
          {actionLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      ))}
    </div>
  )
}
