import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, MapPin } from 'lucide-react'
import { cn, formatDate } from '../../lib/utils'
import { ImagePlaceholder } from '../cms/MediaPicker'
import { deadlineDisplay, effectiveStatus, type ClubEvent, type ClubEventStatus } from '../../data/events'
import { CLUB_EVENT_STATUS_LABELS } from '../../lib/labels'

const STATUS_CLASS: Record<ClubEventStatus, string> = {
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
  const status = effectiveStatus(event)
  const isClosed = status === 'closed'

  return (
    <Link
      to={`/events/${event.slug}`}
      className={cn('event-card group block no-underline', featured && 'event-card--featured', className)}
    >
      <article className="event-card__inner">
        <div className="event-card__media">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt=""
              className="event-card__img"
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder className="h-full w-full" />
          )}
          <div className="event-card__overlay" />
          <span className="event-card__category">{event.category}</span>
          <span className={cn('event-card__status', STATUS_CLASS[status])}>
            {CLUB_EVENT_STATUS_LABELS[status]}
          </span>
        </div>

        <div className="event-card__body">
          <div className="event-card__meta">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {deadlineDisplay(event, formatDate)}
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
            {isClosed ? 'ดูสรุปโครงการ' : 'ดูรายละเอียด'}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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

  // การ์ดใบเดียวใน grid 2 คอลัมน์จะเหลือช่องว่างครึ่งจอ — ใช้เลย์เอาต์เต็มความกว้างแทน
  if (events.length === 1) {
    return <EventCard event={events[0]} featured className={className} />
  }

  return (
    <div className={cn('event-grid event-grid--uniform', className)}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
