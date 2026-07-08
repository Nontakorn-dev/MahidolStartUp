import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../lib/utils'
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
        <h1 className="text-2xl font-bold text-mu-navy">จัดการกิจกรรม</h1>
        <Link to="/admin/events/new">
          <Button size="sm"><Plus className="h-4 w-4" /> สร้างใหม่</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" /></div>
      ) : events.length === 0 ? (
        <Card className="py-12 text-center text-gray-500">ยังไม่มีกิจกรรม</Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="flex items-center justify-between !p-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-mu-navy">{event.title}</h3>
                  <Badge variant={event.status === 'published' ? 'green' : 'default'}>{event.status}</Badge>
                </div>
                <p className="text-xs text-gray-400">{formatDate(event.start_at)}</p>
              </div>
              <Link to={`/admin/events/${event.id}/edit`}>
                <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
