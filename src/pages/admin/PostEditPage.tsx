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
import { POST_CATEGORIES } from '../../lib/constants'
import type { PostStatus } from '../../types'

export function PostEditPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new' || !id
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState<Record<string, unknown>>({})
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<PostStatus>('draft')

  const { data: existing } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: async () => {
      const { data } = await supabase.from('posts').select('*').eq('id', id!).single()
      return data
    },
    enabled: !isNew && !!id,
  })

  useEffect(() => {
    if (existing) {
      setTitle(existing.title)
      setSlug(existing.slug)
      setContent(existing.content || {})
      setCoverImage(existing.cover_image_url)
      setCategory(existing.category || '')
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
        content,
        cover_image_url: coverImage,
        category: category || null,
        status,
        author_id: user.id,
        published_at: status === 'published' ? new Date().toISOString() : null,
      }

      if (isNew) {
        const { error } = await supabase.from('posts').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('posts').update(payload).eq('id', id!)
        if (error) throw error
      }
    },
    onSuccess: () => navigate('/admin/posts'),
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-mu-navy">{isNew ? 'สร้างข่าวสาร' : 'แก้ไขข่าวสาร'}</h1>
      <Card className="space-y-4">
        <Input label="หัวข้อ *" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Slug (URL)" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <MediaPicker label="รูปปก" value={coverImage} onChange={setCoverImage} />
        <Select
          label="หมวดหมู่"
          value={category}
          onChange={setCategory}
          placeholder="เลือกหมวดหมู่"
          options={POST_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-mu-navy">เนื้อหา</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
        <Select
          label="สถานะ"
          value={status}
          onChange={(v) => setStatus(v as PostStatus)}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
        <div className="flex gap-2">
          <Button onClick={() => saveMutation.mutate()} disabled={!title || saveMutation.isPending}>
            {saveMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/admin/posts')}>ยกเลิก</Button>
        </div>
      </Card>
    </div>
  )
}
