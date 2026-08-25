import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { INDUSTRIES, CAN_OFFER_OPTIONS } from '../../lib/constants'
import { AVAILABILITY_LABELS } from '../../lib/labels'
import type { Availability } from '../../types'

export function CreateMentorProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [expertise, setExpertise] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [canOffer, setCanOffer] = useState<string[]>([])
  const [availability, setAvailability] = useState<Availability>('open')
  const [isPublic, setIsPublic] = useState(true)
  const [customExpertise, setCustomExpertise] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase.from('mentor_profiles').insert({
        owner_id: user.id,
        title,
        expertise,
        industries,
        can_offer: canOffer,
        availability,
        is_public: isPublic,
      }).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => navigate(`/match/mentor/${data.id}`),
  })

  const toggleArray = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  const addExpertise = () => {
    const value = customExpertise.trim()
    if (value && !expertise.includes(value)) {
      setExpertise([...expertise, value])
    }
    setCustomExpertise('')
  }

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-2xl text-ink">สร้าง Mentor / Partner Profile</h1>
        <p className="mb-6 mt-2 text-sm leading-relaxed text-ink-soft">
          บอกความเชี่ยวชาญและสิ่งที่คุณช่วยทีมนักศึกษาได้ เพื่อให้ทีมที่กำลังมองหาส่งคำขอมาหาคุณ
        </p>
        <Card className="space-y-4">
          <Input label="ตำแหน่ง / Title" placeholder="เช่น Product Manager at ..." value={title} onChange={(e) => setTitle(e.target.value)} />

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">ความเชี่ยวชาญ</label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  placeholder="เช่น Product Design, Go-to-Market"
                  value={customExpertise}
                  onChange={(e) => setCustomExpertise(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addExpertise()
                    }
                  }}
                />
              </div>
              <Button type="button" variant="outline" onClick={addExpertise} disabled={!customExpertise.trim()}>
                เพิ่ม
              </Button>
            </div>
            {expertise.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {expertise.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setExpertise(expertise.filter((x) => x !== e))}
                    aria-label={`ลบ ${e}`}
                    className="rounded-full bg-ink px-3 py-1 text-xs text-white transition-colors hover:bg-ink-soft"
                  >
                    {e} ×
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Industries</label>
            <div className="tag-picker">
              {INDUSTRIES.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleArray(industries, i, setIndustries)}
                  className={`tag-picker__btn ${industries.includes(i) ? 'tag-picker__btn--active' : ''}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">สิ่งที่ให้ได้</label>
            <div className="tag-picker">
              {CAN_OFFER_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => toggleArray(canOffer, o.value, setCanOffer)}
                  className={`tag-picker__btn ${canOffer.includes(o.value) ? 'tag-picker__btn--active' : ''}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <Select
            label="ความพร้อมรับให้คำปรึกษา"
            value={availability}
            onChange={(v) => setAvailability(v as Availability)}
            options={Object.entries(AVAILABILITY_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <label className="flex items-start gap-2 rounded-lg bg-flow-bg p-3 text-sm text-ink-soft">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="mt-1 rounded" />
            <span>
              เผยแพร่โปรไฟล์สาธารณะ
              <span className="mt-0.5 block text-xs text-ink-soft/80">
                ถ้าไม่ติ๊ก โปรไฟล์จะถูกบันทึกไว้แต่จะไม่ปรากฏในหน้าค้นหา
              </span>
            </span>
          </label>

          {mutation.isError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              บันทึกไม่สำเร็จ — {(mutation.error as Error).message}
            </p>
          )}

          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? 'กำลังบันทึก...' : 'สร้างโปรไฟล์'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
