import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useTagOptions, tagLabel } from '../../lib/msc-tags'
import { SectionHeader } from '../ui/SectionHeader'
import { CategoryFilterBar } from '../ui/CategoryFilterBar'
import { ListingCard, ListingCardGrid, ListingEmptyState } from '../ui/ListingCard'
import { CardGridSkeleton } from '../ui/Skeleton'
import { excerpt, tiptapToText } from '../../lib/utils'
import type { Post } from '../../types'
import type { StartupIntake } from '../../types/msc-connect'
import { STAGE_LABELS } from '../../types/msc-connect'

interface FeaturedStartupsSectionProps {
  title?: string
  description?: string
  actionHref?: string
  limit?: number
}

export function FeaturedStartupsSection({
  title = 'คนที่กำลังมองหาทีมอยู่ตอนนี้',
  description = 'หาเพื่อนร่วมทีม เมนเทอร์ หรือพาร์ทเนอร์ แล้วเริ่มสร้างด้วยกัน',
  actionHref,
  limit = 6,
}: FeaturedStartupsSectionProps) {
  const { data: tags = [] } = useTagOptions()
  const { data: industryTags = [] } = useTagOptions('industry')
  const [filter, setFilter] = useState('')

  const { data: startups = [], isLoading: loadingStartups } = useQuery({
    queryKey: ['featured-startups-public', limit],
    queryFn: async () => {
      const { data } = await supabase
        .from('startups')
        // ไม่ดึง contact_email / contact_line — เป็นข้อมูลติดต่อที่ห้ามขึ้นหน้า public
        .select('id, startup_name, one_line_pitch, industry_tags, stage, need_tags')
        .eq('consent_public_directory', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit)
      return (data ?? []) as StartupIntake[]
    },
  })

  const { data: featuredPosts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['featured-startup-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .in('category', ['success-story', 'featured_startup'])
        .order('published_at', { ascending: false })
        .limit(limit)
      return (data ?? []) as Post[]
    },
    enabled: startups.length === 0,
  })

  const categories = useMemo(
    () => industryTags.map((t) => ({ key: t.tag_key, label: t.label_th })),
    [industryTags],
  )

  const filteredStartups = useMemo(() => {
    if (!filter) return startups
    return startups.filter((s) => s.industry_tags.includes(filter))
  }, [startups, filter])

  const showPosts = startups.length === 0 && featuredPosts.length > 0

  const filteredPosts = useMemo(() => {
    if (!filter || !showPosts) return featuredPosts
    return featuredPosts.filter((p) => p.tags?.includes(filter) || p.category === filter)
  }, [featuredPosts, filter, showPosts])

  const items = showPosts ? filteredPosts : filteredStartups
  const isEmpty = items.length === 0
  const isLoading = loadingStartups || (startups.length === 0 && loadingPosts)

  return (
    <section className="section-pad border-y border-line bg-ted-mist/50" id="featured">
      <div className="wrap">
        <SectionHeader
          eyebrow="MSC Connect"
          title={title}
          description={description}
          actionHref={actionHref}
          actionLabel="ดูทั้งหมด"
        />

        {categories.length > 0 && (
          <CategoryFilterBar
            categories={categories}
            active={filter}
            onChange={setFilter}
          />
        )}

        {isLoading ? (
          <CardGridSkeleton count={3} />
        ) : isEmpty ? (
          <ListingEmptyState
            message={
              filter
                ? 'ยังไม่มีทีมในหมวดนี้ — ลองเลือกหมวดอื่นดู'
                : 'ทีมกำลังรวบรวมโปรไฟล์ Startup ชุดแรก — เร็ว ๆ นี้'
            }
          />
        ) : (
          <ListingCardGrid>
            {showPosts
              ? filteredPosts.map((post) => (
                  <ListingCard
                    key={post.id}
                    href={`/news/${post.slug}`}
                    title={post.title}
                    description={excerpt(tiptapToText(post.content), 100)}
                    imageUrl={post.cover_image_url}
                    categoryTag="Startup แนะนำ"
                    chips={post.tags?.slice(0, 2) ?? []}
                  />
                ))
              : filteredStartups.map((s) => (
                  <ListingCard
                    key={s.id}
                    href={`/match/startup/${s.id}`}
                    title={s.startup_name}
                    description={s.one_line_pitch}
                    categoryTag={tagLabel(tags, s.industry_tags[0] ?? '')}
                    categoryKey={s.industry_tags[0]}
                    statusBadge={{ label: 'เปิดรับ Partner', variant: 'open' }}
                    chips={[
                      STAGE_LABELS[s.stage],
                      ...s.need_tags.slice(0, 1).map((t) => tagLabel(tags, t)),
                    ]}
                  />
                ))}
          </ListingCardGrid>
        )}
      </div>
    </section>
  )
}
