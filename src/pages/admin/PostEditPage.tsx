import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { RichTextEditor } from '../../components/cms/RichTextEditor'
import { MediaPicker } from '../../components/cms/MediaPicker'
import { slugify } from '../../lib/utils'
import { POST_CATEGORY_OPTIONS, POST_STATUS_LABELS } from '../../lib/labels'
import type { PostStatus } from '../../types'

export function PostEditPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new' || !id
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
      if (!slug.trim()) throw new Error('กรุณาระบุ Slug (URL)')

      /**
       * เก็บวันเผยแพร่เดิมไว้ — ถ้าเซ็ตเป็น now ทุกครั้งที่กดบันทึก
       * บทความเก่าที่แค่แก้คำผิดจะเด้งขึ้นเป็นข่าวล่าสุดและวันที่เพี้ยน
       */
      const publishedAt =
        status === 'published' ? existing?.published_at ?? new Date().toISOString() : null

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        cover_image_url: coverImage,
        category: category || null,
        status,
        author_id: user.id,
        published_at: publishedAt,
      }

      if (isNew) {
        const { error } = await supabase.from('posts').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('posts').update(payload).eq('id', id!)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      queryClient.invalidateQueries({ queryKey: ['posts-all'] })
      navigate('/admin/posts')
    },
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl text-ink">{isNew ? 'สร้างข่าวสาร' : 'แก้ไขข่าวสาร'}</h1>
        {!isNew && status === 'published' && slug && (
          <Link to={`/news/${slug}`} target="_blank" className="text-sm font-medium text-ted-sky no-underline hover:underline">
            ดูหน้าจริง ↗
          </Link>
        )}
      </div>
      <Card className="space-y-4">
        <Input label="หัวข้อ *" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <Input label="Slug (URL) *" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <p className="mt-1.5 font-mono text-xs text-ink-soft/80">/news/{slug || '...'}</p>
        </div>
        <MediaPicker label="รูปปก" value={coverImage} onChange={setCoverImage} />
        <Select
          label="หมวดหมู่"
          value={category}
          onChange={setCategory}
          placeholder="เลือกหมวดหมู่"
          options={POST_CATEGORY_OPTIONS}
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">เนื้อหา</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
        <Select
          label="สถานะ"
          value={status}
          onChange={(v) => setStatus(v as PostStatus)}
          options={Object.entries(POST_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
        />

        {saveMutation.isError && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            บันทึกไม่สำเร็จ — {(saveMutation.error as Error).message}
          </p>
        )}

        <div className="flex gap-2">
          <Button onClick={() => saveMutation.mutate()} disabled={!title.trim() || saveMutation.isPending}>
            {saveMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/admin/posts')}>ยกเลิก</Button>
        </div>
      </Card>
    </div>
  )
}
