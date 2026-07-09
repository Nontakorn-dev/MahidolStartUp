import { Link } from 'react-router-dom'
import { SITE_LOGO } from '../../lib/constants'
import { cn } from '../../lib/utils'

type BrandLogoSize = 'nav' | 'footer' | 'auth' | 'compact'

const SIZE_CLASSES: Record<BrandLogoSize, string> = {
  nav: 'h-[60px] w-auto max-w-[min(72vw,340px)] sm:h-[72px] sm:max-w-[400px] md:h-[88px] md:max-w-[460px] lg:h-[96px] lg:max-w-[500px]',
  footer: 'h-14 w-auto max-w-[300px] sm:h-16 sm:max-w-[340px]',
  auth: 'h-16 w-auto max-w-[300px] sm:h-[72px] sm:max-w-[340px]',
  compact: 'h-10 w-auto max-w-[200px] sm:h-11',
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
