import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useTagOptions, tagLabel } from '../../lib/msc-tags'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { Modal } from '../../components/ui/Modal'
import { REQUEST_STATUS_LABELS } from '../../types/msc-connect'
import type { IntakeRequest, IntakeRequestStatus, PartnerIntake } from '../../types/msc-connect'

const COLUMNS: IntakeRequestStatus[] = ['new', 'in_progress', 'matched', 'closed']

export function RequestsAdminPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data: tags = [] } = useTagOptions()
  const [selected, setSelected] = useState<IntakeRequest | null>(null)
  const [partnerId, setPartnerId] = useState('')
  const [followup, setFollowup] = useState('')

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('intake_requests')
        .select('*, startups(*)')
        .order('created_at', { ascending: false })
      return (data ?? []) as IntakeRequest[]
    },
  })

  const { data: approvedPartners = [] } = useQuery({
    queryKey: ['admin-approved-partners'],
    queryFn: async () => {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('approval_status', 'approved')
        .order('name_or_org')
      return (data ?? []) as PartnerIntake[]
    },
    enabled: !!selected,
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string
      status: IntakeRequestStatus
      matched_partner_id?: string | null
      followup_notes?: string
    }) => {
      const updates: Record<string, unknown> = {
        status: payload.status,
        followup_notes: payload.followup_notes ?? null,
      }
      if (payload.status === 'matched' && payload.matched_partner_id) {
        updates.matched_partner_id = payload.matched_partner_id
        updates.matched_at = new Date().toISOString()
        updates.matched_by_admin_id = user?.id
      }
      const { error } = await supabase.from('intake_requests').update(updates).eq('id', payload.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] })
      setSelected(null)
      setPartnerId('')
      setFollowup('')
    },
  })

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col] = requests.filter((r) => r.status === col)
    return acc
  }, {} as Record<IntakeRequestStatus, IntakeRequest[]>)

  const filteredPartners = selected
    ? approvedPartners.filter((p) =>
        p.offer_tags.some((o) => selected.requested_need_tags.includes(o)),
      )
    : approvedPartners

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl text-ink">Request Board</h1>
      <p className="mb-6 text-sm text-ink-soft">จับคู่ Startup กับ Partner แบบ manual — ลากหรือคลิกเพื่อจัดการ</p>

      {isLoading ? (
        <div className="py-12 text-center text-ink-soft">กำลังโหลด...</div>
      ) : (
        <div className="request-board">
          {COLUMNS.map((col) => (
            <div key={col} className="request-column">
              <div className="request-column__header flex items-center justify-between">
                <span>{REQUEST_STATUS_LABELS[col]}</span>
                <Badge>{grouped[col].length}</Badge>
              </div>
              {grouped[col].map((req) => (
                <button
                  key={req.id}
                  type="button"
                  className="request-card w-[calc(100%-20px)] text-left"
                  onClick={() => {
                    setSelected(req)
                    setPartnerId(req.matched_partner_id ?? '')
                    setFollowup(req.followup_notes ?? '')
                  }}
                >
                  <div className="font-semibold text-ink">{req.startups?.startup_name ?? '—'}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-ink-soft">{req.startups?.one_line_pitch}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {req.requested_need_tags.slice(0, 2).map((t) => (
                      <Badge key={t} variant="gold">{tagLabel(tags, t)}</Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="รายละเอียดคำขอ">
        {selected?.startups && (
          <div className="space-y-4">
            <div>
              <h3 className="font-heading text-lg text-ink">{selected.startups.startup_name}</h3>
              <p className="text-sm text-ink-soft">{selected.startups.one_line_pitch}</p>
              <p className="mt-2 text-xs text-ink-soft">
                ติดต่อ: {selected.startups.contact_email}
                {selected.startups.contact_line ? ` · Line: ${selected.startups.contact_line}` : ''}
              </p>
            </div>

            <Select
              label="สถานะ"
              value={selected.status}
              onChange={(v) => updateMutation.mutate({ id: selected.id, status: v as IntakeRequestStatus, followup_notes: followup })}
              options={COLUMNS.map((c) => ({ value: c, label: REQUEST_STATUS_LABELS[c] }))}
            />

            <Select
              label="จับคู่กับ Partner"
              value={partnerId}
              onChange={setPartnerId}
              options={[
                { value: '', label: '— เลือก Partner —' },
                ...filteredPartners.map((p) => ({ value: p.id, label: `${p.name_or_org} (${p.role_type})` })),
                ...approvedPartners
                  .filter((p) => !filteredPartners.find((fp) => fp.id === p.id))
                  .map((p) => ({ value: p.id, label: `${p.name_or_org} (อื่น)` })),
              ]}
            />

            <Textarea label="บันทึก Follow-up" value={followup} onChange={(e) => setFollowup(e.target.value)} />

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  updateMutation.mutate({
                    id: selected.id,
                    status: 'matched',
                    matched_partner_id: partnerId || null,
                    followup_notes: followup,
                  })
                }
                disabled={!partnerId || updateMutation.isPending}
              >
                บันทึกการจับคู่
              </Button>
              <Button variant="secondary" onClick={() => setSelected(null)}>ปิด</Button>
            </div>

            <p className="text-xs text-ink-soft">
              ส่ง intro message ผ่านอีเมล/Line ด้วยตนเอง (Edge Function จะเพิ่มใน Sprint ถัดไป)
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
