import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, MapPin } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { ClubEvent } from '../../data/events'

const STATUS_LABEL: Record<ClubEvent['status'], string> = {
  open: 'เปิดรับสมัคร',
  upcoming: 'เร็ว ๆ นี้',
  closed: 'ปิดรับแล้ว',
}

const STATUS_CLASS: Record<ClubEvent['status'], string> = {
  open: 'event-card__status--open',
  upcoming: 'event-card__status--upcoming',
  closed: 'event-card__status--closed',
}

export function EventCard({
  event,
  featured = false,
  className,
}: {
  event: ClubEvent
  featured?: boolean
  className?: string
}) {
  return (
    <Link
      to={`/events/${event.slug}`}
      className={cn('event-card group block no-underline', featured && 'event-card--featured', className)}
    >
      <article className="event-card__inner">
        <div className="event-card__media">
          <img
            src={event.coverImage}
            alt={event.title}
            className="event-card__img"
            loading="lazy"
          />
          <div className="event-card__overlay" />
          <span className="event-card__category">{event.category}</span>
          <span className={cn('event-card__status', STATUS_CLASS[event.status])}>
            {STATUS_LABEL[event.status]}
          </span>
        </div>

        <div className="event-card__body">
          <div className="event-card__meta">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {event.deadlineLabel}
            </span>
            {event.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {event.location}
              </span>
            )}
          </div>

          <h3 className="event-card__title">{event.title}</h3>
          <p className="event-card__desc">{event.tagline}</p>

          {event.highlights.length > 0 && (
            <ul className="event-card__chips">
              {event.highlights.slice(0, featured ? 4 : 2).map((h) => (
                <li key={h} className="event-card__chip">{h}</li>
              ))}
            </ul>
          )}

          <span className="event-card__cta">
            ดูรายละเอียด <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  )
}

export function EventCardGrid({
  events,
  className,
}: {
  events: ClubEvent[]
  className?: string
}) {
  if (events.length === 0) return null

  const [featured, ...rest] = events

  return (
    <div className={cn('event-grid', className)}>
      {featured && <EventCard event={featured} featured className="event-grid__featured" />}
      {rest.length > 0 && (
        <div className="event-grid__list">
          {rest.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
