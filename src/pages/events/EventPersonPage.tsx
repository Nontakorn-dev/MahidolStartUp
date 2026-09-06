import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Download, Users, UserPlus } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useClubEvent } from '../../lib/events'
import { AFFILIATION_LABELS } from '../../lib/constants'
import { JOIN_PATH_LABELS, peoplePath } from '../../lib/ted'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Textarea } from '../../components/ui/Textarea'
import { BackLink } from '../../components/ui/BackLink'
import { ArticleSkeleton } from '../../components/ui/Skeleton'
import type { ConnectionRequest, TedParticipant } from '../../types'

export function EventPersonPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const { event } = useClubEvent(slug)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')

  const { data: person, isLoading } = useQuery({
    queryKey: ['ted-person', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ted_participants')
        .select('*, profiles(full_name, affiliation, avatar_url, faculty)')
        .eq('id', id!)
        .maybeSingle()
      if (error) throw error
      return (data ?? null) as TedParticipant | null
    },
    enabled: !!id && isSupabaseConfigured,
  })

  const { data: existingRequest } = useQuery({
    queryKey: ['ted-connect', user?.id, person?.user_id, person?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('sender_id', user!.id)
        .eq('receiver_id', person!.user_id)
        .eq('target_id', person!.id)
        .maybeSingle()
      return (data ?? null) as ConnectionRequest | null
    },
    enabled: !!user && !!person && user.id !== person.user_id,
  })

  const { data: cvUrl, isError: cvFailed } = useQuery({
    queryKey: ['ted-cv', person?.cv_path, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(person!.cv_path!, 60 * 10)
      if (error) throw error
      return data.signedUrl
    },
    enabled: !!user && !!person?.cv_path,
  })

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!user || !person) throw new Error('Not authenticated')
      const { error } = await supabase.from('connection_requests').insert({
        sender_id: user.id,
        receiver_id: person.user_id,
        target_type: 'individual',
        target_id: person.id,
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

  if (!person) {
    return (
      <div className="wrap section-pad text-center">
        <h1 className="font-heading text-2xl text-ink">ไม่พบโปรไฟล์นี้</h1>
        <p className="mt-2 text-ink-soft">โปรไฟล์อาจถูกปิดการแสดงผลแล้ว</p>
        <Link to={peoplePath(slug ?? '')} className="btn-primary mt-6">
          ดูผู้สมัครทั้งหมด
        </Link>
      </div>
    )
  }

  const isOwner = user?.id === person.user_id
  const backTo = event ? peoplePath(event.slug) : '/events'

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-3xl">
        <BackLink to={backTo} className="mb-8">
          กลับไปหน้าค้นหาทีม
        </BackLink>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ted-light font-heading text-2xl text-ted-blue">
              {(person.display_name || '?').slice(0, 1)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl text-ink">{person.display_name}</h1>
                <Badge variant={person.path === 'has_team' ? 'navy' : 'gold'}>
                  {person.path === 'has_team' ? (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> {JOIN_PATH_LABELS.has_team}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <UserPlus className="h-3 w-3" /> {JOIN_PATH_LABELS.looking_for_team}
                    </span>
                  )}
                </Badge>
              </div>
              {person.team_name && (
                <p className="mt-1 font-medium text-ted-blue">{person.team_name}</p>
              )}
              <p className="mt-1 text-sm text-ink-soft">
                {[
                  person.faculty || person.profiles?.faculty,
                  person.profiles?.affiliation
                    ? AFFILIATION_LABELS[person.profiles.affiliation]
                    : null,
                  person.team_size ? `ทีม ${person.team_size} คน` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
          </div>
        </div>

        {person.idea && (
          <Card className="mt-8">
            <h2 className="font-heading text-lg text-ink">ไอเดีย</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{person.idea}</p>
          </Card>
        )}

        {person.bio && (
          <Card className="mt-4">
            <h2 className="font-heading text-lg text-ink">แนะนำตัว</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{person.bio}</p>
          </Card>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {person.skills.length > 0 && (
            <Card>
              <h2 className="font-heading text-lg text-ink">สกิล</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {person.skills.map((item) => (
                  <span key={item} className="rounded-full bg-ted-mist px-3 py-1 text-sm text-ink">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          )}
          {person.interests.length > 0 && (
            <Card>
              <h2 className="font-heading text-lg text-ink">ความสนใจ</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {person.interests.map((item) => (
                  <span key={item} className="rounded-full bg-gold-tint px-3 py-1 text-sm text-ink">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {person.looking_for.length > 0 && (
          <Card className="mt-4">
            <h2 className="font-heading text-lg text-ink">กำลังมองหา</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {person.looking_for.map((item) => (
                <span key={item} className="rounded-full border border-line px-3 py-1 text-sm text-ink">
                  {item}
                </span>
              ))}
            </div>
          </Card>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {person.cv_path && (
            user ? (
              cvUrl ? (
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Download className="h-4 w-4" /> เปิด CV / Resume
                </a>
              ) : cvFailed ? (
                <p className="self-center text-sm text-rose-700">เปิดไฟล์ CV ไม่ได้ ลองเข้าสู่ระบบใหม่</p>
              ) : (
                <Button variant="outline" disabled>
                  กำลังเตรียมไฟล์ CV...
                </Button>
              )
            ) : (
              <Link to="/login" state={{ from: { pathname: locationPath(slug, id) } }} className="btn-secondary">
                เข้าสู่ระบบเพื่อดู CV
              </Link>
            )
          )}

          {person.linkedin_url && (
            <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              LinkedIn
            </a>
          )}

          {isOwner ? (
            <Link to={`/events/${slug}/apply`} className="btn-primary">
              แก้ไขโปรไฟล์ของฉัน
            </Link>
          ) : !user ? (
            <Link to="/login" state={{ from: { pathname: locationPath(slug, id) } }} className="btn-primary">
              เข้าสู่ระบบเพื่อทักไปคุย
            </Link>
          ) : existingRequest ? (
            <Link to="/match/connections" className="btn-secondary">
              ส่งคำขอแล้ว — ดูสถานะ
            </Link>
          ) : (
            <Button onClick={() => setShowModal(true)}>ทักไปคุย</Button>
          )}
        </div>

        <Modal open={showModal} onClose={() => setShowModal(false)} title={`ทักไปหา ${person.display_name}`}>
          <Textarea
            label="ข้อความแนะนำตัว"
            hint="บอกสั้น ๆ ว่าอยากชวนเข้าทีม หรืออยากให้เขาชวนคุณ"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {connectMutation.isError && (
            <p className="mt-3 text-sm text-rose-700">{(connectMutation.error as Error).message}</p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              ยกเลิก
            </Button>
            <Button disabled={connectMutation.isPending} onClick={() => connectMutation.mutate()}>
              {connectMutation.isPending ? 'กำลังส่ง...' : 'ส่งคำขอ'}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

function locationPath(slug?: string, id?: string) {
  return `/events/${slug}/people/${id}`
}
