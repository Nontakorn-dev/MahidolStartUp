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
import { INDUSTRIES, LOOKING_FOR_OPTIONS } from '../../lib/constants'
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
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-mu-navy">สร้าง Startup Profile</h1>
      <Card className="space-y-4">
        <Input label="ชื่อ Startup *" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Tagline" placeholder="อธิบายสั้น ๆ ในหนึ่งประโยค" value={tagline} onChange={(e) => setTagline(e.target.value)} />
        <Textarea label="รายละเอียด" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Select
          label="Stage"
          value={stage}
          onChange={(v) => setStage(v as StartupStage)}
          options={[
            { value: 'idea', label: 'ไอเดีย' },
            { value: 'mvp', label: 'MVP' },
            { value: 'early_revenue', label: 'มีรายได้เริ่มต้น' },
            { value: 'growth', label: 'Growth' },
          ]}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-mu-navy">Industry</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleArray(industry, i, setIndustry)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  industry.includes(i) ? 'bg-mu-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-mu-navy">กำลังมองหา</label>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => toggleArray(lookingFor, o.value, setLookingFor)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  lookingFor.includes(o.value) ? 'bg-mu-gold text-mu-navy' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="rounded" />
          เผยแพร่โปรไฟล์สาธารณะ
        </label>

        <Button
          onClick={() => mutation.mutate()}
          disabled={!name || mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? 'กำลังบันทึก...' : 'สร้างโปรไฟล์'}
        </Button>
      </Card>
    </div>
  )
}
