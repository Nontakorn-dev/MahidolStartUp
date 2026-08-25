import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Inbox, Send } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { timeAgo } from '../../lib/utils'
import { CONNECTION_STATUS_LABELS } from '../../lib/labels'
import type { ConnectionRequest, ConnectionStatus, Notification } from '../../types'

const STATUS_VARIANT: Record<ConnectionStatus, 'green' | 'red' | 'gold' | 'default'> = {
  accepted: 'green',
  declined: 'red',
  pending: 'gold',
  expired: 'default',
}

export function ConnectionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
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
    mutationFn: async (ids: string[]) => {
      await supabase.from('notifications').update({ is_read: true }).in('id', ids)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
    },
  })

  const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

  const openNotification = (n: Notification) => {
    if (!n.is_read) markReadMutation.mutate([n.id])
    if (n.link) navigate(n.link)
  }

  const received = connections.filter((c) => c.receiver_id === user?.id)
  const sent = connections.filter((c) => c.sender_id === user?.id)

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" /></div>
  }

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 font-heading text-2xl text-ink">คำขอเชื่อมต่อและการแจ้งเตือน</h1>
        <p className="mb-8 text-sm leading-relaxed text-ink-soft">
          พอตอบรับคำขอแล้ว Line ID ของอีกฝ่ายจะขึ้นให้เห็นในการ์ดคำขอนั้นทันที
        </p>

        {notifications.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg text-ink">การแจ้งเตือน</h2>
              {unreadIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markReadMutation.mutate(unreadIds)}
                  disabled={markReadMutation.isPending}
                >
                  อ่านทั้งหมด ({unreadIds.length})
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {notifications.map((n) => (
                <Card
                  key={n.id}
                  className={`!p-4 ${!n.is_read ? 'border-gold/40 bg-gold-tint/20' : ''}`}
                  onClick={() => openNotification(n)}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" aria-label="ยังไม่ได้อ่าน" />}
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{n.title}</p>
                      {n.body && <p className="text-sm text-ink-soft">{n.body}</p>}
                      <p className="mt-1 text-xs text-ink-soft/70">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="mb-4 font-heading text-lg text-ink">คำขอที่ได้รับ</h2>
          {received.length === 0 ? (
            <Card className="py-10 text-center">
              <Inbox className="mx-auto mb-3 h-8 w-8 text-line" />
              <p className="text-ink-soft">ยังไม่มีคำขอเข้ามา</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {received.map((c) => (
                <Card key={c.id} className="!p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-ink">{c.sender?.full_name}</p>
                      {c.message && <p className="mt-1 text-sm text-ink-soft">{c.message}</p>}
                      <p className="mt-1 text-xs text-ink-soft/70">{timeAgo(c.created_at)}</p>
                    </div>
                    <Badge variant={STATUS_VARIANT[c.status]}>
                      {CONNECTION_STATUS_LABELS[c.status]}
                    </Badge>
                  </div>
                  {c.status === 'pending' && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" disabled={respondMutation.isPending} onClick={() => respondMutation.mutate({ id: c.id, status: 'accepted' })}>ตอบรับ</Button>
                      <Button size="sm" variant="outline" disabled={respondMutation.isPending} onClick={() => respondMutation.mutate({ id: c.id, status: 'declined' })}>ปฏิเสธ</Button>
                    </div>
                  )}
                  {c.status === 'accepted' && (
                    <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                      {c.sender?.line_id
                        ? `ติดต่อได้ที่ Line: ${c.sender.line_id}`
                        : 'ตอบรับแล้ว — อีกฝ่ายยังไม่ได้ใส่ Line ID ไว้ในโปรไฟล์'}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-heading text-lg text-ink">คำขอที่ส่ง</h2>
          {sent.length === 0 ? (
            <Card className="py-10 text-center">
              <Send className="mx-auto mb-3 h-8 w-8 text-line" />
              <p className="text-ink-soft">ยังไม่ได้ส่งคำขอ</p>
              <Link to="/match/discover" className="btn-primary mt-4">ค้นหา Partner</Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {sent.map((c) => (
                <Card key={c.id} className="!p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-ink">ถึง: {c.receiver?.full_name}</p>
                      {c.message && <p className="mt-1 text-sm text-ink-soft">{c.message}</p>}
                      <p className="mt-1 text-xs text-ink-soft/70">{timeAgo(c.created_at)}</p>
                    </div>
                    <Badge variant={STATUS_VARIANT[c.status]}>
                      {CONNECTION_STATUS_LABELS[c.status]}
                    </Badge>
                  </div>
                  {c.status === 'accepted' && (
                    <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                      {c.receiver?.line_id
                        ? `ติดต่อได้ที่ Line: ${c.receiver.line_id}`
                        : 'ตอบรับแล้ว — อีกฝ่ายยังไม่ได้ใส่ Line ID ไว้ในโปรไฟล์'}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
