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
      <div className="wrap relative py-12 md:py-16">
        {eyebrow && (
          <div className={cn('eyebrow', isDark && 'eyebrow-light')}>{eyebrow}</div>
        )}
        <h1
          className={cn(
            'mt-3.5 font-heading text-3xl leading-[1.3] md:text-4xl md:leading-[1.25]',
            isDark ? 'text-white' : 'text-ink',
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              'mt-4 max-w-2xl text-base leading-[1.8] md:text-lg',
              isDark ? 'text-hero-text' : 'text-ink-soft',
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  )
}
