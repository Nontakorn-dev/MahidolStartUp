import { cn } from '../../lib/utils'

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  tone = 'light',
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  children?: React.ReactNode
  tone?: 'light' | 'dark'
}) {
  const isDark = tone === 'dark'

  return (
    <div
      className={cn(
        'relative overflow-hidden border-b',
        isDark
          ? 'hero-gradient hero-grid-bg border-transparent'
          : 'border-line bg-surface',
      )}
    >
      <div className="wrap relative py-10 md:py-14">
        {eyebrow && (
          <div className={cn('eyebrow', isDark && 'eyebrow-light')}>{eyebrow}</div>
        )}
        <h1
          className={cn(
            'mt-2 font-heading text-3xl md:text-4xl',
            isDark ? 'text-white' : 'text-ink',
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              'mt-3 max-w-2xl text-base leading-relaxed md:text-lg',
              isDark ? 'text-hero-text' : 'text-ink-soft',
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}
