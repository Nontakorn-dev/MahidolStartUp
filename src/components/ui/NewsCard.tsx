import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { formatDate, excerpt, tiptapToText } from '../../lib/utils'
import { ImagePlaceholder } from '../cms/MediaPicker'
import type { Post } from '../../types'

const CATEGORY_LABELS: Record<string, string> = {
  announcement: 'ประกาศ',
  workshop: 'เวิร์กช็อป',
  competition: 'การแข่งขัน',
  'success-story': 'Success Story',
  general: 'ข่าวสาร',
  news: 'ข่าวสาร',
  event: 'กิจกรรม',
}

function categoryLabel(category: string | null) {
  if (!category) return 'ข่าวสาร'
  return CATEGORY_LABELS[category] ?? category
}

interface NewsCardProps {
  href: string
  title: string
  imageUrl?: string | null
  date?: string
  category?: string | null
  excerptText?: string
  variant?: 'default' | 'featured' | 'compact'
  className?: string
}

export function NewsCard({
  href,
  title,
  imageUrl,
  date,
  category,
  excerptText,
  variant = 'default',
  className,
}: NewsCardProps) {
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <Link to={href} className={cn('news-card group block no-underline', className)}>
      <article
        className={cn(
          'news-card__inner',
          isFeatured && 'news-card__inner--featured',
          isCompact && 'news-card__inner--compact',
        )}
      >
        <div
          className={cn(
            'news-card__media',
            isFeatured && 'news-card__media--featured',
            isCompact && 'news-card__media--compact',
          )}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" className="news-card__img" loading="lazy" />
          ) : (
            <ImagePlaceholder className="h-full w-full" />
          )}
          {category && (
            <span className="news-card__tag">{categoryLabel(category)}</span>
          )}
        </div>

        <div className={cn('news-card__body', isFeatured && 'news-card__body--featured')}>
          {date && (
            <div className="news-card__date">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <time>{date}</time>
            </div>
          )}

          <h3
            className={cn(
              'news-card__title',
              isFeatured && 'news-card__title--featured',
              isCompact && 'news-card__title--compact',
            )}
          >
            {title}
          </h3>

          {excerptText && !isCompact && (
            <p className={cn('news-card__excerpt', isFeatured && 'news-card__excerpt--featured')}>
              {excerptText}
            </p>
          )}

          <span className="news-card__cta">
            อ่านเพิ่มเติม <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  )
}

export function NewsCardFromPost({
  post,
  variant = 'default',
  className,
}: {
  post: Post
  variant?: 'default' | 'featured' | 'compact'
  className?: string
}) {
  return (
    <NewsCard
      href={`/news/${post.slug}`}
      title={post.title}
      imageUrl={post.cover_image_url}
      category={post.category}
      date={post.published_at ? formatDate(post.published_at) : undefined}
      excerptText={excerpt(tiptapToText(post.content), variant === 'featured' ? 160 : 100)}
      variant={variant}
      className={className}
    />
  )
}

export function NewsCardGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <div className="news-grid news-grid--uniform">
      {posts.map((post) => (
        <NewsCardFromPost key={post.id} post={post} />
      ))}
    </div>
  )
}
