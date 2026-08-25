import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useTagOptions, tagLabel } from '../../lib/msc-tags'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Textarea } from '../../components/ui/Textarea'
import { ArticleSkeleton } from '../../components/ui/Skeleton'
import { BackLink } from '../../components/ui/BackLink'
import { STAGE_LABELS, AFFILIATION_LABELS, LOOKING_FOR_OPTIONS } from '../../lib/constants'
import { STAGE_LABELS as INTAKE_STAGE_LABELS } from '../../types/msc-connect'
import type { StartupIntake } from '../../types/msc-connect'
import type { StartupProfile } from '../../types'

/**
 * เส้นทาง /match/startup/:id ให้บริการข้อมูลสองแหล่ง
 *  - startup_profiles : โปรไฟล์ที่สมาชิกสร้างเองหลัง login
 *  - startups         : ทีมที่กรอกฟอร์ม MSC Connect และยอมให้ขึ้น public directory
 * เดิมหน้านี้อ่านแค่ตารางแรก การ์ด "Startup ที่กำลังโต" บนหน้าแรกจึงกดแล้วเจอ
 * "ไม่พบโปรไฟล์" ทุกครั้ง
 */

/** เลือกเฉพาะคอลัมน์ที่เปิดเผยได้ — ห้ามดึง contact_email / contact_line ลงฝั่ง client */
const INTAKE_PUBLIC_COLUMNS =
  'id, startup_name, one_line_pitch, team_members, industry_tags, stage, need_tags, need_detail, status, created_at'

type IntakePublic = Pick<
  StartupIntake,
  | 'id'
  | 'startup_name'
  | 'one_line_pitch'
  | 'team_members'
  | 'industry_tags'
  | 'stage'
  | 'need_tags'
  | 'need_detail'
  | 'status'
  | 'created_at'
>

export function StartupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: tags = [] } = useTagOptions()
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['startup-detail', id],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('startup_profiles')
        .select('*, profiles(full_name, affiliation, bio, avatar_url)')
        .eq('id', id!)
        .maybeSingle()

      if (profile) return { kind: 'profile' as const, profile: profile as StartupProfile }

      const { data: intake } = await supabase
        .from('startups')
        .select(INTAKE_PUBLIC_COLUMNS)
        .eq('id', id!)
        .maybeSingle()

      if (intake) return { kind: 'intake' as const, intake: intake as unknown as IntakePublic }
      return null
    },
    enabled: !!id,
  })

  const startup = data?.kind === 'profile' ? data.profile : null

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
    return (
      <div className="wrap section-pad max-w-3xl">
        <ArticleSkeleton />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="wrap section-pad text-center">
        <h1 className="font-heading text-2xl text-ink">ไม่พบโปรไฟล์นี้</h1>
        <p className="mt-2 text-ink-soft">โปรไฟล์อาจถูกปิดการแสดงผล หรือลิงก์หมดอายุแล้ว</p>
        <Link to="/match/discover" className="btn-primary mt-6">ดู Startup ทั้งหมด</Link>
      </div>
    )
  }

  /* ── ทีมจากฟอร์ม MSC Connect (public directory) ── */
  if (data.kind === 'intake') {
    const s = data.intake
    return (
      <div className="wrap section-pad">
        <div className="mx-auto max-w-3xl">
          <BackLink to="/match/discover" className="mb-8">กลับไปหน้าค้นหา</BackLink>

          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold-tint text-2xl font-bold text-ink">
              {s.startup_name[0]}
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-2xl text-ink">{s.startup_name}</h1>
              <p className="mt-1 text-ink-soft">{s.one_line_pitch}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="gold">{INTAKE_STAGE_LABELS[s.stage]}</Badge>
                {s.industry_tags.map((t) => (
                  <Badge key={t}>{tagLabel(tags, t)}</Badge>
                ))}
              </div>
            </div>
          </div>

          {s.need_tags.length > 0 && (
            <Card className="mt-6">
              <h2 className="mb-3 font-heading text-lg text-ink">กำลังมองหา</h2>
              <div className="flex flex-wrap gap-1.5">
                {s.need_tags.map((t) => (
                  <Badge key={t} variant="blue">{tagLabel(tags, t)}</Badge>
                ))}
              </div>
              {s.need_detail && (
                <p className="mt-4 whitespace-pre-wrap leading-relaxed text-ink-soft">{s.need_detail}</p>
              )}
            </Card>
          )}

          {s.team_members.length > 0 && (
            <Card className="mt-4">
              <h2 className="mb-3 flex items-center gap-2 font-heading text-lg text-ink">
                <Users className="h-4 w-4 text-gold" /> ทีม
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {s.team_members.map((m, i) => (
                  <li key={`${m.name}-${i}`} className="rounded-xl border border-line bg-paper p-4">
                    <p className="font-medium text-ink">{m.name}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {[m.role, m.faculty].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="mt-6 border-gold/30 bg-gold-tint/20">
            <h2 className="font-heading text-lg text-ink">อยากร่วมงานกับทีมนี้?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              เพื่อความปลอดภัยของข้อมูลตาม PDPA ช่องทางติดต่อจะไม่แสดงบนหน้าเว็บ —
              ลงทะเบียนเป็น Mentor/Partner แล้วทีมงานจะแนะนำตัวให้ทั้งสองฝ่ายเอง
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/register/partner" className="btn-primary">ลงทะเบียนเป็น Mentor/Partner</Link>
              <Link to="/match/discover" className="btn-secondary">ดูทีมอื่น</Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  /* ── โปรไฟล์ที่สมาชิกสร้างเอง ── */
  const profile = data.profile
  const isOwner = user?.id === profile.owner_id

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-3xl">
        <BackLink to="/match/discover" className="mb-8">กลับไปหน้าค้นหา</BackLink>

        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold-tint text-2xl font-bold text-ink">
            {profile.name[0]}
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl text-ink">{profile.name}</h1>
            {profile.tagline && <p className="text-ink-soft">{profile.tagline}</p>}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="gold">{STAGE_LABELS[profile.stage] ?? profile.stage}</Badge>
              {profile.is_verified && <Badge variant="green">ยืนยันแล้ว</Badge>}
              {profile.profiles?.affiliation && (
                <Badge>{AFFILIATION_LABELS[profile.profiles.affiliation]}</Badge>
              )}
            </div>
          </div>
        </div>

        <Card className="mb-4">
          <h2 className="mb-2 font-heading text-lg text-ink">เกี่ยวกับ</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-ink-soft">
            {profile.description || 'ทีมนี้ยังไม่ได้เขียนรายละเอียด'}
          </p>
        </Card>

        {profile.industry.length > 0 && (
          <Card className="mb-4">
            <h2 className="mb-2 font-heading text-lg text-ink">Industry</h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.industry.map((i) => <Badge key={i}>{i}</Badge>)}
            </div>
          </Card>
        )}

        {profile.looking_for.length > 0 && (
          <Card className="mb-4">
            <h2 className="mb-2 font-heading text-lg text-ink">กำลังมองหา</h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.looking_for.map((l) => {
                const opt = LOOKING_FOR_OPTIONS.find((o) => o.value === l)
                return <Badge key={l} variant="blue">{opt?.label || l}</Badge>
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
