import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Textarea } from '../../components/ui/Textarea'
import { ArticleSkeleton } from '../../components/ui/Skeleton'
import { BackLink } from '../../components/ui/BackLink'
import { AFFILIATION_LABELS, CAN_OFFER_OPTIONS } from '../../lib/constants'
import { AVAILABILITY_LABELS } from '../../lib/labels'
import type { MentorProfile } from '../../types'

export function MentorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')

  const { data: mentor, isLoading } = useQuery({
    queryKey: ['mentor', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('mentor_profiles')
        .select('*, profiles(full_name, affiliation, bio, avatar_url)')
        .eq('id', id!)
        .maybeSingle()
      return (data ?? null) as MentorProfile | null
    },
    enabled: !!id,
  })

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!user || !mentor) throw new Error('Not authenticated')
      const { error } = await supabase.from('connection_requests').insert({
        sender_id: user.id,
        receiver_id: mentor.owner_id,
        target_type: 'mentor',
        target_id: mentor.id,
        message,
      })
      if (error) throw error
    },
    onSuccess: () => {
      setShowModal(false)
      navigate('/match/connections')
    },
  })

  if (isLoading) {
    return (
      <div className="wrap section-pad max-w-3xl">
        <ArticleSkeleton />
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="wrap section-pad text-center">
        <h1 className="font-heading text-2xl text-ink">ไม่พบโปรไฟล์นี้</h1>
        <p className="mt-2 text-ink-soft">โปรไฟล์อาจถูกปิดการแสดงผล หรือลิงก์หมดอายุแล้ว</p>
        <Link to="/match/discover" className="btn-primary mt-6">ดู Mentor ทั้งหมด</Link>
      </div>
    )
  }

  const isOwner = user?.id === mentor.owner_id

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-3xl">
        <BackLink to="/match/discover" className="mb-8">กลับไปหน้าค้นหา</BackLink>

        <h1 className="font-heading text-2xl text-ink">{mentor.profiles?.full_name}</h1>
        {mentor.title && <p className="mt-1 text-ink-soft">{mentor.title}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {mentor.is_verified && <Badge variant="green">ยืนยันแล้ว</Badge>}
          {mentor.profiles?.affiliation && <Badge>{AFFILIATION_LABELS[mentor.profiles.affiliation]}</Badge>}
          <Badge variant="gold">{AVAILABILITY_LABELS[mentor.availability] ?? mentor.availability}</Badge>
        </div>

        {mentor.profiles?.bio && (
          <Card className="mt-6">
            <h2 className="mb-2 font-heading text-lg text-ink">เกี่ยวกับ</h2>
            <p className="text-ink-soft">{mentor.profiles.bio}</p>
          </Card>
        )}

        {mentor.expertise.length > 0 && (
          <Card className="mt-4">
            <h2 className="mb-2 font-heading text-lg text-ink">Expertise</h2>
            <div className="flex flex-wrap gap-1">{mentor.expertise.map((e) => <Badge key={e}>{e}</Badge>)}</div>
          </Card>
        )}

        {mentor.can_offer.length > 0 && (
          <Card className="mt-4">
            <h2 className="mb-2 font-heading text-lg text-ink">สิ่งที่ให้ได้</h2>
            <div className="flex flex-wrap gap-1">
              {mentor.can_offer.map((c) => {
                const opt = CAN_OFFER_OPTIONS.find((o) => o.value === c)
                return <Badge key={c} variant="blue">{opt?.label || c}</Badge>
              })}
            </div>
          </Card>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {isOwner ? (
            <p className="text-sm text-ink-soft">นี่คือโปรไฟล์ของคุณเอง</p>
          ) : user ? (
            <Button onClick={() => setShowModal(true)}>ส่งคำขอเชื่อมต่อ</Button>
          ) : (
            <Link to="/login" className="btn-primary">เข้าสู่ระบบเพื่อเชื่อมต่อ</Link>
          )}
        </div>

        <Modal open={showModal} onClose={() => setShowModal(false)} title="ส่งคำขอเชื่อมต่อ">
          <Textarea
            label="ข้อความ"
            placeholder="แนะนำตัวและบอกว่าทำไมอยากเชื่อมต่อ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {connectMutation.isError && (
            <p className="mt-2 text-sm text-rose-600">
              ส่งคำขอไม่สำเร็จ — {(connectMutation.error as Error).message}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>ยกเลิก</Button>
            <Button
              onClick={() => connectMutation.mutate()}
              disabled={!message.trim() || connectMutation.isPending}
            >
              {connectMutation.isPending ? 'กำลังส่ง...' : 'ส่งคำขอ'}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
