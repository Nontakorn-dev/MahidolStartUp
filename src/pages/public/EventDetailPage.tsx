import { Link, useParams } from 'react-router-dom'
import {
  Calendar,
  ExternalLink,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react'
import { deadlineDisplay, effectiveStatus } from '../../data/events'
import { useClubEvent } from '../../lib/events'
import { EventCard } from '../../components/ui/EventCard'
import { BackLink } from '../../components/ui/BackLink'
import { CLUB_EVENT_STATUS_LABELS } from '../../lib/labels'
import { ArticleSkeleton } from '../../components/ui/Skeleton'
import { RichTextContent } from '../../components/cms/RichTextEditor'
import { Button } from '../../components/ui/Button'
import { cn, formatDate } from '../../lib/utils'

const STATUS_PILL: Record<string, string> = {
  open: 'bg-emerald-500/90 text-white',
  upcoming: 'bg-white/15 text-white backdrop-blur-sm',
  closed: 'bg-white/15 text-hero-text backdrop-blur-sm',
}

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { event, related, isLoading } = useClubEvent(slug)

  if (isLoading && !event) {
    return (
      <div className="wrap section-pad max-w-3xl">
        <ArticleSkeleton />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="wrap section-pad text-center">
        <h1 className="font-heading text-2xl text-ink">ไม่พบกิจกรรมนี้</h1>
        <p className="mt-2 text-ink-soft">กิจกรรมอาจถูกปิดหรือย้ายไปแล้ว</p>
        <Link to="/events" className="btn-primary mt-6">ดูกิจกรรมทั้งหมด</Link>
      </div>
    )
  }

  const status = effectiveStatus(event)
  const isClosed = status === 'closed'
  const hasRichBody = !!event.richBody && Object.keys(event.richBody).length > 0

  return (
    <div>
      {/* Cover hero */}
      <div className="relative overflow-hidden bg-ink">
        {/*
          ปกโครงการเป็นโปสเตอร์ที่มีตัวหนังสือแน่น ถ้าวางเป็นภาพคมชัดหลังหัวข้อจะอ่านไม่ออก
          จึงเบลอให้เป็นพื้นหลังเชิงบรรยากาศ (ภาพเต็มยังอยู่ในเนื้อหาด้านล่าง)
        */}
        {event.coverImage && (
          <img
            src={event.coverImage}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-[6px]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/65" />
        <div className="wrap relative pb-16 pt-10 md:pb-20 md:pt-14">
          <BackLink to="/events" tone="dark" className="mb-10">
            กลับไปหน้ากิจกรรม
          </BackLink>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-gold px-3 py-1.5 font-heading text-[13px] font-semibold leading-normal text-ink">
              {event.category}
            </span>
            <span className={cn('rounded-md px-3 py-1.5 font-heading text-[13px] font-semibold leading-normal', STATUS_PILL[status])}>
              {CLUB_EVENT_STATUS_LABELS[status]}
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl font-heading text-3xl leading-[1.3] text-white md:text-4xl md:leading-[1.25] lg:text-[2.75rem]">
            {event.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-[1.8] text-hero-text md:text-lg">
            {event.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm leading-relaxed text-hero-text-strong">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              {deadlineDisplay(event, formatDate)}
            </span>
            {event.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                {event.location}
              </span>
            )}
            {/* บางโครงการใส่ผู้จัดกับสถานที่เป็นค่าเดียวกัน ไม่ต้องโชว์ซ้ำ */}
            {event.organizer && event.organizer !== event.location && (
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-gold" />
                {event.organizer}
              </span>
            )}
          </div>

          {event.registrationUrl && !isClosed && (
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
            {event.coverImage && (
              <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Body */}
            {(event.body.length > 0 || hasRichBody) && (
              <section>
                <h2 className="font-heading text-xl text-ink">เกี่ยวกับโครงการ</h2>
                {hasRichBody ? (
                  <div className="prose mt-4 max-w-none">
                    <RichTextContent content={event.richBody!} />
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {event.body.map((para) => (
                      <p key={para.slice(0, 40)} className="text-base leading-relaxed text-ink-soft">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Highlights */}
            {event.highlights.length > 0 && (
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
            )}

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
              <p className="text-sm font-semibold text-ink-soft">
                {isClosed ? 'โครงการนี้ปิดรับแล้ว' : 'สมัครเข้าร่วม'}
              </p>
              <h3 className="mt-2 font-heading text-lg text-ink">{event.shortTitle}</h3>
              <p className="mt-2 text-sm text-ink-soft">
                {deadlineDisplay(event, formatDate)}
              </p>

              {isClosed ? (
                <>
                  <p className="mt-4 rounded-lg bg-flow-bg p-3 text-sm leading-relaxed text-ink-soft">
                    รอบนี้ปิดรับสมัครแล้ว — ติดตามรอบถัดไปได้จากหน้ากิจกรรม หรือลงชื่อไว้กับ MSC Connect
                  </p>
                  <Link to="/register/startup" className="btn-primary mt-4 w-full">
                    ลงชื่อกับ MSC Connect
                  </Link>
                </>
              ) : event.registrationUrl ? (
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
