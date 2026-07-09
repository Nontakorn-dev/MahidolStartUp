import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react'
import { getEventBySlug, getUpcomingEvents } from '../../data/events'
import { EventCard } from '../../components/ui/EventCard'
import { Button } from '../../components/ui/Button'

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const event = slug ? getEventBySlug(slug) : undefined
  const related = getUpcomingEvents().filter((e) => e.slug !== slug).slice(0, 3)

  if (!event) {
    return (
      <div className="wrap section-pad text-center">
        <p className="text-ink-soft">ไม่พบกิจกรรมนี้</p>
        <Link to="/events" className="mt-4 inline-block font-semibold text-ink hover:underline">
          กลับไปหน้ากิจกรรม
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Cover hero */}
      <div className="relative overflow-hidden bg-ink">
        <img
          src={event.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        <div className="wrap relative pb-12 pt-8 md:pb-16 md:pt-10">
          <Link
            to="/events"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-hero-text no-underline hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> กลับไปหน้ากิจกรรม
          </Link>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-gold px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
              {event.category}
            </span>
            <span className="rounded-md bg-white/15 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-sm">
              เปิดรับสมัคร
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl font-heading text-3xl leading-tight text-white md:text-4xl lg:text-[2.75rem]">
            {event.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-hero-text md:text-lg">
            {event.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-hero-text-strong">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              {event.deadlineLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              {event.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" />
              {event.organizer}
            </span>
          </div>

          {event.registrationUrl && (
            <div className="mt-8">
              <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-accent">
                <ExternalLink className="h-4 w-4" /> สมัครเลย
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="wrap section-pad !pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {/* Poster */}
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full object-cover"
              />
            </div>

            {/* Body */}
            <section>
              <h2 className="font-heading text-xl text-ink">เกี่ยวกับโครงการ</h2>
              <div className="mt-4 space-y-4">
                {event.body.map((para) => (
                  <p key={para.slice(0, 40)} className="text-base leading-relaxed text-ink-soft">
                    {para}
                  </p>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="font-heading text-xl text-ink">สิ่งที่คุณจะได้รับ</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {event.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-ink"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Roles */}
            {event.roles && event.roles.length > 0 && (
              <section>
                <h2 className="font-heading text-xl text-ink">ตำแหน่งที่เปิดรับ</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full border border-line bg-flow-bg px-4 py-2 text-sm font-semibold text-ink"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Eligibility */}
            {event.eligibility && event.eligibility.length > 0 && (
              <section>
                <h2 className="font-heading text-xl text-ink">คุณสมบัติผู้สมัคร</h2>
                <ul className="mt-4 space-y-2">
                  {event.eligibility.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-ink-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sticky CTA */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">สมัครเข้าร่วม</p>
              <h3 className="mt-2 font-heading text-lg text-ink">{event.shortTitle}</h3>
              <p className="mt-2 text-sm text-ink-soft">{event.deadlineLabel}</p>

              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-5 w-full"
                >
                  <ExternalLink className="h-4 w-4" /> ไปหน้าสมัคร
                </a>
              ) : (
                <Button className="mt-5 w-full" disabled>
                  ติดตามช่องทางสมัครเร็ว ๆ นี้
                </Button>
              )}

              <Link to="/events" className="mt-3 block text-center text-sm font-medium text-ink-soft no-underline hover:text-ink">
                ← ดูกิจกรรมอื่น
              </Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <h2 className="mb-6 font-heading text-xl text-ink">กิจกรรมอื่นที่น่าสนใจ</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
