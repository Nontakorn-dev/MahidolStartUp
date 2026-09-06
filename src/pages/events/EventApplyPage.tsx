import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Users, UserPlus, FileUp, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useClubEvent } from '../../lib/events'
import { effectiveStatus } from '../../data/events'
import {
  JOIN_PATH_LABELS,
  TED_INTERESTS,
  TED_ROLES,
  TED_SKILLS,
  peoplePath,
  toggleValue,
} from '../../lib/ted'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BackLink } from '../../components/ui/BackLink'
import { ArticleSkeleton } from '../../components/ui/Skeleton'
import type { TedJoinPath, TedParticipant } from '../../types'
import { cn } from '../../lib/utils'

const MAX_CV_BYTES = 5 * 1024 * 1024
const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function isAllowedCv(file: File) {
  if (CV_TYPES.includes(file.type)) return true
  return /\.(pdf|docx?)$/i.test(file.name)
}

export function EventApplyPage() {
  const { slug } = useParams<{ slug: string }>()
  const { event, isLoading: eventLoading } = useClubEvent(slug)
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [path, setPath] = useState<TedJoinPath | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [faculty, setFaculty] = useState('')
  const [bio, setBio] = useState('')
  const [idea, setIdea] = useState('')
  const [teamName, setTeamName] = useState('')
  const [teamSize, setTeamSize] = useState('3')
  const [skills, setSkills] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [lookingFor, setLookingFor] = useState<string[]>([])
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [lineId, setLineId] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvError, setCvError] = useState('')
  const [removeCv, setRemoveCv] = useState(false)

  const { data: existing, isLoading: existingLoading } = useQuery({
    queryKey: ['ted-apply', slug, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ted_participants')
        .select('*')
        .eq('user_id', user!.id)
        .eq('event_slug', slug!)
        .maybeSingle()
      if (error) throw error
      return (data ?? null) as TedParticipant | null
    },
    enabled: !!user && !!slug && isSupabaseConfigured,
  })

  useEffect(() => {
    if (!existing) {
      setDisplayName((prev) => prev || profile?.full_name || '')
      setFaculty((prev) => prev || profile?.faculty || '')
      setLineId((prev) => prev || profile?.line_id || '')
      setLinkedinUrl((prev) => prev || profile?.linkedin_url || '')
      setBio((prev) => prev || profile?.bio || '')
      return
    }
    setPath(existing.path)
    setDisplayName(existing.display_name)
    setFaculty(existing.faculty ?? '')
    setBio(existing.bio ?? '')
    setIdea(existing.idea ?? '')
    setTeamName(existing.team_name ?? '')
    setTeamSize(existing.team_size ? String(existing.team_size) : '3')
    setSkills(existing.skills ?? [])
    setInterests(existing.interests ?? [])
    setLookingFor(existing.looking_for ?? [])
    setLinkedinUrl(existing.linkedin_url ?? '')
    setLineId(existing.line_id ?? '')
    setIsPublic(existing.is_public)
    setRemoveCv(false)
    setCvFile(null)
  }, [existing, profile])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user || !slug || !path) throw new Error('กรอกข้อมูลไม่ครบ')
      if (!displayName.trim()) throw new Error('กรุณากรอกชื่อที่ต้องการให้คนอื่นเห็น')

      let cvPath = removeCv ? null : existing?.cv_path ?? null
      let cvFileName = removeCv ? null : existing?.cv_file_name ?? null

      if (cvFile) {
        const safeName = cvFile.name.replace(/[^\w.\-ก-๙]+/g, '_')
        const filePath = `${user.id}/${slug}/${Date.now()}-${safeName}`
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, cvFile, { upsert: true })
        if (uploadError) throw uploadError
        cvPath = filePath
        cvFileName = cvFile.name
      }

      const payload = {
        user_id: user.id,
        event_slug: slug,
        path,
        display_name: displayName.trim(),
        faculty: faculty.trim() || null,
        bio: bio.trim() || null,
        idea: idea.trim() || null,
        team_name: path === 'has_team' ? teamName.trim() || null : teamName.trim() || null,
        team_size: path === 'has_team' ? Number(teamSize) || null : null,
        skills,
        interests,
        looking_for: lookingFor,
        cv_path: cvPath,
        cv_file_name: cvFileName,
        linkedin_url: linkedinUrl.trim() || null,
        line_id: lineId.trim() || null,
        is_public: isPublic,
      }

      const query = existing
        ? supabase.from('ted_participants').update(payload).eq('id', existing.id)
        : supabase.from('ted_participants').insert(payload)

      const { data, error } = await query.select().single()
      if (error) throw error

      const profilePatch: Record<string, string> = {}
      if (lineId.trim()) profilePatch.line_id = lineId.trim()
      if (faculty.trim()) profilePatch.faculty = faculty.trim()
      if (linkedinUrl.trim()) profilePatch.linkedin_url = linkedinUrl.trim()
      if (Object.keys(profilePatch).length > 0) {
        await supabase.from('profiles').update(profilePatch).eq('id', user.id)
      }

      return data as TedParticipant
    },
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: ['ted-apply', slug, user?.id] })
      queryClient.invalidateQueries({ queryKey: ['ted-people', slug] })
      navigate(peoplePath(slug!), { state: { justApplied: row.id } })
    },
  })

  const onPickCv = (file: File | undefined) => {
    setCvError('')
    if (!file) return
    if (!isAllowedCv(file)) {
      setCvError('แนบได้เฉพาะไฟล์ PDF หรือ Word')
      return
    }
    if (file.size > MAX_CV_BYTES) {
      setCvError('ไฟล์ต้องไม่เกิน 5 MB')
      return
    }
    setRemoveCv(false)
    setCvFile(file)
  }

  const closed = event ? effectiveStatus(event) === 'closed' : false
  const canApply = !!event?.applyPath && !closed

  const ready = useMemo(() => {
    if (!path || !displayName.trim()) return false
    if (path === 'has_team' && !teamName.trim()) return false
    return true
  }, [path, displayName, teamName])

  if (eventLoading || existingLoading) {
    return (
      <div className="wrap section-pad max-w-2xl">
        <ArticleSkeleton />
      </div>
    )
  }

  if (!event || !canApply) {
    return (
      <div className="wrap section-pad text-center">
        <h1 className="font-heading text-2xl text-ink">ยังไม่เปิดรับสมัครบนเว็บ</h1>
        <p className="mt-2 text-ink-soft">โครงการนี้อาจปิดรับแล้ว หรือยังไม่มีฟอร์มสมัครในระบบ</p>
        <Link to={event ? `/events/${event.slug}` : '/events'} className="btn-primary mt-6">
          กลับไปหน้าโครงการ
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-2xl">
        <BackLink to={`/events/${event.slug}`} className="mb-8">
          กลับไปหน้า {event.shortTitle}
        </BackLink>

        <h1 className="font-heading text-3xl text-ink">สมัครและหาทีม</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          {existing
            ? 'อัปเดตโปรไฟล์ได้ตลอด ระหว่างเปิดรับสมัคร คนอื่นจะค้นพบคุณจากสกิลและความสนใจที่กรอกไว้'
            : 'เลือกเส้นทางด้านล่าง แล้วกรอกสกิล ความสนใจ และแนบ CV ได้ถ้ามี — คนอื่นในโครงการจะค้นพบคุณได้'}
        </p>

        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            ระบบสมัครยังไม่เชื่อมฐานข้อมูล ติดต่อทีมชมรมให้ตั้งค่าก่อน
          </p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPath('has_team')}
            className={cn('ted-path-card ted-path-card--team', path === 'has_team' && 'ted-path-card--active')}
          >
            <Users className="h-6 w-6" />
            <span className="ted-path-card__kicker">เส้นทาง A</span>
            <strong>{JOIN_PATH_LABELS.has_team}</strong>
            <span>ลงทะเบียนในนามทีม แล้วค้นหาสมาชิกเพิ่มได้</span>
          </button>
          <button
            type="button"
            onClick={() => setPath('looking_for_team')}
            className={cn('ted-path-card ted-path-card--solo', path === 'looking_for_team' && 'ted-path-card--active')}
          >
            <UserPlus className="h-6 w-6" />
            <span className="ted-path-card__kicker">เส้นทาง B</span>
            <strong>{JOIN_PATH_LABELS.looking_for_team}</strong>
            <span>กรอกสกิลและความสนใจ ให้ระบบช่วยจับคู่ทีม</span>
          </button>
        </div>

        {path && (
          <Card className="mt-8 space-y-5">
            <Input
              label="ชื่อที่แสดง *"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <Input
              label="คณะ / สาขา"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="เช่น วิศวกรรมศาสตร์, ICT, วิทยาศาสตร์"
            />

            {path === 'has_team' && (
              <>
                <Input
                  label="ชื่อทีม *"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
                <Input
                  label="จำนวนสมาชิกตอนนี้"
                  type="number"
                  min={1}
                  max={12}
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                />
              </>
            )}

            <Textarea
              label={path === 'has_team' ? 'ไอเดียของทีม' : 'ไอเดียหรือสิ่งที่อยากทำ'}
              hint="ไม่ต้องสมบูรณ์ — แค่ให้คนอื่นรู้ว่าคุณสนใจอะไร"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <Textarea
              label="แนะนำตัวสั้น ๆ"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="ทักษะ ประสบการณ์ หรือสิ่งที่อยากได้จากเพื่อนร่วมทีม"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">สกิล</label>
              <div className="tag-picker">
                {TED_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSkills(toggleValue(skills, skill))}
                    className={cn('tag-picker__btn', skills.includes(skill) && 'tag-picker__btn--active')}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">ความสนใจ / โจทย์</label>
              <div className="tag-picker">
                {TED_INTERESTS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setInterests(toggleValue(interests, item))}
                    className={cn('tag-picker__btn', interests.includes(item) && 'tag-picker__btn--active')}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">กำลังมองหา</label>
              <div className="tag-picker">
                {TED_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setLookingFor(toggleValue(lookingFor, role))}
                    className={cn('tag-picker__btn', lookingFor.includes(role) && 'tag-picker__btn--active')}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink">CV / Resume (ไม่บังคับ)</p>
              <label className="ted-cv-drop">
                <FileUp className="h-5 w-5" />
                <span>
                  {cvFile
                    ? cvFile.name
                    : existing?.cv_file_name && !removeCv
                      ? existing.cv_file_name
                      : 'เลือกไฟล์ PDF หรือ Word ไม่เกิน 5 MB'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  className="sr-only"
                  onChange={(e) => onPickCv(e.target.files?.[0])}
                />
              </label>
              {(cvFile || (existing?.cv_file_name && !removeCv)) && (
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
                  onClick={() => {
                    setCvFile(null)
                    setRemoveCv(true)
                  }}
                >
                  <X className="h-3.5 w-3.5" /> เอาไฟล์ออก
                </button>
              )}
              {cvError && <p className="mt-1 text-xs text-red-600">{cvError}</p>}
            </div>

            <Input
              label="Line ID"
              hint="จะโชว์ให้อีกฝ่ายเมื่อตอบรับคำขอเชื่อมต่อแล้ว"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
            />
            <Input
              label="LinkedIn URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />

            <label className="flex items-start gap-2 rounded-lg bg-flow-bg p-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-1 rounded"
              />
              <span>
                ให้คนอื่นในโครงการค้นพบฉันได้
                <span className="mt-0.5 block text-xs text-ink-soft/80">
                  ถ้าไม่ติ๊ก ใบสมัครจะถูกบันทึกแต่จะไม่ขึ้นในหน้าค้นหาทีม
                </span>
              </span>
            </label>

            {mutation.isError && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                บันทึกไม่สำเร็จ — {(mutation.error as Error).message}
              </p>
            )}

            <Button
              className="w-full"
              disabled={!ready || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending
                ? 'กำลังบันทึก...'
                : existing
                  ? 'อัปเดตโปรไฟล์'
                  : 'บันทึกแล้วไปค้นหาทีม'}
            </Button>
          </Card>
        )}

        {existing && (
          <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
            <Check className="h-4 w-4 text-emerald-600" />
            คุณสมัครไว้แล้ว — แก้ข้อมูลด้านบนได้ หรือ{' '}
            <Link to={peoplePath(event.slug)} className="font-semibold text-ink">
              ไปค้นหาเพื่อนร่วมทีม
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
