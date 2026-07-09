import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Handshake } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTagOptions } from '../../lib/msc-tags'
import { PageHero } from '../../components/ui/PageHero'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { PARTNER_ROLE_LABELS, STAGE_LABELS } from '../../types/msc-connect'
import type { IntakeStage, PartnerRoleType } from '../../types/msc-connect'

function toggleTag(arr: string[], key: string) {
  return arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]
}

export function PartnerRegisterPage() {
  const navigate = useNavigate()
  const { data: industryTags = [] } = useTagOptions('industry')
  const { data: offerTags = [] } = useTagOptions('need_offer')

  const [name, setName] = useState('')
  const [roleType, setRoleType] = useState<PartnerRoleType>('mentor')
  const [email, setEmail] = useState('')
  const [line, setLine] = useState('')
  const [industry, setIndustry] = useState<string[]>([])
  const [offers, setOffers] = useState<string[]>([])
  const [stages, setStages] = useState<IntakeStage[]>([])
  const [availability, setAvailability] = useState('')
  const [note, setNote] = useState('')
  const [consentPdpa, setConsentPdpa] = useState(false)

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('partners').insert({
        name_or_org: name.trim(),
        role_type: roleType,
        contact_email: email.trim(),
        contact_line: line.trim() || null,
        industry_tags: industry,
        offer_tags: offers,
        interested_stages: stages.length ? stages : null,
        availability_note: availability.trim() || null,
        additional_note: note.trim() || null,
        consent_pdpa: consentPdpa,
      })
      if (error) throw error
    },
    onSuccess: () => navigate('/register/success?type=partner'),
  })

  const canSubmit =
    name.trim() && email.trim() && industry.length > 0 && offers.length > 0 && consentPdpa

  return (
    <div>
      <PageHero
        eyebrow="MSC Connect"
        title="ฉันอยากเป็น Mentor / Partner"
        description="เข้าร่วมเครือข่ายพาร์ทเนอร์ของ Mahidol Startup Club — ทีมงานจะตรวจสอบและติดต่อกลับภายใน 7 วันทำการ"
      />

      <div className="wrap section-pad !pt-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="reg-form-section space-y-4">
            <div className="flex items-center gap-2 text-ink">
              <Handshake className="h-5 w-5 text-gold" />
              <h2 className="font-heading text-lg">ข้อมูลพาร์ทเนอร์</h2>
            </div>
            <Input label="ชื่อ / องค์กร *" value={name} onChange={(e) => setName(e.target.value)} />
            <Select
              label="บทบาท *"
              value={roleType}
              onChange={(v) => setRoleType(v as PartnerRoleType)}
              options={Object.entries(PARTNER_ROLE_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </div>

          <div className="reg-form-section space-y-4">
            <h2 className="font-heading text-lg text-ink">Industry ที่เชี่ยวชาญ *</h2>
            <div className="tag-picker">
              {industryTags.map((tag) => (
                <button
                  key={tag.tag_key}
                  type="button"
                  onClick={() => setIndustry((prev) => toggleTag(prev, tag.tag_key))}
                  className={`tag-picker__btn ${industry.includes(tag.tag_key) ? 'tag-picker__btn--active' : ''}`}
                >
                  {tag.label_th}
                </button>
              ))}
            </div>
          </div>

          <div className="reg-form-section space-y-4">
            <h2 className="font-heading text-lg text-ink">ให้อะไรได้บ้าง (Offer) *</h2>
            <div className="tag-picker">
              {offerTags.map((tag) => (
                <button
                  key={tag.tag_key}
                  type="button"
                  onClick={() => setOffers((prev) => toggleTag(prev, tag.tag_key))}
                  className={`tag-picker__btn ${offers.includes(tag.tag_key) ? 'tag-picker__btn--active' : ''}`}
                >
                  {tag.label_th}
                </button>
              ))}
            </div>
          </div>

          <div className="reg-form-section space-y-4">
            <h2 className="font-heading text-lg text-ink">Stage ที่สนใจร่วมงาน (ไม่บังคับ)</h2>
            <div className="tag-picker">
              {Object.entries(STAGE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStages((prev) => toggleTag(prev, key) as IntakeStage[])}
                  className={`tag-picker__btn ${stages.includes(key as IntakeStage) ? 'tag-picker__btn--active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Textarea label="ความพร้อม / เวลาที่สะดวก" value={availability} onChange={(e) => setAvailability(e.target.value)} />
            <Textarea label="หมายเหตุเพิ่มเติม" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="reg-form-section space-y-4">
            <h2 className="font-heading text-lg text-ink">ติดต่อ</h2>
            <Input label="อีเมล *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Line ID" value={line} onChange={(e) => setLine(e.target.value)} />
          </div>

          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={consentPdpa} onChange={(e) => setConsentPdpa(e.target.checked)} className="mt-1 rounded" />
            ยินยอมให้เก็บและใช้ข้อมูลติดต่อเพื่อการจับคู่ทางธุรกิจ ตามนโยบาย PDPA ของชมรม *
          </label>

          {mutation.isError && (
            <p className="text-sm text-rose-600">{(mutation.error as Error).message}</p>
          )}

          <Button
            onClick={() => mutation.mutate()}
            disabled={!canSubmit || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? 'กำลังส่ง...' : 'ลงทะเบียนเป็นพาร์ทเนอร์'}
          </Button>
        </div>
      </div>
    </div>
  )
}
