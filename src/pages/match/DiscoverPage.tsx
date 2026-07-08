import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Rocket, GraduationCap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { INDUSTRIES, STAGE_LABELS, AFFILIATION_LABELS } from '../../lib/constants'
import type { StartupProfile, MentorProfile } from '../../types'

type TabType = 'startup' | 'mentor'

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
      return (data ?? []) as MentorProfile[]
    },
    enabled: tab === 'mentor',
  })

  const isLoading = tab === 'startup' ? loadingStartups : loadingMentors

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-mu-navy">ค้นหา Partner</h1>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab('startup')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'startup' ? 'bg-mu-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Rocket className="h-4 w-4" /> Startup
        </button>
        <button
          onClick={() => setTab('mentor')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'mentor' ? 'bg-mu-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Mentor / Partner
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Input
          placeholder="ค้นหาชื่อ..."
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

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" />
        </div>
      ) : tab === 'startup' ? (
        startups.length === 0 ? (
          <Card className="py-16 text-center text-gray-500">
            <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p>ยังไม่มี Startup profile — <Link to="/match/startup/new" className="text-mu-gold hover:underline">สร้างโปรไฟล์แรก</Link></p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {startups.map((s) => (
              <Link key={s.id} to={`/match/startup/${s.id}`}>
                <Card hover>
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mu-gold/15 text-lg font-bold text-mu-navy">
                      {s.name[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-mu-navy">{s.name}</h3>
                      {s.tagline && <p className="mt-0.5 truncate text-sm text-gray-500">{s.tagline}</p>}
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="gold">{STAGE_LABELS[s.stage]}</Badge>
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
      ) : (
        mentors.length === 0 ? (
          <Card className="py-16 text-center text-gray-500">
            <GraduationCap className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p>ยังไม่มี Mentor profile — <Link to="/match/mentor/new" className="text-mu-gold hover:underline">สร้างโปรไฟล์แรก</Link></p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => (
              <Link key={m.id} to={`/match/mentor/${m.id}`}>
                <Card hover>
                  <h3 className="font-semibold text-mu-navy">{m.profiles?.full_name}</h3>
                  {m.title && <p className="mt-1 text-sm text-gray-500">{m.title}</p>}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.expertise.slice(0, 3).map((e) => <Badge key={e}>{e}</Badge>)}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}
