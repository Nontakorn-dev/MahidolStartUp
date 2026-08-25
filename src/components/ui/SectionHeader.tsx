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
    <div className={cn('mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between md:mb-12', className)}>
      <div className="max-w-2xl">
        <div className={cn('eyebrow', light && 'eyebrow-light')}>{eyebrow}</div>
        <h2 className={cn('mt-3.5 font-heading text-[1.65rem] leading-[1.35] md:text-[2rem]', light ? 'text-white' : 'text-ink')}>
          {title}
        </h2>
        {description && (
          <p className={cn('mt-3.5 max-w-xl text-[15px] leading-[1.8] md:text-base', light ? 'text-hero-text' : 'text-ink-soft')}>
            {description}
          </p>
        )}
      </div>
      {action ?? (actionHref && (
        <Link
          to={actionHref}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:border-ted-sky/40 hover:text-ted-blue sm:self-auto"
        >
          {actionLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      ))}
    </div>
  )
}
