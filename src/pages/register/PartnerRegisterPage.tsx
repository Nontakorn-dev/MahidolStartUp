import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Handshake } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTagOptions } from '../../lib/msc-tags'
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
    <div className="wrap section-pad">
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="eyebrow">MSC Connect</div>
        <h1 className="mt-2 font-heading text-2xl text-ink md:text-3xl">อยากช่วยทีมนักศึกษา</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          บอกเราหน่อยว่าคุณถนัดเรื่องไหนและช่วยทีมได้แบบไหน ทีมงานจะตรวจสอบข้อมูลแล้วติดต่อกลับภายใน 7 วันทำการ
        </p>
      </div>

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
          <h2 className="font-heading text-lg text-ink">Stage ที่สนใจร่วมงาน <span className="text-sm font-normal text-ink-soft">(ไม่บังคับ)</span></h2>
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
        </div>

        <div className="reg-form-section space-y-4">
          <h2 className="font-heading text-lg text-ink">ความพร้อมและหมายเหตุ <span className="text-sm font-normal text-ink-soft">(ไม่บังคับ)</span></h2>
          <Textarea
            label="ความพร้อม / เวลาที่สะดวก"
            placeholder="เช่น ว่างช่วงเย็นวันธรรมดา หรือรับปรึกษาออนไลน์เดือนละ 2 ครั้ง"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <Textarea label="หมายเหตุเพิ่มเติม" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="reg-form-section space-y-4">
          <h2 className="font-heading text-lg text-ink">ติดต่อ</h2>
          <p className="text-sm text-ink-soft">
            ใช้สำหรับให้ทีมงานติดต่อกลับเท่านั้น — จะไม่แสดงบนหน้าเว็บสาธารณะ
          </p>
          <Input label="อีเมล *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Line ID" value={line} onChange={(e) => setLine(e.target.value)} />
        </div>

        <div className="reg-form-section">
          <label className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
            <input type="checkbox" checked={consentPdpa} onChange={(e) => setConsentPdpa(e.target.checked)} className="mt-1 rounded" />
            ยินยอมให้เก็บและใช้ข้อมูลติดต่อเพื่อการจับคู่ทางธุรกิจ ตามนโยบาย PDPA ของชมรม *
          </label>
        </div>

        {mutation.isError && (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            ส่งข้อมูลไม่สำเร็จ — {(mutation.error as Error).message}
          </p>
        )}

        {!canSubmit && (
          <p className="text-sm text-ink-soft">
            กรอกช่องที่มี * ให้ครบก่อนจึงจะส่งได้ (ชื่อ, อีเมล, Industry, สิ่งที่ให้ได้ และการยินยอม PDPA)
          </p>
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
  )
}
