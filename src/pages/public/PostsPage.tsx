import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PageHero } from '../../components/ui/PageHero'
import { NewsCardFromPost } from '../../components/ui/NewsCard'
import { CategoryFilterBar } from '../../components/ui/CategoryFilterBar'
import { CardGridSkeleton } from '../../components/ui/Skeleton'
import { postCategoryLabel } from '../../lib/labels'
import type { Post } from '../../types'

export function PostsPage() {
  const [category, setCategory] = useState('')

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

  // สร้างตัวกรองจากหมวดที่มีบทความจริงเท่านั้น เพื่อไม่ให้กดแล้วเจอหน้าว่าง
  const categories = useMemo(() => {
    const keys = [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[]
    return keys.map((key) => ({ key, label: postCategoryLabel(key) }))
  }, [posts])

  const filtered = useMemo(
    () => (category ? posts.filter((p) => p.category === category) : posts),
    [posts, category],
  )

  const [featured, ...rest] = filtered

  return (
    <div>
      <PageHero
        eyebrow="ข่าวสาร"
        title="ข่าวสารและประกาศ"
        description="อัปเดตจากชมรม ทั้งประกาศ สรุปกิจกรรมที่ผ่านมา และเรื่องราวของทีมที่ไปได้ไกล"
      />

      <div className="wrap section-pad !pt-12">
        {isLoading ? (
          <CardGridSkeleton count={3} />
        ) : posts.length === 0 ? (
          <div className="card-elevated py-20 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-line" />
            <p className="font-heading text-lg text-ink">ยังไม่มีข่าวสาร</p>
            <p className="mt-2 text-sm text-ink-soft">
              ทีม PR กำลังเตรียมเนื้อหาชุดแรก — ติดตามได้เร็ว ๆ นี้
            </p>
          </div>
        ) : (
          <>
            {categories.length > 1 && (
              <CategoryFilterBar categories={categories} active={category} onChange={setCategory} />
            )}

            {filtered.length === 0 ? (
              <div className="listing-empty">
                <p>ยังไม่มีบทความในหมวดนี้</p>
              </div>
            ) : (
              <div className="space-y-8">
                {featured && <NewsCardFromPost post={featured} variant="featured" />}
                {rest.length > 0 && (
                  <div className="news-page-grid">
                    {rest.map((post) => (
                      <NewsCardFromPost key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
