import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { RichTextEditor } from '../../components/cms/RichTextEditor'
import { MediaPicker } from '../../components/cms/MediaPicker'
import { slugify } from '../../lib/utils'
import type { EventStatus } from '../../types'

export function EventEditPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new' || !id
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState<Record<string, unknown>>({})
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [location, setLocation] = useState('')
  const [registrationUrl, setRegistrationUrl] = useState('')
  const [status, setStatus] = useState<EventStatus>('draft')

  const { data: existing } = useQuery({
    queryKey: ['admin-event', id],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('*').eq('id', id!).single()
      return data
    },
    enabled: !isNew && !!id,
  })

  useEffect(() => {
    if (existing) {
      setTitle(existing.title)
      setSlug(existing.slug)
      setDescription(existing.description || {})
      setCoverImage(existing.cover_image_url)
      setStartAt(existing.start_at?.slice(0, 16) || '')
      setEndAt(existing.end_at?.slice(0, 16) || '')
      setLocation(existing.location || '')
      setRegistrationUrl(existing.registration_url || '')
      setStatus(existing.status)
    }
  }, [existing])

  useEffect(() => {
    if (isNew && title) setSlug(slugify(title))
  }, [title, isNew])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const payload = {
        title,
        slug,
        description,
        cover_image_url: coverImage,
        start_at: new Date(startAt).toISOString(),
        end_at: endAt ? new Date(endAt).toISOString() : null,
        location: location || null,
        registration_url: registrationUrl || null,
        status,
        author_id: user.id,
      }

      if (isNew) {
        const { error } = await supabase.from('events').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('events').update(payload).eq('id', id!)
        if (error) throw error
      }
    },
    onSuccess: () => navigate('/admin/events'),
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-mu-navy">{isNew ? 'สร้างกิจกรรม' : 'แก้ไขกิจกรรม'}</h1>
      <Card className="space-y-4">
        <Input label="ชื่อกิจกรรม *" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Slug (URL)" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <MediaPicker label="รูปปก" value={coverImage} onChange={setCoverImage} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="วันเวลาเริ่ม *" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
          <Input label="วันเวลาสิ้นสุด" type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
        </div>
        <Input label="สถานที่" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Input label="ลิงก์ลงทะเบียน (ถ้ามี)" value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} />
        <div>
          <label className="mb-2 block text-sm font-medium text-mu-navy">รายละเอียด</label>
          <RichTextEditor content={description} onChange={setDescription} />
        </div>
        <Select
          label="สถานะ"
          value={status}
          onChange={(v) => setStatus(v as EventStatus)}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
        <div className="flex gap-2">
          <Button onClick={() => saveMutation.mutate()} disabled={!title || !startAt || saveMutation.isPending}>
            {saveMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/admin/events')}>ยกเลิก</Button>
        </div>
      </Card>
    </div>
  )
}
