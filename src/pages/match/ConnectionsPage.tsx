import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { timeAgo } from '../../lib/utils'
import type { ConnectionRequest, Notification } from '../../types'

export function ConnectionsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('connection_requests')
        .select('*, sender:profiles!sender_id(full_name, line_id), receiver:profiles!receiver_id(full_name, line_id)')
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order('created_at', { ascending: false })
      return (data ?? []) as ConnectionRequest[]
    },
    enabled: !!user,
  })

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20)
      return (data ?? []) as Notification[]
    },
    enabled: !!user,
  })

  const respondMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'declined' }) => {
      await supabase
        .from('connection_requests')
        .update({ status, responded_at: new Date().toISOString() })
        .eq('id', id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['connections'] }),
  })

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const received = connections.filter((c) => c.receiver_id === user?.id)
  const sent = connections.filter((c) => c.sender_id === user?.id)

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" /></div>
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-mu-navy">การเชื่อมต่อ & การแจ้งเตือน</h1>

      {notifications.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-mu-navy">การแจ้งเตือน</h2>
          <div className="space-y-2">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`!p-4 cursor-pointer ${!n.is_read ? 'border-mu-gold/30 bg-mu-gold/5' : ''}`}
                onClick={() => !n.is_read && markReadMutation.mutate(n.id)}
              >
                <p className="font-medium text-mu-navy">{n.title}</p>
                {n.body && <p className="text-sm text-gray-600">{n.body}</p>}
                <p className="mt-1 text-xs text-gray-400">{timeAgo(n.created_at)}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-mu-navy">คำขอที่ได้รับ</h2>
        {received.length === 0 ? (
          <Card className="text-center text-gray-500">ยังไม่มีคำขอ</Card>
        ) : (
          <div className="space-y-3">
            {received.map((c) => (
              <Card key={c.id} className="!p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-mu-navy">{c.sender?.full_name}</p>
                    {c.message && <p className="mt-1 text-sm text-gray-600">{c.message}</p>}
                    <p className="mt-1 text-xs text-gray-400">{timeAgo(c.created_at)}</p>
                  </div>
                  <Badge variant={c.status === 'accepted' ? 'green' : c.status === 'declined' ? 'red' : 'gold'}>
                    {c.status}
                  </Badge>
                </div>
                {c.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => respondMutation.mutate({ id: c.id, status: 'accepted' })}>ตอบรับ</Button>
                    <Button size="sm" variant="outline" onClick={() => respondMutation.mutate({ id: c.id, status: 'declined' })}>ปฏิเสธ</Button>
                  </div>
                )}
                {c.status === 'accepted' && c.sender?.line_id && (
                  <p className="mt-2 text-sm text-green-700">Line: {c.sender.line_id}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-mu-navy">คำขอที่ส่ง</h2>
        {sent.length === 0 ? (
          <Card className="text-center text-gray-500">ยังไม่ได้ส่งคำขอ</Card>
        ) : (
          <div className="space-y-3">
            {sent.map((c) => (
              <Card key={c.id} className="!p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-mu-navy">ถึง: {c.receiver?.full_name}</p>
                    {c.message && <p className="mt-1 text-sm text-gray-600">{c.message}</p>}
                    <p className="mt-1 text-xs text-gray-400">{timeAgo(c.created_at)}</p>
                  </div>
                  <Badge variant={c.status === 'accepted' ? 'green' : c.status === 'declined' ? 'red' : 'gold'}>
                    {c.status}
                  </Badge>
                </div>
                {c.status === 'accepted' && c.receiver?.line_id && (
                  <p className="mt-2 text-sm text-green-700">Line: {c.receiver.line_id}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
