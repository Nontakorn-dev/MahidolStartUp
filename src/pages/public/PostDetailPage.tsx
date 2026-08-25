import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, UserRound } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { RichTextContent } from '../../components/cms/RichTextEditor'
import { NewsCardFromPost } from '../../components/ui/NewsCard'
import { BackLink } from '../../components/ui/BackLink'
import { ArticleSkeleton } from '../../components/ui/Skeleton'
import { formatDate } from '../../lib/utils'
import { postCategoryLabel } from '../../lib/labels'
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
        .maybeSingle()
      return (data ?? null) as Post | null
    },
    enabled: !!slug,
  })

  const { data: related = [] } = useQuery({
    queryKey: ['related-posts', post?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .neq('id', post!.id)
        .order('published_at', { ascending: false })
        .limit(3)
      return (data ?? []) as Post[]
    },
    enabled: !!post,
  })

  if (isLoading) {
    return (
      <div className="wrap section-pad max-w-3xl">
        <ArticleSkeleton />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="wrap section-pad text-center">
        <h1 className="font-heading text-2xl text-ink">ไม่พบบทความนี้</h1>
        <p className="mt-2 text-ink-soft">บทความอาจถูกถอดออกหรือยังไม่เผยแพร่</p>
        <Link to="/news" className="btn-primary mt-6">ดูข่าวสารทั้งหมด</Link>
      </div>
    )
  }

  return (
    <div>
      <article className="wrap section-pad !pt-10 max-w-3xl">
        <BackLink to="/news">กลับไปหน้าข่าวสาร</BackLink>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5">
          <span className="rounded-md bg-gold-tint px-2.5 py-1 text-xs font-semibold leading-6 text-gold-deep">
            {postCategoryLabel(post.category)}
          </span>
          {post.published_at && (
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </span>
          )}
          {post.profiles?.full_name && (
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <UserRound className="h-4 w-4" aria-hidden />
              {post.profiles.full_name}
            </span>
          )}
        </div>

        <h1 className="mt-4 font-heading text-3xl leading-[1.3] text-ink md:text-4xl md:leading-[1.25]">{post.title}</h1>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt=""
            className="mt-8 w-full rounded-2xl border border-line object-cover"
          />
        )}

        <div className="prose mt-8 max-w-none text-[16px] leading-[1.85]">
          <RichTextContent content={post.content} />
        </div>

        {post.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-flow-bg px-3 py-1 text-xs text-ink-soft">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-ted-mist/40 py-12 md:py-16">
          <div className="wrap">
            <h2 className="mb-6 font-heading text-xl text-ink">ข่าวสารอื่น</h2>
            <div className="news-grid news-grid--uniform">
              {related.map((p) => (
                <NewsCardFromPost key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
