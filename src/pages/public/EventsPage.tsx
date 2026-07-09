import { Calendar } from 'lucide-react'
import { PageHero } from '../../components/ui/PageHero'
import { EventCard } from '../../components/ui/EventCard'
import { getUpcomingEvents } from '../../data/events'

export function EventsPage() {
  const events = getUpcomingEvents()
  const [featured, ...rest] = events

  return (
    <div>
      <PageHero
        eyebrow="กิจกรรม & โครงการ"
        title="เปิดรับสมัครแล้ว"
        description="Talent Accelerator, Startup Thailand League, TED Youth Startup และ Blue Horizon — เลือกโครงการที่ใช่แล้วกดเข้าไปดูรายละเอียด"
      />

      <div className="wrap section-pad !pt-10">
        {events.length === 0 ? (
          <div className="card-elevated py-20 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-line" />
            <p className="text-ink-soft">ยังไม่มีกิจกรรม — ติดตามข่าวสารเร็ว ๆ นี้</p>
          </div>
        ) : (
          <>
            {/* Featured large poster card */}
            {featured && (
              <div className="mb-10">
                <EventCard event={featured} featured />
              </div>
            )}

            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
