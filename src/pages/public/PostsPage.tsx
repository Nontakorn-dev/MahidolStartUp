import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHero } from '../../components/ui/PageHero'
import { NewsCardFromPost } from '../../components/ui/NewsCard'
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

  const [featured, ...rest] = posts

  return (
    <div>
      <PageHero
        eyebrow="ข่าวสารประชาสัมพันธ์"
        title="ประกาศและข่าวสาร"
        description="อัปเดตล่าสุดจากทีม PR ของ Mahidol Startup Club — ข่าวสาร กิจกรรม และเรื่องราวความสำเร็จจากชมรม"
      />

      <div className="wrap section-pad !pt-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="card-elevated py-20 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-line" />
            <p className="text-ink-soft">ยังไม่มีข่าวสาร</p>
          </div>
        ) : (
          <div className="space-y-8">
            {featured && (
              <NewsCardFromPost post={featured} variant="featured" />
            )}
            {rest.length > 0 && (
              <div className="news-page-grid">
                {rest.map((post) => (
                  <NewsCardFromPost key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
