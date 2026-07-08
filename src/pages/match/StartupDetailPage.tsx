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
import { STAGE_LABELS, AFFILIATION_LABELS, LOOKING_FOR_OPTIONS } from '../../lib/constants'
import type { StartupProfile } from '../../types'

export function StartupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')

  const { data: startup, isLoading } = useQuery({
    queryKey: ['startup', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('startup_profiles')
        .select('*, profiles(full_name, affiliation, bio, avatar_url)')
        .eq('id', id!)
        .single()
      return data as StartupProfile
    },
    enabled: !!id,
  })

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!user || !startup) throw new Error('Not authenticated')
      const { error } = await supabase.from('connection_requests').insert({
        sender_id: user.id,
        receiver_id: startup.owner_id,
        target_type: 'startup',
        target_id: startup.id,
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

  if (!startup) {
    return <div className="py-20 text-center text-gray-500">ไม่พบโปรไฟล์</div>
  }

  const isOwner = user?.id === startup.owner_id

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mu-gold/15 text-2xl font-bold text-mu-navy">
          {startup.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-mu-navy">{startup.name}</h1>
          {startup.tagline && <p className="text-gray-600">{startup.tagline}</p>}
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="gold">{STAGE_LABELS[startup.stage]}</Badge>
            {startup.is_verified && <Badge variant="green">Verified</Badge>}
            {startup.profiles?.affiliation && <Badge>{AFFILIATION_LABELS[startup.profiles.affiliation]}</Badge>}
          </div>
        </div>
      </div>

      <Card className="mb-4">
        <h2 className="mb-2 font-semibold text-mu-navy">เกี่ยวกับ</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{startup.description || '—'}</p>
      </Card>

      {startup.industry.length > 0 && (
        <Card className="mb-4">
          <h2 className="mb-2 font-semibold text-mu-navy">Industry</h2>
          <div className="flex flex-wrap gap-1">{startup.industry.map((i) => <Badge key={i}>{i}</Badge>)}</div>
        </Card>
      )}

      {startup.looking_for.length > 0 && (
        <Card className="mb-4">
          <h2 className="mb-2 font-semibold text-mu-navy">กำลังมองหา</h2>
          <div className="flex flex-wrap gap-1">
            {startup.looking_for.map((l) => {
              const opt = LOOKING_FOR_OPTIONS.find((o) => o.value === l)
              return <Badge key={l} variant="blue">{opt?.label || l}</Badge>
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
          <Button onClick={() => connectMutation.mutate()} disabled={connectMutation.isPending}>
            {connectMutation.isPending ? 'กำลังส่ง...' : 'ส่งคำขอ'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
