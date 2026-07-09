import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { ImagePlaceholder } from '../cms/MediaPicker'
import { industryBadgeClass } from './CategoryFilterBar'

export interface ListingCardProps {
  href: string
  title: string
  description?: string
  imageUrl?: string | null
  categoryTag?: string
  categoryKey?: string
  statusBadge?: { label: string; variant: 'open' | 'matched' | 'closed' | 'pending' }
  chips?: string[]
  className?: string
}

const STATUS_STYLES = {
  open: 'bg-emerald-600 text-white',
  matched: 'bg-ted-sky text-white',
  closed: 'bg-ink-soft/80 text-white',
  pending: 'bg-gold text-ink',
}

export function ListingCard({
  href,
  title,
  description,
  imageUrl,
  categoryTag,
  categoryKey,
  statusBadge,
  chips = [],
  className,
}: ListingCardProps) {
  return (
    <Link to={href} className={cn('listing-card group block no-underline', className)}>
      <article className="listing-card__inner">
        <div className="listing-card__media">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="listing-card__img" loading="lazy" />
          ) : (
            <ImagePlaceholder className="h-full w-full" />
          )}
          {categoryTag && (
            <span
              className={cn(
                'listing-card__category',
                industryBadgeClass(categoryKey ?? ''),
              )}
            >
              {categoryTag}
            </span>
          )}
          {statusBadge && (
            <span className={cn('listing-card__status', STATUS_STYLES[statusBadge.variant])}>
              {statusBadge.label}
            </span>
          )}
        </div>

        <div className="listing-card__body">
          <h3 className="listing-card__title">{title}</h3>
          {description && (
            <p className="listing-card__desc">{description}</p>
          )}
          {chips.length > 0 && (
            <div className="listing-card__chips">
              {chips.slice(0, 3).map((chip) => (
                <span key={chip} className="listing-card__chip">{chip}</span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export function ListingCardGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('listing-grid', className)}>{children}</div>
}

export function ListingEmptyState({ message }: { message: string }) {
  return (
    <div className="listing-empty">
      <p>{message}</p>
    </div>
  )
}
