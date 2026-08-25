import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../lib/utils'
import { POST_STATUS_LABELS, postCategoryLabel } from '../../lib/labels'
import type { Post } from '../../types'

export function PostsAdminPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      return (data ?? []) as Post[]
    },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">จัดการข่าวสาร</h1>
        <Link to="/admin/posts/new">
          <Button size="sm"><Plus className="h-4 w-4" /> สร้างใหม่</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" /></div>
      ) : posts.length === 0 ? (
        <Card className="py-12 text-center text-ink-soft">ยังไม่มีข่าวสาร — สร้างอันแรกเลย!</Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-wrap items-center justify-between gap-3 !p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-ink">{post.title}</h3>
                  <Badge variant={post.status === 'published' ? 'green' : 'default'}>
                    {POST_STATUS_LABELS[post.status] ?? post.status}
                  </Badge>
                  {post.category && <Badge>{postCategoryLabel(post.category)}</Badge>}
                </div>
                <p className="mt-1 text-xs text-ink-soft/70">
                  {post.published_at
                    ? `เผยแพร่ ${formatDate(post.published_at)}`
                    : `สร้าง ${formatDate(post.created_at)}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {post.status === 'published' && (
                  <Link to={`/news/${post.slug}`} target="_blank" className="px-2 text-sm text-ted-sky no-underline hover:underline">
                    ดูหน้าจริง ↗
                  </Link>
                )}
                <Link to={`/admin/posts/${post.id}/edit`}>
                  <Button variant="ghost" size="sm" aria-label={`แก้ไข ${post.title}`}><Pencil className="h-4 w-4" /></Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
