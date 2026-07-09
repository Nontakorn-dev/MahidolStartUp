import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, FileText, Calendar, Handshake, Rocket, Kanban } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/ui/Card'

export function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [users, posts, events, connections, startups, partners, newRequests, pendingPartners] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('connection_requests').select('*', { count: 'exact', head: true }),
        supabase.from('startups').select('*', { count: 'exact', head: true }),
        supabase.from('partners').select('*', { count: 'exact', head: true }),
        supabase.from('intake_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('partners').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending'),
      ])
      return {
        users: users.count ?? 0,
        posts: posts.count ?? 0,
        events: events.count ?? 0,
        connections: connections.count ?? 0,
        startups: startups.count ?? 0,
        partners: partners.count ?? 0,
        newRequests: newRequests.count ?? 0,
        pendingPartners: pendingPartners.count ?? 0,
      }
    },
  })

  const cards = [
    { label: 'Request ใหม่', value: stats?.newRequests ?? '—', icon: Kanban, to: '/admin/requests', highlight: true },
    { label: 'Partner รออนุมัติ', value: stats?.pendingPartners ?? '—', icon: Handshake, to: '/admin/partners', highlight: true },
    { label: 'Startups', value: stats?.startups ?? '—', icon: Rocket, to: '/admin/startups' },
    { label: 'Partners', value: stats?.partners ?? '—', icon: Handshake, to: '/admin/partners' },
    { label: 'ข่าวสาร', value: stats?.posts ?? '—', icon: FileText, to: '/admin/posts' },
    { label: 'กิจกรรม', value: stats?.events ?? '—', icon: Calendar, to: '/admin/events' },
    { label: 'ผู้ใช้', value: stats?.users ?? '—', icon: Users, to: '/admin/users' },
    { label: 'การเชื่อมต่อ', value: stats?.connections ?? '—', icon: Handshake, to: '/match/connections' },
  ]

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl text-ink">MSC Connect Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="no-underline">
            <Card hover className={card.highlight ? 'border-gold/40 bg-gold-tint/30' : ''}>
              <card.icon className="mb-2 h-6 w-6 text-gold" />
              <p className="text-2xl font-bold text-ink">{card.value}</p>
              <p className="text-sm text-ink-soft">{card.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/posts/new" className="no-underline">
          <Card hover className="text-center">
            <FileText className="mx-auto mb-2 h-8 w-8 text-gold" />
            <p className="font-semibold text-ink">สร้างข่าวสารใหม่</p>
          </Card>
        </Link>
        <Link to="/admin/requests" className="no-underline">
          <Card hover className="text-center">
            <Kanban className="mx-auto mb-2 h-8 w-8 text-gold" />
            <p className="font-semibold text-ink">ไปที่ Request Board</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
