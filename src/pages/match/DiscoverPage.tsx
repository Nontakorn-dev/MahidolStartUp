import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Rocket, GraduationCap, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHero } from '../../components/ui/PageHero'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { CardGridSkeleton } from '../../components/ui/Skeleton'
import { INDUSTRIES, STAGE_LABELS, AFFILIATION_LABELS } from '../../lib/constants'
import { AVAILABILITY_LABELS } from '../../lib/labels'
import { cn } from '../../lib/utils'
import type { StartupProfile, MentorProfile } from '../../types'

type TabType = 'startup' | 'mentor'

const TABS: { key: TabType; label: string; icon: typeof Rocket }[] = [
  { key: 'startup', label: 'Startup', icon: Rocket },
  { key: 'mentor', label: 'Mentor / Partner', icon: GraduationCap },
]

export function DiscoverPage() {
  const [tab, setTab] = useState<TabType>('startup')
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('')

  const { data: startups = [], isLoading: loadingStartups } = useQuery({
    queryKey: ['discover-startups', search, industry],
    queryFn: async () => {
      let query = supabase
        .from('startup_profiles')
        .select('*, profiles(full_name, affiliation, avatar_url)')
        .eq('is_public', true)

      if (industry) query = query.contains('industry', [industry])
      if (search) query = query.ilike('name', `%${search}%`)

      const { data } = await query.order('created_at', { ascending: false })
      return (data ?? []) as StartupProfile[]
    },
    enabled: tab === 'startup',
  })

  const { data: mentors = [], isLoading: loadingMentors } = useQuery({
    queryKey: ['discover-mentors', search, industry],
    queryFn: async () => {
      let query = supabase
        .from('mentor_profiles')
        .select('*, profiles(full_name, affiliation, avatar_url)')
        .eq('is_public', true)

      if (industry) query = query.contains('industries', [industry])

      const { data } = await query.order('created_at', { ascending: false })
      const rows = (data ?? []) as MentorProfile[]
      // ตาราง mentor ไม่มีคอลัมน์ชื่อ จึงกรองคำค้นฝั่ง client จากชื่อในโปรไฟล์
      if (!search) return rows
      const needle = search.toLowerCase()
      return rows.filter(
        (m) =>
          m.profiles?.full_name?.toLowerCase().includes(needle) ||
          m.title?.toLowerCase().includes(needle) ||
          m.expertise.some((e) => e.toLowerCase().includes(needle)),
      )
    },
    enabled: tab === 'mentor',
  })

  const isLoading = tab === 'startup' ? loadingStartups : loadingMentors
  const hasFilters = !!search || !!industry
  const resultCount = tab === 'startup' ? startups.length : mentors.length

  const resetFilters = () => {
    setSearch('')
    setIndustry('')
  }

  return (
    <div>
      <PageHero
        eyebrow="MSC Connect"
        title="ค้นหา Partner"
        description="ดูทีมที่กำลังมองหาความช่วยเหลือ หรือเมนเทอร์ที่พร้อมให้คำปรึกษา เจอคนที่ใช่แล้วทักไปได้เลย"
      />

      <div className="wrap section-pad !pt-10">
        <div className="mb-6 inline-flex rounded-xl border border-line bg-surface p-1" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                tab === t.key ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink',
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <Input
            placeholder={tab === 'startup' ? 'ค้นหาชื่อ Startup...' : 'ค้นหาชื่อ / ความเชี่ยวชาญ...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={industry}
            onChange={setIndustry}
            placeholder="ทุก Industry"
            options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
          />
        </div>

        {!isLoading && (
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            <span>พบ {resultCount} รายการ</span>
            {hasFilters && (
              <button onClick={resetFilters} className="font-semibold text-ted-blue hover:underline">
                ล้างตัวกรอง
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <CardGridSkeleton count={3} />
        ) : tab === 'startup' ? (
          startups.length === 0 ? (
            <Card className="py-16 text-center">
              <Search className="mx-auto mb-3 h-10 w-10 text-line" />
              <p className="font-heading text-lg text-ink">
                {hasFilters ? 'ไม่พบ Startup ที่ตรงกับตัวกรอง' : 'ยังไม่มี Startup profile'}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                {hasFilters
                  ? 'ลองล้างตัวกรองหรือเปลี่ยนคำค้นดู'
                  : 'เป็นทีมแรกที่สร้างโปรไฟล์ แล้วให้ Mentor และ Partner หาคุณเจอ'}
              </p>
              <Link to="/match/startup/new" className="btn-primary mt-5">สร้างโปรไฟล์ Startup</Link>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {startups.map((s) => (
                <Link key={s.id} to={`/match/startup/${s.id}`} className="no-underline">
                  <Card hover className="h-full">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-tint text-lg font-bold text-ink">
                        {s.name[0]}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading font-semibold text-ink">{s.name}</h3>
                        {s.tagline && <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{s.tagline}</p>}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Badge variant="gold">{STAGE_LABELS[s.stage] ?? s.stage}</Badge>
                          {s.profiles?.affiliation && (
                            <Badge>{AFFILIATION_LABELS[s.profiles.affiliation]}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )
        ) : mentors.length === 0 ? (
          <Card className="py-16 text-center">
            <GraduationCap className="mx-auto mb-3 h-10 w-10 text-line" />
            <p className="font-heading text-lg text-ink">
              {hasFilters ? 'ไม่พบ Mentor ที่ตรงกับตัวกรอง' : 'ยังไม่มี Mentor profile'}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
              {hasFilters
                ? 'ลองล้างตัวกรองหรือเปลี่ยนคำค้นดู'
                : 'ถ้าคุณอยากช่วยทีมนักศึกษา สร้างโปรไฟล์ Mentor ไว้ให้ทีมติดต่อได้เลย'}
            </p>
            <Link to="/match/mentor/new" className="btn-primary mt-5">สร้างโปรไฟล์ Mentor</Link>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => (
              <Link key={m.id} to={`/match/mentor/${m.id}`} className="no-underline">
                <Card hover className="h-full">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-semibold text-ink">{m.profiles?.full_name ?? 'Mentor'}</h3>
                    <Badge variant={m.availability === 'open' ? 'green' : 'default'}>
                      {AVAILABILITY_LABELS[m.availability] ?? m.availability}
                    </Badge>
                  </div>
                  {m.title && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{m.title}</p>}
                  {m.expertise.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.expertise.slice(0, 3).map((e) => <Badge key={e}>{e}</Badge>)}
                      {m.expertise.length > 3 && (
                        <Badge variant="default">+{m.expertise.length - 3}</Badge>
                      )}
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
