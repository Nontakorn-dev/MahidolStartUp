import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Plus, Trash2, Rocket } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTagOptions } from '../../lib/msc-tags'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { STAGE_LABELS } from '../../types/msc-connect'
import type { IntakeStage, TeamMember } from '../../types/msc-connect'

function toggleTag(arr: string[], key: string) {
  return arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]
}

export function StartupRegisterPage() {
  const navigate = useNavigate()
  const { data: industryTags = [] } = useTagOptions('industry')
  const { data: needTags = [] } = useTagOptions('need_offer')

  const [startupName, setStartupName] = useState('')
  const [pitch, setPitch] = useState('')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: '', faculty: '', role: '' },
  ])
  const [email, setEmail] = useState('')
  const [line, setLine] = useState('')
  const [industry, setIndustry] = useState<string[]>([])
  const [needs, setNeeds] = useState<string[]>([])
  const [stage, setStage] = useState<IntakeStage>('idea')
  const [needDetail, setNeedDetail] = useState('')
  const [deckUrl, setDeckUrl] = useState('')
  const [consentPublic, setConsentPublic] = useState(false)
  const [consentPdpa, setConsentPdpa] = useState(false)

  const mutation = useMutation({
    mutationFn: async () => {
      const validTeam = teamMembers.filter((m) => m.name.trim())
      if (!validTeam.length) throw new Error('กรุณาระบุสมาชิกทีมอย่างน้อย 1 คน')

      const { error } = await supabase.from('startups').insert({
        startup_name: startupName.trim(),
        one_line_pitch: pitch.trim(),
        team_members: validTeam,
        contact_email: email.trim(),
        contact_line: line.trim() || null,
        industry_tags: industry,
        stage,
        need_tags: needs,
        need_detail: needDetail.trim() || null,
        pitch_deck_url: deckUrl.trim() || null,
        consent_public_directory: consentPublic,
        consent_pdpa: consentPdpa,
      })
      if (error) throw error
    },
    onSuccess: () => navigate('/register/success?type=startup'),
  })

  const updateMember = (idx: number, field: keyof TeamMember, value: string) => {
    setTeamMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)))
  }

  const canSubmit =
    startupName.trim() &&
    pitch.trim() &&
    email.trim() &&
    industry.length > 0 &&
    needs.length > 0 &&
    consentPdpa &&
    teamMembers.some((m) => m.name.trim())

  return (
    <div className="wrap section-pad">
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="eyebrow">MSC Connect</div>
        <h1 className="mt-2 font-heading text-2xl text-ink md:text-3xl">มีทีมแล้ว อยากหาพาร์ทเนอร์</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          เล่าให้ฟังหน่อยว่าทีมคุณทำอะไรและกำลังติดอะไรอยู่ ทีมงานจะช่วยมองหาเมนเทอร์หรือพาร์ทเนอร์ที่เข้ากับคุณ
          แล้วติดต่อกลับภายใน 7 วันทำการ
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="reg-form-section space-y-4">
          <div className="flex items-center gap-2 text-ink">
            <Rocket className="h-5 w-5 text-gold" />
            <h2 className="font-heading text-lg">ข้อมูล Startup</h2>
          </div>
          <Input label="ชื่อ Startup *" value={startupName} onChange={(e) => setStartupName(e.target.value)} />
          <Input
            label="One-line pitch *"
            placeholder="อธิบายสั้น ๆ ว่าทำอะไร (ไม่เกิน 150 ตัวอักษร)"
            value={pitch}
            maxLength={150}
            onChange={(e) => setPitch(e.target.value)}
          />
          <Select
            label="Stage *"
            value={stage}
            onChange={(v) => setStage(v as IntakeStage)}
            options={Object.entries(STAGE_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>

        <div className="reg-form-section space-y-4">
          <h2 className="font-heading text-lg text-ink">สมาชิกทีม *</h2>
          {teamMembers.map((member, idx) => (
            <div key={idx} className="grid gap-3 rounded-lg border border-line p-4 sm:grid-cols-3">
              <Input label="ชื่อ" value={member.name} onChange={(e) => updateMember(idx, 'name', e.target.value)} />
              <Input label="คณะ" value={member.faculty} onChange={(e) => updateMember(idx, 'faculty', e.target.value)} />
              <Input label="บทบาทในทีม" value={member.role} onChange={(e) => updateMember(idx, 'role', e.target.value)} />
              {teamMembers.length > 1 && (
                <button
                  type="button"
                  onClick={() => setTeamMembers((prev) => prev.filter((_, i) => i !== idx))}
                  className="flex items-center gap-1 text-sm text-rose-600 hover:underline sm:col-span-3"
                >
                  <Trash2 className="h-3.5 w-3.5" /> ลบสมาชิกคนนี้
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" onClick={() => setTeamMembers((prev) => [...prev, { name: '', faculty: '', role: '' }])}>
            <Plus className="h-4 w-4" /> เพิ่มสมาชิก
          </Button>
        </div>

        <div className="reg-form-section space-y-4">
          <h2 className="font-heading text-lg text-ink">Industry *</h2>
          <p className="text-sm text-ink-soft">เลือกได้มากกว่า 1 หมวด</p>
          <div className="tag-picker">
            {industryTags.map((tag) => (
              <button
                key={tag.tag_key}
                type="button"
                aria-pressed={industry.includes(tag.tag_key)}
                onClick={() => setIndustry((prev) => toggleTag(prev, tag.tag_key))}
                className={`tag-picker__btn ${industry.includes(tag.tag_key) ? 'tag-picker__btn--active' : ''}`}
              >
                {tag.label_th}
              </button>
            ))}
          </div>
        </div>

        <div className="reg-form-section space-y-4">
          <h2 className="font-heading text-lg text-ink">ต้องการอะไร (Need) *</h2>
          <p className="text-sm text-ink-soft">
            ยิ่งระบุชัด ทีมงานยิ่งจับคู่ให้ตรงได้เร็วขึ้น
          </p>
          <div className="tag-picker">
            {needTags.map((tag) => (
              <button
                key={tag.tag_key}
                type="button"
                aria-pressed={needs.includes(tag.tag_key)}
                onClick={() => setNeeds((prev) => toggleTag(prev, tag.tag_key))}
                className={`tag-picker__btn ${needs.includes(tag.tag_key) ? 'tag-picker__btn--active' : ''}`}
              >
                {tag.label_th}
              </button>
            ))}
          </div>
          <Textarea
            label="รายละเอียดเพิ่มเติม"
            placeholder="เล่าสั้น ๆ ว่าตอนนี้ติดอะไรอยู่ และอยากได้ความช่วยเหลือแบบไหน"
            value={needDetail}
            onChange={(e) => setNeedDetail(e.target.value)}
          />
        </div>

        <div className="reg-form-section space-y-4">
          <h2 className="font-heading text-lg text-ink">ติดต่อ</h2>
          <p className="text-sm text-ink-soft">
            ใช้สำหรับให้ทีมงานติดต่อกลับเท่านั้น — จะไม่แสดงบนหน้าเว็บสาธารณะ
          </p>
          <Input label="อีเมล *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Line ID" value={line} onChange={(e) => setLine(e.target.value)} />
          <Input label="Pitch deck URL" value={deckUrl} onChange={(e) => setDeckUrl(e.target.value)} placeholder="https://..." />
        </div>

        <div className="reg-form-section space-y-3">
          <label className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
            <input type="checkbox" checked={consentPdpa} onChange={(e) => setConsentPdpa(e.target.checked)} className="mt-1 rounded" />
            ยินยอมให้เก็บและใช้ข้อมูลติดต่อเพื่อการจับคู่ทางธุรกิจ ตามนโยบาย PDPA ของชมรม *
          </label>
          <label className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
            <input type="checkbox" checked={consentPublic} onChange={(e) => setConsentPublic(e.target.checked)} className="mt-1 rounded" />
            ยินยอมให้แสดงโปรไฟล์ทีมบนหน้าเว็บสาธารณะ (ชื่อทีม, pitch, ทีมงาน และสิ่งที่มองหา — ไม่รวมข้อมูลติดต่อ)
          </label>
        </div>

        {mutation.isError && (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            ส่งข้อมูลไม่สำเร็จ — {(mutation.error as Error).message}
          </p>
        )}

        {!canSubmit && (
          <p className="text-sm text-ink-soft">
            กรอกช่องที่มี * ให้ครบก่อนจึงจะส่งได้ (ชื่อทีม, pitch, สมาชิกทีม, อีเมล, Industry, Need และการยินยอม PDPA)
          </p>
        )}

        <Button
          onClick={() => mutation.mutate()}
          disabled={!canSubmit || mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? 'กำลังส่ง...' : 'เริ่มต้นหาพาร์ทเนอร์ของคุณ'}
        </Button>
      </div>
    </div>
  )
}

