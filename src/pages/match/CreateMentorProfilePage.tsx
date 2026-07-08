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
    if (customExpertise && !expertise.includes(customExpertise)) {
      setExpertise([...expertise, customExpertise])
      setCustomExpertise('')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-mu-navy">สร้าง Mentor / Partner Profile</h1>
      <Card className="space-y-4">
        <Input label="ตำแหน่ง / Title" placeholder="เช่น Product Manager at ..." value={title} onChange={(e) => setTitle(e.target.value)} />

        <div>
          <label className="mb-2 block text-sm font-medium text-mu-navy">Expertise</label>
          <div className="flex gap-2">
            <Input placeholder="เพิ่ม expertise..." value={customExpertise} onChange={(e) => setCustomExpertise(e.target.value)} />
            <Button variant="outline" onClick={addExpertise}>เพิ่ม</Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {expertise.map((e) => (
              <button key={e} onClick={() => setExpertise(expertise.filter((x) => x !== e))} className="rounded-full bg-mu-navy px-3 py-1 text-xs text-white">
                {e} ×
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-mu-navy">Industries</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleArray(industries, i, setIndustries)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  industries.includes(i) ? 'bg-mu-navy text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-mu-navy">สิ่งที่ให้ได้</label>
          <div className="flex flex-wrap gap-2">
            {CAN_OFFER_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => toggleArray(canOffer, o.value, setCanOffer)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  canOffer.includes(o.value) ? 'bg-mu-gold text-mu-navy' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <Select
          label="Availability"
          value={availability}
          onChange={(v) => setAvailability(v as Availability)}
          options={[
            { value: 'open', label: 'เปิดรับ' },
            { value: 'limited', label: 'จำกัด' },
            { value: 'closed', label: 'ปิดรับชั่วคราว' },
          ]}
        />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="rounded" />
          เผยแพร่โปรไฟล์สาธารณะ
        </label>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? 'กำลังบันทึก...' : 'สร้างโปรไฟล์'}
        </Button>
      </Card>
    </div>
  )
}
