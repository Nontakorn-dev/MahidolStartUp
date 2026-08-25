import { Calendar } from 'lucide-react'
import { PageHero } from '../../components/ui/PageHero'
import { EventCard } from '../../components/ui/EventCard'
import { CardGridSkeleton } from '../../components/ui/Skeleton'
import { useClubEvents } from '../../lib/events'

export function EventsPage() {
  const { active, past, isLoading } = useClubEvents()
  const [featured, ...rest] = active

  return (
    <div>
      <PageHero
        eyebrow="กิจกรรมและโครงการ"
        title="กิจกรรมของชมรม"
        description="โครงการบ่มเพาะ การแข่งขัน และทุนสนับสนุน ที่ชมรมจัดร่วมกับ iNT มหิดล กดเข้าไปดูรายละเอียดและช่องทางสมัครได้เลย"
      />

      <div className="wrap section-pad !pt-10">
        {isLoading && active.length === 0 && past.length === 0 ? (
          <CardGridSkeleton count={3} />
        ) : active.length === 0 && past.length === 0 ? (
          <div className="card-elevated py-20 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-line" />
            <p className="text-ink-soft">ยังไม่มีกิจกรรม — ติดตามข่าวสารเร็ว ๆ นี้</p>
          </div>
        ) : (
          <>
            {active.length > 0 ? (
              <section>
                <div className="mb-6 flex items-baseline gap-3">
                  <h2 className="font-heading text-xl text-ink">กำลังเปิดรับสมัคร</h2>
                  <span className="text-sm text-ink-soft">{active.length} โครงการ</span>
                </div>

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
              </section>
            ) : (
              <div className="listing-empty">
                <p>ตอนนี้ยังไม่มีโครงการที่เปิดรับสมัคร — ดูโครงการที่ผ่านมาด้านล่างได้เลย</p>
              </div>
            )}

            {past.length > 0 && (
              <section className="mt-16 border-t border-line pt-12">
                <div className="mb-6 flex items-baseline gap-3">
                  <h2 className="font-heading text-xl text-ink">โครงการที่ผ่านมา</h2>
                  <span className="text-sm text-ink-soft">{past.length} โครงการ</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
