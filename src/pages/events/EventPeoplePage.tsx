import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, UserPlus, Sparkles } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useClubEvent } from '../../lib/events'
import { AFFILIATION_LABELS } from '../../lib/constants'
import {
  JOIN_PATH_LABELS,
  applyPath,
  personPath,
  TED_ROLES,
  TED_SKILLS,
} from '../../lib/ted'
import { PageHero } from '../../components/ui/PageHero'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { BackLink } from '../../components/ui/BackLink'
import { CardGridSkeleton } from '../../components/ui/Skeleton'
import type { TedJoinPath, TedParticipant } from '../../types'
import { cn } from '../../lib/utils'

type Filter = 'all' | TedJoinPath

export function EventPeoplePage() {
  const { slug } = useParams<{ slug: string }>()
  const { event } = useClubEvent(slug)
  const { user } = useAuth()
  const location = useLocation()
  const justApplied = (location.state as { justApplied?: string } | null)?.justApplied

  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [skill, setSkill] = useState('')
  const [role, setRole] = useState('')

  const { data: people = [], isLoading } = useQuery({
    queryKey: ['ted-people', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ted_participants')
        .select('*, profiles(full_name, affiliation, avatar_url, faculty)')
        .eq('event_slug', slug!)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as TedParticipant[]
    },
    enabled: !!slug && isSupabaseConfigured,
  })

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return people.filter((p) => {
      if (filter !== 'all' && p.path !== filter) return false
      if (skill && !p.skills.includes(skill)) return false
      if (role && !p.looking_for.includes(role)) return false
      if (!needle) return true
      const hay = [
        p.display_name,
        p.team_name,
        p.faculty,
        p.bio,
        p.idea,
        ...p.skills,
        ...p.interests,
        ...p.looking_for,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(needle)
    })
  }, [people, filter, search, skill, role])

  const title = event?.shortTitle ?? 'โครงการ'

  return (
    <div>
      <PageHero
        eyebrow={title}
        title="ค้นหาเพื่อนร่วมทีม"
        description="ดูคนที่มีทีมแล้ว และคนที่กำลังหาทีม กดเข้าไปดูสกิล ไอเดีย และ CV แล้วทักไปคุยได้เลย"
      >
        <div className="flex flex-wrap gap-3">
          <Link to={applyPath(slug ?? '')} className="btn-accent">
            {user ? 'อัปเดตโปรไฟล์ของฉัน' : 'สมัครเพื่อให้คนอื่นค้นพบ'}
          </Link>
          {event && (
            <Link to={`/events/${event.slug}`} className="btn-secondary">
              ดูรายละเอียดโครงการ
            </Link>
          )}
        </div>
      </PageHero>

      <div className="wrap section-pad !pt-10">
        <BackLink to={event ? `/events/${event.slug}` : '/events'} className="mb-8">
          กลับไปหน้าโครงการ
        </BackLink>

        {justApplied && (
          <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            บันทึกโปรไฟล์แล้ว — เลื่อนดูคนอื่นในโครงการ แล้วทักไปคุยได้เลย
          </p>
        )}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Input
              label="ค้นหา"
              placeholder="ชื่อ, ทีม, สกิล, ไอเดีย"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="inline-flex rounded-xl border border-line bg-surface p-1" role="tablist">
            {([
              ['all', 'ทั้งหมด'],
              ['looking_for_team', 'กำลังหาทีม'],
              ['has_team', 'มีทีมแล้ว'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  filter === key ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSkill('')}
            className={cn('category-filter__pill', !skill && 'category-filter__pill--active')}
          >
            ทุกสกิล
          </button>
          {TED_SKILLS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSkill(skill === item ? '' : item)}
              className={cn('category-filter__pill', skill === item && 'category-filter__pill--active')}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {TED_ROLES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(role === item ? '' : item)}
              className={cn('category-filter__pill', role === item && 'category-filter__pill--active')}
            >
              หา {item}
            </button>
          ))}
        </div>

        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : visible.length === 0 ? (
          <Card className="py-16 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-line" />
            <p className="text-ink-soft">
              {people.length === 0
                ? 'ยังไม่มีใครลงโปรไฟล์ — เป็นคนแรกได้เลย'
                : 'ไม่พบคนที่ตรงกับตัวกรองนี้'}
            </p>
            <Link to={applyPath(slug ?? '')} className="btn-primary mt-5">
              กรอกโปรไฟล์ของฉัน
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((person) => (
              <Link
                key={person.id}
                to={personPath(slug!, person.id)}
                className="ted-person-card no-underline"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ted-light font-heading text-lg text-ted-blue">
                    {(person.display_name || '?').slice(0, 1)}
                  </div>
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
                <h2 className="mt-4 font-heading text-lg text-ink">{person.display_name}</h2>
                {person.team_name && (
                  <p className="mt-1 text-sm font-medium text-ted-blue">{person.team_name}</p>
                )}
                <p className="mt-1 text-sm text-ink-soft">
                  {person.faculty || person.profiles?.faculty || AFFILIATION_LABELS[person.profiles?.affiliation ?? 'mu_student']}
                </p>
                {person.idea && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{person.idea}</p>
                )}
                {person.skills.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {person.skills.slice(0, 4).map((item) => (
                      <li key={item} className="rounded-full bg-ted-mist px-2.5 py-0.5 text-xs font-medium text-ink">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {person.looking_for.length > 0 && (
                  <p className="mt-3 text-xs text-ink-soft">
                    มองหา {person.looking_for.slice(0, 3).join(', ')}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
