import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useTagOptions, tagLabel } from '../../lib/msc-tags'
import { Badge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Select'
import { STAGE_LABELS } from '../../types/msc-connect'
import type { StartupIntake } from '../../types/msc-connect'

export function StartupsAdminPage() {
  const { data: tags = [] } = useTagOptions()
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState('')

  const { data: startups = [], isLoading } = useQuery({
    queryKey: ['admin-startups', industry, stage],
    queryFn: async () => {
      let query = supabase.from('startups').select('*').order('created_at', { ascending: false })
      if (industry) query = query.contains('industry_tags', [industry])
      if (stage) query = query.eq('stage', stage)
      const { data } = await query
      return (data ?? []) as StartupIntake[]
    },
  })

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl text-ink">Startup ที่สมัครเข้ามา</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Select
          label="Industry"
          value={industry}
          onChange={setIndustry}
          options={[{ value: '', label: 'ทั้งหมด' }, ...tags.filter((t) => t.tag_group === 'industry').map((t) => ({ value: t.tag_key, label: t.label_th }))]}
        />
        <Select
          label="Stage"
          value={stage}
          onChange={setStage}
          options={[{ value: '', label: 'ทั้งหมด' }, ...Object.entries(STAGE_LABELS).map(([value, label]) => ({ value, label }))]}
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-ink-soft">กำลังโหลด...</div>
      ) : startups.length === 0 ? (
        <div className="card-elevated py-12 text-center text-ink-soft">ยังไม่มี Startup สมัครเข้ามา</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อ</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Industry</th>
                <th className="px-4 py-3 font-medium">ต้องการ</th>
                <th className="px-4 py-3 font-medium">ติดต่อ</th>
                <th className="px-4 py-3 font-medium">วันที่</th>
              </tr>
            </thead>
            <tbody>
              {startups.map((s) => (
                <tr key={s.id} className="border-b border-line/60 hover:bg-paper/50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{s.startup_name}</div>
                    <div className="text-xs text-ink-soft">{s.one_line_pitch}</div>
                  </td>
                  <td className="px-4 py-3"><Badge>{STAGE_LABELS[s.stage]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.industry_tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="default">{tagLabel(tags, t)}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.need_tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="gold">{tagLabel(tags, t)}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-soft">
                    <div>{s.contact_email}</div>
                    {s.contact_line && <div>Line: {s.contact_line}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-soft">
                    {new Date(s.created_at).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-sm text-ink-soft">
        จับคู่ได้ที่ <Link to="/admin/requests" className="font-semibold text-ink hover:underline">Request Board</Link>
      </p>
    </div>
  )
}
