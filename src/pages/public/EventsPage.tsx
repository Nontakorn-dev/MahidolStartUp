import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { ImagePlaceholder } from '../../components/cms/MediaPicker'
import { formatDate } from '../../lib/utils'
import type { Event } from '../../types'

export function EventsPage() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events-all'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('start_at', { ascending: false })
      return (data ?? []) as Event[]
    },
  })

  const upcoming = events.filter((e) => new Date(e.start_at) >= new Date())
  const past = events.filter((e) => new Date(e.start_at) < new Date())

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-mu-navy">กิจกรรม</h1>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" />
        </div>
      ) : events.length === 0 ? (
        <Card className="py-16 text-center text-gray-500">
          <Calendar className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p>ยังไม่มีกิจกรรม — ติดตามข่าวสารเร็ว ๆ นี้</p>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-4 text-xl font-semibold text-mu-navy">กำลังจะมา</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-mu-navy">ที่ผ่านมา</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} past />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function EventCard({ event, past }: { event: Event; past?: boolean }) {
  return (
    <Link to={`/events/${event.slug}`}>
      <Card hover className="h-full overflow-hidden !p-0">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt="" className="h-44 w-full object-cover" />
        ) : (
          <ImagePlaceholder className="h-44 w-full" />
        )}
        <div className="p-5">
          <Badge variant={past ? 'default' : 'gold'}>{formatDate(event.start_at)}</Badge>
          <h3 className="mt-2 font-semibold text-mu-navy">{event.title}</h3>
          {event.location && <p className="mt-1 text-sm text-gray-500">{event.location}</p>}
        </div>
      </Card>
    </Link>
  )
}
