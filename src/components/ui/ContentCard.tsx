import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { formatDate, excerpt, tiptapToText } from '../../lib/utils'
import { ImagePlaceholder } from '../cms/MediaPicker'
import { ArrowRight } from 'lucide-react'

interface ContentCardProps {
  href: string
  title: string
  subtitle?: string
  tag?: string
  imageUrl?: string | null
  excerptText?: string
  className?: string
}

export function ContentCard({
  href,
  title,
  subtitle,
  tag,
  imageUrl,
  excerptText,
  className,
}: ContentCardProps) {
  return (
    <Link to={href} className={cn('group block no-underline', className)}>
      <article className="card-elevated h-full overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-ted-light">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="h-full w-full" />
          )}
          {tag && (
            <span className="absolute left-3 top-3 rounded-md bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-gold backdrop-blur-sm">
              {tag}
            </span>
          )}
        </div>
        <div className="p-5 md:p-6">
          {subtitle && (
            <time className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">{subtitle}</time>
          )}
          <h3 className="mt-1.5 font-heading text-base leading-snug text-ink transition-colors group-hover:text-ink-soft md:text-lg">
            {title}
          </h3>
          {excerptText && (
            <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{excerptText}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink opacity-0 transition-opacity group-hover:opacity-100">
            อ่านเพิ่มเติม <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </article>
    </Link>
  )
}

export function ContentCardFromPost({ post }: { post: { slug: string; title: string; category: string | null; cover_image_url: string | null; content: Record<string, unknown>; published_at: string | null } }) {
  return (
    <ContentCard
      href={`/posts/${post.slug}`}
      title={post.title}
      tag={post.category ?? undefined}
      imageUrl={post.cover_image_url}
      subtitle={post.published_at ? formatDate(post.published_at) : undefined}
      excerptText={excerpt(tiptapToText(post.content), 100)}
    />
  )
}

export function ContentCardFromEvent({ event }: { event: { slug: string; title: string; cover_image_url: string | null; start_at: string; location: string | null } }) {
  return (
    <ContentCard
      href={`/events/${event.slug}`}
      title={event.title}
      tag="กิจกรรม"
      imageUrl={event.cover_image_url}
      subtitle={formatDate(event.start_at)}
      excerptText={event.location ?? undefined}
    />
  )
}
