import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { RichTextContent } from '../../components/cms/RichTextEditor'
import { ImagePlaceholder } from '../../components/cms/MediaPicker'
import { formatDate } from '../../lib/utils'
import type { Post } from '../../types'

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles(full_name)')
        .eq('slug', slug!)
        .eq('status', 'published')
        .single()
      return data as Post
    },
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-500">ไม่พบบทความนี้</p>
        <Link to="/posts" className="mt-4 inline-block text-mu-gold hover:underline">กลับไปหน้าข่าวสาร</Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {post.cover_image_url ? (
        <img src={post.cover_image_url} alt="" className="mb-8 h-64 w-full rounded-2xl object-cover sm:h-80" />
      ) : (
        <ImagePlaceholder className="mb-8 h-64 w-full rounded-2xl sm:h-80" />
      )}

      <div className="flex items-center gap-2">
        {post.category && <Badge variant="gold">{post.category}</Badge>}
        {post.published_at && <span className="text-sm text-gray-400">{formatDate(post.published_at)}</span>}
      </div>

      <h1 className="mt-3 text-3xl font-bold text-mu-navy">{post.title}</h1>

      <Card className="mt-8">
        <RichTextContent content={post.content} />
      </Card>

      <Link to="/posts" className="mt-8 inline-block text-mu-gold hover:underline">← กลับไปหน้าข่าวสาร</Link>
    </article>
  )
}
