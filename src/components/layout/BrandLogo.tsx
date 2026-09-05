import { Link } from 'react-router-dom'
import { SITE_LOGO } from '../../lib/constants'
import { cn } from '../../lib/utils'

type BrandLogoSize = 'nav' | 'footer' | 'auth' | 'compact'

const SIZE_CLASSES: Record<BrandLogoSize, string> = {
  nav: 'h-11 w-auto max-w-[min(56vw,200px)] sm:h-14 sm:max-w-[280px] md:h-16 md:max-w-[340px] lg:h-[72px] lg:max-w-[400px]',
  footer: 'h-10 w-auto max-w-[210px] sm:h-11 sm:max-w-[240px]',
  auth: 'h-14 w-auto max-w-[280px] sm:h-16 sm:max-w-[320px]',
  compact: 'h-9 w-auto max-w-[180px] sm:h-10 sm:max-w-[200px]',
}

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  size?: BrandLogoSize
  linkToHome?: boolean
}

export function BrandLogo({
  className,
  imageClassName,
  size = 'nav',
  linkToHome = false,
}: BrandLogoProps) {
  const image = (
    <img
      src={SITE_LOGO}
      alt="Mahidol Startup Club"
      className={cn('object-contain object-left', SIZE_CLASSES[size], imageClassName)}
      decoding="async"
    />
  )

  if (!linkToHome) {
    return <div className={cn('inline-flex shrink-0 items-center', className)}>{image}</div>
  }

  return (
    <Link to="/" className={cn('inline-flex shrink-0 items-center no-underline', className)}>
      {image}
    </Link>
  )
}
