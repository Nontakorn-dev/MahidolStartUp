import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatDateTime } from '../../lib/utils'
import { EVENT_STATUS_LABELS } from '../../lib/labels'
import type { Event } from '../../types'

export function EventsAdminPage() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('start_at', { ascending: false })
      return (data ?? []) as Event[]
    },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">จัดการกิจกรรม</h1>
        <Link to="/admin/events/new">
          <Button size="sm"><Plus className="h-4 w-4" /> สร้างใหม่</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" /></div>
      ) : events.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-ink-soft">ยังไม่มีกิจกรรมในระบบ</p>
          <p className="mt-2 text-xs text-ink-soft/80">
            หมายเหตุ: โครงการหลักของชมรม (Talent Accelerator, STL, TED Youth, Blue Horizon)
            ถูกกำหนดไว้ในโค้ด — กิจกรรมที่สร้างที่นี่จะแสดงเพิ่มบนหน้าเว็บ
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-wrap items-center justify-between gap-3 !p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-ink">{event.title}</h3>
                  <Badge variant={event.status === 'published' ? 'green' : 'default'}>
                    {EVENT_STATUS_LABELS[event.status] ?? event.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink-soft/70">เริ่ม {formatDateTime(event.start_at)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {event.status === 'published' && (
                  <Link to={`/events/${event.slug}`} target="_blank" className="px-2 text-sm text-ted-sky no-underline hover:underline">
                    ดูหน้าจริง ↗
                  </Link>
                )}
                <Link to={`/admin/events/${event.id}/edit`}>
                  <Button variant="ghost" size="sm" aria-label={`แก้ไข ${event.title}`}><Pencil className="h-4 w-4" /></Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
