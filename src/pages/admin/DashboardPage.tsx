import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, FileText, Calendar, Handshake } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/ui/Card'

export function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [users, posts, events, connections] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('connection_requests').select('*', { count: 'exact', head: true }),
      ])
      return {
        users: users.count ?? 0,
        posts: posts.count ?? 0,
        events: events.count ?? 0,
        connections: connections.count ?? 0,
      }
    },
  })

  const cards = [
    { label: 'ผู้ใช้', value: stats?.users ?? '—', icon: Users, to: '/admin/users' },
    { label: 'ข่าวสาร', value: stats?.posts ?? '—', icon: FileText, to: '/admin/posts' },
    { label: 'กิจกรรม', value: stats?.events ?? '—', icon: Calendar, to: '/admin/events' },
    { label: 'การเชื่อมต่อ', value: stats?.connections ?? '—', icon: Handshake, to: '/match/connections' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-mu-navy">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.to}>
            <Card hover>
              <card.icon className="mb-2 h-6 w-6 text-mu-gold" />
              <p className="text-2xl font-bold text-mu-navy">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/posts/new">
          <Card hover className="text-center">
            <FileText className="mx-auto mb-2 h-8 w-8 text-mu-gold" />
            <p className="font-semibold text-mu-navy">สร้างข่าวสารใหม่</p>
          </Card>
        </Link>
        <Link to="/admin/events/new">
          <Card hover className="text-center">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-mu-gold" />
            <p className="font-semibold text-mu-navy">สร้างกิจกรรมใหม่</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
