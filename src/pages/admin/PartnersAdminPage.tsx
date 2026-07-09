import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useTagOptions, tagLabel } from '../../lib/msc-tags'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { APPROVAL_STATUS_LABELS, PARTNER_ROLE_LABELS } from '../../types/msc-connect'
import type { PartnerIntake, PartnerApprovalStatus } from '../../types/msc-connect'

export function PartnersAdminPage() {
  const queryClient = useQueryClient()
  const { data: tags = [] } = useTagOptions()
  const [status, setStatus] = useState('')

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['admin-partners', status],
    queryFn: async () => {
      let query = supabase.from('partners').select('*').order('created_at', { ascending: false })
      if (status) query = query.eq('approval_status', status)
      const { data } = await query
      return (data ?? []) as PartnerIntake[]
    },
  })

  const approveMutation = useMutation({
    mutationFn: async ({ id, approval_status }: { id: string; approval_status: PartnerApprovalStatus }) => {
      const { error } = await supabase.from('partners').update({ approval_status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-partners'] }),
  })

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl text-ink">Partner / Mentor</h1>

      <div className="mb-6 max-w-xs">
        <Select
          label="สถานะอนุมัติ"
          value={status}
          onChange={setStatus}
          options={[
            { value: '', label: 'ทั้งหมด' },
            ...Object.entries(APPROVAL_STATUS_LABELS).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-ink-soft">กำลังโหลด...</div>
      ) : partners.length === 0 ? (
        <div className="card-elevated py-12 text-center text-ink-soft">ยังไม่มี Partner ลงทะเบียน</div>
      ) : (
        <div className="space-y-4">
          {partners.map((p) => (
            <div key={p.id} className="card-elevated p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg text-ink">{p.name_or_org}</h3>
                    <Badge variant={p.approval_status === 'approved' ? 'green' : p.approval_status === 'rejected' ? 'red' : 'gold'}>
                      {APPROVAL_STATUS_LABELS[p.approval_status]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{PARTNER_ROLE_LABELS[p.role_type]}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.industry_tags.map((t) => (
                      <Badge key={t} variant="default">{tagLabel(tags, t)}</Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.offer_tags.map((t) => (
                      <Badge key={t} variant="gold">{tagLabel(tags, t)}</Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-ink-soft">
                    {p.contact_email}{p.contact_line ? ` · Line: ${p.contact_line}` : ''}
                  </p>
                </div>
                {p.approval_status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approveMutation.mutate({ id: p.id, approval_status: 'approved' })}>
                      อนุมัติ
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => approveMutation.mutate({ id: p.id, approval_status: 'rejected' })}>
                      ปฏิเสธ
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
