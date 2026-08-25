import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { AFFILIATION_LABELS } from '../../lib/constants'
import type { Affiliation } from '../../types'

export function ProfileSettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [affiliation, setAffiliation] = useState<Affiliation>('mu_student')
  const [faculty, setFaculty] = useState('')
  const [lineId, setLineId] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name)
      setBio(profile.bio || '')
      setAffiliation(profile.affiliation)
      setFaculty(profile.faculty || '')
      setLineId(profile.line_id || '')
      setLinkedinUrl(profile.linkedin_url || '')
    }
  }, [profile])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('profiles').update({
        full_name: fullName,
        bio,
        affiliation,
        faculty,
        line_id: lineId,
        linkedin_url: linkedinUrl,
      }).eq('id', user.id)
      if (error) throw error
    },
    onSuccess: async () => {
      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-heading text-2xl text-ink">ตั้งค่าโปรไฟล์</h1>

        <Card className="mb-6 space-y-4">
          <Input label="ชื่อ-นามสกุล" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <Select
            label="สังกัด"
            value={affiliation}
            onChange={(v) => setAffiliation(v as Affiliation)}
            options={Object.entries(AFFILIATION_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <Input label="คณะ/สาขา" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
          <Input
            label="Line ID"
            hint="จะแสดงให้อีกฝ่ายเห็นก็ต่อเมื่อตอบรับคำขอเชื่อมต่อกันแล้วเท่านั้น"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
          />
          <Input label="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {saved ? 'บันทึกแล้ว ✓' : mutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </Card>

        <Card>
          <h2 className="font-heading text-lg text-ink">โปรไฟล์สำหรับหาพาร์ทเนอร์</h2>
          <p className="mb-4 mt-1.5 text-sm leading-relaxed text-ink-soft">
            สร้างโปรไฟล์เพิ่มเพื่อให้คนอื่นค้นเจอคุณในหน้าค้นหา Partner
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/match/startup/new"><Button variant="outline" size="sm">สร้าง Startup Profile</Button></Link>
            <Link to="/match/mentor/new"><Button variant="outline" size="sm">สร้าง Mentor Profile</Button></Link>
            <Link to="/match/connections"><Button variant="ghost" size="sm">ดูการเชื่อมต่อ</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
