import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { ImagePlaceholder } from '../../components/cms/MediaPicker'
import { formatDate, tiptapToText, excerpt } from '../../lib/utils'
import type { Post } from '../../types'

export function PostsPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts-all'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      return (data ?? []) as Post[]
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-mu-navy">ข่าวสาร</h1>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-mu-gold border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="py-16 text-center text-gray-500">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p>ยังไม่มีข่าวสาร</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/posts/${post.slug}`}>
              <Card hover className="h-full overflow-hidden !p-0">
                {post.cover_image_url ? (
                  <img src={post.cover_image_url} alt="" className="h-44 w-full object-cover" />
                ) : (
                  <ImagePlaceholder className="h-44 w-full" />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    {post.category && <Badge variant="gold">{post.category}</Badge>}
                    {post.published_at && (
                      <span className="text-xs text-gray-400">{formatDate(post.published_at)}</span>
                    )}
                  </div>
                  <h3 className="mt-2 font-semibold text-mu-navy">{post.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {excerpt(tiptapToText(post.content))}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
