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
import { AFFILIATION_LABELS, CAN_OFFER_OPTIONS } from '../../lib/constants'
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
        .single()
      return data as MentorProfile
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
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" /></div>
  }

  if (!mentor) {
    return <div className="py-20 text-center text-gray-500">ไม่พบโปรไฟล์</div>
  }

  const isOwner = user?.id === mentor.owner_id

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-mu-navy">{mentor.profiles?.full_name}</h1>
      {mentor.title && <p className="mt-1 text-gray-600">{mentor.title}</p>}
      <div className="mt-2 flex flex-wrap gap-1">
        {mentor.is_verified && <Badge variant="green">Verified</Badge>}
        {mentor.profiles?.affiliation && <Badge>{AFFILIATION_LABELS[mentor.profiles.affiliation]}</Badge>}
        <Badge variant="gold">{mentor.availability}</Badge>
      </div>

      {mentor.profiles?.bio && (
        <Card className="mt-6">
          <h2 className="mb-2 font-semibold text-mu-navy">เกี่ยวกับ</h2>
          <p className="text-gray-600">{mentor.profiles.bio}</p>
        </Card>
      )}

      {mentor.expertise.length > 0 && (
        <Card className="mt-4">
          <h2 className="mb-2 font-semibold text-mu-navy">Expertise</h2>
          <div className="flex flex-wrap gap-1">{mentor.expertise.map((e) => <Badge key={e}>{e}</Badge>)}</div>
        </Card>
      )}

      {mentor.can_offer.length > 0 && (
        <Card className="mt-4">
          <h2 className="mb-2 font-semibold text-mu-navy">สิ่งที่ให้ได้</h2>
          <div className="flex flex-wrap gap-1">
            {mentor.can_offer.map((c) => {
              const opt = CAN_OFFER_OPTIONS.find((o) => o.value === c)
              return <Badge key={c} variant="blue">{opt?.label || c}</Badge>
            })}
          </div>
        </Card>
      )}

      <div className="mt-6 flex gap-3">
        {!isOwner && user && (
          <Button onClick={() => setShowModal(true)}>ส่งคำขอเชื่อมต่อ</Button>
        )}
        {!user && <Link to="/login"><Button>เข้าสู่ระบบเพื่อเชื่อมต่อ</Button></Link>}
        <Link to="/match/discover"><Button variant="ghost">← กลับ</Button></Link>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="ส่งคำขอเชื่อมต่อ">
        <Textarea
          label="ข้อความ"
          placeholder="แนะนำตัวและบอกว่าทำไมอยากเชื่อมต่อ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowModal(false)}>ยกเลิก</Button>
          <Button onClick={() => connectMutation.mutate()} disabled={connectMutation.isPending}>ส่งคำขอ</Button>
        </div>
      </Modal>
    </div>
  )
}
