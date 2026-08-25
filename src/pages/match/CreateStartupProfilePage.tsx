import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { INDUSTRIES, LOOKING_FOR_OPTIONS, STAGE_LABELS } from '../../lib/constants'
import type { StartupStage } from '../../types'

export function CreateStartupProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [stage, setStage] = useState<StartupStage>('idea')
  const [industry, setIndustry] = useState<string[]>([])
  const [lookingFor, setLookingFor] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(true)

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase.from('startup_profiles').insert({
        owner_id: user.id,
        name,
        tagline,
        description,
        stage,
        industry,
        looking_for: lookingFor,
        is_public: isPublic,
      }).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => navigate(`/match/startup/${data.id}`),
  })

  const toggleArray = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-2xl text-ink">สร้าง Startup Profile</h1>
        <p className="mb-6 mt-2 text-sm leading-relaxed text-ink-soft">
          โปรไฟล์นี้จะแสดงในหน้าค้นหา Partner ให้สมาชิกคนอื่นส่งคำขอเชื่อมต่อมาหาคุณได้
        </p>
        <Card className="space-y-4">
          <Input label="ชื่อ Startup *" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Tagline" placeholder="อธิบายสั้น ๆ ในหนึ่งประโยค" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          <Textarea label="รายละเอียด" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Select
            label="Stage"
            value={stage}
            onChange={(v) => setStage(v as StartupStage)}
            options={Object.entries(STAGE_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Industry</label>
            <div className="tag-picker">
              {INDUSTRIES.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleArray(industry, i, setIndustry)}
                  className={`tag-picker__btn ${industry.includes(i) ? 'tag-picker__btn--active' : ''}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">กำลังมองหา</label>
            <div className="tag-picker">
              {LOOKING_FOR_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => toggleArray(lookingFor, o.value, setLookingFor)}
                  className={`tag-picker__btn ${lookingFor.includes(o.value) ? 'tag-picker__btn--active' : ''}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

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

          <Button
            onClick={() => mutation.mutate()}
            disabled={!name.trim() || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? 'กำลังบันทึก...' : 'สร้างโปรไฟล์'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
